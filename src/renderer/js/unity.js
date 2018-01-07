const unity = {
  /**
   * 复制对象
   *
   * @param {Object} data 复制的对象
   * @returns 返回新的对象
   */
  copyObj(data) {
    return JSON.parse(JSON.stringify(data));
  },
  /**
   * 生成实际戳ms
   *
   * @returns 返回ms实际戳
   */
  timeId() {
    return `${new Date().getTime()}`;
  },
  /**
   * 生成实际戳秒（s）
   *
   * @returns 返回秒（s）实际戳
   */
  timeS() {
    return new Date().getTime() / 1000;
  },
  /**
   * input获取焦点时选择内容
   *
   * @param {DOM} e DOM实例
   */
  focusAllVal(e) {
    e.currentTarget.select();
  },
};

export default {
  ...unity,
};
