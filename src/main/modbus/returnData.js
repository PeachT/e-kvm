// 处理返回数据数据

function str2bit(s) {
  const r = s.padStart(8, '000000000');
  return r;
}
// 处理获取的寄存器数据
function FC3_16(data) {
  // : 01 03 0C 0064 0065 0066 0067 0068 0069 89
  const dataStr = data.slice(7, -4);
  const arrs = [];
  for (let index = 0; index < dataStr.length; index += 4) {
    arrs.push(parseInt(dataStr.slice(index, index + 4), 16));
  }
  return arrs;
}
function FC2(data) {
  // :01 02 01 00 FC
  const dataStr = data.slice(7, -4);
  console.log(dataStr);
  const arrs = [];
  for (let index = 0; index < dataStr.length; index += 2) {
    arrs.push(...(Array.from(str2bit(parseInt(dataStr.slice(index, index + 2), 16)
      .toString(2)))).reverse());
  }
  return arrs;
}

function returnData16(data) {
  // : 01 03 0C 0064 0065 0066 0067 0068 0069 89
  const fc = parseInt(data.slice(3, 5), 16); // 操作命令
  switch (fc) {
    case 2:
      return FC2(data);
    case 3:
      return FC3_16(data);
    default:
      return null;
  }
}

const returnData = {
  returnData16: returnData16,
};

export default returnData;
