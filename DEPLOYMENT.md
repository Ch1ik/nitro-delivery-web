# 🚀 Deployment Guide

This guide covers deploying the Nitro Delivery platform to production with Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- **Node.js 18+** installed
- **Git** repository set up
- **Vercel account** (free)
- **Railway account** (free tier available)
- **Environment variables** configured

## 🔧 Environment Variables

### Backend (Railway)
```bash
# Required
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Optional
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-sendgrid-api-key
```

### Frontend (Vercel)
```bash
# Required
VITE_API_URL=https://your-backend-domain.railway.app

# Optional
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🚀 Backend Deployment (Railway)

### 1. Prepare Your Repository
Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Connect your GitHub repository
4. Select the `nitro-delivery-web` repository
5. Railway will automatically detect the Node.js application

### 3. Configure Environment Variables
In Railway dashboard:
1. Go to your project settings
2. Add environment variables:
   - `JWT_SECRET`: Generate a strong secret key
   - `FRONTEND_URL`: Your Vercel domain (will get after frontend deployment)
   - `PORT`: `4000`
   - `NODE_ENV`: `production`

### 4. Deploy
- Railway will automatically build and deploy
- Your API will be available at: `https://your-project-name.railway.app`

## 🌐 Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Build and Deploy
```bash
# From project root
vercel --prod
```

### 3. Configure Environment Variables
During first deployment, Vercel will prompt for:
- `VITE_API_URL`: Your Railway backend URL
- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key (optional)

### 4. Post-Deployment Configuration
After deployment:
1. Go to [vercel.com](https://vercel.com)
2. Find your project
3. Go to Settings → Environment Variables
4. Add any missing variables

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service-name: nitro-delivery-api

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🔍 Verification

### Backend Health Check
```bash
curl https://your-backend-domain.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-16T12:00:00.000Z"
}
```

### Frontend Access
Visit your Vercel domain and verify:
- Login works
- Dashboard loads
- Real-time updates function
- Maps display (if API key configured)

## 🛠️ Troubleshooting

### Common Issues

#### CORS Errors
```bash
# Ensure FRONTEND_URL is correctly set
# Check Vercel domain matches Railway allowed origins
```

#### WebSocket Connection Issues
```bash
# Verify WebSocket port is accessible
# Check firewall settings on Railway
# Ensure frontend uses correct API URL
```

#### Database Issues
```bash
# Railway uses ephemeral storage
# Database will be recreated on each deployment
# Consider Railway's PostgreSQL for production
```

#### Build Failures
```bash
# Check Node.js version compatibility
# Verify all dependencies are installed
# Check build logs in Railway dashboard
```

## 📊 Monitoring

### Railway
- Built-in metrics and logs
- Health checks every 30s
- Error tracking and alerts

### Vercel
- Real-time logs
- Performance metrics
- Analytics integration available

## 🔐 Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Both platforms enforce HTTPS
3. **Rate Limiting**: Consider implementing rate limiting
4. **Input Validation**: Ensure all inputs are validated
5. **JWT Security**: Use strong secrets and rotate regularly

## 📱 Mobile App Deployment

The platform is mobile-ready and can be:
- Deployed as PWA for mobile app experience
- Wrapped with React Native or Capacitor
- Accessed via mobile browsers with full functionality

## 🔄 Updates and Maintenance

### Zero-Downtime Deployment
```bash
# Railway: Automatic rolling updates
# Vercel: Instant atomic deployments
```

### Database Migrations
```bash
# Current setup uses SQLite with seed data
# For production, consider PostgreSQL
# Implement proper migration system
```

## 📞 Support

- **Railway Documentation**: https://docs.railway.app
- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Issues**: Report issues in repository
- **Community**: Join our Discord for support

---

**🎉 Congratulations!** Your Nitro Delivery platform is now ready for production deployment with real-time tracking, driver management, and comprehensive analytics.
