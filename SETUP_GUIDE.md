# Setup & Run Guide - AI Interview Preparation Platform

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js v16+** installed ([Download](https://nodejs.org/))
- [ ] **npm** (comes with Node.js)
- [ ] **MongoDB** running locally OR MongoDB Atlas account setup
- [ ] **Git** (optional, for cloning)
- [ ] **2 terminal windows/tabs**

---

## Option 1: Automated Setup (Recommended)

### Windows
```powershell
cd c:\Users\user\OneDrive\Desktop\dti3
.\setup.bat
```

### Mac/Linux
```bash
cd ~/Desktop/dti3
chmod +x setup.sh
./setup.sh
```

This will:
1. Check for Node.js
2. Install backend dependencies
3. Install frontend dependencies
4. Create `.env` file
5. Show next steps

**Then skip to "Start the Servers" section below.**

---

## Option 2: Manual Setup

### Step 1: Configure MongoDB

**Option A - Local MongoDB:**
1. Download MongoDB Community from https://www.mongodb.com/try/download/community
2. Install and start MongoDB:
   ```
   # Windows - MongoDB runs as service
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. Verify: `mongo --version` should show version

**Option B - MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster
4. Get connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ai_interview_platform
   ```
5. Save this for `.env` setup

---

### Step 2: Backend Setup

```bash
# Navigate to server
cd c:\Users\user\OneDrive\Desktop\dti3\server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# or on Windows:
copy .env.example .env

# Edit .env file with your values:
#   MONGO_URI=mongodb://localhost:27017/ai_interview_platform
#   JWT_SECRET=your_secret_key_123
#   PORT=4000

# Seed database with demo data
npm run seed

# Verify seed output shows:
#   "Seeding database..."
#   "Seed complete"
```

---

### Step 3: Frontend Setup

```bash
# In new location, navigate to client
cd c:\Users\user\OneDrive\Desktop\dti3\client

# Install dependencies
npm install

# Build is optional (for production):
# npm run build
```

---

## Start the Servers

### Terminal 1: Start Backend

```bash
cd c:\Users\user\OneDrive\Desktop\dti3\server
npm run dev
```

Expected output:
```
MongoDB connected
Server running on port 4000
```

**Leave this running.**

---

### Terminal 2: Start Frontend

```bash
cd c:\Users\user\OneDrive\Desktop\dti3\client
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Leave this running.**

---

## Access the Application

Open your browser and go to:

### 🌐 http://localhost:5173

---

## First-Time Testing

### 1. Try Demo Login
- Click on **Home** or **Login**
- Use demo credentials:
  - **Email:** `demo@example.com`
  - **Password:** `password`
- See pre-populated stats and interview history

### 2. Sign Up New Account
- Click **Sign Up**
- Fill form with name, email, password, role
- Select role: **Frontend / Backend / AI/ML**
- Click **Create account**

### 3. Explore Dashboard
- View interview count, average score, weak topics
- See trend chart and pie chart of weak areas

### 4. Take Mock Interview
- Click **Interview**
- Choose topic (DSA, DBMS, OS, CN, Behavioral)
- Select difficulty (Easy / Medium / Hard)
- Choose role
- Answer the question
- Get AI feedback (score, clarity, relevance, suggestions)

### 5. View Profile
- Click **Profile**
- See account info, streaks, badges
- See recommended topics to practice

---

## Command Reference

| Command | What it does |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (with auto-reload) |
| `npm start` | Start production server |
| `npm run build` | Build for production |
| `npm run seed` | Populate DB with demo data |

---

## Troubleshooting

### ❌ "Cannot find module 'express'"
```
Error: Cannot find module 'express'
```
**Fix:**
```bash
cd server
rm -r node_modules package-lock.json
npm install
```

### ❌ MongoDB connection fails
```
Error: MongooseError: ... uri parameter must be a string
```
**Fix:**
1. Check `.env` file exists in `server/` folder
2. Verify `.env` has:
   ```
   MONGO_URI=mongodb://localhost:27017/ai_interview_platform
   JWT_SECRET=your_key
   PORT=4000
   ```
3. Ensure MongoDB is running:
   ```bash
   mongod  # Start in separate terminal
   ```
4. Restart backend server

### ❌ Port 4000 already in use
```
Error: listen EADDRINUSE :::4000
```
**Fix:** Change PORT in `.env` to `4001` or `8000`

### ❌ Frontend can't connect to backend
```
CORS error or network error
```
**Fix:**
1. Ensure backend is running on `http://localhost:4000`
2. Restart frontend
3. Clear browser cache (Ctrl+Shift+Del) → Clear all

### ❌ "npm: command not found"
**Fix:** Reinstall Node.js from https://nodejs.org/

### ❌ Stuck on login/getting 401 errors
**Fix:**
1. Clear localStorage:
   - Open DevTools (F12)
   - Go to **Application** tab
   - Click **Storage** → **Clear site data**
2. Logout and login again
3. Restart both servers

---

## Development Workflow

### Making Frontend Changes
1. Edit files in `client/src/`
2. Save file
3. Vite auto-reloads browser (no restart needed)

### Making Backend Changes
1. Edit files in `server/` (except `.env`)
2. Save file
3. `nodemon` auto-restarts (check Terminal 1)

### Testing API Directly
Use Postman or VS Code REST Client:

```http
### Get a question
GET http://localhost:4000/api/questions/generate?role=backend&topic=technical&difficulty=medium

### Submit answer
POST http://localhost:4000/api/interview/evaluate
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "question": "What is React?",
  "answer": "React is a JavaScript library...",
  "role": "frontend",
  "difficulty": "easy",
  "topic": "technical"
}
```

---

## Database Inspection

### View data with MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect:
   - URI: `mongodb://localhost:27017`
   - Or paste your Atlas connection string
3. Browse collections:
   - **Users** - User accounts
   - **interviewhistories** - Interview records
   - View stored data in real-time

---

## Next Steps After Setup

### To add real AI (Optional)
1. Get API key from OpenAI/Claude/Cohere
2. Update `server/utils/llm.js`
3. Replace mock evaluation with API calls

### To deploy online
- **Frontend:** Push to GitHub → Connect to Vercel
- **Backend:** Push to GitHub → Deploy on Render/Railway

### To customize
- Edit `client/tailwind.config.js` for colors
- Edit `server/utils/llm.js` for questions/answers
- Edit `server/routes/interview.js` for scoring logic

---

## Getting Help

- Check backend logs in Terminal 1
- Check frontend logs in Terminal 2 (browser DevTools F12)
- Verify all `.env` values are set
- Restart both servers after any config change

---

## Success Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] `.env` file created in `server/`
- [ ] Backend started (`npm run dev` in server folder)
- [ ] Frontend started (`npm run dev` in client folder)
- [ ] Browser opened to http://localhost:5173
- [ ] Can login with demo@example.com / password
- [ ] Can see dashboard stats
- [ ] Can take mock interview
- [ ] Can see AI feedback on answer

✅ **You're all set!**
