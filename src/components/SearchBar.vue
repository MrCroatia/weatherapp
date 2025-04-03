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

const getLocationByGeolocation = () => {
  weatherStore.getWeatherForCurrentLocation();
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
      <!-- Search input -->
      <input
        v-model="searchInput"
        type="text"
        placeholder="Search city or zip code..."
        class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Geolocation button -->
      <button
        class="absolute right-3 text-gray-500 hover:text-primary transition-colors dark:text-gray-400"
        @click="getLocationByGeolocation"
        title="Use current location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
    
    <!-- Search results dropdown -->
    <div
      v-if="showResults && weatherStore.state.searchResults.length > 0"
      class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200 animate-fade-in dark:bg-gray-800 dark:border-gray-700"
    >
      <ul class="py-1">
        <li
          v-for="location in weatherStore.state.searchResults"
          :key="`${location.lat}-${location.lon}`"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors flex items-center dark:hover:bg-gray-700"
          @click="selectLocation(location)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <div>
            <span class="font-medium dark:text-white">{{ location.name }}</span>
            <span v-if="location.country" class="text-sm text-gray-500 ml-1 dark:text-gray-400">{{ location.country }}</span>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- No results message -->
    <div
      v-if="showResults && weatherStore.state.searchQuery && weatherStore.state.searchResults.length === 0 && !weatherStore.isSearching"
      class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-2 px-4 border border-gray-200 animate-fade-in dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      No locations found. Try a different search term.
    </div>
    
    <!-- Loading indicator -->
    <div
      v-if="weatherStore.isSearching"
      class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-4 px-4 border border-gray-200 animate-fade-in flex justify-center dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template> 