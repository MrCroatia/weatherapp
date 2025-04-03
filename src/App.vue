<script setup lang="ts">
import { onMounted } from 'vue';
import { useWeatherStore } from './stores/weatherStore';
import SearchBar from './components/SearchBar.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import HourlyForecast from './components/HourlyForecast.vue';
import DailyForecast from './components/DailyForecast.vue';
import WeatherChart from './components/WeatherChart.vue';
import WeatherMap from './components/WeatherMap.vue';
import ErrorAlert from './components/ErrorAlert.vue';

const weatherStore = useWeatherStore();

// Set New York as the default location instead of using geolocation
onMounted(() => {
  // New York coordinates
  const newYorkLat = 40.7128;
  const newYorkLon = -74.0060;
  weatherStore.getWeatherForCoordinates(newYorkLat, newYorkLon, 'New York');
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 transition-colors duration-300">
    <!-- Main container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <header class="text-center mb-12">
        <div class="mb-6 flex justify-center">
          <div class="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Weather</span> Dashboard
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Real-time weather information for anywhere in the world
        </p>
        
        <!-- Search bar -->
        <SearchBar />
      </header>
      
      <!-- Content grid with increased spacing -->
      <main class="grid gap-8">
        <!-- Current weather section -->
        <section>
          <CurrentWeather />
        </section>
        
        <!-- Forecasts -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HourlyForecast />
          <DailyForecast />
        </section>
        
        <!-- Chart and Map -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeatherChart />
          <WeatherMap />
        </section>
      </main>
      
      <!-- Footer -->
      <footer class="mt-16 py-8 text-center border-t border-gray-200 dark:border-gray-800">
        <p class="text-gray-600 dark:text-gray-400">
          Data provided by 
          <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">
            OpenWeather API
          </a>
        </p>
        <p class="mt-3 text-gray-500 dark:text-gray-500">
          Created with Vue.js 3, Tailwind CSS, Chart.js and Leaflet
        </p>
      </footer>
      
      <!-- Error alert -->
      <ErrorAlert />
    </div>
  </div>
</template>

<style>
/* Custom font loading for better typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
</style>
