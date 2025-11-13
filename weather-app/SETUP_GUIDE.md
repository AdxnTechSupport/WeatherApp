# Quick Setup Guide

## Get Started in 5 Minutes

### Step 1: Get Your OpenWeatherMap API Key
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (it's free!)
3. Verify your email
4. Go to your API keys section
5. Copy your API key

### Step 2: Add API Key to the App
1. Open the `.env` file in the `weather-app` folder
2. Replace the empty value with your API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
3. Save the file

### Step 3: Run the App
Open your terminal and run:
```bash
cd weather-app
npm run dev
```

### Step 4: Open in Browser
Open your browser and go to: `http://localhost:5173`

## That's It!

You should now see the weather app running. Try:
- Searching for a city: "London"
- Using a zip code: "10001"
- Using coordinates: "51.5074,-0.1278"
- Clicking "Use My Location"

## Troubleshooting

**Problem**: API key not working
- Make sure you saved the `.env` file
- Wait 10-15 minutes after creating your API key (activation time)
- Restart the dev server (`Ctrl+C` then `npm run dev`)

**Problem**: Location not found
- Check your spelling
- Try a different format (city name instead of zip code)
- Make sure you have an active internet connection

**Problem**: Geolocation not working
- Make sure you allowed location permissions in your browser
- Some browsers block location on localhost - try Chrome or Firefox

## Need Help?
Check the full README.md for detailed documentation and troubleshooting.
