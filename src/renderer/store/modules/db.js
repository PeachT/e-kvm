const state = {
  DBmain: null,
  DBother: null,
  DBtensioning: null,
};

const mutations = {
  DBmain(state, data) {
    state.DBmain = data;
  },
  DBother(state, data) {
    state.DBother = data;
  },
  DBtensioning(state, data) {
    state.DBtensioning = data;
  },
};

const actions = {
};

export default {
  state,
  mutations,
  actions,
};
