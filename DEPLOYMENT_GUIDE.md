# Deployment Guide - Live Demo Links

Follow these steps to deploy your weather app and get live URLs for submission.

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 1.2 Deploy Backend
1. Click **"New +"** button → Select **"Web Service"**
2. Connect your GitHub repository: `WeatherApp`
3. Configure the service:
   - **Name**: `weather-app-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

### 1.3 Set Environment Variables
In the "Environment" section, add these variables:

```
DATABASE_URL=postgresql://postgres:Dyk6X5GauJEZqJVC@db.lvpnmhbclkwutraecaeq.supabase.co:5432/postgres
CORS_ORIGINS=https://your-frontend-url.vercel.app
ENVIRONMENT=production
```

**Important**: You'll need to update `CORS_ORIGINS` after deploying the frontend

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. Copy your backend URL (e.g., `https://weather-app-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### 2.2 Deploy Frontend
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `WeatherApp`
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `weather-app`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 2.3 Set Environment Variables
Add these environment variables:

```
VITE_OPENWEATHER_API_KEY=9d1f72be9ca24b38857175646251211
VITE_BACKEND_URL=https://weather-app-backend.onrender.com
```

Replace the backend URL with your actual Render URL from Step 1.4

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Copy your frontend URL (e.g., `https://weather-app-xyz.vercel.app`)

## Step 3: Update CORS Settings

### 3.1 Update Backend CORS
1. Go back to Render dashboard
2. Open your `weather-app-backend` service
3. Go to **"Environment"** tab
4. Update `CORS_ORIGINS` with your Vercel URL:
   ```
   CORS_ORIGINS=https://weather-app-xyz.vercel.app
   ```
5. Save changes (this will redeploy the backend)

### 3.2 Update Frontend API URL
1. You've already set `VITE_BACKEND_URL` in Vercel
2. Vercel will automatically redeploy when you update environment variables

## Step 4: Update Code to Use Environment Variable

The frontend needs to use the environment variable for the backend URL. This should already be in your code, but verify:

In `weather-app/src/utils/backendApi.js`, the first line should be:
```javascript
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/weather';
```

If not, update it and push to GitHub. Vercel will auto-redeploy.

## Step 5: Test Your Deployment

1. Open your Vercel URL in a browser
2. Search for a location
3. Verify:
   - Weather displays correctly
   - 5-day forecast shows
   - Search saves to history (Supabase)
   - All features working

## Your Live URLs

After deployment, you'll have:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://weather-app-backend.onrender.com
- **Backend API Docs**: https://weather-app-backend.onrender.com/docs
- **Database**: Supabase (already configured)

## Submission

Submit these to PM Accelerator:
1. **GitHub Repository**: https://github.com/AdxnTechSupport/WeatherApp.git
2. **Live Demo**: https://your-app.vercel.app
3. **Demo Video**: [Your video link]

## Troubleshooting

### Frontend can't connect to backend
- Check CORS_ORIGINS in Render includes your Vercel URL
- Check VITE_BACKEND_URL in Vercel is correct
- Wait 1-2 minutes after updating environment variables

### Backend won't start
- Check DATABASE_URL is correct in Render
- Check all environment variables are set
- View logs in Render dashboard

### Database not saving
- Verify Supabase connection string is correct
- Check backend logs for database errors
- Ensure weather_queries table exists in Supabase
