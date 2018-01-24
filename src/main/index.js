import { app, BrowserWindow, ipcMain, dialog } from 'electron'; // eslint-disable-line
import Modbus from './modbus/index';
// const { dialog } = require('electron').remote;
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
let plc1 = null;
let plc2 = null;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    // frame: false, // 隐藏菜单栏
    // 允许访问本地文件 测试图片可以显示
    webPreferences: {
      webSecurity: false,
    },
  });
  mainWindow.loadURL(winURL);
  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension('C:/Users/peach/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/4.0.1_0');
  }
  global.mainWindow = mainWindow;
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function runModbus() {
  if (!plc2) {
    plc2 = new Modbus('192.168.181.111');
  } else if (plc2.GState) {
    mainWindow.webContents.send('lineOK', { id: 2 });
  }
  if (!plc1) {
    plc1 = new Modbus('192.168.181.110');
  } else if (plc1.GState) {
    mainWindow.webContents.send('lineOK', { id: 1 });
  }
}
// 网络连接成功！连接设备
ipcMain.on('WIFIonline', () => {
  global.netLine = true;
  runModbus();
});
// 网络连接失败！断开设备
ipcMain.on('WIFIoffline', () => {
  global.netLine = false;
  plc1 = null;
  plc2 = null;
});
ipcMain.on('wPLC1', (event, data) => {
  plc1[data.func](data.address, data.data, (d) => {
    if ('callback' in data) {
      event.sender.send(data.callback, { data: data, callbackData: d });
    }
  });
});
ipcMain.on('wPLC2', (event, data) => {
  plc2[data.func](data.address, data.data, (d) => {
    if ('callback' in data) {
      event.sender.send(data.callback, { data: data, callbackData: d });
    }
  });
  // plc2.writeSingleCoil(1280, true);
});
ipcMain.on('rPLC1', (event, data) => {
  plc1[data.func](data.address, data.data, (d) => {
    if ('callback' in data) {
      event.sender.send(data.callback, { id: 1, callbackData: d });
    }
  });
});
ipcMain.on('rPLC2', (event, data) => {
  plc2[data.func](data.address, data.data, (d) => {
    if ('callback' in data) {
      event.sender.send(data.callback, { id: 2, callbackData: d });
    }
  });
  // plc2.writeSingleCoil(1280, true);
});
