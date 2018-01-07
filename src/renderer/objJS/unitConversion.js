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
};

export default {
  ...unity,
};
