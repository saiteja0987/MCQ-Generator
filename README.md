# 📚 MCQ Generator & AI Study Assistant

A comprehensive quiz generation platform with AI-powered learning tools, built with Node.js, Express, and Google Generative AI.

## ✨ Features

### 1. **MCQ Generator**
- Generate multiple-choice questions from study content
- Adjustable difficulty levels (Easy, Medium, Hard)
- Configurable question count (1-200)
- Real-time score tracking and performance review
- Quiz history with detailed statistics

### 2. **Subjective Questions**
- Generate subjective/essay-type questions
- Manual answer submission and grading
- Recent Scores tracking with:
  - Quiz date and timestamp
  - Question count
  - Score percentage
  - Marks obtained
- Quiz history stored in browser localStorage
- Detailed review of submitted answers

### 3. **AI Study Assistant** 🤖
Three powerful interactive tools for enhanced learning:

#### **Study Guide Generator**
- Enter topics or content areas
- Generates comprehensive, well-organized study materials
- Perfect for exam preparation
- Use Case: Need quick study notes on a topic

#### **Concept Explainer**
- Enter any confusing concept
- Receives detailed, easy-to-understand explanations
- Breaks down complex ideas step-by-step
- Use Case: Stuck on a topic? Get AI tutor-style explanations

#### **Q&A Helper**
- Paste questions (MCQ or subjective)
- Get guided help without direct answers
- Learn problem-solving approaches
- Use Case: Understand how to tackle difficult questions

**Chat Interface**: Real-time conversations with AI tutor for follow-up questions and clarifications

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JavaScript + Tailwind CSS + Lucide Icons
- **AI Models**: 
  - Google Generative AI (Gemini)
  - OpenAI (GPT-4o Mini)
  - Groq (Llama 3.3 70B)
- **Data Storage**: Browser localStorage + JSON
- **Styling**: Tailwind CSS (CDN) with dark mode support

## 🎨 UI/UX Features

- **Left-Side Mode Dropdown**: Easy access to switch between MCQ, Subjective, and AI Assistant modes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Full dark theme support with smooth transitions
- **Glass Morphism**: Modern UI with frosted glass effects and smooth animations
- **3D Buttons**: Interactive 3D button effects for better user feedback

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- API Keys (at least one):
  - Google Gemini API Key (AIza...)
  - OpenAI API Key (sk-...)
  - Groq API Key (gsk_...)

### Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd "mcq generator"

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
http://localhost:3000
```

## 📋 Configuration

### Backend URL
Default: `http://localhost:3000/api`
- Change if running on different port or remote server

### API Keys
1. **MCQ Mode**: Use Gemini (auto-filters to safe models)
2. **Subjective Mode**: Any AI provider
3. **Study Assistant**: Supports all three providers with auto-detection

## 📁 Project Structure

```
mcq-generator/
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server configuration
│   ├── controllers/
│   │   ├── mcqController.js      # MCQ generation logic
│   │   ├── authController.js     # Authentication
│   │   └── assistantController.js # AI tutor/study tools
│   ├── routes/
│   │   ├── mcqRoutes.js          # MCQ API endpoints
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── assistantRoutes.js    # Study assistant endpoints
│   ├── middleware/
│   │   └── authMiddleware.js     # Auth verification
│   ├── models/
│   │   └── User.js               # User data model
│   └── utils/
│       └── jsonCleaner.js        # JSON parsing utilities
├── public/
│   ├── index.html                # Main UI
│   ├── auth.js                   # Frontend auth logic
│   └── styles.css                # Custom CSS
├── __tests__/
│   └── mcq.test.js              # Unit tests
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS config
└── server.js                     # Entry point
```

## 🔌 API Endpoints

### MCQ Generation
- **POST** `/api/mcq/generate`
  - Generate MCQ questions from content
  - Body: { content, difficulty, maxQuestions, apiKey, provider }

### Subjective Questions
- **POST** `/api/mcq/subjective`
  - Generate subjective questions
  - Body: { content, topicCount, apiKey, provider }

### AI Study Assistant
- **POST** `/api/assistant-chat`
  - Chat with AI tutor
  - Body: { message, studyLevel, apiKey, provider }

- **POST** `/api/assistant-generate`
  - Generate study materials
  - Body: { type, content, apiKey, provider }

## 💾 Data Storage

### localStorage Keys
- `quizHistory` - MCQ quiz attempts
- `subjectiveQuizHistory` - Subjective quiz attempts
- `userProfile` - User settings and preferences

