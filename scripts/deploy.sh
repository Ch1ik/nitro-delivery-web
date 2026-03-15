#!/bin/bash

# 🚀 Nitro Delivery Platform Deployment Script
# This script automates deployment to Railway (backend) and Vercel (frontend)

set -e

echo "🚀 Starting Nitro Delivery Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    if [ "$(printf '%s\n' "$NODE_VERSION" "$REQUIRED_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        print_error "Node.js version $NODE_VERSION is too old. Please upgrade to 18+"
        exit 1
    fi
    
    # Check if git is initialized
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Git repository not initialized. Please run 'git init'"
        exit 1
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_success "Prerequisites check passed ✓"
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    # Login to Railway if not already logged in
    if ! railway whoami &> /dev/null; then
        print_status "Please login to Railway..."
        railway login
    fi
    
    # Deploy to Railway
    railway up
    
    if [ $? -eq 0 ]; then
        print_success "Backend deployed to Railway ✓"
        
        # Get the Railway URL
        BACKEND_URL=$(railway domain --service 2>/dev/null || echo "https://your-project.railway.app")
        print_status "Backend URL: $BACKEND_URL"
    else
        print_error "Backend deployment failed"
        exit 1
    fi
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    # Build the frontend first
    print_status "Building frontend..."
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Frontend build failed"
        exit 1
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Vercel ✓"
    else
        print_error "Frontend deployment failed"
        exit 1
    fi
}

# Run health checks
health_check() {
    print_status "Running health checks..."
    
    # Check backend health
    if [ ! -z "$BACKEND_URL" ]; then
        BACKEND_URL="https://your-project.railway.app"
    fi
    
    print_status "Checking backend health at $BACKEND_URL/health"
    
    # Wait a moment for deployment to settle
    sleep 10
    
    # Try health check (with timeout)
    if command -v curl &> /dev/null; then
        if curl -f -s --max-time 30 "$BACKEND_URL/health" > /dev/null; then
            print_success "Backend health check passed ✓"
        else
            print_warning "Backend health check failed. Please check Railway logs."
        fi
    else
        print_warning "curl not available. Skipping health check."
    fi
}

# Main deployment flow
main() {
    echo "🚀 Nitro Delivery Platform Deployment Script"
    echo "=========================================="
    
    check_prerequisites
    
    # Ask what to deploy
    echo ""
    echo "What would you like to deploy?"
    echo "1) Backend only (Railway)"
    echo "2) Frontend only (Vercel)"
    echo "3) Both (Backend + Frontend)"
    echo "4) Exit"
    echo ""
    read -p "Choose an option (1-4): " -n 1 -r choice
    
    case $choice in
        1)
            deploy_backend
            health_check
            ;;
        2)
            deploy_frontend
            ;;
        3)
            deploy_backend
            deploy_frontend
            health_check
            ;;
        4)
            print_status "Deployment cancelled."
            exit 0
            ;;
        *)
            print_error "Invalid option"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Deployment completed! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment variables in Railway and Vercel dashboards"
    echo "2. Update your Google Maps API key if needed"
    echo "3. Test the deployed applications"
    echo "4. Check logs for any issues"
    echo ""
    echo "Useful links:"
    echo "- Railway Dashboard: https://railway.app"
    echo "- Vercel Dashboard: https://vercel.com"
    echo "- Documentation: ./DEPLOYMENT.md"
}

# Handle script interruption
trap 'print_warning "Deployment interrupted by user"; exit 1' INT

# Run main function
main "$@"
