function netage(data) {
  if (data > 32767) {
    return parseInt((0xFFFF ^ data) + 1, 10) * -1;
  }
  return data;
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
  operator: null,
  user: null,
  device: null,
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
  operator(state, data) {
    state.operator = data;
  },
  user(state, data) {
    state.user = data;
  },
  device(state, data) {
    state.device = data;
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
};

export default {
  state,
  mutations,
  actions,
};
