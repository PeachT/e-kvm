const unity = {
  /**
   * 张拉模式
   *
   * @param {Number} data 0~4
   * @returns 返回模式
   */
  abModel(model) {
    const t = [['A1'], ['A1', 'A2'], ['B1'], ['B1', 'B2'], ['A1', 'A2', 'B1', 'B2']];
    return t[model];
  },
  /**
   * 张拉阶段
   *
   * @param {Number} n 阶段 3~5
   * @param {boolean} [exceed=false] 超张拉
   * @returns
   */
  stage(n, exceed = false) {
    const s = [['初张拉', '阶段一', '终张拉'], ['初张拉', '阶段一', '阶段二', '终张拉'], ['初张拉', '阶段一', '阶段二', '阶段三', '终张拉']];
    if (exceed) {
      const r = s[n];
      r.push('超张拉');
      return r;
    }
    return s[n];
  },
  /**
   * 单顶长量计算
   *
   * @param {any} datas 位移值
   * @param {any} NS 回缩量
   * @param {any} LQ 工作长度
   * @returns 总伸长量
   */
  dLZ(datas, NS, LQ) {
    // 总伸长量LZ=(LK+L1-2L0)-NS-LQ
    console.log(datas[datas.length - 1], datas[1], datas[0], NS, LQ);
    return unity.plc2mm(((datas[datas.length - 1] + datas[1]) - (2 * datas[0]))) - NS - LQ;
  },
  LZ(task, recird, pattern) {
    const m = unity.abModel(pattern);
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
      if (item === 'A1' || 'A2') {
        dzl.A.push(unity.dLZ(recird[item].mm, task.NS, task.LQ));
      } else {
        dzl.B.push(unity.dLZ(recird[item].mm, task.NS, task.LQ));
      }
    });
    lz.A1.mm = dzl.A.reduce((i, d) => i + d);
    lz.B1.mm = dzl.B.reduce((i, d) => i + d);
    if ('A1' in task) {
      lz.A1.deviation = unity.deviation(task.A1.LL);
    }
    if ('B1' in task) {
      lz.B1.deviation = unity.deviation(task.B1.LL);
    }
  },
  /**
   * 总偏差率
   *
   * @param {any} d1 比较值
   * @param {any} d2 被比较值
   * @returns 偏差率%
   */
  deviation(ll, lz) {
    const sensor = window.systemDB.getOne({ name: 'sensor' }); // 传感器
    const fixed = sensor.toFixed;
    return (((lz - ll) / ll) * 100).toFixed(fixed);
  },
};

export default {
  ...unity,
};
