<script>
import FileIcon from "../../assets/icons/file.svg";
import SearchIcon from "../../assets/icons/search.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import PackageIcon from "../../assets/icons/package.svg";
import SidebarIcon from "./SidebarIcon";

export default {
  components: {
    FileIcon,
    SearchIcon,
    SettingsIcon,
    SidebarIcon,
    PackageIcon
  },
  methods: {
    toggleContext(contextAction) {
      this.$store.dispatch(contextAction);
    }
  }
};
</script>

<template>
  <div class="flex-initial w-16 h-full bg-gray-800">
    <!-- icons -->
    <div class="flex flex-col content-between h-full">
      <!-- top -->
      <div class="flex flex-col h-full">
        <!-- single icon -->
        <SidebarIcon
          @click.native="toggleContext('toggleIsExplorerShowing')"
          :class="[{'border-pink-700' : this.$store.state.sidebarContexts.isExplorerShowing}]"
        >
          <FileIcon />
        </SidebarIcon>
        <!-- single icon -->
        <SidebarIcon
          @click.native="toggleContext('toggleIsSearchShowing')"
          :class="[{'border-pink-700' : this.$store.state.sidebarContexts.isSearchShowing}]"
        >
          <SearchIcon width="24" />
        </SidebarIcon>
        <!-- single icon -->
        <SidebarIcon>
          <PackageIcon width="24" />
        </SidebarIcon>
      </div>
      <!-- bottom -->
      <SidebarIcon>
        <SettingsIcon />
      </SidebarIcon>
    </div>
  </div>
</template>

<style scoped></style>
