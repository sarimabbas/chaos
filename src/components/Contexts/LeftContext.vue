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
  <!-- the min-width prevents it from being overly small when resized -->
  <!-- the initial width is to prevent width growth due to file explorer -->
  <!-- the max-width prevents it from being overly large when resized -->
  <div
    class="h-full theme-left-context"
    v-show="showContext"
    style="min-width: 15rem; width: 15rem; max-width: 40rem;"
  >
    <FileExplorer v-show="this.$store.state.contexts.explorer.isShowing" />
    <Search v-show="this.$store.state.contexts.search.isShowing" />
    <Extensions v-show="this.$store.state.contexts.extensions.isShowing" />
    <Chat v-show="this.$store.state.contexts.chat.isShowing" />
  </div>
</template>

<style></style>
