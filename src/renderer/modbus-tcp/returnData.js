// 处理返回数据数据

// 处理获取的寄存器数据
function FC3_16(data) {
  const dataStr = data.slice(7, -4);
  const arrs = [];
  for (let index = 0; index < dataStr.length; index += 4) {
    arrs.push(parseInt(dataStr.slice(index, index + 4), 16));
  }
  return arrs;
}

function returnData16(data) {
  // : 01 03 0C 0064 0065 0066 0067 0068 0069 89
  const fc = parseInt(data.slice(3, 5), 16); // 操作命令
  switch (fc) {
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
