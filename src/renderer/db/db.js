import Read from 'read-file-utf8';
import Loki from 'lokijs';
import path from 'path';
import { remote } from 'electron';

// const db = new Loki(path.join(remote.app.getPath('userData'), '/data.json'));
// try {
//   const dataFile = Read(path.join(remote.app.getPath('userData'), '/data.json'));
//   db.loadJSON(dataFile);
// } catch (error) {}
// console.log(path.join(remote.app.getPath('userData')), db);
// export function init() {
//   const db = new Loki(path.join(remote.app.getPath('userData'), '/admin.json'));
//   try {
//     const dataFile = Read(path.join(remote.app.getPath('userData'), '/admin.json'));
//     db.loadJSON(dataFile);
//   } catch (error) {}
//   return true;
// }

// export function add(a, b) {
//   return a + b;
// }
function db(fileName) {
  const filePath = path.join(remote.app.getPath('userData'), `${fileName}.db`);
  try {
    const file = Read(filePath);
    const dbFile = new Loki();
    dbFile.loadJSON(file);
    return dbFile;
  } catch (error) {}
  return new Loki(filePath);
}


const Db = {
  // 初始化数据库
  init() {
    const $db = db('admin');
    const admin = $db.getCollection('admin');
    if (admin) {
      return true;
    }
    return false;
  },
  // 获取指定数据库
  dbBase(dbName) {
    return db(dbName);
  },
};

export default Db;
