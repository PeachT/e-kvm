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
  db,
  ifDb: ifDb(),
};

export default Db;
