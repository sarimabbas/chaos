<script>
import CrossIcon from "../assets/icons/cross.svg";
export default {
  components: { CrossIcon },
  data() {
    return {};
  },
  // mounted() {
  //   this.path = this.$route.query.path;
  // },
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
      <h1 class="text-2xl font-bold tracking-widest text-gray-200 uppercase">File View</h1>
      <CrossIcon class="ui-option-button" width="24" @click="close" />
    </div>
    <span>{{ this.$route.query.path }}</span>
    <span>{{ this.$store.state.views.currentWorkingPath }}</span>
  </div>
</template>

<style>
</style>