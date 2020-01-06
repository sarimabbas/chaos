<script>
import FileIcon from "../../assets/icons/file.svg";
import SearchIcon from "../../assets/icons/search.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import SidebarIcon from "./SidebarIcon";

export default {
  components: {
    FileIcon,
    SearchIcon,
    SettingsIcon,
    SidebarIcon
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
        <SidebarIcon>
          <FileIcon />
        </SidebarIcon>
        <!-- single icon -->
        <SidebarIcon>
          <SearchIcon />
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
