import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import events from "./events";

import api from "./api";

// global component imports
import VModal from "vue-js-modal";
Vue.use(VModal);

Vue.config.productionTip = false;
// Vue.prototype.$backend = window.pywebview;

Vue.prototype.$store = store;
Vue.prototype.$events = events;
Vue.prototype.$chaos = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
