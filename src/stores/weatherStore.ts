import { ref, reactive, computed } from 'vue';
import { 
  geocodeLocation, 
  getCurrentWeather, 
  getWeatherForecast,
  type GeoLocation,
  type CurrentWeather,
  type WeatherForecast,
  WeatherApiError
} from '../services/weatherApi';
import { getCurrentPosition, GeolocationError } from '../utils/geolocation';

// State interface
interface WeatherState {
  currentLocation: GeoLocation | null;
  currentWeather: CurrentWeather | null;
  forecast: WeatherForecast | null;
  searchResults: GeoLocation[];
  searchQuery: string;
  loading: {
    location: boolean;
    weather: boolean;
    forecast: boolean;
    search: boolean;
  };
  error: string | null;
  unit: 'metric' | 'imperial';
}

// Create state
const state = reactive<WeatherState>({
  currentLocation: null,
  currentWeather: null,
  forecast: null,
  searchResults: [],
  searchQuery: '',
  loading: {
    location: false,
    weather: false,
    forecast: false,
    search: false
  },
  error: null,
  unit: 'metric'
});

// Error handler
const handleError = (error: unknown) => {
  if (error instanceof WeatherApiError) {
    state.error = `Weather API Error: ${error.message}`;
  } else if (error instanceof GeolocationError) {
    state.error = `Geolocation Error: ${error.message}`;
  } else if (error instanceof Error) {
    state.error = `Error: ${error.message}`;
  } else {
    state.error = 'An unknown error occurred';
  }
  console.error(state.error, error);
};

// Actions
export const weatherActions = {
  /**
   * Get weather for the user's current location
   */
  async getWeatherForCurrentLocation() {
    state.loading.location = true;
    state.error = null;
    
    try {
      // Get user's location
      const position = await getCurrentPosition();
      await this.getWeatherForCoordinates(position.latitude, position.longitude);
    } catch (error) {
      handleError(error);
    } finally {
      state.loading.location = false;
    }
  },
  
  /**
   * Get weather data for coordinates
   */
  async getWeatherForCoordinates(lat: number, lon: number, locationName?: string) {
    state.loading.weather = true;
    state.loading.forecast = true;
    state.error = null;
    
    try {
      // Set current location
      state.currentLocation = {
        lat,
        lon,
        name: locationName
      };
      
      // Get current weather and forecast in parallel
      const [weather, forecast] = await Promise.all([
        getCurrentWeather(lat, lon),
        getWeatherForecast(lat, lon)
      ]);
      
      state.currentWeather = weather;
      state.forecast = forecast;
      
      // Update location name if it wasn't provided but is available in the weather response
      if (!locationName && weather.name) {
        state.currentLocation.name = weather.name;
      }
    } catch (error) {
      handleError(error);
    } finally {
      state.loading.weather = false;
      state.loading.forecast = false;
    }
  },
  
  /**
   * Search for locations by name
   */
  async searchLocations(query: string) {
    if (!query.trim()) {
      state.searchResults = [];
      return;
    }
    
    state.loading.search = true;
    state.error = null;
    
    try {
      const locations = await geocodeLocation(query);
      state.searchResults = locations;
    } catch (error) {
      handleError(error);
      state.searchResults = [];
    } finally {
      state.loading.search = false;
    }
  },
  
  /**
   * Select a location from search results
   */
  async selectLocation(location: GeoLocation) {
    await this.getWeatherForCoordinates(location.lat, location.lon, location.name);
    state.searchResults = [];
    state.searchQuery = '';
  },
  
  /**
   * Clear error message
   */
  clearError() {
    state.error = null;
  },
  
  /**
   * Toggle temperature unit
   */
  toggleUnit() {
    state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
  }
};

// Getters
export const weatherGetters = {
  isLoading: computed(() => 
    state.loading.location || 
    state.loading.weather || 
    state.loading.forecast
  ),
  
  isSearching: computed(() => state.loading.search),
  
  hasCurrentWeather: computed(() => !!state.currentWeather),
  
  hasForecast: computed(() => !!state.forecast),
  
  hasError: computed(() => !!state.error),
  
  temperatureUnit: computed(() => state.unit === 'metric' ? 'C' : 'F'),
  
  formattedCurrentTemperature: computed(() => {
    if (!state.currentWeather) return '';
    const temp = state.unit === 'metric' 
      ? state.currentWeather.temp 
      : state.currentWeather.temp * 9/5 + 32;
    return `${Math.round(temp)}°${state.unit === 'metric' ? 'C' : 'F'}`;
  }),
  
  formattedFeelsLike: computed(() => {
    if (!state.currentWeather) return '';
    const temp = state.unit === 'metric' 
      ? state.currentWeather.feels_like 
      : state.currentWeather.feels_like * 9/5 + 32;
    return `${Math.round(temp)}°${state.unit === 'metric' ? 'C' : 'F'}`;
  })
};

// Expose the state and actions
export const useWeatherStore = () => {
  return {
    state,
    ...weatherActions,
    ...weatherGetters
  };
}; 