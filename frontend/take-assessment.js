// Global variables
let testData = null;
let currentQuestionIndex = 0;
let studentAnswers = {};
let timerInterval = null;
let timeRemaining = 0;

// Check if user is logged in
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userName = localStorage.getItem('loggedInUserName');
    
    if (loggedInUser) {
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('btn-logout').style.display = 'flex';
        document.getElementById('user-name').textContent = userName || loggedInUser.split('@')[0];
    }
}

// Logout function
function handleLogout() {
    if (timerInterval) {
        // Test is in progress
        if (!confirm('Are you sure you want to logout? Your test progress will be lost.')) {
            return;
        }
        clearInterval(timerInterval);
    }
    
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUserName');
    window.location.href = 'index.html';
}

// Check for test code in URL
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    
    if (codeFromUrl) {
        document.getElementById('test-code-input').value = codeFromUrl;
        // Auto-load test if code is in URL
        setTimeout(() => {
            loadTest(new Event('submit'));
        }, 500);
    }
});

// Load test by code
async function loadTest(event) {
    event.preventDefault();
    
    const testCode = document.getElementById('test-code-input').value.trim().toUpperCase();
    
    if (!testCode) {
        alert('Please enter a test code');
        return;
    }

    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    // If logged in, check if they already took this test
    if (loggedInUser) {
        try {
            const checkResponse = await fetch(
                `http://localhost:8080/api/tests/check-attempt/${testCode}?email=${loggedInUser}`
            );
            
            if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                
                if (checkData.alreadyTaken) {
                    showAlreadyTakenModal(checkData);
                    return;
                }
            }
        } catch (error) {
            console.error('Error checking test attempt:', error);
        }
    }

    try {
        // Build URL with email if logged in
        let url = `http://localhost:8080/api/tests/take/${testCode}`;
        if (loggedInUser) {
            url += `?email=${loggedInUser}`;
        }
        
        const response = await fetch(url);
        
        if (response.status === 404) {
            alert('Test not found. Please check the code and try again.');
            return;
        }
        
        if (response.status === 403) {
            const errorText = await response.text();
            if (errorText.includes('already taken')) {
                alert('You have already taken this test. Each student can only take a test once.');
            } else {
                alert('This test is not yet active. Please try again later.');
            }
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to load test');
        }

        testData = await response.json();
        console.log('Test loaded:', testData);

        // Show student info section
        document.getElementById('enter-code-section').style.display = 'none';
        document.getElementById('student-info-section').style.display = 'flex';
        
        // Update test details
        document.getElementById('test-title').textContent = testData.title;
        
        const testDetailsHTML = `
            <div class="detail-item">
                <strong>Test Title:</strong>
                <span>${testData.title}</span>
            </div>
            <div class="detail-item">
                <strong>Duration:</strong>
                <span>${testData.duration} minutes</span>
            </div>
            <div class="detail-item">
                <strong>Total Questions:</strong>
                <span>${testData.totalQuestions}</span>
            </div>
            ${testData.description ? `
                <div class="detail-item">
                    <strong>Description:</strong>
                    <span>${testData.description}</span>
                </div>
            ` : ''}
        `;
        
        document.getElementById('test-details').innerHTML = testDetailsHTML;

        // Auto-fill student info if logged in
        const userName = localStorage.getItem('loggedInUserName');
        
        if (loggedInUser) {
            document.getElementById('student-email').value = loggedInUser;
            if (userName) {
                document.getElementById('student-name').value = userName;
            }
            
            // Make email field readonly for logged-in users
            document.getElementById('student-email').setAttribute('readonly', true);
            document.getElementById('student-email').style.backgroundColor = '#f3f4f6';
        }

    } catch (error) {
        console.error('Error loading test:', error);
        alert('Failed to load test. Please try again.');
    }
}

// Show already taken modal
function showAlreadyTakenModal(data) {
    const percentage = (data.score / data.totalQuestions * 100).toFixed(1);
    const submittedDate = new Date(data.submittedAt).toLocaleString();
    
    // Remove any existing modal first
    const existingModal = document.getElementById('alreadyTakenModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.id = 'alreadyTakenModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="already-taken-content">
                <div class="warning-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h2>Test Already Taken</h2>
                <p class="warning-text">You have already completed this test. Each student can only take a test once.</p>
                
                <div class="previous-score-box">
                    <h4>Your Previous Score</h4>
                    <div class="score-summary">
                        <div class="score-item">
                            <span class="score-label">Score:</span>
                            <span class="score-value">${data.score} / ${data.totalQuestions}</span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">Percentage:</span>
                            <span class="score-value">${percentage}%</span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">Submitted:</span>
                            <span class="score-value">${submittedDate}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button class="btn-primary-modal" onclick="closeAlreadyTakenModal()">
                        <i class="fas fa-home"></i> Go to Home
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden';
}

// Close already taken modal
function closeAlreadyTakenModal() {
    const modal = document.getElementById('alreadyTakenModal');
    if (modal) {
        modal.remove();
    }
    // Restore scrolling
    document.body.style.overflow = 'auto';
    window.location.href = 'index.html';
}

// Start test
function startTest(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('student-name').value.trim();
    const studentEmail = document.getElementById('student-email').value.trim();
    
    if (!studentName || !studentEmail) {
        alert('Please fill in all required fields');
        return;
    }

    // Store student info
    testData.studentName = studentName;
    testData.studentEmail = studentEmail;

    // Hide student info, show test
    document.getElementById('student-info-section').style.display = 'none';
    document.getElementById('test-section').style.display = 'block';
    
    // Show timer
    const timerContainer = document.getElementById('timer-container');
    if (timerContainer) {
        timerContainer.style.display = 'flex';
    }
    
    // Hide user info if it exists (to save space during test)
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.style.display = 'none';
    }
    
    // Initialize test
    document.getElementById('total-questions').textContent = testData.questions.length;
    currentQuestionIndex = 0;
    studentAnswers = {};
    
    renderQuestion();
    startTimer();
}

