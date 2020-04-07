<template>
  <a
    @click="click(node)"
    class="block overflow-hidden transition duration-150 ease-in-out bg-white rounded-md shadow-md cursor-pointer hover:shadow-lg"
  >
    <ResilientImage :src="image" class="h-32" />
    <div class="p-4 md:p-6">
      <h3 class="pb-2 text-xl font-semibold leading-tight sm:leading-normal">
        {{ title }}
      </h3>
      <p>
        {{ description }}
      </p>
    </div>
  </a>
</template>

<script>
import ResilientImage from "../ResilientImage/ResilientImage";
export default {
  components: {
    ResilientImage,
  },
  props: ["click", "node", "image", "title", "description"],
};
</script>

<style></style>
