const Socket = require('net').Socket;
const sendCommand = require('./sendData').default.sendCommand;
const returnData = require('./returnData').default.returnData16;

class Modbus {
  constructor(path = '127.0.0.1', plc = 1) {
    const client = new Socket();
    client.setEncoding('utf8');
    client.setNoDelay(true);
    client.connect(502, path);
    client.setTimeout(3000);
    client.on('error', (error) => {
      this.toRenderer('lineError', '连接错误');
    });
    client.on('data', (data) => {
      const func = this.func.shift();
      if (this.func.length > 0) {
        this.write();
      }
      if (func && func.next) {
        func.next(data);
      }
    });
    client.on('connect', () => {
      this.GState = true;
      this.toRenderer('lineError', '连接成功');
      this.init();
    });
    client.on('timeout', () => {
      this.toRenderer('lineError', '连接超时');
    });
    this.client = client;
    this.huitiao = null;
    this.func = [];
  }
  init() {
    setTimeout(() => {
      new Promise((resolve, reject) => {
        let b1 = false;
        let b2 = false;
        this.readCoilStatue(2048, 1, (data) => {
          b1 = true;
          if (b1 && b2) {
            resolve();
          }
        });
        this.readRegisters16(4096, 4, (data) => {
          const d = returnData(data);
          this.toRenderer('realTime', d);
          b2 = true;
          if (b1 && b2) {
            resolve();
          }
        });
      }).then(() => {
        this.init();
      });
    }, 0);
  }
  toRenderer(func, data = null) {
    global.win.webContents.send(func, { id: this.pcl, data: data });
  }
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
    this.client.write(func[0].data);
  }
}

export default Modbus;
