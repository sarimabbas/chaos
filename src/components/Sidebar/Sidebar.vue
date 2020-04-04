<script>
import FileIcon from "../../assets/icons/file.svg";
import SearchIcon from "../../assets/icons/search.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import PackageIcon from "../../assets/icons/package.svg";
import MessageCircleIcon from "../../assets/icons/message-circle.svg";
import SidebarIcon from "./SidebarIcon";

export default {
  components: {
    FileIcon,
    SearchIcon,
    SettingsIcon,
    SidebarIcon,
    MessageCircleIcon,
    PackageIcon,
  },
  methods: {
    toggleContext(contextAction) {
      this.$store.dispatch(contextAction);
    },
    openSettings() {
      this.$router.push("settings");
    },
  },
};
</script>

<template>
  <div class="flex-initial h-full theme-side-bar" style="min-width: 4rem;">
    <!-- icons -->
    <div class="flex flex-col content-between h-full">
      <!-- top -->
      <div class="flex flex-col h-full">
        <!-- single icon -->
        <SidebarIcon
          @click.native="toggleContext('toggleIsExplorerShowing')"
          :class="[
            {
              'theme-side-bar-button-active': this.$store.state.contexts
                .isExplorerShowing,
            },
          ]"
        >
          <FileIcon />
        </SidebarIcon>
        <!-- single icon -->
        <SidebarIcon
          @click.native="toggleContext('toggleIsSearchShowing')"
          :class="[
            {
              'theme-side-bar-button-active': this.$store.state.contexts
                .isSearchShowing,
            },
          ]"
        >
          <SearchIcon width="24" />
        </SidebarIcon>
        <!-- single icon -->
        <SidebarIcon
          @click.native="toggleContext('toggleIsExtensionsShowing')"
          :class="[
            {
              'theme-side-bar-button-active': this.$store.state.contexts
                .isExtensionsShowing,
            },
          ]"
        >
          <PackageIcon width="24" />
        </SidebarIcon>
        <!-- chat icon -->
        <SidebarIcon
          @click.native="toggleContext('toggleIsChatShowing')"
          :class="[
            {
              'theme-side-bar-button-active': this.$store.state.contexts
                .isChatShowing,
            },
          ]"
        >
          <MessageCircleIcon width="24" />
        </SidebarIcon>
      </div>
      <!-- bottom -->
      <SidebarIcon @click.native="openSettings">
        <SettingsIcon />
      </SidebarIcon>
    </div>
  </div>
</template>
