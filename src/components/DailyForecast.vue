<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';
import { formatDate, getWeatherIconUrl } from '../services/weatherApi';

const weatherStore = useWeatherStore();
const { state } = weatherStore;

// Computed property to get daily forecast data
const dailyForecast = computed(() => state.forecast?.daily || []);

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
  <div class="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
    <h3 class="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      7-Day Forecast
    </h3>
    
    <!-- Loading state -->
    <div v-if="weatherStore.isLoading" class="flex justify-center py-8">
      <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Forecast data -->
    <div v-else-if="dailyForecast.length > 0">
      <div class="space-y-3">
        <div 
          v-for="day in dailyForecast" 
          :key="day.dt"
          class="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-blue-50 dark:hover:bg-gray-700"
        >
          <!-- Day name -->
          <div class="w-20 md:w-24">
            <span class="font-semibold text-gray-800 dark:text-white text-base">
              {{ formatDate(day.dt, 'day') }}
            </span>
          </div>
          
          <!-- Weather icon and description -->
          <div class="flex items-center grow max-w-[180px]">
            <div class="relative">
              <img 
                :src="getWeatherIconUrl(day.weather[0].icon)" 
                :alt="day.weather[0].description"
                class="w-12 h-12 drop-shadow"
              />
              <span class="absolute -bottom-1 -right-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full font-medium dark:bg-blue-900 dark:text-blue-100">
                {{ formatPrecipitation(day.pop) }}
              </span>
            </div>
            <span class="text-sm text-gray-600 capitalize truncate ml-2 dark:text-gray-300 hidden md:block">
              {{ day.weather[0].description }}
            </span>
          </div>
          
          <!-- Min/Max temperatures -->
          <div class="flex space-x-4 items-center">
            <span class="font-bold text-lg text-gray-800 dark:text-white">{{ formatTemp(day.temp_max) }}</span>
            <span class="text-gray-500 dark:text-gray-400">{{ formatTemp(day.temp_min) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No data state -->
    <div v-else class="text-center py-10 text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>No daily forecast data available</p>
    </div>
  </div>
</template> 