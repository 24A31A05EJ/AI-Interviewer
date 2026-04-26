// ========== CONFIG ==========
const API_BASE = 'http://localhost:4000/api';
let currentUser = null;
let currentQuestion = null;
let currentTimer = 60;
let timerInterval = null;
let interviewHistory = [];
let questionCount = 1;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('aiInterviewToken');
    if (token) {
        loadUserSession();
    } else {
        navigate('home');
    }
});

// ========== NAVIGATION ==========
function navigate(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    // Show selected page
    document.getElementById(`${page}-page`).style.display = 'block';

    // Handle specific page logic
    if (page === 'dashboard' && currentUser) {
        loadDashboard();
    } else if (page === 'interview' && currentUser) {
        generateQuestion();
    } else if (page === 'profile' && currentUser) {
        loadProfile();
    }

    window.scrollTo(0, 0);
}

// ========== AUTH ==========
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('aiInterviewToken', data.token);
            currentUser = data.user;
            updateAuthNav();
            navigate('dashboard');
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = data.message || 'Login failed';
        }
    })
    .catch(err => {
        errorDiv.textContent = 'Connection error. Check backend is running.';
        console.error(err);
    });
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    const errorDiv = document.getElementById('signupError');
    
    fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('aiInterviewToken', data.token);
            currentUser = data.user;
            updateAuthNav();
            navigate('dashboard');
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = data.message || 'Signup failed';
        }
    })
    .catch(err => {
        errorDiv.textContent = 'Connection error. Check backend is running.';
        console.error(err);
    });
}

function logout() {
    localStorage.removeItem('aiInterviewToken');
    currentUser = null;
    updateAuthNav();
    navigate('home');
}

function loadUserSession() {
    const token = localStorage.getItem('aiInterviewToken');
    if (!token) return;

    fetch(`${API_BASE}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
        if (data && data.user) {
            currentUser = data.user;
            updateAuthNav();
            navigate('dashboard');
        }
    })
    .catch(err => console.error(err));
}

function updateAuthNav() {
    const authNav = document.getElementById('authNav');
    const guestNav = document.getElementById('guestNav');
    
    if (currentUser) {
        authNav.style.display = 'flex';
        guestNav.style.display = 'none';
    } else {
        authNav.style.display = 'none';
        guestNav.style.display = 'flex';
    }
}

// ========== DASHBOARD ==========
function loadDashboard() {
    const loading = document.getElementById('dashboardLoading');
    const content = document.getElementById('dashboardContent');
    loading.style.display = 'block';
    content.style.display = 'none';

    const token = localStorage.getItem('aiInterviewToken');
    
    fetch(`${API_BASE}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        updateDashboardUI(data);
        loading.style.display = 'none';
        content.style.display = 'block';
    })
    .catch(err => {
        console.error(err);
        loading.innerHTML = '<p style="color: red;">Error loading dashboard</p>';
    });
}

function updateDashboardUI(data) {
    // Update stats
    document.getElementById('statInterviews').textContent = data.metrics.interviewCount;
    document.getElementById('statAvgScore').textContent = data.metrics.avgScore;
    document.getElementById('statWeakTopics').textContent = data.metrics.weakTopics.length;

    // Prepare chart data
    const trendData = data.history.map(item => ({
        date: new Date(item.createdAt).toLocaleDateString(),
        score: item.overallScore
    }));

    // Draw trend chart
    drawLineChart('trendChart', trendData);

    // Draw weak topics chart
    drawPieChart('weakTopicsChart', data.metrics.weakTopics);
}

function drawLineChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale
    const padding = 40;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    if (data.length === 0) return;
    
    const maxScore = Math.max(...data.map(d => d.score), 100);
    const xStep = width / (data.length - 1 || 1);
    
    // Set styles
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(67, 56, 202, 0.1)';
    
    // Draw line
    ctx.beginPath();
    data.forEach((point, i) => {
        const x = padding + i * xStep;
        const y = padding + height - (point.score / maxScore) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#4338ca';
    data.forEach((point, i) => {
        const x = padding + i * xStep;
        const y = padding + height - (point.score / maxScore) * height;
        ctx.fillRect(x - 3, y - 3, 6, 6);
    });
    
    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    data.forEach((point, i) => {
        const x = padding + i * xStep;
        ctx.fillText(point.date, x, canvas.height - 10);
    });
}

function drawPieChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (data.length === 0) return;
    
    const colors = ['#634FC0', '#00BBF9', '#FF8A65', '#FFD54F', '#A389F4'];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.avgScore, 0);
    
    data.forEach((item, i) => {
        const sliceAngle = (item.avgScore / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        
        // Draw label
        const labelAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(item.avgScore), labelX, labelY);
        
        startAngle += sliceAngle;
    });
}

