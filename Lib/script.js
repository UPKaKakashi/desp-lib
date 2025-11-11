// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navButtons = document.querySelector('.nav-buttons');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            navButtons.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navButtons.classList.remove('active');
            });
        });
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .step');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                const suffix = text.replace(/[\d]/g, '');
                
                if (number) {
                    stat.textContent = '0' + suffix;
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});


// Button Click Effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .btn-outline {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid var(--gray-200);
            padding: var(--spacing-4);
            box-shadow: var(--shadow-lg);
        }
        
        .nav-buttons.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid var(--gray-200);
            padding: var(--spacing-4);
            box-shadow: var(--shadow-lg);
            margin-top: var(--spacing-4);
        }
        
        .nav-buttons {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Form Validation (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Local Storage for User Preferences
const userPreferences = {
    save: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    load: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
};

// Theme Toggle (for future dark mode implementation)
function toggleTheme() {
    const currentTheme = userPreferences.load('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    userPreferences.save('theme', newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = userPreferences.load('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
});

// Image Loading and Error Handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle lazy loading images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            // Fallback for broken images
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });

    // Performance Optimization: Lazy Loading for Images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error to analytics service here
});

// Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle all button clicks
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const buttonText = this.textContent.trim();
            const buttonClass = this.className;
            
            // Handle different button types
            if (buttonText.includes('Sign In')) {
                openSignInModal();
            } else if (buttonText.includes('Get Started')) {
                openSignUpModal();
            } else if (buttonText.includes('Watch Demo')) {
                openDemoModal();
            } else if (buttonText.includes('Schedule Demo')) {
                openContactModal();
            } else if (buttonText.includes('Contact Sales')) {
                openContactModal();
            } else {
                // Generic button click handler
                handleGenericButtonClick(this);
            }
        });
    });
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const formId = form.id;
        
        if (formId === 'signInForm') {
            handleSignInForm(form);
        } else if (formId === 'signUpForm') {
            handleSignUpForm(form);
        } else if (formId === 'contactForm') {
            handleContactForm(form);
        }
    });
    
    // Handle form switching
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('switch-form')) {
            e.preventDefault();
            const modal = e.target.closest('.modal-overlay');
            if (modal) {
                closeModal(modal);
                // Open the other form
                if (e.target.textContent.includes('Sign up')) {
                    setTimeout(() => openSignUpModal(), 100);
                } else {
                    setTimeout(() => openSignInModal(), 100);
                }
            }
        }
    });
});

// Modal Functions
function openSignInModal() {
    const modal = createModal('Sign In', createSignInForm());
    document.body.appendChild(modal);
    showModal(modal);
}

function openSignUpModal() {
    const modal = createModal('Get Started', createSignUpForm());
    document.body.appendChild(modal);
    showModal(modal);
}

function openDemoModal() {
    const modal = createModal('Watch Demo', createDemoContent());
    document.body.appendChild(modal);
    showModal(modal);
}

function openContactModal() {
    const modal = createModal('Contact Us', createContactForm());
    document.body.appendChild(modal);
    showModal(modal);
}

// Create Modal Structure
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Add close functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal;
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(modal);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    return modal;
}

// Show Modal
function showModal(modal) {
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Close Modal
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        document.body.style.overflow = '';
        modal.remove();
    }, 300);
}

// Form Creation Functions
function createSignInForm() {
    return `
        <form class="modal-form" id="signInForm">
            <div class="form-group">
                <label for="signInEmail">Email Address</label>
                <input type="email" id="signInEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="signInPassword">Password</label>
                <input type="password" id="signInPassword" name="password" required>
            </div>
            <div class="form-options">
                <label class="checkbox-label">
                    <input type="checkbox" name="remember">
                    <span>Remember me</span>
                </label>
                <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            <button type="submit" class="btn-primary btn-full">Sign In</button>
            <div class="form-footer">
                <p>Don't have an account? <a href="#" class="switch-form">Sign up</a></p>
            </div>
        </form>
    `;
}

function createSignUpForm() {
    return `
        <form class="modal-form" id="signUpForm">
            <div class="form-group">
                <label for="signUpName">Full Name</label>
                <input type="text" id="signUpName" name="name" required>
            </div>
            <div class="form-group">
                <label for="signUpEmail">Email Address</label>
                <input type="email" id="signUpEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="signUpPassword">Password</label>
                <input type="password" id="signUpPassword" name="password" required minlength="8">
            </div>
            <div class="form-group">
                <label for="signUpConfirm">Confirm Password</label>
                <input type="password" id="signUpConfirm" name="confirmPassword" required>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="terms" required>
                    <span>I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a></span>
                </label>
            </div>
            <button type="submit" class="btn-primary btn-full">Get Started</button>
            <div class="form-footer">
                <p>Already have an account? <a href="#" class="switch-form">Sign in</a></p>
            </div>
        </form>
    `;
}

