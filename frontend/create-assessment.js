// Global state to store questions
let questions = [];
let editingIndex = -1; // -1 means adding new, >= 0 means editing

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('test-date').setAttribute('min', today);
    
    // Load draft from localStorage if exists
    loadDraft();
});

// Modal Functions
function openQuestionModal() {
    editingIndex = -1; // Reset to add mode
    document.getElementById('modal-title').textContent = 'Add Question';
    document.getElementById('submit-btn-text').textContent = 'Add Question';
    document.getElementById('questionForm').reset();
    document.getElementById('questionModal').style.display = 'block';
}

function closeQuestionModal() {
    document.getElementById('questionModal').style.display = 'none';
    document.getElementById('questionForm').reset();
    editingIndex = -1;
}

function openEditModal(index) {
    editingIndex = index;
    const question = questions[index];
    
    document.getElementById('modal-title').textContent = 'Edit Question';
    document.getElementById('submit-btn-text').textContent = 'Update Question';
    
    // Fill form with existing data
    document.getElementById('question-text').value = question.text;
    document.getElementById('option-0').value = question.options[0];
    document.getElementById('option-1').value = question.options[1];
    document.getElementById('option-2').value = question.options[2];
    document.getElementById('option-3').value = question.options[3];
    document.querySelector(`input[name="correct-answer"][value="${question.correctAnswer}"]`).checked = true;
    
    document.getElementById('questionModal').style.display = 'block';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const questionModal = document.getElementById('questionModal');
    const previewModal = document.getElementById('previewModal');
    
    if (event.target == questionModal) {
        closeQuestionModal();
    }
    if (event.target == previewModal) {
        closePreviewModal();
    }
}

// Handle question form submission
document.getElementById('questionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const questionText = document.getElementById('question-text').value.trim();
    const options = [
        document.getElementById('option-0').value.trim(),
        document.getElementById('option-1').value.trim(),
        document.getElementById('option-2').value.trim(),
        document.getElementById('option-3').value.trim()
    ];
    const correctAnswer = parseInt(document.querySelector('input[name="correct-answer"]:checked').value);
    
    // Validate all options are filled
    if (options.some(opt => opt === '')) {
        alert('Please fill all options');
        return;
    }
    
    const questionData = {
        text: questionText,
        options: options,
        correctAnswer: correctAnswer
    };
    
    if (editingIndex >= 0) {
        // Update existing question
        questions[editingIndex] = questionData;
    } else {
        // Add new question
        questions.push(questionData);
    }
    
    renderQuestions();
    closeQuestionModal();
    
    // Show success message
    showNotification(editingIndex >= 0 ? 'Question updated successfully!' : 'Question added successfully!');
});

