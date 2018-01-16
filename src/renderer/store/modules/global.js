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
  operator: null,
  user: null,
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
    state.PLC1Data.A1mpa = data[0];
    state.PLC1Data.A1mm = data[1];
    state.PLC1Data.B1mpa = data[2];
    state.PLC1Data.B1mm = data[3];
  },
  PLC2Data(state, data) {
    state.PLC2Data.A2mpa = data[0];
    state.PLC2Data.A2mm = data[1];
    state.PLC2Data.B2mpa = data[2];
    state.PLC2Data.B2mm = data[3];
  },
  operator(state, data) {
    state.operator = data;
  },
  user(state, data) {
    state.user = data;
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
};

export default {
  state,
  mutations,
  actions,
};
