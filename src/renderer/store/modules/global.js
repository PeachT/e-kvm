// 十六位又符合整数
function netage(data) {
  if (data > 32767) {
    return parseInt((0xFFFF ^ data) + 1, 10) * - 1;
  }
  return data;
}
function Sbit(data) {
  if (data > 0) {
    const z = '0000000000000000';
    const arr = Array.from(data.toString(2).padStart(16, z)).reverse();
    // const arr2 = Array.from(data[1].toString(2).padStart(16, z));
    // return [...arr1, ...arr2].reverse();
    return arr;
  }
  return 0;
}

const state = {
  path: '',
  showMenu: false,
  menuTitle: '',
  menu2Data: [], // {id: 'id', name: '菜单名称'}
  userDb: null,
  editState: false,
  addState: false,
  PLC1State: false,
  PLC2State: false,
  PLC1Data: {
    A1mpa: null,
    A1mm: null,
    B1mpa: null,
    B1mm: null,
  },
  PLC2Data: {
    A2mpa: null,
    A2mm: null,
    B2mpa: null,
    B2mm: null,
  },
  PLC1X: null,
  PLC2X: null,
  PLC1550: null,
  PLC2550: null,
  PLC1S: {
    A: 0,
    B: 0,
  },
  PLC2S: {
    A: 0,
    B: 0,
  },
  operator: null,
  user: null,
  device: null,
  systen: {
    WorkCeilingMM: 0,
  }
};

const mutations = {
  path(state, data) {
    state.path = data;
  },
  showMenu(state, data) {
    state.showMenu = data;
  },
  menuTitle(state, data) {
    state.menuTitle = data;
  },
  menu2Data(state, data) {
    state.menu2Data = data;
  },
  userDb(state, data) {
    state.userDb = data;
  },
  editState(state, data) {
    state.editState = data;
  },
  addState(state, data) {
    state.addState = data;
  },
  PLC1State(state, data) {
    state.PLC1State = data;
  },
  PLC2State(state, data) {
    state.PLC2State = data;
  },
  PLC1Data(state, data) {
    state.PLC1Data.A1mpa = netage(data[0]);
    state.PLC1Data.A1mm = netage(data[1]);
    state.PLC1Data.B1mpa = netage(data[2]);
    state.PLC1Data.B1mm = netage(data[3]);
  },
  PLC2Data(state, data) {
    state.PLC2Data.A2mpa = netage(data[0]);
    state.PLC2Data.A2mm = netage(data[1]);
    state.PLC2Data.B2mpa = netage(data[2]);
    state.PLC2Data.B2mm = netage(data[3]);
  },
  PLC1X(state, data) {
    state.PLC1X = data;
  },
  PLC2X(state, data) {
    state.PLC2X = data;
  },
  PLC1550(state, data) {
    state.PLC1550 = data;
  },
  PLC2550(state, data) {
    state.PLC2550 = data;
  },
  PLC1S(state, data) {
    state.PLC1S.A = Sbit(data[0]);
    state.PLC1S.B = Sbit(data[1]);
  },
  PLC2S(state, data) {
    state.PLC2S.A = Sbit(data[0]);
    state.PLC2S.B = Sbit(data[1]);
  },
  operator(state, data) {
    state.operator = data;
  },
  user(state, data) {
    state.user = data;
  },
  device(state, data) {
    state.device = data;
  },
  systen(state, data) {
    state.systen = data;
  },
};

const actions = {
  PLC1Data(context, data) {
    context.commit('PLC1Data', data);
  },
  PLC2Data(context, data) {
    context.commit('PLC2Data', data);
  },
  PLC1State(context, data) {
    context.commit('PLC1State', data);
  },
  PLC2State(context, data) {
    context.commit('PLC2State', data);
  },
  PLC1X(context, data) {
    context.commit('PLC1X', data);
  },
  PLC2X(context, data) {
    context.commit('PLC2X', data);
  },
  PLC1550(context, data) {
    context.commit('PLC1550', data);
  },
  PLC2550(context, data) {
    context.commit('PLC2550', data);
  },
  PLC1S(context, data) {
    context.commit('PLC1S', data);
  },
  PLC2S(context, data) {
    context.commit('PLC2S', data);
  },
  systen(context, data) {
    context.commit('systen', data);
  },
};

export default {
  state,
  mutations,
  actions,
};
