# AI Interview Preparation Platform - Standalone Version

A completely self-contained, zero-dependency interview preparation platform built with pure HTML, CSS, and JavaScript. Works entirely in your browser with localStorage for data persistence.

## Features

✅ **No External Dependencies** - Pure HTML/CSS/JavaScript  
✅ **No Backend Required** - 100% Client-Side  
✅ **Offline Support** - Works offline after first load  
✅ **Dark Mode** - Toggle with persistent preference  
✅ **Multiple Interview Types** - Technical, HR, System Design  
✅ **Difficulty Levels** - Easy, Medium, Hard  
✅ **Mock AI Evaluation** - Scoring and feedback on answers  
✅ **Dashboard Analytics** - Score trends and topic mastery  
✅ **Interview History** - Track all practice sessions  
✅ **Canvas Charts** - Visual score trends and topic breakdown  

## File Structure

```
standalone/
├── index.html       # 6 pages: Home, Login, Signup, Dashboard, Interview, Results
├── styles.css       # Complete CSS (no Tailwind) with dark mode support
├── app.js          # All JavaScript logic (900+ lines)
└── README.md       # This file
```

## Quick Start

### Option 1: Open as File (Simple)
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 2: Local Web Server (Better)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if installed)
npx http-server

# Using PHP (if installed)
php -S localhost:8000
```

Then open: `http://localhost:8000`

## Demo Credentials

Login with any email/password. The system creates a demo account automatically:

- **Email:** anything@example.com
- **Password:** anything

Example:
- Email: `demo@test.com`
- Password: `password123`

## Usage Guide

### 1. Home Page
- View platform features
- Quick start buttons
- Links to login/signup

### 2. Login/Signup
- Create account with name, email, role
- Account stored in browser localStorage
- No external server needed

### 3. Dashboard
- **Key Metrics:**
  - Total Interviews: tracks sessions completed
  - Average Score: running average of all practice
  - Current Streak: consecutive days (demo only)
  - Topics Mastered: active learning areas

- **Charts:**
  - Score Trend: 7-day progress chart (Canvas)
  - Topics Breakdown: performance by category

- **Actions:**
  - View History: list of all interviews
  - Show Weak Topics: suggestions for improvement
  - Start New Interview: begin practice session

### 4. Interview Session
- **Setup:**
  - Select interview type (Technical, HR, System Design)
  - Pick difficulty (Easy, Medium, Hard)
  - Choose role (Backend, Frontend, Full-stack, etc.)

- **Interview:**
  - 60 questions selected randomly
  - 5-minute timer (300 seconds)
  - Real-time score feedback
  - Skip option available

- **Features:**
  - Question display with category
  - Answer input area
  - AI mock evaluation
  - Scoring breakdown (Clarity, Accuracy, Completeness)
  - Constructive feedback

### 5. Results Page
- Final score display
- Question-by-question breakdown
- Topic-wise performance
- Recommendations for improvement

### 6. Profile & Settings
- View account information
- Toggle dark mode (persistent)
- Logout

## Data Storage

All data stored in browser **localStorage**:
- `currentUser` - Current logged-in user
- `interviews` - History of all interviews
- `totalInterviews` - Count of completed sessions
- `darkMode` - Theme preference (true/false)

### View Your Data
Open browser DevTools (F12) → Application → Local Storage → Your site

## Question Categories

### Technical
- **Easy:** Basics, JavaScript, APIs, Data Formats
- **Medium:** System Design, Databases, Algorithms, Memory Management
- **Hard:** Distributed Systems, Scaling, Advanced Architecture

### HR (Behavioral)
- **Easy:** Introduction, Motivation, Self-Assessment, Career Goals
- **Medium:** Behavioral (STAR method), Teamwork, Leadership, Learning
- **Hard:** Conflict Resolution, Management, Leadership, Crisis Handling

### System Design
- **Easy:** TODO app, Payment systems, Voting
- **Medium:** YouTube, Twitter/X, Uber, Google Search
- **Hard:** Google-scale Search, Netflix, Airbnb, DoorDash

## Customization

### Add More Questions
Edit `app.js` in the `questionDatabase` object:
```javascript
questionDatabase.technical.medium.push({
    text: "Your question here?",
    category: "Category Name",
    answer: "Expected answer or key points"
});
```

### Adjust Interview Length
In `app.js`, `startNewInterview()` function:
```javascript
state.interviewData.questions = (typeQuestions[difficulty] || typeQuestions.easy).slice(0, 10); // Change 5 to desired count
```

### Change Timer Duration
In `app.js`, `startTimer()` function:
```javascript
let timeLeft = 600; // Change from 300 (5 min) to your preference (in seconds)
```

### Modify Scoring Algorithm
In `app.js`, `evaluateAnswer()` function - customize the mock AI scoring logic.

## Performance Tips

- **First Load:** Takes a few seconds to fully render
- **Chart Rendering:** Canvas charts redraw on every dashboard load (instant)
- **Data Sync:** localStorage is synchronous, no lag on save
- **Client-Side Only:** No network requests (completely offline after load)

## Browser Compatibility

- ✅ Chrome/Chromium 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Limitations vs Full Stack

| Feature | Standalone | Full-Stack |
|---------|-----------|-----------|
| Backend API | ❌ Mock only | ✅ Real |
| Database | localStorage | MongoDB/SQL |
| User Accounts | Local only | Server-stored |
| Real AI | ❌ Mock | ✅ OpenAI/Claude |
| Multi-Device | ❌ Per device | ✅ Synced |
| Analytics | Basic | Advanced |

## Troubleshooting

### Questions Not Appearing
- Check browser console (F12)
- Verify `app.js` loaded successfully
- Clear localStorage: DevTools → Application → Clear All

### Charts Not Rendering
- Ensure canvas elements present in HTML
- Check browser supports Canvas API (all modern browsers do)
- Open console for errors

### Dark Mode Not Persisting
- Check localStorage is enabled in browser
- Try in non-private/incognito window

### Interview Score Always 0
- Verify answer input has content
- Check answer length > 0 characters
- Console errors indicate issues

## Future Enhancements

- [ ] Real AI integration (OpenAI API)
- [ ] Multi-device sync (server backend)
- [ ] Spaced repetition algorithm
- [ ] Speech recognition for interviews
- [ ] Video recording of practice sessions
- [ ] Peer comparison and benchmarking
- [ ] Customizable question pools
- [ ] Export results as PDF
- [ ] Mobile app version
- [ ] Voice-based interviews

## Contributing

Want to improve this? You can:
1. Add more questions to `questionDatabase`
2. Enhance the scoring algorithm
3. Add more chart visualizations
4. Improve UI/UX
5. Add keyboard shortcuts
6. Optimize performance

## License

Free to use for personal and commercial purposes.

## Support

For issues or questions, review the code comments in:
- `index.html` - HTML structure and element IDs
- `styles.css` - CSS variables and responsive design
- `app.js` - All logic with function explanations

---

**Built with:** Pure HTML, CSS, JavaScript | **No Dependencies** | **Works Offline** | **Fully Client-Side**
