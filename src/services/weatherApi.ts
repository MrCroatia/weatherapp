import axios from 'axios';

// Constants
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Error class for API errors
export class WeatherApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'WeatherApiError';
    this.status = status;
  }
}

// Types
export interface GeoLocation {
  lat: number;
  lon: number;
  name?: string;
  country?: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  dt: number;
  name?: string;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  feels_like: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number; // Probability of precipitation
}

export interface DailyForecast extends ForecastItem {
  temp_min: number;
  temp_max: number;
  sunrise: number;
  sunset: number;
}

export interface HourlyForecast extends ForecastItem {
  // No additional fields needed
}

export interface WeatherForecast {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

// Service functions
/**
 * Geocode a location name to coordinates
 */
export async function geocodeLocation(locationName: string): Promise<GeoLocation[]> {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: locationName,
        limit: 5,
        appid: API_KEY
      }
    });
    
    if (response.data.length === 0) {
      throw new WeatherApiError('Location not found', 404);
    }
    
    return response.data.map((item: any) => ({
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      country: item.country
    }));
  } catch (error: any) {
    if (error instanceof WeatherApiError) throw error;
    
    if (error.response) {
      throw new WeatherApiError(`API Error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
    }
    
    throw new WeatherApiError(`Network Error: ${error.message}`);
  }
}

/**
 * Get current weather for coordinates
 */
export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY
      }
    });
    
    return {
      temp: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      wind_speed: response.data.wind.speed,
      weather: response.data.weather,
      dt: response.data.dt,
      name: response.data.name
    };
  } catch (error: any) {
    if (error.response) {
      throw new WeatherApiError(`API Error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
    }
    
    throw new WeatherApiError(`Network Error: ${error.message}`);
  }
}

/**
 * Get weather forecast (hourly and daily) for coordinates
 */
export async function getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast> {
  try {
    const response = await axios.get(`${BASE_URL}/onecall`, {
      params: {
        lat,
        lon,
        exclude: 'minutely,alerts',
        units: 'metric',
        appid: API_KEY
      }
    });
    
    // Process hourly data (next 24 hours)
    const hourly = response.data.hourly.slice(0, 24).map((item: any) => ({
      dt: item.dt,
      temp: item.temp,
      feels_like: item.feels_like,
      weather: item.weather,
      pop: item.pop
    }));
    
    // Process daily data (next 7 days)
    const daily = response.data.daily.slice(0, 7).map((item: any) => ({
      dt: item.dt,
      temp: item.temp.day,
      temp_min: item.temp.min,
      temp_max: item.temp.max,
      feels_like: item.feels_like.day,
      weather: item.weather,
      pop: item.pop,
      sunrise: item.sunrise,
      sunset: item.sunset
    }));
    
    return { hourly, daily };
  } catch (error: any) {
    if (error.response) {
      throw new WeatherApiError(`API Error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
    }
    
    throw new WeatherApiError(`Network Error: ${error.message}`);
  }
}

/**
 * Get weather icon URL
 */
export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

/**
 * Format temperature with unit
 */
export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  return `${Math.round(temp)}°${unit}`;
}

/**
 * Format date from unix timestamp
 */
export function formatDate(unixTimestamp: number, format: 'full' | 'day' | 'time' = 'full'): string {
  const date = new Date(unixTimestamp * 1000);
  
  if (format === 'day') {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  }
  
  if (format === 'time') {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
} 