// ========== INTERVIEW ==========
function generateQuestion() {
    const mode = document.getElementById('interviewMode').value;
    const topic = document.getElementById('interviewTopic').value;
    const role = document.getElementById('interviewRole').value;
    const difficulty = document.getElementById('interviewDifficulty').value;

    fetch(`${API_BASE}/questions/generate?role=${role}&topic=${topic}&difficulty=${difficulty}`)
        .then(res => res.json())
        .then(data => {
            currentQuestion = data;
            document.getElementById('questionText').textContent = data.question;
            document.getElementById('questionInfo').textContent = 
                `Topic: ${data.topic} • Difficulty: ${data.difficulty} • Role: ${role}`;
            document.getElementById('answerInput').value = '';
            document.getElementById('feedbackSection').style.display = 'none';
            document.getElementById('questionNum').textContent = questionCount;
            
            // Reset timer
            clearInterval(timerInterval);
            currentTimer = 60;
            startTimer();
        })
        .catch(err => console.error(err));
}

function updateInterviewMode() {
    // Can add mode-specific logic here
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTimer--;
        document.getElementById('timerDisplay').textContent = `Time left: ${currentTimer}s`;
        
        if (currentTimer <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').textContent = 'Time\'s up!';
        }
    }, 1000);
}

function submitAnswer() {
    const answer = document.getElementById('answerInput').value;
    if (!answer.trim()) {
        alert('Please enter an answer');
        return;
    }

    const token = localStorage.getItem('aiInterviewToken');
    const mode = document.getElementById('interviewMode').value;
    const topic = document.getElementById('interviewTopic').value;
    const role = document.getElementById('interviewRole').value;
    const difficulty = document.getElementById('interviewDifficulty').value;

    fetch(`${API_BASE}/interview/evaluate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            question: currentQuestion.question,
            answer,
            role,
            topic,
            difficulty,
            mode
        })
    })
    .then(res => res.json())
    .then(data => {
        displayFeedback(data.evaluation);
        interviewHistory.push({
            question: currentQuestion.question,
            score: data.evaluation.score
        });
        updateHistoryPanel();
        questionCount++;
    })
    .catch(err => {
        console.error(err);
        alert('Error submitting answer');
    });
}

function displayFeedback(evaluation) {
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackContent = document.getElementById('feedbackContent');
    
    feedbackContent.innerHTML = `
        <div class="feedback-item">
            <span>Score:</span>
            <strong>${evaluation.score}</strong>
        </div>
        <div class="feedback-item">
            <span>Clarity:</span>
            <strong>${evaluation.clarity}</strong>
        </div>
        <div class="feedback-item">
            <span>Relevance:</span>
            <strong>${evaluation.relevance}</strong>
        </div>
        <div class="feedback-item">
            <span>Technical:</span>
            <strong>${evaluation.technical}</strong>
        </div>
    `;
    
    const feedback = document.createElement('div');
    feedback.style.marginTop = '1rem';
    feedback.style.paddingTop = '1rem';
    feedback.style.borderTop = '1px solid #dcfce7';
    feedback.innerHTML = `<strong>Suggestions:</strong><p>${evaluation.feedback}</p>`;
    
    feedbackContent.appendChild(feedback);
    feedbackSection.style.display = 'block';
}

function updateHistoryPanel() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = interviewHistory.map((item, idx) => `
        <div class="history-item">
            <div class="history-question">${idx + 1}. ${item.question.substring(0, 40)}...</div>
            <div class="history-score">Score: ${item.score}</div>
        </div>
    `).join('');
    
    // Scroll to bottom
    historyList.scrollTop = historyList.scrollHeight;
}

// ========== PROFILE ==========
function loadProfile() {
    if (!currentUser) return;

    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileStreak').textContent = currentUser.stats?.streak || 0;
    
    const badges = (currentUser.stats?.badges || []).join(', ') || 'No badges yet';
    document.getElementById('profileBadges').textContent = badges;

    // Load suggested topics
    const token = localStorage.getItem('aiInterviewToken');
    fetch(`${API_BASE}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.metrics.weakTopics.length > 0) {
            const suggestedTopics = document.getElementById('suggestedTopics');
            suggestedTopics.innerHTML = data.metrics.weakTopics
                .map(t => `<li>${t.topic}</li>`)
                .join('');
        }
    })
    .catch(err => console.error(err));
}

// ========== DARK MODE ==========
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('darkToggle').textContent = isDark ? 'Light' : 'Dark';
}

// Load dark mode preference on startup
window.addEventListener('load', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkToggle').textContent = 'Light';
    }
});

// ========== UTILITIES ==========
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = '<div class="loading"></div>';
    }
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = `<p style="color: red;">${message}</p>`;
    }
}
