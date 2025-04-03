<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';
import 'leaflet/dist/leaflet.css';

const weatherStore = useWeatherStore();
const { state } = weatherStore;

// Map container ref
const mapContainer = ref<HTMLElement | null>(null);
// Leaflet map instance
let map: any = null;
// Marker instance
let marker: any = null;

// Initialize map
const initMap = () => {
  if (!mapContainer.value) return;
  
  // Import Leaflet dynamically to avoid SSR issues
  import('leaflet').then((L) => {
    // Create map if not exists
    if (!map) {
      // Default coordinates
      const defaultLat = 40.7128;
      const defaultLng = -74.0060;
      
      // Create map instance
      map = L.map(mapContainer.value).setView([defaultLat, defaultLng], 10);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);
      
      // Fix icon issues
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });
      
      // Add initial marker
      marker = L.marker([defaultLat, defaultLng], { icon }).addTo(map);
      
      // Update map on resize
      window.addEventListener('resize', () => {
        if (map) {
          map.invalidateSize();
        }
      });
      
      // If we have a current location, update the map
      if (state.currentLocation) {
        updateMapPosition();
      }
    }
  });
};

// Update map position and marker
const updateMapPosition = () => {
  if (!map || !state.currentLocation) return;
  
  const { lat, lon: lng, name } = state.currentLocation;
  
  // Update marker position
  if (marker) {
    marker.setLatLng([lat, lng]);
    if (name) marker.bindPopup(name).openPopup();
  }
  
  // Fly to the location with animation
  map.flyTo([lat, lng], 10, {
    duration: 1.5,
    easeLinearity: 0.25
  });
};

// Watch for changes in current location
watch(() => state.currentLocation, updateMapPosition, { deep: true });

// Lifecycle hooks
onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800">
    <h3 class="text-xl font-semibold p-4 text-gray-800 dark:text-white">Location Map</h3>
    
    <!-- Map container -->
    <div 
      ref="mapContainer" 
      class="h-80 w-full relative"
    ></div>
    
    <!-- Loading overlay -->
    <div 
      v-if="weatherStore.isLoading" 
      class="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center"
      style="top: 0; left: 0; right: 0; bottom: 0; z-index: 1000;"
    >
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the map container takes full width/height */
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
}
</style> 