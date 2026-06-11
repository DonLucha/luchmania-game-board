// ========== GAME STATE ==========
const gameState = {
    team1: { name: 'Team 1', score: 0 },
    team2: { name: 'Team 2', score: 0 },
    currentTeam: 1,
    categories: [
        {
            name: 'Wrestlers',
            questions: [
                { points: 1, question: 'Who is the most popular wrestler?', answer: 'The Rock', used: false, special: null },
                { points: 5, question: 'Name a legendary tag team.', answer: 'The Hardy Boyz', used: false, special: null },
                { points: 7, question: 'Who is known as the Undertaker?', answer: 'Mark Calaway', used: false, special: null },
                { points: 10, question: 'Who started the Attitude Era?', answer: 'Stone Cold Steve Austin', used: false, special: 'daily-double' }
            ]
        },
        {
            name: 'Moves & Finishers',
            questions: [
                { points: 1, question: 'What is a basic wrestling move?', answer: 'Body Slam', used: false, special: null },
                { points: 5, question: 'What is the Pedigree?', answer: 'Triple H finisher', used: false, special: null },
                { points: 7, question: 'Name the Tombstone Piledriver.', answer: 'Undertaker finisher', used: false, special: null },
                { points: 10, question: 'Who executes the Stone Cold Stunner?', answer: 'Stone Cold Steve Austin', used: false, special: 'whammy' }
            ]
        },
        {
            name: 'Championships',
            questions: [
                { points: 1, question: 'What is the main WWE belt called?', answer: 'WWE Championship', used: false, special: null },
                { points: 5, question: 'How many times has John Cena won the championship?', answer: '13 times', used: false, special: null },
                { points: 7, question: 'What is the Women\'s championship called?', answer: 'Divas Championship', used: false, special: null },
                { points: 10, question: 'Who won the first Royal Rumble?', answer: 'Hulk Hogan', used: false, special: 'decision-time' }
            ]
        },
        {
            name: 'Storylines',
            questions: [
                { points: 1, question: 'What is a feud?', answer: 'A conflict between wrestlers', used: false, special: null },
                { points: 5, question: 'What is WCW?', answer: 'World Championship Wrestling', used: false, special: null },
                { points: 7, question: 'Who was in the Kliq?', answer: 'Shawn Michaels, Triple H, etc.', used: false, special: null },
                { points: 10, question: 'What is the nWo?', answer: 'New World Order faction', used: false, special: 'daily-double' }
            ]
        }
    ],
    currentQuestion: null,
    timerInterval: null,
    timeRemaining: 30
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    loadTeamNames();
});

function initializeGame() {
    renderBoard();
    updateScoreboard();
}

function loadTeamNames() {
    const team1NameInput = document.getElementById('team1Name');
    const team2NameInput = document.getElementById('team2Name');
    
    team1NameInput.value = gameState.team1.name;
    team2NameInput.value = gameState.team2.name;
    
    team1NameInput.addEventListener('change', (e) => {
        gameState.team1.name = e.target.value || 'Team 1';
        updateScoreboard();
    });
    
    team2NameInput.addEventListener('change', (e) => {
        gameState.team2.name = e.target.value || 'Team 2';
        updateScoreboard();
    });
}

// ========== RENDER GAME BOARD ==========
function renderBoard() {
    const boardContainer = document.getElementById('boardContainer');
    boardContainer.innerHTML = '';
    
    gameState.categories.forEach((category, catIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'category-title';
        titleDiv.textContent = category.name;
        categoryDiv.appendChild(titleDiv);
        
        category.questions.forEach((q, qIndex) => {
            const btn = document.createElement('button');
            btn.className = 'question-btn';
            
            if (q.special) {
                btn.classList.add('special');
            }
            
            if (q.used) {
                btn.classList.add('used');
                btn.disabled = true;
            }
            
            btn.textContent = `$${q.points}`;
            btn.onclick = () => selectQuestion(catIndex, qIndex);
            categoryDiv.appendChild(btn);
        });
        
        boardContainer.appendChild(categoryDiv);
    });
}

