import fs from 'fs';
import Read from 'read-file-utf8';
import cmd from 'node-cmd';
import Loki from 'lokijs';
import path from 'path';
import { remote } from 'electron';

import Vue from 'vue';
import Vuex from 'vuex';

import store from '../store/index';

Vue.use(Vuex);
// 获取当前登录用户
const xuserdb = store.state.global.userDb;

/**
 * 获取数据库目录
 *
 * @returns 成功放回目录路径 失败返回false
 */
function baseDb() {
  const filePath = path.join(remote.app.getPath('userData'), 'base.json');
  try {
    const file = Read(filePath);
    if (!file) {
      return false;
    }
    const j = JSON.parse(file);
    return j.dbDirName;
  } catch (error) {
    console.log(error);
    return false;
  }
}
/**
 * 获取数据库
 *
 * @param {any} fileName 获取数据库名称
 * @returns 返回数据库实例
 */
function db(fileName) {
  const dbDirName = baseDb();
  if (!dbDirName) {
    return false;
  }
  const filePath = path.join(remote.app.getPath('userData'), `${dbDirName}/${fileName}.db`);
  const dbFile = new Loki(filePath);
  try {
    const file = Read(filePath);
    dbFile.loadJSON(file);
  } catch (error) {}
  return dbFile;
}
/**
 * 判断数据库是否存在
 *
 * @returns 返回Boolean true正确 false错误
 */
function ifDb() {
  const $db = db('main');
  if (!$db) {
    return false;
  }
  const admin = $db.getCollection('admin');
  if (admin) {
    return true;
  }
  return false;
}
function dbFunc(db, collection) {
  return {
    db: db,
    c: collection,
    getAll: collection.data,
    reverseGetAll: () => {
      return collection.chain().find()
        .sort((o1, o2) => {
          return o1.$loki > o2.$loki ? -1 : 1;
        })
        .data();
    },
    getOne: (query) => {
      return collection.findOne(query);
    },
    get: (query) => {
      return collection.find(query);
    },
    insert: (data, query) => {
      try {
        console.log('插入数据');
        if (collection.findOne(query)) {
          return true;
        }
        collection.insert(data);
        return db.save();
        // return $db.save();
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    update: (data) => {
      try {
        collection.update(data);
        // $db.save();
        db.save();
      } catch (error) {
        console.error(error);
      }
    },
    del: (query) => {
      try {
        collection.chain().find(query).remove();
        // $db.save();
        db.save();
      } catch (error) {
        console.error(error);
      }
    },
  };
}
function mainDB() {
  if (ifDb()) {
    const $db = db('main');
    const admin = $db.getCollection('admin');
    const users = $db.getCollection('users');
    return {
      admin: dbFunc($db, admin),
      users: dbFunc($db, users),
    };
  }
  return null;
}
function systemDB() {
  if (ifDb()) {
    const $db = db('system');
    const steelStrands = $db.getCollection('steelStrands');
    const device = $db.getCollection('device');
    const girder = $db.getCollection('girder');
    const system = $db.getCollection('system');
    const tpl = $db.getCollection('tpl');
    return {
      steelStrands: dbFunc($db, steelStrands),
      device: dbFunc($db, device),
      girder: dbFunc($db, girder),
      system: dbFunc($db, system),
      tpl: dbFunc($db, tpl),
    };
  }
  return null;
}
function nowDB() {
  if (ifDb()) {
    const $db = db('now');
    const now = $db.getCollection('now');
    return {
      now: dbFunc($db, now),
    };
  }
  return null;
}

const Db = {
  /**
   * 数据库初始化
   *
   * @param {Boolean} state true导入数据库 false创建新的数据库
   * @param {String} filePath 导入数据目录路径
   * @param {Object} admin 创建数据库管理员数据
   * @returns 返回true创建成功 false创建失败
   */
  init(state, filePath, admin) {
    console.log('111111111111111');
    try {
      const dir = `kvm.${new Date().getTime()}.db`;
      const dbDirName = path.join(remote.app.getPath('userData'), dir);
      // 创建base.json
      const basejson = path.join(remote.app.getPath('userData'), 'base.json');
      fs.writeFileSync(basejson, JSON.stringify({ dbDirName: dir }), (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('创建成功！-- base.json');
        }
      });
      // 创建目录
      fs.mkdirSync(dbDirName, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`创建成功！-- kvm.${new Date().getTime()}.db`);
        }
      });
      // 复制现有的数据库
      if (state) {
        cmd.run(`xcopy ${filePath} ${dbDirName} /d/e`);
      } else {
        // 创建主数据库和文档
        let $db = db('main');
        const adminCollection = $db.addCollection('admin', { indices: ['name'] });
        // 插入数据
        adminCollection.insert({
          name: admin.name,
          pwd: admin.pwd,
          permissions: 9,
        });
        // 添加视图
        const operator = adminCollection.addDynamicView('operator');
        operator.applyFind({ permissions: { $lt: 9 } }); // 查询数据
        operator.applySimpleSort('permissions', true); // permissions字段倒序排列
        $db.addCollection('users', { indices: ['id'] });
        // 保存数据到数据库
        $db.save();
        $db = db('system');
        // 钢绞线文档
        $db.addCollection('steelStrands', { indices: ['specs', 'id'] });
        // 设备文档
        $db.addCollection('device', { indices: ['name', 'id'] });
        // 构件文档
        $db.addCollection('girder', { indices: ['name', 'id'] });
        // 系统参数文档
        const sys = $db.addCollection('system');
        sys.insert({
          name: 'sensor',
          displacement: 255, // 位移传感器
          displacementPLC: 2000,
          pressure: 60, // 压力传感器
          pressurePLC: 2000,
          toFixed: 2,
        });
        sys.insert({
          name: 'control',
          deviationCeiling: 10, // 运行总位移上限
          deviationLower: 6, // 允许总位移下限
          balance: 5, // 平衡控制
        });
        // 模板文档
        $db.addCollection('tpl', { indices: ['name', 'id'] });
        $db.save();
        // 张拉实时数据库
        $db = db('now');
        // 实时数据文档
        $db.addCollection('now');
        $db.save();
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  db,
  ifDb: ifDb(),
  mainDB: mainDB(),
  systemDB: systemDB(),
  nowDB: nowDB(),
};

export default Db;
