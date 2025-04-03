<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useWeatherStore } from '../stores/weatherStore';
import { formatDate } from '../services/weatherApi';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const weatherStore = useWeatherStore();
const { state } = weatherStore;

// Reactive chart data
const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Temperature',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#3b82f6',
      pointRadius: 4,
      tension: 0.3,
      fill: true,
      data: [] as number[]
    }
  ]
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          let label = '';
          
          if (context.dataset.label) {
            label += context.dataset.label + ': ';
          }
          
          if (context.parsed.y !== null) {
            const temp = context.parsed.y;
            const unit = state.unit === 'metric' ? '°C' : '°F';
            label += Math.round(temp) + unit;
          }
          
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      },
      ticks: {
        callback: function(value: any) {
          return value + (state.unit === 'metric' ? '°C' : '°F');
        }
      }
    }
  }
};

// Helper function to convert temperatures if needed
const getTemperature = (temp: number) => {
  return state.unit === 'metric' ? temp : temp * 9/5 + 32;
};

// Update chart data when forecast changes or unit changes
const updateChartData = () => {
  if (!state.forecast) return;
  
  const hourlyData = state.forecast.hourly.slice(0, 12);
  
  chartData.value = {
    labels: hourlyData.map(hour => formatDate(hour.dt, 'time')),
    datasets: [
      {
        ...chartData.value.datasets[0],
        data: hourlyData.map(hour => getTemperature(hour.temp))
      }
    ]
  };
};

// Watch for changes in forecast or unit
watch(() => [state.forecast, state.unit], updateChartData, { immediate: true });

// Component height
const chartHeight = ref(250);

// Handle window resize
const handleResize = () => {
  if (window.innerWidth < 640) {
    chartHeight.value = 200;
  } else {
    chartHeight.value = 250;
  }
};

// Setup event listeners
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  updateChartData();
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-4 dark:bg-gray-800">
    <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Temperature Trend</h3>
    
    <!-- Loading state -->
    <div v-if="weatherStore.isLoading" class="flex justify-center py-6" :style="{ height: `${chartHeight}px` }">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Chart -->
    <div v-else-if="state.forecast && chartData.labels.length > 0" :style="{ height: `${chartHeight}px` }">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    
    <!-- No data state -->
    <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400" :style="{ height: `${chartHeight}px` }">
      <p>No temperature data available</p>
    </div>
  </div>
</template> 