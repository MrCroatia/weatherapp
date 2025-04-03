/**
 * Interface for geolocation coordinates
 */
export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Error class for geolocation errors
 */
export class GeolocationError extends Error {
  code: number;
  
  constructor(message: string, code: number) {
    super(message);
    this.name = 'GeolocationError';
    this.code = code;
  }
}

/**
 * Get current position using the browser's Geolocation API
 * Returns a promise that resolves to the user's coordinates
 */
export async function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new GeolocationError('Geolocation is not supported by your browser', 0));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let message = 'An unknown error occurred while retrieving location';
        
        if (error.code === 1) {
          message = 'Location access was denied by the user';
        } else if (error.code === 2) {
          message = 'Location information is unavailable';
        } else if (error.code === 3) {
          message = 'The request to get user location timed out';
        }
        
        reject(new GeolocationError(message, error.code));
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
} 