// ========== UPDATE SCOREBOARD ==========
function updateScoreboard() {
    document.getElementById('team1Name').value = gameState.team1.name;
    document.getElementById('team2Name').value = gameState.team2.name;
    document.getElementById('team1Score').textContent = gameState.team1.score;
    document.getElementById('team2Score').textContent = gameState.team2.score;
    document.getElementById('currentTurn').textContent = gameState.currentTeam === 1 ? gameState.team1.name : gameState.team2.name;
}

// ========== SELECT QUESTION ==========
function selectQuestion(categoryIndex, questionIndex) {
    const question = gameState.categories[categoryIndex].questions[questionIndex];
    
    if (question.used) return;
    
    gameState.currentQuestion = {
        categoryIndex,
        questionIndex,
        points: question.points,
        special: question.special
    };
    
    const modal = document.getElementById('questionModal');
    modal.classList.remove('hidden');
    
    document.getElementById('categoryDisplay').textContent = gameState.categories[categoryIndex].name;
    document.getElementById('pointsDisplay').textContent = `${question.points} Points`;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('answerText').textContent = question.answer;
    
    document.getElementById('questionPhase').classList.remove('hidden');
    document.getElementById('answerPhase').classList.add('hidden');
    document.getElementById('specialPhase').classList.add('hidden');
    
    // Start timer
    startTimer();
    
    // Play sound effect
    playSound('question-appear');
}

// ========== REVEAL ANSWER ==========
function revealAnswer() {
    document.getElementById('questionPhase').classList.add('hidden');
    document.getElementById('answerPhase').classList.remove('hidden');
    stopTimer();
    playSound('reveal');
}

// ========== AWARD POINTS ==========
function awardPoints(isCorrect) {
    const { categoryIndex, questionIndex, points, special } = gameState.currentQuestion;
    
    // Mark question as used
    gameState.categories[categoryIndex].questions[questionIndex].used = true;
    
    if (isCorrect) {
        playSound('correct');
        
        let pointsToAward = points;
        
        // Handle Daily Double
        if (special === 'daily-double') {
            pointsToAward = points * 2;
            showSpecial('🎉 DAILY DOUBLE! 🎉', `Points doubled! +${pointsToAward}`);
        }
        // Handle Decision Time - Player chooses points
        else if (special === 'decision-time') {
            const chosenPoints = prompt(`Choose your point value (1-${points * 2}):`, points);
            pointsToAward = parseInt(chosenPoints) || points;
            showSpecial('⚖️ DECISION TIME! ⚖️', `You chose ${pointsToAward} points!`);
        }
        
        // Award points to current team
        if (gameState.currentTeam === 1) {
            gameState.team1.score += pointsToAward;
        } else {
            gameState.team2.score += pointsToAward;
        }
    } else {
        playSound('incorrect');
        
        // Handle Whammy - Lose turn and points
        if (special === 'whammy') {
            const pointsLost = points;
            if (gameState.currentTeam === 1) {
                gameState.team1.score = Math.max(0, gameState.team1.score - pointsLost);
            } else {
                gameState.team2.score = Math.max(0, gameState.team2.score - pointsLost);
            }
            showSpecial('⚡ WHAMMY! ⚡', `Lose ${pointsLost} points and your turn!`);
            switchTeam();
        }
        // Normal incorrect - Lose turn
        else {
            switchTeam();
        }
    }
    
    updateScoreboard();
    renderBoard();
    
    setTimeout(() => {
        closeQuestion();
    }, 2000);
}

// ========== SWITCH TEAM ==========
function switchTeam() {
    gameState.currentTeam = gameState.currentTeam === 1 ? 2 : 1;
    updateScoreboard();
}

