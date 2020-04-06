<script>
import Sidebar from "./components/Sidebar/Sidebar";
import LeftContext from "./components/Contexts/LeftContext";
import RightContext from "./components/Contexts/RightContext";
import Topbar from "./components/Topbar/Topbar";
import Bottombar from "./components/Bottombar/Bottombar";

export default {
  components: {
    Sidebar,
    LeftContext,
    RightContext,
    Topbar,
    Bottombar,
  },
  data() {
    return {
      splitInstance: null,
    };
  },
  computed: {
    isContextShowing() {
      let leftShow = false;
      let rightShow = false;
      const contexts = this.$store.state.contexts;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].isShowing && contexts[key].side === "left") {
          leftShow = true;
        }
      });
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].isShowing && contexts[key].side === "right") {
          rightShow = true;
        }
      });
      return {
        left: leftShow,
        right: rightShow,
      };
    },
  },
};
</script>

<template>
  <div id="app" class="grid-container">
    <Topbar class="Topbar" />
    <Sidebar class="Sidebar" />
    <LeftContext class="Left-Context" />
    <div :class="['theme-content-view w-full Content']">
      <router-view />
    </div>
    <!-- <RightContext class="Right-Context" /> -->
    <!-- <Bottombar class="Bottombar" /> -->
  </div>
</template>

<style>
@import "./assets/tailwind.css";
@import "./assets/theme.css";

.grid-container {
  display: grid;
  grid-template-columns: min-content min-content 1fr min-content;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "Topbar Topbar Topbar Topbar" "Sidebar Left-Context Content Right-Context" "Bottombar Bottombar Bottombar Bottombar";
  height: 100%;
}

.Topbar {
  grid-area: Topbar;
}

.Sidebar {
  grid-area: Sidebar;
}

.Left-Context {
  grid-area: Left-Context;
  resize: horizontal;
  overflow: auto;
}

.Right-Context {
  grid-area: Right-Context;
  overflow: auto;
}

.Content {
  grid-area: Content;
}

.Bottombar {
  grid-area: Bottombar;
}
</style>
