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

// Attempt to get the user's location on initial load
onMounted(() => {
  weatherStore.getWeatherForCurrentLocation();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Main container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          <span class="text-primary">Weather</span> Dashboard
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Real-time weather information for anywhere in the world
        </p>
        
        <!-- Search bar -->
        <SearchBar />
      </header>
      
      <!-- Content grid -->
      <main class="grid gap-6">
        <!-- Current weather section -->
        <section>
          <CurrentWeather />
        </section>
        
        <!-- Forecasts -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HourlyForecast />
          <DailyForecast />
        </section>
        
        <!-- Chart and Map -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherChart />
          <WeatherMap />
        </section>
      </main>
      
      <!-- Footer -->
      <footer class="mt-12 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>
          Data provided by 
          <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
            OpenWeather API
          </a>
        </p>
        <p class="mt-2">
          Created with Vue.js 3, Tailwind CSS, Chart.js and Leaflet
        </p>
      </footer>
      
      <!-- Error alert -->
      <ErrorAlert />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
