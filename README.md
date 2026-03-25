# AgriTech

> An intelligent, full-stack agriculture platform designed to empower Indian farmers through AI-driven advisory, crop disease detection, multilingual support, and a smart marketplace ecosystem.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Authentication System](#authentication-system)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Team](#team)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Project Overview

**AgriTech** is a full-stack, AI-powered web platform built to bridge the technology gap for Indian farmers. It provides accessible, multilingual (Hindi and English) agricultural guidance — covering crop health, government schemes, insurance, loans, AI-based yield and resource predictions, equipment rental, a live crop marketplace, and peer learning through video content.

The platform is designed with simplicity and accessibility at its core, ensuring that even farmers with limited technical knowledge can use and benefit from it.

---

## Screenshots

> A visual walkthrough of the AgriTech platform.

---

### Login & Authentication
![Login Page](screenshots/login.png)
*Google OAuth and Email OTP login screen*

---

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Real-time weather forecast, market prices, and smart alerts*

---

### AI Chatbot
![AI Chatbot](screenshots/chatbot.png)
*RAG-based chatbot with Hindi and English voice support*

---

### AI Features — Prediction Suite
![AI Features](screenshots/ai-features.png)
*Yield, Fertilizer, and Irrigation prediction tools*

---

### Crop Disease Detection
![Disease Detection](screenshots/disease-detection.png)
*Upload a crop image and get instant disease diagnosis*

---

### Equipment Rental
![Equipment Rental](screenshots/equipment-rental.png)
*Browse and list equipment for lease or rent*

---

### Market Price Retail (Crop Marketplace)
![Marketplace](screenshots/marketplace.png)
*Buy and sell crops directly with other farmers*

---

### Farmer Video Section
![Video Section](screenshots/videos.png)
*Short farming videos organized by category*

---

> **Note:** To display screenshots correctly, create a `screenshots/` folder in the root of your repository and add the respective images with the exact filenames shown above.

---

## Authentication System

AgriTech uses a **fully secure, multi-method authentication system** built with Google OAuth and a custom email-based OTP flow. Farmers can register and log in through two methods, keeping the process simple and accessible.

---

### Supported Auth Methods

#### 1. Google OAuth (Gmail Login)
- One-click sign-in using a **Google / Gmail account**
- Uses **Google OAuth 2.0** — no password required
- Secure token-based authentication via Google's identity platform
- Profile information (name, email, photo) is auto-fetched from Google

#### 2. Email & Password with OTP Verification
- Farmer registers with **name, email, phone number, and password**
- Phone number is collected as a profile field (not used for OTP)
- After registration, a **one-time password (OTP) is sent to the farmer's email**
- OTP must be verified before the account is activated
- Includes **forgot password / reset password** via email link
- Password is securely hashed using bcrypt before storage

---

### Auth Flow Overview

```
+------------------------------------------+
|              Login Page                  |
|------------------------------------------|
|  [Continue with Google]                  |
|  [Email & Password + Email OTP]          |
+------------------------------------------+
                    |
          +---------+---------+
          |                   |
          v                   v
+------------------+  +----------------------+
|  Google OAuth    |  |   Express.js         |
|  (Google Server) |  |   (API Layer)        |
|  Returns Google  |  |   Register / Login   |
|  ID Token        |  |   Send OTP to Email  |
+------------------+  |   Verify OTP         |
          |            |   Hash Password      |
          |            +----------------------+
          |                   |
          +---------+---------+
                    |
                    v
+------------------------------------------+
|            Express.js Backend            |
|------------------------------------------|
|  Validate Google Token / OTP             |
|  Create / Fetch User in MongoDB          |
|  Issue App-level JWT                     |
+------------------------------------------+
                    |
                    v
+------------------------------------------+
|               MongoDB                    |
|------------------------------------------|
|  Store User Profile                      |
|  Link Auth Method to Account             |
|  Save Preferences & History              |
+------------------------------------------+
```

---

### Security Measures

| Security Feature | Details |
|---|---|
| Google OAuth 2.0 | Google ID Token validated on the backend for every Google login |
| Email OTP Verification | OTP sent to registered email, must be verified before account activation |
| JWT (App Level) | Short-lived JWT issued after successful authentication |
| Password Hashing | bcrypt used for email/password accounts |
| Protected Routes | All dashboard, AI, and marketplace routes require valid JWT |
| OTP Expiry | Email OTP expires after a set time window to prevent misuse |
| Account Linking | A single farmer account can link both Google and Email auth methods |

---

### User Profile Created After Auth

On first login, a farmer profile is automatically created in MongoDB with the following fields:

```json
{
  "uid": "generated_user_id",
  "name": "Farmer Name",
  "email": "farmer@email.com",
  "phone": "+91XXXXXXXXXX",
  "authMethod": "google | email",
  "isEmailVerified": true,
  "language": "hi | en",
  "location": {
    "state": "Maharashtra",
    "district": "Pune",
    "city": "Baramati"
  },
  "cropTypes": ["wheat", "sugarcane"],
  "farmerType": "small | medium | large",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

## Features

### 1. Dashboard
A centralized, real-time information hub for every farmer.

- **Weather Forecast** — Live multi-day weather forecast based on the farmer's location
- **Weather Report** — Detailed current weather conditions including temperature, humidity, wind speed, and rainfall
- **Market Price Overview** — At-a-glance view of current crop prices in the local market
- **City Search** — Search and switch location to view weather and market data for any city
- **Smart Alerts** — Real-time notifications for extreme weather, pest warnings, scheme deadlines, and price fluctuations

---

### 2. AI Chatbot (RAG-Based)
- Retrieval-Augmented Generation (RAG) chatbot powered by Groq LLM
- Supports both **Hindi** and **English** languages
- Voice input and voice output support
- Context-aware, farmer-friendly responses
- Backed by a FAISS vector database for accurate knowledge retrieval

---

### 3. AI Features (Prediction Suite)
A set of AI-powered predictive tools to help farmers plan smarter.

- **Yield Prediction**
  - Predicts expected crop yield based on soil data, weather, crop type, and historical patterns
  - Helps farmers make informed sowing and harvesting decisions

- **Fertilizer Prediction**
  - Recommends the right type and quantity of fertilizer
  - Based on soil nutrient levels, crop requirements, and growth stage

- **Irrigation Prediction**
  - Suggests optimal irrigation schedule and water quantity
  - Based on weather forecast, crop type, soil moisture, and evapotranspiration data

---

### 4. Crop Disease Detection
- Upload an image of a plant or crop
- CNN model analyzes the image and identifies the disease
- Provides actionable **treatment suggestions** and **preventive measures**

---

### 5. Government Scheme Advisor
- Recommends relevant government schemes based on the farmer's profile
- Displays **eligibility criteria** and **step-by-step application process**
- Keeps farmers informed about benefits they qualify for

---

### 6. Crop Insurance Advisor
- Suggests suitable insurance plans based on crop type and risk profile
- Explains **coverage details**, **premium structures**, and **precautions**

---

### 7. Loan & Credit Advisor
- Recommends appropriate loan types (Kisan Credit Card, short-term, long-term, etc.)
- Provides **eligibility checks**, **repayment guidance**, and interest information
- Context-aware: considers location, crop type, and farmer category

---

### 8. Equipment Rental
A peer-to-peer agricultural equipment platform with two flexible options.

- **Lease** — Long-term equipment usage agreement, suitable for seasonal or multi-month farming needs with fixed pricing
- **Rent** — Short-term, flexible equipment hiring by day or week for one-time or urgent farming tasks
- Wide range of equipment: tractors, tillers, harvesters, sprayers, and more
- Equipment listings include availability calendar, pricing, owner contact, and location
- Farmers can list their own equipment for others to lease or rent

---

### 9. Market Price Retail (Crop Marketplace)
A direct farmer-to-buyer marketplace to eliminate middlemen.

- **Buy Crops** — Browse and purchase crops listed by farmers with price, quantity, and location details
- **Sell Crops** — Farmers can list their produce with photos, price, and contact information
- Filter by crop type, region, price range, and availability
- Promotes fair pricing and direct trade between farmers and buyers

---

### 10. Farmer Video Section
- Farmers can upload and watch short educational farming videos
- Learn practical techniques from fellow farmers
- Organized by **category** (soil, irrigation, pest control, harvesting, etc.)
- Powered by Cloudinary for media storage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js with Bun (mobile-responsive) |
| Backend (AI) | FastAPI (Python) |
| Backend (API Layer) | Express.js (Node.js) |
| Authentication | Google OAuth 2.0, Custom Email OTP (Nodemailer) |
| AI / LLM | Groq API |
| RAG & Vector DB | FAISS |
| Disease Detection | CNN Model (TensorFlow / PyTorch) |
| Yield / Fertilizer / Irrigation | ML Regression / Classification Models |
| Primary Database | MongoDB |
| Media Storage | Cloudinary |
| Weather Data | OpenWeatherMap API / IMD API |
| Market Price Data | Agmarknet API / Custom Data Layer |
| Language Support | Hindi, English |

---

## System Architecture

```
+---------------------------------------------------------------+
|                          React.js                             |
|                      (Frontend / UI)                          |
|                                                               |
|  Login (Google OAuth | Email + OTP Verification)              |
|  Dashboard  |  AI Chatbot  |  AI Features  |  Disease Det.   |
|  Schemes    |  Insurance   |  Loans        |  Eq. Rental      |
|  Marketplace (Buy/Sell)    |  Videos                         |
+---------------------------------------------------------------+
            |                          |
            v                          v
+-------------------+    +------------------------+
|   Google OAuth    |    |      Express.js        |
|  (Google Servers) |    |   (API Layer)          |
|  Returns ID Token |    |  Validate Google Token |
+-------------------+    |  Email OTP Flow        |
                         |  Issue App JWT         |
                         |  Auth Middleware        |
                            +----------------------+
                                      |
                                      v
                        +-----------------------------+
                        |          FastAPI            |
                        |     (AI Services Layer)     |
                        +-----------------------------+
                    |       |       |       |       |
                    v       v       v       v       v
               +------++-------++------++------++--------+
               | Groq || FAISS || CNN  ||  ML  ||Weather |
               |  LLM ||Vector ||Model ||Models|| Market |
               |      ||  DB   ||      ||Yield || APIs   |
               |      ||       ||      ||Fert. ||        |
               |      ||       ||      ||Irrig.||        |
               +------++-------++------++------++--------+
                                      |
                                      v
                        +-----------------------------+
                        |           MongoDB           |
                        |  Users | Listings | Equip.  |
                        |  Alerts | Logs | Videos     |
                        +-----------------------------+
                               |             |
                               v             v
                    +----------------+  +------------------+
                    | Cloudinary     |  |  External APIs   |
                    |                |  |  OpenWeatherMap  |
                    | (Media Storage)|  |  Agmarknet/eNAM  |
                    +----------------+  +------------------+
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- Bun >= 1.0 (for frontend) — [Install Bun](https://bun.sh)
- Node.js >= 18.x (for backend)
- Python >= 3.10
- MongoDB (local or Atlas cloud)
- Google Cloud project with OAuth 2.0 credentials configured
- Git

---

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/agritech-ai-assistant.git
cd agritech-ai-assistant
```

---

#### 2. Frontend Setup (React.js)

```bash
cd frontend
bun install
bun run dev
```

The frontend will run at `http://localhost:3000`

---

#### 3. Backend Setup — FastAPI (AI Services)

```bash
cd backend/fastapi
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The FastAPI server will run at `http://localhost:8000`

---

#### 4. Backend Setup — Express.js (API Layer)

```bash
cd backend/express
npm install
npm run dev
```

The Express server will run at `http://localhost:5000`

---

#### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Create an **OAuth 2.0 Client ID** (Web Application)
5. Add your frontend URL to **Authorized JavaScript Origins**
6. Copy the **Client ID** and **Client Secret** into your `.env` files

---

#### 6. FAISS Vector Database

```bash
cd backend/fastapi
python build_index.py
```

---

## Environment Variables

#### `/frontend/.env`

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_FASTAPI_URL=http://localhost:8000
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

#### `/backend/express/.env`

```env
PORT=5000
FASTAPI_BASE_URL=http://localhost:8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Email OTP (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
OTP_EXPIRES_IN=300
```

---

#### `/backend/fastapi/.env`

```env
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
FAISS_INDEX_PATH=./data/faiss_index
CNN_MODEL_PATH=./models/disease_model.h5
YIELD_MODEL_PATH=./models/yield_model.pkl
FERTILIZER_MODEL_PATH=./models/fertilizer_model.pkl
IRRIGATION_MODEL_PATH=./models/irrigation_model.pkl
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
OPENWEATHER_API_KEY=your_openweather_api_key
AGMARKNET_API_KEY=your_agmarknet_api_key
```

---

## API Endpoints

### Express.js — Auth & API Layer (`http://localhost:5000`)

#### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/google` | Authenticate via Google OAuth ID token |
| POST | `/api/auth/email/register` | Register with name, email, phone, and password |
| POST | `/api/auth/email/send-otp` | Send OTP to registered email for verification |
| POST | `/api/auth/email/verify-otp` | Verify email OTP and activate account |
| POST | `/api/auth/email/login` | Login with email and password |
| POST | `/api/auth/email/forgot-password` | Send password reset link to email |
| POST | `/api/auth/logout` | Invalidate session / token |

#### User & Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get farmer profile (protected) |
| PUT | `/api/profile/update` | Update farmer profile (protected) |

#### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/weather` | Get weather forecast and report by city |
| GET | `/api/dashboard/market-price` | Get current market crop prices |
| GET | `/api/dashboard/alerts` | Get smart alerts for the farmer |

#### Marketplace

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/market/listings` | Get all crop listings for sale |
| POST | `/api/market/sell` | Post a new crop listing (protected) |
| DELETE | `/api/market/listings/:id` | Remove a crop listing (protected) |

#### Equipment Rental

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/equipment` | Browse all equipment listings |
| POST | `/api/equipment/list` | List equipment for lease or rent (protected) |
| GET | `/api/equipment/:id` | Get equipment details and availability |
| PUT | `/api/equipment/:id` | Update equipment listing (protected) |

---

### FastAPI — AI Services (`http://localhost:8000`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat` | Send a message to the RAG-based chatbot |
| POST | `/detect-disease` | Upload a crop image for disease detection |
| POST | `/predict/yield` | Predict crop yield based on input parameters |
| POST | `/predict/fertilizer` | Get fertilizer type and quantity recommendation |
| POST | `/predict/irrigation` | Get irrigation schedule and water requirement |
| POST | `/schemes` | Get government scheme recommendations |
| POST | `/insurance` | Get crop insurance suggestions |
| POST | `/loans` | Get loan and credit advisory |
| GET | `/videos` | Fetch all farming videos by category |
| POST | `/videos/upload` | Upload a new farming video |

---

## Future Improvements

- **Offline Mode** — Basic advisory available without internet using on-device models
- **Mobile App (React Native)** — Dedicated Android/iOS application with biometric login
- **Mandi Price Live Integration** — Real-time crop prices via Agmarknet / eNAM APIs
- **Weather Advisory Automation** — Auto-alerts for frost, drought, or flood risk
- **SMS / WhatsApp Bot** — Reach farmers without smartphones
- **Regional Language Expansion** — Add Tamil, Telugu, Marathi, Punjabi support
- **Community Forum** — Peer-to-peer farmer discussion board
- **Equipment Rental Rating System** — Reviews and trust scores for equipment owners
- **Marketplace Escrow / Payment Gateway** — Secure in-app payments for crop sales
- **Admin Dashboard** — Manage users, listings, schemes, and platform data
- **Aadhaar-Based Verification** — Optional identity verification for farmers
- **Satellite Crop Monitoring** — Integration with ISRO / NASA satellite APIs for field health

---

## Contributing

Contributions are welcome from the community. To contribute:

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes with a clear message

```bash
git commit -m "feat: add your feature description"
```

4. Push the branch and open a Pull Request

```bash
git push origin feature/your-feature-name
```

Please ensure your code is clean, well-commented, and tested before submitting a PR.

---

## Team

| Name | Role | GitHub |
|---|---|---|
| Prince Sharma | Python + ML Models | [@username](https://github.com/prince7711sharma) |
| Shubham Patel | Frontend + Backend + API Integrations + UI/UX | [@username](https://github.com/Shubhu007-ai) |
| Lalit Kumar | Frontend + Backend + API Integrations | [@username](https://github.com/lalit2406) |

---

## Disclaimer

AgriTech provides **AI-generated advisory only**. All information regarding schemes, insurance, loans, crop treatment, yield predictions, fertilizer recommendations, irrigation schedules, and market prices is for guidance purposes and should **not** be treated as a final or professional decision. Users are advised to consult relevant authorities or agricultural experts before taking action.

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 AgriTech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

*Built with dedication for the farmers of India.*