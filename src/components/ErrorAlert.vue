<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';

const weatherStore = useWeatherStore();
const { state } = weatherStore;

// Computed property to check if there's an error
const hasError = computed(() => !!state.error);
</script>

<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="hasError" class="fixed bottom-4 right-4 max-w-md w-full bg-red-50 dark:bg-red-900 p-4 rounded-lg shadow-lg z-50">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-500 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-red-900 dark:text-red-50">Error</p>
          <p class="mt-1 text-sm text-red-700 dark:text-red-100">{{ state.error }}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            class="inline-flex text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100 focus:outline-none"
            @click="weatherStore.clearError()"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template> 