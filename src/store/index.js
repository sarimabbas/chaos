import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // SidebarContext
    sidebarContexts: {
      isExplorerShowing: false,
      isSearchShowing: false
    }
  },
  mutations: {
    toggleIsExplorerShowing(state) {
      state.sidebarContexts.isSearchShowing = false;
      state.sidebarContexts.isExplorerShowing = !state.sidebarContexts
        .isExplorerShowing;
    },
    toggleIsSearchShowing(state) {
      state.sidebarContexts.isExplorerShowing = false;
      state.sidebarContexts.isSearchShowing = !state.sidebarContexts
        .isSearchShowing;
    }
  },
  actions: {
    toggleIsExplorerShowing(ctx) {
      ctx.commit("toggleIsExplorerShowing");
    },
    toggleIsSearchShowing(ctx) {
      ctx.commit("toggleIsSearchShowing");
    }
  },
  modules: {}
});
