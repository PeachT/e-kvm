import { app, BrowserWindow, ipcMain, dialog } from 'electron'; // eslint-disable-line
// const { dialog } = require('electron').remote;

ipcMain.on('relaunch', () => {
  console.log('重启');
  app.relaunch();
  app.quit();
});
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
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
    // 允许访问本地文件 测试图片可以显示
    webPreferences: {
      webSecurity: false,
    },
  });
  mainWindow.loadURL(winURL);
  BrowserWindow.addDevToolsExtension('C:/Users/peach/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/3.1.6_0');
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
