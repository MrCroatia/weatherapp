<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';
import { formatDate, getWeatherIconUrl } from '../services/weatherApi';
import type { HourlyForecast } from '../services/weatherApi';

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
  <div class="bg-white rounded-xl shadow-md p-4 dark:bg-gray-800">
    <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Hourly Forecast</h3>
    
    <!-- Loading state -->
    <div v-if="weatherStore.isLoading" class="flex justify-center py-6">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Forecast data -->
    <div v-else-if="hourlyForecast.length > 0" class="overflow-x-auto pb-2">
      <div class="flex space-x-6 min-w-max">
        <div 
          v-for="hour in hourlyForecast" 
          :key="hour.dt"
          class="flex flex-col items-center p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ formatDate(hour.dt, 'time') }}
          </span>
          <img 
            :src="getWeatherIconUrl(hour.weather[0].icon)" 
            :alt="hour.weather[0].description"
            class="w-10 h-10 my-1"
          />
          <span class="font-bold text-gray-800 dark:text-white">{{ formatTemp(hour.temp) }}</span>
          <span class="text-xs text-blue-500 dark:text-blue-400">
            {{ formatPrecipitation(hour.pop) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- No data state -->
    <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400">
      <p>No hourly forecast data available</p>
    </div>
  </div>
</template> 