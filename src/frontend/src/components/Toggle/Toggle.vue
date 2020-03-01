<template>
  <div class="flex items-center justify-center w-full mb-24">
    <!-- Toggle Button -->
    <label for="toogleA" class="flex items-center cursor-pointer">
      <!-- toggle -->
      <div class="relative">
        <!-- input -->
        <input id="toogleA" type="checkbox" class="hidden toggle_input" />
        <!-- line -->
        <div
          class="w-10 h-4 bg-gray-400 rounded-full shadow-inner toggle__line"
        ></div>
        <!-- dot -->
        <div
          class="absolute inset-y-0 left-0 w-6 h-6 bg-white rounded-full shadow toggle__dot"
        ></div>
      </div>
      <!-- label -->
      <div class="ml-3 font-medium text-gray-700">
        Toggle Me!
      </div>
    </label>
  </div>
</template>

<script>
export default {};
</script>

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
