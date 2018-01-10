const unity = {
  /**
   * plc转压力（Mpa）
   *
   * @param {Number} data PLC值
   * @returns 返回压力（mpa）值
   */
  plc2mpa(data) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    return ((data * sensor.pressure) / sensor.pressurePLC).toFixed(sensor.toFixed);
  },
  /**
   * 压力（Mpa）转plc
   *
   * @param {Number} data 压力（mpa）值
   * @returns 返回plc值
   */
  mpa2plc(data) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    return Math.round((data * sensor.pressurePLC) / sensor.pressure);
  },
  /**
   * plc转位移（mm）
   *
   * @param {Object} data PLC值
   * @returns 返回位移（mm）值
   */
  plc2mm(data) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    return ((data * sensor.displacement) / sensor.displacementPLC).toFixed(sensor.toFixed);
  },
  /**
   * 位移(mm)转plc
   *
   * @param {Number} data 位移（mm）值
   * @returns 返回plc值
   */
  mm2plc(data) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    return Math.round((data * sensor.displacementPLC) / sensor.displacement);
  },
  /**
   * PLC压力值转百分比
   *
   * @param {Number} data PLC值
   * @returns 返回百分比
   */
  plc2percent(data) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    return (data / sensor.pressurePLC).toFixed(3);
  },
  /**
   * 百分比转PLC压力值
   *
   * @param {Number} data 百分比值
   * @returns 返回PLC压力值
   */
  percent2plc(data) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    return Math.round(sensor.pressurePLC * data);
  },
  /**
   * 百毫秒(100ms)转秒（s）
   *
   * @param {Number} data 百毫秒（100ms）值
   * @returns 返回秒（s）值
   */
  ms2s(data) {
    return Math.round(data / 10);
  },
  /**
   * 秒（s）转百毫秒(100ms)
   *
   * @param {Number} data 秒（s）值
   * @returns 返回100毫米（100s）值
   */
  s2ms(data) {
    return Math.round(data * 10);
  },
  /**
   * PLC值到KN
   *
   * @param {any} plcData PLC值
   * @param {any} deviceId 设备id
   * @param {any} name 顶名称
   * @returns 返回KN
   */
  plc2kn(plcData, deviceId, name) {
    const sensor = window.systemDB.getOne({ name: 'sensor' }); // 传感器
    const fixed = sensor.toFixed;
    const device = window.deviceDB.getOne({ id: deviceId }); // 设备
    const mpa = unity.plc2mpa(plcData);
    if (device.equation) {
      return ((mpa * device[name].a) + Number(device[name].b)).toFixed(fixed);
    }
    return ((mpa - Number(device[name].b)) / Number(device[name].a)).toFixed(fixed);
  },
  /**
   * 总伸长量计算
   *
   * @param {any} datas 位移值
   * @param {any} NS 回缩量
   * @param {any} LQ 工作长度
   * @returns 总伸长量
   */
  LZ(datas, NS, LQ) {
    // 总伸长量LZ=(LK+L1-2L0)-NS-LQ
    console.log(datas[datas.length - 1], datas[1], datas[0], NS, LQ);
    return unity.plc2mm(((datas[datas.length - 1] + datas[1]) - (2 * datas[0]))) - NS - LQ;
  },
  /**
   * 偏差率
   *
   * @param {any} d1 比较值
   * @param {any} d2 被比较值
   * @returns 偏差率%
   */
  deviation(d1, d2) {
    const sensor = window.systemDB.getOne({ name: 'sensor' }); // 传感器
    const fixed = sensor.toFixed;
    return (((d2 - d1) / d1) * 100).toFixed(fixed);
  },
};

export default {
  ...unity,
};