function createDemoContent() {
    return `
        <div class="demo-content">
            <div class="demo-video">
                <div class="video-placeholder">
                    <i class="fas fa-play-circle"></i>
                    <p>Demo Video Coming Soon</p>
                </div>
            </div>
            <div class="demo-features">
                <h3>What you'll see in the demo:</h3>
                <ul>
                    <li><i class="fas fa-check"></i> How to connect your library account</li>
                    <li><i class="fas fa-check"></i> Setting up smart reminders</li>
                    <li><i class="fas fa-check"></i> Managing your reading list</li>
                    <li><i class="fas fa-check"></i> Mobile app features</li>
                </ul>
            </div>
            <div class="demo-cta">
                <button class="btn-primary" onclick="openSignUpModal()">Get Started</button>
            </div>
        </div>
    `;
}

function createContactForm() {
    return `
        <form class="modal-form" id="contactForm">
            <div class="form-group">
                <label for="contactName">Full Name</label>
                <input type="text" id="contactName" name="name" required>
            </div>
            <div class="form-group">
                <label for="contactEmail">Email Address</label>
                <input type="email" id="contactEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="contactCompany">Company (Optional)</label>
                <input type="text" id="contactCompany" name="company">
            </div>
            <div class="form-group">
                <label for="contactSubject">Subject</label>
                <select id="contactSubject" name="subject" required>
                    <option value="">Select a subject</option>
                    <option value="demo">Schedule a Demo</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="contactMessage">Message</label>
                <textarea id="contactMessage" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn-primary btn-full">Send Message</button>
        </form>
    `;
}

// Form Handling Functions
function handleSignInForm(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate sign in
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Welcome back! You have been signed in successfully.', 'success');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        const modal = form.closest('.modal-overlay');
        if (modal) {
            closeModal(modal);
        }
    }, 2000);
}

function handleSignUpForm(form) {
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please accept the Terms of Service and Privacy Policy.', 'error');
        return;
    }
    
    // Simulate sign up
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Account created successfully! Welcome to LibraryReminder!', 'success');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        const modal = form.closest('.modal-overlay');
        if (modal) {
            closeModal(modal);
        }
    }, 2000);
}

function handleContactForm(form) {
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        const modal = form.closest('.modal-overlay');
        if (modal) {
            closeModal(modal);
        }
    }, 2000);
}

// Generic Button Handler
function handleGenericButtonClick(button) {
    const buttonText = button.textContent.trim();
    showNotification(`"${buttonText}" button clicked!`, 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Book Management System
let books = [];
let bookIdCounter = 1;

// Sample books for demonstration
const sampleBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=120&fit=crop&crop=center",
        borrowedDate: "2024-02-15",
        dueDate: "2024-03-15",
        status: "current",
        isbn: "978-0-7432-7356-5"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=120&fit=crop&crop=center",
        borrowedDate: "2024-02-20",
        dueDate: "2024-03-20",
        status: "current",
        isbn: "978-0-06-112008-4"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=120&fit=crop&crop=center",
        borrowedDate: "2024-02-25",
        dueDate: "2024-03-25",
        status: "current",
        isbn: "978-0-452-28423-4"
    }
];

// Initialize book management
document.addEventListener('DOMContentLoaded', function() {
    // Load sample books
    books = [...sampleBooks];
    bookIdCounter = books.length + 1;
    
    // Initialize dashboard
    renderBooks();
    
    // Add event listeners
    document.getElementById('bookSearch').addEventListener('input', filterBooks);
    document.getElementById('statusFilter').addEventListener('change', filterBooks);
});

