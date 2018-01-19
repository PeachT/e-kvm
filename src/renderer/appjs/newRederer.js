import Modbus from './modbus/index';
const { ipcRenderer } = require('electron');
const { BrowserWindow } = require('electron').remote;
const path = require('path');

let win;
let tcp;

function newRederer() {
  const winId = BrowserWindow.getFocusedWindow().id;

  win = new BrowserWindow({
    height: 0,
    width: 0,
    show: false,
    frame: false,
  });

  win.loadURL(path.join('file:', __dirname, '../modbusRederer/plc1.vue'));

  win.on('did-finish-load', () => {
    tcp = new Modbus('192.168,181,110');
    if (tcp.Gstate) {

    }
  });
}
export {
  newRederer,
};
