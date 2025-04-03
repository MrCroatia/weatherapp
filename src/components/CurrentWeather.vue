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
    return 'bg-gradient-to-r from-gray-800 to-slate-700';
  }
  
  // Drizzle or Rain
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return 'bg-gradient-to-r from-blue-800 to-blue-600';
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return 'bg-gradient-to-r from-indigo-200 to-blue-300';
  }
  
  // Atmosphere (fog, mist, etc.)
  if (weatherId >= 700 && weatherId < 800) {
    return 'bg-gradient-to-r from-gray-500 to-gray-400';
  }
  
  // Clear
  if (weatherId === 800) {
    return isDay 
      ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
      : 'bg-gradient-to-r from-blue-900 to-indigo-800';
  }
  
  // Clouds
  return isDay 
    ? 'bg-gradient-to-r from-blue-400 to-blue-300' 
    : 'bg-gradient-to-r from-blue-800 to-indigo-700';
});

// Weather icon overlay based on condition
const weatherOverlay = computed(() => {
  if (!currentWeather.value || !currentWeather.value.weather[0]) {
    return '';
  }
  
  const weatherId = currentWeather.value.weather[0].id;
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return 'bg-[url("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1000&auto=format")] bg-cover bg-blend-overlay bg-opacity-20';
  }
  
  // Rain or Drizzle
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return 'before:absolute before:inset-0 before:bg-[url("https://www.transparenttextures.com/patterns/diagonal-noise.png")] before:opacity-20 before:z-0';
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return 'before:absolute before:inset-0 before:bg-[url("https://www.transparenttextures.com/patterns/snow.png")] before:opacity-30 before:z-0';
  }
  
  return '';
});
</script>

<template>
  <div 
    :class="[
      'relative overflow-hidden rounded-xl shadow-xl p-8 text-white transition-all w-full', 
      weatherBackground,
      weatherOverlay,
      {'animate-pulse-slow': isLoading}
    ]"
  >
    <!-- Glass effect overlay -->
    <div class="absolute inset-0 bg-white/10 backdrop-blur-sm backdrop-filter"></div>
    
    <!-- Loading overlay -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
      <div class="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Content -->
    <div v-if="currentWeather && currentLocation" class="relative z-10">
      <!-- Location and date -->
      <div class="mb-8">
        <h2 class="text-4xl font-bold">{{ currentLocation.name }}</h2>
        <p class="text-xl opacity-90 mt-2">{{ formatDate(currentWeather.dt) }}</p>
      </div>
      
      <!-- Current temperature and weather -->
      <div class="flex flex-col md:flex-row items-center mb-8 space-y-4 md:space-y-0">
        <div class="mr-6 text-center md:text-left">
          <div class="text-7xl font-bold mb-2">{{ weatherStore.formattedCurrentTemperature }}</div>
          <div class="text-2xl">Feels like {{ weatherStore.formattedFeelsLike }}</div>
        </div>
        
        <div class="flex flex-col items-center">
          <img 
            :src="getWeatherIconUrl(currentWeather.weather[0].icon)" 
            :alt="currentWeather.weather[0].description"
            class="w-24 h-24 drop-shadow-lg"
          />
          <span class="text-2xl capitalize mt-2">{{ currentWeather.weather[0].description }}</span>
        </div>
      </div>
      
      <!-- Weather details grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg bg-white/10 p-5 rounded-lg backdrop-blur-sm">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-4 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span class="text-xl">Humidity: {{ currentWeather.humidity }}%</span>
        </div>
        
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-4 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xl">Pressure: {{ currentWeather.pressure }} hPa</span>
        </div>
        
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-4 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span class="text-xl">Wind: {{ formatWind(currentWeather.wind_speed) }}</span>
        </div>
        
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-4 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-xl">
            <button @click="weatherStore.toggleUnit()" class="underline hover:text-blue-100 transition-colors">
              Switch to {{ state.unit === 'metric' ? '°F' : '°C' }}
            </button>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Placeholder for no data -->
    <div v-else-if="!isLoading" class="text-center py-12 relative z-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto mb-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
      <h3 class="text-2xl font-semibold mb-2">No Weather Data</h3>
      <p class="text-lg">Search for a location to see weather information</p>
    </div>
    
    <!-- Decorative elements -->
    <div class="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white bg-opacity-20 z-0"></div>
    <div class="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white bg-opacity-10 z-0"></div>
  </div>
</template> 