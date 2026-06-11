// Game data
const gameData = {
    categories: [
        {
            name: "Sports Legends",
            questions: [
                { points: 5, question: "Who won the most WWE championships?", answer: "John Cena" },
                { points: 7, question: "Which wrestler is known as 'The Phenom'?", answer: "The Undertaker" },
                { points: 10, question: "What is the finishing move of Stone Cold Steve Austin?", answer: "Stone Cold Stunner" }
            ]
        },
        {
            name: "Pop Culture",
            questions: [
                { points: 5, question: "What is Spider-Man's real name?", answer: "Peter Parker" },
                { points: 7, question: "Which movie won Best Picture at the 2023 Oscars?", answer: "Everything Everywhere All at Once" },
                { points: 10, question: "Who directed 'Inception'?", answer: "Christopher Nolan" }
            ]
        },
        {
            name: "History",
            questions: [
                { points: 5, question: "In what year did the Titanic sink?", answer: "1912" },
                { points: 7, question: "Who was the first president of the United States?", answer: "George Washington" },
                { points: 10, question: "What empire built Machu Picchu?", answer: "Inca Empire" }
            ]
        },
        {
            name: "Mystery",
            questions: [
                { points: 5, question: "What color is the rarest diamond?", answer: "Red" },
                { points: 7, question: "How many bones does an adult human have?", answer: "206" },
                { points: 10, question: "What is the smallest country in the world?", answer: "Vatican City" }
            ]
        }
    ]
};

// Special spaces data
const specialSpaces = {
    whammy: { icon: "💥", message: "WHAMMY! Lose 50 Points!", effect: "minus50" },
    dailyDubski: { icon: "🎯", message: "DAILY DUBSKI! Double Points!", effect: "double" },
    decisionTime: { icon: "⚡", message: "DECISION TIME! Pick Again!", effect: "pick" }
};

// Game state
let gameState = {
    team1Score: 0,
    team2Score: 0,
    currentTeam: 1,
    answered: [],
    timerRunning: false,
    timerSeconds: 0,
    gameActive: true
};

// DOM elements
const gameBoard = document.getElementById("gameBoard");
const modal = document.getElementById("questionModal");
const questionModal = document.getElementById("questionView");
const answerModal = document.getElementById("answerView");
const specialModal = document.getElementById("specialView");
const resultModal = document.getElementById("resultView");
const closeBtn = document.getElementById("closeBtn");
const team1Score = document.getElementById("team1Score");
const team2Score = document.getElementById("team2Score");
const team1Turn = document.getElementById("turn1");
const team2Turn = document.getElementById("turn2");
const timer = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBoardBtn = document.getElementById("resetBoardBtn");
const timerStartBtn = document.getElementById("timerStartBtn");
const timerStopBtn = document.getElementById("timerStopBtn");
const timerResetBtn = document.getElementById("timerResetBtn");
const winnerScreen = document.getElementById("winnerScreen");
const winnerName = document.getElementById("winnerName");
const winnerScore = document.getElementById("winnerScore");
const resetGameBtn = document.getElementById("resetGameBtn");

let currentQuestion = null;
let currentPoints = 0;
let currentCategory = null;

// Initialize game
function initializeGame() {
    createGameBoard();
    updateScoreboard();
    updateTurnIndicator();
}

// Create game board
function createGameBoard() {
    gameBoard.innerHTML = "";
    
    gameData.categories.forEach((category, categoryIndex) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";
        
        const titleDiv = document.createElement("div");
        titleDiv.className = "category-title";
        titleDiv.textContent = category.name;
        categoryDiv.appendChild(titleDiv);
        
        const questionsGrid = document.createElement("div");
        questionsGrid.className = "questions-grid";
        
        category.questions.forEach((question, questionIndex) => {
            const questionBtn = document.createElement("button");
            questionBtn.className = "question-btn";
            questionBtn.textContent = `$${question.points}`;
            questionBtn.setAttribute("data-category", categoryIndex);
            questionBtn.setAttribute("data-question", questionIndex);
            questionBtn.id = `q-${categoryIndex}-${questionIndex}`;
            
            // Random special space chance (10%)
            if (Math.random() < 0.1) {
                const specialType = Object.keys(specialSpaces)[Math.floor(Math.random() * 3)];
                questionBtn.classList.add(specialType);
                questionBtn.setAttribute("data-special", specialType);
            }
            
            questionBtn.addEventListener("click", () => selectQuestion(categoryIndex, questionIndex));
            questionsGrid.appendChild(questionBtn);
        });
        
        categoryDiv.appendChild(questionsGrid);
        gameBoard.appendChild(categoryDiv);
    });
}

// Select question
function selectQuestion(categoryIndex, questionIndex) {
    const questionBtn = document.getElementById(`q-${categoryIndex}-${questionIndex}`);
    
    if (questionBtn.disabled) return;
    
    const isSpecial = questionBtn.getAttribute("data-special");
    
    if (isSpecial) {
        showSpecialSpace(isSpecial, questionBtn);
    } else {
        showQuestion(categoryIndex, questionIndex);
    }
}

// Show special space
function showSpecialSpace(specialType, button) {
    const special = specialSpaces[specialType];
    currentQuestion = { special: true, type: specialType, button };
    
    questionModal.classList.add("hidden");
    answerModal.classList.add("hidden");
    resultModal.classList.add("hidden");
    specialModal.classList.remove("hidden");
    
    document.getElementById("specialIcon").textContent = special.icon;
    document.getElementById("specialMessage").textContent = special.message;
    document.getElementById("specialBtn").onclick = () => {
        applySpecialEffect(specialType);
        button.disabled = true;
        button.textContent = "✓";
        modal.classList.add("hidden");
    };
    
    modal.classList.remove("hidden");
    document.getElementById("categoryName").textContent = "SPECIAL";
    document.getElementById("pointValue").textContent = "SPACE";
}

