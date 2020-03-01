<script>
import Sidebar from "./components/Sidebar/Sidebar";
import SideContext from "./components/SideContext/SideContext";

export default {
  components: {
    Sidebar,
    SideContext
  },
  mounted() {}
};
</script>

<template>
  <div id="app" class="flex h-full">
    <!-- <router-link to="/">Home</router-link>|
    <router-link to="/about">About</router-link>-->
    <!--  -->

    <Sidebar />
    <SideContext />
    <router-view />
  </div>
</template>

<style src="./assets/tailwind.css" />
