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
  operator(state, data) {
    state.operator = data;
  },
  user(state, data) {
    state.user = data;
  },
};

const actions = {
};

export default {
  state,
  mutations,
  actions,
};