// Book Management Functions
function renderBooks() {
    const booksGrid = document.getElementById('booksGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (books.length === 0) {
        booksGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    booksGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    booksGrid.innerHTML = books.map(book => createBookCard(book)).join('');
}

function createBookCard(book) {
    const daysUntilDue = getDaysUntilDue(book.dueDate);
    const statusClass = getStatusClass(daysUntilDue);
    const statusText = getStatusText(daysUntilDue);
    
    return `
        <div class="book-card-dashboard" data-book-id="${book.id}">
            <div class="book-card-header">
                <div class="book-cover-dashboard">
                    <img src="${book.coverImage}" alt="${book.title}" loading="lazy">
                </div>
                <div class="book-info-dashboard">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">by ${book.author}</p>
                    <span class="book-status ${statusClass}">${statusText}</span>
                </div>
            </div>
            
            <div class="book-dates">
                <div class="date-row">
                    <span class="date-label">Borrowed:</span>
                    <span class="date-value">${formatDate(book.borrowedDate)}</span>
                </div>
                <div class="date-row">
                    <span class="date-label">Due Date:</span>
                    <span class="date-value">${formatDate(book.dueDate)}</span>
                </div>
                <div class="date-row">
                    <span class="date-label">Days Left:</span>
                    <span class="date-value">${daysUntilDue > 0 ? daysUntilDue : 'Overdue'}</span>
                </div>
            </div>
            
            <div class="book-actions">
                <button class="btn-icon btn-edit" onclick="openEditBookModal(${book.id})" title="Edit Book">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-date" onclick="openDateModal(${book.id})" title="Update Dates">
                    <i class="fas fa-calendar-alt"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteBook(${book.id})" title="Delete Book">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getStatusClass(daysUntilDue) {
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'due-soon';
    return 'current';
}

function getStatusText(daysUntilDue) {
    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue <= 3) return 'Due Soon';
    return 'Current';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function filterBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm);
        
        if (statusFilter === 'all') return matchesSearch;
        
        const daysUntilDue = getDaysUntilDue(book.dueDate);
        let matchesStatus = false;
        
        switch (statusFilter) {
            case 'current':
                matchesStatus = daysUntilDue > 3;
                break;
            case 'due-soon':
                matchesStatus = daysUntilDue >= 0 && daysUntilDue <= 3;
                break;
            case 'overdue':
                matchesStatus = daysUntilDue < 0;
                break;
            case 'returned':
                matchesStatus = book.status === 'returned';
                break;
        }
        
        return matchesSearch && matchesStatus;
    });
    
    renderFilteredBooks(filteredBooks);
}

function renderFilteredBooks(filteredBooks) {
    const booksGrid = document.getElementById('booksGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredBooks.length === 0) {
        booksGrid.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No books found</h3>
            <p>Try adjusting your search or filter criteria</p>
        `;
        return;
    }
    
    booksGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    booksGrid.innerHTML = filteredBooks.map(book => createBookCard(book)).join('');
}


// Modal Functions for Book Management
function openAddBookModal() {
    const modal = createModal('Add New Book', createAddBookForm());
    document.body.appendChild(modal);
    showModal(modal);
}

function openEditBookModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const modal = createModal('Edit Book', createEditBookForm(book));
    document.body.appendChild(modal);
    showModal(modal);
}

function openDateModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const modal = createModal('Update Dates', createDateForm(book));
    document.body.appendChild(modal);
    showModal(modal);
}


// Form Creation Functions
function createAddBookForm() {
    return `
        <form class="modal-form" id="addBookForm">
            <div class="form-group">
                <label for="bookTitle">Book Title *</label>
                <input type="text" id="bookTitle" name="title" required>
            </div>
            <div class="form-group">
                <label for="bookAuthor">Author *</label>
                <input type="text" id="bookAuthor" name="author" required>
            </div>
            <div class="form-group">
                <label for="bookIsbn">ISBN (Optional)</label>
                <input type="text" id="bookIsbn" name="isbn">
            </div>
            <div class="form-group">
                <label for="bookCover">Cover Image URL (Optional)</label>
                <input type="url" id="bookCover" name="coverImage" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <label for="borrowedDate">Borrowed Date *</label>
                <input type="date" id="borrowedDate" name="borrowedDate" required>
            </div>
            <div class="form-group">
                <label for="dueDate">Due Date *</label>
                <input type="date" id="dueDate" name="dueDate" required>
            </div>
            <button type="submit" class="btn-primary btn-full">Add Book</button>
        </form>
    `;
}

