# AI-Powered Interview Preparation Platform

A modern, production-style platform built with React + Tailwind + Framer Motion on the frontend and Node.js + Express + MongoDB on the backend.

> **🚀 NEW:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for step-by-step instructions to get started!

## Features

- Technical / HR / Role-based interview modes
- AI-generated questions with difficulty and topic filters
- Answer evaluation (relevance, clarity, accuracy, and scoring)
- Mock interview chat UI with timer
- Performance dashboard with analytics and charts
- Resume upload, skill extraction, and personalized question generation
- Topic-based practice, trending weakness, and adaptive difficulty
- Authentication with JWT sessions
- Dark/light mode
- Leaderboards, streaks, badges

## Project structure

- `client/` - React frontend (Vite)
- `server/` - Express API backend
- `database/` (optional) - seed scripts

## Prerequisites

- **Node.js** (v16+): [Download here](https://nodejs.org/)
- **MongoDB**: Either local (`mongod` running on 27017) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud (free tier)
- **npm** (comes with Node.js)

## Quick Start Guide

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values
# Required:
#   MONGO_URI=mongodb://localhost:27017/ai_interview_platform
#   JWT_SECRET=your_super_secret_key_here
#   PORT=4000
```

**For local MongoDB:**
```bash
# If MongoDB is installed locally, start it first (separate terminal)
mongod

# Then seed the database with demo data
npm run seed
```

**For MongoDB Atlas (cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update `.env` with your Atlas URI:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_interview_platform
   ```
4. Run seed: `npm run seed`

**Start backend server:**
```bash
npm run dev
```

Expected output:
```
MongoDB connected
Server running on port 4000
```

---

### 2. Frontend Setup (new terminal)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### 3. Access the Application

Open your browser and go to: **http://localhost:5173**

---

## Demo Credentials

After running `npm run seed`, use:

- **Email:** `demo@example.com`
- **Password:** `password`

This account has sample interview history and stats.

---

## Testing the Full Flow

1. **Landing Page** (http://localhost:5173/)
   - See platform overview
   - Click "Live demo" or sign up

2. **Sign Up** (http://localhost:5173/signup)
   - Create new account
   - Select role (Frontend/Backend/AI/ML)

3. **Dashboard** (http://localhost:5173/dashboard)
   - View interview stats
   - See score trends and weak topics

4. **Mock Interview** (http://localhost:5173/interview)
   - Select mode (Technical/HR/Role-based)
   - Pick topic and difficulty
   - Submit answer to get AI feedback

5. **Profile** (http://localhost:5173/profile)
   - View account info
   - See badges and streaks

---

## API Endpoints (Backend Reference)

### Auth
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get JWT token

### Questions
- `GET /api/questions/generate?role=backend&topic=technical&difficulty=medium` - Generate question
- `GET /api/questions/topics` - Get available topics

### Interview
- `POST /api/interview/evaluate` - Submit answer and get AI feedback
- `POST /api/interview/mock` - Start mock interview round
- `GET /api/interview/history` - Get past interviews

### Dashboard
- `GET /api/dashboard` - Get user stats and analytics

### Resume
- `POST /api/resume/upload` - Upload PDF resume for skill extraction

---

## Troubleshooting

### MongoDB connection fails
```
Error: MongoDB connection failed
```
**Solution:**
- Ensure MongoDB is running (`mongod` in separate terminal)
- Or setup MongoDB Atlas and update `MONGO_URI` in `.env`
- Check `.env` file exists and has correct values

### Port already in use
```
Error: listen EADDRINUSE :::4000
```
**Solution:**
- Change `PORT` in `.env` to `4001` (or different port)
- Or kill process using port 4000:
  ```
  # Windows PowerShell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
  ```

### Frontend can't reach backend
```
CORS error or 404 on /api routes
```
**Solution:**
- Ensure backend is running on `http://localhost:4000`
- Check Vite proxy in `client/vite.config.js` points to correct port
- Restart frontend after backend starts

### "Cannot find module" error
```
Error: Cannot find module 'express'
```
**Solution:**
- Run `npm install` in the correct directory
- Ensure `package.json` exists
- Delete `node_modules` and `package-lock.json`, then reinstall:
  ```
  rm -r node_modules package-lock.json
  npm install
  ```

### Token/Auth issues
- Clear browser localStorage: Right-click → Inspect → Application → Storage → Clear all
- Logout and login again
- Ensure `JWT_SECRET` in `.env` is consistent

---

## Development Tips

### Enable hot-reload
Both frontend and backend support auto-restart:
- Frontend: Edit `.jsx` files → saves automatically
- Backend: Edit `.js` files → `nodemon` restarts automatically

### View API responses
- Install [Postman](https://www.postman.com/) or VS Code REST Client
- Use `Authorization: Bearer <token>` header for protected routes

### Database inspection
- Install [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect to `mongodb://localhost:27017`
- Browse collections: `Users`, `InterviewHistorys`

---

## Production Deployment

### Frontend (Vercel)
```bash
cd client
npm run build  # Creates dist/ folder
```
- Push to GitHub
- Connect repo to Vercel
- Set build command: `npm run build`
- Set output: `dist`

### Backend (Render / Railway / Heroku)
```bash
cd server
npm install --production
```
- Push to GitHub
- Create web service on Render/Railway
- Set start command: `npm start`
- Add environment variables: `MONGO_URI`, `JWT_SECRET`

---

## Docker Setup

### Quick Start with Docker

```bash
# Ensure Docker and Docker Compose are installed
docker -v
docker-compose -v

# Start all services (MongoDB, Backend, Frontend)
docker-compose up

# In browser: http://localhost:5173
# Backend: http://localhost:4000
# MongoDB: localhost:27017
```

### What docker-compose starts:
- ✅ MongoDB (auto-seeded)
- ✅ Backend server
- ✅ Frontend dev server
- ✅ All connected and ready to use

**Stop services:**
```bash
docker-compose down

# Remove volumes (database):
docker-compose down -v
```

---

## What's Included

✅ Full authentication (JWT + bcrypt)  
✅ AI question generation & evaluation  
✅ Mock interview with timer  
✅ Dashboard with analytics & charts  
✅ Adaptive difficulty  
✅ Resume upload & skill extraction  
✅ Dark/Light mode toggle  
✅ Responsive design (mobile-friendly)  
✅ Smooth animations (Framer Motion)  

---

## Customization

### Change question pool
Edit `server/utils/llm.js` → `generateQuestionTemplate()` function

### Add real LLM
Replace mock evaluation in `server/utils/llm.js` with OpenAI / Claude API calls

### Customize styling
Edit `client/tailwind.config.js` for brand colors and themes

### Add more topics
Update `server/routes/questions.js` → `topics` endpoint

## API docs

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/questions/generate?role=&topic=&difficulty=` 
- `POST /api/interview/evaluate`
- `POST /api/interview/mock`
- `GET /api/dashboard` 
- `POST /api/analytics/track`
- `POST /api/resume/upload`

## Deployment

- Frontend: Vercel
- Backend: Render/Heroku

## Notes

This repository is built to demonstrate a real startup quality workflow and is suitable as a portfolio piece.
