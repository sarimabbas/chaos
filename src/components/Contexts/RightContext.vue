<script>
import Chat from "./Chat";
export default {
  components: {
    Chat,
  },
  computed: {
    showContext() {
      let show = false;
      const contexts = this.$store.state.contexts;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].isShowing && contexts[key].side === "right") {
          show = true;
        }
      });
      return show;
    },
  },
};
</script>

<template>
  <div
    class="flex-none h-full theme-right-context"
    v-show="showContext"
    style="min-width: 20rem;"
  >
    <Chat v-show="this.$store.state.contexts.chat.isShowing" />
  </div>
</template>

<style></style>
