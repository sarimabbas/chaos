<script>
import FileExplorer from "./FileExplorer";
import Search from "./Search";
export default {
  components: {
    FileExplorer,
    Search
  },
  computed: {
    showSideContext() {
      let show = false;
      const contexts = this.$store.state.sidebarContexts;
      Object.keys(contexts).forEach(function(key) {
        if (contexts[key]) {
          show = true;
        }
      });
      return show;
    }
  }
};
</script>

<template>
  <div class="flex-none w-56 h-full bg-gray-900" v-show="showSideContext">
    <FileExplorer
      v-show="this.$store.state.sidebarContexts.isExplorerShowing"
    />
    <Search v-show="this.$store.state.sidebarContexts.isSearchShowing" />
  </div>
</template>

<style></style>
