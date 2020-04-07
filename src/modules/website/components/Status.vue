<template>
  <div v-if="!(status === 'not_started')" class="flex items-center">
    <span v-if="status === 'loading'">
      <LoaderIcon width="10" class="spin" />
    </span>
    <span v-if="status === 'error'">
      <CrossIcon width="10" />
    </span>
    <span v-if="status === 'success'">
      <CheckIcon width="10" />
    </span>
    <span class="ml-2">{{ name }}</span>
  </div>
</template>

<script>
import CheckIcon from "../../../assets/icons/check.svg";
import LoaderIcon from "../../../assets/icons/loader.svg";
import CrossIcon from "../../../assets/icons/cross.svg";
export default {
  props: ["status", "name"],
  components: {
    CheckIcon,
    LoaderIcon,
    CrossIcon,
  },
};
</script>

<style></style>
