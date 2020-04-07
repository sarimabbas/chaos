<template>
  <img
    :src="src"
    alt=""
    @error="show = false"
    v-if="show"
    class="object-cover w-full"
  />
</template>

<script>
export default {
  props: ["src"],
  data() {
    return {
      show: true,
    };
  },
};
</script>

<style></style>
