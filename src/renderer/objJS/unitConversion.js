function netage(data) {
  if (data > 32767) {
    return parseInt((0xFFFF ^ data) + 1, 10) * -1;
  }
  return data;
}
const unity = {
  /**
   * plc转压力（Mpa）
   *
   * @param {Number} data PLC值
   * @returns 返回压力（mpa）值
   */
  plc2mpa(data, ab, deviceId) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    if (ab) {
      if (data < -100 || data === null) {
        return '未连接传感器';
      }
      const device = window.deviceDB.getOne({ id: window.deviceId });
      const mpa = Number(((data * sensor.pressure) / sensor.pressurePLC));
      let correction = 0;
      const s = parseInt(mpa / 5);
      if (s >= 0) {
        correction = device[ab].pressureCorrection[s];
      }
      return (mpa * Number(correction)).toFixed(sensor.toFixed);
    }
    return ((data * sensor.pressure) / sensor.pressurePLC).toFixed(sensor.toFixed);
  },
  /**
   * 压力（Mpa）转plc
   *
   * @param {Number} data 压力（mpa）值
   * @returns 返回plc值
   */
  mpa2plc(mpa, ab) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    const device = window.deviceDB.getOne({ id: window.deviceId });
    let correction = 0;
    const s = parseInt(mpa / 5);
    if (s >= 0) {
      correction = device[ab].pressureCorrection[s];
    }
    const nmpa = mpa / correction;
    return Math.round((nmpa * sensor.pressurePLC) / sensor.pressure);
  },
  /**
   * plc转位移（mm）
   *
   * @param {Object} data PLC值
   * @returns 返回位移（mm）值
   */
  plc2mm(data, ab, deviceId) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    if (ab) {
      if (data < -100 || data === null) {
        return '未连接传感器';
      }
      const device = window.deviceDB.getOne({ id: window.deviceId });
      const mm = Number(((data * sensor.displacement) / sensor.displacementPLC));
      let correction = 0;
      const s = parseInt(mm / 40);
      if (s >= 0) {
        correction = device[ab].displacementCorrection[s];
      }
      return (mm * correction).toFixed(sensor.toFixed);
    }
    return ((data * sensor.displacement) / sensor.displacementPLC).toFixed(sensor.toFixed);
  },
  /**
   * 位移(mm)转plc
   *
   * @param {Number} data 位移（mm）值
   * @returns 返回plc值
   */
  mm2plc(mm) {
    const sensor = window.systemDB.getOne({ name: 'sensor' });
    const device = window.deviceDB.getOne({ id: window.deviceId });
    const s = parseInt(mm / 40);
    if (s >= 0) {
      correction = device[ab].displacementCorrection[s];
    }
    const nmm = mm / correction;
    return Math.round((nmm * sensor.displacementPLC) / sensor.displacement);
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
   * @param {any} name 顶名称
   * @returns 返回KN
   */
  plc2kn(plcData, name) {
    const sensor = window.systemDB.getOne({ name: 'sensor' }); // 传感器
    const fixed = sensor.toFixed;
    const device = window.deviceDB.getOne({ id: window.deviceId }); // 设备
    const mpa = unity.plc2mpa(plcData);
    if (device.equation) {
      return ((mpa * device[name].a) + Number(device[name].b)).toFixed(fixed);
    }
    return ((mpa - Number(device[name].b)) / Number(device[name].a)).toFixed(fixed);
  },

};

export default {
  ...unity,
};
