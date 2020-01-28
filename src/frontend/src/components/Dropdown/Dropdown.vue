<script>
import ChevronDownIcon from "../../assets/icons/chevron-down.svg";
export default {
  props: ["text"],
  components: {
    ChevronDownIcon
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<template>
  <div class="relative">
    <!-- the button to open the dropdown -->
    <button
      class="relative z-10 flex items-center justify-between block px-2 bg-gray-200 rounded-sm"
      type="button"
      @click="toggle"
    >
      <span>{{ text }}</span>
      <ChevronDownIcon width="20" />
    </button>
    <!-- the overlay in the background which allows exit click -->
    <button
      v-if="isOpen"
      @click="isOpen = false"
      tabindex="-1"
      class="fixed inset-0 w-full h-full cursor-default"
    ></button>
    <!-- the actual links -->
    <div
      v-if="isOpen"
      class="absolute right-0 w-48 py-1 mt-2 bg-white rounded-sm shadow-xl"
    >
      <slot />
    </div>
  </div>
</template>

<style></style>
