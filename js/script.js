// ===== GLOBAL VARIABLES =====
// Store users in localStorage (simulated database)
let users = JSON.parse(localStorage.getItem('portfolio_users')) || [
    {
        id: 1,
        name: 'Lester Marc Cinense',
        email: 'lestermarcacinense@gmail.com',
        password: btoa('password123'), // Simple encoding (not secure for production)
        created_at: new Date().toISOString()
    }
];

let messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];

// Save initial users
localStorage.setItem('portfolio_users', JSON.stringify(users));

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio website loaded successfully!');
    
    // Initialize all features
    initNavigation();
    initToggleSections();
    initFormValidation();
    initProjectFilters();
    updateDateTime();
    initAnimations();
    initMobileMenu();
    checkAuthStatus();
    updateAuthUI();
    initTypingEffect();
    initParticles();
    initCountUp();
    initDarkMode();
    initTooltips();
    initSmoothScroll();
});

// ===== TYPING EFFECT FOR HOME PAGE =====
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const texts = [
        'BS Information Technology Student',
        'JPCS OLSHICO Member',
        'Web Developer',
        'Data Analytics Enthusiast',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    type();
}

// ===== PARTICLES BACKGROUND =====
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) {
        // Create particles container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'particles-js';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        
        // Simple canvas particles
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function createParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: `rgba(58, 110, 165, ${Math.random() * 0.3})`
                });
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // Draw connections
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(46, 204, 113, ${0.1 * (1 - distance/100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
        
        resize();
        createParticles();
        animate();
    }
}

// ===== COUNT UP ANIMATION =====
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        
        function updateCount() {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

// ===== DARK MODE TOGGLE =====
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) {
        // Create dark mode toggle button
        const toggle = document.createElement('button');
        toggle.id = 'darkModeToggle';
        toggle.innerHTML = '🌙';
        toggle.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--gradient-dark);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: 999;
            font-size: 24px;
            transition: var(--transition-normal);
        `;
        document.body.appendChild(toggle);
        
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            toggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            
            // Add dark mode styles
            if (document.body.classList.contains('dark-mode')) {
                const style = document.createElement('style');
                style.id = 'dark-mode-styles';
                style.textContent = `
                    body.dark-mode {
                        background: #1a1a2e;
                        color: #fff;
                    }
                    body.dark-mode section {
                        background: rgba(30, 30, 46, 0.95);
                        color: #fff;
                    }
                    body.dark-mode h2,
                    body.dark-mode h3 {
                        color: #fff;
                    }
                    body.dark-mode p {
                        color: #b8b8b8;
                    }
                    body.dark-mode .form-container {
                        background: rgba(30, 30, 46, 0.95);
                    }
                    body.dark-mode input,
                    body.dark-mode textarea {
                        background: #2a2a3a;
                        color: #fff;
                        border-color: #3a3a4a;
                    }
                `;
                document.head.appendChild(style);
            } else {
                const style = document.getElementById('dark-mode-styles');
                if (style) style.remove();
            }
        });
    }
}

// ===== TOOLTIPS =====
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const tooltip = e.target.getAttribute('data-tooltip');
            console.log('Tooltip:', tooltip); // Placeholder for tooltip functionality
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            
            // Add animation to active link
            link.style.animation = 'pulse 2s infinite';
        }
    });
}

// ===== TOGGLE SECTIONS =====
function initToggleSections() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            
            if (content) {
                content.classList.toggle('show');
                
                if (content.classList.contains('show')) {
                    this.innerHTML = '🔽 Hide Details';
                    this.style.animation = 'none';
                    setTimeout(() => {
                        this.style.animation = 'pulse 2s infinite';
                    }, 10);
                    
                    // Trigger confetti for fun
                    if (targetId === 'welcomeMessage') {
                        createConfetti();
                    }
                } else {
                    this.innerHTML = '🔼 Show Details';
                }
            }
        });
    });
}

// ===== CONFETTI ANIMATION =====
function createConfetti() {
    const colors = ['#3a6ea5', '#2ecc71', '#e74c3c', '#ffd966', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
            animation: fall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Add keyframe animation if not exists
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            // Remove all existing error messages first
            form.querySelectorAll('.field-error').forEach(el => el.remove());
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            // Password match validation
            const password = form.querySelector('#password');
            const confirmPassword = form.querySelector('#confirm_password');
            
            if (password && confirmPassword) {
                if (password.value !== confirmPassword.value) {
                    showFieldError(confirmPassword, '❌ Passwords do not match');
                    isValid = false;
                }
            }
            
            // Email validation
            const email = form.querySelector('#email');
            if (email && !isValidEmail(email.value)) {
                showFieldError(email, '❌ Please enter a valid email address');
                isValid = false;
            }
            
            if (isValid) {
                // Check which form is being submitted
                if (form.id === 'loginForm') {
                    handleLogin(form);
                } else if (form.id === 'registerForm') {
                    handleRegister(form);
                } else if (form.id === 'contactForm') {
                    handleContact(form);
                } else {
                    showNotification('✅ Form submitted successfully!', 'success');
                    showSuccessAnimation(form);
                    createConfetti(); // Celebration!
                }
            } else {
                showNotification('⚠️ Please fix the errors in the form', 'error');
                // Shake the form
                form.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    form.style.animation = '';
                }, 500);
            }
        });
        
        // Real-time validation with debounce
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            let timeout;
            input.addEventListener('input', function() {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    removeFieldError(this);
                }, 300);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, '❌ This field is required');
        return false;
    }
    
    if (field.type === 'email' && !isValidEmail(value)) {
        showFieldError(field, '❌ Please enter a valid email');
        return false;
    }
    
    if (field.type === 'password' && value.length < 6) {
        showFieldError(field, '❌ Password must be at least 6 characters');
        return false;
    }
    
    if (field.id === 'name' && value.length < 2) {
        showFieldError(field, '❌ Name must be at least 2 characters');
        return false;
    }
    
    removeFieldError(field);
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('field-error')) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
}

function removeFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.remove();
    }
}

// ===== LOGIN HANDLER =====
function handleLogin(form) {
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('portfolio_users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && atob(u.password) === password);
    
    if (user) {
        // Store logged in user
        localStorage.setItem('current_user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));
        
        showNotification('✅ Login successful! Redirecting...', 'success');
        createConfetti(); // Celebration!
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showNotification('❌ Invalid email or password', 'error');
        form.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// ===== REGISTER HANDLER =====
function handleRegister(form) {
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('portfolio_users')) || [];
    
    // Check if email exists
    if (users.some(u => u.email === email)) {
        showNotification('❌ Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: btoa(password),
        created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('portfolio_users', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('current_user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    }));
    
    showNotification('✅ Registration successful! Redirecting...', 'success');
    createConfetti(); // Celebration!
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// ===== CONTACT HANDLER =====
function handleContact(form) {
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const message = form.querySelector('#message').value;
    
    // Get messages from localStorage
    let messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
    
    // Add new message
    messages.push({
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        created_at: new Date().toISOString()
    });
    
    localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    
    showNotification('✅ Message sent successfully!', 'success');
    createConfetti(); // Celebration!
    form.reset();
    showSuccessAnimation(form);
}

// ===== CHECK AUTH STATUS =====
function checkAuthStatus() {
    const currentUser = localStorage.getItem('current_user');
    
    // Update dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        if (!currentUser) {
            showNotification('⚠️ Please login first', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        
        const user = JSON.parse(currentUser);
        displayUserDashboard(user);
    }
}

function displayUserDashboard(user) {
    const userNameElements = document.querySelectorAll('#userName');
    const userEmailElements = document.querySelectorAll('#userEmail');
    const memberSinceElements = document.querySelectorAll('#memberSince');
    
    userNameElements.forEach(el => {
        if (el) el.textContent = user.name;
    });
    
    userEmailElements.forEach(el => {
        if (el) el.textContent = user.email;
    });
    
    memberSinceElements.forEach(el => {
        if (el) {
            const date = new Date();
            el.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
    });
    
    // Update dashboard stats
    const messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
    const userMessages = messages.filter(m => m.email === user.email);
    
    const messageCountEl = document.getElementById('messageCount');
    if (messageCountEl) messageCountEl.textContent = userMessages.length;
    
    // Add greeting based on time of day
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = `${greeting},`;
}

// ===== UPDATE AUTH UI =====
function updateAuthUI() {
    const currentUser = localStorage.getItem('current_user');
    const authLinks = document.querySelectorAll('.auth-link');
    
    authLinks.forEach(link => {
        if (currentUser) {
            if (link.classList.contains('login-link') || link.classList.contains('register-link')) {
                link.style.display = 'none';
            }
            if (link.classList.contains('dashboard-link') || link.classList.contains('logout-link')) {
                link.style.display = 'inline-block';
            }
        } else {
            if (link.classList.contains('login-link') || link.classList.contains('register-link')) {
                link.style.display = 'inline-block';
            }
            if (link.classList.contains('dashboard-link') || link.classList.contains('logout-link')) {
                link.style.display = 'none';
            }
        }
    });
}

// ===== IMPROVED LOGOUT FUNCTION =====
function logout() {
    // Remove user from localStorage
    localStorage.removeItem('current_user');
    
    // Show notification if the function exists
    if (typeof showNotification === 'function') {
        showNotification('✅ Logged out successfully!', 'success');
    } else {
        alert('✅ Logged out successfully!');
    }
    
    // Update UI to show login/register links
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
    
    // Redirect to home page
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 1000);
    
    // Prevent any default action
    return false;
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-item');
    
    if (filterButtons.length && projects.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                projects.forEach(project => {
                    if (filter === 'all' || project.classList.contains(filter)) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
                
                showNotification(`🔍 Showing: ${filter} projects`, 'info');
            });
        });
    }
}

// ===== UPDATE DATE AND TIME =====
function updateDateTime() {
    const dateTimeElement = document.getElementById('currentDateTime');
    
    if (dateTimeElement) {
        function update() {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        }
        
        update();
        setInterval(update, 1000);
    }
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 24px;">${icons[type]}</span>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; font-size: 20px; cursor: pointer; opacity: 0.5; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== SHOW SUCCESS ANIMATION =====
function showSuccessAnimation(form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Processing...';
    
    setTimeout(() => {
        button.innerHTML = '✅ Success!';
        button.style.background = 'var(--gradient-green)';
        
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }, 1000);
}

// ===== INITIALIZE ANIMATIONS =====
function initAnimations() {
    const sections = document.querySelectorAll('section');
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add random animation class
                const animations = ['fadeInUp', 'slideInLeft', 'slideInRight'];
                const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                entry.target.style.animation = `${randomAnim} 0.8s ease`;
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
    
    fadeElements.forEach(el => observer.observe(el));
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    if (window.innerWidth <= 768) {
        const header = document.querySelector('header .container');
        const nav = document.querySelector('nav');
        
        if (header && nav) {
            const menuButton = document.createElement('button');
            menuButton.innerHTML = '☰ Menu';
            menuButton.style.cssText = `
                background: var(--gradient-blue);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 50px;
                cursor: pointer;
                margin: 10px auto;
                display: block;
                font-size: 16px;
                font-weight: 600;
                transition: var(--transition-normal);
                box-shadow: var(--shadow-md);
            `;
            
            menuButton.addEventListener('mouseenter', () => {
                menuButton.style.transform = 'scale(1.05)';
            });
            
            menuButton.addEventListener('mouseleave', () => {
                menuButton.style.transform = 'scale(1)';
            });
            
            menuButton.addEventListener('click', () => {
                if (nav.style.display === 'none' || !nav.style.display) {
                    nav.style.display = 'flex';
                    nav.style.flexDirection = 'column';
                    nav.style.animation = 'slideInRight 0.3s ease';
                    menuButton.innerHTML = '✕ Close';
                } else {
                    nav.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => {
                        nav.style.display = 'none';
                    }, 300);
                    menuButton.innerHTML = '☰ Menu';
                }
            });
            
            header.appendChild(menuButton);
            nav.style.display = 'none';
        }
    }
}

// ===== GOOGLE SIGN-IN =====
function handleCredentialResponse(response) {
    console.log('Google Sign-In response received');
    
    // Decode the JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    
    const name = payload.name;
    const email = payload.email;
    const googleId = payload.sub;
    const picture = payload.picture;
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('portfolio_users')) || [];
    
    // Check if user exists
    let user = users.find(u => u.email === email);
    
    if (!user) {
        // Create new user
        user = {
            id: users.length + 1,
            name: name,
            email: email,
            google_id: googleId,
            picture: picture,
            created_at: new Date().toISOString()
        };
        
        users.push(user);
        localStorage.setItem('portfolio_users', JSON.stringify(users));
    }
    
    // Store logged in user
    localStorage.setItem('current_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: picture
    }));
    
    showNotification('✅ Google login successful! Redirecting...', 'success');
    createConfetti(); // Celebration!
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// ===== ADD CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Make functions global
window.logout = logout;
window.handleCredentialResponse = handleCredentialResponse;
window.showNotification = showNotification;

console.log('✅ Logout function loaded and ready');

// Direct event listener for logout links (backup method)
document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('a[onclick*="logout"]');
    logoutLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});