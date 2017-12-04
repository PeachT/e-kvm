const state = {
  path: '',
  showMenu: false,
  menuTitle: '',
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
};

const actions = {
};

export default {
  state,
  mutations,
  actions,
};
