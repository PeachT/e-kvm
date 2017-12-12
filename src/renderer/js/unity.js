const unity = {
  /**
   * 复制对象
   *
   * @param {Object} data 复制的对象
   * @returns 返回新的对象
   */
  copyObj(data) {
    return JSON.parse(JSON.stringify(data))
  },
  /**
   * input获取焦点时选择内容
   *
   * @param {DOM} e DOM实例
   */
  focusAllVal(e) {
    e.currentTarget.select()
  }
}

export default {
  ...unity
}
