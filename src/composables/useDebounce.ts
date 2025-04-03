import { ref, watch } from 'vue';

/**
 * Debounce a value with a specified delay
 * 
 * @param value The reactive value to debounce
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns A reactive debounced value
 */
export function useDebounce<T>(value: T, delay = 500) {
  const debouncedValue = ref(value) as typeof value;
  let timeout: number | undefined;
  
  watch(() => value, (newValue) => {
    // Clear any existing timeout
    if (timeout) {
      clearTimeout(timeout);
    }
    
    // Set a new timeout
    timeout = window.setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  }, { immediate: true });
  
  return debouncedValue;
}

/**
 * Create a debounced function that delays invoking the provided function
 * 
 * @param fn The function to debounce
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T, 
  delay = 500
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
} 