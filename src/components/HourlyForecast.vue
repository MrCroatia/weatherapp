<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';
import { formatDate, getWeatherIconUrl } from '../services/weatherApi';

const weatherStore = useWeatherStore();
const { state } = weatherStore;

// Computed property to get hourly forecast data
const hourlyForecast = computed(() => state.forecast?.hourly || []);

// Format temperature with unit
const formatTemp = (temp: number) => {
  if (state.unit === 'imperial') {
    temp = temp * 9/5 + 32;
  }
  return `${Math.round(temp)}°`;
};

// Format precipitation probability
const formatPrecipitation = (pop: number) => {
  return `${Math.round(pop * 100)}%`;
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
    <h3 class="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Hourly Forecast
    </h3>
    
    <!-- Loading state -->
    <div v-if="weatherStore.isLoading" class="flex justify-center py-8">
      <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Forecast data -->
    <div v-else-if="hourlyForecast.length > 0" class="overflow-x-auto pb-3 -mx-6">
      <div class="flex space-x-6 min-w-max px-6">
        <div 
          v-for="hour in hourlyForecast" 
          :key="hour.dt"
          class="flex flex-col items-center p-3 rounded-xl transition-all hover:bg-blue-50 dark:hover:bg-gray-700"
        >
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {{ formatDate(hour.dt, 'time') }}
          </span>
          <img 
            :src="getWeatherIconUrl(hour.weather[0].icon)" 
            :alt="hour.weather[0].description"
            class="w-12 h-12 my-2 drop-shadow"
          />
          <span class="font-bold text-lg text-gray-800 dark:text-white">{{ formatTemp(hour.temp) }}</span>
          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1 font-medium dark:bg-blue-900 dark:text-blue-100">
            {{ formatPrecipitation(hour.pop) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- No data state -->
    <div v-else class="text-center py-10 text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>No hourly forecast data available</p>
    </div>
  </div>
</template> 