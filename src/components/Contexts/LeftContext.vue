<script>
import FileExplorer from "./FileExplorer";
import Search from "./Search";
import Extensions from "./Extensions";
import Chat from "./Chat";

export default {
  components: {
    FileExplorer,
    Search,
    Extensions,
    Chat,
  },
  computed: {
    showContext() {
      let show = false;
      const contexts = this.$store.state.contexts;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].isShowing && contexts[key].side === "left") {
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
    class="flex-none h-full theme-left-context"
    v-show="showContext"
    style="min-width: 15rem;"
  >
    <FileExplorer v-show="this.$store.state.contexts.explorer.isShowing" />
    <Search v-show="this.$store.state.contexts.search.isShowing" />
    <Extensions v-show="this.$store.state.contexts.extensions.isShowing" />
  </div>
</template>

<style></style>
