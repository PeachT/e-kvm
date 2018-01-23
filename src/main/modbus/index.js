// import Vue from 'vue';
// import Vuex from 'vuex';
// import store from '../store/index';

const Socket = require('net').Socket;
const sendCommand = require('./sendData').default.sendCommand;
const returnData = require('./returnData').default.returnData16;
// Vue.use(Vuex);
class Modbus {
  constructor(path = '127.0.0.1', devId = 1, timeout = 3000, reconnectTimeout = 10000) {
    const client = new Socket();
    client.setEncoding('utf8');
    client.setNoDelay(true);
    client.connect(502, path);
    client.setTimeout(timeout);
    client.on('error', (error) => {
      // PLCError(`${this.path}连接错误`);
      this.toRenderer('lineError', '连接错误');
      if (global.netLine) {
        this.reconnect();
      }
      // if (global.netLine) {
      //   this.reconnect();
      // }
    });
    client.on('data', (data) => {
      const func = this.func.shift();
      // console.log('func数量：', this.func.length);
      if (this.func.length > 0) {
        this.write();
      }
      if (func && func.next) {
        func.next(data);
      }
    });
    client.on('connect', () => {
      this.reconnectState = false;
      this.toRenderer('lineError', '连接成功');
      this.toRenderer('lineOK');
      this.init();
      this.GState = true;
      clearTimeout(this.tReconnent);
    });
    client.on('timeout', () => {
      // PLCError(`${this.path}连接超时`);
      this.toRenderer('lineError', '连接超时');
      this.GState = false;
      this.reconnectState = true;
      // this.tReconnent = setTimeout(() => {
      //   if (global.netLine && !this.GState) {
      //     this.reconnect();
      //   }
      // }, 3000);
    });
    this.path = path;
    this.timeout = timeout;
    this.devId = devId;
    this.reconnectTimeout = reconnectTimeout;
    this.client = client;
    this.huitiao = null;
    this.func = [];
  }
  reconnect() {
    // PLCError(`${this.path}正在重新启动...`);
    this.toRenderer('lineError', '正在重新启动。。。');
    if (this.reconnectState || this.client.readyState !== 'open') {
      this.reconnectState = false;
    }
    this.client = null;
    this.constructor(this.path);
  }
  init() {
    setTimeout(() => {
      new Promise((resolve, reject) => {
        let b1 = false;
        let b2 = false;
        let b3 = false;
        let b4 = false;
        this.readCoilStatue(2048, 1, (data) => {
          b1 = true;
          if (b1 && b2 && b3 && b4) {
            resolve();
          }
        });
        // 位移压力值D0
        this.readRegisters16(4096, 4, (data) => {
          const d = returnData(data);
          this.toRenderer('realTime', d);
          b2 = true;
          if (b1 && b2 && b3 && b4) {
            resolve();
          }
        });
        // X输入 X0
        this.readInputStatue(1024, 24, (data) => {
          const d = returnData(data);
          this.toRenderer('realTimeX', d);
          b3 = true;
          if (b1 && b2 && b3 && b4) {
            resolve();
          }
        });
        // 报警参数 S500
        this.readCoilStatue(500, 40, (data) => {
          const d = returnData(data);
          this.toRenderer('realTimeS', d);
          b4 = true;
          if (b1 && b2 && b3 && b4) {
            resolve();
          }
        });
      }).then(() => {
        this.init();
      });
    }, 0);
  }
  // 发送到渲染进程事件
  toRenderer(func, data = null) {
    if (this.path === '192.168.181.110') {
      global.mainWindow.webContents.send(func, { id: 1, data: data });
    } else {
      global.mainWindow.webContents.send(func, { id: 2, data: data });
    }
  }
  // modbus发送数据拼接
  getCommand(fc, address, data) {
    return sendCommand(this.devId, fc, address, data);
  }
  /**
   * FC1 "Read Coil Status" // 读取线圈状态
   *
   * @param {Number} address 读取线圈起始地址
   * @param {Number} quantity 读取线圈数量
   * @param {Function} next 回调获取读取数据
   */
  readCoilStatue(address, quantity, next) {
    const commandCode = this.getCommand(1, address, quantity);
    this.write(commandCode, next);
  }
  // FC2 "Read Input Status" 读取输入状态
  readInputStatue(address, quantity, next) {
    const commandCode = this.getCommand(2, address, quantity);
    this.write(commandCode, next);
  }
  // FC3 "Read Holding Registers" 读取16位寄存器数据 : 01 03 0C 0064 0065 0066 0067 0068 0069 89
  readRegisters16(address, quantity, next) {
    const commandCode = this.getCommand(3, address, quantity);
    this.write(commandCode, next);
  }

  // FC5 "Force Single Coil" 强制单线圈
  writeSingleCoil(address, value, next) {
    const commandCode = this.getCommand(5, address, value);
    this.write(commandCode, next);
  }
  // FC6 "Preset Single Register" 预设单个寄存器
  writeSingleRegister16(address, data, next) {
    const commandCode = this.getCommand(6, address, data);
    this.write(commandCode, next);
  }

  // FC15 "Force Multiple Coil" 强制多个线圈
  writeMultipleCoil(address, bits, next) {
    const commandCode = this.getCommand(15, address, bits);
    this.write(commandCode, next);
  }
  // FC16 "Preset Multiple Registers" 预置多个16位寄存器
  // :0110 119A 0001 02 002F 12
  // :0110 100B 0001 02 02C2 0D
  // :0110 119A 0002 04 0028 0028 EE
  writeMultipleRegisters16(address, datas, next) {
    const commandCode = this.getCommand(16, address, datas);
    console.log('fc16', commandCode);
    this.write(commandCode, next);
  }

  write(data = null, next = null) {
    const func = this.func;
    if (data !== null && func.length > 0) {
      func.push({ data: data, next: next });
      return;
    }
    if (func.length === 0) {
      this.func.push({ data: data, next: next });
    }
    if (this.client.readyState === 'open') {
      this.client.write(func[0].data);
    } else {
      // this.reconnect();
    }
  }
}

export default Modbus;
