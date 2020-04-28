<template>
  <a
    class="block overflow-hidden transition duration-150 ease-in-out bg-white rounded-md shadow-md cursor-pointer hover:shadow-lg"
  >
    <ResilientImage
      :src="image"
      class="h-56 bg-gray-400 border-b border-gray-200 border-solid"
    />
    <div class="p-4 md:p-6">
      <div class="flex items-center">
        <img :src="icon" class="h-4" />
        <h3 class="ml-2 text-base leading-tight sm:leading-normal">
          {{ subtitle }}
        </h3>
      </div>
      <p class="mt-2 text-sm text-gray-700">
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
  props: ["image", "title", "description", "icon", "subtitle"],
};
</script>

<style></style>
