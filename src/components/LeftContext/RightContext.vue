<script>
import FileExplorer from "./FileExplorer";
import Search from "./Search";
import Extensions from "./Extensions";
export default {
  components: {
    FileExplorer,
    Search,
    Extensions,
  },
  computed: {
    showSideContext() {
      let show = false;
      const contexts = this.$store.state.contexts;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key]) {
          show = true;
        }
      });
      return show;
    },
  },
};
</script>

<template>
  <div
    class="flex-none w-56 h-full overflow-auto resize-x theme-side-context"
    style="min-width: 14rem;"
    v-show="showSideContext"
  >
    <Chat v-show="this.$store.state.contexts.isChatShowing" />
  </div>
</template>

<style></style>
