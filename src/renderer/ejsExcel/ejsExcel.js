import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
const ejsExcel = require('ejsexcel');

// 获得Excel模板的buffer对象
const tep = path.join(remote.app.getPath('userData'), 'ExcelTemplate/test.xlsx');
const exlBuf = fs.readFileSync(tep);

// 数据源
const data = [
  [{ dpt_des: '开发部', doc_dt: '2013-09-09', doc: 'a001' }],
  [
    { pt: 'pt1', des: 'des1', due_dt: '2013-08-07', des2: '2013-12-07' },
    { pt: 'pt1', des: 'des1', due_dt: '2013-09-14', des2: 'des21' },
  ],
];

// 用数据源(对象)data渲染Excel模板
function ex() {
  ejsExcel.renderExcel(exlBuf, data)
    .then((exlBuf2) => {
      fs.writeFileSync('C:/Users/peach/Desktop/test2.xlsx', exlBuf2);
      console.log('生成test2.xlsx');
    })
    .catch((err) => {
      console.error(err);
    });
}

const r = {
  ex: ex,
};

export default r;
