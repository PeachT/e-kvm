import UC from './unitConversion';
/**
 * 张拉模式
 *
 * @param {Number} data 0~4
 * @returns 返回模式
 */
function abModel(model) {
  const t = [['A1'], ['A1', 'A2'], ['B1'], ['B1', 'B2'], ['A1', 'A2', 'B1', 'B2']];
  return t[model];
}

/**
 * 总偏差率
 *
 * @param {any} d1 比较值
 * @param {any} d2 被比较值
 * @returns 偏差率%
 */
function deviation(ll, lz) {
  return (((lz - ll) / ll) * 100);
}
/**
 * 单顶长量计算
 *
 * @param {any} datas 位移值
 * @param {any} NS 回缩量
 * @param {any} LQ 工作长度
 * @returns 总伸长量
 */
function dLZ(datas, NS, LQ, ab) {
  // 总伸长量LZ=(LK+L1-2L0)-NS-LQ
  const LK = Number(UC.plc2mm(datas[datas.length - 1]));
  const L1 = Number(UC.plc2mm(datas[1], ab));
  const L0 = Number(UC.plc2mm(datas[0], ab));
  console.log('数据', ab, datas);
  return ((LK + L1) - (2 * L0)) - Number(NS) - Number(LQ);
}

const unity = {
  abModel(model) {
    return abModel(model);
  },
  /**
   * 张拉阶段
   *
   * @param {Number} n 阶段 3~5
   * @param {boolean} [exceed=false] 超张拉
   * @returns
   */
  stage(data, state = false) {
    const s = [['初张拉', '阶段一', '终张拉'], ['初张拉', '阶段一', '阶段二', '终张拉'], ['初张拉', '阶段一', '阶段二', '阶段三', '终张拉']];
    let sok = s[data.stage];
    if (data.two && data.state === 0 && state) {
      sok = ['初张拉', '阶段一', '阶段二'];
    } else if (data.exceed) {
      sok.push('超张拉');
    }
    return sok;
  },

  LZ(task, r = null) {
    const sensor = window.systemDB.getOne({ name: 'sensor' }); // 传感器
    const fixed = sensor.toFixed;
    const m = abModel(task.tensioningPattern);
    let recird = null;
    if (r === null) {
      recird = task.recird;
    } else {
      recird = r;
    }
    const lz = {
      A1: {
        mm: null,
        deviation: null,
      },
      B1: {
        mm: null,
        deviation: null,
      },
    };
    const dzl = {
      A: [0, 0],
      B: [0, 0],
    };
    m.forEach((item) => {
      const d = dLZ(recird[item].mm, task.task[item].NS, task.task[item].LQ, item);
      if (r) {
        lz[`${item}dmm`] = d.toFixed(fixed);
      }
      if (item === 'A1' || item === 'A2') {
        dzl.A.push(d);
      } else {
        dzl.B.push(d);
      }
    });
    lz.A1.mm = (dzl.A.reduce((i, d) => i + d)).toFixed(fixed);
    lz.B1.mm = (dzl.B.reduce((i, d) => i + d)).toFixed(fixed);
    if ('A1' in task.task) {
      lz.A1.deviation = deviation(task.task.A1.LL, lz.A1.mm).toFixed(fixed);
    }
    if ('B1' in task.task) {
      lz.B1.deviation = deviation(task.task.B1.LL, lz.B1.mm).toFixed(fixed);
    }
    return lz;
  },
  /**
 * 设备可用泵顶组
 *
 * @param {Arrar} data 0~4
 * @returns 返回模式
 */
  devicePattern(model) {
    const p = [];
    if (model.indexOf(4) > -1) {
      return ['A1', 'A2', 'B1', 'B2'];
    }
    if (model.indexOf(2) > -1) {
      p.push(...['A1', 'A2']);
    } else if (model.indexOf(1) > -1) {
      p.push('A1');
    }
    if (model.indexOf(4) > -1) {
      p.push(...['B1', 'B2']);
    } else if (model.indexOf(3) > -1) {
      p.push('B1');
    }
    return p;
  },
};

export default {
  ...unity,
};
