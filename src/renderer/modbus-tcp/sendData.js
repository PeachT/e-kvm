// 出里发生命令数据
/**
 * 十六进制数据拼接
 *
 * @param {Number} dec 十进制数据
 * @param {Number} num 十六进制位数
 * @returns 返回拼接十六进制数据
 */
function Dec2Hex(dec, num) {
  return dec.toString(16).padStart(num, '00000000').toUpperCase();
}
function Hex4Byte(dec) {
  const hexStr = dec.toString(16).padStart(4, '0000').toUpperCase();
  console.log(dec, hexStr);
  let decSum = 0;
  for (let index = 0; index < hexStr.length; index += 2) {
    decSum += parseInt(`${hexStr[index]}${hexStr[index + 1]}`, 16);
  }
  return {
    decSum: decSum,
    hexStr: hexStr,
  };
}
function FC5(data) {
  const hexStr = data ? 'FF00' : '0000';
  let decSum = 0;
  for (let index = 0; index < hexStr.length; index += 2) {
    decSum += parseInt(`${hexStr[index]}${hexStr[index + 1]}`, 16);
  }
  return {
    decSum: decSum,
    hexStr: hexStr,
  };
}
function FC6_16(data) {
  const hexStr = Dec2Hex(data, 4);
  let decSum = 0;
  for (let index = 0; index < hexStr.length; index += 2) {
    decSum += parseInt(`${hexStr[index]}${hexStr[index + 1]}`, 16);
  }
  return {
    decSum: decSum,
    hexStr: hexStr,
  };
}
function FC15(data) {
  // :01 0F 0500 0003 01 7 E0
  let bitHex = ''; // 强制线圈十六进制字符串
  let bitDec = 0; // 强制线圈十进制
  let typeNumber = 0; // 数据需要的字节数
  const quantity = data.length; // 强制线圈数量
  for (const index = 0; index < data.length;) {
    const end = data.length > 8 ? 8 : data.length;
    const group = data.splice(0, end);
    const dec = parseInt(group.join(''), 2);
    console.log('FC15', data.length, group, dec);
    bitDec += dec;
    bitHex = `${bitHex}${Dec2Hex(dec, 2)}`;
    typeNumber += 1;
  }
  const hexStr = `${Dec2Hex(quantity, 4)}${Dec2Hex(typeNumber, 2)}${bitHex}`; // 拼接十六进制字符串
  const decSum = quantity + typeNumber + bitDec;// 计算LRC需要的值
  return {
    decSum: decSum,
    hexStr: hexStr,
  };
}
/**
 * 发送命令字符串
 *
 * @param {String} fc 命令码
 * @param {Object} address 操作数据首地址
 * @param {Object} data 命令数据
 * @returns 返回命令字符串
 */
function commandStr(deviceId, fc, address, data) {
  let datas = null;
  switch (fc) {
    case 1:
      datas = Hex4Byte(data);
      break;
    case 5:
      datas = FC5(data);
      break;
    case 6:
      datas = Hex4Byte(data);
      break;
    case 15:
      datas = FC15(data);
      break;
    default:
      break;
  }
  const ar = Hex4Byte(address);
  console.log(deviceId, fc, address, data, ar, datas.decSum);
  // LRC 码计算
  const LRC = (256 - ((deviceId + fc + ar.decSum + datas.decSum) % 256))
    .toString(16).toUpperCase();
  const commandCode = `:${Dec2Hex(deviceId, 2)}${Dec2Hex(fc, 2)}${ar.hexStr}${datas.hexStr}${LRC}\r\n`;
  console.log(commandCode);
  return commandCode;
}

const sendCommand = {
  sendCommand: commandStr,
};

export default sendCommand;
