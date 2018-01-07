import Vue from 'vue';
import Vuex from 'vuex';
import store from '../store/index';
const Socket = require('net').Socket;
const sendCommand = require('./sendData').default.sendCommand;
const returnData = require('./returnData').default.returnData16;

Vue.use(Vuex);
class Modbus {
  constructor(path = '127.0.0.1', host = 502, devId = 1, timeout = 3000, autoReconnect = true, reconnectTimeout = 10000) {
    const client = new Socket();
    client.setEncoding('utf8');
    client.setNoDelay(false);
    client.connect(host, path);
    client.setTimeout(timeout);
    client.on('error', (error) => {
      console.log('错误', error, this.client);
      this.PLCState(false);
      this.reconnect();
    });
    client.on('data', (data) => {
      const func = this.func.shift();
      console.log('func数量：', this.func.length);
      if (this.func.length > 0) {
        this.write();
      }
      if (func && func.next) {
        func.next(data);
      }
    });
    client.on('connect', () => {
      console.log('连接成功！', this.client);
      this.init();
    });
    client.on('timeout', () => {
      this.PLCState(false);
      console.log('连接超时！', this.client);
      this.reconnectState = true;
    });
    this.path = path;
    this.host = host;
    this.timeout = timeout;
    this.devId = devId;
    this.autoReconnect = autoReconnect;
    this.reconnectTimeout = reconnectTimeout;
    this.client = client;
    this.huitiao = null;
    this.func = [];
    this.reconnectState = false;
  }
  reconnect() {
    console.log('正在重新启动...', this.client);
    if (this.reconnectState || this.client.readyState !== 'open') {
      this.reconnectState = false;
      this.client = null;
      this.constructor(this.path);
    }
  }
  init() {
    new Promise((resolve, reject) => {
      let b1 = false;
      let b2 = false;
      this.readCoilStatue(2048, 1, (data) => {
        this.PLCState(true);
        b1 = true;
        if (b1 && b2) {
          resolve();
        }
      });
      this.readRegisters16(4096, 4, (data) => {
        const d = returnData(data);
        if (this.path === '192.168.181.101') {
          // store.commit('PLC1Data', d);
          store.dispatch('PLC1Data', d);
        } else {
          // store.commit('PLC2Data', d);
          store.dispatch('PLC2Data', d);
        }
        b2 = true;
        if (b1 && b2) {
          resolve();
        }
      });
    }).then(() => {
      this.init();
    });
  }
  PLCState(state) {
    if (this.path === '192.168.181.101') {
      store.commit('PLC1State', state);
    } else {
      store.commit('PLC2State', state);
    }
  }
  // init() {
  //   setTimeout(() => {
  //     this.readCoilStatue(2048, 1, (data) => {
  //       if (!store.state.global.PLC1State) {
  //         store.commit('PLC1State', true);
  //       }
  //       this.init();
  //     });
  //   }, 2000);
  // }
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
  writeMultipleRegisters16(address, datas, next) {
    const commandCode = this.getCommand(16, address, datas);
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
      this.reconnect();
    }
  }
}

export default Modbus;
