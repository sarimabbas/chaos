<script>
export default {
  props: ["labelRight", "labelLeft", "handler", "checked"]
};
</script>

<template>
  <div>
    <!-- Toggle Button -->
    <label class="flex items-center cursor-pointer">
      <!-- labelLeft -->
      <div class="mr-3 font-medium text-gray-200">
        {{ labelLeft }}
      </div>
      <!-- toggle -->
      <div class="relative">
        <!-- input -->
        <input
          type="checkbox"
          class="hidden toggle_input"
          @input="handler"
          :checked="checked"
        />
        <!-- line -->
        <div
          class="w-10 h-4 bg-gray-400 rounded-full shadow-inner toggle__line"
        ></div>
        <!-- dot -->
        <div
          class="absolute inset-y-0 left-0 w-6 h-6 bg-white rounded-full shadow toggle__dot"
        ></div>
      </div>
      <!-- labelRight -->
      <div class="ml-3 font-medium text-gray-200">
        {{ labelRight }}
      </div>
    </label>
  </div>
</template>

<style scoped>
.toggle__dot {
  top: -0.25rem;
  left: -0.25rem;
  transition: all 0.3s ease-in-out;
}

.toggle_input:checked ~ .toggle__dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>
