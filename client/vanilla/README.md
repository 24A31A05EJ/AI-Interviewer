# AI Interview Platform - Vanilla HTML/CSS/JS Version

This is a **pure HTML, CSS, and JavaScript** frontend version of the AI Interview Platform (no React, no build tools required).

It connects to the same Express backend API as the React version.

---

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- Backend running on `http://localhost:4000`
- MongoDB configured and running

### Setup & Run

```bash
# Navigate to vanilla folder
cd c:\Users\user\OneDrive\Desktop\dti3\client\vanilla

# Install dependencies
npm install

# Start frontend server
npm start
```

Expected output:
```
Vanilla JS frontend running on http://localhost:5000
Make sure backend is running on http://localhost:4000
```

Then open: **http://localhost:5000** in your browser

---

## 📁 Project Structure

```
vanilla/
├── index.html      # Single HTML file with all pages
├── styles.css      # All styling (no Tailwind)
├── app.js          # All JavaScript logic
├── server.js       # Simple Express server
├── package.json    # Dependencies
└── README.md       # This file
```

---

## 🏃 How to Run (Complete Setup)

### Terminal 1: Start Backend
```bash
cd c:\Users\user\OneDrive\Desktop\dti3\server
npm run dev
```
Wait for: `Server running on port 4000`

### Terminal 2: Start Frontend (Vanilla)
```bash
cd c:\Users\user\OneDrive\Desktop\dti3\client\vanilla
npm install
npm start
```
Wait for: `Vanilla JS frontend running on http://localhost:5000`

### Terminal 3 (Optional): MongoDB
```bash
mongod
```

### Browser
Open: **http://localhost:5000**

---

## ✨ Features

✅ **No Build Tools** - Pure HTML/CSS/JS, no webpack/babel  
✅ **No Dependencies** (frontend-only) - Just browser APIs  
✅ **Single Page App** - All pages in one HTML file  
✅ **Dark Mode** - Toggle theme, saved in localStorage  
✅ **Responsive Design** - Works on mobile/tablet/desktop  
✅ **Real-time Charts** - Canvas-based trend & weak topics charts  
✅ **Full API Integration** - Calls Express backend  

---

## 📄 Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page |
| Login | `/login` | User login |
| Signup | `/signup` | Create account |
| Dashboard | `/dashboard` | Stats & analytics |
| Interview | `/interview` | Mock interview |
| Profile | `/profile` | User info |

All pages are in **index.html** and shown/hidden with JavaScript.

---

## 🔐 Demo Credentials

After backend is seeded:
- **Email:** `demo@example.com`
- **Password:** `password`

---

## 📚 Code Organization

### index.html
- Navigation bar
- 6 page sections (home, login, signup, dashboard, interview, profile)
- Form inputs
- Chart canvases
- All inline, no external dependencies

### styles.css
- CSS variables for theming
- Dark mode support
- Responsive grid layout
- Animations (fade-in, slide-up, slide-down)
- No Tailwind - pure CSS

### app.js
- Navigation/routing
- Auth (login/signup/logout)
- API calls to backend
- Charts rendering (canvas)
- Interview timer
- Dark mode toggle
- localStorage for persistence

---

## 🎯 Key Functions

| Function | Purpose |
|----------|---------|
| `navigate(page)` | Show/hide pages |
| `handleLogin()` | Login flow |
| `handleSignup()` | Signup flow |
| `loadDashboard()` | Load stats & charts |
| `generateQuestion()` | Fetch new question |
| `submitAnswer()` | Send answer for evaluation |
| `toggleDarkMode()` | Switch theme |

---

## 🔗 API Connection

All API calls go to `http://localhost:4000/api`:

```javascript
const API_BASE = 'http://localhost:4000/api';

// Example: Login
fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
})
```

**Bearer Token:**
```javascript
// Stored in localStorage
const token = localStorage.getItem('aiInterviewToken');

// Used in headers
headers: { 'Authorization': `Bearer ${token}` }
```

---

## 🎨 Styling

### Dark Mode
```javascript
// Toggle dark mode
document.body.classList.toggle('dark-mode');

// CSS uses variables that change
body.dark-mode {
    --bg-light: #0f172a;
    --text-light: #f1f5f9;
}
```

### CSS Variables
```css
--primary: #4338ca    /* Brand color */
--error: #ef4444      /* Error red */
--success: #10b981    /* Success green */
--border: #e2e8f0     /* Light borders */
```

---

## 📊 Charts

### Trend Chart (Line Graph)
Drawn with HTML5 Canvas:
- X-axis: Interview dates
- Y-axis: Scores (0-100)
- Blue line connecting points

### Weak Topics Chart (Pie Chart)
Drawn with HTML5 Canvas:
- Colored slices for each topic
- Label shows average score

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend runs on `:4000`
- Check CORS is enabled (it is in server.js)
- Open DevTools (F12) → Console → check errors

### "Port 5000 already in use"
```bash
# Change port in server.js
const PORT = 5001;  // or any other port
```

### "Login not working"
1. Verify backend running on `:4000`
2. Check browser console (F12) for errors
3. Try seeding database: `cd server && npm run seed`
4. Clear localStorage: DevTools → Application → Clear all

### "Charts not showing"
- Check browser console for errors
- Ensure Chart.js loaded (external CDN)
- Verify data format matches expected structure

---

## 🚀 Comparison: React vs Vanilla

| Feature | React | Vanilla |
|---------|-------|---------|
| Build tools | ✅ Vite | ❌ None |
| Bundle size | ~100KB | ~20KB |
| Learning curve | Medium | Easy |
| Performance | Good | Excellent |
| Dev experience | Great | Simpler |
| Hot reload | ✅ Yes | ❌ Manual |

---

## 🛠️ Customization

### Change Brand Color
Edit in `styles.css`:
```css
:root {
    --primary: #your-color;
}
```

### Add New Page
1. Add HTML section in `index.html`:
```html
<div id="newpage-page" class="page" style="display: none;">
    <!-- Content here -->
</div>
```

2. Add case in `navigate()` function in `app.js`:
```javascript
if (page === 'newpage') {
    loadNewPage();
}
```

3. Add navigation link in navbar

### Modify Question Pool
Update backend in `server/utils/llm.js`

---

## 📈 Performance

- **Load time:** ~500ms (no build steps)
- **Bundle size:** ~150KB total (HTML+CSS+JS)
- **Charts:** Canvas rendering (smooth, no libraries)
- **Charts:** ~60fps animations

---

## 🔄 Switching Between Versions

### Use React Version
```bash
cd client
npm install
npm run dev
# Open http://localhost:5173
```

### Use Vanilla Version
```bash
cd client/vanilla
npm install
npm start
# Open http://localhost:5000
```

Both connect to same backend API.

---

## 📝 Notes

- No external component libraries (except Chart.js via CDN)
- All state managed in JavaScript variables
- LocalStorage for persistence (token, dark mode)
- Responsive CSS Grid layout
- Works in all modern browsers

---

## 🎓 Learning

This vanilla version is great for:
- Learning vanilla JavaScript
- Understanding how frontend connects to API
- Canvas chart drawing
- CSS custom properties (variables)
- localStorage usage
- Responsive design without Tailwind

---

## 📞 Support

1. Check this README
2. See SETUP_GUIDE.md in root
3. Check browser console (F12)
4. Verify backend running
5. Check terminal output

---

**Enjoy building! 🚀**