### Structure
```javascript
// MCQ Quiz
{
  date: "2026-05-05",
  topic: "Biology",
  questions: 10,
  totalMarks: 10,
  marksObtained: 8,
  percentage: 80
}

// Subjective Quiz
{
  date: "2026-05-05",
  questionCount: 5,
  totalMarks: 50,
  marksObtained: 0, // Teacher grades later
  answers: { q1: "...", q2: "..." },
  quizData: [...]
}
```

## 🎯 How to Use

### Generate MCQs
1. Go to **MCQ Mode**
2. Enter your study content/notes
3. Select difficulty level
4. Set number of questions
5. Click "Start Quiz"
6. Answer all questions
7. View scores and performance review

### Answer Subjective Questions
1. Go to **Subjective Mode**
2. Enter topic and number of questions
3. AI generates essay/short-answer questions
4. Submit your answers
5. Check "Recent Scores" section for history

### Use AI Study Assistant
1. Switch to **Study Assistant** mode
2. Choose a tool:
   - **Study Guide**: Enter topic → Get comprehensive study material
   - **Explain Concept**: Enter concept → Get detailed explanation
   - **Q&A Helper**: Paste question → Get guided help
3. Ask follow-up questions in chat

## ⚙️ Advanced Configuration

### Model Fallback Strategy
The app supports multi-model fallback:
1. Try primary provider
2. If fails, try secondary provider
3. Continue until successful

### Supported Gemini Models
- gemini-2.0-flash (recommended)
- gemini-2.0-flash-lite
- gemini-1.5-flash
- gemini-1.5-flash-8b
- gemini-1.5-pro

*Note: Vision, embedding, and experimental models are auto-filtered*

## 🧪 Testing

```bash
# Run unit tests
npm test

# Build CSS
npm run build-css
```

## 📊 Performance Features

- **Smart Model Filtering**: Automatically filters to text-generation capable models only
- **Multi-Provider Support**: Seamless fallback between Gemini, OpenAI, and Groq
- **Error Recovery**: Graceful error handling with user-friendly messages
- **Responsive UI**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Built-in dark theme support

## 🔒 Security Notes

- API keys stored securely in memory (not in localStorage)
- CORS enabled for authorized domains
- Input validation on all endpoints
- Environment variables for sensitive data (recommended)

## 🐛 Troubleshooting

### "Cannot find model" Error
- Verify API key is correct
- Ensure you have quota remaining
- Try a different provider

### Quiz Not Generating
- Check backend URL is correct
- Verify API key format
- Check server logs for errors

### Recent Scores Not Showing
- Clear browser cache
- Check localStorage in DevTools
- Verify subjective quiz was submitted

## 🤝 Contributing

Contributions welcome! Please follow:
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📝 License

MIT License - Feel free to use and modify

## 📞 Support

