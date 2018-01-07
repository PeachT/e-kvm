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
      return s[n].push('超张拉');
    }
    return s[n];
  },
};

export default {
  ...unity,
};
