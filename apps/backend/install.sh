#!/bin/bash

echo "🚀 ADLgo Backend - Installation & Setup"
echo "========================================"
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from apps/backend directory."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "📦 Step 2: Installing new security & testing packages..."
npm install bcrypt @types/bcrypt @nestjs/swagger @nestjs/throttler

echo ""
echo "📦 Step 3: Installing testing dependencies..."
npm install --save-dev @nestjs/testing supertest @types/supertest

echo ""
echo "📄 Step 4: Setting up environment file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  Please edit .env with your actual values!"
else
    echo "ℹ️  .env file already exists, skipping..."
fi

echo ""
echo "🧪 Step 5: Running tests..."
npm test

echo ""
echo "✅ Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database and API credentials"
echo "2. Run 'npm run start:dev' to start the development server"
echo "3. Visit http://localhost:3000/api/docs for Swagger documentation"
echo "4. Visit http://localhost:3000/health for health check"
echo ""
echo "🎉 Happy coding!"
