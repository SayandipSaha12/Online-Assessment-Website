// Initialize page with user data
document.addEventListener('DOMContentLoaded', function () {
    loadUserData();
    initializeAnimations();
});

// Load user data from localStorage
function loadUserData() {
    const fullName = localStorage.getItem('loggedInUserName');

    // Safety check: if user not logged in
    if (!fullName) {
        window.location.href = 'index.html';
        return;
    }

    // Update navbar with full name
    document.getElementById('user-name').textContent = fullName;

    // Extract and show first name only
    const firstName = fullName.split(' ')[0];
    document.getElementById('welcome-name').textContent = firstName;
}

// ================= NAVIGATION =================
function navigateToCreate() {
    window.location.href = 'create-assessment.html';
}

function navigateToTake() {
    window.location.href = 'take-assessment.html';
}

function navigateToPerformance() {
    window.location.href = 'performance.html';
}

function navigateToPrevious() {
    window.location.href = 'previous-tests.html';
}

function navigateToEdit() {
    window.location.href = 'edit-tests.html';
}

function navigateToAnalytics() {
    window.location.href = 'analytics.html';
}

// ================= LOGOUT =================
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        sessionStorage.clear();

        showNotification('Logged out successfully!');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ================= CONTACT FORM =================
function handleContactForm(event) {
    event.preventDefault();
    showNotification('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}

// ================= SCROLL + ANIMATIONS =================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .step');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ================= NOTIFICATION =================
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
        font-weight: 600;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Logo click handler
document.querySelector('.logo').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
