<script>
import CrossIcon from "../assets/icons/cross.svg";
export default {
  components: { CrossIcon },
  methods: {
    close() {
      this.$router.push("splash");
    }
  }
};
</script>


<template>
  <div class="w-full h-full bg-gray-700">
    <div class="flex items-center justify-between mx-4 my-3">
      <h1 class="text-2xl font-bold tracking-widest text-gray-200 uppercase">Settings</h1>
      <CrossIcon class="ui-option-button" width="24" @click="close" />
    </div>
  </div>
</template>

<style>
</style>