For issues or questions, check:
- Console logs (F12 → Console tab)
- Network tab for API responses
- Local server logs
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .option-card.selected {
            border-color: #6366f1; /* Indigo-500 */
            background-color: #eef2ff; /* Indigo-50 */
            box-shadow: 0 0 0 1px #6366f1;
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 min-h-screen">

    <!-- SETUP SCREEN -->
    <div id="setupScreen" class="max-w-4xl mx-auto p-6 transition-all duration-300">
        <header class="mb-8 text-center">
            <h1 class="text-4xl font-extrabold text-indigo-600 flex justify-center items-center gap-3">
                <i data-lucide="graduation-cap" class="w-10 h-10"></i> 
                MCQ Generator
            </h1>
            <p class="text-gray-500 mt-2">Node.js Version</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Settings -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                    <i data-lucide="settings" class="w-5 h-5 text-indigo-500"></i> Configuration
                </h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-500 mb-1">Backend URL</label>
                        <!-- Updated to point to local Node server API -->
                        <input type="text" id="backendUrl" value="http://localhost:3000/api" 
                            class="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-500 mb-1">Gemini API Key</label>
                        <input type="password" id="apiKey" placeholder="AIza..." 
                            class="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-500 mb-1">Difficulty</label>
                        <select id="difficulty" class="w-full p-2 text-sm border border-gray-300 rounded">
                            <option value="Easy">Easy</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-500 mb-1">Max Questions</label>
                        <input type="number" id="maxQuestions" min="1" max="200" value="50"
                            class="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none">
                        <p class="text-xs text-gray-400 mt-1">Set a maximum number of questions to generate (1-200).</p>
                    </div>
                </div>
            </div>

            <!-- Content Input -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                    <i data-lucide="book-open" class="w-5 h-5 text-indigo-500"></i> Content
                </h2>
                <textarea id="content" rows="8" 
                    class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
                    placeholder="Paste your study notes or topic here..."></textarea>
                
                <button onclick="generateQuiz()" id="generateBtn"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl">
                    <i data-lucide="zap" class="w-5 h-5"></i> Start Quiz
                </button>
            </div>
        </div>

        <div id="loading" class="hidden mt-8 text-center">
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100">
                <i data-lucide="loader-2" class="w-6 h-6 animate-spin text-indigo-600"></i>
                <span class="font-medium text-indigo-600">Generating Questions...</span>
            </div>
        </div>
        
        <div id="error" class="hidden mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center"></div>
    </div>

    <!-- QUIZ ARENA -->
    <div id="quizArena" class="hidden max-w-3xl mx-auto p-6 min-h-screen flex flex-col justify-center">
        <div class="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
            <span id="questionCounter">Question 1 of 5</span>
            <button onclick="resetApp()" class="text-gray-400 hover:text-red-500 transition flex items-center gap-1">
                <i data-lucide="x" class="w-4 h-4"></i> Quit
            </button>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 id="questionText" class="text-xl font-bold text-gray-900 mb-8 leading-relaxed"></h2>
            <div id="optionsContainer" class="space-y-3"></div>
        </div>
        <div class="mt-8 flex justify-end">
            <button id="nextBtn" onclick="nextQuestion()" 
                class="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                Next <i data-lucide="arrow-right" class="w-4 h-4 inline ml-1"></i>
            </button>
        </div>
    </div>

    <!-- REVIEW SCREEN -->
    <div id="reviewScreen" class="hidden max-w-4xl mx-auto p-6">
        <header class="mb-8 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Review Answers</h1>
            <button onclick="resetApp()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">New Quiz</button>
        </header>
        <div class="bg-indigo-900 text-white p-6 rounded-xl shadow-lg mb-8 flex items-center justify-between">
            <div>
                <p class="text-indigo-200 text-sm uppercase tracking-wider font-semibold">Your Score</p>
                <h2 id="finalScoreDisplay" class="text-4xl font-bold mt-1">0 / 0</h2>
            </div>
            <div class="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
                <i data-lucide="trophy" class="w-6 h-6 text-yellow-400"></i>
            </div>
        </div>
        <div id="reviewList" class="space-y-8"></div>
    </div>

    <!-- RESULTS MODAL -->
    <div id="resultModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <i data-lucide="party-popper" class="w-8 h-8 text-green-600"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p class="text-gray-500 mb-6">You have successfully finished the quiz.</p>
            <div class="bg-gray-50 rounded-lg p-4 mb-8">
                <span class="text-gray-500 text-sm">Final Score</span>
                <div id="modalScore" class="text-3xl font-black text-indigo-600 mt-1">0%</div>
            </div>
            <div class="space-y-3">
                <button onclick="showReview()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">Get Details</button>
                <button onclick="resetApp()" class="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition">Close</button>
            </div>
        </div>
    </div>

    <script>
        lucide.createIcons();
        let mcqData = [], currentQuestionIndex = 0, userAnswers = {};
        const screens = { setup: document.getElementById('setupScreen'), quiz: document.getElementById('quizArena'), review: document.getElementById('reviewScreen') };
        const els = { backendUrl: document.getElementById('backendUrl'), apiKey: document.getElementById('apiKey'), content: document.getElementById('content'), difficulty: document.getElementById('difficulty'), maxQuestions: document.getElementById('maxQuestions'), generateBtn: document.getElementById('generateBtn'), loading: document.getElementById('loading'), error: document.getElementById('error'), questionCounter: document.getElementById('questionCounter'), questionText: document.getElementById('questionText'), optionsContainer: document.getElementById('optionsContainer'), nextBtn: document.getElementById('nextBtn'), resultModal: document.getElementById('resultModal'), modalScore: document.getElementById('modalScore'), finalScoreDisplay: document.getElementById('finalScoreDisplay'), reviewList: document.getElementById('reviewList') };

        async function generateQuiz() {
            const url = els.backendUrl.value.replace(/\/+$/, '') + '/generate-mcq'; // Append endpoint
            const key = els.apiKey.value, text = els.content.value;
            if (!url || !key || !text) return showError("Please fill in all fields.");
            showError(null); els.generateBtn.disabled = true; els.loading.classList.remove('hidden');
            try {
                // Read and validate maxQuestions before sending
                let maxQ = parseInt(els.maxQuestions.value, 10);
                if (isNaN(maxQ) || maxQ <= 0) maxQ = undefined;

                const payload = { content: text, api_key: key, difficulty: els.difficulty.value };
                if (typeof maxQ !== 'undefined') payload.max_questions = maxQ; // backend expects `max_questions`

                const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail || "Failed to generate.");
                mcqData = data; startQuiz();
            } catch (err) { showError(err.message); els.generateBtn.disabled = false; } finally { els.loading.classList.add('hidden'); }
        }

        function startQuiz() { currentQuestionIndex = 0; userAnswers = {}; switchScreen('quiz'); renderQuestion(); }
        function renderQuestion() {
            const q = mcqData[currentQuestionIndex];
            els.questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${mcqData.length}`;
            els.questionText.textContent = q.question;
            els.optionsContainer.innerHTML = '';
            ['A', 'B', 'C', 'D'].forEach(label => {
                const btn = document.createElement('div');
                btn.className = `option-card group flex items-center p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-indigo-300 transition-all duration-200`;
                btn.onclick = () => selectOption(label);
                if (userAnswers[currentQuestionIndex] === label) btn.classList.add('selected');
                btn.innerHTML = `<div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold text-sm mr-4 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">${label}</div><span class="text-gray-700 font-medium text-lg">${q.options[label]}</span>`;
                btn.dataset.value = label;
                els.optionsContainer.appendChild(btn);
            });
            const isLast = currentQuestionIndex === mcqData.length - 1;
            els.nextBtn.innerHTML = isLast ? `Submit Quiz <i data-lucide="check-circle" class="w-4 h-4 inline ml-1"></i>` : `Next <i data-lucide="arrow-right" class="w-4 h-4 inline ml-1"></i>`;
            els.nextBtn.onclick = isLast ? submitQuiz : nextQuestion;
            // Disable the next/submit button until an option is chosen for the current question
            els.nextBtn.disabled = !userAnswers[currentQuestionIndex];
            lucide.createIcons();
        }
        function selectOption(label) {
            userAnswers[currentQuestionIndex] = label;
            Array.from(els.optionsContainer.children).forEach(opt => opt.classList.toggle('selected', opt.dataset.value === label));
            // Enable the Next/Submit button now that an option is selected
            els.nextBtn.disabled = false;
        }
        function nextQuestion() { if (!userAnswers[currentQuestionIndex]) return alert("Select an answer first."); currentQuestionIndex++; renderQuestion(); }
        function submitQuiz() { if (!userAnswers[currentQuestionIndex]) return alert("Select an answer first."); let score = 0; mcqData.forEach((q, idx) => { if (userAnswers[idx] === q.answer) score++; }); els.modalScore.textContent = `${Math.round((score / mcqData.length) * 100)}%`; els.resultModal.classList.remove('hidden'); }
        function showReview() {
            els.resultModal.classList.add('hidden'); switchScreen('review'); els.reviewList.innerHTML = ''; let score = 0;
            mcqData.forEach((q, idx) => {
                const userChoice = userAnswers[idx], isCorrect = userChoice === q.answer; if (isCorrect) score++;
                let optionsHtml = ''; ['A', 'B', 'C', 'D'].forEach(label => {
                    let styles = "border-gray-200", icon = "";
                    if (label === q.answer) { styles = "border-green-500 bg-green-50 text-green-800"; icon = `<i data-lucide="check" class="w-5 h-5 text-green-600 ml-auto"></i>`; }
                    else if (label === userChoice && !isCorrect) { styles = "border-red-500 bg-red-50 text-red-800"; icon = `<i data-lucide="x" class="w-5 h-5 text-red-600 ml-auto"></i>`; }
                    optionsHtml += `<div class="flex items-center p-3 rounded-lg border-2 ${styles} mb-2"><span class="font-bold mr-3 w-6">${label}.</span><span>${q.options[label]}</span>${icon}</div>`;
                });
                const card = document.createElement('div'); card.className = "bg-white p-6 rounded-xl shadow-sm border border-gray-200";
                card.innerHTML = `<div class="flex items-start gap-3 mb-4"><span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded mt-1">Q${idx+1}</span><h3 class="text-lg font-bold text-gray-800 leading-snug">${q.question}</h3></div><div class="space-y-1 mb-4">${optionsHtml}</div><div class="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100"><span class="font-bold uppercase text-xs tracking-wider block mb-1">Explanation</span>${q.explanation}</div>`;
                els.reviewList.appendChild(card);
            });
            els.finalScoreDisplay.textContent = `${score} / ${mcqData.length}`; lucide.createIcons();
        }
        function switchScreen(name) { Object.values(screens).forEach(s => s.classList.add('hidden')); screens[name].classList.remove('hidden'); }
        function resetApp() { els.resultModal.classList.add('hidden'); els.generateBtn.disabled = false; switchScreen('setup'); }
        function showError(msg) { els.error.textContent = msg; els.error.classList.toggle('hidden', !msg); }
    </script>
</body>
</html>