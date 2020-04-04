<script>
import Sidebar from "./components/Sidebar/Sidebar";
import LeftContext from "./components/Contexts/LeftContext";
import RightContext from "./components/Contexts/RightContext";
import { Multipane, MultipaneResizer } from "vue-multipane";

export default {
  components: {
    Sidebar,
    LeftContext,
    RightContext,
    Multipane,
    MultipaneResizer,
  },
  computed: {
    isLeftContextShowing() {
      let show = false;
      const contexts = this.$store.state.contexts;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].isShowing && contexts[key].side === "left") {
          show = true;
        }
      });
      return show;
    },
    isRightContextShowing() {
      let show = false;
      const contexts = this.$store.state.contexts;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].isShowing && contexts[key].side === "right") {
          show = true;
        }
      });
      return show;
    },
  },
};
</script>

<template>
  <div id="app" class="flex w-full h-full">
    <multipane class="flex w-full h-full">
      <Sidebar />
      <LeftContext />
      <multipane-resizer v-show="isLeftContextShowing"></multipane-resizer>
      <div
        :class="[
          'theme-content-view w-full',
          {
            'flex-grow': !isRightContextShowing,
          },
        ]"
      >
        <router-view />
      </div>
      <multipane-resizer v-show="isRightContextShowing"></multipane-resizer>
      <RightContext class="flex-grow" />
    </multipane>
  </div>
</template>

<style>
@import "./assets/tailwind.css";
@import "./assets/theme.css";
</style>
