const Socket = require('net').Socket;
const sendCommand = require('./sendData').default.sendCommand;

class Modbus {
  constructor(path = '127.0.0.1', host = 502, devId = 1, timeout = 3000, autoReconnect = true, reconnectTimeout = 10000) {
    const client = new Socket();
    client.setEncoding('utf8');
    client.setNoDelay(false);
    client.connect(host, path, (data) => {
      console.log('789456', data);
    });
    client.setTimeout(timeout);
    client.on('error', (error) => {
      console.log('错误', error, client);
      if (this.client.readyState !== 'open') {
        if (autoReconnect) {
          this.reconnect();
        }
      }
      // window.setTimeout(() => {
      //   console.log('gggggggggggggggggggggggggggggg', this.client);
      //   if (this.client === null) {
      //     this.reconnect();
      //   }
      // }, reconnectTimeout);
    });
    client.on('data', (data) => {
      console.time('ss');
      const func = this.func.shift();
      console.log('func数量：', this.func.length);
      if (this.func.length > 0) {
        this.write();
      }
      if (func.next) {
        func.next(data);
      }
      console.timeEnd('ss');
    });
    client.on('connect', (data) => {
      console.log('连接成功！', data, client);
    });
    client.on('timeout', (data) => {
      console.log('连接超时！', data, client.readyState);
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
    console.log('123123123123123123', devId, this.devId);
  }
  reconnect() {
    console.log('正在重新启动...');
    this.client = null;
    this.constructor(this.path);
  }
  static Dec2Hex(dec, num) {
    return dec.toString(16).padStart(num, '00000000').toUpperCase();
  }
  static LRC(data) {
    console.log('777777777', this.devId);
    return 256 - (data.reduce((p, c) => {
      return (Number(p) + Number(c));
    }) % 256).toString(16).toUpperCase();
  }
  static Byte4(dec) {
    const hex = dec.toString(16).padStart(4, '0000');
    return {
      decSum: parseInt(`${hex[0]}${hex[1]}`, 16) + parseInt(`${hex[2]}${hex[3]}`, 16),
      hexStr: hex,
    };
  }
  static CoilData(bits) {
    const bitStr = bits.reduce((p, c) => `${p}${c ? '1' : '0'}`);// 拼接强制线圈数据（二进制）
    const bitDec = parseInt(bitStr, 2).toString(16); // 强制线圈数据
    const quantity = bitStr.length; // 强制线圈数量
    const typeNumber = (quantity / 4) + (quantity % 4 > 0 ? 1 : 0); // 数据需要的字节数
    const hexStr = `${Modbus.Dec2Hex(quantity, 4)}${Modbus.Dec2Hex(typeNumber, 2)}${Modbus.Dec2Hex(bitDec, 4)}`; // 拼接十六进制字符串
    const decSum = quantity + typeNumber + bitDec;// 计算LRC需要的值
    return {
      decSum: decSum,
      hexStr: hexStr,
    };
  }
  /**
   * 发送命令字符串
   *
   * @static
   * @param {String} command 命令码
   * @param {Object} address 操作数据首地址
   * @param {Object} data 命令数据
   * @returns 返回命令字符串
   * @memberof Modbus
   */
  static commandStr(command, address, data) {
    // LRC 码计算
    const LRC = ((256 - (this.devId + command + address.decSum + data.decSum)) % 256)
      .toString(16).toUpperCase();
    return `:${this.devId}01${address.hexStr}${data.hexStr}${LRC}\r\n`;
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
  // FC3 "Read Holding Registers" 读取保持寄存器
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
  // FC16 "Preset Multiple Registers" 预置多个寄存器
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