// Render current question
function renderQuestion() {
    const question = testData.questions[currentQuestionIndex];
    
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    
    const questionHTML = `
        <div class="question-card">
            <div class="question-text">
                ${currentQuestionIndex + 1}. ${question.questionText}
            </div>
            <div class="options-list">
                ${renderOption(question.id, 0, 'A', question.optionA)}
                ${renderOption(question.id, 1, 'B', question.optionB)}
                ${renderOption(question.id, 2, 'C', question.optionC)}
                ${renderOption(question.id, 3, 'D', question.optionD)}
            </div>
        </div>
    `;
    
    document.getElementById('questions-container').innerHTML = questionHTML;
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / testData.questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Update navigation buttons
    document.getElementById('btn-previous').disabled = currentQuestionIndex === 0;
    
    const isLastQuestion = currentQuestionIndex === testData.questions.length - 1;
    document.getElementById('btn-next').style.display = isLastQuestion ? 'none' : 'flex';
    document.getElementById('btn-submit').style.display = isLastQuestion ? 'flex' : 'none';
}

// Render single option
function renderOption(questionId, optionIndex, label, text) {
    const isSelected = studentAnswers[questionId] === optionIndex;
    return `
        <div class="option-item ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${questionId}, ${optionIndex})">
            <input type="radio" name="question-${questionId}" value="${optionIndex}" ${isSelected ? 'checked' : ''}>
            <span class="option-label">${label}.</span>
            <span class="option-text">${text}</span>
        </div>
    `;
}

// Select answer
function selectAnswer(questionId, optionIndex) {
    studentAnswers[questionId] = optionIndex;
    renderQuestion();
}

// Navigation
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < testData.questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

// Timer
function startTimer() {
    timeRemaining = testData.duration * 60; // Convert minutes to seconds
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const timerContainer = document.getElementById('timer-container');
        
        // Warning at 5 minutes
        if (timeRemaining === 300) {
            timerContainer.classList.add('warning');
        }
        
        // Danger at 1 minute
        if (timeRemaining === 60) {
            timerContainer.classList.remove('warning');
            timerContainer.classList.add('danger');
        }
        
        // Time's up
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Submitting your test...');
            submitTest();
        }
    }, 1000);
}

// Submit test
async function submitTest() {
    // Check if all questions are answered
    const unansweredCount = testData.questions.length - Object.keys(studentAnswers).length;
    
    if (unansweredCount > 0) {
        if (!confirm(`You have ${unansweredCount} unanswered question(s). Submit anyway?`)) {
            return;
        }
    }

    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const submitData = {
        testCode: testData.testCode,
        studentEmail: testData.studentEmail,
        studentName: testData.studentName,
        answers: studentAnswers
    };

    try {
        const response = await fetch('http://localhost:8080/api/tests/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit test');
        }

        const results = await response.json();
        console.log('Results:', results);

        // Show results
        showResults(results);

    } catch (error) {
        console.error('Error submitting test:', error);
        alert('Failed to submit test. Please try again.');
    }
}

// Show results
function showResults(results) {
    document.getElementById('test-section').style.display = 'none';
    
    const timerContainer = document.getElementById('timer-container');
    if (timerContainer) {
        timerContainer.style.display = 'none';
    }
    
    document.getElementById('results-section').style.display = 'block';
    
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.style.display = 'flex';
    }

    // Update score display
    document.getElementById('score-display').textContent = results.score;
    document.getElementById('total-score').textContent = results.totalQuestions;
    document.getElementById('percentage-display').textContent = results.percentage.toFixed(1) + '%';

    // Score message
    const percentage = results.percentage;
    let message = '';
    let iconClass = 'fas fa-trophy';
    
    if (percentage >= 90) {
        message = 'Outstanding! Excellent work! 🌟';
    } else if (percentage >= 75) {
        message = 'Great job! Well done! 👏';
    } else if (percentage >= 60) {
        message = 'Good effort! Keep it up! 💪';
    } else if (percentage >= 40) {
        message = 'Not bad! Room for improvement. 📚';
    } else {
        message = 'Keep practicing! You can do better! 💪';
        iconClass = 'fas fa-book';
    }
    
    document.getElementById('score-message').textContent = message;
    document.querySelector('.score-icon i').className = iconClass;

    // Render answer review
    let answersHTML = '';
    
    testData.questions.forEach((question, index) => {
        const questionId = question.id;
        const correctAnswer = results.correctAnswers[questionId];
        const studentAnswer = results.studentAnswers[questionId];
        const isCorrect = correctAnswer === studentAnswer;

        const options = [question.optionA, question.optionB, question.optionC, question.optionD];
        
        answersHTML += `
            <div class="answer-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="answer-question">
                    <span>${index + 1}.</span>
                    <span>${question.questionText}</span>
                </div>
                <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                    <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                    ${isCorrect ? 'Correct' : 'Incorrect'}
                </div>
                <div class="answer-details">
                    ${studentAnswer !== undefined ? `
                        <div class="your-answer">
                            <strong>Your Answer:</strong>
                            <span>${String.fromCharCode(65 + studentAnswer)}. ${options[studentAnswer]}</span>
                        </div>
                    ` : '<div class="your-answer"><strong>Your Answer:</strong> <span>Not answered</span></div>'}
                    ${!isCorrect ? `
                        <div class="correct-answer">
                            <strong>Correct Answer:</strong>
                            <span>${String.fromCharCode(65 + correctAnswer)}. ${options[correctAnswer]}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    document.getElementById('answers-container').innerHTML = answersHTML;
}