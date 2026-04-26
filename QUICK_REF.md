# Quick Reference Card

## 🚀 TL;DR - Get Running in 5 Minutes

```bash
# 1. Setup backend
cd server
npm install
cp .env.example .env          # Edit with MongoDB URI
npm run seed
npm run dev                   # Terminal 1 - Keep running

# 2. Setup frontend (new terminal)
cd ../client
npm install
npm run dev                   # Terminal 2 - Keep running

# 3. Open browser
# http://localhost:5173
```

**Demo Login:** `demo@example.com` / `password`

---

## 📁 File Structure

```
dti3/
├── README.md                 # Overview
├── SETUP_GUIDE.md           # Detailed setup
├── setup.bat / setup.sh     # Auto-setup script
├── docker-compose.yml       # Docker setup
│
├── server/                  # Backend (Express)
│   ├── .env.example        # Config template
│   ├── .env                # Config (create & edit)
│   ├── index.js            # Main server
│   ├── seed.js             # Demo data
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth middleware
│   └── utils/              # AI logic
│
└── client/                  # Frontend (React)
    ├── src/
    │   ├── App.jsx         # Main app
    │   ├── pages/          # Page components
    │   ├── components/     # Reusable components
    │   └── index.css       # Tailwind
    └── vite.config.js      # Build config
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Create account |
| `/api/auth/login` | POST | Login + get token |
| `/api/questions/generate` | GET | Get question |
| `/api/interview/evaluate` | POST | Submit answer + get feedback |
| `/api/interview/mock` | POST | Start timer-based round |
| `/api/dashboard` | GET | Get user stats |
| `/api/resume/upload` | POST | Upload PDF for skill extraction |

---

## 🔐 Authentication

Every protected request needs:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from login/signup response → stored in `localStorage` as `aiInterviewToken`

---

## 🎨 UI Components

| Component | File | Purpose |
|-----------|------|---------|
| NavBar | `components/NavBar.jsx` | Navigation + dark mode |
| Layout | `components/Layout.jsx` | Page wrapper + animations |
| LandingPage | `pages/LandingPage.jsx` | Home page |
| Dashboard | `pages/Dashboard.jsx` | Stats + charts |
| Interview | `pages/Interview.jsx` | Mock interview UI |
| Results | `pages/Results.jsx` | Session summary |
| ProfilePage | `pages/ProfilePage.jsx` | User info |

---

## 🛠️ Common Tasks

### Add new interview mode
Edit `server/routes/questions.js`:
```javascript
router.get('/modes', (req, res) => {
  res.json({ modes: ['technical', 'hr', 'role_based', 'YOUR_MODE'] });
});
```

### Customize scoring
Edit `server/utils/llm.js` → `evaluateAnswer()` function

### Change theme colors
Edit `client/tailwind.config.js` → `theme.colors`

### Add new page
1. Create `client/src/pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add route: `<Route path="/newpage" element={<NewPage />} />`

---

## 🐛 Debugging

### Backend logs
Watch Terminal 1 where backend runs
```
GET /api/questions/generate?role=backend 200 - 1.234 ms
POST /api/interview/evaluate 201 - 2.567 ms
```

### Frontend logs
- Open DevTools: `F12`
- Go to **Console** tab
- See React/Vite warnings/errors

### Database inspection
1. Install MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Browse `Users` and `InterviewHistories` collections

---

## 📊 Demo Data

After `npm run seed`, database has:

**User:**
- Email: `demo@example.com`
- Password: `password`
- Role: `ai_ml`
- Stats: 2 interviews, avg score 80

**Interview History:**
- 2 sample sessions with questions and feedback

---

## 🚨 Common Errors

| Error | Fix |
|-------|-----|
| `Cannot find module 'express'` | Run `npm install` in server dir |
| `MongoDB connection failed` | Start `mongod` or update `.env` URI |
| `Port 4000 already in use` | Change PORT in `.env` |
| `CORS error` | Ensure backend runs on `:4000` |
| `Empty dashboard / 401 error` | Clear localStorage, login again |

**Clear localStorage:**
1. F12 → Application tab
2. Storage → Local Storage
3. Delete `aiInterviewToken`
4. Refresh page

---

## 📱 Testing Locally

### What to try:
1. ✅ Sign up with new email
2. ✅ Login with demo account
3. ✅ Take mock interview (submit answer)
4. ✅ View dashboard (see charts)
5. ✅ Toggle dark mode
6. ✅ Logout & login again
7. ✅ Try different roles/topics/difficulties

### Expected behavior:
- Questions change each time
- Scores appear immediately
- Dashboard updates after interview
- Logout clears token

---

## 🌐 Environment Variables

**Required (.env in server/):**
```
MONGO_URI=mongodb://localhost:27017/ai_interview_platform
JWT_SECRET=your_secret_key_here
PORT=4000
```

**Optional:**
```
NODE_ENV=development
OPENAI_API_KEY=sk-...
```

---

## 🚀 Deployment Checklist

- [ ] Update `JWT_SECRET` to strong random value
- [ ] Use production MongoDB (Atlas)
- [ ] Set `NODE_ENV=production`
- [ ] Build frontend: `npm run build`
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Vercel
- [ ] Update `.env` in hosted backend
- [ ] Run seed script on production
- [ ] Test login, interview flow end-to-end

---

## 📚 Learn More

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)

---

## 💡 Tips

- Use `npm run dev` for development (hot reload)
- Use `npm start` for production
- Keep `.env` out of Git (in `.gitignore`)
- Test API with Postman before frontend
- Check browser console (F12) for frontend errors

---

## Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
2. See terminal output for error messages
3. Verify all `.env` variables are set
4. Restart both servers (`Ctrl+C` then `npm run dev`)
5. Clear localStorage and retry
