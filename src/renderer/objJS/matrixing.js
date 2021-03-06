// 换算

function pressure(data, deviceId) {
  const sensor = window.systemDB.getOne({ name: 'sensor' }); // 传感器
  const p = sensor.pressurePLC / sensor.pressure; // 压力
  const d = sensor.displacementPLC / sensor.displacement; // 位移
  const fixed = sensor.toFixed;
  const device = window.deviceDB.getOne({ id: deviceId }); // 设备
  const t = [['A1'], ['A1', 'A2'], ['B1'], ['B1', 'B2'], ['A1', 'A2', 'B1', 'B2']];
  const tensioningPattern = data.tensioningPattern; // 泵顶组合
  const ts = t[tensioningPattern];
  const stages = data.task.stage; // 阶段
  stages[1] = stages[0] * 2;
  const tensioningKN = data.tensioningKN; // 应力
  const stagesKN = []; // 阶段应力Kn
  const stagesMpa = []; // 阶段应力Mpa
  const plcPressure = {}; // PLC应力
  ts.map((t) => {
    plcPressure[t] = [];
    stagesMpa[t] = [];
    return null;
  });
  stages.map((item) => {
    const stageKN = ((item / 100) * tensioningKN).toFixed(fixed);
    stagesKN.push(stageKN);
    ts.map((t) => {
      let stageMpa = 0;
      if (device.equation) {
        stageMpa = (stageKN - Number(device[t].b)) / device[t].a;
      } else {
        stageMpa = (stageKN * Number(device[t].a)) + Number(device[t].b);
      }
      stagesMpa[t].push(stageMpa.toFixed(fixed));
      // 获取校正系数转换位PLC值
      const s = parseInt(stageMpa / 5, 10);
      let correction = 0;
      if (s >= 0) {
        correction = device[t].pressureCorrection[s];
      }
      const nmpa = stageMpa / correction;
      plcPressure[t].push(Math.round(p * nmpa));
      return null;
    });
    return null;
  });
  return {
    stages: stages,
    stagesKN: stagesKN,
    stagesMpa: stagesMpa,
    plcPressure: plcPressure,
  };
}
function pressurePLC(data, deviceId) {
  // const state = data.state; // 二次张拉
  // let plcPressure = null; // PLC应力
  const plcPressure = pressure(data, deviceId);
  return plcPressure;
}

const matrixing = {
  pressure: pressure,
  pressurePLC: pressurePLC,
};

export default matrixing;
