<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';
import { debounce } from '../composables/useDebounce';
import type { GeoLocation } from '../services/weatherApi';

const weatherStore = useWeatherStore();
const searchInput = ref('');
const showResults = ref(false);

// Debounced search function
const debouncedSearch = debounce((query: string) => {
  weatherStore.searchLocations(query);
}, 500);

// Watch for changes to the search input
watch(searchInput, (newValue) => {
  if (newValue.trim()) {
    debouncedSearch(newValue);
    showResults.value = true;
  } else {
    // Clear results if input is empty
    weatherStore.state.searchResults = [];
    showResults.value = false;
  }
});

const selectLocation = (location: GeoLocation) => {
  weatherStore.selectLocation(location);
  searchInput.value = '';
  showResults.value = false;
};

const handleBlur = () => {
  // Delay hiding results to allow for clicks on search results
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const handleFocus = () => {
  if (searchInput.value.trim() && weatherStore.state.searchResults.length > 0) {
    showResults.value = true;
  }
};
</script>

<template>
  <div class="relative w-full max-w-md mx-auto">
    <div class="relative flex items-center">
      <!-- Search input with enhanced styling -->
      <input
        v-model="searchInput"
        type="text"
        placeholder="Search for a city..."
        class="w-full px-5 py-4 rounded-lg border-2 border-gray-300 shadow-md focus:ring-4 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Search icon instead of geolocation button -->
      <div class="absolute right-5 text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    
    <!-- Search results dropdown with improved styling -->
    <div
      v-if="showResults && weatherStore.state.searchResults.length > 0"
      class="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl max-h-72 overflow-auto border border-gray-200 animate-fade-in dark:bg-gray-800 dark:border-gray-700"
    >
      <ul class="py-2">
        <li
          v-for="location in weatherStore.state.searchResults"
          :key="`${location.lat}-${location.lon}`"
          class="px-5 py-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center dark:hover:bg-gray-700"
          @click="selectLocation(location)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <div>
            <span class="font-medium text-gray-800 dark:text-white">{{ location.name }}</span>
            <span v-if="location.country" class="text-sm text-gray-500 ml-2 dark:text-gray-400">{{ location.country }}</span>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- No results message with improved styling -->
    <div
      v-if="showResults && weatherStore.state.searchQuery && weatherStore.state.searchResults.length === 0 && !weatherStore.isSearching"
      class="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl py-4 px-5 border border-gray-200 animate-fade-in dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>No locations found. Try a different search term.</span>
      </div>
    </div>
    
    <!-- Loading indicator with improved styling -->
    <div
      v-if="weatherStore.isSearching"
      class="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl py-4 px-5 border border-gray-200 animate-fade-in flex justify-center dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template> 