// Render questions list
function renderQuestions() {
    const questionsList = document.getElementById('questions-list');
    const questionCount = document.getElementById('question-count');
    
    questionCount.textContent = questions.length;
    
    if (questions.length === 0) {
        questionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-question"></i>
                <p>No questions added yet</p>
                <p class="empty-subtitle">Click "Add Question" to create your first question</p>
            </div>
        `;
        return;
    }
    
    questionsList.innerHTML = questions.map((q, index) => `
        <div class="question-item">
            <div class="question-header">
                <span class="question-number">Question ${index + 1}</span>
                <div class="question-actions">
                    <button class="btn-icon btn-edit" onclick="openEditModal(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteQuestion(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="question-text">${q.text}</div>
            <div class="options-display">
                ${q.options.map((opt, optIndex) => `
                    <div class="option-display ${optIndex === q.correctAnswer ? 'correct' : ''}">
                        <span class="option-label">${String.fromCharCode(65 + optIndex)}.</span>
                        <span class="option-text">${opt}</span>
                        ${optIndex === q.correctAnswer ? '<span class="correct-indicator"><i class="fas fa-check-circle"></i> Correct</span>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Delete question
function deleteQuestion(index) {
    if (confirm('Are you sure you want to delete this question?')) {
        questions.splice(index, 1);
        renderQuestions();
        showNotification('Question deleted successfully!');
    }
}

// Preview Test
function previewTest() {
    // Validate test details
    const title = document.getElementById('test-title').value.trim();
    const duration = document.getElementById('test-duration').value;
    const date = document.getElementById('test-date').value;
    const time = document.getElementById('test-time').value;
    
    if (!title || !duration || !date || !time) {
        alert('Please fill in all test details before previewing');
        return;
    }
    
    if (questions.length === 0) {
        alert('Please add at least one question before previewing');
        return;
    }
    
    const description = document.getElementById('test-description').value.trim();
    
    // Generate preview content
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = `
        <div class="preview-details">
            <h4>Test Information</h4>
            <div class="preview-detail-item">
                <strong>Title:</strong>
                <span>${title}</span>
            </div>
            <div class="preview-detail-item">
                <strong>Duration:</strong>
                <span>${duration} minutes</span>
            </div>
            <div class="preview-detail-item">
                <strong>Activation:</strong>
                <span>${formatDate(date)} at ${time}</span>
            </div>
            ${description ? `
                <div class="preview-detail-item">
                    <strong>Description:</strong>
                    <span>${description}</span>
                </div>
            ` : ''}
            <div class="preview-detail-item">
                <strong>Total Questions:</strong>
                <span>${questions.length}</span>
            </div>
        </div>
        
        <h4 style="margin-bottom: 1rem; color: var(--primary-color);">Questions Preview</h4>
        <div class="preview-questions">
            ${questions.map((q, index) => `
                <div class="question-item">
                    <div class="question-number">Question ${index + 1}</div>
                    <div class="question-text">${q.text}</div>
                    <div class="options-display">
                        ${q.options.map((opt, optIndex) => `
                            <div class="option-display ${optIndex === q.correctAnswer ? 'correct' : ''}">
                                <span class="option-label">${String.fromCharCode(65 + optIndex)}.</span>
                                <span class="option-text">${opt}</span>
                                ${optIndex === q.correctAnswer ? '<span class="correct-indicator"><i class="fas fa-check-circle"></i> Correct Answer</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('previewModal').style.display = 'block';
}

function closePreviewModal() {
    document.getElementById('previewModal').style.display = 'none';
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Save as Draft
function saveDraft() {
    const testData = getTestData();
    
    if (!testData.title) {
        alert('Please enter a test title before saving draft');
        return;
    }
    
    localStorage.setItem('testDraft', JSON.stringify({
        ...testData,
        questions: questions,
        savedAt: new Date().toISOString()
    }));
    
    showNotification('Draft saved successfully!');
}

// Load Draft
function loadDraft() {
    const draft = localStorage.getItem('testDraft');
    if (draft) {
        const data = JSON.parse(draft);
        
        // Ask user if they want to load the draft
        if (confirm('A draft was found. Would you like to load it?')) {
            document.getElementById('test-title').value = data.title || '';
            document.getElementById('test-duration').value = data.duration || '';
            document.getElementById('test-date').value = data.date || '';
            document.getElementById('test-time').value = data.time || '';
            document.getElementById('test-description').value = data.description || '';
            
            questions = data.questions || [];
            renderQuestions();
            
            showNotification('Draft loaded successfully!');
        }
    }
}

// Get test data from form
function getTestData() {
    return {
        title: document.getElementById('test-title').value.trim(),
        duration: document.getElementById('test-duration').value,
        date: document.getElementById('test-date').value,
        time: document.getElementById('test-time').value,
        description: document.getElementById('test-description').value.trim()
    };
}

// Create Test
async function createTest() {
    // Validate all required fields
    const testData = getTestData();
    
    if (!testData.title || !testData.duration || !testData.date || !testData.time) {
        alert('Please fill in all required test details');
        return;
    }
    
    if (questions.length === 0) {
        alert('Please add at least one question to the test');
        return;
    }

    // Get logged-in user email
    const userEmail = localStorage.getItem('loggedInUser');
    if (!userEmail) {
        alert('Please login first');
        window.location.href = 'index.html';
        return;
    }

    // Prepare request data
    const requestData = {
        title: testData.title,
        duration: parseInt(testData.duration),
        description: testData.description,
        date: testData.date,
        time: testData.time,
        createdBy: userEmail,
        questions: questions.map(q => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer
        }))
    };

    console.log('📤 Sending to backend:', requestData);

    try {
        const response = await fetch('https://online-assessment-website-production.up.railway.app/api/tests/create', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            alert('Failed to create test: ' + errorText);
            return;
        }

        const result = await response.json();
        console.log('✅ Success response:', result);

        if (result.status === 'SUCCESS') {
            // Clear draft
            localStorage.removeItem('testDraft');
            
            // Show success modal with test code
            showTestCodeModal(result.testCode, testData.title);
        } else {
            alert('Failed to create test');
        }

    } catch (error) {
        console.error('❌ Network error:', error);
        alert('Server error: ' + error.message + '\n\nMake sure backend is running');
    }
}

// Show Test Code Modal
function showTestCodeModal(testCode, testTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.id = 'testCodeModal';
    
    // Generate test link
    const testLink = `${window.location.origin}/take-assessment.html?code=${testCode}`;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Test Created Successfully! 🎉</h2>
                <p class="test-title">"${testTitle}"</p>
                
                <div class="code-section">
                    <label>Test Code</label>
                    <div class="code-display">
                        <span class="test-code" id="displayTestCode">${testCode}</span>
                        <button class="btn-copy" onclick="copyTestCode('${testCode}')">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>

                <div class="link-section">
                    <label>Share Link</label>
                    <div class="code-display">
                        <input type="text" class="test-link-input" id="testLink" value="${testLink}" readonly>
                        <button class="btn-copy" onclick="copyTestLink()">
                            <i class="fas fa-copy"></i> Copy Link
                        </button>
                    </div>
                </div>

                <div class="info-box">
                    <i class="fas fa-info-circle"></i>
                    <p>Share this code or link with students to allow them to take the test.</p>
                </div>

                <div class="modal-buttons">
                    <button class="btn-secondary-modal" onclick="createAnotherTest()">
                        <i class="fas fa-plus"></i> Create Another Test
                    </button>
                    <button class="btn-primary-modal" onclick="goToHome()">
                        <i class="fas fa-home"></i> Go to Home
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Copy test code to clipboard
function copyTestCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        const copyBtn = event.target.closest('.btn-copy');
        const originalHTML = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.backgroundColor = '#10B981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Copy test link to clipboard
function copyTestLink() {
    const linkInput = document.getElementById('testLink');
    linkInput.select();
    
    navigator.clipboard.writeText(linkInput.value).then(() => {
        const copyBtn = event.target.closest('.btn-copy');
        const originalHTML = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.backgroundColor = '#10B981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Create another test
function createAnotherTest() {
    document.getElementById('testCodeModal').remove();
    
    // Reset form
    document.getElementById('testDetailsForm').reset();
    questions = [];
    renderQuestions();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showNotification('Ready to create a new test!');
}

// Go to home
function goToHome() {
    window.location.href = 'home-logged-in.html';
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
        localStorage.removeItem('testDraft');
        window.location.href = 'index.html';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
