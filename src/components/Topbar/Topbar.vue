<script>
export default {};
</script>

<template>
  <div
    class="flex items-center justify-center w-full h-10 shadow-xs base theme-top-bar"
    style="z-index: 1000;"
  >
    Hello
  </div>
</template>

<style scoped>
.base {
  /* make draggable in Electron  */
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>