// ========== SHOW SPECIAL MESSAGE ==========
function showSpecial(title, message) {
    const specialPhase = document.getElementById('specialPhase');
    const specialContent = document.getElementById('specialContent');
    
    specialContent.innerHTML = `<div>${title}</div><div style="font-size: 1.5rem; margin-top: 20px;">${message}</div>`;
    
    document.getElementById('questionPhase').classList.add('hidden');
    document.getElementById('answerPhase').classList.add('hidden');
    specialPhase.classList.remove('hidden');
}

// ========== CLOSE QUESTION MODAL ==========
function closeQuestion() {
    const modal = document.getElementById('questionModal');
    modal.classList.add('hidden');
    stopTimer();
}

// ========== TIMER ==========
function startTimer() {
    gameState.timeRemaining = 30;
    updateTimerDisplay();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 10 && gameState.timeRemaining > 0) {
            playSound('timer-warning');
            document.getElementById('timer').classList.add('warning');
        }
        
        if (gameState.timeRemaining <= 0) {
            stopTimer();
            playSound('timer-end');
            closeQuestion();
            switchTeam();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
    document.getElementById('timer').classList.remove('warning');
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = gameState.timeRemaining;
}

// ========== RESET GAME ==========
function resetGame() {
    if (confirm('Reset the game? All progress will be lost.')) {
        gameState.team1.score = 0;
        gameState.team2.score = 0;
        gameState.currentTeam = 1;
        
        gameState.categories.forEach(category => {
            category.questions.forEach(q => {
                q.used = false;
            });
        });
        
        closeQuestion();
        document.getElementById('winnerScreen').classList.add('hidden');
        updateScoreboard();
        renderBoard();
    }
}

// ========== END GAME ==========
function endGame() {
    const team1Score = gameState.team1.score;
    const team2Score = gameState.team2.score;
    
    let winner, score;
    
    if (team1Score > team2Score) {
        winner = gameState.team1.name;
        score = team1Score;
    } else if (team2Score > team1Score) {
        winner = gameState.team2.name;
        score = team2Score;
    } else {
        winner = 'TIE';
        score = team1Score;
    }
    
    document.getElementById('winnerName').textContent = winner;
    document.getElementById('winnerScore').textContent = `Score: ${score}`;
    document.getElementById('winnerScreen').classList.remove('hidden');
    
    playSound('winner');
}

// ========== GOOGLE SHEETS INTEGRATION ==========
function loadFromGoogleSheets() {
    const sheetsUrl = document.getElementById('sheetsUrl').value;
    
    if (!sheetsUrl) {
        alert('Please paste a Google Sheets share URL');
        return;
    }
    
    // Extract sheet ID from URL
    const sheetIdMatch = sheetsUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
        alert('Invalid Google Sheets URL');
        return;
    }
    
    const sheetId = sheetIdMatch[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    fetch(csvUrl)
        .then(response => response.text())
        .then(csv => parseGoogleSheetsData(csv))
        .catch(error => {
            console.error('Error loading sheets:', error);
            alert('Error loading Google Sheets. Make sure the URL is publicly shareable.');
        });
}

function parseGoogleSheetsData(csv) {
    const lines = csv.trim().split('\n');
    const newCategories = [];
    
    let currentCategory = null;
    let questionCount = 0;
    
    lines.forEach((line, index) => {
        if (index === 0) return; // Skip header
        
        const [category, points, question, answer] = line.split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1'));
        
        if (category && points && question && answer) {
            if (!currentCategory || currentCategory.name !== category) {
                if (currentCategory) {
                    newCategories.push(currentCategory);
                }
                currentCategory = {
                    name: category,
                    questions: []
                };
                questionCount = 0;
            }
            
            currentCategory.questions.push({
                points: parseInt(points),
                question: question,
                answer: answer,
                used: false,
                special: null
            });
            
            questionCount++;
        }
    });
    
    if (currentCategory) {
        newCategories.push(currentCategory);
    }
    
    if (newCategories.length > 0) {
        gameState.categories = newCategories;
        resetGame();
        alert('Successfully loaded questions from Google Sheets!');
    }
}
