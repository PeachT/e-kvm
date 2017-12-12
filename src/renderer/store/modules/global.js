const state = {
  path: '',
  showMenu: false,
  menuTitle: '',
  menu2Data: [], // {id: 'id', name: '菜单名称'}
  userDb: null,
  editState: false,
  addState: false,
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
  editState(state, data) {
    state.editState = data;
  },
  addState(state, data) {
    state.addState = data;
  },
};

const actions = {
};

export default {
  state,
  mutations,
  actions,
};
