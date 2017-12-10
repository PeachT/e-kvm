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
const userdb = store.state.global.userDb;

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
  try {
    const file = Read(filePath);
    const dbFile = new Loki();
    dbFile.loadJSON(file);
    return dbFile;
  } catch (error) {}
  return new Loki(filePath);
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
/**
 * 获取admin（管理数据）文档实例
 *
 * @returns 返回adminCollection
 */
function admin() {
  try {
    const $db = db('main');
    console.log($db, '123123');
    return $db.getCollection('admin');
  } catch (error) {
    return error;
  }
}
/**
 * 获取users（用户数据集合）文档实例
 *
 * @returns 返回usersCollection
 */
function users() {
  try {
    const $db = db('main');
    return $db.getCollection('users');
  } catch (error) {
    return error;
  }
}
/**
 * 获取userInfo（用户资料）文档实例
 *
 * @returns 返回userInfoCollection
 */
function userInfo() {
  try {
    console.log(userdb);
    const $db = db(`${userdb}.user`);
    return $db.getCollection('userInfo');
  } catch (error) {
    return error;
  }
}
/**
 * 获取tensioningData（张拉数据）文档实例
 *
 * @returns 返回tensioningDataCollection
 */
function tensioningData() {
  try {
    console.log(userdb);
    const $db = db(`${userdb}.user`);
    return $db.getCollection('tensioningData');
  } catch (error) {
    return error;
  }
}
/**
 * 获取curvesData（曲线）文档实例
 *
 * @returns 返回curvesDataCollection
 */
function curves() {
  try {
    console.log(userdb);
    const $db = db(`${userdb}.curves`);
    return $db.getCollection('curves');
  } catch (error) {
    return error;
  }
}
/**
 * 获取operators（操作员）文档实例
 *
 * @returns 返回operatorsCollection
 */
function operators() {
  try {
    const $db = db('other');
    return $db.getCollection('operators');
  } catch (error) {
    return error;
  }
}
/**
 * 获取steelStrands（钢绞线）文档实例
 *
 * @returns 返回steelStrandsCollection
 */
function steelStrands() {
  try {
    const $db = db('other');
    return $db.getCollection('steelStrands');
  } catch (error) {
    return error;
  }
}
/**
 * 获取device（设备）文档实例
 *
 * @returns 返回deviceCollection
 */
function device() {
  try {
    const $db = db('other');
    return $db.getCollection('device');
  } catch (error) {
    return error;
  }
}
/**
 * 获取girder（构件）文档实例
 *
 * @returns 返回girderCollection
 */
function girder() {
  try {
    const $db = db('other');
    return $db.getCollection('girder');
  } catch (error) {
    return error;
  }
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
        const usersCollection = $db.addCollection('users', { indices: ['userId'] });
        // 插入数据
        adminCollection.insert({
          name: admin.name,
          pwd: admin.pwd,
          permissions: 9,
        });
        const userFileName = `kvm.${new Date().getTime()}`;
        usersCollection.insert({ userId: userFileName });
        // 保存数据到数据库
        $db.save();
        // 创建用户资料数据库和文档
        $db = db(`${userFileName}.user`);
        $db.addCollection('userInfo');
        $db.addCollection('tensioningData', { indices: ['bridgeName', 'id'] });
        $db.save();
        // 创建用户曲线数据库和文档
        $db = db(`${userFileName}.curves`);
        $db.addCollection('curves', { indices: ['id'] });
        $db.save();
        // 创建其它数据库和文档
        $db = db('other');
        // 操作员文档
        $db.addCollection('operators', { indices: ['name'] });
        // 钢绞线文档
        $db.addCollection('steelStrands', { indices: ['specs'] });
        // $db.addCollection('concretes', { indices: ['name'] });
        // 设备文档
        $db.addCollection('device', { indices: ['name', 'id'] });
        $db.addCollection('girder', { indices: ['name'] });
        $db.save();
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  ifDb: ifDb(),
  // 获取指定数据库
  admin: admin(),
  users: users(),
  userInfo: userInfo(),
  tensioningData: tensioningData(),
  curves: curves(),
  operators: operators(),
  steelStrands: steelStrands(),
  device: device(),
  girder: girder(),
};

export default Db;
