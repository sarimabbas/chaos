<script>
import Sidebar from "./components/Sidebar/Sidebar";
import SideContext from "./components/SideContext/SideContext";

// icons
import "vue-awesome/icons/regular/file";
import "vue-awesome/icons/search";

export default {
  components: {
    Sidebar,
    SideContext
  }
};
</script>

<template>
  <div id="app" class="flex h-full bg-red-600">
    <!-- <router-link to="/">Home</router-link>|
    <router-link to="/about">About</router-link>-->
    <!--  -->

    <Sidebar />
    <SideContext />
    <router-view />
  </div>
</template>

<style lang="scss" scoped></style>

<style src="./assets/tailwind.css" />