function createEditBookForm(book) {
    return `
        <form class="modal-form" id="editBookForm" data-book-id="${book.id}">
            <div class="form-group">
                <label for="editBookTitle">Book Title *</label>
                <input type="text" id="editBookTitle" name="title" value="${book.title}" required>
            </div>
            <div class="form-group">
                <label for="editBookAuthor">Author *</label>
                <input type="text" id="editBookAuthor" name="author" value="${book.author}" required>
            </div>
            <div class="form-group">
                <label for="editBookIsbn">ISBN</label>
                <input type="text" id="editBookIsbn" name="isbn" value="${book.isbn || ''}">
            </div>
            <div class="form-group">
                <label for="editBookCover">Cover Image URL</label>
                <input type="url" id="editBookCover" name="coverImage" value="${book.coverImage || ''}">
            </div>
            <button type="submit" class="btn-primary btn-full">Update Book</button>
        </form>
    `;
}

function createDateForm(book) {
    return `
        <form class="modal-form" id="dateForm" data-book-id="${book.id}">
            <div class="form-group">
                <label for="editBorrowedDate">Borrowed Date *</label>
                <input type="date" id="editBorrowedDate" name="borrowedDate" value="${book.borrowedDate}" required>
            </div>
            <div class="form-group">
                <label for="editDueDate">Due Date *</label>
                <input type="date" id="editDueDate" name="dueDate" value="${book.dueDate}" required>
            </div>
            <div class="form-group">
                <label for="bookStatus">Status</label>
                <select id="bookStatus" name="status">
                    <option value="current" ${book.status === 'current' ? 'selected' : ''}>Currently Reading</option>
                    <option value="returned" ${book.status === 'returned' ? 'selected' : ''}>Returned</option>
                </select>
            </div>
            <button type="submit" class="btn-primary btn-full">Update Dates</button>
        </form>
    `;
}


// Book Management Actions
function addBook(formData) {
    const newBook = {
        id: bookIdCounter++,
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn') || '',
        coverImage: formData.get('coverImage') || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=120&fit=crop&crop=center',
        borrowedDate: formData.get('borrowedDate'),
        dueDate: formData.get('dueDate'),
        status: 'current'
    };
    
    books.push(newBook);
    renderBooks();
    showNotification('Book added successfully!', 'success');
}

function editBook(bookId, formData) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;
    
    books[bookIndex] = {
        ...books[bookIndex],
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn') || '',
        coverImage: formData.get('coverImage') || books[bookIndex].coverImage
    };
    
    renderBooks();
    showNotification('Book updated successfully!', 'success');
}

function updateBookDates(bookId, formData) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;
    
    books[bookIndex] = {
        ...books[bookIndex],
        borrowedDate: formData.get('borrowedDate'),
        dueDate: formData.get('dueDate'),
        status: formData.get('status')
    };
    
    renderBooks();
    showNotification('Dates updated successfully!', 'success');
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        books = books.filter(b => b.id !== bookId);
        renderBooks();
        showNotification('Book deleted successfully!', 'success');
    }
}


// Form Submission Handlers
document.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const formId = form.id;
    
    if (formId === 'addBookForm') {
        handleAddBookForm(form);
    } else if (formId === 'editBookForm') {
        handleEditBookForm(form);
    } else if (formId === 'dateForm') {
        handleDateForm(form);
    }
});

function handleAddBookForm(form) {
    const formData = new FormData(form);
    
    // Validation
    if (!formData.get('title') || !formData.get('author') || !formData.get('borrowedDate') || !formData.get('dueDate')) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    const borrowedDate = new Date(formData.get('borrowedDate'));
    const dueDate = new Date(formData.get('dueDate'));
    
    if (dueDate <= borrowedDate) {
        showNotification('Due date must be after borrowed date.', 'error');
        return;
    }
    
    addBook(formData);
    closeModal(form.closest('.modal-overlay'));
}

function handleEditBookForm(form) {
    const formData = new FormData(form);
    const bookId = parseInt(form.dataset.bookId);
    
    if (!formData.get('title') || !formData.get('author')) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    editBook(bookId, formData);
    closeModal(form.closest('.modal-overlay'));
}

function handleDateForm(form) {
    const formData = new FormData(form);
    const bookId = parseInt(form.dataset.bookId);
    
    const borrowedDate = new Date(formData.get('borrowedDate'));
    const dueDate = new Date(formData.get('dueDate'));
    
    if (dueDate <= borrowedDate) {
        showNotification('Due date must be after borrowed date.', 'error');
        return;
    }
    
    updateBookDates(bookId, formData);
    closeModal(form.closest('.modal-overlay'));
}

// Console Welcome Message
console.log(`
📚 Welcome to LibraryReminder!
Built with modern web technologies and best practices.
For support, visit our help center.
`);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        userPreferences,
        toggleTheme,
        openSignInModal,
        openSignUpModal,
        openDemoModal,
        openContactModal
    };
}
