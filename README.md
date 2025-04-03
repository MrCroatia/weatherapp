# Weather Dashboard

A modern, responsive weather dashboard application built with Vue.js 3, Tailwind CSS, Chart.js, and Leaflet.

![Weather Dashboard Screenshot](screenshot.png)

## Features

- **Real-time Weather Data**: Fetches current weather conditions and forecasts from the OpenWeather API
- **Geolocation Support**: Uses the browser's Geolocation API to get the user's current location
- **Search Functionality**: Search for any location by city name or zip code with autocomplete suggestions
- **Interactive Map**: Displays the selected location on an interactive map with smooth animations
- **Data Visualization**: Shows temperature trends in a beautiful chart
- **Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Dark Mode Support**: Adapts to the user's system theme preference

## Technologies Used

- **Vue.js 3**: With Composition API and `<script setup>` syntax
- **TypeScript**: For type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Chart.js**: For data visualization
- **Leaflet**: For the interactive map
- **Axios**: For making API requests

## Setup Instructions

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn
- An OpenWeather API key (sign up at [OpenWeather](https://openweathermap.org/))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weatherapp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenWeather API key to the `.env` file:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173/`.

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed to a static site hosting service like Vercel or Netlify.

## Deployment

This application is designed to be deployed as a static site. You can deploy it to services like:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

### Deploying to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

Make sure to configure the environment variables (API key) in your Vercel project settings.

## License

[MIT](LICENSE)
