import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Icon from "vue-awesome/components/Icon";

Vue.config.productionTip = false;

Vue.prototype.$backend = window.pywebview;

Vue.component("v-icon", Icon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
