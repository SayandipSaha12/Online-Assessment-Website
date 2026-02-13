// ================= MODAL FUNCTIONS =================
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

function openOtpModal() {
    document.getElementById('otpModal').style.display = 'block';
}

function closeOtpModal() {
    document.getElementById('otpModal').style.display = 'none';
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const otpModal = document.getElementById('otpModal');

    if (event.target === loginModal) closeLoginModal();
    if (event.target === signupModal) closeSignupModal();
    if (event.target === otpModal) closeOtpModal();
};

// ================= LOGIN CHECK =================
function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

// ================= AUTH HANDLERS =================
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Disable button and show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
        const response = await fetch('https://online-assessment-website-production.up.railway.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.text();

        if (result === 'EMAIL_NOT_VERIFIED') {
            alert('Please verify your email before logging in.');
            return;
        }

        if (result === 'LOGIN_SUCCESS') {
            // Store both email and name
            const userName = await getUserName(email);
            localStorage.setItem('loggedInUser', email);
            localStorage.setItem('loggedInUserName', userName);
            
            closeLoginModal();
            window.location.href = 'home-logged-in.html';
        } else if (result === 'USER_NOT_FOUND') {
            alert('User not found. Please sign up first.');
        } else if (result === 'INVALID_PASSWORD') {
            alert('Invalid password');
        } else {
            alert('Login failed: ' + result);
        }
    } catch (error) {
        console.error(error);
        alert('Server error during login');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// Helper function to get user name
async function getUserName(email) {
    // For now, return from localStorage if available
    const storedName = localStorage.getItem('loggedInUserName');
    if (storedName) return storedName;
    return email.split('@')[0]; // Fallback: use email prefix
}

// Password strength validation function
function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(password);
}

async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
        alert(
            'Password must be at least 8 characters long and include:\n' +
            '• One uppercase letter (A-Z)\n' +
            '• One lowercase letter (a-z)\n' +
            '• One number (0-9)\n' +
            '• One special character (@$!%*?&#)'
        );
        return;
    }

    // Disable button and show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        const response = await fetch('https://online-assessment-website-production.up.railway.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.text();

        if (result === 'VERIFICATION_SENT') {
            // Store name & email temporarily
            localStorage.setItem('loggedInUserName', name);
            localStorage.setItem('pendingVerificationEmail', email);

            alert('Verification code sent to your email');
            closeSignupModal();
            openOtpModal();

        } else if (result === 'WEAK_PASSWORD') {
            alert('Password is too weak. Please follow the password rules.');

        } else if (result === 'EMAIL_ALREADY_EXISTS') {
            alert('This email is already registered. Please login instead.');
            
        } else if (result.startsWith('ERROR:')) {
            alert('Signup failed: ' + result);
            console.error('Backend error:', result);
            
        } else {
            alert('Signup failed: ' + result);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Server error during signup. Please check if the backend is running.');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// ================= OTP VERIFICATION =================
async function verifyOtp(event) {
    event.preventDefault();

    const code = document.getElementById('otp-code').value.trim();
    const email = localStorage.getItem('pendingVerificationEmail');

    if (!email) {
        alert('Session expired. Please sign up again.');
        closeOtpModal();
        openSignupModal();
        return;
    }

    // Disable button and show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

    try {
        const response = await fetch('https://online-assessment-website-production.up.railway.app/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        const result = await response.text();

        if (result === 'VERIFIED') {
            alert('Email verified successfully! Please login.');
            localStorage.removeItem('pendingVerificationEmail');
            closeOtpModal();
            openLoginModal();
        } else if (result === 'INVALID_CODE') {
            alert('Invalid verification code. Please try again.');
        } else if (result === 'USER_NOT_FOUND') {
            alert('User not found. Please sign up again.');
        } else if (result === 'NO_PENDING_VERIFICATION') {
            alert('No pending verification found. You may already be verified.');
        } else {
            alert('Verification failed: ' + result);
        }
    } catch (error) {
        console.error(error);
        alert('Server error during verification');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// ================= RESEND OTP =================
async function resendOtp() {
    const email = localStorage.getItem('pendingVerificationEmail');
    
    if (!email) {
        alert('Session expired. Please sign up again.');
        closeOtpModal();
        openSignupModal();
        return;
    }

    try {
        // TODO: Implement backend endpoint for resending OTP
        alert('A new verification code has been sent to your email.');
        
        // When backend endpoint is ready:
        // const response = await fetch('https://your-backend-url.up.railway.app/api/auth/resend-otp', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        
    } catch (error) {
        console.error(error);
        alert('Failed to resend code. Please try again.');
    }
}

// ================= NAVIGATION =================
function navigateToCreate() {
    if (!isLoggedIn()) {
        openLoginModal();
        return;
    }
    window.location.href = 'create-assessment.html';
}

function navigateToTake() {
    if (!isLoggedIn()) {
        openLoginModal();
        return;
    }
    window.location.href = 'take-assessment.html';
}

function navigateToPerformance() {
    if (!isLoggedIn()) {
        openLoginModal();
        return;
    }
    alert('Performance page coming soon!');
}

function navigateToPrevious() {
    if (!isLoggedIn()) {
        openLoginModal();
        return;
    }
    alert('Previous tests page coming soon!');
}

function navigateToEdit() {
    if (!isLoggedIn()) {
        openLoginModal();
        return;
    }
    alert('Edit tests page coming soon!');
}

function navigateToAnalytics() {
    if (!isLoggedIn()) {
        openLoginModal();
        return;
    }
    alert('Analytics page coming soon!');
}

// ================= LOGOUT =================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// ================= CONTACT FORM =================
function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}

// ================= SMOOTH SCROLL FOR NAV LINKS =================
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active state
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Scroll animations
    document.querySelectorAll('.feature-card, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = '0.6s ease';
        observer.observe(el);
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavOnScroll);
});

// ================= UPDATE ACTIVE NAV ON SCROLL =================
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ================= SCROLL ANIMATIONS OBSERVER =================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
