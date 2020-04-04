<script>
import Sidebar from "./components/Sidebar/Sidebar";
import LeftContext from "./components/LeftContext/LeftContext";

export default {
  components: {
    Sidebar,
    LeftContext,
  },
  mounted() {},
};
</script>

<template>
  <div id="app" class="flex h-full">
    <!-- <router-link to="/">Home</router-link>|
    <router-link to="/about">About</router-link>-->
    <!--  -->

    <Sidebar />
    <LeftContext />
    <div class="w-full theme-content-view"><router-view /></div>
    <!-- <SideContext /> -->
  </div>
</template>

<style>
@import "./assets/tailwind.css";
@import "./assets/theme.css";
</style>