// Apply special effect
function applySpecialEffect(type) {
    switch (type) {
        case "whammy":
            if (gameState.currentTeam === 1) gameState.team1Score = Math.max(0, gameState.team1Score - 50);
            else gameState.team2Score = Math.max(0, gameState.team2Score - 50);
            break;
        case "dailyDubski":
            // Double next correct answer
            break;
        case "decisionTime":
            // Player picks again (handled by allowing next turn)
            break;
    }
    updateScoreboard();
}

// Show question
function showQuestion(categoryIndex, questionIndex) {
    const category = gameData.categories[categoryIndex];
    const question = category.questions[questionIndex];
    
    currentQuestion = { category: categoryIndex, question: questionIndex, data: question };
    currentPoints = question.points;
    currentCategory = category.name;
    
    questionModal.classList.remove("hidden");
    answerModal.classList.add("hidden");
    resultModal.classList.add("hidden");
    specialModal.classList.add("hidden");
    
    document.getElementById("categoryName").textContent = category.name;
    document.getElementById("pointValue").textContent = `$${question.points}`;
    document.getElementById("questionText").textContent = question.question;
    
    document.getElementById("revealBtn").onclick = revealAnswer;
    
    modal.classList.remove("hidden");
}

// Reveal answer
function revealAnswer() {
    questionModal.classList.add("hidden");
    answerModal.classList.remove("hidden");
    
    const answer = currentQuestion.data.answer;
    document.getElementById("answerText").textContent = answer;
    
    document.getElementById("correctBtn").onclick = () => awardPoints();
    document.getElementById("incorrectBtn").onclick = () => nextTeam();
}

// Award points
function awardPoints() {
    gameState.currentTeam === 1
        ? (gameState.team1Score += currentPoints)
        : (gameState.team2Score += currentPoints);
    
    updateScoreboard();
    disableQuestion();
    showResult(`✓ CORRECT! +$${currentPoints}`);
    setTimeout(() => modal.classList.add("hidden"), 2000);
}

// Next team
function nextTeam() {
    disableQuestion();
    showResult(`✗ INCORRECT! $0 Points`);
    setTimeout(() => {
        gameState.currentTeam = gameState.currentTeam === 1 ? 2 : 1;
        updateTurnIndicator();
        modal.classList.add("hidden");
    }, 2000);
}

// Show result
function showResult(message) {
    questionModal.classList.add("hidden");
    answerModal.classList.add("hidden");
    specialModal.classList.add("hidden");
    resultModal.classList.remove("hidden");
    
    document.getElementById("resultMessage").textContent = message;
    document.getElementById("pointAwarded").textContent = `$${currentPoints}`;
}

// Disable question
function disableQuestion() {
    if (currentQuestion.category !== undefined) {
        const btn = document.getElementById(`q-${currentQuestion.category}-${currentQuestion.question}`);
        btn.disabled = true;
        btn.textContent = "✓";
    }
}

// Update scoreboard
function updateScoreboard() {
    team1Score.textContent = gameState.team1Score;
    team2Score.textContent = gameState.team2Score;
    
    // Check for winner (first to 100)
    if (gameState.team1Score >= 100) {
        showWinner(1);
    } else if (gameState.team2Score >= 100) {
        showWinner(2);
    }
}

// Update turn indicator
function updateTurnIndicator() {
    team1Turn.classList.toggle("hidden", gameState.currentTeam !== 1);
    team2Turn.classList.toggle("hidden", gameState.currentTeam !== 2);
}

// Show winner
function showWinner(teamNumber) {
    gameState.gameActive = false;
    const team1Name = document.getElementById("team1Name").value;
    const team2Name = document.getElementById("team2Name").value;
    const winnerTeamName = teamNumber === 1 ? team1Name : team2Name;
    const winnerPoints = teamNumber === 1 ? gameState.team1Score : gameState.team2Score;
    
    winnerName.textContent = winnerTeamName;
    winnerScore.textContent = `${winnerPoints} Points`;
    winnerScreen.classList.remove("hidden");
}

// Reset game
function resetGame() {
    gameState = {
        team1Score: 0,
        team2Score: 0,
        currentTeam: 1,
        answered: [],
        timerRunning: false,
        timerSeconds: 0,
        gameActive: true
    };
    
    winnerScreen.classList.add("hidden");
    modal.classList.add("hidden");
    createGameBoard();
    updateScoreboard();
    updateTurnIndicator();
}

// Timer functions
function startTimer() {
    gameState.timerRunning = true;
    const timerInterval = setInterval(() => {
        if (gameState.timerRunning) {
            gameState.timerSeconds++;
            const minutes = Math.floor(gameState.timerSeconds / 60);
            const seconds = gameState.timerSeconds % 60;
            timer.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function pauseTimer() {
    gameState.timerRunning = false;
}

function resetTimer() {
    gameState.timerRunning = false;
    gameState.timerSeconds = 0;
    timer.textContent = "0:00";
}

// Event listeners
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
startBtn.addEventListener("click", initializeGame);
resetBoardBtn.addEventListener("click", resetGame);
timerStartBtn.addEventListener("click", startTimer);
timerStopBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);
resetGameBtn.addEventListener("click", resetGame);

// Close modal on background click
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
});

// Initialize on page load
window.addEventListener("DOMContentLoaded", initializeGame);
