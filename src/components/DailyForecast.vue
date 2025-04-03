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
  <div class="bg-white rounded-xl shadow-md p-4 dark:bg-gray-800">
    <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">7-Day Forecast</h3>
    
    <!-- Loading state -->
    <div v-if="weatherStore.isLoading" class="flex justify-center py-6">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Forecast data -->
    <div v-else-if="dailyForecast.length > 0">
      <div class="space-y-3">
        <div 
          v-for="day in dailyForecast" 
          :key="day.dt"
          class="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <!-- Day name -->
          <div class="w-20">
            <span class="font-medium text-gray-800 dark:text-white">
              {{ formatDate(day.dt, 'day') }}
            </span>
          </div>
          
          <!-- Weather icon and description -->
          <div class="flex items-center w-32">
            <img 
              :src="getWeatherIconUrl(day.weather[0].icon)" 
              :alt="day.weather[0].description"
              class="w-10 h-10 mr-2"
            />
            <span class="text-sm text-gray-600 capitalize truncate dark:text-gray-300">
              {{ day.weather[0].description }}
            </span>
          </div>
          
          <!-- Precipitation -->
          <div class="w-16 text-center">
            <span class="text-sm text-blue-500 dark:text-blue-400">
              {{ formatPrecipitation(day.pop) }}
            </span>
          </div>
          
          <!-- Min/Max temperatures -->
          <div class="flex space-x-3">
            <span class="font-bold text-gray-800 dark:text-white">{{ formatTemp(day.temp_max) }}</span>
            <span class="text-gray-500 dark:text-gray-400">{{ formatTemp(day.temp_min) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No data state -->
    <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400">
      <p>No daily forecast data available</p>
    </div>
  </div>
</template> 