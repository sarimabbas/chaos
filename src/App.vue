<script>
import Sidebar from "./components/Sidebar/Sidebar";
import LeftContext from "./components/Contexts/LeftContext";
import RightContext from "./components/Contexts/RightContext";
import Split from "split.js";

export default {
  components: {
    Sidebar,
    LeftContext,
    RightContext,
  },
  data() {
    return {
      splitInstance: null,
    };
  },
  watch: {
    isContextShowing: {
      handler: function (val) {
        if (val.left && val.right) {
          if (this.splitInstance) {
            this.splitInstance.destroy();
            this.splitInstance = null;
          }
          this.splitInstance = Split(["#p1", "#p2", "#p3"], {
            sizes: [20, 60, 20],
            gutterSize: 1,
          });
        } else if (val.left && !val.right) {
          if (this.splitInstance) {
            this.splitInstance.destroy();
            this.splitInstance = null;
          }
          this.splitInstance = Split(["#p1", "#p2"], {
            sizes: [20, 80],
            gutterSize: 1,
          });
        } else if (!val.left && val.right) {
          if (this.splitInstance) {
            this.splitInstance.destroy();
            this.splitInstance = null;
          }
          this.splitInstance = Split(["#p2", "#p3"], {
            sizes: [80, 20],
            gutterSize: 1,
          });
        } else {
          if (this.splitInstance) {
            this.splitInstance.destroy();
            this.splitInstance = null;
          }
        }
      },
      immediate: true,
    },
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
  <div id="app" class="flex w-full h-full">
    <Sidebar />
    <div class="flex w-full h-full">
      <LeftContext id="p1" />
      <div :class="['theme-content-view w-full']" id="p2">
        <router-view />
      </div>
      <RightContext id="p3" />
    </div>
  </div>
</template>

<style>
@import "./assets/tailwind.css";
@import "./assets/theme.css";

.gutter {
  background-color: var(--theme-background-primary-color);
  background-repeat: no-repeat;
  background-position: 50%;
  z-index: 999;
}

.gutter.gutter-horizontal {
  /* background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg=="); */
  cursor: col-resize;
}
</style>
