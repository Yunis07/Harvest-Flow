# Harvest-Flow

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Harvest-Flow** is a comprehensive agri-fintech platform that leverages machine learning, real-time tracking, and climate intelligence to optimize agricultural supply chains. The platform connects farmers, buyers, sellers, and transporters through an intelligent marketplace with predictive analytics and risk management.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [What's Included](#whats-included)
- [What's Not Included](#whats-not-included)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Architecture](#project-architecture)
- [API Documentation](#api-documentation)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing Guide](#contributing-guide)
- [License](#license)

---

## Overview

Harvest-Flow is designed to modernize agricultural commerce by providing:

- **Intelligent Crop Recommendations**: ML-powered system analyzing soil, weather, and climate data
- **Risk Analysis Engine**: Monte Carlo simulations for production risk assessment
- **Real-time Order Tracking**: GPS-based logistics tracking and optimization
- **Multi-role Marketplace**: Separate interfaces for farmers, buyers, sellers, and transporters
- **Weather Intelligence**: Integration with real-time weather APIs for predictive analytics
- **Sowing & Transport Analytics**: Data-driven insights for optimal planning

---

## Project Structure

```
Harvest-Flow/
├── backend/
│   ├── data_pipeline/              # ETL processes for data ingestion
│   │   ├── generate_crop_requirements.py
│   │   ├── load_crop_production.py
│   │   └── load_soil_types.py
│   │
│   └── ml_model/                   # ML engine and Flask API
│       ├── app.py                  # Main Flask application
│       ├── crop_recommendation.py  # Crop suggestion engine
│       ├── predict.py              # Prediction utilities
│       ├── train.py                # Model training script
│       ├── feature_engineering.py  # Feature preprocessing
│       ├── sowing_analysis.py      # Sowing recommendations
│       ├── transport_analysis.py   # Transport optimization
│       ├── risk_utils.py           # Risk calculation utilities
│       ├── sowing_rules.py         # Sowing business logic
│       ├── transport_rules.py      # Transport business logic
│       │
│       ├── baseline/               # Service layer
│       │   ├── recommendation_service.py    # Crop recommendation service
│       │   ├── weather_service.py          # Weather API integration
│       │   ├── soil_service.py             # Soil data service
│       │   ├── sowing_service.py           # Sowing logic service
│       │   ├── transport_service.py        # Transport logic service
│       │   ├── monte_carlo_service.py      # Risk simulation service
│       │   └── confidence_service.py       # Confidence scoring
│       │
│       ├── data/                   # Sample datasets
│       │   ├── Crop_recommendation.csv
│       │   └── enhanced_crop_dataset.csv
│       │
│       └── test/                   # Unit tests
│           ├── test_crop_recommendation.py
│           ├── test_model.py
│           ├── test_sowing_service.py
│           └── ... (other tests)
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── layout/             # AppLayout, Sidebar, Header
│   │   │   ├── marketplace/        # ProductCard, ProductGrid
│   │   │   ├── order/              # OrderChat, OrderStatus
│   │   │   ├── shared/             # MapComponent, RoleSwitcher
│   │   │   └── ui/                 # shadcn/ui primitives
│   │   │
│   │   ├── contexts/               # React Context API
│   │   │   ├── AuthContext.tsx     # Authentication & roles
│   │   │   ├── AppStateContext.tsx # Global app state
│   │   │   ├── LanguageContext.tsx # i18n support
│   │   │   └── NotificationContext.tsx
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useLocationTracking.ts    # GPS tracking
│   │   │   ├── useOrderSystem.ts         # Order management
│   │   │   ├── useOsrmRoutes.ts         # Route optimization
│   │   │   └── useGroupChat.ts          # Real-time messaging
│   │   │
│   │   ├── lib/                    # Utility libraries
│   │   │   ├── api.ts              # API client
│   │   │   ├── firebase.ts         # Firebase configuration
│   │   │   ├── cropService.ts      # Crop data service
│   │   │   ├── weatherService.ts   # Weather API client
│   │   │   ├── geo.ts              # Geolocation utilities
│   │   │   └── utils.ts            # Helper functions
│   │   │
│   │   ├── pages/                  # Page components
│   │   │   ├── AuthPage.tsx             # Login/Register
│   │   │   ├── LandingPage.tsx          # Home page
│   │   │   ├── DashboardPage.tsx        # Role-based dashboard
│   │   │   ├── MarketplacePage.tsx      # Product marketplace
│   │   │   ├── LiveTrackingPage.tsx     # Order tracking
│   │   │   ├── RiskEnginePage.tsx       # Risk analysis
│   │   │   ├── PredictPage.tsx          # Crop prediction
│   │   │   ├── SellerInventoryPage.tsx  # Seller products
│   │   │   └── ... (other pages)
│   │   │
│   │   ├── data/                   # Mock data
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── App.tsx                 # Root component
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Global styles
│   │
│   ├── public/                     # Static assets
│   ├── package.json                # Node dependencies
│   ├── vite.config.ts              # Vite configuration
│   ├── tailwind.config.ts          # Tailwind CSS config
│   ├── tsconfig.json               # TypeScript config
│   ├── vitest.config.ts            # Test configuration
│   └── DEVELOPER_GUIDE.md          # Frontend development guide
│
├── LICENSE                         # MIT License
├── README.md                       # Original project README
└── README_PROFESSIONAL.md          # This file

```

---

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **ML Libraries**: scikit-learn, pandas, numpy
- **Data Processing**: pandas, joblib
- **REST API**: Flask-CORS for cross-origin support
- **Environment**: Python 3.8+, dotenv for configuration
- **Testing**: pytest, unittest
- **Utilities**: OpenWeather API integration

### Frontend
- **Runtime**: Node.js 16+
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API, TanStack Query
- **Routing**: React Router
- **Maps**: Leaflet.js for geospatial features
- **Testing**: Vitest
- **Backend Integration**: Firebase Realtime Database
- **APIs**: OpenWeather, OSRM (route optimization)

---

## Features

### ✅ What's Included

#### Backend Features
- ✅ **Crop Recommendation Engine** - ML-based crop suggestion using soil & weather data
- ✅ **Risk Analysis** - Monte Carlo simulations for production risk assessment
- ✅ **Sowing Analytics** - Optimal sowing time and methods recommendations
- ✅ **Transport Analytics** - Route optimization and logistics analysis
- ✅ **Weather Integration** - Real-time weather data fetching and analysis
- ✅ **Soil Analysis Service** - Soil type and property assessment
- ✅ **Confidence Scoring** - Prediction confidence metrics
- ✅ **REST API** - Full CORS-enabled REST endpoints
- ✅ **Data Pipeline** - ETL processes for crop production, soil types, and requirements
- ✅ **Model Training** - RandomForest-based model with scikit-learn

#### Frontend Features
- ✅ **Multi-Role Authentication** - Farmer, Buyer, Seller, Transporter roles
- ✅ **Marketplace** - Product listings and e-commerce functionality
- ✅ **Live Order Tracking** - Real-time GPS-based order tracking
- ✅ **Risk Engine Dashboard** - Visual risk analysis and metrics
- ✅ **Crop Prediction** - Interactive crop recommendation interface
- ✅ **Seller Inventory** - Product management for sellers
- ✅ **Transporter Earnings** - Earnings tracking and analytics
- ✅ **Group Chat** - Real-time messaging between orders
- ✅ **Weather Display** - Live weather information and forecasts
- ✅ **Location-Based Services** - Nearby contacts and geolocation features
- ✅ **Ugly Produce Deals** - Flash deals for quality-variant produce
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- ✅ **Role-Based Navigation** - Customized UI per user role

---

## What's Not Included

### Features to Implement
- ❌ **Payment Gateway Integration** - Stripe/Razorpay payment processing (skeleton only)
- ❌ **Email Notifications** - Automated email alerts and confirmations
- ❌ **SMS Integration** - SMS-based order and alert notifications
- ❌ **PDF Report Generation** - Invoice and analytics PDF exports
- ❌ **Advanced Analytics Dashboard** - Comprehensive analytics and reporting UI
- ❌ **Machine Learning Model Deployment** - Production-grade model serving (MLOps)
- ❌ **CI/CD Pipeline** - Automated testing and deployment workflows
- ❌ **Database Layer** - Persistent database (currently uses Firebase & CSV)
- ❌ **Authentication Password Encryption** - Secure password hashing in production
- ❌ **Rate Limiting** - API endpoint rate limiting
- ❌ **Caching Layer** - Redis/Memcached caching
- ❌ **Docker Containerization** - Docker images for deployment
- ❌ **Kubernetes Orchestration** - K8s deployment configurations

### Known Limitations
- Data is stored in CSV files and Firebase (not production-ready for scale)
- ML model is trained on small dataset (requires data augmentation)
- Authentication is basic role-based (no JWT tokens or OAuth)
- Real-time features depend on Firebase limitations
- No API authentication or API keys required (security risk for production)
- Limited error handling and validation in some endpoints

---

## Prerequisites

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Disk Space**: 2GB minimum (1GB for dependencies)
- **RAM**: 4GB minimum recommended

### Required Software
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** - Included with Node.js
- **Git** - [Download](https://git-scm.com/)

### API Keys Required
- **OpenWeather API Key** - Free tier at [openweathermap.org](https://openweathermap.org/api)

### Optional Tools
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- **Postman** - [Download](https://www.postman.com/downloads/) for API testing
- **Git Bash** (Windows) - For better terminal experience

---

## Installation & Setup

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend/ml_model
```

#### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install --upgrade pip
pip install flask flask-cors python-dotenv pandas scikit-learn numpy joblib
```

**Full dependency list:**
```bash
pip install \
    Flask==2.3.3 \
    Flask-CORS==4.0.0 \
    python-dotenv==1.0.0 \
    pandas==2.0.3 \
    scikit-learn==1.3.0 \
    numpy==1.24.3 \
    joblib==1.3.1 \
    requests==2.31.0
```

#### Step 4: Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# backend/.env
WEATHER_API_KEY=your_openweather_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Where to get API keys:**
1. OpenWeather API Key:
   - Go to [openweathermap.org/users/register](https://openweathermap.org/users/register)
   - Create free account
   - Navigate to API keys section
   - Copy your API key to `.env`

#### Step 5: Train the ML Model (Optional)
```bash
# Navigate to ml_model directory if not already there
python train.py
```

This will:
- Load training data from `data/enhanced_crop_dataset.csv`
- Engineer features using `feature_engineering.py`
- Train RandomForest classifier
- Save model to `crop_model.pkl`

**Note:** Skip this if you want to use pre-trained model.

#### Step 6: Verify Backend Setup
```bash
python app.py
```

Expected output:
```
Backend starting...
Weather API loaded: True
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

✅ Backend is ready at `http://localhost:5000`

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Node Dependencies
```bash
npm install
```

This installs all packages from `package.json` (~500MB):
- React & TypeScript
- Vite build tool
- Tailwind CSS & shadcn/ui
- React Router
- Firebase SDK
- TanStack Query
- Leaflet (maps)

**Installation time:** 2-5 minutes depending on internet speed

#### Step 3: Configure Environment Variables
Create a `.env.local` file in the `frontend/` directory:

```env
# frontend/.env.local
VITE_API_URL=http://localhost:5000
VITE_WEATHER_API_KEY=your_openweather_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_OSRM_API_URL=http://router.project-osrm.org
```

**Optional Setup:** If Firebase is not configured, the app will fall back to mock data.

#### Step 4: Verify Frontend Setup
```bash
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend is ready at `http://localhost:5173`

---

## Configuration

### Backend Configuration (backend/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `WEATHER_API_KEY` | OpenWeather API key for weather data | `abc123def456` |
| `FLASK_ENV` | Environment mode | `development` or `production` |
| `FLASK_DEBUG` | Enable debug mode | `True` or `False` |
| `FLASK_PORT` | Port to run Flask server | `5000` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |

### Frontend Configuration (frontend/.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_WEATHER_API_KEY` | OpenWeather API key | `abc123def456` |
| `VITE_FIREBASE_*` | Firebase configuration | Firebase console |
| `VITE_OSRM_API_URL` | Route optimization API | `http://router.project-osrm.org` |

### ML Model Configuration

Edit configuration in `backend/ml_model/app.py`:
```python
# Risk Analysis Parameters
MONTE_CARLO_ITERATIONS = 10000  # Number of simulations
CONFIDENCE_THRESHOLD = 0.75     # Minimum confidence score
```

---

## Running the Application

### Development Mode (Recommended for Development)

**Terminal 1: Start Backend**
```bash
cd backend/ml_model
python app.py
```
Wait for: `Running on http://127.0.0.1:5000`

**Terminal 2: Start Frontend**
```bash
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:5173/`

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000 (returns system status)

### Testing

**Backend Tests:**
```bash
cd backend/ml_model
pytest test_model.py -v           # Run model tests
pytest test_crop_recommendation.py -v  # Crop recommendation tests
pytest -v                         # Run all tests
```

**Frontend Tests:**
```bash
cd frontend
npm test                          # Run tests once
npm run test:watch              # Watch mode for TDD
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```
Creates optimized build in `frontend/dist/`

**Backend:**
No build step needed. Deploy `backend/ml_model/` directly with dependencies.

---

## Project Architecture

### Backend Architecture

```
REQUEST → Flask App (app.py)
    ↓
Route Handler (@app.route decorator)
    ↓
Input Validation & Request Parsing
    ↓
Service Layer (baseline/*.py)
    ├── RecommendationService → crop_recommendation.py
    ├── WeatherService → weather_service.py
    ├── SowingService → sowing_analysis.py
    ├── TransportService → transport_analysis.py
    └── MonteCarlo Service → risk_utils.py
    ↓
ML Model / Business Logic
    ├── Crop recommendations
    ├── Risk calculations
    ├── Sowing rules
    └── Transport optimization
    ↓
Response → JSON Response
```

### Frontend Architecture

```
Browser
    ↓
App.tsx (Root Component)
    ├── AuthContext (Global Auth State)
    ├── AppStateContext (Global App State)
    └── Router
        ├── Pages/ (Route Components)
        │   ├── LandingPage
        │   ├── AuthPage
        │   ├── DashboardPage
        │   ├── MarketplacePage
        │   └── ...
        │
        ├── Components/ (Reusable)
        │   ├── Layout
        │   ├── Marketplace
        │   ├── Order
        │   └── UI
        │
        └── Hooks/ (Logic)
            ├── useOrderSystem
            ├── useLocationTracking
            └── useGroupChat
            ↓
            API → Backend (http://localhost:5000)
```

### Data Flow

```
User Input
    ↓
React Component State Update
    ↓
API Call to Backend
    ↓
Flask Endpoint Processing
    ↓
ML Model / Service Logic
    ↓
JSON Response
    ↓
Frontend State Update & Re-render
    ↓
Updated UI
```

---

## API Documentation

### Base URL
```
http://localhost:5000
```

### Main Endpoints

#### 1. Health Check
```
GET /
Response: {"status": "Backend running", "weather_api_loaded": true, "engine": "Hybrid ML + Monte Carlo + Climate Intelligence v4"}
```

#### 2. Crop Recommendation
```
POST /risk-analysis
Content-Type: application/json

Request body:
{
  "soil_type": "Clay",
  "humidity": 65,
  "temperature": 25,
  "ph": 6.5,
  "rainfall": 800,
  "region": "Punjab",
  "season": "Kharif"
}

Response:
{
  "recommended_crop": "Rice",
  "confidence": 0.92,
  "soil_suitability": 0.88,
  "weather_compatibility": 0.95,
  "estimated_yield": "5.2 tonnes/hectare",
  "risk_factors": [...]
}
```

#### 3. Sowing Analysis
```
POST /sowing-analysis
Content-Type: application/json

Request body:
{
  "crop": "Wheat",
  "soil_type": "Loamy",
  "region": "Haryana",
  "current_date": "2024-01-15"
}

Response:
{
  "optimal_sowing_window": "Jan 15 - Feb 10",
  "current_readiness": 0.85,
  "recommended_quantity": "125 kg/hectare",
  "spacing": "22.5cm"
}
```

#### 4. Transport Analytics
```
POST /transport-analysis
Content-Type: application/json

Request body:
{
  "origin": {"lat": 31.5204, "lng": 74.3587},
  "destination": {"lat": 28.6139, "lng": 77.2090},
  "cargo_weight": 2500,
  "vehicle_type": "truck"
}

Response:
{
  "distance_km": 445,
  "estimated_time_hours": 8.5,
  "optimal_route": {...},
  "cost_estimate": 12500,
  "vehicle_recommendations": ["10-ton truck", "12-ton truck"]
}
```

**For detailed endpoint parameters and responses, refer to `backend/ml_model/app.py`**

---

## Development Guidelines

### Frontend Development

#### Adding a New Page
1. Create new file in `src/pages/NewPage.tsx`
2. Add TypeScript interface in `src/types/`
3. Import in `App.tsx`
4. Add route in Router configuration
5. Add navigation link in `Layout` component

Example:
```typescript
// src/pages/MyNewPage.tsx
import { useState } from 'react';

export function MyNewPage() {
  const [data, setData] = useState(null);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">My New Page</h1>
      {/* Your content */}
    </div>
  );
}
```

#### Adding a New Component
1. Create in `src/components/`
2. Use shadcn/ui components for UI primitives
3. Export from component's `index.ts` if in subfolder
4. Import and use in pages

#### Using TailwindCSS
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
    Click me
  </button>
</div>
```

#### Calling Backend API
```typescript
import { API_BASE_URL } from '@/lib/api';

// In component
const response = await fetch(`${API_BASE_URL}/risk-analysis`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

const result = await response.json();
```

### Backend Development

#### Adding a New Route
```python
# backend/ml_model/app.py

from baseline.my_service import MyService

@app.route("/my-endpoint", methods=["POST"])
def my_endpoint():
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('required_field'):
            return jsonify({"error": "Missing required_field"}), 400
        
        # Business logic
        result = MyService.process(data)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

#### Adding a New Service
```python
# backend/ml_model/baseline/my_service.py

class MyService:
    
    @staticmethod
    def process(data):
        """Process data and return results"""
        # Your logic here
        return {
            "status": "success",
            "data": data
        }
```

#### Writing Tests
```python
# backend/ml_model/test_my_module.py

import unittest
from my_module import MyClass

class TestMyClass(unittest.TestCase):
    
    def setUp(self):
        self.obj = MyClass()
    
    def test_functionality(self):
        result = self.obj.method()
        self.assertEqual(result, expected_value)

if __name__ == '__main__':
    unittest.main()
```

#### Code Style
- Follow PEP 8 for Python code
- Use type hints: `def function(param: str) -> dict:`
- Write docstrings: `"""Function description"""`
- Keep functions focused and modular

### Common Development Tasks

#### Update Frontend Dependencies
```bash
cd frontend
npm update              # Update all packages
npm install new-package  # Add new package
```

#### Update Backend Dependencies
```bash
# Add to requirements.txt manually, then:
pip install -r requirements.txt
```

#### Debug Flask Application
```bash
# In backend/.env set:
FLASK_DEBUG=True
FLASK_ENV=development

# Then run:
python app.py
```

#### Debug React Application
- Open http://localhost:5173
- Open DevTools (F12)
- Use React Developer Tools browser extension for component inspection

#### Lint & Format Code
```bash
# Frontend
cd frontend
npm run lint              # Check for issues
npm run lint -- --fix    # Auto-fix issues
```

---

## Troubleshooting

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution:**
```bash
pip install flask flask-cors
```
Verify installation:
```bash
python -c "import flask; print(flask.__version__)"
```

#### Issue: "WEATHER_API_KEY is None"
**Solution:**
1. Check `.env` file exists in `backend/` directory
2. Verify correct API key format
3. Verify `load_dotenv()` is called before using `os.getenv()`

```bash
# Test environment loading
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('WEATHER_API_KEY'))"
```

#### Issue: CORS Error - "Access to XMLHttpRequest blocked"
**Solution:**
1. Verify `CORS_ORIGINS` in `.env` matches frontend URL
2. Check Flask-CORS is installed: `pip install flask-cors`
3. Verify `CORS(app)` is called in `app.py`

```env
# backend/.env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Issue: Port 5000 already in use
**Solution:**
Find and kill process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

Or use different port:
```env
# backend/.env
FLASK_PORT=5001
```

#### Issue: Model file not found - "FileNotFoundError: crop_model.pkl"
**Solution:**
```bash
# Train model first
python train.py

# This creates:
# - crop_model.pkl
# - model_features.pkl
```

---

### Frontend Issues

#### Issue: "npm ERR! code ERESOLVE"
**Solution:**
```bash
npm install --legacy-peer-deps
```

#### Issue: Port 5173 already in use
**Solution:**
```bash
# Use different port
npm run dev -- --port 3000
```

#### Issue: "Cannot find module" errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

#### Issue: Blank page or "Cannot GET /"
**Solution:**
1. Verify Vite is running: Check terminal output for "Local: http://localhost:5173"
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (macOS)
3. Clear browser cache

#### Issue: Environment variables not loading
**Solution:**
1. File must be named `.env.local` (not `.env`)
2. Must be in `frontend/` root directory
3. Restart dev server after creating `.env.local`:
   ```bash
   npm run dev
   ```

#### Issue: Backend API calls failing (CORS or connection refused)
**Solution:**
1. Verify backend is running: `python app.py`
2. Check `VITE_API_URL` in `.env.local`: `http://localhost:5000`
3. Verify network tab in DevTools shows request to correct URL

---

### Common Integration Issues

#### Issue: Frontend shows mock data even though backend is expected
**Solution:**
- Check if API call error is being caught silently
- Open browser DevTools → Network tab
- Inspect failed requests for error details
- Verify backend endpoint exists and returns correct format

#### Issue: Real-time features not working (Chat, Location Tracking)
**Solution:**
1. Verify Firebase is configured correctly
2. Check browser console for Firebase errors
3. Verify Realtime Database rules allow read/write
4. Test Firebase connection: Check `lib/firebase.ts` configuration

---

## Contributing Guide

### Getting Started
1. Fork the repository
2. Clone your fork
3. Create feature branch: `git checkout -b feature/your-feature-name`
4. Make changes
5. Commit: `git commit -m "Add feature: description"`
6. Push: `git push origin feature/your-feature-name`
7. Create Pull Request

### Code Standards

#### Python
- Follow PEP 8
- Use type hints
- Write docstrings for functions
- 4-space indentation
- Max line length: 88 characters

#### TypeScript/React
- Use TypeScript (no `any` types)
- Follow React hooks best practices
- Use functional components only
- Use PropTypes or interfaces for props
- 2-space indentation
- Meaningful variable names

#### Commit Messages
```
Format: <type>: <subject>

Types: feat, fix, docs, style, refactor, test, chore
Example: feat: add crop recommendation endpoint
```

### Testing Before Submission
```bash
# Backend
cd backend/ml_model
pytest -v

# Frontend
cd frontend
npm test
npm run lint
npm run build
```

### Documentation
- Update README if adding new features
- Add JSDoc comments for complex functions
- Document API endpoints in code comments
- Update `.env.example` if adding new environment variables

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Resources

### Documentation
- [Frontend Developer Guide](frontend/DEVELOPER_GUIDE.md)
- [Python scikit-learn Documentation](https://scikit-learn.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### API Documentation
- [OpenWeather API](https://openweathermap.org/api)
- [OSRM - Route Optimization](http://project-osrm.org/)
- [Firebase Documentation](https://firebase.google.com/docs)

### Community
- Create GitHub Issues for bugs or feature requests
- Contribute improvements through Pull Requests
- Follow the Contributing Guide above

---

## Roadmap

### Phase 1 (In Progress)
- ✅ Core ML recommendation engine
- ✅ Multi-role marketplace
- ✅ Live tracking system
- ✅ Risk analysis engine

### Phase 2 (Planned)
- 🔄 Payment gateway integration
- 🔄 Advanced analytics dashboard
- 🔄 SMS/Email notifications
- 🔄 Database migration (PostgreSQL)

### Phase 3 (Future)
- 📋 Mobile app (React Native)
- 📋 ML model optimization
- 📋 Blockchain integration for supply chain
- 📋 IoT sensor integration

---

**Last Updated:** February 2026

For questions or issues, please create a GitHub Issue or contact the development team.

**Happy farming! 🌾**
