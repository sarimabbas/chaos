<script>
import CheckIcon from "../../assets/icons/check.svg";
export default {
  props: ["text", "active", "onClick"],
  components: {
    CheckIcon
  }
};
</script>

<template>
  <a
    @click="onClick"
    class="flex items-center justify-between block px-2 py-1 text-gray-800 cursor-pointer hover:bg-gray-300 hover:rounded-sm"
  >
    {{ text }}
    <CheckIcon width="20" v-if="active" />
  </a>
</template>

<style></style>
