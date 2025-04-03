<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';
import { formatDate, getWeatherIconUrl } from '../services/weatherApi';

const weatherStore = useWeatherStore();
const { state } = weatherStore;

// Computed properties
const currentWeather = computed(() => state.currentWeather);
const currentLocation = computed(() => state.currentLocation);
const isLoading = computed(() => weatherStore.isLoading);

// Format functions
const formatWind = (speed: number) => {
  const unit = state.unit === 'metric' ? 'm/s' : 'mph';
  const convertedSpeed = state.unit === 'metric' ? speed : speed * 2.237;
  return `${Math.round(convertedSpeed)} ${unit}`;
};

// Weather background classes based on weather condition
const weatherBackground = computed(() => {
  if (!currentWeather.value || !currentWeather.value.weather[0]) {
    return 'bg-gradient-to-br from-blue-400 to-blue-600';
  }
  
  const weatherId = currentWeather.value.weather[0].id;
  const isDay = true; // TODO: Calculate based on sunrise/sunset
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return 'bg-gradient-to-br from-gray-700 to-gray-900';
  }
  
  // Drizzle or Rain
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return 'bg-gradient-to-br from-blue-700 to-blue-900';
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return 'bg-gradient-to-br from-blue-100 to-blue-300';
  }
  
  // Atmosphere (fog, mist, etc.)
  if (weatherId >= 700 && weatherId < 800) {
    return 'bg-gradient-to-br from-gray-400 to-gray-600';
  }
  
  // Clear
  if (weatherId === 800) {
    return isDay 
      ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
      : 'bg-gradient-to-br from-blue-900 to-indigo-900';
  }
  
  // Clouds
  return isDay 
    ? 'bg-gradient-to-br from-blue-300 to-blue-500' 
    : 'bg-gradient-to-br from-blue-800 to-blue-900';
});
</script>

<template>
  <div 
    :class="[
      'relative overflow-hidden rounded-xl shadow-lg p-6 text-white transition-all w-full', 
      weatherBackground,
      {'animate-pulse-slow': isLoading}
    ]"
  >
    <!-- Loading overlay -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
      <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Content -->
    <div v-if="currentWeather && currentLocation" class="relative z-0">
      <!-- Location and date -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold">{{ currentLocation.name }}</h2>
        <p class="text-lg opacity-90">{{ formatDate(currentWeather.dt) }}</p>
      </div>
      
      <!-- Current temperature and weather -->
      <div class="flex items-center mb-6">
        <div class="mr-4">
          <div class="text-6xl font-bold">{{ weatherStore.formattedCurrentTemperature }}</div>
          <div class="text-xl">Feels like {{ weatherStore.formattedFeelsLike }}</div>
        </div>
        
        <div class="flex flex-col items-center">
          <img 
            :src="getWeatherIconUrl(currentWeather.weather[0].icon)" 
            :alt="currentWeather.weather[0].description"
            class="w-20 h-20"
          />
          <span class="text-xl capitalize">{{ currentWeather.weather[0].description }}</span>
        </div>
      </div>
      
      <!-- Weather details grid -->
      <div class="grid grid-cols-2 gap-4 text-lg">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>Humidity: {{ currentWeather.humidity }}%</span>
        </div>
        
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Pressure: {{ currentWeather.pressure }} hPa</span>
        </div>
        
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span>Wind: {{ formatWind(currentWeather.wind_speed) }}</span>
        </div>
        
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>
            <button @click="weatherStore.toggleUnit()" class="underline">
              Switch to {{ state.unit === 'metric' ? '°F' : '°C' }}
            </button>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Placeholder for no data -->
    <div v-else-if="!isLoading" class="text-center py-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
      <h3 class="text-xl font-semibold">No Weather Data</h3>
      <p class="mt-2">Search for a location or use your current location</p>
    </div>
    
    <!-- Decorative elements -->
    <div class="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white bg-opacity-20"></div>
    <div class="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white bg-opacity-10"></div>
  </div>
</template> 