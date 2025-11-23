// Change Password Modal Functions - Removed old implementation
// Now using the enhanced modal with password strength indicator

// Single-page app navigation for the medical app
console.log('🚀 script.js loaded successfully');

// Bangladesh timezone utility functions
const BangladeshTimezone = {
    // Get current date in Bangladesh timezone (Asia/Dhaka)
    now() {
        return new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});
    },
    
    // Create a new Date object in Bangladesh timezone
    create(dateString = null) {
        if (dateString) {
            const date = new Date(dateString);
            return new Date(date.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));
        }
        return new Date(this.now());
    },
    
    // Format date for Bangladesh timezone
    format(date, options = {}) {
        const defaultOptions = {
            timeZone: "Asia/Dhaka",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        return new Date(date).toLocaleDateString('en-GB', {...defaultOptions, ...options});
    },
    
    // Get ISO string for Bangladesh timezone
    toISOString(date = null) {
        const bangladeshDate = date ? new Date(date) : this.create();
        // Convert to Bangladesh timezone and then to ISO
        const bangladeshTime = new Date(bangladeshDate.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));
        return bangladeshTime.toISOString();
    }
};

// HTML escape utility for XSS protection
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Bangla translation for doctor categories
const CategoryTranslations = {
    'Dentist': 'দন্ত চিকিৎসক',
    'Dentistry': 'দন্ত চিকিৎসক',
    'Dental': 'দন্ত চিকিৎসক',
    'Cardiologist': 'হৃদরোগ বিশেষজ্ঞ',
    'ENT Specialist': 'নাক কান গলা বিশেষজ্ঞ',
    'ENT': 'নাক কান গলা বিশেষজ্ঞ',
    'Pulmonologist': 'শ্বাসযন্ত্র বিশেষজ্ঞ',
    'Pediatrician': 'শিশু বিশেষজ্ঞ',
    'Neurologist': 'স্নায়ু বিশেষজ্ঞ',
    'Orthopedic': 'হাড় বিশেষজ্ঞ',
    'Orthopedist': 'হাড় বিশেষজ্ঞ',
    'Orthopedics': 'হাড় বিশেষজ্ঞ',
    'Gynecologist': 'গাইনী বিশেষজ্ঞ',
    'Dermatologist': 'চর্ম বিশেষজ্ঞ',
    'Oncologist': 'ক্যান্সার বিশেষজ্ঞ',
    'Gastroenterologist': 'পরিপাক বিশেষজ্ঞ',
    'Ophthalmologist': 'চক্ষু বিশেষজ্ঞ',
    'Urologist': 'মূত্রতন্ত্র বিশেষজ্ঞ',
    'Psychiatrist': 'মনোরোগ বিশেষজ্ঞ',
    'Endocrinologist': 'হরমোন বিশেষজ্ঞ',
    'Nephrologist': 'কিডনি বিশেষজ্ঞ',
    'Rheumatologist': 'বাত রোগ বিশেষজ্ঞ',
    'Anesthesiologist': 'এনেস্থেসিয়া বিশেষজ্ঞ',
    'Surgeon': 'সার্জন',
    'Pathologist': 'প্যাথলজি বিশেষজ্ঞ',
    'Plastic Surgeon': 'প্লাস্টিক সার্জন',
    'Plastic Surgery': 'প্লাস্টিক সার্জারি',
    'Emergency Medicine': 'জরুরি চিকিৎসা',
    'Emergency': 'জরুরি চিকিৎসা',
    'Physiotherapist': 'ফিজিওথেরাপিস্ট',
    'Physiotherapy': 'ফিজিওথেরাপি',
    'Nutritionist': 'পুষ্টিবিদ',
    'Nutrition': 'পুষ্টিবিদ',
    'General Physician': 'সাধারণ চিকিৎসক',
    'Medicine': 'মেডিসিন বিশেষজ্ঞ',
    'General': 'সাধারণ চিকিৎসক',
    'Cardiology': 'হৃদরোগ বিশেষজ্ঞ',
    'Oncology': 'ক্যান্সার বিশেষজ্ঞ',
    'Pulmonology': 'শ্বাসযন্ত্র বিশেষজ্ঞ',
    'Pediatrics': 'শিশু বিশেষজ্ঞ',
    'Neurology': 'স্নায়ু বিশেষজ্ঞ',
    'Gynecology': 'গাইনী বিশেষজ্ঞ',
    'Dermatology': 'চর্ম বিশেষজ্ঞ',
    'Gastroenterology': 'পরিপাক বিশেষজ্ঞ',
    'Ophthalmology': 'চক্ষু বিশেষজ্ঞ',
    'Urology': 'মূত্রতন্ত্র বিশেষজ্ঞ',
    'Psychiatry': 'মনোরোগ বিশেষজ্ঞ',
    'Endocrinology': 'হরমোন বিশেষজ্ঞ',
    'Nephrology': 'কিডনি বিশেষজ্ঞ',
    'Rheumatology': 'বাত রোগ বিশেষজ্ঞ',
    'Anesthesiology': 'এনেস্থেসিয়া বিশেষজ্ঞ',
    'Surgery': 'সার্জন',
    'Pathology': 'প্যাথলজি বিশেষজ্ঞ'
};

// Function to get category with Bangla translation
function getCategoryWithBangla(category) {
    if (!category) return '';
    
    const banglaTranslation = CategoryTranslations[category];
    if (banglaTranslation) {
        return `${category} (${banglaTranslation})`;
    }
    return category;
}


// Function to extract raw English specialty (remove Bangla translation)
function extractRawSpecialty(categoryText) {
    if (!categoryText) return '';
    // If category contains Bangla (text in parentheses), extract only English part
    const match = categoryText.match(/^([^(]+)(?:\s*\([^)]+\))?$/);
    return match ? match[1].trim() : categoryText.trim();
}
// Password utilities for consistent hashing across the app
const PasswordUtils = {
    // Simple hash function for password storage (in production, use proper server-side hashing)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    },

    // Unified password validation
    validatePassword(password) {
        return password && password.length >= 8;
    },

    // Password requirements message
    getPasswordRequirements() {
        return 'Password must be at least 8 characters';
    }
};

// In-memory storage systems (resets on page refresh)
const InMemoryStorage = {
    // Favorites
    favorites: new Set(),
    
    // User preferences
    preferences: {
        language: 'english',
        theme: 'light'
    },
    
    // Notifications
    notifications: {
        donorApproval: [],
        ambulanceApproval: [],
        driverApproval: [],
        hospitalApproval: [],
        general: []
    },
    
    // Payment method
    selectedPaymentMethod: null,
    
    // Settings
    notificationSettings: {},
    privacySettings: {},
    
    // Sessions
    loginSessions: [],
    
    // Medical data
    medicalData: {
        conditions: [],
        medications: [],
        allergies: [],
        vitals: {}
    },
    
    // User profile
    userProfile: {},
    
    // Hospital bookings
    hospitalBookings: [],
    
    // Current user IDs for various services
    currentUserId: null,
    currentUserDonorId: null,
    
    // Points and prescription data
    pointsData: null,
    prescriptionData: null,
    
    // Terms and privacy acknowledgment
    termsAccepted: null,
    privacyAcknowledged: null,
    
    // Completed appointments
    completedAppointments: []
};

// Favorites System using in-memory storage
const FavoritesSystem = {
    // Add doctor to favorites
    addFavorite(doctorName) {
        InMemoryStorage.favorites.add(doctorName);
    },
    
    // Remove doctor from favorites
    removeFavorite(doctorName) {
        InMemoryStorage.favorites.delete(doctorName);
    },
    
    // Check if doctor is favorite
    isFavorite(doctorName) {
        return InMemoryStorage.favorites.has(doctorName);
    },
    
    // Get all favorites
    getAllFavorites() {
        return Array.from(InMemoryStorage.favorites);
    }
};

// Preferences System
const PreferencesSystem = {
    // Set language
    setLanguage(language) {
        InMemoryStorage.preferences.language = language;
    },
    
    // Get language
    getLanguage() {
        return InMemoryStorage.preferences.language;
    },
    
    // Set theme
    setTheme(theme) {
        InMemoryStorage.preferences.theme = theme;
    },
    
    // Get theme
    getTheme() {
        return InMemoryStorage.preferences.theme;
    }
};

// Payment System
const PaymentSystem = {
    // Set selected payment method
    setPaymentMethod(method) {
        InMemoryStorage.selectedPaymentMethod = method;
    },
    
    // Get selected payment method
    getPaymentMethod() {
        return InMemoryStorage.selectedPaymentMethod;
    },
    
    // Clear payment method
    clearPaymentMethod() {
        InMemoryStorage.selectedPaymentMethod = null;
    }
};

// Notifications System
const NotificationsSystem = {
    // Add notification
    addNotification(type, notification) {
        if (InMemoryStorage.notifications[type]) {
            InMemoryStorage.notifications[type].push(notification);
        }
    },
    
    // Get notifications
    getNotifications(type) {
        return InMemoryStorage.notifications[type] || [];
    },
    
    // Set notifications
    setNotifications(type, notifications) {
        InMemoryStorage.notifications[type] = notifications;
    }
};

// Input validation utilities for enhanced security
const ValidationUtils = {
    // In-memory rate limiting storage (resets on page refresh)
    signInAttempts: new Map(),
    
    // Email format validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && emailRegex.test(email.trim());
    },
    
    // Sanitize input to prevent basic attacks
    sanitizeInput(input) {
        if (!input) return '';
        return input.toString().trim().slice(0, 500); // Limit length and trim
    },
    
    // Rate limiting for sign-in attempts (in-memory only)
    checkRateLimit(email) {
        const attempts = this.signInAttempts.get(email) || [];
        const now = Date.now();
        const fiveMinutesAgo = now - (5 * 60 * 1000);
        
        // Remove attempts older than 5 minutes
        const recentAttempts = attempts.filter(time => time > fiveMinutesAgo);
        
        // Check if too many attempts
        if (recentAttempts.length >= 5) {
            return false; // Rate limited
        }
        
        // Add current attempt
        recentAttempts.push(now);
        this.signInAttempts.set(email, recentAttempts);
        return true; // Allowed
    },
    
    // Clear rate limiting for successful sign-in
    clearRateLimit(email) {
        this.signInAttempts.delete(email);
    }
};

// Helper function to format dates in DD-MM-YYYY format
function formatDateDDMMYYYY(dateInput) {
    if (!dateInput) {
        return 'Invalid Date';
    }
    
    try {
        let date;
        
        // Handle different input types
        if (typeof dateInput === 'string') {
            // If it's a YYYY-MM-DD format
            if (dateInput.includes('-') && dateInput.length === 10) {
                const dateParts = dateInput.split('-');
                if (dateParts.length === 3 && 
                    dateParts.every(part => !isNaN(parseInt(part))) &&
                    dateParts[0].length === 4) {
                    date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                } else {
                    date = new Date(dateInput);
                }
            } else {
                date = new Date(dateInput);
            }
        } else if (dateInput instanceof Date) {
            date = dateInput;
        } else {
            return 'Invalid Date';
        }
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        
        // Format as DD-MM-YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error('Error formatting date:', dateInput, error);
        return 'Invalid Date';
    }
}

// Authentication System
const AuthSystem = {
    currentUser: null,
    SESSION_KEY: 'mediquick_user_session',
    
    // Initialize - restore session from localStorage
    init() {
        const savedSession = localStorage.getItem(this.SESSION_KEY);
        if (savedSession) {
            try {
                this.currentUser = JSON.parse(savedSession);
                console.log('✅ User session restored from localStorage:', this.currentUser.email);
            } catch (error) {
                console.error('Error restoring session:', error);
                localStorage.removeItem(this.SESSION_KEY);
            }
        }
    },
    
    // Check authentication status
    isAuthenticated() {
        console.log('Checking authentication - session data:', this.currentUser);
        return this.currentUser !== null;
    },
    
    // Check if user has completed profile
    hasCompletedProfile() {
        console.log('Checking profile completion - session data:', this.currentUser);
        return this.currentUser && this.currentUser.profileComplete === true;
    },
    
    // Set current user and persist to localStorage
    setUser(userData) {
        this.currentUser = userData;
        
        // Remove sensitive data before storing to localStorage
        const sessionData = { ...userData };
        delete sessionData.hashedPassword;
        
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        console.log('💾 User session saved to localStorage:', userData.email);
        this.updateUIWithUserData(userData);
    },
    
    // Get current user
    getUser() {
        return this.currentUser;
    },
    
    // Clear session (logout)
    clearUser() {
        this.currentUser = null;
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.clear();
        
        // Clear notifications when user logs out
        if (typeof window.clearAllNotifications === 'function') {
            window.clearAllNotifications();
        }
        
        console.log('🚪 User session cleared');
    },
    
    // Update UI with user data
    updateUIWithUserData(userData) {
        // Update profile sections in main app (exclude screen titles like "Our Sponsor")
        const profileSections = document.querySelectorAll('.profile-section span');
        profileSections.forEach(section => {
            // Skip spans that contain screen titles (like "Our Sponsor", "Top Doctors", etc.)
            const currentText = section.textContent.trim();
            if (currentText.includes('Our Sponsor') || 
                currentText.includes('Top Doctors') || 
                currentText.includes('Top Now') ||
                currentText.includes('Specialists') ||
                currentText.includes('Appointments') ||
                currentText.includes('My Wallet')) {
                return; // Skip updating this span
            }
            
            const name = userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData.email || 'User';
            section.textContent = name;
        });
        
        // Update profile avatars if avatar exists
        if (userData.avatar) {
            // Replace only user profile icons with images (exclude button icons)
            const profileIcons = document.querySelectorAll('.profile-section i:not(.back-button i):not(button i)');
            profileIcons.forEach(icon => {
                // Only replace user profile icons (fa-user-circle class)
                if (icon.classList.contains('fa-user-circle')) {
                    const img = document.createElement('img');
                    img.src = userData.avatar;
                    img.style.cssText = 'width: 28px; height: 28px; border-radius: 50%; object-fit: cover;';
                    icon.parentNode.replaceChild(img, icon);
                }
            });
            
            // Update existing avatar images
            const profileImages = document.querySelectorAll('.profile-section img');
            profileImages.forEach(img => {
                img.src = userData.avatar;
            });
        }

        // Update profile card with user information
        this.updateProfileCard(userData);
    },

    // Update profile card in profile screen
    updateProfileCard(userData) {
        // Update profile card name
        const profileCardName = document.getElementById('profile-card-name');
        if (profileCardName) {
            const fullName = userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData.email || 'User';
            profileCardName.textContent = fullName;
        }

        // Update profile card phone number
        const profileCardPhone = document.getElementById('profile-card-phone');
        if (profileCardPhone && userData.mobile) {
            profileCardPhone.textContent = userData.mobile;
        }

        // Update profile card email
        const profileCardEmail = document.getElementById('profile-card-email');
        if (profileCardEmail && userData.email) {
            profileCardEmail.textContent = userData.email;
        }

        // Update profile card avatar
        const profileAvatarIcon = document.getElementById('profile-avatar-icon');
        const profileAvatarImg = document.getElementById('profile-avatar-img');
        
        if (userData.avatar && profileAvatarIcon && profileAvatarImg) {
            // Hide icon, show image
            profileAvatarIcon.style.display = 'none';
            profileAvatarImg.src = userData.avatar;
            profileAvatarImg.style.display = 'block';
        } else if (profileAvatarIcon && profileAvatarImg) {
            // No avatar - show default icon
            profileAvatarIcon.style.display = 'block';
            profileAvatarImg.style.display = 'none';
        }
    },
    
    // Logout user
    logout() {
        // Ensure body overflow is reset to allow scrolling
        document.body.style.overflow = '';
        
        this.clearUser();
        this.startAuthFlow();
    },
    
    // Start authentication flow
    startAuthFlow() {
        // Show splash screen first
        switchScreen('splash');
        
        // After 3 seconds, navigate to sign-in screen
        setTimeout(() => {
            switchScreen('signin');
        }, 3000);
    }
};

// Expose AuthSystem globally so user-supabase-integration.js can access it
window.AuthSystem = AuthSystem;

// Onboarding System
const OnboardingSystem = {
    currentSlide: 0,
    totalSlides: 3,
    
    nextSlide() {
        const slides = document.querySelectorAll('.onboarding-slide');
        const dots = document.querySelectorAll('.onboarding-dots .dot');
        const nextBtn = document.querySelector('.next-btn');
        const getStartedBtn = document.querySelector('.get-started-btn');
        
        // Hide current slide
        slides[this.currentSlide].classList.remove('active');
        dots[this.currentSlide].classList.remove('active');
        
        // Move to next slide
        this.currentSlide++;
        
        if (this.currentSlide < this.totalSlides) {
            // Show next slide
            slides[this.currentSlide].classList.add('active');
            dots[this.currentSlide].classList.add('active');
            
            // Show "Get Started" button on last slide
            if (this.currentSlide === this.totalSlides - 1) {
                nextBtn.style.display = 'none';
                getStartedBtn.style.display = 'block';
            }
        }
    },
    
    goToSlide(slideIndex) {
        const slides = document.querySelectorAll('.onboarding-slide');
        const dots = document.querySelectorAll('.onboarding-dots .dot');
        const nextBtn = document.querySelector('.next-btn');
        const getStartedBtn = document.querySelector('.get-started-btn');
        
        // Hide current slide
        slides[this.currentSlide].classList.remove('active');
        dots[this.currentSlide].classList.remove('active');
        
        // Show selected slide
        this.currentSlide = slideIndex;
        slides[this.currentSlide].classList.add('active');
        dots[this.currentSlide].classList.add('active');
        
        // Update button visibility
        if (this.currentSlide === this.totalSlides - 1) {
            nextBtn.style.display = 'none';
            getStartedBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            getStartedBtn.style.display = 'none';
        }
    },
    
    complete() {
        switchScreen('welcome');
    }
};

// Global authentication functions
window.skipOnboarding = function() {
    OnboardingSystem.complete();
};

window.nextOnboardingSlide = function() {
    OnboardingSystem.nextSlide();
};

window.completeOnboarding = function() {
    OnboardingSystem.complete();
};

window.goToSignUp = function() {
    document.getElementById('signup-email-error').textContent = '';
    document.getElementById('signup-password-error').textContent = '';
    document.getElementById('signup-form').reset();
    switchScreen('signup');
};

window.goToSignIn = function() {
    document.getElementById('signin-email-error').textContent = '';
    document.getElementById('signin-password-error').textContent = '';
    document.getElementById('signin-form').reset();
    switchScreen('signin');
};

window.switchToSignIn = function() {
    document.getElementById('signin-email-error').textContent = '';
    document.getElementById('signin-password-error').textContent = '';
    document.getElementById('signin-form').reset();
    switchScreen('signin');
};

window.switchToSignUp = function() {
    document.getElementById('signup-email-error').textContent = '';
    document.getElementById('signup-password-error').textContent = '';
    document.getElementById('signup-form').reset();
    switchScreen('signup');
};

// Forgot Password Functions
let resetPasswordEmail = '';

window.showForgotPassword = function() {
    console.log('Show forgot password clicked');
    // Reset forms
    document.getElementById('forgot-password-form').style.display = 'block';
    document.getElementById('password-reset-otp-form').style.display = 'none';
    document.getElementById('reset-password-form').style.display = 'none';
    document.getElementById('forgot-password-title').textContent = 'Reset Password';
    document.getElementById('forgot-password-subtitle').textContent = "Enter your email address and we'll send you a verification code";
    switchScreen('forgot-password');
};

window.goBackToSignIn = function() {
    console.log('Going back to sign in from forgot password');
    resetPasswordEmail = '';
    switchScreen('signin');
};

window.handleForgotPassword = async function(event) {
    event.preventDefault();
    console.log('Forgot password form submitted');
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Clear previous errors
    document.getElementById('forgot-email-error').textContent = '';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('forgot-email-error').textContent = 'Please enter a valid email address';
        return;
    }
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Store email for OTP verification
            resetPasswordEmail = email;
            
            // Show OTP form
            document.getElementById('forgot-password-form').style.display = 'none';
            document.getElementById('password-reset-otp-form').style.display = 'block';
            document.getElementById('reset-email-display').textContent = email;
            document.getElementById('forgot-password-title').textContent = 'Verify Code';
            document.getElementById('forgot-password-subtitle').textContent = 'Enter the 6-digit code sent to your email';
            
            // Setup OTP input auto-advance
            setupPasswordResetOTPInputs();
            
            // Focus first OTP digit
            const firstOTPInput = document.querySelector('#password-reset-otp-form .otp-digit');
            if (firstOTPInput) firstOTPInput.focus();
        } else {
            document.getElementById('forgot-email-error').textContent = data.error || 'Failed to send verification code. Please try again.';
        }
    } catch (error) {
        console.error('Error sending password reset:', error);
        document.getElementById('forgot-email-error').textContent = 'Network error. Please check your connection and try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
};

// Setup OTP inputs for auto-advance (Password Reset)
function setupPasswordResetOTPInputs() {
    // Get fresh reference to OTP inputs from password reset form
    const getOTPInputs = () => document.querySelectorAll('#password-reset-otp-form .otp-digit');
    
    // Clear all inputs first
    getOTPInputs().forEach(input => {
        input.value = '';
        // Remove old event listeners by cloning and replacing
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    });
    
    // Re-query after cloning to get fresh references
    const otpInputs = getOTPInputs();
    
    otpInputs.forEach((input, index) => {
        // Add input event listener
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow digits
            e.target.value = value.replace(/[^0-9]/g, '');
            
            // Auto-advance to next input
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                const currentOtpInputs = getOTPInputs();
                currentOtpInputs[index + 1].focus();
            }
        });
        
        // Add keydown event listener for backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                const currentOtpInputs = getOTPInputs();
                currentOtpInputs[index - 1].focus();
            }
        });
        
        // Add paste event listener
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const digits = pastedData.replace(/[^0-9]/g, '').split('');
            const currentOtpInputs = getOTPInputs();
            
            digits.forEach((digit, i) => {
                if (index + i < currentOtpInputs.length) {
                    currentOtpInputs[index + i].value = digit;
                }
            });
            
            // Focus the last filled input or the next empty one
            const lastIndex = Math.min(index + digits.length, currentOtpInputs.length - 1);
            currentOtpInputs[lastIndex].focus();
        });
    });
}

// Handle Password Reset OTP Verification
window.handlePasswordResetOTPVerification = async function(event) {
    event.preventDefault();
    console.log('Password Reset OTP verification form submitted');
    
    const form = event.target;
    const otpInputs = form.querySelectorAll('.otp-digit');
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Clear previous errors
    const otpErrorElement = document.getElementById('password-reset-otp-error');
    if (otpErrorElement) otpErrorElement.textContent = '';
    
    // Validate OTP
    if (otp.length !== 6) {
        if (otpErrorElement) otpErrorElement.textContent = 'Please enter all 6 digits';
        return;
    }
    
    if (!/^\d{6}$/.test(otp)) {
        if (otpErrorElement) otpErrorElement.textContent = 'OTP must contain only numbers';
        return;
    }
    
    // Disable submit button
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Verifying...';
    
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/verify-reset-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: resetPasswordEmail, otp })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Show password reset form
            document.getElementById('password-reset-otp-form').style.display = 'none';
            document.getElementById('reset-password-form').style.display = 'block';
            document.getElementById('forgot-password-title').textContent = 'New Password';
            document.getElementById('forgot-password-subtitle').textContent = 'Create a new password for your account';
            
            // Focus on new password input
            document.getElementById('new-password-input').focus();
        } else {
            if (otpErrorElement) otpErrorElement.textContent = data.error || 'Invalid OTP. Please try again.';
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        if (otpErrorElement) otpErrorElement.textContent = 'Network error. Please check your connection and try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
};

// Handle Email Verification OTP (for signup)
window.handleOTPVerification = async function(event) {
    event.preventDefault();
    console.log('Email OTP verification form submitted');
    
    const form = event.target;
    const otpInput = form.querySelector('#otp-input');
    const otp = otpInput.value;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Clear previous errors
    document.getElementById('otp-error').textContent = '';
    
    // Validate OTP
    if (otp.length !== 6) {
        document.getElementById('otp-error').textContent = 'Please enter all 6 digits';
        return;
    }
    
    if (!/^\d{6}$/.test(otp)) {
        document.getElementById('otp-error').textContent = 'OTP must contain only numbers';
        return;
    }
    
    // Disable submit button
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Verifying...';
    
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: window.pendingVerificationEmail, otp })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            CustomDialog.alert(
                'Your email has been verified successfully! You can now sign in to your account.',
                'Email Verified'
            ).then(() => {
                form.reset();
                switchScreen('signin');
            });
        } else {
            document.getElementById('otp-error').textContent = data.error || 'Invalid OTP. Please try again.';
        }
    } catch (error) {
        console.error('Error verifying email OTP:', error);
        document.getElementById('otp-error').textContent = 'Network error. Please check your connection and try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
};

// Handle Password Reset with OTP
window.handleResetPasswordWithOTP = async function(event) {
    event.preventDefault();
    console.log('Reset password form submitted');
    
    const form = event.target;
    const newPassword = document.getElementById('new-password-input').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Clear previous errors
    document.getElementById('new-password-error').textContent = '';
    document.getElementById('confirm-new-password-error').textContent = '';
    
    // Validate password
    if (newPassword.length < 8) {
        document.getElementById('new-password-error').textContent = 'Password must be at least 8 characters';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
        return;
    }
    
    // Disable submit button
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Resetting...';
    
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: resetPasswordEmail,
                newPassword: newPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            CustomDialog.alert(
                'Your password has been reset successfully. You can now sign in with your new password.',
                'Password Reset Successful'
            ).then(() => {
                form.reset();
                resetPasswordEmail = '';
                switchScreen('signin');
            });
        } else {
            document.getElementById('new-password-error').textContent = data.error || 'Failed to reset password. Please try again.';
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        document.getElementById('new-password-error').textContent = 'Network error. Please check your connection and try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
};

// Resend OTP
window.resendOTP = async function() {
    event.preventDefault();
    console.log('Resend OTP requested');
    
    if (!resetPasswordEmail) {
        console.error('No email stored for resend');
        return;
    }
    
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: resetPasswordEmail })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Clear OTP inputs
            document.querySelectorAll('.otp-digit').forEach(input => input.value = '');
            document.querySelector('.otp-digit').focus();
            
            CustomDialog.alert(
                'A new verification code has been sent to your email.',
                'Code Resent'
            );
        } else {
            CustomDialog.alert(
                data.error || 'Failed to resend code. Please try again.',
                'Resend Failed'
            );
        }
    } catch (error) {
        console.error('Error resending OTP:', error);
        CustomDialog.alert(
            'Network error. Please check your connection and try again.',
            'Network Error'
        );
    }
};

window.goBack = function() {
    // Simple back navigation for auth screens
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        const currentId = currentScreen.id;
        if (currentId === 'signin-screen' || currentId === 'signup-screen') {
            switchScreen('onboarding');
        } else if (currentId === 'profile-creation-screen') {
            // Go to appropriate auth screen based on how they got here
            switchScreen('signup');
        }
    }
};

window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
};

window.handleSignUp = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const rawEmail = formData.get('email');
    const rawPassword = formData.get('password');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Clear previous errors
    document.getElementById('signup-email-error').textContent = '';
    document.getElementById('signup-password-error').textContent = '';
    
    // Sanitize inputs
    const email = ValidationUtils.sanitizeInput(rawEmail);
    const password = ValidationUtils.sanitizeInput(rawPassword);
    
    // Validate email format
    if (!ValidationUtils.isValidEmail(email)) {
        document.getElementById('signup-email-error').textContent = 'Please enter a valid email address';
        return;
    }
    
    // Validate email domain - only allow Gmail and Hotmail
    const emailLower = email.toLowerCase();
    const allowedDomains = ['@gmail.com', '@hotmail.com'];
    const isAllowedDomain = allowedDomains.some(domain => emailLower.endsWith(domain));
    
    if (!isAllowedDomain) {
        document.getElementById('signup-email-error').textContent = 'Only Gmail and Hotmail addresses are allowed for sign up';
        return;
    }
    
    // Block temporary/disposable email services
    const tempEmailDomains = [
        'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
        'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
        'trashmail.com', 'yopmail.com', 'mohmal.com', 'fakeinbox.com',
        'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
        'spam4.me', 'mintemail.com', 'emailondeck.com', 'tempinbox.com',
        'dispostable.com', 'throwawaymail.com', 'mytemp.email', 'temp-mail.io',
        'tmailor.com', 'tmails.net', 'disposablemail.com', 'getairmail.com',
        'harakirimail.com', 'mail-temp.com', 'tempmail.net', '33mail.com',
        'mailnesia.com', 'mailcatch.com', 'tmail.com', 'email-temp.com'
    ];
    
    const emailDomain = emailLower.split('@')[1];
    if (tempEmailDomains.includes(emailDomain)) {
        document.getElementById('signup-email-error').textContent = 'Temporary email addresses are not allowed';
        return;
    }
    
    // Validate using centralized password utility
    if (!PasswordUtils.validatePassword(password)) {
        document.getElementById('signup-password-error').textContent = PasswordUtils.getPasswordRequirements();
        return;
    }

    // Disable submit button and show loading state
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating Account...';

    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Create user session immediately with the returned user data
            if (data.user) {
                const userData = {
                    email: data.user.email,
                    profileComplete: false,
                    signupMethod: 'email',
                    supabaseId: data.user.id,
                    createdAt: data.user.created_at
                };
                
                AuthSystem.setUser(userData);
                console.log('✅ User session created with supabaseId:', data.user.id);
            }
            
            // Show success message and redirect to profile creation
            CustomDialog.alert(
                'Account created successfully! Please complete your profile to continue.',
                'Welcome!'
            ).then(() => {
                form.reset();
                // Redirect directly to profile creation
                switchScreen('profile-creation');
            });
            console.log('✅ Account created, redirecting to profile creation');
        } else {
            document.getElementById('signup-email-error').textContent = data.error || 'Failed to create account. Please try again.';
        }
    } catch (error) {
        console.error('Signup error:', error);
        document.getElementById('signup-email-error').textContent = 'Network error. Please check your connection and try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
};

window.handleOTPVerification = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const otp = formData.get('otp').trim();
    const email = sessionStorage.getItem('verificationEmail');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Clear previous errors
    document.getElementById('otp-error').textContent = '';
    
    if (!email) {
        document.getElementById('otp-error').textContent = 'Session expired. Please sign up again.';
        return;
    }
    
    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
        document.getElementById('otp-error').textContent = 'Please enter a valid 6-digit code';
        return;
    }
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Verifying...';
    
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Clear stored email
            sessionStorage.removeItem('verificationEmail');
            
            // Save user session properly using AuthSystem with supabaseId
            if (data.user) {
                const userData = {
                    email: data.user.email,
                    profileComplete: false,
                    signupMethod: 'email',
                    supabaseId: data.user.id,
                    createdAt: data.user.created_at
                };
                
                AuthSystem.setUser(userData);
                console.log('✅ User session created with supabaseId:', data.user.id);
            }
            
            CustomDialog.alert(
                'Email verified successfully! You can now complete your profile.',
                'Verification Successful'
            ).then(() => {
                form.reset();
                // Redirect to profile creation
                switchScreen('profile-creation');
            });
            console.log('✅ Email verified successfully via OTP');
        } else {
            document.getElementById('otp-error').textContent = data.error || 'Invalid or expired code. Please try again.';
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        document.getElementById('otp-error').textContent = 'Network error. Please check your connection and try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
};

let resendCooldown = 0;
let resendTimer = null;

window.handleResendOTP = async function() {
    const email = sessionStorage.getItem('verificationEmail');
    const resendBtn = document.getElementById('resend-otp-btn');
    const timerDisplay = document.getElementById('resend-timer');
    
    if (!email) {
        document.getElementById('otp-error').textContent = 'Session expired. Please sign up again.';
        return;
    }
    
    // Check cooldown
    if (resendCooldown > 0) {
        return;
    }
    
    // Disable button
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';
    
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/resend-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            CustomDialog.alert(
                'A new verification code has been sent to your email.',
                'Code Sent'
            );
            
            // Start 60-second cooldown
            resendCooldown = 60;
            timerDisplay.style.display = 'block';
            
            // Clear previous timer if exists
            if (resendTimer) {
                clearInterval(resendTimer);
            }
            
            resendTimer = setInterval(() => {
                resendCooldown--;
                timerDisplay.textContent = `Resend available in ${resendCooldown}s`;
                
                if (resendCooldown <= 0) {
                    clearInterval(resendTimer);
                    resendTimer = null;
                    timerDisplay.style.display = 'none';
                    resendBtn.disabled = false;
                    resendBtn.textContent = 'Resend Code';
                }
            }, 1000);
            
            console.log('✅ OTP resent to:', email);
        } else {
            document.getElementById('otp-error').textContent = data.error || 'Failed to resend code. Please try again.';
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend Code';
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        document.getElementById('otp-error').textContent = 'Network error. Please try again.';
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Code';
    }
};

window.handleSignIn = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const rawEmail = formData.get('email');
    const rawPassword = formData.get('password');
    
    // Clear previous errors
    document.getElementById('signin-email-error').textContent = '';
    document.getElementById('signin-password-error').textContent = '';
    
    // Sanitize inputs
    const email = ValidationUtils.sanitizeInput(rawEmail);
    const password = ValidationUtils.sanitizeInput(rawPassword);
    
    // Validate email format
    if (!ValidationUtils.isValidEmail(email)) {
        document.getElementById('signin-email-error').textContent = 'Please enter a valid email address';
        return;
    }
    
    // Validate password requirements
    if (!PasswordUtils.validatePassword(password)) {
        document.getElementById('signin-password-error').textContent = PasswordUtils.getPasswordRequirements();
        return;
    }
    
    // Check rate limiting
    if (!ValidationUtils.checkRateLimit(email)) {
        document.getElementById('signin-email-error').textContent = 'Too many sign-in attempts. Please wait 5 minutes before trying again.';
        return;
    }
    
    // Try to sign in via API
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // Handle unverified email (403 error)
        if (response.status === 403 && data.email_verified === false) {
            CustomDialog.confirm(
                `Please verify your email before logging in.\n\nWe sent a verification link to ${email}.\n\nDidn't receive the email?`,
                'Email Not Verified',
                'Resend Verification Email',
                'Cancel'
            ).then((confirmed) => {
                if (confirmed) {
                    resendVerificationEmail(email);
                }
            });
            return;
        }

        // Handle other errors
        if (!response.ok || !data.success) {
            if (data.error.includes('Invalid email or password')) {
                document.getElementById('signin-email-error').textContent = 'Invalid email or password. Please try again.';
            } else {
                document.getElementById('signin-email-error').textContent = data.error || 'Unable to sign in. Please try again.';
            }
            return;
        }

        const user = data.user;
        
        // Check if user has completed their profile
        if (!user.profile_complete) {
            // Create session but redirect to profile creation
            const userData = {
                email: user.email,
                hashedPassword: PasswordUtils.hashPassword(password),
                profileComplete: false,
                signupMethod: 'email',
                supabaseId: user.id,
                createdAt: user.created_at
            };
            
            AuthSystem.setUser(userData);
            switchScreen('profile-creation');
            console.log('User must complete profile:', email);
            return;
        }
        
        // User exists and profile is complete - create session with full profile data
        const userData = {
            email: user.email,
            hashedPassword: PasswordUtils.hashPassword(password),
            profileComplete: true,
            signupMethod: 'email',
            firstName: user.name ? user.name.split(' ')[0] : '',
            lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
            mobile: user.mobile || '',
            district: user.district || '',
            upazila: user.upazila || '',
            avatar: user.avatar || null,
            supabaseId: user.id,
            loginAt: new Date().toISOString(),
            createdAt: user.created_at
        };
        
        // Login successful - clear any rate limiting
        ValidationUtils.clearRateLimit(email);
        
        console.log('📍 User data from database:', { email: user.email, id: user.id, name: user.name });
        console.log('📍 Creating session with supabaseId:', user.id);
        
        AuthSystem.setUser(userData);
        console.log('✅ User session set with supabaseId:', userData.supabaseId);
        
        // Verify session was set correctly
        const verifyUser = AuthSystem.getUser();
        console.log('📍 Verify session after setUser:', verifyUser ? { email: verifyUser.email, supabaseId: verifyUser.supabaseId } : 'NULL');
        
        // Ensure body overflow is reset to allow scrolling
        document.body.style.overflow = '';
        
        // Show home screen immediately for faster UX
        switchScreen('home');
        console.log('User signed in successfully:', email);
        
        // Show welcome benefits popup after successful sign-in
        setTimeout(() => {
            showWelcomePopup();
        }, 500);
        
        // Sync user's appointments, points, blood requests, ambulance requests, donor profile, and notifications in background (non-blocking)
        if (typeof window.userSupabaseHandlers !== 'undefined') {
            console.log('🔄 Starting background sync of user data...');
            Promise.all([
                window.userSupabaseHandlers.syncAppointments ? window.userSupabaseHandlers.syncAppointments() : Promise.resolve(),
                window.userSupabaseHandlers.syncPoints ? window.userSupabaseHandlers.syncPoints() : Promise.resolve(),
                window.userSupabaseHandlers.syncBloodRequests ? window.userSupabaseHandlers.syncBloodRequests() : Promise.resolve(),
                window.userSupabaseHandlers.syncAmbulanceRequests ? window.userSupabaseHandlers.syncAmbulanceRequests() : Promise.resolve(),
                window.userSupabaseHandlers.syncDonorProfile ? window.userSupabaseHandlers.syncDonorProfile() : Promise.resolve(),
                window.loadNotificationsFromSupabase ? window.loadNotificationsFromSupabase() : Promise.resolve()
            ]).then(() => {
                console.log('✅ Background sync completed (including notifications)');
            }).catch(err => {
                console.error('❌ Background sync error:', err);
            });
        } else {
            console.warn('⚠️ userSupabaseHandlers not available');
        }
        
    } catch (error) {
        console.error('Sign-in error:', error);
        document.getElementById('signin-email-error').textContent = 'Network error. Please check your connection and try again.';
    }

async function resendVerificationEmail(email) {
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            CustomDialog.alert(
                'Verification email sent! Please check your inbox and click the verification link to activate your account.',
                'Email Sent'
            );
        } else {
            CustomDialog.alert(
                data.error || 'Failed to send verification email. Please try again later.',
                'Error'
            );
        }
    } catch (error) {
        console.error('Resend verification error:', error);
        CustomDialog.alert(
            'Network error. Please check your connection and try again.',
            'Error'
        );
    }
}
};

// Google sign-in removed - users can only sign up/sign in with email and password
// window.signInWithGoogle = function() {
//     // For now, simulate Google sign-in
//     // In real implementation, this would redirect to /api/login
//     const userData = {
//         email: 'user@gmail.com',
//         profileComplete: false,
//         signupMethod: 'google',
//         firstName: 'John',
//         lastName: 'Doe',
//         avatar: 'https://via.placeholder.com/100x100/673AB7/FFFFFF?text=JD',
//         createdAt: new Date().toISOString()
//     };
//     
//     AuthSystem.setUser(userData);
//     
//     // Check if profile is complete
//     if (!userData.profileComplete) {
//         switchScreen('profile-creation');
//     } else {
//         switchScreen('home');
//     }
// };

window.handlePhotoUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('profile-photo-preview');
            const container = document.getElementById('photo-preview');
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            
            // Hide the placeholder content
            const icon = container.querySelector('i');
            const span = container.querySelector('span');
            if (icon) icon.style.display = 'none';
            if (span) span.style.display = 'none';
            
            // Clear photo upload error if exists
            const photoErrorElement = document.getElementById('photo-upload-error');
            if (photoErrorElement) {
                photoErrorElement.textContent = '';
            }
            
            // Update progress
            updateProfileProgress();
        };
        reader.readAsDataURL(file);
    }
};

function updateProfileProgress() {
    const form = document.getElementById('profile-creation-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const progressBar = document.getElementById('profile-progress');
    
    let completed = 0;
    const requiredFields = ['firstName', 'lastName', 'mobile', 'district', 'upazila'];
    
    requiredFields.forEach(field => {
        if (formData.get(field)?.trim()) {
            completed++;
        }
    });
    
    // Add photo if uploaded
    if (document.getElementById('profile-photo-preview')?.style.display === 'block') {
        completed++;
    }
    
    const progress = (completed / (requiredFields.length + 1)) * 100;
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

window.handleProfileCreation = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Clear previous errors
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
    
    // Validate required fields
    let isValid = true;
    const requiredFields = ['firstName', 'lastName', 'mobile', 'district', 'upazila'];
    
    requiredFields.forEach(field => {
        const value = formData.get(field)?.trim();
        if (!value) {
            const errorElement = document.getElementById(`${field.replace('Name', '-name')}-error`);
            if (errorElement) {
                if (field === 'district') {
                    errorElement.textContent = 'Please select your district';
                } else if (field === 'upazila') {
                    errorElement.textContent = 'Please select your upazila';
                } else {
                    errorElement.textContent = 'This field is required';
                }
            }
            isValid = false;
        }
    });
    
    // Validate profile photo upload (REQUIRED)
    const avatarImg = document.getElementById('profile-photo-preview');
    const avatar = (avatarImg && avatarImg.style.display === 'block') ? avatarImg.src : null;
    
    if (!avatar) {
        const photoErrorElement = document.getElementById('photo-upload-error');
        if (photoErrorElement) {
            photoErrorElement.textContent = 'Profile photo is required to complete sign up';
        }
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Get current user data and update
    const currentUser = AuthSystem.getUser();
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const mobile = formData.get('mobile');
    const district = formData.get('district');
    const upazila = formData.get('upazila');
    
    console.log('📋 Profile creation - Current user:', currentUser);
    console.log('📋 Profile creation - supabaseId:', currentUser?.supabaseId);
    console.log('📋 Profile creation - updateProfile available:', typeof window.userSupabaseHandlers?.updateProfile === 'function');
    
    // Update profile in Supabase if user has an ID
    if (currentUser && currentUser.supabaseId && typeof window.userSupabaseHandlers?.updateProfile === 'function') {
        try {
            const profileData = {
                name: `${firstName} ${lastName}`,
                mobile: mobile,
                district: district,
                upazila: upazila,
                avatar: avatar,
                profile_complete: true
            };
            
            console.log('📤 Saving profile to Supabase with data:', {
                userId: currentUser.supabaseId,
                name: profileData.name,
                mobile: profileData.mobile,
                district: profileData.district,
                upazila: profileData.upazila,
                profile_complete: profileData.profile_complete,
                avatarLength: profileData.avatar?.length
            });
            
            await window.userSupabaseHandlers.updateProfile(currentUser.supabaseId, profileData);
            console.log('✅ Profile successfully saved to Supabase database');
        } catch (error) {
            console.error('❌ Error updating profile in Supabase:', error);
            // Show error to user but allow local profile creation to continue
            if (typeof CustomDialog !== 'undefined' && CustomDialog.alert) {
                CustomDialog.alert('Your profile was created locally, but we couldn\'t save it to the server. Please check your connection and try again later.', 'Warning');
            }
        }
    } else {
        console.warn('⚠️ Profile NOT saved to Supabase - Missing requirements:', {
            hasCurrentUser: !!currentUser,
            hasSupabaseId: !!currentUser?.supabaseId,
            hasUpdateFunction: typeof window.userSupabaseHandlers?.updateProfile === 'function'
        });
    }
    
    // Update local session
    const updatedUser = {
        ...currentUser,
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        district: district,
        upazila: upazila,
        profileComplete: true,
        profileCompletedAt: new Date().toISOString()
    };
    
    if (avatar) {
        updatedUser.avatar = avatar;
    }
    
    AuthSystem.setUser(updatedUser);
    
    // Sync user's appointments and points from Supabase after profile completion
    if (typeof window.userSupabaseHandlers !== 'undefined') {
        if (window.userSupabaseHandlers.syncAppointments) {
            await window.userSupabaseHandlers.syncAppointments();
        }
        if (window.userSupabaseHandlers.syncPoints) {
            await window.userSupabaseHandlers.syncPoints();
        }
    }
    
    switchScreen('home');
    
    // Show welcome benefits popup after successful profile creation
    setTimeout(() => {
        showWelcomePopup();
    }, 500);
};

// Add event listeners for profile form to update progress
document.addEventListener('input', function(event) {
    if (event.target.closest('#profile-creation-form')) {
        updateProfileProgress();
    }
});

// Add event listeners for onboarding dots
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('dot') && event.target.hasAttribute('data-dot')) {
        const slideIndex = parseInt(event.target.getAttribute('data-dot'));
        OnboardingSystem.goToSlide(slideIndex);
    }
});

// Upazila data based on districts (globally accessible)
const upazilaData = {
    rangpur: ['Mithapukur', 'Taraganj', 'Badarganj', 'Pirganj', 'Pirgacha', 'Gangachara', 'Kaunia', 'Rangpur Sadar'],
    panchagarh: ['Panchagarh Sadar', 'Tetulia', 'Atwari', 'Debiganj', 'Boda'],
    thakurgaon: ['Thakurgaon Sadar', 'Ranishankail', 'Baliadangi', 'Haripur', 'Pirganj'],
    nilphamari: ['Dimla', 'Jaldhaka', 'Saidpur', 'Kishoreganj', 'Nilphamari Sadar', 'Domar'],
    lalmonirhat: ['Patgram', 'Hatibandha', 'Lalmonirhat Sadar', 'Aditmari', 'Kaliganj'],
    gaibandha: ['Gobindaganj', 'Saghata', 'Palashbari', 'Gaibandha Sadar', 'Sadullapur', 'Sundarganj', 'Fulchhari'],
    kurigram: ['Ulipur', 'Phulbari', 'Bhurungamari', 'Nageshwari', 'Rajarhat', 'Rajibpur', 'Kurigram Sadar', 'Roumari', 'Chilmari'],
    dinajpur: ['Kaharole', 'Khansama', 'Birganj', 'Chirirbandar', 'Birampur', 'Ghoraghat', 'Dinajpur Sadar', 'Nawabganj', 'Bochaganj', 'Phulbari', 'Biral', 'Parbatipur', 'Hakimpur']
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired - starting app initialization');
    
    // Check if user was redirected after password reset
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auto_logout') === '1') {
        // Clear all session data
        localStorage.removeItem('mediquick_user_session');
        sessionStorage.clear();
        console.log('🔐 Auto-logout after password reset');
        
        // Remove the query parameter
        window.history.replaceState({}, document.title, '/');
    }
    
    // Check if user was redirected back from bKash payment
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus) {
        console.log('🔔 Redirected from bKash payment with status:', paymentStatus);
        
        // Get payment result from sessionStorage
        const paymentResultStr = sessionStorage.getItem('bkashPaymentResult');
        
        if (paymentResultStr) {
            try {
                const paymentResult = JSON.parse(paymentResultStr);
                sessionStorage.removeItem('bkashPaymentResult');
                
                // Handle the payment result
                if (paymentResult.success && paymentResult.transactionData) {
                    const paymentInfo = JSON.parse(sessionStorage.getItem('bkashPaymentInfo') || '{}');
                    
                    // Delay to ensure the app is fully initialized
                    setTimeout(async () => {
                        if (typeof handleSuccessfulBkashPayment === 'function') {
                            await handleSuccessfulBkashPayment(paymentInfo, paymentResult.transactionData);
                        } else {
                            CustomDialog.alert('Payment successful! Transaction ID: ' + paymentResult.transactionData.trxID, 'Payment Complete');
                        }
                        sessionStorage.removeItem('bkashPaymentInfo');
                    }, 1000);
                } else {
                    setTimeout(() => {
                        if (paymentResult.status === 'cancelled') {
                            CustomDialog.alert('Payment was cancelled.', 'Payment Cancelled');
                        } else {
                            CustomDialog.alert('Payment failed: ' + (paymentResult.error || 'Unknown error'), 'Payment Failed');
                        }
                        sessionStorage.removeItem('bkashPaymentInfo');
                    }, 1000);
                }
            } catch (error) {
                console.error('Error processing payment result:', error);
                sessionStorage.removeItem('bkashPaymentInfo');
            }
        } else {
            // Fallback: sessionStorage data is missing, use query parameter
            setTimeout(() => {
                if (paymentStatus === 'success') {
                    CustomDialog.alert('Payment completed successfully!', 'Payment Complete');
                } else {
                    CustomDialog.alert('Payment was cancelled or failed.', 'Payment Cancelled');
                }
                sessionStorage.removeItem('bkashPaymentInfo');
            }, 1000);
        }
        
        // Remove the payment query parameter from URL
        urlParams.delete('payment');
        const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : '/';
        window.history.replaceState({}, document.title, newUrl);
    }
    
    // Check if user just verified their email and should be redirected to profile creation
    const autoRedirectToProfile = sessionStorage.getItem('autoRedirectToProfile');
    if (autoRedirectToProfile === 'true') {
        sessionStorage.removeItem('autoRedirectToProfile');
        console.log('🎯 Auto-redirect to profile creation after email verification detected');
    }
    
    // Restore user session from localStorage if available
    AuthSystem.init();
    
    // Restore hospital bookings from localStorage if available
    const savedBookings = localStorage.getItem('mediquick_hospital_bookings');
    if (savedBookings) {
        try {
            InMemoryStorage.hospitalBookings = JSON.parse(savedBookings);
            console.log('✅ Hospital bookings restored from localStorage:', InMemoryStorage.hospitalBookings.length, 'bookings');
        } catch (error) {
            console.error('Error restoring hospital bookings:', error);
            localStorage.removeItem('mediquick_hospital_bookings');
            InMemoryStorage.hospitalBookings = [];
        }
    }
    
    // Ensure user has a unique ID for notifications
    ensureUserIdExists();
    
    // Screen elements - declare these first
    const screens = document.querySelectorAll('.screen');
    const navItems = document.querySelectorAll('.nav-item');
    
    console.log('Found screens:', screens.length, 'Found nav items:', navItems.length);
    
    // Show splash screen immediately using the standard switchScreen function
    // This ensures proper screen state management and bottom navigation visibility
    function switchScreen(targetScreen) {
        console.log('Switching to screen:', targetScreen);
        
        // Hide all screens
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const screen = document.getElementById(targetScreen + '-screen');
        if (screen) {
            console.log('Found target screen element:', screen.id);
            screen.classList.add('active');
        } else {
            console.error('Target screen not found:', targetScreen + '-screen');
        }
        
        // Initialize toggles when switching to profile screen
        if (targetScreen === 'profile') {
            setTimeout(() => {
                initializeToggles();
            }, 100);
        }

        // Update navigation active state
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Set active nav item
        const activeNavItem = document.querySelector(`[data-screen="${targetScreen}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Handle bottom navigation visibility - show only on main screens
        const bottomNav = document.querySelector('.bottom-nav');
        const mainScreens = ['home', 'top-now', 'specialist', 'appointment', 'wallet'];
        
        if (bottomNav) {
            if (mainScreens.includes(targetScreen)) {
                bottomNav.style.display = 'flex';
            } else {
                bottomNav.style.display = 'none';
            }
        }

        // Refresh transaction history when wallet screen is shown
        if (targetScreen === 'wallet') {
            if (typeof window.PointsSystem !== 'undefined' && window.PointsSystem.updateTransactionHistory) {
                setTimeout(() => {
                    window.PointsSystem.updateTransactionHistory();
                    console.log('✅ Wallet transaction history refreshed');
                }, 100);
            }
        }

        // Scroll to top when switching screens
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }

    // Make switchScreen globally accessible
    window.switchScreen = switchScreen;
    
    // Show splash screen immediately to ensure it's the first thing users see
    switchScreen('splash');
    console.log('Immediately activated splash screen using switchScreen');

    // Delay authentication check slightly to ensure splash screen is visible
    setTimeout(() => {
        // Check authentication status on load - do this after switchScreen is defined
        const isAuthenticated = AuthSystem.isAuthenticated();
        const hasCompletedProfile = AuthSystem.hasCompletedProfile();
        
        console.log('Authentication check:', {
            isAuthenticated: isAuthenticated,
            hasCompletedProfile: hasCompletedProfile,
            userData: AuthSystem.getUser()
        });
        
        // Check if user just verified email (auto-redirect flag set earlier)
        const shouldAutoRedirect = autoRedirectToProfile === 'true';
        
        if (!isAuthenticated) {
            console.log('User not authenticated - keeping splash screen, will advance to onboarding');
            // Splash screen is already active, just set timer for onboarding
            setTimeout(() => {
                console.log('Auto-advancing to onboarding screen');
                switchScreen('onboarding');
            }, 3000); // Back to 3 seconds after the initial delay
        } else if (!hasCompletedProfile || shouldAutoRedirect) {
            console.log('User authenticated but profile incomplete - showing profile creation');
            // Authenticated but profile not complete OR just verified email
            switchScreen('profile-creation');
        } else {
            console.log('User fully authenticated - showing home screen');
            // Fully authenticated user - update UI and show home
            const userData = AuthSystem.getUser();
            AuthSystem.updateUIWithUserData(userData);
            
            // Sync user's appointments, points, blood requests, and ambulance requests from Supabase after session restore
            setTimeout(async () => {
                try {
                    if (typeof window.userSupabaseHandlers !== 'undefined') {
                        console.log('🔄 Starting session restore sync...');
                        if (window.userSupabaseHandlers.syncAppointments) {
                            await window.userSupabaseHandlers.syncAppointments();
                            console.log('✅ Appointments synced after session restore');
                        } else {
                            console.warn('⚠️ syncAppointments not available');
                        }
                        if (window.userSupabaseHandlers.syncPoints) {
                            await window.userSupabaseHandlers.syncPoints();
                            console.log('✅ Points synced after session restore');
                        } else {
                            console.warn('⚠️ syncPoints not available');
                        }
                        if (window.userSupabaseHandlers.syncBloodRequests) {
                            await window.userSupabaseHandlers.syncBloodRequests();
                            console.log('✅ Blood requests synced after session restore');
                        } else {
                            console.warn('⚠️ syncBloodRequests not available');
                        }
                        if (window.userSupabaseHandlers.syncAmbulanceRequests) {
                            await window.userSupabaseHandlers.syncAmbulanceRequests();
                            console.log('✅ Ambulance requests synced after session restore');
                        } else {
                            console.warn('⚠️ syncAmbulanceRequests not available');
                        }
                        if (window.loadNotificationsFromSupabase) {
                            await window.loadNotificationsFromSupabase();
                            console.log('✅ Notifications synced after session restore');
                        } else {
                            console.warn('⚠️ loadNotificationsFromSupabase not available');
                        }
                        if (window.userSupabaseHandlers.syncDonorProfile) {
                            await window.userSupabaseHandlers.syncDonorProfile();
                            console.log('✅ Donor profile synced after session restore');
                            
                            // Update the donor button state if it exists on the page
                            const becomeDonorBtn = document.querySelector('.become-donor-btn');
                            if (becomeDonorBtn && typeof updateDonorButtonState === 'function') {
                                updateDonorButtonState(becomeDonorBtn);
                                console.log('✅ Donor button state updated after session restore');
                            }
                        } else {
                            console.warn('⚠️ syncDonorProfile not available');
                        }
                    } else {
                        console.error('❌ userSupabaseHandlers not defined on session restore');
                    }
                } catch (error) {
                    console.error('❌ Error during session restore sync:', error);
                }
            }, 1000);
            
            switchScreen('home');
        }
    }, 100); // Small delay to ensure splash screen is visible first

    // Global Screen Swipe Navigation
    const mainScreens = ['home', 'top-now', 'specialist', 'appointment', 'wallet'];
    let globalSwipeStartX = 0;
    let globalSwipeStartY = 0;
    let globalSwipeCurrentX = 0;
    let globalSwipeCurrentY = 0;
    let globalSwipeIsDragging = false;
    let globalSwipeIsHorizontal = false;

    function getCurrentScreenIndex() {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen) {
            const screenName = activeScreen.id.replace('-screen', '');
            return mainScreens.indexOf(screenName);
        }
        return -1;
    }

    function navigateToScreen(direction) {
        const currentIndex = getCurrentScreenIndex();
        if (currentIndex === -1) return;

        let targetIndex = currentIndex;
        
        if (direction === 'next') {
            // Navigate to next screen, with wrapping
            targetIndex = currentIndex + 1;
            if (targetIndex >= mainScreens.length) {
                targetIndex = 0; // Wrap to first screen
            }
        } else if (direction === 'previous') {
            // Navigate to previous screen, with wrapping
            targetIndex = currentIndex - 1;
            if (targetIndex < 0) {
                targetIndex = mainScreens.length - 1; // Wrap to last screen
            }
        }

        if (targetIndex !== currentIndex) {
            switchScreen(mainScreens[targetIndex]);
        }
    }

    function isInSpecialistCategoryArea(element) {
        // Check if the touch/click is within the specialist category slider area
        const specialistSlider = document.getElementById('specialist-slider');
        if (!specialistSlider) return false;
        
        // Also check for the slider container class
        const specialistContainer = element.closest('.specialist-slider-container') || element.closest('#specialist-slider');
        const result = specialistSlider.contains(element) || specialistContainer !== null;
        
        return result;
    }

    // Add global swipe listeners to main content area
    document.addEventListener('touchstart', function(e) {
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) return;
        
        const screenName = activeScreen.id.replace('-screen', '');
        if (!mainScreens.includes(screenName)) return;

        // Don't handle swipes in specialist category area on home screen
        if (screenName === 'home' && isInSpecialistCategoryArea(e.target)) {
            return;
        }

        globalSwipeStartX = e.touches[0].clientX;
        globalSwipeStartY = e.touches[0].clientY;
        globalSwipeIsDragging = true;
        globalSwipeIsHorizontal = false;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!globalSwipeIsDragging) return;

        globalSwipeCurrentX = e.touches[0].clientX;
        globalSwipeCurrentY = e.touches[0].clientY;

        const deltaX = Math.abs(globalSwipeCurrentX - globalSwipeStartX);
        const deltaY = Math.abs(globalSwipeCurrentY - globalSwipeStartY);

        // Determine if this is primarily horizontal movement
        if (deltaX > 10 || deltaY > 10) {
            if (deltaX > deltaY) {
                globalSwipeIsHorizontal = true;
                e.preventDefault(); // Prevent scrolling during horizontal swipe
            } else {
                // Vertical movement dominates - cancel global swipe and allow vertical scrolling
                globalSwipeIsDragging = false;
                globalSwipeIsHorizontal = false;
                return;
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (!globalSwipeIsDragging || !globalSwipeIsHorizontal) {
            globalSwipeIsDragging = false;
            globalSwipeIsHorizontal = false;
            return;
        }

        globalSwipeIsDragging = false;
        globalSwipeIsHorizontal = false;

        const diffX = globalSwipeStartX - globalSwipeCurrentX;
        const threshold = 60; // Minimum swipe distance (reduced from 80)
        const currentIndex = getCurrentScreenIndex();
        const currentScreen = mainScreens[currentIndex];

        console.log('Global swipe ended. diffX:', diffX, 'threshold:', threshold, 'currentScreen:', currentScreen, 'currentIndex:', currentIndex);

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe left - next screen (but not allowed on wallet screen)
                if (currentIndex < mainScreens.length - 1) {
                    console.log('Swiping left to next screen');
                    navigateToScreen('next');
                } else {
                    console.log('Already at last screen (wallet), cannot swipe left');
                }
            } else {
                // Swipe right - previous screen (but not allowed on home screen)
                if (currentIndex > 0) {
                    console.log('Swiping right to previous screen');
                    navigateToScreen('previous');
                } else {
                    console.log('Already at first screen (home), cannot swipe right');
                }
            }
        } else {
            console.log('Swipe distance too small:', Math.abs(diffX), 'required:', threshold);
        }
    });

    // Show appointment details function
    window.showAppointmentDetails = function(appointmentId) {
        console.log('Showing details for appointment:', appointmentId);
        // For now, just show an alert with appointment details
        // In a real app, this would open a detailed view
        const appointment = PointsSystem.data.appointments.find(apt => apt.id == appointmentId);
        if (appointment) {
            const details = `Appointment Details:\n\n` +
                `Booking ID: ${appointment.bookingId}\n` +
                `Doctor: ${appointment.doctorName}\n` +
                `Category: ${appointment.doctorCategory}\n` +
                `Patient: ${appointment.patientName}\n` +
                `Date: ${formatDateDDMMYYYY(appointment.appointmentDate)}\n` +
                `Time: ${appointment.appointmentTime}\n` +
                `Address: ${appointment.patientAddress}\n` +
                `Status: ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`;
            CustomDialog.alert(details, 'Appointment Details');
        } else {
            CustomDialog.alert('Appointment details not found.', 'Error');
        }
    };

    // Track screen navigation history
    let screenHistory = [];
    let maxHistoryLength = 10;

    // Store booking session data
    let currentBookingSession = {
        patient: null,
        doctor: null,
        appointment: null
    };


    // Function to copy account number to clipboard
    window.copyAccountNumber = function() {
        // Get the account number dynamically from the DOM
        const accountNumberEl = document.querySelector('.account-number');
        const accountNumber = accountNumberEl ? accountNumberEl.textContent : '01750123456';
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(accountNumber).then(function() {
                CustomDialog.alert('Account number copied to clipboard!', 'Success');
            }).catch(function() {
                fallbackCopyTextToClipboard(accountNumber);
            });
        } else {
            fallbackCopyTextToClipboard(accountNumber);
        }
    };

    // Fallback function for copying text on older browsers
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                CustomDialog.alert('Account number copied to clipboard!', 'Success');
            } else {
                CustomDialog.alert('Unable to copy. Please copy manually: ' + text, 'Copy Failed');
            }
        } catch (err) {
            CustomDialog.alert('Unable to copy. Please copy manually: ' + text, 'Copy Failed');
        }
        
        document.body.removeChild(textArea);
    }

    // Function to reset all screen states to default
    function resetScreenToDefault(screenName) {
        console.log(`Resetting ${screenName} screen to default state`);
        
        // Reset scroll position to top
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });

        switch(screenName) {
            case 'wallet':
                resetWalletScreen();
                break;
            case 'ambulance':
                resetAmbulanceScreen();
                break;
            case 'blood-bank':
                resetBloodBankScreen();
                break;
            case 'private-hospital':
                resetPrivateHospitalScreen();
                break;
            case 'search':
                resetSearchScreen();
                break;
            case 'doctor-details':
                resetDoctorDetailsScreen();
                break;
            case 'profile':
                resetProfileScreen();
                break;
            case 'specialist':
                resetSpecialistScreen();
                break;
            case 'hospital-booking':
                resetHospitalBookingScreen();
                break;
            case 'patient-details':
                resetPatientDetailsScreen();
                break;
            case 'select-datetime':
                resetSelectDateTimeScreen();
                break;
            case 'select-payment-method':
                resetSelectPaymentMethodScreen();
                break;
            case 'bkash-send-money':
                resetBkashSendMoneyScreen();
                break;
            case 'home':
                resetHomeScreen();
                break;
            // Add other screens as needed
        }
    }

    // Individual screen reset functions
    function resetHomeScreen() {
        // Reset specialist slider to first page and ensure it's visible
        const specialistSlider = document.getElementById('specialist-slider');
        if (specialistSlider) {
            // Reset global variables
            currentSpecialistPage = 0;
            
            // Update slider transform and visibility
            updateSpecialistSlider();
            
            // Ensure the slider container is visible
            const sliderContainer = specialistSlider.closest('.specialist-slider-container');
            if (sliderContainer) {
                sliderContainer.style.display = 'block';
                sliderContainer.style.visibility = 'visible';
                sliderContainer.style.opacity = '1';
            }
            
            // Force a repaint to ensure visibility
            specialistSlider.style.display = 'flex';
            
            console.log('Home screen specialist slider reset to page 0');
        }
    }

    function resetWalletScreen() {
        // Reset to "My Point" tab
        const walletTabButtons = document.querySelectorAll('.tab-button');
        const walletTabContents = document.querySelectorAll('.tab-content');
        
        walletTabButtons.forEach(btn => btn.classList.remove('active'));
        walletTabContents.forEach(content => content.classList.remove('active'));
        
        const myPointTab = document.querySelector('.tab-button[data-tab="my-point"]');
        const myPointContent = document.getElementById('my-point-tab');
        
        if (myPointTab) myPointTab.classList.add('active');
        if (myPointContent) myPointContent.classList.add('active');
        
        // Reset history tabs to "All"
        const historyTabButtons = document.querySelectorAll('.history-tab-button');
        const historyTabContents = document.querySelectorAll('.history-tab-content');
        
        historyTabButtons.forEach(btn => btn.classList.remove('active'));
        historyTabContents.forEach(content => content.classList.remove('active'));
        
        const allHistoryTab = document.querySelector('.history-tab-button[data-history-tab="all"]');
        const allHistoryContent = document.getElementById('all-history');
        
        if (allHistoryTab) allHistoryTab.classList.add('active');
        if (allHistoryContent) allHistoryContent.classList.add('active');
    }

    function resetAmbulanceScreen() {
        // Reset to "Book Ambulance" tab
        const ambulanceTabButtons = document.querySelectorAll('.ambulance-tab-button');
        const ambulanceTabContents = document.querySelectorAll('.ambulance-tab-content');
        
        ambulanceTabButtons.forEach(btn => btn.classList.remove('active'));
        ambulanceTabContents.forEach(content => content.classList.remove('active'));
        
        const bookTab = document.querySelector('.ambulance-tab-button[data-ambulance-tab="book-ambulance"]');
        const bookContent = document.getElementById('book-ambulance-tab');
        
        if (bookTab) bookTab.classList.add('active');
        if (bookContent) bookContent.classList.add('active');
        
        // Reset search form in nearby ambulance tab to default state
        const districtSelect = document.getElementById('ambulance-district');
        const upazilaSelect = document.getElementById('ambulance-upazila');
        const typeSelect = document.getElementById('ambulance-type-search');
        
        if (districtSelect) {
            districtSelect.value = '';
        }
        if (upazilaSelect) {
            upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
            upazilaSelect.value = '';
        }
        if (typeSelect) {
            typeSelect.value = '';
        }
        
        // Hide search results section
        const searchResultsSection = document.getElementById('ambulance-search-results');
        if (searchResultsSection) {
            searchResultsSection.style.display = 'none';
        }
        
        console.log('Resetting ambulance screen to default state');
    }

    function resetBloodBankScreen() {
        // Reset to "Need Blood" tab (already exists)
        if (typeof resetBloodBankTabsToDefault === 'function') {
            resetBloodBankTabsToDefault();
        }
    }

    function resetPrivateHospitalScreen() {
        // Reset to first tab (usually "Book Hospital")
        const hospitalTabButtons = document.querySelectorAll('.private-hospital-tab-button');
        const hospitalTabContents = document.querySelectorAll('.private-hospital-tab-content');
        
        hospitalTabButtons.forEach(btn => btn.classList.remove('active'));
        hospitalTabContents.forEach(content => content.classList.remove('active'));
        
        const firstTab = hospitalTabButtons[0];
        const firstContent = hospitalTabContents[0];
        
        if (firstTab) firstTab.classList.add('active');
        if (firstContent) firstContent.classList.add('active');
    }

    function resetSearchScreen() {
        // Clear search input and show all doctors
        const searchInput = document.getElementById('doctor-search-input');
        const clearBtn = document.getElementById('clear-search-btn');
        
        if (searchInput) {
            searchInput.value = '';
            if (clearBtn) clearBtn.style.display = 'none';
        }
        
        // Re-initialize search screen if function exists
        if (typeof initializeSearchScreen === 'function') {
            initializeSearchScreen();
        }
    }

    function resetDoctorDetailsScreen() {
        // Reset to "About" tab
        const doctorTabButtons = document.querySelectorAll('.doctor-tab-button');
        const doctorTabContents = document.querySelectorAll('.doctor-tab-content');
        
        doctorTabButtons.forEach(btn => btn.classList.remove('active'));
        doctorTabContents.forEach(content => content.classList.remove('active'));
        
        const aboutTab = document.querySelector('.doctor-tab-button[data-doctor-tab="about"]');
        const aboutContent = document.getElementById('about-doctor-tab');
        
        if (aboutTab) aboutTab.classList.add('active');
        if (aboutContent) aboutContent.classList.add('active');
    }

    function resetProfileScreen() {
        // Close any open modals and reset profile view to default
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    function resetSpecialistScreen() {
        // Reset specialist slider to first page if it exists
        const specialistPages = document.querySelectorAll('.specialist-page');
        const dots = document.querySelectorAll('.dot');
        
        specialistPages.forEach(page => page.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (specialistPages[0]) specialistPages[0].classList.add('active');
        if (dots[0]) dots[0].classList.add('active');
    }

    function resetHospitalBookingScreen() {
        // Clear hospital booking form
        const hospitalForm = document.getElementById('hospital-booking-form');
        if (hospitalForm) {
            hospitalForm.reset();
        }
    }

    function resetPatientDetailsScreen() {
        // Clear patient details form
        clearPatientDetailsForm();
    }

    function resetSelectDateTimeScreen() {
        // Reset date and time selections
        const selectedDate = document.querySelector('.date-option.selected');
        const selectedTime = document.querySelector('.time-option.selected');
        
        if (selectedDate) selectedDate.classList.remove('selected');
        if (selectedTime) selectedTime.classList.remove('selected');
        
        // Reset availability display if function exists
        if (typeof initializeAvailabilityDisplay === 'function') {
            initializeAvailabilityDisplay();
        }
    }
    
    function resetSelectPaymentMethodScreen() {
        // Clear any persisted payment method state that might contain invalid methods
        const savedPaymentMethod = PaymentSystem.getPaymentMethod();
        const ALLOWED_METHODS = ['bkash', 'bkash-send-money'];
        
        if (savedPaymentMethod && !ALLOWED_METHODS.includes(savedPaymentMethod)) {
            PaymentSystem.clearPaymentMethod();
            console.log('Removed invalid payment method from memory:', savedPaymentMethod);
        }
        
        // Ensure bkash is selected by default (first available option)
        const bkashOption = document.querySelector('input[name="paymentMethod"][value="bkash"]');
        if (bkashOption) {
            bkashOption.checked = true;
            console.log('Payment method reset to default: bkash');
        }
    }

    function resetBkashSendMoneyScreen() {
        // Clear the bKash confirmation form
        const bkashForm = document.getElementById('bkash-confirmation-form');
        if (bkashForm) {
            bkashForm.reset();
        }
        
        
        console.log('bKash Send Money screen reset to default state');
    }

    // Store the previous screen when switching
    const originalSwitchScreen = switchScreen;
    switchScreen = function(targetScreen) {
        const currentActiveScreen = document.querySelector('.screen.active');
        if (currentActiveScreen) {
            const currentScreenName = currentActiveScreen.id.replace('-screen', '');

            // Don't add to history if it's the same screen
            if (currentScreenName !== targetScreen) {
                screenHistory.push(currentScreenName);

                // Keep history manageable
                if (screenHistory.length > maxHistoryLength) {
                    screenHistory = screenHistory.slice(-maxHistoryLength);
                }
            }
        }

        // Reset the target screen to default state before showing it
        resetScreenToDefault(targetScreen);

        // Update profile card when switching to profile screen
        if (targetScreen === 'profile') {
            const currentUser = AuthSystem.getUser();
            if (currentUser) {
                AuthSystem.updateProfileCard(currentUser);
            }
        }

        originalSwitchScreen(targetScreen);
        console.log(`Navigation history:`, screenHistory);
    };

    // Function to clear patient details form
    function clearPatientDetailsForm() {
        const patientForm = document.getElementById('patient-details-form');
        if (patientForm) {
            patientForm.reset();
            console.log('Patient details form cleared');
        }
    }

    // Back button functionality
    window.goBackToPreviousScreen = function() {
        // Get current active screen before going back
        const currentActiveScreen = document.querySelector('.screen.active');
        const currentScreenName = currentActiveScreen ? currentActiveScreen.id.replace('-screen', '') : null;
        
        // Clear patient details form if navigating away from patient details screen
        if (currentScreenName === 'patient-details') {
            clearPatientDetailsForm();
        }

        // Special handling for Hospital booking details screen - always go back to hospital booking screen
        if (currentScreenName === 'hospital-booking-details') {
            originalSwitchScreen('hospital-booking');
            console.log('Going back to hospital booking screen from hospital booking details');
            // Scroll to top when going back
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
            return;
        }

        if (screenHistory.length > 0) {
            const previousScreen = screenHistory.pop();

            // Use original function to avoid adding to history again
            originalSwitchScreen(previousScreen);
            console.log(`Going back to: ${previousScreen}`);
            console.log(`Remaining history:`, screenHistory);
        } else {
            // Default fallback
            originalSwitchScreen('home');
            console.log('No history available, going to home');
        }

        // Scroll to top when going back
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    };

    // Hero Banner Image Slider (only works on home screen)
    let heroSliderInterval = null;
    let currentSlide = 0;

    window.initializeHeroSlider = function() {
        const slides = document.querySelectorAll('.slide');
        
        if (heroSliderInterval) {
            clearInterval(heroSliderInterval);
            heroSliderInterval = null;
        }

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            if (slides[index]) {
                slides[index].classList.add('active');
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        if (slides.length > 0) {
            currentSlide = 0;
            showSlide(currentSlide);
            heroSliderInterval = setInterval(nextSlide, 5000);
            console.log('Hero slider initialized with', slides.length, 'slides');
        }
    };

    window.initializeHeroSlider();

    // Sponsor slider functionality
    const sponsorSlides = document.querySelectorAll('.sponsor-slide');
    let currentSponsorSlide = 0;

    function showSponsorSlide(index) {
        sponsorSlides.forEach(slide => slide.classList.remove('active'));
        if (sponsorSlides[index]) {
            sponsorSlides[index].classList.add('active');
        }
    }

    function nextSponsorSlide() {
        currentSponsorSlide = (currentSponsorSlide + 1) % sponsorSlides.length;
        showSponsorSlide(currentSponsorSlide);
    }

    // Auto-advance sponsor slides every 8 seconds
    if (sponsorSlides.length > 0) {
        setInterval(nextSponsorSlide, 8000);
        console.log('Sponsor slider initialized with', sponsorSlides.length, 'slides');
    }

    // Emergency service cards click handlers
    const emergencyCards = document.querySelectorAll('.emergency-card');
    emergencyCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceElement = this.querySelector('span');
            if (serviceElement) {
                const service = serviceElement.textContent;
                console.log(`${service} clicked`);

                // Navigate to blood bank screen if blood bank is clicked
                if (service.toLowerCase().includes('blood bank')) {
                    switchScreen('blood-bank');
                    // Initialize blood bank screen after a small delay
                    setTimeout(() => {
                        initializeBloodBankScreen();
                    }, 100);
                }

                // Navigate to ambulance screen if ambulance is clicked
                if (service.toLowerCase().includes('ambulance')) {
                    switchScreen('ambulance');
                    // Initialize ambulance screen after a small delay
                    setTimeout(() => {
                        initializeAmbulanceScreen();
                    }, 100);
                }

                // Navigate to private hospital screen if private hospital is clicked
                if (service.toLowerCase().includes('private hospital')) {
                    switchScreen('private-hospital');
                    // Initialize private hospital screen after a small delay
                    setTimeout(() => {
                        initializePrivateHospitalScreen();
                    }, 100);
                }

                // Navigate to pharmacy screen if pharmacy is clicked
                if (service.toLowerCase().includes('pharmacy')) {
                    switchScreen('pharmacy');
                    // Initialize pharmacy screen after a small delay
                    setTimeout(() => {
                        initializePharmacyScreen();
                    }, 100);
                }
            }
        });
    });

    // Specialist category click handlers
    const specialistItems = document.querySelectorAll('.specialist-item');
    specialistItems.forEach(item => {
        item.addEventListener('click', function() {
            const specialtyElement = this.querySelector('span');
            if (specialtyElement) {
                const specialty = specialtyElement.textContent.toLowerCase();
                console.log(`${specialty} specialist clicked`);

                // Map display text to category keys
                const categoryMap = {
                    'cardiac': 'cardiology',
                    'oncology': 'oncology',
                    'pulmonol.': 'pulmonology',
                    'pediatric': 'pediatrics',
                    'dentists': 'dentists',
                    'neurolog.': 'neurology',
                    'orthoped.': 'orthopedics',
                    'gynecolo.': 'gynecology',
                    'dermatol.': 'dermatology',
                    'endocrin.': 'endocrinology',
                    'gastro.': 'gastroenterology',
                    'urology': 'urology',
                    'ophthalm.': 'ophthalmology',
                    'ent': 'ent',
                    'psychiatry': 'psychiatry',
                    'surgery': 'surgery',
                    'nephrol.': 'nephrology',
                    'rheumat.': 'rheumatology',
                    'anesthes.': 'anesthesiology',
                    'pathology': 'pathology',
                    'plastic': 'plastic-surgery',
                    'emergency': 'medicine',
                    'medicine': 'medicine',
                    'physio.': 'physiotherapy',
                    'nutrition': 'nutrition'
                };

                const categoryKey = categoryMap[specialty];
                if (categoryKey) {
                    // Initialize specialist category screen
                    initializeSpecialistCategoryScreen(categoryKey);

                    // Switch to specialist category screen
                    switchScreen('specialist-category');
                }
            }
        });
    });

    // Function to initialize specialist category screen
    function initializeSpecialistCategoryScreen(categoryKey) {
        const config = categoryConfig[categoryKey];
        if (!config) {
            console.error(`Category configuration not found for: ${categoryKey}`);
            return;
        }

        // Update hero banner title and subtitle
        const titleElement = document.getElementById('specialist-category-title');
        const subtitleElement = document.getElementById('specialist-category-subtitle');

        if (titleElement) {
            titleElement.textContent = config.title;
        }

        if (subtitleElement) {
            subtitleElement.textContent = config.subtitle;
        }

        // Filter doctors by category
        const categoryDoctors = doctorsDatabase.filter(doctor => doctor.category === categoryKey);

        // Display doctors for this category
        displaySpecialistCategoryDoctors(categoryDoctors);

        console.log(`Specialist category screen initialized for: ${config.title}`);
        console.log(`Found ${categoryDoctors.length} doctors for this category`);
    }

    // Function to display doctors in specialist category screen
    function displaySpecialistCategoryDoctors(doctors) {
        const doctorsList = document.getElementById('specialist-doctors-list');
        const emptyState = document.getElementById('specialist-category-empty-state');

        if (!doctorsList || !emptyState) return;

        // Clear existing doctors
        doctorsList.innerHTML = '';

        if (doctors.length === 0) {
            // Show empty state
            doctorsList.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            // Show doctors list
            doctorsList.style.display = 'flex';
            emptyState.style.display = 'none';

            // Sort doctors by rating before displaying
            const sortedDoctors = sortDoctorsByRating([...doctors]);

            // Create doctor cards
            sortedDoctors.forEach(doctor => {
                const doctorCard = document.createElement('div');
                doctorCard.className = 'doctor-card';

                doctorCard.innerHTML = `
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-photo">
                    <div class="doctor-info">
                        <h3>${doctor.name}</h3>
                        <p>${getCategoryWithBangla(doctor.specialty)}</p>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${doctor.rating} (${doctor.reviews})</span>
                        </div>
                    </div>
                    <i class="far fa-heart favorite-icon"></i>
                `;

                // Add click listener for doctor card
                doctorCard.addEventListener('click', async function(e) {
                    // Don't trigger if favorite icon is clicked
                    if (e.target.classList.contains('favorite-icon')) {
                        return;
                    }

                    // Update doctor details screen with clicked doctor's info
                    await updateDoctorDetailsScreen(doctor.name, doctor.specialty, doctor.image);

                    // Switch to doctor details screen
                    switchScreen('doctor-details');
                    console.log(`${doctor.name} profile clicked from specialist category`);
                });

                doctorsList.appendChild(doctorCard);
            });

            // Re-setup favorite icons after creating new cards
            setTimeout(() => {
                setupFavoriteIcons();
            }, 100);
        }
    }

    // Specialist Category Slider Functionality
    let currentSpecialistPage = 0;
    const totalSpecialistPages = 3;
    let specialistStartX = 0;
    let specialistStartY = 0;
    let specialistCurrentX = 0;
    let specialistCurrentY = 0;
    let specialistIsDragging = false;
    let specialistIsHorizontalSwipe = false;

    const specialistSlider = document.getElementById('specialist-slider');
    const specialistPages = document.querySelectorAll('.specialist-page');
    const specialistDots = document.querySelectorAll('.pagination-dots .dot');

    function updateSpecialistSlider() {
        if (specialistSlider) {
            const translateX = -currentSpecialistPage * (100 / totalSpecialistPages);
            specialistSlider.style.transform = `translateX(${translateX}%)`;

            // Update page visibility
            specialistPages.forEach((page, index) => {
                page.classList.toggle('active', index === currentSpecialistPage);
            });

            // Update dots
            specialistDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSpecialistPage);
            });
        }
    }

    // Touch events for mobile
    if (specialistSlider) {
        specialistSlider.addEventListener('touchstart', function(e) {
            specialistStartX = e.touches[0].clientX;
            specialistStartY = e.touches[0].clientY;
            specialistIsDragging = true;
            specialistIsHorizontalSwipe = false;
        }, { passive: true });

        specialistSlider.addEventListener('touchmove', function(e) {
            if (!specialistIsDragging) return;
            
            specialistCurrentX = e.touches[0].clientX;
            specialistCurrentY = e.touches[0].clientY;
            
            const deltaX = Math.abs(specialistCurrentX - specialistStartX);
            const deltaY = Math.abs(specialistCurrentY - specialistStartY);
            
            // Determine if this is primarily a horizontal or vertical movement
            if (deltaX > 10 || deltaY > 10) { // Start checking after minimum movement
                if (deltaX > deltaY) {
                    // Horizontal movement dominates - handle as swipe
                    specialistIsHorizontalSwipe = true;
                    e.preventDefault(); // Prevent vertical scrolling
                } else {
                    // Vertical movement dominates - allow vertical scrolling
                    specialistIsDragging = false;
                    return;
                }
            }
        });

        specialistSlider.addEventListener('touchend', function(e) {
            if (!specialistIsDragging || !specialistIsHorizontalSwipe) {
                specialistIsDragging = false;
                specialistIsHorizontalSwipe = false;
                return;
            }
            
            specialistIsDragging = false;
            specialistIsHorizontalSwipe = false;

            const diffX = specialistStartX - specialistCurrentX;
            const threshold = 50; // Minimum swipe distance

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0 && currentSpecialistPage < totalSpecialistPages - 1) {
                    // Swipe left - next page
                    currentSpecialistPage++;
                } else if (diffX < 0 && currentSpecialistPage > 0) {
                    // Swipe right - previous page
                    currentSpecialistPage--;
                }
                updateSpecialistSlider();
            }
        });

        // Mouse events for desktop
        specialistSlider.addEventListener('mousedown', function(e) {
            specialistStartX = e.clientX;
            specialistIsDragging = true;
            specialistSlider.style.cursor = 'grabbing';
        });

        specialistSlider.addEventListener('mousemove', function(e) {
            if (!specialistIsDragging) return;
            e.preventDefault();
            specialistCurrentX = e.clientX;
        });

        specialistSlider.addEventListener('mouseup', function(e) {
            if (!specialistIsDragging) return;
            specialistIsDragging = false;
            specialistSlider.style.cursor = 'grab';

            const diffX = specialistStartX - specialistCurrentX;
            const threshold = 50; // Minimum drag distance

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0 && currentSpecialistPage < totalSpecialistPages - 1) {
                    // Drag left - next page
                    currentSpecialistPage++;
                } else if (diffX < 0 && currentSpecialistPage > 0) {
                    // Drag right - previous page
                    currentSpecialistPage--;
                }
                updateSpecialistSlider();
            }
        });

        specialistSlider.addEventListener('mouseleave', function() {
            if (specialistIsDragging) {
                specialistIsDragging = false;
                specialistSlider.style.cursor = 'grab';
            }
        });

        // Set initial cursor
        specialistSlider.style.cursor = 'grab';
    }

    // Pagination dots click functionality
    specialistDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSpecialistPage = index;
            updateSpecialistSlider();
            console.log(`Specialist page ${index + 1} selected`);
        });
    });

    // Initialize slider
    updateSpecialistSlider();

    // Doctor card click handlers
    const doctorCards = document.querySelectorAll('.doctor-card');
    doctorCards.forEach(card => {
        card.addEventListener('click', async function(e) {
            // Don't trigger if favorite icon is clicked
            if (e.target.classList.contains('favorite-icon')) {
                return;
            }
            const doctorNameElement = this.querySelector('h3');
            const doctorPhoto = this.querySelector('img');
            const doctorSpecialty = this.querySelector('p');

            if (doctorNameElement) {
                const doctorName = doctorNameElement.textContent;
                const doctorImageSrc = doctorPhoto ? doctorPhoto.src : '';
                const specialty = doctorSpecialty ? doctorSpecialty.textContent : '';

                // Store the current screen as previous before switching
                const currentActiveScreen = document.querySelector('.screen.active');
                if (currentActiveScreen) {
                    previousScreen = currentActiveScreen.id.replace('-screen', '');
                }

                // Update doctor details screen with clicked doctor's info
                await updateDoctorDetailsScreen(doctorName, specialty, doctorImageSrc);

                // Switch to doctor details screen
                switchScreen('doctor-details');
                console.log(`${doctorName} profile clicked`);
            }
        });
    });

    // Function to update doctor details screen
    async function updateDoctorDetailsScreen(name, specialty, imageSrc) {
        // Ensure doctors data is loaded
        if (!window.doctorsDatabase || window.doctorsDatabase.length === 0) {
            console.log('Doctors database not loaded, refreshing...');
            if (typeof window.refreshDoctorsData === 'function') {
                await window.refreshDoctorsData();
            }
        }
        
        // Find doctor from Supabase data
        const doctorsDatabase = window.doctorsDatabase || [];
        const currentDoctor = doctorsDatabase.find(doc => doc.name === name);
        
        // Update hero image
        const heroImg = document.getElementById('doctor-hero-img');
        if (heroImg) {
            heroImg.src = (currentDoctor && currentDoctor.image) || imageSrc || 'https://via.placeholder.com/150';
            heroImg.alt = name;
        }

        // Update doctor name
        const doctorNameEl = document.getElementById('doctor-name');
        if (doctorNameEl) {
            doctorNameEl.textContent = name;
        }

        // Update doctor category
        const doctorCategoryEl = document.getElementById('doctor-category');
        if (doctorCategoryEl) {
            const categoryText = (currentDoctor && currentDoctor.specialty) || specialty;
            doctorCategoryEl.textContent = getCategoryWithBangla(categoryText);
            // Store raw specialty in data attribute for booking purposes
            doctorCategoryEl.setAttribute('data-specialty', categoryText);
        }

        // Update doctor status based on doctor data
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        const inactivityReasonBox = document.querySelector('.inactivity-reason-box');
        const bookAppointmentBtns = document.querySelectorAll('.book-appointment-btn');
        
        const doctorStatus = (currentDoctor && currentDoctor.status) || 'active';

        if (statusIndicator && statusText) {
            if (doctorStatus === 'inactive') {
                statusIndicator.classList.remove('active');
                statusIndicator.classList.add('inactive');
                statusText.textContent = 'Inactive';
                statusText.style.color = '#E53935';

                // Show inactivity reason box if reason exists
                if (inactivityReasonBox && currentDoctor && currentDoctor.inactiveReason) {
                    inactivityReasonBox.style.display = 'block';
                    const reasonTitle = inactivityReasonBox.querySelector('.reason-title');
                    const reasonDetails = inactivityReasonBox.querySelector('.reason-details');
                    const returnDateText = inactivityReasonBox.querySelector('.return-date');
                    
                    if (reasonTitle) reasonTitle.textContent = currentDoctor.inactiveReason || 'On Leave';
                    if (reasonDetails) reasonDetails.textContent = currentDoctor.inactiveDetails || 'The doctor is currently unavailable.';
                    if (returnDateText && currentDoctor.returnDate) {
                        returnDateText.textContent = `Expected Return: ${currentDoctor.returnDate}`;
                    }
                } else if (inactivityReasonBox) {
                    inactivityReasonBox.style.display = 'none';
                }

                // Disable book appointment buttons
                bookAppointmentBtns.forEach(btn => {
                    btn.disabled = true;
                    btn.textContent = 'Appointments Unavailable';
                    btn.style.background = 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)';
                    btn.style.color = '#9E9E9E';
                    btn.style.cursor = 'not-allowed';
                    btn.style.boxShadow = 'none';
                });
            } else {
                statusIndicator.classList.remove('inactive');
                statusIndicator.classList.add('active');
                statusText.textContent = 'Active';
                statusText.style.color = '#4CAF50';

                // Hide inactivity reason box
                if (inactivityReasonBox) {
                    inactivityReasonBox.style.display = 'none';
                }

                // Enable book appointment buttons
                bookAppointmentBtns.forEach(btn => {
                    btn.disabled = false;
                    btn.textContent = 'Book Appointment';
                    btn.style.background = 'linear-gradient(135deg, #673AB7 0%, #7E57C2 100%)';
                    btn.style.color = '#FFFFFF';
                    btn.style.cursor = 'pointer';
                    btn.style.boxShadow = '0 4px 15px rgba(103, 58, 183, 0.3)';
                });
            }
        }

        // Update doctor information from Supabase data
        if (currentDoctor) {
            // Update degree and workplace
            const doctorDegreeEl = document.getElementById('doctor-degree');
            const doctorWorkplaceEl = document.getElementById('doctor-workplace');

            if (doctorDegreeEl) {
                doctorDegreeEl.textContent = currentDoctor.degree || 'Medical Professional';
            }
            if (doctorWorkplaceEl) {
                doctorWorkplaceEl.textContent = currentDoctor.workplace || 'Healthcare Center';
            }

            // Update stats
            updateDoctorStats(
                currentDoctor.patients || '500+',
                currentDoctor.experience || '5+',
                currentDoctor.rating || '4.5',
                currentDoctor.reviews || '100'
            );

            // Update reviews section (from Supabase user_review field)
            const reviewsData = currentDoctor.userReview || [];
            updateDoctorReviews(currentDoctor.rating || '4.5', currentDoctor.reviews || '100', reviewsData);

            // Update about doctor description
            const doctorDescription = document.getElementById('doctor-description');
            if (doctorDescription) {
                doctorDescription.textContent = currentDoctor.about || `${name} is a dedicated medical professional with extensive experience in ${specialty}.`;
                // Reset to collapsed state
                doctorDescription.classList.remove('expanded');
                doctorDescription.classList.add('collapsed');
                const viewMoreBtn = document.getElementById('view-more-btn');
                if (viewMoreBtn) {
                    viewMoreBtn.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
                    viewMoreBtn.classList.remove('expanded');
                }
            }
            
            // Update visiting days
            updateVisitingDays(currentDoctor.visitingDays || [], currentDoctor.offDays || []);
            
            // Update visiting time
            updateVisitingTime(currentDoctor.visitingTime || '09:00 AM - 05:00 PM');
            
            // Update chamber address
            updateChamberAddress(currentDoctor.chamberAddress || 'Address not available', currentDoctor.locationDetails);
            
            // Update health tips FAQ
            updateHealthTipsFAQ(currentDoctor.healthTips || []);
        } else {
            // Fallback for unknown doctors
            const doctorDegreeEl = document.getElementById('doctor-degree');
            const doctorWorkplaceEl = document.getElementById('doctor-workplace');

            if (doctorDegreeEl) {
                doctorDegreeEl.textContent = 'Medical Professional';
            }
            if (doctorWorkplaceEl) {
                doctorWorkplaceEl.textContent = 'Healthcare Center';
            }

            updateDoctorStats('500+', '5+', '4.5', '100');
            updateDoctorReviews('4.5', '100', []);

            // Update about doctor description with fallback text
            const doctorDescription = document.getElementById('doctor-description');
            if (doctorDescription) {
                doctorDescription.textContent = `${name} is a dedicated medical professional with extensive experience in ${specialty}.`;
                // Reset to collapsed state
                doctorDescription.classList.remove('expanded');
                doctorDescription.classList.add('collapsed');
                const viewMoreBtn = document.getElementById('view-more-btn');
                if (viewMoreBtn) {
                    viewMoreBtn.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
                    viewMoreBtn.classList.remove('expanded');
                }
            }
            
            // Default visiting days, time, and address
            updateVisitingDays([], []);
            updateVisitingTime('09:00 AM - 05:00 PM');
            updateChamberAddress('Address not available', null);
            
            // Update health tips FAQ with defaults
            updateHealthTipsFAQ([]);
        }

        // Re-setup favorite icons after updating doctor cards
        setTimeout(() => {
            setupFavoriteIcons();
        }, 100);
    }

    // Function to update doctor statistics
    function updateDoctorStats(patients, experience, rating, reviews) {
        const statsElements = {
            patients: document.querySelector('.stat-item .stat-value'),
            experience: document.querySelectorAll('.stat-item .stat-value')[1],
            rating: document.querySelectorAll('.stat-item .stat-value')[2],
            reviews: document.querySelectorAll('.stat-item .stat-value')[3]
        };

        if (statsElements.patients) statsElements.patients.textContent = patients;
        if (statsElements.experience) statsElements.experience.textContent = experience;
        if (statsElements.rating) statsElements.rating.textContent = rating;
        if (statsElements.reviews) statsElements.reviews.textContent = reviews;
    }
    
    // Function to update visiting days
    function updateVisitingDays(visitingDays, offDays) {
        const daysGrid = document.querySelector('.visiting-day-card .days-grid');
        if (!daysGrid) return;
        
        const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        daysGrid.innerHTML = '';
        
        allDays.forEach(day => {
            const dayItem = document.createElement('div');
            dayItem.className = 'day-item';
            dayItem.textContent = day;
            
            if (visitingDays.length > 0) {
                if (visitingDays.includes(day)) {
                    dayItem.classList.add('active');
                } else {
                    dayItem.classList.add('off');
                }
            } else if (offDays.includes(day)) {
                dayItem.classList.add('off');
            }
            
            daysGrid.appendChild(dayItem);
        });
    }
    
    // Function to update visiting time
    function updateVisitingTime(visitingTime) {
        const timeStartEl = document.querySelector('.visiting-time-card .time-start');
        const timeEndEl = document.querySelector('.visiting-time-card .time-end');
        
        if (timeStartEl && timeEndEl && visitingTime) {
            const timeParts = visitingTime.split('-').map(t => t.trim());
            if (timeParts.length === 2) {
                timeStartEl.textContent = timeParts[0];
                timeEndEl.textContent = timeParts[1];
            } else {
                timeStartEl.textContent = visitingTime;
                timeEndEl.textContent = '';
            }
        }
    }
    
    // Function to update chamber address
    function updateChamberAddress(chamberAddress, locationDetails) {
        const addressInfo = document.querySelector('.chamber-address-card .address-info');
        if (!addressInfo) return;
        
        if (chamberAddress && chamberAddress !== 'Address not available') {
            const addressLines = chamberAddress.split(',').map(line => line.trim());
            const locationInfo = locationDetails || 'Location details not available';
            
            if (addressLines.length > 0) {
                addressInfo.innerHTML = `
                    <h4>${addressLines[0]}</h4>
                    <p>${addressLines.slice(1).join(', ')}</p>
                    <p style="margin-top: 8px; color: #757575; font-size: 14px;">${locationInfo}</p>
                `;
            } else {
                addressInfo.innerHTML = `
                    <h4>Chamber Address</h4>
                    <p>${chamberAddress}</p>
                    <p style="margin-top: 8px; color: #757575; font-size: 14px;">${locationInfo}</p>
                `;
            }
        } else {
            addressInfo.innerHTML = `
                <h4>Chamber Address</h4>
                <p>Address not available</p>
            `;
        }
    }

    // Function to update health tips FAQ section
    function updateHealthTipsFAQ(healthTips) {
        const faqContainer = document.querySelector('.faq-container');
        if (!faqContainer) return;
        
        const defaultHealthTips = [
            {
                question: 'How often should I visit a doctor?',
                answer: 'For healthy adults, an annual check-up is generally recommended. However, if you have chronic conditions like diabetes, heart disease, or high blood pressure, you may need more frequent visits every 3-6 months. Always consult your healthcare provider for personalized advice based on your health status.'
            },
            {
                question: 'What should I bring to my appointment?',
                answer: 'Bring your insurance card, a list of current medications, previous test results, and a list of questions you want to ask. If it\'s your first visit, bring your medical history and any relevant family health history. Don\'t forget to mention any allergies or adverse reactions to medications.'
            },
            {
                question: 'How can I maintain good heart health?',
                answer: 'Maintain a balanced diet rich in fruits, vegetables, and whole grains. Exercise regularly for at least 30 minutes daily. Avoid smoking and limit alcohol consumption. Manage stress through relaxation techniques. Monitor your blood pressure and cholesterol levels regularly, and maintain a healthy weight.'
            },
            {
                question: 'What are the warning signs I shouldn\'t ignore?',
                answer: 'Seek immediate medical attention for chest pain, difficulty breathing, sudden severe headache, persistent high fever, unexplained weight loss, changes in vision, severe abdominal pain, or any symptoms that worsen rapidly. Trust your instincts - if something feels seriously wrong, don\'t hesitate to seek help.'
            },
            {
                question: 'How can I boost my immune system naturally?',
                answer: 'Get adequate sleep (7-9 hours nightly), eat a variety of colorful fruits and vegetables, exercise regularly, manage stress, stay hydrated, and maintain good hygiene. Consider supplements like vitamin D and zinc if recommended by your doctor. Avoid excessive alcohol and smoking.'
            },
            {
                question: 'What lifestyle changes can prevent diabetes?',
                answer: 'Maintain a healthy weight, eat a balanced diet low in processed sugars and refined carbs, exercise regularly, limit portion sizes, and avoid sugary drinks. Include fiber-rich foods, lean proteins, and healthy fats in your diet. Regular health screenings can help detect early signs of diabetes.'
            },
            {
                question: 'How can I improve my mental health?',
                answer: 'Practice mindfulness and meditation, maintain social connections, engage in regular physical activity, get enough sleep, eat a balanced diet, limit alcohol and avoid drugs. Don\'t hesitate to seek professional help when needed. Consider therapy, support groups, or counseling services.'
            }
        ];
        
        const tipsToDisplay = (healthTips && healthTips.length > 0) ? healthTips : defaultHealthTips;
        
        faqContainer.innerHTML = '';
        
        tipsToDisplay.forEach((tip, index) => {
            const faqId = `faq${index + 1}`;
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <div class="faq-question" data-faq="${faqId}">
                    <span>${tip.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer" id="${faqId}">
                    <p>${tip.answer}</p>
                </div>
            `;
            faqContainer.appendChild(faqItem);
        });
        
        setTimeout(() => {
            document.querySelectorAll('.faq-question').forEach(question => {
                question.addEventListener('click', function() {
                    const faqId = this.getAttribute('data-faq');
                    const answer = document.getElementById(faqId);
                    const icon = this.querySelector('i');
                    
                    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
                        answer.style.maxHeight = '0px';
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        document.querySelectorAll('.faq-answer').forEach(ans => {
                            ans.style.maxHeight = '0px';
                        });
                        document.querySelectorAll('.faq-question i').forEach(ic => {
                            ic.style.transform = 'rotate(0deg)';
                        });
                        
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        icon.style.transform = 'rotate(180deg)';
                    }
                });
            });
        }, 100);
    }

    // Function to toggle doctor description
    window.toggleDoctorDescription = function() {
        const description = document.getElementById('doctor-description');
        const viewMoreBtn = document.getElementById('view-more-btn');

        if (description && viewMoreBtn) {
            if (description.classList.contains('collapsed')) {
                // Expand
                description.classList.remove('collapsed');
                description.classList.add('expanded');
                viewMoreBtn.innerHTML = 'View Less <i class="fas fa-chevron-up"></i>';
                viewMoreBtn.classList.add('expanded');
            } else {
                // Collapse
                description.classList.remove('expanded');
                description.classList.add('collapsed');
                viewMoreBtn.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
                viewMoreBtn.classList.remove('expanded');
            }
        }
    };

    // Function to update doctor reviews
    function updateDoctorReviews(rating, totalReviews, reviewsData) {
        // Update overall rating in reviews tab
        const ratingScore = document.querySelector('.rating-score');
        const totalReviewsEl = document.querySelector('.total-reviews');

        if (ratingScore) ratingScore.textContent = rating;
        if (totalReviewsEl) totalReviewsEl.textContent = `${totalReviews} Reviews`;

        // Update rating breakdown based on rating
        const ratingValue = parseFloat(rating);
        const reviewCount = parseInt(totalReviews);

        // Calculate realistic rating distribution based on average rating
        let breakdown = {};
        
        if (ratingValue >= 4.8) {
            // For very high ratings (4.8-5.0)
            breakdown = {
                5: Math.floor(reviewCount * 0.85),
                4: Math.floor(reviewCount * 0.12),
                3: Math.floor(reviewCount * 0.02),
                2: Math.floor(reviewCount * 0.005),
                1: Math.floor(reviewCount * 0.005)
            };
        } else if (ratingValue >= 4.5) {
            // For high ratings (4.5-4.79)
            breakdown = {
                5: Math.floor(reviewCount * 0.70),
                4: Math.floor(reviewCount * 0.22),
                3: Math.floor(reviewCount * 0.05),
                2: Math.floor(reviewCount * 0.02),
                1: Math.floor(reviewCount * 0.01)
            };
        } else if (ratingValue >= 4.0) {
            // For good ratings (4.0-4.49)
            breakdown = {
                5: Math.floor(reviewCount * 0.55),
                4: Math.floor(reviewCount * 0.30),
                3: Math.floor(reviewCount * 0.10),
                2: Math.floor(reviewCount * 0.03),
                1: Math.floor(reviewCount * 0.02)
            };
        } else if (ratingValue >= 3.5) {
            // For average ratings (3.5-3.99)
            breakdown = {
                5: Math.floor(reviewCount * 0.35),
                4: Math.floor(reviewCount * 0.30),
                3: Math.floor(reviewCount * 0.20),
                2: Math.floor(reviewCount * 0.10),
                1: Math.floor(reviewCount * 0.05)
            };
        } else {
            // For lower ratings (below 3.5)
            breakdown = {
                5: Math.floor(reviewCount * 0.20),
                4: Math.floor(reviewCount * 0.25),
                3: Math.floor(reviewCount * 0.25),
                2: Math.floor(reviewCount * 0.20),
                1: Math.floor(reviewCount * 0.10)
            };
        }
        
        // Ensure the total adds up by adjusting the most common rating
        const total = breakdown[5] + breakdown[4] + breakdown[3] + breakdown[2] + breakdown[1];
        const difference = reviewCount - total;
        if (difference !== 0) {
            // Add the difference to 5-star reviews for high ratings
            breakdown[5] += difference;
        }

        // Update rating bars
        const ratingRows = document.querySelectorAll('.rating-row');
        ratingRows.forEach((row, index) => {
            const starNumber = 5 - index;
            const countEl = row.querySelector('.rating-count');
            const fillEl = row.querySelector('.rating-fill');
            const count = breakdown[starNumber] || 0;
            const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

            if (countEl) countEl.textContent = count;
            if (fillEl) fillEl.style.width = `${percentage}%`;
        });

        // Update individual reviews from Supabase user_review field
        const reviewsList = document.querySelector('.reviews-list');
        if (reviewsList) {
            reviewsList.innerHTML = '';

            if (reviewsData && reviewsData.length > 0) {
                // Assign random dates within past 2 months to each review and sort by date
                const reviewsWithDates = reviewsData.map((review, index) => {
                    const maxDaysAgo = 60; // 2 months
                    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
                    const reviewDate = new Date();
                    reviewDate.setDate(reviewDate.getDate() - daysAgo);
                    
                    return {
                        ...review,
                        daysAgo: daysAgo,
                        reviewDate: reviewDate
                    };
                });
                
                // Sort by date - most recent first
                reviewsWithDates.sort((a, b) => a.daysAgo - b.daysAgo);
                
                reviewsWithDates.forEach(review => {
                    const reviewCard = document.createElement('div');
                    reviewCard.className = 'review-card';

                    const starsHtml = Array(review.rating || 5).fill('<i class="fas fa-star"></i>').join('');
                    
                    // Format date as "X days ago", "X weeks ago", etc.
                    let dateText = '';
                    if (review.daysAgo === 0) {
                        dateText = 'Today';
                    } else if (review.daysAgo === 1) {
                        dateText = 'Yesterday';
                    } else if (review.daysAgo < 7) {
                        dateText = `${review.daysAgo} days ago`;
                    } else if (review.daysAgo < 14) {
                        dateText = '1 week ago';
                    } else if (review.daysAgo < 21) {
                        dateText = '2 weeks ago';
                    } else if (review.daysAgo < 28) {
                        dateText = '3 weeks ago';
                    } else if (review.daysAgo < 45) {
                        dateText = '1 month ago';
                    } else {
                        dateText = '2 months ago';
                    }

                    reviewCard.innerHTML = `
                        <div class="review-header">
                            <div class="reviewer-info">
                                <h4>${review.reviewerName || 'Anonymous'}</h4>
                                <div class="review-stars">
                                    ${starsHtml}
                                </div>
                            </div>
                            <span class="review-date">${dateText}</span>
                        </div>
                        <p class="review-text">${review.reviewText || ''}</p>
                    `;

                    reviewsList.appendChild(reviewCard);
                });
            } else {
                // Show empty state when no reviews exist
                reviewsList.innerHTML = '<p style="text-align: center; color: #9E9E9E; padding: 20px;">No reviews yet</p>';
            }
        }
    }

    // Favorite icon toggle and setup for favorites screen
    function setupFavoriteIcons() {
        const favoriteIcons = document.querySelectorAll('.favorite-icon');
        favoriteIcons.forEach(icon => {
            const doctorCard = icon.closest('.doctor-card');
            const doctorName = doctorCard ? doctorCard.querySelector('h3').textContent : null;

            // Remove any existing event listeners
            icon.replaceWith(icon.cloneNode(true));
            const newIcon = doctorCard.querySelector('.favorite-icon');

            // Initialize icon state from favorites system
            if (doctorName && FavoritesSystem.isFavorite(doctorName)) {
                newIcon.classList.add('fas');
                newIcon.classList.remove('far');
                newIcon.style.color = '#E53935';
            } else {
                newIcon.classList.add('far');
                newIcon.classList.remove('fas');
                newIcon.style.color = '#BDBDBD';
            }

            newIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                const doctorCard = this.closest('.doctor-card');
                const doctorName = doctorCard ? doctorCard.querySelector('h3').textContent : null;

                if (doctorName) {
                    const isCurrentlyFavorite = this.classList.contains('fas');

                    if (isCurrentlyFavorite) {
                        // Show confirmation popup for unfavoriting
                        showUnfavoriteConfirmation(doctorName, () => {
                            // User confirmed removal
                            this.classList.remove('fas');
                            this.classList.add('far');
                            this.style.color = '#BDBDBD';
                            FavoritesSystem.removeFavorite(doctorName);

                            // Update all favorite icons for this doctor across the app
                            updateAllFavoriteIcons(doctorName, false);
                            displayFavorites(); // Update favorites screen

                            console.log(`${doctorName} removed from favorites`);
                        });
                    } else {
                        // Add to favorites
                        this.classList.remove('far');
                        this.classList.add('fas');
                        this.style.color = '#E53935';
                        FavoritesSystem.addFavorite(doctorName);

                        // Update all favorite icons for this doctor across the app
                        updateAllFavoriteIcons(doctorName, true);
                        displayFavorites(); // Update favorites screen

                        // Add notification for favorite doctor
                        if (typeof addFavoriteNotification === 'function') {
                            addFavoriteNotification(doctorName);
                        }

                        console.log(`${doctorName} added to favorites`);
                    }
                }
            });
        });
    }

    // Function to update all favorite icons for a specific doctor
    function updateAllFavoriteIcons(doctorName, isFavorite) {
        const allFavoriteIcons = document.querySelectorAll('.favorite-icon');
        allFavoriteIcons.forEach(icon => {
            const card = icon.closest('.doctor-card');
            if (card) {
                const nameEl = card.querySelector('h3');
                if (nameEl && nameEl.textContent === doctorName) {
                    if (isFavorite) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = '#E53935';
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '#BDBDBD';
                    }
                }
            }
        });
    }

    // Function to show unfavorite confirmation popup
    function showUnfavoriteConfirmation(doctorName, onConfirm) {
        const popup = document.createElement('div');
        popup.className = 'popup-overlay active';
        popup.innerHTML = `
            <div class="popup-container unfavorite-popup">
                <div class="popup-content">
                    <div class="popup-icon unfavorite-icon">
                        <i class="fas fa-heart-broken"></i>
                    </div>
                    <h2>Remove from Favorites?</h2>
                    <p>Are you sure you want to remove <strong>${doctorName}</strong> from your favorites?</p>
                    <div class="popup-actions">
                        <button class="cancel-btn" onclick="closeUnfavoritePopup()">Cancel</button>
                        <button class="confirm-btn" onclick="confirmUnfavorite()">Remove</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';

        // Store the callback for global access
        window.unfavoriteCallback = onConfirm;

        // Close popup when clicking outside
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                closeUnfavoritePopup();
            }
        });

        console.log('Unfavorite confirmation popup shown for:', doctorName);
    }

    // Global functions for unfavorite popup
    window.closeUnfavoritePopup = function() {
        const popup = document.querySelector('.unfavorite-popup').closest('.popup-overlay');
        if (popup) {
            popup.remove();
            document.body.style.overflow = '';
            window.unfavoriteCallback = null;
        }
    };

    window.confirmUnfavorite = function() {
        if (window.unfavoriteCallback) {
            window.unfavoriteCallback();
            window.unfavoriteCallback = null;
        }
        closeUnfavoritePopup();
    };

    // Display favorites on the favorites screen
    function displayFavorites() {
        const favoritesScreen = document.getElementById('favorites-screen');
        if (!favoritesScreen) return;

        const favoritesList = document.getElementById('favorites-list');
        const favoritesEmptyState = document.getElementById('favorites-empty-state');

        if (!favoritesList || !favoritesEmptyState) return;

        favoritesList.innerHTML = ''; // Clear existing favorites

        let hasFavorites = false;

        // Check all doctors from the database
        doctorsDatabase.forEach(doctor => {
            if (FavoritesSystem.isFavorite(doctor.name)) {
                hasFavorites = true;

                // Create a doctor card for the favorites screen
                const favoriteCard = document.createElement('div');
                favoriteCard.className = 'doctor-card favorite-card';

                favoriteCard.innerHTML = `
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-photo">
                    <div class="doctor-info">
                        <h3>${doctor.name}</h3>
                        <p>${doctor.specialty}</p>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${doctor.rating} (${doctor.reviews})</span>
                        </div>
                    </div>
                    <i class="fas fa-heart favorite-icon" style="color: #E53935;"></i>
                `;

                // Add click listener to navigate to doctor details
                favoriteCard.addEventListener('click', async function(e) {
                    if (e.target.classList.contains('favorite-icon')) {
                        return; // Prevent navigation if favorite icon is clicked
                    }
                    await updateDoctorDetailsScreen(doctor.name, doctor.specialty, doctor.image);
                    switchScreen('doctor-details');
                });

                // Add listener to the favorite icon to remove from favorites
                const favoriteIcon = favoriteCard.querySelector('.favorite-icon');
                favoriteIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    FavoritesSystem.removeFavorite(doctor.name);

                    // Update all favorite icons in the app
                    const allFavoriteIcons = document.querySelectorAll('.favorite-icon');
                    allFavoriteIcons.forEach(icon => {
                        const card = icon.closest('.doctor-card');
                        if (card) {
                            const nameEl = card.querySelector('h3');
                            if (nameEl && nameEl.textContent === doctor.name) {
                                icon.classList.remove('fas');
                                icon.classList.add('far');
                                icon.style.color = '#BDBDBD';
                            }
                        }
                    });

                    displayFavorites(); // Re-render favorites
                });

                favoritesList.appendChild(favoriteCard);
            }
        });

        // Show/hide empty state
        if (hasFavorites) {
            favoritesList.style.display = 'flex';
            favoritesEmptyState.style.display = 'none';
        } else {
            favoritesList.style.display = 'none';
            favoritesEmptyState.style.display = 'flex';
        }
    }

    // Initialize favorite icons setup when the page loads
    setupFavoriteIcons();

    // Filter functionality for Top Now screen
    window.toggleFilterOptions = function() {
        // Simple toggle between sorting options
        const filterText = document.getElementById('filter-text');
        const topDoctorsList = document.querySelector('.top-doctors-list');

        if (!filterText || !topDoctorsList) return;

        const currentFilter = filterText.textContent;

        if (currentFilter === 'by Rating') {
            // Sort by rating (high to low)
            sortDoctorsByRating();
            filterText.textContent = 'by Rating';
        } else {
            // Reset to default order
            resetDoctorsOrder();
            filterText.textContent = 'by Rating';
        }

        console.log(`Filter changed to: ${filterText.textContent}`);
    };

    function sortDoctorsByRating() {
        const topDoctorsList = document.querySelector('.top-doctors-list');
        if (!topDoctorsList) return;

        const doctorCards = Array.from(topDoctorsList.querySelectorAll('.doctor-card'));

        // Sort cards by rating (extract rating from the rating span)
        doctorCards.sort((a, b) => {
            const ratingA = parseFloat(a.querySelector('.rating span').textContent.split(' ')[0]);
            const ratingB = parseFloat(b.querySelector('.rating span').textContent.split(' ')[0]);
            return ratingB - ratingA; // High to low
        });

        // Clear the list and re-append sorted cards
        topDoctorsList.innerHTML = '';
        doctorCards.forEach(card => {
            topDoctorsList.appendChild(card);
        });

        // Re-setup favorite icons after reordering
        setTimeout(() => {
            setupFavoriteIcons();
        }, 100);
    }

    function resetDoctorsOrder() {
        const topDoctorsList = document.querySelector('.top-doctors-list');
        if (!topDoctorsList) return;

        // Reset to rating-based order from doctorsDatabase
        topDoctorsList.innerHTML = '';

        // Filter doctors with 5.0 and 4.9 ratings only for Top Now screen
        const topRatedDoctors = doctorsDatabase.filter(doctor => {
            const rating = parseFloat(doctor.rating);
            return rating >= 4.9;
        });

        // Sort the filtered doctors by rating
        const sortedDoctors = sortDoctorsByRating([...topRatedDoctors]);

        sortedDoctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';

            doctorCard.innerHTML = `
                <img src="${doctor.image}" alt="${doctor.name}" class="doctor-photo">
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p>${doctor.specialty}</p>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${doctor.rating} (${doctor.reviews})</span>
                    </div>
                </div>
                <i class="far fa-heart favorite-icon"></i>
            `;

            // Add click listener for doctor card
            doctorCard.addEventListener('click', async function(e) {
                if (e.target.classList.contains('favorite-icon')) {
                    return;
                }
                await updateDoctorDetailsScreen(doctor.name, doctor.specialty, doctor.image);
                switchScreen('doctor-details');
                console.log(`${doctor.name} profile clicked from top now`);
            });

            topDoctorsList.appendChild(doctorCard);
        });

        // Re-setup favorite icons after recreating cards
        setTimeout(() => {
            setupFavoriteIcons();
        }, 100);
    }


    // Bottom navigation - instant screen switching
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const targetScreen = this.getAttribute('data-screen');
            if (targetScreen) {
                switchScreen(targetScreen);
                console.log(`Navigation: ${targetScreen}`);

                // Handle screen-specific initialization
                setTimeout(async () => {
                    if (targetScreen === 'favorites') {
                        displayFavorites();
                    } else if (targetScreen === 'search') {
                        initializeSearchScreen();
                    } else if (targetScreen === 'wallet') {
                        if (typeof window.userSupabaseHandlers !== 'undefined' && window.userSupabaseHandlers.syncPoints) {
                            await window.userSupabaseHandlers.syncPoints();
                        }
                        updateWalletPoints();
                    } else if (targetScreen === 'appointment') {
                        if (typeof window.userSupabaseHandlers !== 'undefined' && window.userSupabaseHandlers.syncAppointments) {
                            await window.userSupabaseHandlers.syncAppointments();
                        }
                        if (typeof PointsSystem !== 'undefined' && PointsSystem.updateAppointmentDisplay) {
                            await PointsSystem.updateAppointmentDisplay();
                        }
                    }
                }, 100);
            }
        });
    });



    // See All links
    const seeAllLinks = document.querySelectorAll('.see-all');
    seeAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('section');
            if (section) {
                console.log(`See all clicked for: ${section.className}`);

                // Navigate to specialist screen if it's the specialist category section (only on home screen)
                if (section.classList.contains('specialist-category')) {
                    const currentScreen = document.querySelector('.screen.active');
                    if (currentScreen && currentScreen.id === 'home-screen') {
                        switchScreen('specialist');
                    }
                }

                // Navigate to top-now screen if it's the top doctors section
                if (section.classList.contains('top-doctors')) {
                    switchScreen('top-now');
                }
            }
        });
    });

    // Header icon click handlers
    const searchIcons = document.querySelectorAll('.action-icons .fa-search');
    searchIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            console.log('Search clicked');
            switchScreen('search');
            // Initialize search after a small delay to ensure DOM is ready
            setTimeout(() => {
                initializeSearchScreen();
            }, 100);
        });
    });

    const favoriteHeaderIcons = document.querySelectorAll('.action-icons .fa-heart');
    favoriteHeaderIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            console.log('Favorites clicked');
            switchScreen('favorites'); // Navigate to favorites screen
            // Initialize favorites after a small delay to ensure DOM is ready
            setTimeout(() => {
                displayFavorites();
            }, 100);
        });
    });

    const notificationIcons = document.querySelectorAll('.action-icons .fa-bell, .notification-bell-container');
    notificationIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            console.log('Notifications clicked');
            switchScreen('notification');
        });
    });

    // Function to update notification dot visibility
    function updateNotificationDot() {
        // Get all notification dots across all screens
        const notificationDots = document.querySelectorAll('.notification-dot');
        const unreadCount = notifications.filter(n => n.isUnread).length;

        notificationDots.forEach(dot => {
            if (unreadCount > 0) {
                dot.classList.add('show');
            } else {
                dot.classList.remove('show');
            }
        });
    }

    // Notification System
    let notifications = [];
    let notificationIdCounter = 1;
    let notificationSelectionMode = false;
    let selectedNotifications = new Set();

    // Function to create notification
    async function createNotification(type, title, message, isUnread = true, requestId = null, requestType = null) {
        const notification = {
            id: notificationIdCounter++,
            type: type,
            title: title,
            message: message,
            isUnread: isUnread,
            timestamp: new Date(),
            timeAgo: 'Just now',
            requestId: requestId,
            requestType: requestType
        };

        // Save to database FIRST if user is logged in (to avoid race conditions)
        try {
            const currentUser = AuthSystem?.getUser();
            if (currentUser && currentUser.supabaseId && typeof window.dbService !== 'undefined' && window.dbService.addNotification) {
                const dbNotification = {
                    user_id: currentUser.supabaseId,
                    type: type,
                    title: title,
                    message: message,
                    is_read: !isUnread,
                    request_id: requestId,
                    request_type: requestType
                };
                
                // Await the database save to get supabaseId before displaying
                const savedNotification = await window.dbService.addNotification(dbNotification);
                notification.supabaseId = savedNotification.id;
                console.log('✅ Notification saved to database:', savedNotification.id);
            }
        } catch (error) {
            console.error('❌ Error saving notification to database:', error);
            // Continue anyway - notification will still be shown locally
        }

        // Add to local notifications array after database save completes
        notifications.unshift(notification);
        updateNotificationsDisplay();
        updateNotificationDot();
        updateUnreadCount();

        return notification;
    }

    // Make createNotification globally accessible
    window.createNotification = createNotification;

    // Function to get notification icon based on type
    function getNotificationIcon(type) {
        const icons = {
            'appointment': 'fas fa-calendar-check',
            'welcome': 'fas fa-hands-helping',
            'appointment-available': 'fas fa-clock',
            'favorite': 'fas fa-heart',
            'system': 'fas fa-info-circle',
            'reminder': 'fas fa-bell',
            'payment': 'fas fa-credit-card',
            'booking': 'fas fa-check-circle',
            'ambulance': 'fas fa-ambulance',
            'blood-bank': 'fas fa-hand-holding-heart',
            'profile': 'fas fa-user-edit',
            'settings': 'fas fa-cog',
            'points': 'fas fa-star',
            'redeem': 'fas fa-gift',
            'security': 'fas fa-shield-alt'
        };
        return icons[type] || 'fas fa-bell';
    }

    // Function to get notification icon class based on type
    function getNotificationIconClass(type) {
        const classes = {
            'appointment': 'appointment-icon',
            'welcome': 'welcome-icon',
            'appointment-available': 'appointment-available-icon',
            'favorite': 'favorite-icon-notif',
            'system': 'appointment-icon',
            'reminder': 'appointment-icon',
            'payment': 'appointment-icon',
            'booking': 'appointment-icon',
            'ambulance': 'appointment-icon',
            'blood-bank': 'favorite-icon-notif',
            'profile': 'appointment-icon',
            'settings': 'appointment-icon',
            'points': 'favorite-icon-notif',
            'redeem': 'appointment-icon',
            'security': 'appointment-icon'
        };
        return classes[type] || 'appointment-icon';
    }

    // Function to update notifications display
    function updateNotificationsDisplay() {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        notificationsList.innerHTML = '';

        if (notifications.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'notifications-empty-state';
            emptyState.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 60px 20px; color: #757575;">
                    <i class="far fa-bell" style="font-size: 80px; color: #E0E0E0; margin-bottom: 24px;"></i>
                    <h3 style="font-size: 20px; font-weight: 600; color: #424242; margin-bottom: 12px;">No Notifications</h3>
                    <p style="font-size: 14px; color: #757575; line-height: 1.5; max-width: 280px; margin: 0 auto;">You'll receive notifications about appointments, updates, and important information here.</p>
                </div>
            `;
            notificationsList.appendChild(emptyState);
            return;
        }

        notifications.forEach(notification => {
            const notificationCard = document.createElement('div');
            notificationCard.className = `notification-card ${notification.isUnread ? 'unread' : ''} ${notificationSelectionMode ? 'selection-mode' : ''}`;
            notificationCard.setAttribute('data-id', notification.id);

            const checkboxHtml = notificationSelectionMode ? `
                <div class="notification-checkbox">
                    <input type="checkbox" id="notif-check-${notification.id}" ${selectedNotifications.has(notification.id) ? 'checked' : ''}>
                    <label for="notif-check-${notification.id}"></label>
                </div>
            ` : '';

            notificationCard.innerHTML = `
                ${checkboxHtml}
                <div class="notification-icon ${getNotificationIconClass(notification.type)}">
                    <i class="${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <h4>${notification.title}</h4>
                        <span class="notification-time">${notification.timeAgo}</span>
                        ${notification.isUnread ? '<span class="unread-indicator"></span>' : ''}
                    </div>
                    <p class="notification-text">${notification.message}</p>
                </div>
            `;

            // Long press variables
            let longPressTimer;
            let touchStarted = false;
            let longPressTriggered = false;

            // Long press for mobile (touch events)
            notificationCard.addEventListener('touchstart', function(e) {
                if (notificationSelectionMode) return; // Already in selection mode
                
                touchStarted = true;
                longPressTriggered = false;
                longPressTimer = setTimeout(() => {
                    if (touchStarted) {
                        longPressTriggered = true;
                        enterSelectionMode();
                        toggleNotificationSelection(notification.id);
                        // Vibrate if supported
                        if (navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    }
                }, 500); // 500ms for long press
            }, { passive: true });

            notificationCard.addEventListener('touchend', function() {
                touchStarted = false;
                clearTimeout(longPressTimer);
            });

            notificationCard.addEventListener('touchmove', function() {
                touchStarted = false;
                clearTimeout(longPressTimer);
            });

            // Long press for desktop (mouse events)
            notificationCard.addEventListener('mousedown', function(e) {
                if (notificationSelectionMode) return;
                
                longPressTriggered = false;
                longPressTimer = setTimeout(() => {
                    longPressTriggered = true;
                    enterSelectionMode();
                    toggleNotificationSelection(notification.id);
                }, 500);
            });

            notificationCard.addEventListener('mouseup', function() {
                clearTimeout(longPressTimer);
            });

            notificationCard.addEventListener('mouseleave', function() {
                clearTimeout(longPressTimer);
            });

            // Click event listener
            notificationCard.addEventListener('click', function(e) {
                // Prevent default behavior if clicking on checkbox
                if (e.target.type === 'checkbox' || e.target.tagName === 'LABEL') {
                    return;
                }

                // If long press just triggered, prevent the click from toggling selection off
                if (longPressTriggered) {
                    longPressTriggered = false;
                    return;
                }

                if (notificationSelectionMode) {
                    // In selection mode, toggle selection
                    toggleNotificationSelection(notification.id);
                } else {
                    // Normal mode, mark as read
                    markNotificationAsRead(notification.id);
                    console.log(`Notification clicked: ${notification.title}`);
                }
            });

            // Checkbox change event
            if (notificationSelectionMode) {
                const checkbox = notificationCard.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.addEventListener('change', function(e) {
                        e.stopPropagation();
                        toggleNotificationSelection(notification.id);
                    });
                }
            }

            notificationsList.appendChild(notificationCard);
        });

        // Update selection action bar
        updateSelectionActionBar();
    }

    // Expose updateNotificationsDisplay globally for real-time subscription use
    window.updateNotificationsDisplay = updateNotificationsDisplay;

    // Function to enter selection mode
    function enterSelectionMode() {
        notificationSelectionMode = true;
        selectedNotifications.clear();
        updateNotificationsDisplay();
        console.log('Entered notification selection mode');
    }

    // Function to exit selection mode
    function exitSelectionMode() {
        notificationSelectionMode = false;
        selectedNotifications.clear();
        updateNotificationsDisplay();
        console.log('Exited notification selection mode');
    }

    // Function to toggle notification selection
    function toggleNotificationSelection(notificationId) {
        if (selectedNotifications.has(notificationId)) {
            selectedNotifications.delete(notificationId);
        } else {
            selectedNotifications.add(notificationId);
        }
        updateNotificationsDisplay();
    }

    // Function to update selection action bar
    function updateSelectionActionBar() {
        let actionBar = document.querySelector('.notification-selection-actions');
        
        if (notificationSelectionMode) {
            // Create action bar if it doesn't exist
            if (!actionBar) {
                actionBar = document.createElement('div');
                actionBar.className = 'notification-selection-actions';
                
                const notificationHeader = document.querySelector('#notification-screen .notification-hero-banner');
                if (notificationHeader) {
                    notificationHeader.after(actionBar);
                }
            }
            
            const selectedCount = selectedNotifications.size;
            actionBar.innerHTML = `
                <div class="selection-info">
                    <span>${selectedCount} selected</span>
                </div>
                <div class="selection-buttons">
                    <button class="cancel-selection-btn" onclick="window.exitNotificationSelectionMode()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="delete-selected-btn" onclick="window.deleteSelectedNotifications()" ${selectedCount === 0 ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i> Delete (${selectedCount})
                    </button>
                </div>
            `;
            actionBar.style.display = 'flex';
        } else {
            // Hide action bar
            if (actionBar) {
                actionBar.style.display = 'none';
            }
        }
    }

    // Function to delete selected notifications
    async function deleteSelectedNotifications() {
        if (selectedNotifications.size === 0) {
            return;
        }

        const count = selectedNotifications.size;
        const confirmed = await CustomDialog.confirm(
            `Are you sure you want to delete ${count} notification${count > 1 ? 's' : ''}?\n\nThis action cannot be undone.`,
            'Delete Notifications'
        );
        
        if (!confirmed) {
            return;
        }

        const notificationsToDelete = Array.from(selectedNotifications);
        
        // Delete from database
        for (const notifId of notificationsToDelete) {
            const notification = notifications.find(n => n.id === notifId);
            if (notification && notification.supabaseId) {
                try {
                    await window.dbService.deleteNotification(notification.supabaseId);
                    console.log('✅ Notification deleted from database:', notification.supabaseId);
                } catch (error) {
                    console.error('❌ Error deleting notification from database:', error);
                }
            }
        }

        // Delete from local array
        notifications = notifications.filter(n => !selectedNotifications.has(n.id));
        
        // Exit selection mode
        exitSelectionMode();
        
        // Update UI
        updateNotificationsDisplay();
        updateNotificationDot();
        updateUnreadCount();
        
        console.log(`Deleted ${count} notification(s)`);
    }

    // Expose functions globally
    window.exitNotificationSelectionMode = exitSelectionMode;
    window.deleteSelectedNotifications = deleteSelectedNotifications;

    // Function to mark notification as read
    async function markNotificationAsRead(notificationId) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && notification.isUnread) {
            notification.isUnread = false;
            updateNotificationsDisplay();
            updateNotificationDot();
            updateUnreadCount();
            
            // Update in database if notification was saved to DB
            if (notification.supabaseId && typeof window.dbService !== 'undefined' && window.dbService.markNotificationAsRead) {
                try {
                    await window.dbService.markNotificationAsRead(notification.supabaseId);
                    console.log('✅ Notification marked as read in database:', notification.supabaseId);
                } catch (error) {
                    console.error('❌ Error marking notification as read in database:', error);
                }
            }
        }
    }

    // Function to mark all notifications as read
    async function markAllNotificationsAsRead() {
        // Update all notifications in database
        const updatePromises = notifications
            .filter(n => n.isUnread && n.supabaseId)
            .map(async (notification) => {
                if (typeof window.dbService !== 'undefined' && window.dbService.markNotificationAsRead) {
                    try {
                        await window.dbService.markNotificationAsRead(notification.supabaseId);
                        console.log('✅ Notification marked as read in database:', notification.supabaseId);
                    } catch (error) {
                        console.error('❌ Error marking notification as read in database:', error);
                    }
                }
            });
        
        // Wait for all database updates to complete
        await Promise.all(updatePromises);
        
        // Update local notifications
        notifications.forEach(notification => {
            notification.isUnread = false;
        });
        updateNotificationsDisplay();
        updateNotificationDot();
        updateUnreadCount();
    }

    // Function to update unread count
    function updateUnreadCount() {
        const unreadCount = notifications.filter(n => n.isUnread).length;
        const unreadCountEl = document.querySelector('.unread-count');
        if (unreadCountEl) {
            unreadCountEl.textContent = `${unreadCount} unread`;
        }
    }

    // Function to add login notifications (only for first-time users)
    function addLoginNotifications() {
        // Only add welcome notifications if user is logged in and has no existing notifications from database
        const currentUser = AuthSystem?.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            // Not logged in, skip welcome notifications
            return;
        }
        
        // Check if notifications have already been loaded from database
        if (notifications.some(n => n.supabaseId)) {
            // User already has notifications from database, don't add welcome messages
            console.log('User has existing notifications, skipping welcome messages');
            return;
        }
        
        // Only add welcome notifications for new users
        console.log('Adding welcome notifications for new user');
        createNotification(
            'welcome',
            'Welcome to MediQuick',
            "Welcome to MediQuick! We're here to help you find the best healthcare services. Start by exploring our specialist categories.",
            true
        );

        createNotification(
            'appointment-available',
            'Appointment Available',
            'New appointment slots are available with our specialists. Book your preferred time slot now.',
            true
        );
    }

    // Function to simulate time updates for notifications
    function updateNotificationTimes() {
        notifications.forEach(notification => {
            const now = new Date();
            const diffInMinutes = Math.floor((now - notification.timestamp) / (1000 * 60));

            if (diffInMinutes < 1) {
                notification.timeAgo = 'Just now';
            } else if (diffInMinutes < 60) {
                notification.timeAgo = `${diffInMinutes} min ago`;
            } else if (diffInMinutes < 1440) {
                const hours = Math.floor(diffInMinutes / 60);
                notification.timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(diffInMinutes / 1440);
                notification.timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
            }
        });
        updateNotificationsDisplay();
    }

    // Initialize notifications display on page load
    // Note: Welcome notifications are now only added for new users after checking database
    // This is called after loadNotificationsFromSupabase in session restore
    updateNotificationsDisplay();
    updateNotificationDot();
    updateUnreadCount();

    // Update notification times every minute
    setInterval(updateNotificationTimes, 60000);

    // Function to add notification when favorite is added
    window.addFavoriteNotification = function(doctorName) {
        createNotification(
            'favorite',
            'Doctor Added to Favorites',
            `Dr. ${doctorName} has been added to your favorite doctors list.`,
            true
        );
    };

    // Function to add appointment confirmation notification
    window.addAppointmentNotification = function(doctorName, date, time) {
        createNotification(
            'appointment',
            'Appointment Confirmed',
            `Your appointment with Dr. ${doctorName} has been confirmed for ${date} at ${time}.`,
            true
        );
    };

    // Function to add reminder notification
    window.addReminderNotification = function(title, message) {
        createNotification(
            'reminder',
            title,
            message,
            true
        );
    };

    // Function to add system notification
    window.addSystemNotification = function(title, message) {
        createNotification(
            'system',
            title,
            message,
            true
        );
    };

    // Function to clear all notifications (used on logout)
    window.clearAllNotifications = function() {
        notifications.length = 0;
        notificationIdCounter = 1;
        selectedNotifications.clear();
        notificationSelectionMode = false;
        updateNotificationsDisplay();
        updateNotificationDot();
        updateUnreadCount();
        
        // Stop real-time subscription
        if (typeof window.stopNotificationRealtime === 'function') {
            window.stopNotificationRealtime();
        }
        
        console.log('🗑️ All notifications cleared');
    };

    // Function to load notifications from Supabase
    window.loadNotificationsFromSupabase = async function() {
        try {
            const currentUser = AuthSystem.getUser();
            if (!currentUser || !currentUser.supabaseId) {
                console.log('No user logged in, skipping notification sync');
                return;
            }

            if (typeof window.dbService === 'undefined' || !window.dbService.getNotificationsByUserId) {
                console.log('Database service not ready for notifications');
                return;
            }

            // Clear existing notifications before loading new user's notifications
            notifications.length = 0;
            notificationIdCounter = 1;
            console.log('🧹 Cleared previous notifications before loading');

            const supabaseNotifications = await window.dbService.getNotificationsByUserId(currentUser.supabaseId);
            console.log(`✅ Loaded ${supabaseNotifications.length} notifications from Supabase for user ${currentUser.supabaseId}`);

            supabaseNotifications.forEach(notif => {
                const existingNotif = notifications.find(n => n.supabaseId === notif.id);
                if (!existingNotif) {
                    const notification = {
                        id: notificationIdCounter++,
                        supabaseId: notif.id,
                        type: notif.type,
                        title: notif.title,
                        message: notif.message,
                        isUnread: !notif.is_read,
                        timestamp: new Date(notif.created_at),
                        timeAgo: 'Just now',
                        requestId: notif.request_id,
                        requestType: notif.request_type
                    };

                    const now = new Date();
                    const diffInMinutes = Math.floor((now - notification.timestamp) / (1000 * 60));
                    if (diffInMinutes < 1) {
                        notification.timeAgo = 'Just now';
                    } else if (diffInMinutes < 60) {
                        notification.timeAgo = `${diffInMinutes} min ago`;
                    } else if (diffInMinutes < 1440) {
                        const hours = Math.floor(diffInMinutes / 60);
                        notification.timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
                    } else {
                        const days = Math.floor(diffInMinutes / 1440);
                        notification.timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
                    }

                    notifications.push(notification);
                }
            });

            // Add welcome notifications for new users (only if they have no notifications yet)
            addLoginNotifications();

            updateNotificationsDisplay();
            updateNotificationDot();
            updateUnreadCount();
            
            // Set up real-time subscription after loading initial notifications
            setupNotificationRealtime();
        } catch (error) {
            console.error('Error loading notifications from Supabase:', error);
        }
    };

    // Global variable to store the notification subscription
    let notificationSubscription = null;

    // Function to set up real-time notification updates
    function setupNotificationRealtime() {
        const currentUser = AuthSystem.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            console.log('No user logged in, skipping real-time notification setup');
            return;
        }

        if (!window.supabase) {
            console.log('Supabase client not available, skipping real-time setup');
            return;
        }

        // Unsubscribe from previous subscription if it exists
        if (notificationSubscription) {
            notificationSubscription.unsubscribe();
            console.log('🔌 Unsubscribed from previous notification channel');
        }

        // Create a new subscription channel for this user's notifications
        notificationSubscription = window.supabase
            .channel('user-notifications-' + currentUser.supabaseId)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${currentUser.supabaseId}`
                },
                (payload) => {
                    console.log('🔔 New notification received:', payload);
                    
                    // Add the new notification to the local array
                    const notif = payload.new;
                    const existingNotif = notifications.find(n => n.supabaseId === notif.id);
                    
                    if (!existingNotif) {
                        const notification = {
                            id: notificationIdCounter++,
                            supabaseId: notif.id,
                            type: notif.type,
                            title: notif.title,
                            message: notif.message,
                            isUnread: !notif.is_read,
                            timestamp: new Date(notif.created_at),
                            timeAgo: 'Just now',
                            requestId: notif.request_id,
                            requestType: notif.request_type
                        };

                        // Add to beginning of array so it appears at top
                        notifications.unshift(notification);

                        // Update the UI
                        updateNotificationsDisplay();
                        updateNotificationDot();
                        updateUnreadCount();

                        console.log(`✅ Added new notification: ${notif.title}`);
                    }
                }
            )
            .subscribe((status) => {
                console.log('📡 Notification subscription status:', status);
            });

        console.log('🔔 Real-time notification subscription set up for user:', currentUser.supabaseId);
    }

    // Function to stop notification real-time updates (called on logout)
    window.stopNotificationRealtime = function() {
        if (notificationSubscription) {
            notificationSubscription.unsubscribe();
            notificationSubscription = null;
            console.log('🔌 Stopped notification real-time subscription');
        }
    };

    // Mark all read functionality
    const markAllReadBtn = document.querySelector('.mark-all-read-btn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllNotificationsAsRead();
            console.log('All notifications marked as read');
        });
    }

    // Profile section click handlers (exclude ambulance card profile sections)
    const profileSections = document.querySelectorAll('.profile-section:not(.ambulance-card .profile-section)');
    profileSections.forEach(section => {
        section.addEventListener('click', function() {
            console.log('Profile clicked');
            switchScreen('profile');
        });
    });

    // Profile screen functionality
    window.openEditProfile = async function() {
        console.log('Edit Profile clicked');
        await loadProfileData();
        openModal('editProfileModal');
    };

    window.openMedicalHistory = function() {
        console.log('Medical History clicked');
        loadMedicalHistory();
        openModal('medicalHistoryModal');
    };

    // Prescription Screen Functions
    window.openPrescriptionScreen = async function() {
        console.log('Prescription screen clicked');
        switchScreen('prescription');
        
        if (typeof window.syncUserPrescriptions === 'function') {
            try {
                await window.syncUserPrescriptions();
            } catch (error) {
                console.error('Failed to sync prescriptions:', error);
            }
        }
        
        updatePrescriptionDisplay();
    };

    window.navigateToBookAppointment = function() {
        console.log('Navigate to book appointment from prescription screen');
        switchScreen('top-now');
    };

    window.openChangePassword = function() {
        console.log('Change Password clicked');
        openModal('changePasswordModal');
        
        // Initialize password strength checker when modal opens
        setTimeout(() => {
            initializePasswordStrengthChecker();
        }, 100);
    };

    window.openNotificationSettings = function() {
        console.log('Notification Settings clicked');
        loadNotificationSettings();
        openModal('notificationSettingsModal');
    };

    window.openPrivacySettings = function() {
        console.log('Privacy Settings clicked');
        loadPrivacySettings();
        openModal('privacySettingsModal');
    };

    // Toggle Language Function
    window.toggleLanguage = function() {
        console.log('Language toggle clicked');
        const toggle = document.getElementById('language-toggle');
        const currentLanguageText = document.getElementById('current-language');
        
        // Toggle the checkbox state
        toggle.checked = !toggle.checked;
        
        // Update language based on toggle state
        const newLanguage = toggle.checked ? 'bangla' : 'english';
        PreferencesSystem.setLanguage(newLanguage);
        
        // Update the display text
        if (newLanguage === 'bangla') {
            currentLanguageText.textContent = 'বাংলা (Bangla)';
        } else {
            currentLanguageText.textContent = 'English';
        }
        
        // Show notification
        createNotification(
            'settings',
            'Language Changed',
            `Language has been changed to ${newLanguage === 'bangla' ? 'Bangla' : 'English'}.`,
            true
        );
        
        console.log('Language changed to:', newLanguage);
    };

    // Toggle Theme Function
    window.toggleTheme = function() {
        console.log('Theme toggle clicked');
        const toggle = document.getElementById('theme-toggle');
        const currentThemeText = document.getElementById('current-theme');
        
        // Toggle the checkbox state
        toggle.checked = !toggle.checked;
        
        // Update theme based on toggle state
        const newTheme = toggle.checked ? 'dark' : 'light';
        PreferencesSystem.setTheme(newTheme);
        
        // Apply theme to document
        document.body.className = newTheme === 'dark' ? 'dark-theme' : '';
        
        // Update the display text
        currentThemeText.textContent = newTheme === 'dark' ? 'Dark mode' : 'Light mode';
        
        // Show notification
        createNotification(
            'settings',
            'Theme Changed',
            `${newTheme === 'dark' ? 'Dark' : 'Light'} theme has been applied successfully.`,
            true
        );
        
        console.log('Theme changed to:', newTheme);
    };

    // Initialize toggle switches based on saved settings
    window.initializeToggles = function() {
        const savedLanguage = PreferencesSystem.getLanguage();
        const savedTheme = PreferencesSystem.getTheme();
        
        // Initialize language toggle
        const languageToggle = document.getElementById('language-toggle');
        const currentLanguageText = document.getElementById('current-language');
        if (languageToggle && currentLanguageText) {
            languageToggle.checked = savedLanguage === 'bangla';
            if (savedLanguage === 'bangla') {
                currentLanguageText.textContent = 'বাংলা (Bangla)';
            } else {
                currentLanguageText.textContent = 'English';
            }
        }
        
        // Initialize theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const currentThemeText = document.getElementById('current-theme');
        if (themeToggle && currentThemeText) {
            themeToggle.checked = savedTheme === 'dark';
            currentThemeText.textContent = savedTheme === 'dark' ? 'Dark mode' : 'Light mode';
            // Apply saved theme
            document.body.className = savedTheme === 'dark' ? 'dark-theme' : '';
        }
    };

    window.openLanguageSettings = function() {
        console.log('Language Settings clicked');
        loadLanguageSettings();
        openModal('languageSettingsModal');
    };

    window.openThemeSettings = function() {
        console.log('Theme Settings clicked');
        loadThemeSettings();
        openModal('themeSettingsModal');
    };

    window.openHelpCenter = function() {
        console.log('Help Center clicked');
        openModal('helpCenterModal');
    };

    window.openContactUs = function() {
        console.log('Contact Us clicked');
        openModal('contactUsModal');
        loadContactInfo();
        
        // Attach submit handler when modal opens
        setTimeout(() => {
            const contactForm = document.getElementById('contactForm');
            if (contactForm && !contactForm.hasAttribute('data-handler-attached')) {
                console.log('✅ Attaching submit handler to contact form');
                contactForm.setAttribute('data-handler-attached', 'true');
                contactForm.addEventListener('submit', handleContactFormSubmit);
            }
        }, 100);
    };
    
    async function handleContactFormSubmit(e) {
        console.log('📨 Contact form submitted!');
        e.preventDefault();

        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        console.log('📝 Form data:', formData);

        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            console.log('⚠️ Form validation failed - missing fields');
            CustomDialog.alert('Please fill in all required fields.', 'Form Validation');
            return;
        }

        console.log('✅ Form validation passed');

        try {
            // Check if Supabase is initialized
            if (typeof window.supabase === 'undefined' || typeof window.dbService === 'undefined') {
                console.error('❌ Supabase not initialized yet');
                CustomDialog.alert('The system is still loading. Please wait a moment and try again.', 'System Loading');
                return;
            }

            console.log('✅ Supabase is initialized');

            // Get current user if logged in
            const currentUser = AuthSystem.getUser();
            const userId = currentUser ? (currentUser.supabaseId || currentUser.id) : null;
            console.log('👤 Current user ID:', userId);

            // Prepare message data for database
            const messageData = {
                user_id: userId,
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                status: 'new'
            };

            console.log('📤 Message data prepared:', messageData);

            // Save to database
            console.log('📤 Attempting to save contact message to database...');
            const savedMessage = await window.dbService.addContactMessage(messageData);
            console.log('✅ Contact message saved to database:', savedMessage);

            CustomDialog.alert('Thank you for contacting us! We have received your message and will respond within 24 hours.', 'Message Sent Successfully');

            // Clear form
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.reset();
            }
            closeModal('contactUsModal');
        } catch (error) {
            console.error('❌ Error saving contact message:', error);
            console.error('❌ Error details:', error.message, error.stack);
            CustomDialog.alert('There was an error sending your message. Please try again or contact us directly.', 'Error');
        }
    }

    window.openTermsConditions = async function() {
        console.log('Terms & Conditions clicked');
        
        try {
            const terms = await window.dbService.getTermsAndConditions();
            
            const modalBody = document.querySelector('#termsConditionsModal .document-content');
            if (!modalBody) {
                console.error('Terms modal body not found');
                openModal('termsConditionsModal');
                return;
            }
            
            let htmlContent = '';
            
            terms.forEach(section => {
                if (section.section_order === 0) {
                    htmlContent += `<div class="document-section">
                        <p class="document-date"><strong>Effective Date:</strong> ${section.section_content}</p>`;
                } else if (section.section_order === 1) {
                    htmlContent += `<p class="document-date"><strong>Last Updated:</strong> ${section.section_content}</p>
                    </div>`;
                } else {
                    const contentLines = section.section_content.split('\n');
                    let formattedContent = '<ul>';
                    let hasListItems = false;
                    
                    contentLines.forEach(line => {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith('•')) {
                            formattedContent += `<li>${trimmedLine.substring(1).trim()}</li>`;
                            hasListItems = true;
                        } else if (trimmedLine) {
                            if (hasListItems) {
                                formattedContent += '</ul><p>' + trimmedLine + '</p><ul>';
                            } else {
                                formattedContent += '</ul><p>' + trimmedLine + '</p><ul>';
                            }
                        }
                    });
                    formattedContent += '</ul>';
                    
                    if (!hasListItems) {
                        formattedContent = `<p>${section.section_content.replace(/\n/g, '<br>')}</p>`;
                    }
                    
                    htmlContent += `<div class="document-section">
                        <h4>${section.section_title}</h4>
                        ${formattedContent}
                    </div>`;
                }
            });
            
            modalBody.innerHTML = htmlContent;
            openModal('termsConditionsModal');
        } catch (error) {
            console.error('Error loading terms & conditions:', error);
            openModal('termsConditionsModal');
        }
    };

    window.openPrivacyPolicy = async function() {
        console.log('Privacy Policy clicked');
        
        try {
            const privacy = await window.dbService.getPrivacyPolicy();
            const modalBody = document.querySelector('#privacyPolicyModal .modal-body .document-content');
            
            if (!modalBody) {
                openModal('privacyPolicyModal');
                return;
            }
            
            let htmlContent = '';
            
            privacy.forEach(section => {
                if (section.section_order === 0) {
                    htmlContent += `<div class="document-section">
                        <p class="document-date"><strong>Effective Date:</strong> ${section.effective_date}</p>
                    </div>`;
                } else if (section.section_order === 1) {
                    htmlContent += `<div class="document-section">
                        <p class="document-date"><strong>Last Updated:</strong> ${section.last_updated}</p>
                    </div>`;
                } else {
                    const contentLines = section.section_content.split('\n');
                    let formattedContent = '<ul style="list-style: none; padding-left: 0;">';
                    let hasListItems = false;
                    
                    contentLines.forEach(line => {
                        const trimmedLine = line.trim();
                        if (trimmedLine) {
                            if (trimmedLine.startsWith('•')) {
                                hasListItems = true;
                                formattedContent += `<li style="padding-left: 20px; text-indent: -20px;">${trimmedLine}</li>`;
                            } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                                const boldText = trimmedLine.slice(2, -2);
                                formattedContent += `</ul><h5>${boldText}</h5><ul style="list-style: none; padding-left: 0;">`;
                            } else {
                                formattedContent += '</ul><p>' + trimmedLine + '</p><ul>';
                            }
                        }
                    });
                    formattedContent += '</ul>';
                    
                    if (!hasListItems) {
                        formattedContent = `<p>${section.section_content.replace(/\n/g, '<br>')}</p>`;
                    }
                    
                    htmlContent += `<div class="document-section">
                        <h4>${section.section_order}. ${section.section_title}</h4>
                        ${formattedContent}
                    </div>`;
                }
            });
            
            modalBody.innerHTML = htmlContent;
            openModal('privacyPolicyModal');
        } catch (error) {
            console.error('Error loading privacy policy:', error);
            openModal('privacyPolicyModal');
        }
    };

    window.openAppInfo = function() {
        console.log('App Info clicked');
        CustomDialog.alert('MediQuick v1.0.0\nDeveloped for better healthcare access\nLast updated: October 2025', 'About MediQuick');
    };

    window.openAboutUs = function() {
        console.log('About Us clicked');
        CustomDialog.alert('MediQuick is your trusted platform to find and book doctors across Rangpur. Our mission is to make healthcare accessible to everyone.', 'About MediQuick');
    };

    window.handleLogout = async function() {
        console.log('Logout clicked');
        const shouldLogout = await CustomDialog.confirm('Are you sure you want to logout?', 'Confirm Logout');
        if (shouldLogout) {
            CustomDialog.alert('You have been logged out successfully!', 'Logout Successful');
            // Clear user session and redirect to sign-in screen
            AuthSystem.logout();
        }
    };

    // Avatar upload functionality
    window.selectAvatarImage = function() {
        console.log('Edit Avatar clicked');
        const fileInput = document.getElementById('avatar-upload');
        fileInput.click();
    };

    window.handleAvatarUpload = async function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const imageData = e.target.result;
                
                // Update profile avatar visually
                updateProfileAvatar(imageData);
                
                // Get current user and update with new avatar
                const currentUser = AuthSystem.getUser();
                if (currentUser) {
                    const avatarUpdatedAt = new Date().toISOString();
                    currentUser.avatar = imageData;
                    currentUser.avatarUpdatedAt = avatarUpdatedAt;
                    
                    // Save updated user data using AuthSystem (this will automatically call updateUIWithUserData)
                    AuthSystem.setUser(currentUser);
                    
                    // Save to Supabase database if dbService is available
                    // Note: User ID is stored as 'supabaseId' in session, not 'id'
                    const userId = currentUser.supabaseId || currentUser.id;
                    
                    if (typeof window.dbService !== 'undefined' && userId) {
                        try {
                            console.log('📝 Saving avatar to Supabase for user ID:', userId);
                            await window.dbService.updateUser(userId, {
                                avatar: imageData,
                                updated_at: avatarUpdatedAt
                            });
                            console.log('✅ Avatar saved to database successfully');
                            
                            // Show success notification
                            if (typeof addSystemNotification === 'function') {
                                addSystemNotification(
                                    'Avatar Updated',
                                    'Your profile picture has been updated successfully.'
                                );
                            }
                        } catch (error) {
                            console.error('❌ Failed to save avatar to database:', error);
                            alert('Avatar updated locally but failed to save to database. Please try again.');
                        }
                    } else {
                        console.log('Avatar uploaded and saved to local session only');
                    }
                } else {
                    console.error('No current user found for avatar update');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    function updateProfileAvatar(imageSrc) {
        const avatarIcon = document.getElementById('profile-avatar-icon');
        const avatarImg = document.getElementById('profile-avatar-img');
        const modalAvatarIcon = document.querySelector('.profile-photo i');
        const modalAvatarImg = document.querySelector('.profile-photo img');
        
        if (avatarIcon && avatarImg) {
            avatarIcon.style.display = 'none';
            avatarImg.src = imageSrc;
            avatarImg.style.display = 'block';
        }
        
        // Update in edit profile modal as well
        if (modalAvatarIcon && !modalAvatarImg) {
            modalAvatarIcon.style.display = 'none';
            const newImg = document.createElement('img');
            newImg.src = imageSrc;
            newImg.style.cssText = 'width: 80px; height: 80px; border-radius: 50%; object-fit: cover;';
            modalAvatarIcon.parentElement.appendChild(newImg);
        } else if (modalAvatarImg) {
            modalAvatarImg.src = imageSrc;
        }
    }

    // Edit profile button functionality
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditProfile();
        });
    }

    // Wallet tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update tab content
            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }

            console.log(`Wallet tab switched to: ${targetTab}`);
        });
    });

    // History tab functionality
    const historyTabButtons = document.querySelectorAll('.history-tab-button');
    const historyTabContents = document.querySelectorAll('.history-tab-content');

    historyTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetHistoryTab = this.getAttribute('data-history-tab');

            // Update history tab buttons
            historyTabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update history tab content
            historyTabContents.forEach(content => content.classList.remove('active'));
            const targetHistoryContent = document.getElementById(targetHistoryTab + '-history');
            if (targetHistoryContent) {
                targetHistoryContent.classList.add('active');
            }

            // Refresh transaction history when switching tabs
            if (typeof PointsSystem !== 'undefined' && PointsSystem.updateTransactionHistory) {
                PointsSystem.updateTransactionHistory();
            }

            console.log(`History tab switched to: ${targetHistoryTab}`);
        });
    });

    // Redeem button click handler (from wallet tab)
    const redeemBtn = document.querySelector('.redeem-btn');
    if (redeemBtn) {
        redeemBtn.addEventListener('click', function() {
            switchScreen('redeem-points');
            console.log('Navigating to redeem points screen');
        });
    }

    // Redeem option button click handlers
    const redeemOptionBtns = document.querySelectorAll('.redeem-option-btn.active');
    redeemOptionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.redeem-card');
            const title = card.querySelector('h4').textContent;
            console.log(`Redeem clicked for: ${title}`);

            // Open appropriate popup based on card type
            if (title.toLowerCase().includes('sim recharge')) {
                openSimRechargePopup();
            } else if (title.toLowerCase().includes('bkash cash')) {
                openbKashCashPopup();
            }
        });
    });

    // Sim recharge popup functions
    window.openSimRechargePopup = function() {
        const popup = document.getElementById('sim-recharge-popup');
        if (popup) {
            // Update available points in popup
            if (typeof PointsSystem !== 'undefined') {
                const availablePoints = PointsSystem.getAvailablePoints();
                const popupPointsElement = document.getElementById('popup-available-points');
                if (popupPointsElement) {
                    popupPointsElement.textContent = availablePoints;
                }
            }

            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Sim recharge popup opened');
        }
    };

    // Function to handle sim recharge redemption
    window.redeemSimRecharge = function(phoneNumber, amount) {
        const pointsRequired = 50; // 50 points for sim recharge

        // Check if PointsSystem exists and has sufficient points
        if (typeof PointsSystem !== 'undefined') {
            const redemption = PointsSystem.redeemPoints(pointsRequired, `Sim Recharge - ${phoneNumber} - ${amount} Taka`, null);

            if (redemption) {
                // Create notification for successful redemption
                createNotification(
                    'redeem',
                    'Points Redeemed Successfully!',
                    `You have successfully redeemed ${pointsRequired} points for sim recharge.`,
                    true
                );

                // Close the popup
                closeSimRechargePopup();

                // Update the wallet display
                PointsSystem.updateWalletDisplay();

                console.log('Sim recharge redemption successful:', redemption);
                return true;
            } else {
                CustomDialog.alert('Insufficient points for redemption.', 'Insufficient Points');
                return false;
            }
        } else {
            // Fallback if PointsSystem is not available
            CustomDialog.alert('Points system not available. Please try again.', 'System Error');
            return false;
        }
    };

    window.closeSimRechargePopup = function() {
        const popup = document.getElementById('sim-recharge-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Sim recharge popup closed');

            // Clear form fields
            const form = popup.querySelector('.redeem-form');
            if (form) {
                form.reset();
            }
        }
    };

    // Close popup when clicking outside
    const popupOverlay = document.getElementById('sim-recharge-popup');
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSimRechargePopup();
            }
        });
    }


    // 30% Bonus popup functions
    window.openBonusPopup = function() {
        const popup = document.getElementById('bonus-popup');
        if (popup) {
            // Update available points in popup
            if (typeof PointsSystem !== 'undefined') {
                const availablePoints = PointsSystem.getAvailablePoints();
                const popupPointsElement = document.getElementById('bonus-popup-available-points');
                if (popupPointsElement) {
                    popupPointsElement.textContent = availablePoints;
                }
            }

            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('30% Bonus popup opened');
        }
    };

    window.closeBonusPopup = function() {
        const popup = document.getElementById('bonus-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('30% Bonus popup closed');

            // Clear form fields
            const form = popup.querySelector('.redeem-form');
            if (form) {
                form.reset();
            }
        }
    };

    // Get a Mobile Gift popup functions
    window.openMobileGiftPopup = function() {
        const popup = document.getElementById('mobile-gift-popup');
        if (popup) {
            // Update available points in popup
            if (typeof PointsSystem !== 'undefined') {
                const availablePoints = PointsSystem.getAvailablePoints();
                const popupPointsElement = document.getElementById('mobile-gift-popup-available-points');
                if (popupPointsElement) {
                    popupPointsElement.textContent = availablePoints;
                }
            }

            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Get a Mobile Gift popup opened');
        }
    };

    window.closeMobileGiftPopup = function() {
        const popup = document.getElementById('mobile-gift-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Get a Mobile Gift popup closed');

            // Clear form fields
            const form = popup.querySelector('.redeem-form');
            if (form) {
                form.reset();
            }
        }
    };

    // bKash Cash popup functions
    window.openbKashCashPopup = function() {
        const popup = document.getElementById('bkash-cash-popup');
        if (popup) {
            // Update available points in popup
            if (typeof PointsSystem !== 'undefined') {
                const availablePoints = PointsSystem.getAvailablePoints();
                const popupPointsElement = document.getElementById('bkash-popup-available-points');
                if (popupPointsElement) {
                    popupPointsElement.textContent = availablePoints;
                }
            }

            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('bKash Cash popup opened');
        }
    };

    window.closebKashCashPopup = function() {
        const popup = document.getElementById('bkash-cash-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('bKash Cash popup closed');

            // Clear form fields
            const form = popup.querySelector('.redeem-form');
            if (form) {
                form.reset();
            }
        }
    };

    // Close popups when clicking outside
    const bkashPopupOverlay = document.getElementById('bkash-cash-popup');
    if (bkashPopupOverlay) {
        bkashPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closebKashCashPopup();
            }
        });
    }

    const bonusPopupOverlay = document.getElementById('bonus-popup');
    if (bonusPopupOverlay) {
        bonusPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBonusPopup();
            }
        });
    }

    const mobileGiftPopupOverlay = document.getElementById('mobile-gift-popup');
    if (mobileGiftPopupOverlay) {
        mobileGiftPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMobileGiftPopup();
            }
        });
    }


    // Submit 30% Bonus request
    window.submitBonusRequest = async function(event) {
        event.preventDefault();

        const currentUser = AuthSystem.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            CustomDialog.alert('Please sign in to redeem points', 'Authentication Required');
            return;
        }

        const formData = new FormData(event.target);
        const userName = formData.get('userName');
        const userNumber = formData.get('userNumber');

        if (userName && userNumber) {
            // Get all available points for redemption
            let pointsToRedeem = 0;
            if (typeof PointsSystem !== 'undefined') {
                pointsToRedeem = PointsSystem.getAvailablePoints();

                if (pointsToRedeem <= 0) {
                    CustomDialog.alert('No points available for redemption.', 'No Points Available');
                    return;
                }
            } else {
                pointsToRedeem = 300; // Fallback amount
            }

            // Disable submit button
            const submitBtn = event.target.querySelector('.send-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Checking...';

            try {
                if (typeof window.dbService !== 'undefined') {
                    const existingRequests = await window.dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
                    const pendingRequests = existingRequests.filter(req => req.status === 'pending');
                    
                    if (pendingRequests.length > 0) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        CustomDialog.alert(
                            `You already have a pending redeem request (ID: ${pendingRequests[0].request_id}).\n\nPlease wait for admin approval or cancellation before submitting a new request.`,
                            'Pending Request Exists'
                        );
                        return;
                    }
                }
                
                submitBtn.textContent = 'Processing...';
                const requestId = 'RDM' + Date.now().toString().slice(-8);
                
                const redeemRequest = {
                    request_id: requestId,
                    user_id: currentUser.supabaseId,
                    user_name: userName,
                    user_email: currentUser.email,
                    user_mobile: userNumber,
                    points_to_redeem: pointsToRedeem,
                    redeem_type: '30_percent_bonus',
                    status: 'pending',
                    user_available_points: pointsToRedeem,
                    request_date: new Date().toISOString()
                };
                
                await window.userSupabaseHandlers.submitRedeemRequest(redeemRequest);
                
                // Immediately update UI to show 00pt and disable buttons
                if (typeof PointsSystem !== 'undefined') {
                    await PointsSystem.updateWalletDisplay();
                    await PointsSystem.updateRedeemOptions();
                }
                
                createNotification(
                    'redeem',
                    'Redeem Request Submitted',
                    `Your 30% Bonus request has been submitted! Request ID: ${requestId}. Your request is being processed by admin.`,
                    true
                );

                CustomDialog.alert(
                    `Your 30% Bonus request has been submitted successfully!\n\nRequest ID: ${requestId}\n\nYour request is being processed. You will be notified once it is approved by admin.`,
                    'Request Submitted'
                );
                
                closeBonusPopup();
                event.target.reset();
                
            } catch (error) {
                console.error('Error submitting redeem request:', error);
                CustomDialog.alert('Failed to submit redeem request. Please try again.', 'Error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    };

    // Submit Mobile Gift request
    window.submitMobileGiftRequest = async function(event) {
        event.preventDefault();

        const currentUser = AuthSystem.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            CustomDialog.alert('Please sign in to redeem points', 'Authentication Required');
            return;
        }

        const formData = new FormData(event.target);
        const userName = formData.get('userName');
        const userNumber = formData.get('userNumber');

        if (userName && userNumber) {
            // Get all available points for redemption
            let pointsToRedeem = 0;
            if (typeof PointsSystem !== 'undefined') {
                pointsToRedeem = PointsSystem.getAvailablePoints();

                if (pointsToRedeem <= 0) {
                    CustomDialog.alert('No points available for redemption.', 'No Points Available');
                    return;
                }
            } else {
                pointsToRedeem = 2000; // Fallback amount
            }

            // Disable submit button
            const submitBtn = event.target.querySelector('.send-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Checking...';

            try {
                if (typeof window.dbService !== 'undefined') {
                    const existingRequests = await window.dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
                    const pendingRequests = existingRequests.filter(req => req.status === 'pending');
                    
                    if (pendingRequests.length > 0) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        CustomDialog.alert(
                            `You already have a pending redeem request (ID: ${pendingRequests[0].request_id}).\n\nPlease wait for admin approval or cancellation before submitting a new request.`,
                            'Pending Request Exists'
                        );
                        return;
                    }
                }
                
                submitBtn.textContent = 'Processing...';
                const requestId = 'RDM' + Date.now().toString().slice(-8);
                
                const redeemRequest = {
                    request_id: requestId,
                    user_id: currentUser.supabaseId,
                    user_name: userName,
                    user_email: currentUser.email,
                    user_mobile: userNumber,
                    points_to_redeem: pointsToRedeem,
                    redeem_type: 'mobile_gift',
                    status: 'pending',
                    user_available_points: pointsToRedeem,
                    request_date: new Date().toISOString()
                };
                
                await window.userSupabaseHandlers.submitRedeemRequest(redeemRequest);
                
                // Immediately update UI to show 00pt and disable buttons
                if (typeof PointsSystem !== 'undefined') {
                    await PointsSystem.updateWalletDisplay();
                    await PointsSystem.updateRedeemOptions();
                }
                
                createNotification(
                    'redeem',
                    'Redeem Request Submitted',
                    `Your Mobile Gift request has been submitted! Request ID: ${requestId}. Your request is being processed by admin.`,
                    true
                );

                CustomDialog.alert(
                    `Your Mobile Gift request has been submitted successfully!\n\nRequest ID: ${requestId}\n\nYour request is being processed. You will be notified once it is approved by admin.`,
                    'Request Submitted'
                );
                
                closeMobileGiftPopup();
                event.target.reset();
                
            } catch (error) {
                console.error('Error submitting redeem request:', error);
                CustomDialog.alert('Failed to submit redeem request. Please try again.', 'Error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    };

    // Submit bKash Cash request
    window.submitbKashCashRequest = async function(event) {
        event.preventDefault();

        const currentUser = AuthSystem.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            CustomDialog.alert('Please sign in to redeem points', 'Authentication Required');
            return;
        }

        const formData = new FormData(event.target);
        const userName = formData.get('userName');
        const userNumber = formData.get('userNumber');

        if (userName && userNumber) {
            // Get all available points for redemption
            let pointsToRedeem = 0;
            if (typeof PointsSystem !== 'undefined') {
                pointsToRedeem = PointsSystem.getAvailablePoints();

                if (pointsToRedeem < 100) {
                    CustomDialog.alert('Minimum 100 points required for bKash Cash redemption.', 'Insufficient Points');
                    return;
                }
            } else {
                pointsToRedeem = 100; // Fallback amount
            }

            // Disable submit button
            const submitBtn = event.target.querySelector('.send-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Checking...';

            try {
                if (typeof window.dbService !== 'undefined') {
                    const existingRequests = await window.dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
                    const pendingRequests = existingRequests.filter(req => req.status === 'pending');
                    
                    if (pendingRequests.length > 0) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        CustomDialog.alert(
                            `You already have a pending redeem request (ID: ${pendingRequests[0].request_id}).\n\nPlease wait for admin approval or cancellation before submitting a new request.`,
                            'Pending Request Exists'
                        );
                        return;
                    }
                }
                
                submitBtn.textContent = 'Processing...';
                const requestId = 'RDM' + Date.now().toString().slice(-8);
                
                const redeemRequest = {
                    request_id: requestId,
                    user_id: currentUser.supabaseId,
                    user_name: userName,
                    user_email: currentUser.email,
                    user_mobile: userNumber,
                    points_to_redeem: pointsToRedeem,
                    redeem_type: 'bkash_cash',
                    status: 'pending',
                    user_available_points: pointsToRedeem,
                    request_date: new Date().toISOString()
                };
                
                await window.userSupabaseHandlers.submitRedeemRequest(redeemRequest);
                
                // Immediately update UI to show 00pt and disable buttons
                if (typeof PointsSystem !== 'undefined') {
                    await PointsSystem.updateWalletDisplay();
                    await PointsSystem.updateRedeemOptions();
                }
                
                createNotification(
                    'redeem',
                    'Redeem Request Submitted',
                    `Your bKash Cash request has been submitted! Request ID: ${requestId}. Your request is being processed by admin.`,
                    true
                );

                CustomDialog.alert(
                    `Your bKash Cash request has been submitted successfully!\n\nRequest ID: ${requestId}\n\nYour request is being processed. You will be notified once it is approved by admin.`,
                    'Request Submitted'
                );
                
                closebKashCashPopup();
                event.target.reset();
                
            } catch (error) {
                console.error('Error submitting redeem request:', error);
                CustomDialog.alert('Failed to submit redeem request. Please try again.', 'Error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    };

    // Submit redeem request
    window.submitRedeemRequest = async function(event) {
        event.preventDefault();

        const currentUser = AuthSystem.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            CustomDialog.alert('Please sign in to redeem points', 'Authentication Required');
            return;
        }

        const formData = new FormData(event.target);
        const userName = formData.get('userName');
        const userNumber = formData.get('userNumber');

        if (userName && userNumber) {
            // Get all available points for redemption
            let pointsToRedeem = 0;
            if (typeof PointsSystem !== 'undefined') {
                pointsToRedeem = PointsSystem.getAvailablePoints();

                if (pointsToRedeem <= 0) {
                    CustomDialog.alert('No points available for redemption.', 'No Points Available');
                    return;
                }
            } else {
                pointsToRedeem = 50;
            }

            // Disable submit button
            const submitBtn = event.target.querySelector('.send-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Checking...';

            try {
                if (typeof window.dbService !== 'undefined') {
                    const existingRequests = await window.dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
                    const pendingRequests = existingRequests.filter(req => req.status === 'pending');
                    
                    if (pendingRequests.length > 0) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        CustomDialog.alert(
                            `You already have a pending redeem request (ID: ${pendingRequests[0].request_id}).\n\nPlease wait for admin approval or cancellation before submitting a new request.`,
                            'Pending Request Exists'
                        );
                        return;
                    }
                }
                
                submitBtn.textContent = 'Processing...';
                const requestId = 'RDM' + Date.now().toString().slice(-8);
                
                const redeemRequest = {
                    request_id: requestId,
                    user_id: currentUser.supabaseId,
                    user_name: userName,
                    user_email: currentUser.email,
                    user_mobile: userNumber,
                    points_to_redeem: pointsToRedeem,
                    redeem_type: 'sim_recharge',
                    status: 'pending',
                    user_available_points: pointsToRedeem,
                    request_date: new Date().toISOString()
                };
                
                await window.userSupabaseHandlers.submitRedeemRequest(redeemRequest);
                
                // Immediately update UI to show 00pt and disable buttons
                if (typeof PointsSystem !== 'undefined') {
                    await PointsSystem.updateWalletDisplay();
                    await PointsSystem.updateRedeemOptions();
                }
                
                createNotification(
                    'redeem',
                    'Redeem Request Submitted',
                    `Your redeem request has been submitted! Request ID: ${requestId}. Your request is being processed by admin.`,
                    true
                );

                CustomDialog.alert(
                    `Your redeem request has been submitted successfully!\n\nRequest ID: ${requestId}\n\nYour request is being processed. You will be notified once it is approved by admin.`,
                    'Request Submitted'
                );
                
                closeSimRechargePopup();
                event.target.reset();
                
            } catch (error) {
                console.error('Error submitting redeem request:', error);
                CustomDialog.alert('Failed to submit redeem request. Please try again.', 'Error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    };

    // Blood Request popup functions
    window.openBloodRequestPopup = function() {
        const popup = document.getElementById('blood-request-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Blood request popup opened');
        }
    };

    window.closeBloodRequestPopup = function() {
        const popup = document.getElementById('blood-request-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Blood request popup closed');

            // Clear form fields
            const form = popup.querySelector('.blood-request-form');
            if (form) {
                form.reset();
            }
        }
    };

    // Close blood request popup when clicking outside
    const bloodRequestPopupOverlay = document.getElementById('blood-request-popup');
    if (bloodRequestPopupOverlay) {
        bloodRequestPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBloodRequestPopup();
            }
        });
    }

    // Submit blood request
    window.submitBloodRequest = async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const bloodRequestData = {
            patientName: formData.get('patientName'),
            patientAge: formData.get('patientAge'),
            bloodGroup: formData.get('bloodGroup'),
            bloodUnits: formData.get('bloodUnits'),
            urgencyLevel: formData.get('urgencyLevel'),
            hospitalName: formData.get('hospitalName'),
            hospitalAddress: formData.get('hospitalAddress'),
            contactPerson: formData.get('contactPerson'),
            contactMobile: formData.get('contactMobile'),
            medicalCondition: formData.get('medicalCondition'),
            doctorName: formData.get('doctorName'),
            requestDate: BangladeshTimezone.toISOString()
        };

        // Validate required fields
        const requiredFields = ['patientName', 'patientAge', 'bloodGroup', 'bloodUnits', 'urgencyLevel', 'hospitalName', 'contactPerson', 'contactMobile'];
        const missingFields = requiredFields.filter(field => !bloodRequestData[field]);

        if (missingFields.length > 0) {
            CustomDialog.alert('Please fill in all required fields.', 'Form Validation');
            return;
        }

        // Validate mobile number (should be 11 digits)
        if (!/^\d{11}$/.test(bloodRequestData.contactMobile)) {
            CustomDialog.alert('Please enter a valid 11-digit mobile number.', 'Invalid Mobile Number');
            return;
        }

        console.log('Blood request submitted:', bloodRequestData);

        try {
            // Get current user
            const currentUser = AuthSystem.getUser();
            
            // Prepare data for Supabase
            const requestForDB = {
                user_id: currentUser?.supabaseId || null,
                patient_name: bloodRequestData.patientName,
                patient_age: parseInt(bloodRequestData.patientAge),
                blood_group: bloodRequestData.bloodGroup,
                units_needed: parseInt(bloodRequestData.bloodUnits),
                urgency_level: bloodRequestData.urgencyLevel,
                hospital_name: bloodRequestData.hospitalName,
                hospital_address: bloodRequestData.hospitalAddress || '',
                contact_person: bloodRequestData.contactPerson,
                contact_number: bloodRequestData.contactMobile,
                medical_condition: bloodRequestData.medicalCondition || '',
                doctor_name: bloodRequestData.doctorName || '',
                status: 'pending',
                request_time: BangladeshTimezone.toISOString()
            };

            // Save to Supabase
            const savedRequest = await window.userSupabaseHandlers.requestBlood(requestForDB);
            
            // Also add to local database for immediate display
            const newRequest = {
                id: savedRequest.id,
                patientName: bloodRequestData.patientName,
                bloodGroup: bloodRequestData.bloodGroup,
                unitsNeeded: parseInt(bloodRequestData.bloodUnits),
                hospital: bloodRequestData.hospitalName,
                requestDate: BangladeshTimezone.toISOString().split('T')[0],
                urgency: bloodRequestData.urgencyLevel.charAt(0).toUpperCase() + bloodRequestData.urgencyLevel.slice(1),
                status: 'pending',
                contactNumber: bloodRequestData.contactMobile
            };

            bloodRequestsDatabase.unshift(newRequest);

            // Show confirmation message
            CustomDialog.alert(
                `Blood request submitted successfully!\n\nRequest ID: ${savedRequest.id}\nPatient: ${bloodRequestData.patientName}\nBlood Group: ${bloodRequestData.bloodGroup}\nUnits Needed: ${bloodRequestData.bloodUnits}\nHospital: ${bloodRequestData.hospitalName}\nUrgency: ${bloodRequestData.urgencyLevel.charAt(0).toUpperCase() + bloodRequestData.urgencyLevel.slice(1)}\nStatus: Pending\n\nYour request is pending. An admin will accept the request if the blood group is available and contact you soon at ${bloodRequestData.contactMobile}.`,
                'Blood Request Confirmed'
            );

            closeBloodRequestPopup();

            // Switch to history tab directly
            const historyTabButton = document.querySelector('.blood-tab-button[data-blood-tab="history"]');
            if (historyTabButton) {
                historyTabButton.click();
            }

            // Update history tab
            populateBloodRequestHistory();

            console.log(`Blood request ${savedRequest.id} added to Supabase and history`);
        } catch (error) {
            console.error('Error submitting blood request:', error);
            CustomDialog.alert('Failed to submit blood request. Please try again.', 'Error');
        }
    };

    // Know About Points popup functions
    window.openKnowPointsPopup = function() {
        const popup = document.getElementById('know-points-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Know about points popup opened');
        }
    };

    window.closeKnowPointsPopup = function() {
        const popup = document.getElementById('know-points-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Know about points popup closed');
        }
    };

    // Close Know Points popup when clicking outside
    const knowPointsPopupOverlay = document.getElementById('know-points-popup');
    if (knowPointsPopupOverlay) {
        knowPointsPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeKnowPointsPopup();
            }
        });
    }

    // Donor Registration popup functions
    window.openDonorRegistrationPopup = function() {
        const popup = document.getElementById('donor-registration-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Donor registration popup opened');
        }
    };

    window.closeDonorRegistrationPopup = function() {
        const popup = document.getElementById('donor-registration-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Donor registration popup closed');

            // Clear form fields
            const form = popup.querySelector('.donor-registration-form');
            if (form) {
                form.reset();
                // Clear photo preview
                clearPhotoUrl();
            }
        }
    };

    // Close donor registration popup when clicking outside
    const donorRegistrationPopupOverlay = document.getElementById('donor-registration-popup');
    if (donorRegistrationPopupOverlay) {
        donorRegistrationPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDonorRegistrationPopup();
            }
        });
    }


    // Admin approval function (temporary for testing)
    window.approveDonor = function(donorId) {
        const donor = donorsDatabase.find(d => d.id === donorId);
        if (donor) {
            donor.status = 'approved';
            donor.approvedBy = 'Admin';
            donor.approvedDate = new Date().toISOString();
            console.log(`Donor ${donorId} approved by admin`);
            
            // Refresh donor lists and search results if currently viewing blood bank screen
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id === 'blood-bank-screen') {
                populateDonorAvailabilityLists();
                
                // Also refresh search results if they exist
                const lastSearchParams = JSON.parse(sessionStorage.getItem('lastSearchParams') || 'null');
                if (lastSearchParams) {
                    // Set the form values and re-run the search
                    document.getElementById('donor-district').value = lastSearchParams.district;
                    document.getElementById('donor-upazila').value = lastSearchParams.upazila;
                    document.getElementById('donor-blood-group').value = lastSearchParams.bloodGroup;
                    searchDonors();
                }
            }
            
            // Send notification to the specific donor (store it persistently)
            const approvalNotification = {
                donorId: String(donorId),
                screen: 'blood-bank',
                title: 'Registration Approved!',
                message: `Congratulations! Your donor registration has been approved by admin. Your card is now visible to other users who need your blood type.`,
                timestamp: Date.now(),
                isNew: true
            };
            
            // Store the notification in memory for the specific donor
            NotificationsSystem.addNotification('donorApproval', approvalNotification);
            
            // If this is the current user, show the notification immediately
            if (String(donorId) === String(InMemoryStorage.currentUserDonorId)) {
                createNotification(
                    'blood-bank',
                    'Registration Approved!',
                    `Congratulations! Your donor registration has been approved by admin. Your card is now visible to other users who need your blood type.`,
                    true
                );
            }
        } else {
            console.log(`Donor ${donorId} not found`);
        }
    };

    // Admin function to approve ambulance booking (private function - not exposed on window for security)
    // For demo purposes only: To test approval, open console and call: testApprovalFlow('BOOKING_ID')
    function approveAmbulanceBooking(bookingId) {
        const booking = ambulanceBookingHistoryDatabase.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'completed';
            booking.approvedBy = 'Admin';
            booking.approvedDate = new Date().toISOString();
            console.log(`Ambulance booking ${bookingId} approved by admin`);
            
            // Refresh ambulance booking history if currently viewing ambulance screen
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id === 'ambulance-screen') {
                populateAmbulanceBookingHistory();
            }
            
            // Send notification about approval
            const approvalNotification = {
                bookingId: String(bookingId),
                userId: booking.userId, // Include user ID from the booking
                screen: 'ambulance',
                title: 'Booking Approved!',
                message: `Great news! Your ambulance booking (${bookingId}) has been approved by admin. The ambulance will reach your location shortly.`,
                timestamp: Date.now(),
                isNew: true
            };
            
            // Store the notification in memory for the specific booking
            NotificationsSystem.addNotification('ambulanceApproval', approvalNotification);
            
            // Show the notification immediately only if this is the current user's booking
            const currentUserId = InMemoryStorage.currentUserId;
            if (booking.userId === currentUserId) {
                createNotification(
                    'ambulance',
                    'Booking Approved!',
                    `Great news! Your ambulance booking (${bookingId}) has been approved by admin. The ambulance will reach your location shortly.`,
                    true
                );
            }
        } else {
            console.log(`Ambulance booking ${bookingId} not found`);
        }
    }

    // Admin function to approve driver booking (private function - not exposed on window for security)
    // For demo purposes only: To test approval, open console and call: testDriverApprovalFlow('BOOKING_ID')
    function approveDriverBooking(bookingId) {
        const booking = driverBookedHistoryDatabase.find(b => b.bookingId === bookingId);
        if (booking) {
            booking.status = 'Approved';
            booking.approvedBy = 'Admin';
            booking.approvedDate = new Date().toISOString();
            console.log(`Driver booking ${bookingId} approved by admin`);
            
            // Refresh ambulance booking history if currently viewing ambulance screen
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id === 'ambulance-screen') {
                populateAmbulanceBookingHistory();
            }
            
            // Send notification about approval
            const approvalNotification = {
                bookingId: String(bookingId),
                userId: booking.userId, // Include user ID from the booking
                screen: 'ambulance',
                title: 'Driver Booking Approved!',
                message: `Great news! Your driver booking (${bookingId}) has been approved by admin. Driver ${booking.driverName} will contact you shortly for pickup confirmation.`,
                timestamp: Date.now(),
                isNew: true
            };
            
            // Store the notification in memory for the specific booking
            NotificationsSystem.addNotification('driverApproval', approvalNotification);
            
            // Show the notification immediately only if this is the current user's booking
            const currentUserId = InMemoryStorage.currentUserId;
            if (booking.userId === currentUserId) {
                createNotification(
                    'ambulance',
                    'Driver Booking Approved!',
                    `Great news! Your driver booking (${bookingId}) has been approved by admin. Driver ${booking.driverName} will contact you shortly for pickup confirmation.`,
                    true
                );
            }
        } else {
            console.log(`Driver booking ${bookingId} not found`);
        }
    }

    // Admin function to approve hospital booking (private function - not exposed on window for security)
    // For demo purposes only: To test approval, open console and call: testHospitalApprovalFlow('BOOKING_ID')
    function approveHospitalBooking(bookingId) {
        const hospitalBookings = InMemoryStorage.hospitalBookings;
        const booking = hospitalBookings.find(b => b.bookingId === bookingId);
        if (booking) {
            booking.status = 'approved';
            booking.approvedBy = 'Admin';
            booking.approvedDate = new Date().toISOString();
            console.log(`Hospital booking ${bookingId} approved by admin`);
            
            // Save updated bookings back to memory
            InMemoryStorage.hospitalBookings = hospitalBookings;
            
            // Refresh hospital booking history if currently viewing private hospital screen
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id === 'private-hospital-screen') {
                loadHospitalBookingHistory();
            }
            
            // Send notification about approval
            const approvalNotification = {
                bookingId: String(bookingId),
                userId: booking.userId, // Include user ID from the booking
                screen: 'private-hospital',
                title: 'Hospital Booking Approved!',
                message: `Great news! Your hospital booking (${bookingId}) at ${booking.hospital} has been approved by admin. You will receive a confirmation call shortly.`,
                timestamp: Date.now(),
                isNew: true
            };
            
            // Store the notification in memory for the specific booking
            NotificationsSystem.addNotification('hospitalApproval', approvalNotification);
            
            // Show the notification immediately only if this is the current user's booking
            const currentUserId = InMemoryStorage.currentUserId;
            if (booking.userId === currentUserId) {
                createNotification(
                    'private-hospital',
                    'Hospital Booking Approved!',
                    `Great news! Your hospital booking (${bookingId}) at ${booking.hospital} has been approved by admin. You will receive a confirmation call shortly.`,
                    true
                );
            }
        } else {
            console.log(`Hospital booking ${bookingId} not found`);
        }
    }

    // Test function for driver booking approval (for demo purposes only)
    // To test: Open console and call testDriverApprovalFlow('BOOKING_ID') or testDriverApprovalFlow() for latest booking
    window.testDriverApprovalFlow = function(bookingId) {
        if (!bookingId && driverBookedHistoryDatabase.length > 0) {
            // Auto-select the most recent booking for current user if no ID provided
            const currentUserId = InMemoryStorage.currentUserId;
            const userBookings = driverBookedHistoryDatabase.filter(b => b.userId === currentUserId);
            if (userBookings.length > 0) {
                bookingId = userBookings[userBookings.length - 1].bookingId;
                console.log(`Auto-selected latest booking for current user: ${bookingId}`);
            } else {
                console.log('No bookings found for current user');
                return;
            }
        }
        
        if (!bookingId) {
            console.log('No booking ID provided and no bookings available');
            return;
        }
        
        console.log(`Testing driver approval flow for booking: ${bookingId}`);
        approveDriverBooking(bookingId);
    };

    // Test function for hospital booking approval (for demo purposes only)
    // To test: Open console and call testHospitalApprovalFlow('BOOKING_ID') or testHospitalApprovalFlow() for latest booking
    window.testHospitalApprovalFlow = function(bookingId) {
        const hospitalBookings = InMemoryStorage.hospitalBookings;
        if (!bookingId && hospitalBookings.length > 0) {
            // Auto-select the most recent booking for current user if no ID provided
            const currentUserId = InMemoryStorage.currentUserId;
            const userBookings = hospitalBookings.filter(b => b.userId === currentUserId);
            if (userBookings.length > 0) {
                bookingId = userBookings[userBookings.length - 1].bookingId;
                console.log(`Auto-selected latest hospital booking for current user: ${bookingId}`);
            } else {
                console.log('No hospital bookings found for current user');
                return;
            }
        }
        
        if (!bookingId) {
            console.log('No booking ID provided and no hospital bookings available');
            return;
        }
        
        console.log(`Testing hospital approval flow for booking: ${bookingId}`);
        approveHospitalBooking(bookingId);
    };

    // Note: Admin approval function is private and not exposed for security
    // In a real app, admin approval would be handled through a secure admin panel

    // Function to check and show pending approval notifications for current user
    function checkAndShowApprovalNotifications() {
        const currentUserDonorId = InMemoryStorage.currentUserDonorId;
        if (!currentUserDonorId) return;
        
        const notifications = NotificationsSystem.getNotifications('donorApproval');
        const userNotifications = notifications.filter(n => n.donorId === String(currentUserDonorId) && n.isNew);
        
        userNotifications.forEach(notification => {
            createNotification(
                notification.screen,
                notification.title,
                notification.message,
                true
            );
            
            // Mark as shown
            notification.isNew = false;
        });
        
        // Update memory to persist the isNew=false changes
        NotificationsSystem.setNotifications('donorApproval', notifications);
    }

    // Function to check and show ambulance booking approval notifications
    function checkAndShowAmbulanceApprovalNotifications() {
        console.log('Checking for ambulance approval notifications...');
        
        // Get current user ID
        const currentUserId = InMemoryStorage.currentUserId;
        if (!currentUserId) {
            console.log('No current user ID found, skipping notification check');
            return;
        }
        
        // Get all ambulance approval notifications
        const notifications = NotificationsSystem.getNotifications('ambulanceApproval');
        const userNotifications = notifications.filter(n => n.userId === currentUserId && n.isNew);
        
        console.log(`Found ${userNotifications.length} new approval notifications for user ${currentUserId}`);
        
        userNotifications.forEach(notification => {
            console.log('Showing approval notification:', notification.title);
            createNotification(
                notification.screen,
                notification.title,
                notification.message,
                true
            );
            
            // Mark as shown
            notification.isNew = false;
        });
        
        // Update memory to persist the isNew=false changes
        if (userNotifications.length > 0) {
            NotificationsSystem.setNotifications('ambulanceApproval', notifications);
            console.log('Updated notification storage after marking as shown');
        }
    }

    // Function to check and show driver booking approval notifications
    function checkAndShowDriverApprovalNotifications() {
        console.log('Checking for driver approval notifications...');
        
        // Get current user ID
        const currentUserId = InMemoryStorage.currentUserId;
        if (!currentUserId) {
            console.log('No current user ID found, skipping driver notification check');
            return;
        }
        
        // Get all driver approval notifications
        const notifications = NotificationsSystem.getNotifications('driverApproval');
        const userNotifications = notifications.filter(n => n.userId === currentUserId && n.isNew);
        
        console.log(`Found ${userNotifications.length} new driver approval notifications for user ${currentUserId}`);
        
        userNotifications.forEach(notification => {
            console.log('Showing driver approval notification:', notification.title);
            createNotification(
                notification.screen,
                notification.title,
                notification.message,
                true
            );
            
            // Mark as shown
            notification.isNew = false;
        });
        
        // Update memory to persist the isNew=false changes
        if (userNotifications.length > 0) {
            NotificationsSystem.setNotifications('driverApproval', notifications);
            console.log('Updated driver notification storage after marking as shown');
        }
    }

    // Function to check and show hospital booking approval notifications
    function checkAndShowHospitalApprovalNotifications() {
        console.log('Checking for hospital approval notifications...');
        
        // Get current user ID
        const currentUserId = InMemoryStorage.currentUserId;
        if (!currentUserId) {
            console.log('No current user ID found, skipping hospital notification check');
            return;
        }
        
        // Get all hospital approval notifications
        const notifications = NotificationsSystem.getNotifications('hospitalApproval');
        const userNotifications = notifications.filter(n => n.userId === currentUserId && n.isNew);
        
        console.log(`Found ${userNotifications.length} new hospital approval notifications for user ${currentUserId}`);
        
        userNotifications.forEach(notification => {
            console.log('Showing hospital approval notification:', notification.title);
            createNotification(
                notification.screen,
                notification.title,
                notification.message,
                true
            );
            
            // Mark as shown
            notification.isNew = false;
        });
        
        // Update memory to persist the isNew=false changes
        if (userNotifications.length > 0) {
            NotificationsSystem.setNotifications('hospitalApproval', notifications);
            console.log('Updated hospital notification storage after marking as shown');
        }
    }

    // Make hospital notification function globally accessible
    window.checkAndShowHospitalApprovalNotifications = checkAndShowHospitalApprovalNotifications;

    // Test function to create appointments with different dates (for testing purposes)
    window.testCreateAppointment = function(daysAgo = 0) {
        if (typeof PointsSystem === 'undefined') {
            console.log('PointsSystem not available');
            return;
        }
        
        const testDate = new Date();
        testDate.setDate(testDate.getDate() - daysAgo);
        const formattedDate = testDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const testAppointment = {
            doctorName: 'Dr. Musa Siddik Juwel',
            doctorCategory: 'Dentist',
            appointmentDate: formattedDate,
            appointmentTime: '03:00 PM',
            patientName: 'Test Patient',
            patientAddress: 'Rangpur, Bangladesh',
            transactionId: 'TEST_' + Date.now()
        };
        
        PointsSystem.addAppointmentPoints(testAppointment);
        console.log(`Test appointment created for ${formattedDate} (${daysAgo} days ago)`);
    };

    // Photo URL Functions for Donor Registration
    let donorPhotoUrl = null;

    // Handle photo URL input and preview
    document.addEventListener('DOMContentLoaded', function() {
        const photoUrlInput = document.getElementById('donor-photo-url');
        if (photoUrlInput) {
            photoUrlInput.addEventListener('input', handlePhotoUrlInput);
            photoUrlInput.addEventListener('paste', handlePhotoUrlInput);
        }
    });

    function handlePhotoUrlInput(event) {
        const url = event.target.value.trim();
        if (url) {
            // Basic URL validation
            if (!isValidImageUrl(url)) {
                console.log('Invalid image URL format');
                return;
            }
            
            // Test if the image loads successfully
            const testImg = new Image();
            testImg.onload = function() {
                donorPhotoUrl = url;
                console.log('Photo URL validated successfully:', url);
            };
            testImg.onerror = function() {
                console.log('Failed to load image from URL:', url);
                // Don't show error for partial URLs while user is typing
                if (url.includes('http') && url.length > 10) {
                    CustomDialog.alert('Unable to load image from this URL. Please check the URL and try again.', 'Invalid Image URL');
                }
            };
            testImg.src = url;
        } else {
            // Clear URL if empty
            donorPhotoUrl = null;
        }
    }

    function isValidImageUrl(url) {
        // Check if URL has valid format and common image extensions
        const urlPattern = /^https?:\/\/.+/i;
        const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
        
        return urlPattern.test(url) && (imageExtensions.test(url) || url.includes('imgur') || url.includes('ibb.co') || url.includes('unsplash') || url.includes('pexels'));
    }

    // Clear photo URL function (simplified)
    window.clearPhotoUrl = function() {
        donorPhotoUrl = null;
        
        // Clear the URL input
        const photoUrlInput = document.getElementById('donor-photo-url');
        if (photoUrlInput) {
            photoUrlInput.value = '';
        }
    };

    // Book Ambulance popup functions
    window.openBookAmbulancePopup = function() {
        const popup = document.getElementById('book-ambulance-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Book ambulance popup opened');
        }
    };

    window.closeBookAmbulancePopup = function() {
        const popup = document.getElementById('book-ambulance-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Book ambulance popup closed');

            // Clear form fields
            const form = popup.querySelector('.book-ambulance-form');
            if (form) {
                form.reset();
            }
        }
    };

    // Close book ambulance popup when clicking outside
    const bookAmbulancePopupOverlay = document.getElementById('book-ambulance-popup');
    if (bookAmbulancePopupOverlay) {
        bookAmbulancePopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBookAmbulancePopup();
            }
        });
    }

    // Function to update upazila options for donor registration
    window.updateDonorRegistrationUpazilaOptions = function() {
        const districtSelect = document.getElementById('donor-district-reg');
        const upazilaSelect = document.getElementById('donor-upazila-reg');

        if (!districtSelect || !upazilaSelect) return;

        const selectedDistrict = districtSelect.value;

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            upazilaData[selectedDistrict].forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
        }

        console.log(`Donor registration district changed to: ${selectedDistrict}`);
    };

    // Function to update pickup upazila options for ambulance booking
    window.updatePickupUpazilaOptions = function() {
        const districtSelect = document.getElementById('pickup-district');
        const upazilaSelect = document.getElementById('pickup-upazila');

        if (!districtSelect || !upazilaSelect) return;

        const selectedDistrict = districtSelect.value;

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            upazilaData[selectedDistrict].forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
        }

        console.log(`Pickup district changed to: ${selectedDistrict}`);
    };

    // Function to update destination upazila options for ambulance booking
    window.updateDestinationUpazilaOptions = function() {
        const districtSelect = document.getElementById('destination-district');
        const upazilaSelect = document.getElementById('destination-upazila');

        if (!districtSelect || !upazilaSelect) return;

        const selectedDistrict = districtSelect.value;

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            upazilaData[selectedDistrict].forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
        }

        console.log(`Destination district changed to: ${selectedDistrict}`);
    };

    // Function to update ambulance upazila options for search
    window.updateAmbulanceUpazilaOptions = function() {
        const districtSelect = document.getElementById('ambulance-district');
        const upazilaSelect = document.getElementById('ambulance-upazila');

        if (!districtSelect || !upazilaSelect) return;

        const selectedDistrict = districtSelect.value;

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            upazilaData[selectedDistrict].forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
        }

        console.log(`Ambulance district changed to: ${selectedDistrict}`);
    };

    // Function to search ambulances
    window.searchAmbulances = function() {
        const district = document.getElementById('ambulance-district').value;
        const upazila = document.getElementById('ambulance-upazila').value;
        const ambulanceType = document.getElementById('ambulance-type-search').value;

        if (!district || !upazila || !ambulanceType) {
            CustomDialog.alert('Please select all fields to search for ambulances.', 'Search Validation');
            return;
        }

        console.log(`🔍 Search criteria - District: ${district}, Upazila: ${upazila}, Type: ${ambulanceType}`);
        console.log(`🔍 Total ambulances in database: ${ambulancesDatabase.length}`);
        
        // Filter ambulances based on search criteria
        const filteredAmbulances = ambulancesDatabase.filter(ambulance => {
            const districtMatch = ambulance.district === district;
            const upazilaMatch = ambulance.upazila === upazila;
            const typeMatch = ambulance.type === ambulanceType;
            const availableMatch = ambulance.isAvailable;
            
            if (!districtMatch || !upazilaMatch || !typeMatch) {
                console.log(`❌ No match - Driver: ${ambulance.driverName}, District: ${ambulance.district}, Upazila: ${ambulance.upazila}, Type: ${ambulance.type}`);
            }
            
            return districtMatch && upazilaMatch && typeMatch && availableMatch;
        });

        console.log(`✅ Found ${filteredAmbulances.length} matching ambulances`);

        // Show search results section
        const searchResultsSection = document.getElementById('ambulance-search-results');
        if (searchResultsSection) {
            searchResultsSection.style.display = 'block';
        }

        // Display search results
        displayAmbulanceSearchResults(filteredAmbulances);
    };

    // Function to display ambulance search results
    function displayAmbulanceSearchResults(ambulances) {
        const resultsList = document.getElementById('ambulance-results-list');
        if (!resultsList) return;

        resultsList.innerHTML = '';

        if (ambulances.length === 0) {
            const noResultsCard = document.createElement('div');
            noResultsCard.className = 'ambulance-card';
            noResultsCard.innerHTML = `
                <div class="no-ambulances-found">
                    <i class="fas fa-search" style="font-size: 48px; color: #BDBDBD; margin-bottom: 16px;"></i>
                    <h4 style="color: #424242; margin-bottom: 8px;">No ambulances found</h4>
                    <p style="color: #757575; font-size: 14px; text-align: center;">Try searching with different criteria</p>
                </div>
            `;
            noResultsCard.style.textAlign = 'center';
            noResultsCard.style.padding = '40px 20px';
            resultsList.appendChild(noResultsCard);
        } else {
            ambulances.forEach(ambulance => {
                const ambulanceCard = createAmbulanceCard(ambulance);
                resultsList.appendChild(ambulanceCard);
            });
        }
    }

    // Submit donor registration
    window.submitDonorRegistration = async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        
        // Get photo URL from the input field
        const photoUrlInput = document.getElementById('donor-photo-url');
        const photoUrl = photoUrlInput ? photoUrlInput.value.trim() : '';
        
        const donorData = {
            fullName: formData.get('donorFullName'),
            age: formData.get('donorAge'),
            gender: formData.get('donorGender'),
            mobile: formData.get('donorMobile'),
            bloodGroup: formData.get('donorBloodGroup'),
            district: formData.get('donorDistrict'),
            upazila: formData.get('donorUpazila'),
            lastDonation: formData.get('donorLastDonation'),
            availability: formData.get('donorAvailability'),
            medicalConditions: formData.get('donorMedicalConditions'),
            registrationDate: new Date().toISOString(),
            photoUrl: photoUrl
        };

        // Validate required fields
        const requiredFields = ['fullName', 'age', 'gender', 'mobile', 'bloodGroup', 'district', 'upazila', 'availability'];
        const missingFields = requiredFields.filter(field => !donorData[field]);

        if (missingFields.length > 0) {
            CustomDialog.alert('Please fill in all required fields.', 'Form Validation');
            return;
        }

        // Validate mobile number (should be 11 digits)
        if (!/^\d{11}$/.test(donorData.mobile)) {
            CustomDialog.alert('Please enter a valid 11-digit mobile number.', 'Invalid Mobile Number');
            return;
        }

        // Validate age (18-65)
        const age = parseInt(donorData.age);
        if (age < 18 || age > 65) {
            CustomDialog.alert('Donor age must be between 18 and 65 years.', 'Invalid Age');
            return;
        }

        console.log('Donor registration submitted:', donorData);
        console.log('Photo URL:', donorData.photoUrl ? 'Photo URL provided: ' + donorData.photoUrl : 'No photo URL provided');

        try {
            const currentUser = AuthSystem.getUser();
            if (!currentUser || !currentUser.supabaseId) {
                CustomDialog.alert('You must be logged in to register as a donor.', 'Authentication Required');
                return;
            }

            const donorForDB = {
                name: donorData.fullName,
                blood_group: donorData.bloodGroup,
                contact: donorData.mobile,
                age: parseInt(donorData.age),
                gender: donorData.gender,
                district: donorData.district,
                upazila: donorData.upazila,
                last_donation_date: donorData.lastDonation || null,
                medical_conditions: donorData.medicalConditions || '',
                photo: donorData.photoUrl || 'https://i.ibb.co.com/YdR8KfV/donor-1.jpg',
                status: 'active',
                approved: false,
                request_date: new Date().toISOString().split('T')[0],
                user_id: parseInt(currentUser.supabaseId)
            };

            const savedDonor = await window.userSupabaseHandlers.registerDonor(donorForDB);

            // Determine if donor is ready based on last donation date and availability
            let isReady = donorData.availability === 'ready';
            if (donorData.lastDonation) {
                const daysSinceLastDonation = calculateDaysSinceLastDonation(donorData.lastDonation);
                if (daysSinceLastDonation < 90) {
                    isReady = false;
                }
            }

            // Add the new donor to local database
            const newDonor = {
                id: savedDonor.id,
                name: donorData.fullName,
                photo: donorData.photoUrl || 'https://i.ibb.co.com/YdR8KfV/donor-1.jpg',
                district: donorData.district,
                upazila: donorData.upazila,
                contact: donorData.mobile,
                bloodGroup: donorData.bloodGroup,
                lastDonation: donorData.lastDonation || '2024-01-01',
                isReady: isReady,
                age: parseInt(donorData.age),
                gender: donorData.gender,
                medicalConditions: donorData.medicalConditions,
                registrationDate: donorData.registrationDate,
                status: 'pending',
                approvedBy: null,
                approvedDate: null
            };

            donorsDatabase.unshift(newDonor);

            // Store the current user's donor ID so they can see their own pending card
            InMemoryStorage.currentUserDonorId = savedDonor.id;

            // Add donor registration notification
            createNotification(
                'blood-bank',
                'Donor Registration Submitted',
                `Your donor registration (${savedDonor.id}) is pending admin approval. Your card will be visible to other users after approval.`,
                true
            );

            CustomDialog.alert(`Congratulations! You have been successfully registered as a blood donor.\n\nDonor ID: ${savedDonor.id}\nStatus: Pending Admin Approval\n\nYour donor card is now pending for admin approval. After admin approval, your card will be visible to other users who need your blood type. We will notify you once your registration is approved.\n\nThank you for joining our community of life-savers!`, 'Registration Successful');

            closeDonorRegistrationPopup();

            // Clear photo URL after successful registration
            donorPhotoUrl = null;

            // Refresh donor lists if currently viewing blood bank screen
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id === 'blood-bank-screen') {
                populateDonorAvailabilityLists();
                
                // Update the donor button state to show "Already Registered"
                const becomeDonorBtn = document.querySelector('.become-donor-btn');
                if (becomeDonorBtn) {
                    updateDonorButtonState(becomeDonorBtn);
                }
            }

            console.log(`Donor ${savedDonor.id} registered successfully to Supabase`);
        } catch (error) {
            console.error('Error registering donor:', error);
            CustomDialog.alert('Failed to register as donor. Please try again.', 'Error');
        }
    };

    // Handle donor registration form submission
    const donorRegistrationForm = document.getElementById('donor-registration-form');
    if (donorRegistrationForm) {
        donorRegistrationForm.addEventListener('submit', submitDonorRegistration);
    }

    // Know about points click handler
    const pointsInfoItems = document.querySelectorAll('.points-info .info-item');
    pointsInfoItems.forEach(item => {
        item.addEventListener('click', function() {
            openKnowPointsPopup();
            console.log('Know about points clicked');
        });
    });

    // Doctor details tab functionality
    const doctorTabButtons = document.querySelectorAll('.doctor-tab-button');
    const doctorTabContents = document.querySelectorAll('.doctor-tab-content');

    doctorTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetDoctorTab = this.getAttribute('data-doctor-tab');

            // Update doctor tab buttons
            doctorTabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update doctor tab content
            doctorTabContents.forEach(content => content.classList.remove('active'));
            const targetDoctorContent = document.getElementById(targetDoctorTab + '-doctor-tab');
            if (targetDoctorContent) {
                targetDoctorContent.classList.add('active');
            }

            console.log(`Doctor tab switched to: ${targetDoctorTab}`);
        });
    });

    // Book appointment button click handlers
    const bookAppointmentBtns = document.querySelectorAll('.book-appointment-btn');
    bookAppointmentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Book appointment clicked');

            // Get current doctor details from doctor details screen
            const doctorName = document.getElementById('doctor-name').textContent;
            const doctorCategory = document.getElementById('doctor-category').getAttribute('data-specialty') || extractRawSpecialty(document.getElementById('doctor-category').textContent);
            const doctorImage = document.getElementById('doctor-hero-img').src;

            // Update patient details screen with current doctor info
            updatePatientDetailsDoctor(doctorName, doctorCategory, doctorImage);

            // Switch to patient details screen
            switchScreen('patient-details');
        });
    });

    // Function to update doctor info in patient details screen
    function updatePatientDetailsDoctor(name, category, imageSrc) {
        const doctorSummaryImg = document.getElementById('doctor-summary-img');
        const doctorSummaryName = document.getElementById('doctor-summary-name');
        const doctorSummaryCategory = document.getElementById('doctor-summary-category');

        if (doctorSummaryImg && imageSrc) {
            doctorSummaryImg.src = imageSrc;
            doctorSummaryImg.alt = name;
        }

        if (doctorSummaryName) {
            doctorSummaryName.textContent = name;
        }

        if (doctorSummaryCategory) {
            doctorSummaryCategory.textContent = getCategoryWithBangla(category);
            doctorSummaryCategory.setAttribute('data-specialty', category);
        }
    }

    // Function to update upazila options based on selected district
    window.updateUpazilaOptions = function() {
        const districtSelect = document.getElementById('patient-district');
        const upazilaSelect = document.getElementById('patient-upazila');

        if (!districtSelect || !upazilaSelect) return;

        const selectedDistrict = districtSelect.value;

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            upazilaData[selectedDistrict].forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
        }

        console.log(`District changed to: ${selectedDistrict}`);
    };

    // Profile creation district/upazila update function
    window.updateProfileUpazilaOptions = function() {
        console.log('🔍 updateProfileUpazilaOptions called');
        
        const districtSelect = document.getElementById('profile-district');
        const upazilaSelect = document.getElementById('profile-upazila');

        console.log('📍 District select element:', districtSelect);
        console.log('📍 Upazila select element:', upazilaSelect);

        if (!districtSelect || !upazilaSelect) {
            console.error('❌ District or Upazila select not found!');
            return;
        }

        const selectedDistrict = districtSelect.value;
        console.log('📍 Selected district value:', selectedDistrict);
        console.log('📍 upazilaData available:', typeof upazilaData !== 'undefined');
        console.log('📍 upazilaData has this district:', selectedDistrict && upazilaData[selectedDistrict] ? 'YES' : 'NO');

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            const upazilas = upazilaData[selectedDistrict];
            console.log(`✅ Adding ${upazilas.length} upazilas for ${selectedDistrict}`);
            upazilas.forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
            console.log('✅ Upazila options added successfully');
        } else {
            console.warn('⚠️ No upazilas found for district:', selectedDistrict);
        }

        console.log(`Profile district changed to: ${selectedDistrict}`);
    };

    // Edit Profile modal district/upazila update function
    window.updateEditProfileUpazilaOptions = function(districtSelectElement) {
        console.log('🔍 updateEditProfileUpazilaOptions called');
        
        // If called with 'this' context from onchange, use it; otherwise fallback to getElementById
        const districtSelect = districtSelectElement || document.getElementById('district');
        
        if (!districtSelect) {
            console.error('❌ District select not found in Edit Profile modal!');
            return;
        }

        // Find the upazila select within the same form/container as the district select
        const formRow = districtSelect.closest('.form-row');
        const upazilaSelect = formRow ? formRow.querySelector('select[name="upazila"]') : document.getElementById('upazila');

        console.log('📍 District select element:', districtSelect);
        console.log('📍 Upazila select element:', upazilaSelect);

        if (!upazilaSelect) {
            console.error('❌ Upazila select not found in Edit Profile modal!');
            return;
        }

        const selectedDistrict = districtSelect.value;
        console.log('📍 Selected district value:', selectedDistrict);
        console.log('📍 upazilaData available:', typeof upazilaData !== 'undefined');
        console.log('📍 upazilaData has this district:', selectedDistrict && upazilaData[selectedDistrict] ? 'YES' : 'NO');

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            const upazilas = upazilaData[selectedDistrict];
            console.log(`✅ Adding ${upazilas.length} upazilas for ${selectedDistrict}`);
            upazilas.forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
            console.log('✅ Upazila options added successfully for Edit Profile');
        } else {
            console.warn('⚠️ No upazilas found for district:', selectedDistrict);
        }

        console.log(`Edit Profile district changed to: ${selectedDistrict}`);
    };

    // Patient details form submission
    const patientDetailsForm = document.getElementById('patient-details-form');
    if (patientDetailsForm) {
        patientDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const patientData = {
                name: formData.get('patientName'),
                age: formData.get('patientAge'),
                mobile: formData.get('patientMobile'),
                gender: formData.get('patientGender'),
                district: formData.get('patientDistrict'),
                upazila: formData.get('patientUpazila'),
                problem: formData.get('problemDescription')
            };

            // Store patient data for booking session
            currentBookingSession.patient = patientData;
            console.log('Patient details submitted:', patientData);

            // Validate required fields
            if (!patientData.name || !patientData.age || !patientData.mobile || !patientData.gender || !patientData.district || !patientData.upazila) {
                CustomDialog.alert('Please fill in all required fields.', 'Form Validation');
                return;
            }

            // Validate mobile number (should be 11 digits)
            if (!/^\d{11}$/.test(patientData.mobile)) {
                CustomDialog.alert('Please enter a valid 11-digit mobile number.', 'Invalid Mobile Number');
                return;
            }

            // Update select datetime screen with doctor info
            updateSelectDatetimeDoctor();

            // Navigate to select datetime screen
            switchScreen('select-datetime');
            console.log('Navigating to select date & time screen');
        });
    }

    // Function to update doctor info in select datetime screen
    function updateSelectDatetimeDoctor() {
        const patientDoctorImg = document.getElementById('doctor-summary-img');
        const patientDoctorName = document.getElementById('doctor-summary-name');
        const patientDoctorCategory = document.getElementById('doctor-summary-category');

        const datetimeDoctorImg = document.getElementById('datetime-doctor-img');
        const datetimeDoctorName = document.getElementById('datetime-doctor-name');
        const datetimeDoctorCategory = document.getElementById('datetime-doctor-category');

        if (patientDoctorImg && datetimeDoctorImg) {
            datetimeDoctorImg.src = patientDoctorImg.src;
            datetimeDoctorImg.alt = patientDoctorImg.alt;
        }

        if (patientDoctorName && datetimeDoctorName) {
            datetimeDoctorName.textContent = patientDoctorName.textContent;
            // Store the current doctor's name for date generation
            currentBookingSession.doctor = {
                name: patientDoctorName.textContent,
                specialty: patientDoctorCategory ? (patientDoctorCategory.getAttribute('data-specialty') || extractRawSpecialty(patientDoctorCategory.textContent)) : '',
                image: patientDoctorImg ? patientDoctorImg.src : ''
            };
            console.log('📋 Booking Session - Doctor Specialty:', currentBookingSession.doctor.specialty);
            
            // Regenerate date cards with the updated doctor information
            generateDateCards();
            initializeAvailabilityDisplay();
        }

        if (patientDoctorCategory && datetimeDoctorCategory) {
            datetimeDoctorCategory.textContent = patientDoctorCategory.textContent;
        }
    }

    // Booking stock management
    const bookingStock = {
        '30': { booked: 0, total: 5 },
        '31': { booked: 0, total: 5 },
        '01': { booked: 0, total: 5 },
        '02': { booked: 0, total: 5 },
        '03': { booked: 0, total: 5 },
        '04': { booked: 0, total: 5 }
    };

    // Function to update date cards based on booking stock
    function updateDateCardsAvailability() {
        const dateCards = document.querySelectorAll('.date-card:not(.off-day)');
        dateCards.forEach(card => {
            const date = card.getAttribute('data-date');
            if (bookingStock[date]) {
                const stock = bookingStock[date];
                if (stock.booked >= stock.total) {
                    card.classList.add('disabled');
                    card.style.opacity = '0.5';
                    card.style.cursor = 'not-allowed';
                    card.style.backgroundColor = '#FFEBEE';
                    card.style.borderColor = '#E57373';

                    // Add sold out indicator
                    if (!card.querySelector('.sold-out-label')) {
                        const soldOutLabel = document.createElement('div');
                        soldOutLabel.className = 'sold-out-label';
                        soldOutLabel.textContent = 'Sold Out';
                        soldOutLabel.style.cssText = `
                            font-size: 9px;
                            font-weight: 600;
                            color: #E53935;
                            background-color: rgba(229, 57, 53, 0.1);
                            padding: 2px 6px;
                            border-radius: 4px;
                            position: absolute;
                            bottom: 4px;
                            left: 50%;
                            transform: translateX(-50%);
                        `;
                        card.appendChild(soldOutLabel);
                    }
                } else {
                    card.classList.remove('disabled');
                    card.style.opacity = '';
                    card.style.cursor = '';
                    card.style.backgroundColor = '';
                    card.style.borderColor = '';

                    // Remove sold out indicator if exists
                    const soldOutLabel = card.querySelector('.sold-out-label');
                    if (soldOutLabel) {
                        soldOutLabel.remove();
                    }
                }
            }
        });
    }

    // Date card selection functionality is now handled in generateDateCards function

    // Time slot selection functionality
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all time slots
            timeSlots.forEach(s => s.classList.remove('selected'));

            // Add selected class to clicked slot
            this.classList.add('selected');

            const time = this.getAttribute('data-time');
            console.log(`Time selected: ${time}`);
        });
    });

    // Function to get real appointment count for a doctor on a specific date
    async function getRealAppointmentCount(doctorName, dateString) {
        try {
            if (typeof window.dbService !== 'undefined') {
                const allAppointments = await window.dbService.getAppointments();
                const count = allAppointments.filter(apt => 
                    apt.doctor_name === doctorName && 
                    apt.date === dateString &&
                    apt.status !== 'cancelled'
                ).length;
                return count;
            }
            return 0;
        } catch (error) {
            console.error('Error getting appointment count:', error);
            return 0;
        }
    }

    // Function to update appointment availability
    async function updateAppointmentAvailability(date, day, fullDate) {
        const appointmentDateEl = document.querySelector('.appointment-date');
        const availableBadge = document.querySelector('.available-badge');
        const bookingInfo = document.querySelector('.booking-info');

        // Get current doctor's booking slot from database
        const currentDoctor = currentBookingSession.doctor;
        let doctorBookingSlot = 2; // Default
        let bookedCount = 0;

        if (currentDoctor && currentDoctor.name) {
            const doctor = doctorsDatabase.find(doc => doc.name === currentDoctor.name);
            if (doctor) {
                doctorBookingSlot = doctor.bookingSlot || 2;
            }

            // Get real appointment count from database
            const dateObj = BangladeshTimezone.create(fullDate);
            const dateString = dateObj.toISOString().split('T')[0];
            bookedCount = await getRealAppointmentCount(currentDoctor.name, dateString);
        }

        const availableSlots = doctorBookingSlot - bookedCount;

        if (appointmentDateEl) {
            const dateObj = BangladeshTimezone.create(fullDate);
            const formattedDate = `${date.padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
            appointmentDateEl.textContent = `Appointments Available On - ${formattedDate}`;
        }

        if (availableBadge) {
            if (availableSlots <= 0) {
                availableBadge.textContent = 'No Bookings Available';
                availableBadge.style.backgroundColor = '#ff4444';
            } else {
                availableBadge.textContent = `Available-${availableSlots}`;
                availableBadge.style.backgroundColor = '';
            }
        }

        if (bookingInfo) {
            if (availableSlots <= 0) {
                bookingInfo.textContent = 'No Bookings Available';
                bookingInfo.style.color = '#ff4444';
            } else {
                bookingInfo.textContent = `${bookedCount} Bookings Out of ${doctorBookingSlot}`;
                bookingInfo.style.color = '';
            }
        }
    }

    // Helper function to convert day names to day numbers (0=Sunday, 6=Saturday)
    function dayNameToNumber(dayName) {
        const dayMap = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6
        };
        return dayMap[dayName];
    }

    // Function to get current doctor's off days as day numbers
    function getCurrentDoctorOffDays() {
        if (currentBookingSession.doctor && currentBookingSession.doctor.name) {
            const doctor = doctorsDatabase.find(doc => doc.name === currentBookingSession.doctor.name);
            if (doctor && doctor.offDays && Array.isArray(doctor.offDays)) {
                return doctor.offDays.map(dayNameToNumber).filter(num => num !== undefined);
            }
        }
        return []; // Return empty array if no off days specified
    }

    // Function to get current doctor's visiting days as day numbers
    function getCurrentDoctorVisitingDays() {
        if (currentBookingSession.doctor && currentBookingSession.doctor.name) {
            const doctor = doctorsDatabase.find(doc => doc.name === currentBookingSession.doctor.name);
            if (doctor && doctor.visitingDays && Array.isArray(doctor.visitingDays)) {
                return doctor.visitingDays.map(dayNameToNumber).filter(num => num !== undefined);
            }
        }
        return []; // Return empty array if no visiting days specified
    }

    // Function to check if a day is bookable (follows visiting days and off days logic)
    function isDayBookable(dayNumber) {
        const visitingDays = getCurrentDoctorVisitingDays();
        const offDays = getCurrentDoctorOffDays();

        // If it's an off day, it's not bookable
        if (offDays.includes(dayNumber)) {
            return false;
        }

        // If visiting days are specified, the day must be in visiting days
        if (visitingDays.length > 0) {
            return visitingDays.includes(dayNumber);
        }

        // If no visiting days specified, any day that's not an off day is bookable
        return true;
    }

    // Function to generate 8-day date cards
    function generateDateCards() {
        const dateGrid = document.querySelector('.date-grid');
        const currentMonthEl = document.getElementById('current-month');

        if (!dateGrid) return;

        // Clear existing date cards
        dateGrid.innerHTML = '';

        // Get tomorrow's date (users can't book for today)
        const today = BangladeshTimezone.create();
        let startDate = BangladeshTimezone.create(today);
        startDate.setDate(today.getDate() + 1);

        // If tomorrow is not bookable, skip to the next available day
        while (!isDayBookable(startDate.getDay())) {
            startDate.setDate(startDate.getDate() + 1);
        }

        const currentDate = startDate.getDate();
        const currentMonth = startDate.getMonth();
        const currentYear = startDate.getFullYear();

        // Get days in current month
        const daysInCurrentMonth = BangladeshTimezone.create(new Date(currentYear, currentMonth + 1, 0).toISOString()).getDate();

        // Month names in Bengali
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Update current month display
        if (currentMonthEl) {
            currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }

        let monthTransitionAdded = false;
        let cardsGenerated = 0;
        let dateOffset = 0;

        // Generate 8 date cards with non-bookable days shown as OFF when they appear in the cycle
        while (cardsGenerated < 8) {
            // Create date directly without timezone conversions to avoid date shifting
            const targetDate = new Date(currentYear, currentMonth, currentDate + dateOffset);
            const dateNum = targetDate.getDate();
            const dayName = dayNames[targetDate.getDay()];
            const targetMonth = targetDate.getMonth();
            const dayNumber = targetDate.getDay();
            
            // Create ISO date string manually to avoid timezone issues
            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const day = String(targetDate.getDate()).padStart(2, '0');
            const isoDateString = `${year}-${month}-${day}`;

            const dateCard = document.createElement('div');
            dateCard.className = 'date-card';

            // Check if this day is bookable based on visiting days and off days
            const isBookable = isDayBookable(dayNumber);
            
            // Mark non-bookable days as off-day
            if (!isBookable) {
                dateCard.classList.add('off-day');
            }

            // Set data attributes
            dateCard.setAttribute('data-date', dateNum.toString().padStart(2, '0'));
            dateCard.setAttribute('data-day', dayName);
            dateCard.setAttribute('data-full-date', isoDateString);

            // Handle month transition
            if (targetMonth !== currentMonth && !monthTransitionAdded) {
                // Add month transition card first
                const transitionCard = document.createElement('div');
                transitionCard.className = 'date-card month-transition-card off-day';
                transitionCard.innerHTML = `
                    <div class="date-number">${monthNames[targetMonth]}</div>
                    <div class="date-day">Next Month</div>
                `;
                dateGrid.appendChild(transitionCard);
                monthTransitionAdded = true;

                // Now add the 1st date card of next month
                dateCard.innerHTML = `
                    <div class="date-number">01</div>
                    <div class="date-day">${dayName}</div>
                `;
            } else {
                dateCard.innerHTML = `
                    <div class="date-number">${dateNum}</div>
                    <div class="date-day">${dayName}</div>
                `;
            }

            // Add OFF label for non-bookable days
            if (!isBookable) {
                const offLabel = document.createElement('div');
                offLabel.className = 'off-label';
                offLabel.innerHTML = '<i class="fas fa-calendar-times"></i> OFF';
                dateCard.appendChild(offLabel);
            }

            dateGrid.appendChild(dateCard);

            // Add click event listener for bookable days only
            if (isBookable) {
                dateCard.addEventListener('click', function() {
                    // Check if card is disabled
                    if (this.classList.contains('disabled')) {
                        return;
                    }

                    // Remove selected class from all date cards
                    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));

                    // Add selected class to clicked card
                    this.classList.add('selected');

                    const date = this.getAttribute('data-date');
                    const day = this.getAttribute('data-day');
                    const fullDate = this.getAttribute('data-full-date');

                    // Update appointment availability info
                    updateAppointmentAvailability(date, day, fullDate);

                    console.log(`Date selected: ${date} ${day} (${fullDate})`);
                });
            }

            cardsGenerated++;
            dateOffset++;
        }

        // Update booking stock for the new dates
        updateBookingStockForDynamicDates();
        updateDateCardsAvailability();
    }

    // Function to update booking stock for dynamic dates
    function updateBookingStockForDynamicDates() {
        // Clear existing stock
        Object.keys(bookingStock).forEach(key => delete bookingStock[key]);

        // Add stock for new dates
        const dateCards = document.querySelectorAll('.date-card:not(.off-day)');
        dateCards.forEach(card => {
            const date = card.getAttribute('data-date');
            if (date) {
                bookingStock[date] = { booked: 0, total: 5 };
            }
        });
    }

    // Function to initialize availability display with default values
    function initializeAvailabilityDisplay() {
        const availableBadge = document.querySelector('.available-badge');
        const bookingInfo = document.querySelector('.booking-info');
        const appointmentDateEl = document.querySelector('.appointment-date');

        // Get current doctor's booking slot
        const currentDoctor = currentBookingSession.doctor;
        let doctorBookingSlot = 2; // Default

        if (currentDoctor && currentDoctor.name) {
            const doctor = doctorsDatabase.find(doc => doc.name === currentDoctor.name);
            if (doctor) {
                doctorBookingSlot = doctor.bookingSlot || 2;
            }
        }

        if (availableBadge) {
            availableBadge.textContent = `Available-${doctorBookingSlot}`;
        }

        if (bookingInfo) {
            bookingInfo.textContent = `0 Bookings Out of ${doctorBookingSlot}`;
        }

        if (appointmentDateEl) {
            appointmentDateEl.textContent = 'Please select a date to see availability';
        }
    }

    // Function to simulate successful booking
    function simulateSuccessfulBooking(date) {
        if (bookingStock[date]) {
            bookingStock[date].booked += 1;
            updateDateCardsAvailability();

            // If a date is currently selected and it's the booked date, update the display
            const selectedDate = document.querySelector('.date-card.selected');
            if (selectedDate && selectedDate.getAttribute('data-date') === date) {
                const day = selectedDate.getAttribute('data-day');
                updateAppointmentAvailability(date, day);
            }

            console.log(`Booking successful for ${date}. Stock:`, bookingStock[date]);
        }
    }

    // Initialize dynamic date generation and availability display when screen loads
    if (document.getElementById('select-datetime-screen')) {
        generateDateCards();
        initializeAvailabilityDisplay();
    }

    // Show appointment details function
    window.showAppointmentDetails = function(appointmentId) {
        const appointment = PointsSystem.data.appointments.find(apt => apt.id == appointmentId);
        if (appointment) {
            let statusMessage = '';
            if (appointment.status === 'pending') {
                statusMessage = 'Your payment is being verified. This may take 2-24 hours.';
            } else if (appointment.status === 'active') {
                statusMessage = 'Your appointment is confirmed. You will receive a reminder SMS.';
            } else if (appointment.status === 'completed') {
                statusMessage = 'This appointment has been completed.';
            }

            const detailsMessage = `Appointment Details:\n\n` +
                `Booking ID: ${appointment.bookingId}\n` +
                `Doctor: ${appointment.doctorName} (${appointment.doctorCategory})\n` +
                `Patient: ${appointment.patientName}\n` +
                `Date: ${appointment.appointmentDate}\n` +
                `Time: ${appointment.appointmentTime}\n` +
                `Location: ${appointment.patientAddress}\n` +
                `Status: ${appointment.status.toUpperCase()}\n` +
                (appointment.transactionId ? `Transaction ID: ${appointment.transactionId}\n` : '') +
                `\n${statusMessage}`;

            CustomDialog.alert(detailsMessage, 'Appointment Details');
        } else {
            CustomDialog.alert('Appointment not found.', 'Error');
        }
    };

    // Admin function to approve appointment (exposed for demo purposes)
    // For demo: To test approval, open console and call: approveAppointment('APPOINTMENT_ID')
    window.approveAppointment = async function(appointmentId) {
        console.log(`Admin attempting to approve appointment: ${appointmentId}`);
        
        const appointment = PointsSystem.data.appointments.find(apt => apt.id == appointmentId);
        if (appointment && appointment.status === 'pending') {
            // Update appointment status to active
            appointment.status = 'active';
            appointment.approvedBy = 'Admin';
            appointment.approvedDate = new Date().toISOString();
            
            console.log(`Appointment ${appointmentId} approved by admin`);
            
            // Use Points System approval function to award points and handle notifications
            await PointsSystem.approveAppointment(appointmentId);
            
            // Refresh appointment display if currently viewing appointments
            await PointsSystem.updateAppointmentDisplay();
            
            console.log('Appointment approved successfully:', appointment);
            
            return {
                success: true,
                message: `Appointment ${appointment.bookingId} for ${appointment.patientName} with ${appointment.doctorName} has been approved.`,
                appointment: appointment
            };
        } else if (appointment && appointment.status !== 'pending') {
            console.log(`Appointment ${appointmentId} is not pending (current status: ${appointment.status})`);
            return {
                success: false,
                message: `Appointment ${appointmentId} cannot be approved. Current status: ${appointment.status}`,
                appointment: appointment
            };
        } else {
            console.log(`Appointment ${appointmentId} not found`);
            return {
                success: false,
                message: `Appointment ${appointmentId} not found.`,
                appointment: null
            };
        }
    };

    // Admin function to get all pending appointments for approval
    window.getPendingAppointments = function() {
        const pendingAppointments = PointsSystem.data.appointments.filter(apt => apt.status === 'pending');
        console.log('Pending appointments:', pendingAppointments);
        return pendingAppointments;
    };

    // Admin function to approve all pending appointments (for testing)
    window.approveAllPendingAppointments = function() {
        const pendingAppointments = PointsSystem.data.appointments.filter(apt => apt.status === 'pending');
        const results = [];
        
        pendingAppointments.forEach(appointment => {
            const result = approveAppointment(appointment.id);
            results.push(result);
        });
        
        console.log('Bulk approval results:', results);
        return results;
    };

    // Blood donors database - now sourced from Supabase via window.donorsDatabase
    const donorsDatabase = window.donorsDatabase;

    // Doctors database - now sourced from Supabase via window.doctorsDatabase
    const doctorsDatabase = window.doctorsDatabase;

    // Category configuration mapping
    const categoryConfig = {
        'cardiology': {
            title: 'Cardiologist',
            subtitle: 'Find Best Cardiologist In Rangpur',
            searchTerms: ['cardiac', 'cardiology', 'cardiologist', 'heart']
        },
        'oncology': {
            title: 'Oncologist',
            subtitle: 'Find Best Oncologist In Rangpur',
            searchTerms: ['oncology', 'oncologist', 'cancer']
        },
        'pulmonology': {
            title: 'Pulmonologist',
            subtitle: 'Find Best Pulmonologist In Rangpur',
            searchTerms: ['pulmonology', 'pulmonologist', 'lung', 'pulmonol']
        },
        'pediatrics': {
            title: 'Pediatrician',
            subtitle: 'Find Best Pediatrician In Rangpur',
            searchTerms: ['pediatrics', 'pediatrician', 'child', 'pediatric']
        },
        'dentists': {
            title: 'Dentist',
            subtitle: 'Find Best Dentist In Rangpur',
            searchTerms: ['dentist', 'dental', 'tooth']
        },
        'neurology': {
            title: 'Neurologist',
            subtitle: 'Find Best Neurologist In Rangpur',
            searchTerms: ['neurology', 'neurologist', 'brain', 'neurolog']
        },
        'orthopedics': {
            title: 'Orthopedist',
            subtitle: 'Find Best Orthopedist In Rangpur',
            searchTerms: ['orthopedics', 'orthopedist', 'bone', 'orthoped']
        },
        'gynecology': {
            title: 'Gynecologist',
            subtitle: 'Find Best Gynecologist In Rangpur',
            searchTerms: ['gynecology', 'gynecologist', 'women', 'gynecolo']
        },
        'ent': {
            title: 'ENT Specialist',
            subtitle: 'Find Best ENT Specialist In Rangpur',
            searchTerms: ['ent', 'ear', 'nose', 'throat']
        },
        'dermatology': {
            title: 'Dermatologist',
            subtitle: 'Find Best Dermatologist In Rangpur',
            searchTerms: ['dermatology', 'dermatologist', 'skin', 'dermatol']
        },
        'endocrinology': {
            title: 'Endocrinologist',
            subtitle: 'Find Best Endocrinologist In Rangpur',
            searchTerms: ['endocrinology', 'endocrinologist', 'hormone', 'endocrin']
        },
        'gastroenterology': {
            title: 'Gastroenterologist',
            subtitle: 'Find Best Gastroenterologist In Rangpur',
            searchTerms: ['gastroenterology', 'gastroenterologist', 'stomach', 'gastro']
        },
        'urology': {
            title: 'Urologist',
            subtitle: 'Find Best Urologist In Rangpur',
            searchTerms: ['urology', 'urologist', 'kidney']
        },
        'ophthalmology': {
            title: 'Ophthalmologist',
            subtitle: 'Find Best Ophthalmologist In Rangpur',
            searchTerms: ['ophthalmology', 'ophthalmologist', 'eye', 'ophthalm']
        },
        'psychiatry': {
            title: 'Psychiatrist',
            subtitle: 'Find Best Psychiatrist In Rangpur',
            searchTerms: ['psychiatry', 'psychiatrist', 'mental']
        },
        'surgery': {
            title: 'Surgeon',
            subtitle: 'Find Best Surgeon In Rangpur',
            searchTerms: ['surgery', 'surgeon', 'operation']
        },
        'nephrology': {
            title: 'Nephrologist',
            subtitle: 'Find Best Nephrologist In Rangpur',
            searchTerms: ['nephrology', 'nephrologist', 'kidney', 'nephrol']
        },
        'rheumatology': {
            title: 'Rheumatologist',
            subtitle: 'Find Best Rheumatologist In Rangpur',
            searchTerms: ['rheumatology', 'rheumatologist', 'joint', 'rheumat']
        },
        'anesthesiology': {
            title: 'Anesthesiologist',
            subtitle: 'Find Best Anesthesiologist In Rangpur',
            searchTerms: ['anesthesiology', 'anesthesiologist', 'anesthes']
        },
        'pathology': {
            title: 'Pathologist',
            subtitle: 'Find Best Pathologist In Rangpur',
            searchTerms: ['pathology', 'pathologist', 'lab']
        },
        'plastic-surgery': {
            title: 'Plastic Surgeon',
            subtitle: 'Find Best Plastic Surgeon In Rangpur',
            searchTerms: ['plastic', 'surgery', 'surgeon']
        },
        'medicine': {
            title: 'Medicine',
            subtitle: 'Find Best Medicine Specialists In Rangpur',
            searchTerms: ['medicine', 'emergency', 'urgent', 'trauma', 'general medicine']
        },
        'physiotherapy': {
            title: 'Physiotherapist',
            subtitle: 'Find Best Physiotherapist In Rangpur',
            searchTerms: ['physiotherapy', 'physiotherapist', 'physical', 'physio']
        },
        'nutrition': {
            title: 'Nutritionist',
            subtitle: 'Find Best Nutritionist In Rangpur',
            searchTerms: ['nutrition', 'nutritionist', 'diet']
        }
    };

    // Initialize search screen
    function initializeSearchScreen() {
        const searchInput = document.getElementById('doctor-search-input');
        const clearBtn = document.getElementById('clear-search-btn');
        const resultsContainer = document.getElementById('search-results-list');
        const noResultsState = document.getElementById('no-results-state');
        const resultsTitle = document.getElementById('search-results-title');
        const resultsCount = document.getElementById('search-results-count');

        // Clear search input and show all doctors
        if (searchInput) {
            searchInput.value = '';
            clearBtn.style.display = 'none';
        }

        // Display all doctors initially
        displaySearchResults(doctorsDatabase, 'All Doctors');

        // Search input event listeners
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchQuery = this.value.trim().toLowerCase();

                // Show/hide clear button
                if (clearBtn) {
                    clearBtn.style.display = searchQuery ? 'flex' : 'none';
                }

                // Filter doctors
                if (searchQuery === '') {
                    displaySearchResults(doctorsDatabase, 'All Doctors');
                } else {
                    const filteredDoctors = doctorsDatabase.filter(doctor =>
                        doctor.name.toLowerCase().includes(searchQuery) ||
                        doctor.specialty.toLowerCase().includes(searchQuery)
                    );

                    if (filteredDoctors.length > 0) {
                        displaySearchResults(filteredDoctors, `Search results for "${this.value}"`);
                    } else {
                        showNoResults();
                    }
                }
            });

            // Clear search functionality
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    searchInput.value = '';
                    this.style.display = 'none';
                    displaySearchResults(doctorsDatabase, 'All Doctors');
                    searchInput.focus();
                });
            }
        }
    }

    // Global function to sort doctors by rating (descending order: 5.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, etc.)
    // If same rating, then sort by review number (descending - more reviews first)
    function sortDoctorsByRating(doctors) {
        if (!doctors || !Array.isArray(doctors)) {
            console.error('sortDoctorsByRating: Invalid doctors array received', doctors);
            return [];
        }
        
        console.log('Sorting doctors by rating and reviews. Before sorting:', doctors.map(d => `${d.name}: ${d.rating} (${d.reviews} reviews)`));
        
        const sorted = doctors.sort((a, b) => {
            const ratingA = parseFloat(a.rating);
            const ratingB = parseFloat(b.rating);
            
            // First sort by rating (descending)
            if (ratingA !== ratingB) {
                return ratingB - ratingA;
            }
            
            // If ratings are the same, sort by review number (descending - more reviews first)
            const reviewsA = parseInt(a.reviews);
            const reviewsB = parseInt(b.reviews);
            return reviewsB - reviewsA;
        });
        
        console.log('After sorting by rating and reviews:', sorted.map(d => `${d.name}: ${d.rating} (${d.reviews} reviews)`));
        return sorted;
    }

    // Function to populate Top Now sections with sorted doctors (5.0 and 4.9 ratings only)
    function populateTopNowSections() {
        // Get all Top Now sections (both home and specialist screens)
        const topNowSections = document.querySelectorAll('.top-doctors .doctors-list');
        
        if (topNowSections.length === 0) return;
        
        // Filter doctors with 5.0 and 4.9 ratings only
        const topRatedDoctors = doctorsDatabase.filter(doctor => {
            const rating = parseFloat(doctor.rating);
            return rating >= 4.9;
        });
        
        // Sort the filtered doctors by rating
        const sortedTopDoctors = sortDoctorsByRating([...topRatedDoctors]);
        
        topNowSections.forEach(section => {
            // Clear existing content
            section.innerHTML = '';
            
            // Add sorted top-rated doctors
            sortedTopDoctors.forEach(doctor => {
                const doctorCard = document.createElement('div');
                doctorCard.className = 'doctor-card';
                
                doctorCard.innerHTML = `
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-photo">
                    <div class="doctor-info">
                        <h3>${doctor.name}</h3>
                        <p>${getCategoryWithBangla(doctor.specialty)}</p>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${doctor.rating} (${doctor.reviews})</span>
                        </div>
                    </div>
                    <i class="far fa-heart favorite-icon"></i>
                `;
                
                // Add click listener
                doctorCard.addEventListener('click', async function(e) {
                    if (e.target.classList.contains('favorite-icon')) {
                        return;
                    }
                    await updateDoctorDetailsScreen(doctor.name, doctor.specialty, doctor.image);
                    switchScreen('doctor-details');
                    console.log(`${doctor.name} profile clicked from top now section`);
                });
                
                section.appendChild(doctorCard);
            });
        });
        
        // Re-setup favorite icons
        setTimeout(() => {
            setupFavoriteIcons();
        }, 100);
        
        console.log(`Top Now sections populated with ${sortedTopDoctors.length} doctors (5.0 and 4.9 ratings only)`);
    }

    // Global function to apply rating-based sorting to all doctor displays
    function applySortingToAllDoctorLists() {
        // Sort and refresh Top Now screen doctor list
        resetDoctorsOrder();
        
        // Populate Top Now sections on both home and specialist screens
        populateTopNowSections();
        
        // Sort search results if they exist
        const searchResults = document.getElementById('search-results-list');
        if (searchResults && searchResults.children.length > 0) {
            displaySearchResults(doctorsDatabase, 'All Doctors');
        }
        
        // Sort specialist category doctors if they exist
        const specialistDoctorsList = document.getElementById('specialist-doctors-list');
        if (specialistDoctorsList && specialistDoctorsList.children.length > 0) {
            const currentCategory = document.querySelector('.specialist-item.active')?.getAttribute('data-category');
            if (currentCategory) {
                const categoryDoctors = doctorsDatabase.filter(doctor => doctor.category === currentCategory);
                displaySpecialistCategoryDoctors(categoryDoctors);
            }
        }
        
        console.log('Applied rating-based sorting to all doctor lists: 5.0 → 4.9 → 4.8 → 4.7 → 4.6 → 4.5 → 4.4');
    }

    // Expose functions globally for Supabase integration
    window.populateTopNowSections = populateTopNowSections;
    window.applySortingToAllDoctorLists = applySortingToAllDoctorLists;

    // Function to display search results
    function displaySearchResults(doctors, title) {
        const resultsContainer = document.getElementById('search-results-list');
        const noResultsState = document.getElementById('no-results-state');
        const resultsTitle = document.getElementById('search-results-title');
        const resultsCount = document.getElementById('search-results-count');

        if (!resultsContainer) return;

        // Hide no results state
        if (noResultsState) {
            noResultsState.style.display = 'none';
        }

        // Update title and count
        if (resultsTitle) {
            resultsTitle.textContent = title;
        }
        if (resultsCount) {
            resultsCount.textContent = `(${doctors.length} doctor${doctors.length !== 1 ? 's' : ''})`;
        }

        // Clear existing results
        resultsContainer.innerHTML = '';

        // Sort doctors by rating before displaying
        const sortedDoctors = sortDoctorsByRating([...doctors]);

        // Create doctor cards
        sortedDoctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';

            doctorCard.innerHTML = `
                <img src="${doctor.image}" alt="${doctor.name}" class="doctor-photo">
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p>${getCategoryWithBangla(doctor.specialty)}</p>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${doctor.rating} (${doctor.reviews})</span>
                    </div>
                </div>
                <i class="far fa-heart favorite-icon"></i>
            `;

            // Add click listener for doctor card
            doctorCard.addEventListener('click', async function(e) {
                // Don't trigger if favorite icon is clicked
                if (e.target.classList.contains('favorite-icon')) {
                    return;
                }

                // Update doctor details screen with clicked doctor's info
                await updateDoctorDetailsScreen(doctor.name, doctor.specialty, doctor.image);

                // Switch to doctor details screen
                switchScreen('doctor-details');
                console.log(`${doctor.name} profile clicked from search`);
            });

            resultsContainer.appendChild(doctorCard);
        });

        // Re-setup favorite icons after creating new cards
        setTimeout(() => {
            setupFavoriteIcons();
        }, 100);
    }

    // Function to show no results state
    function showNoResults() {
        const resultsContainer = document.getElementById('search-results-list');
        const noResultsState = document.getElementById('no-results-state');
        const resultsTitle = document.getElementById('search-results-title');
        const resultsCount = document.getElementById('search-results-count');

        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }

        if (noResultsState) {
            noResultsState.style.display = 'flex';
        }

        if (resultsTitle) {
            resultsTitle.textContent = 'Search Results';
        }
        if (resultsCount) {
            resultsCount.textContent = '(0 doctors)';
        }
    }

    // Global function to clear search input
    window.clearSearchInput = function() {
        const searchInput = document.getElementById('doctor-search-input');
        const clearBtn = document.getElementById('clear-search-btn');

        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }

        displaySearchResults(doctorsDatabase, 'All Doctors');
    };

    // Ambulance Screen Functionality
    function initializeAmbulanceScreen() {
        // Initialize ambulance hero slider
        initializeAmbulanceHeroSlider();

        // Setup ambulance tabs
        setupAmbulanceTabs();

        // Setup ambulance FAQ
        setupAmbulanceFAQ();

        // Setup book ambulance button
        setupBookAmbulanceButton();

        // Initialize nearby ambulance tab functionality
        initializeNearbyAmbulanceTab();

        // Initialize ambulance history tab functionality
        initializeAmbulanceHistoryTab();

        // Initialize driver profile popup
        initializeDriverProfilePopup();

        // Initialize driver booking popup
        initializeDriverBookingPopup();

        // Check for any pending approval notifications
        checkAndShowAmbulanceApprovalNotifications();

        console.log('Ambulance screen initialized');
    }

    // Ambulance hero slider functionality
    function initializeAmbulanceHeroSlider() {
        const ambulanceSlides = document.querySelectorAll('.ambulance-slide');
        let currentAmbulanceSlide = 0;

        function showAmbulanceSlide(index) {
            ambulanceSlides.forEach(slide => slide.classList.remove('active'));
            if (ambulanceSlides[index]) {
                ambulanceSlides[index].classList.add('active');
            }
        }

        function nextAmbulanceSlide() {
            currentAmbulanceSlide = (currentAmbulanceSlide + 1) % ambulanceSlides.length;
            showAmbulanceSlide(currentAmbulanceSlide);
        }

        // Auto-advance slides every 5 seconds
        if (ambulanceSlides.length > 0) {
            setInterval(nextAmbulanceSlide, 5000);
        }
    }

    // Ambulance tabs functionality
    function setupAmbulanceTabs() {
        const ambulanceTabButtons = document.querySelectorAll('.ambulance-tab-button');
        const ambulanceTabContents = document.querySelectorAll('.ambulance-tab-content');

        ambulanceTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetAmbulanceTab = this.getAttribute('data-ambulance-tab');

                // Update ambulance tab buttons
                ambulanceTabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Update ambulance tab content
                ambulanceTabContents.forEach(content => content.classList.remove('active'));
                const targetAmbulanceContent = document.getElementById(targetAmbulanceTab + '-tab');
                if (targetAmbulanceContent) {
                    targetAmbulanceContent.classList.add('active');
                }

                // Refresh ambulance history when switching to history tab
                if (targetAmbulanceTab === 'ambulance-history') {
                    populateAmbulanceBookingHistory();
                }

                console.log(`Ambulance tab switched to: ${targetAmbulanceTab}`);
            });
        });
    }

    // Ambulance FAQ functionality
    function setupAmbulanceFAQ() {
        const ambulanceFaqQuestions = document.querySelectorAll('.ambulance-faq-question');
        
        if (ambulanceFaqQuestions.length === 0) {
            console.warn('No ambulance FAQ questions found');
            return;
        }

        console.log(`Setting up ${ambulanceFaqQuestions.length} ambulance FAQ items`);

        ambulanceFaqQuestions.forEach(question => {
            const clone = question.cloneNode(true);
            question.parentNode.replaceChild(clone, question);
        });

        const freshAmbulanceFaqQuestions = document.querySelectorAll('.ambulance-faq-question');
        
        freshAmbulanceFaqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const targetAmbulanceFaq = this.getAttribute('data-ambulance-faq');
                const targetAmbulanceAnswer = document.getElementById(targetAmbulanceFaq);

                // Check if this FAQ is currently open
                const isCurrentlyOpen = this.classList.contains('active');

                // Close all FAQ items
                freshAmbulanceFaqQuestions.forEach(q => {
                    q.classList.remove('active');
                });

                const allAmbulanceAnswers = document.querySelectorAll('.ambulance-faq-answer');
                allAmbulanceAnswers.forEach(answer => {
                    answer.classList.remove('open');
                });

                // If the clicked FAQ wasn't open, open it
                if (!isCurrentlyOpen) {
                    this.classList.add('active');
                    if (targetAmbulanceAnswer) {
                        targetAmbulanceAnswer.classList.add('open');
                    }
                }

                console.log(`Ambulance FAQ ${targetAmbulanceFaq} ${isCurrentlyOpen ? 'closed' : 'opened'}`);
            });
        });
    }

    // Book ambulance button functionality
    function setupBookAmbulanceButton() {
        const bookAmbulanceBtn = document.querySelector('.book-ambulance-btn');
        if (bookAmbulanceBtn) {
            bookAmbulanceBtn.addEventListener('click', function() {
                console.log('Book an ambulance clicked');
                openBookAmbulancePopup();
            });
        }
    }

    // Nearby ambulance tab functionality
    function initializeNearbyAmbulanceTab() {
        populateNearbyAmbulancesList();
    }

    // Function to populate nearby ambulances list
    async function populateNearbyAmbulancesList() {
        const nearbyAmbulancesList = document.getElementById('ambulance-list');
        if (!nearbyAmbulancesList) return;

        nearbyAmbulancesList.innerHTML = '<div class="loading-state">Loading ambulances...</div>';

        try {
            // Fetch drivers from Supabase
            const drivers = await window.dbService.getDrivers();
            
            // Filter only available drivers
            const availableDrivers = drivers.filter(driver => 
                driver.status === 'available' || driver.status === 'active' || !driver.status
            );

            nearbyAmbulancesList.innerHTML = '';

            if (availableDrivers.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'ambulance-history-empty-state';
                emptyState.innerHTML = `
                    <i class="fas fa-ambulance"></i>
                    <h4>No Ambulances Available</h4>
                    <p>No ambulances are currently available in your area.</p>
                `;
                nearbyAmbulancesList.appendChild(emptyState);
            } else {
                availableDrivers.forEach(driver => {
                    const ambulanceCard = createAmbulanceCard(driver);
                    nearbyAmbulancesList.appendChild(ambulanceCard);
                });
            }

            console.log(`Populated ${availableDrivers.length} nearby ambulances from Supabase`);
        } catch (error) {
            console.error('Error loading ambulances:', error);
            nearbyAmbulancesList.innerHTML = `
                <div class="ambulance-history-empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Error Loading Ambulances</h4>
                    <p>Unable to load ambulances. Please try again later.</p>
                </div>
            `;
        }
    }

    // Function to create ambulance card
    function createAmbulanceCard(driver) {
        const card = document.createElement('div');
        card.className = 'ambulance-card';

        // Use driver data from Supabase
        const driverImage = driver.photo || 'https://i.ibb.co.com/0pkSwGNX/create-a-smiling-bangladeshi-ambulance-driver-am.png';
        const driverName = driver.name || 'Md. Rahman';
        const ambulanceType = driver.ambulance_type || 'Emergency Ambulance';
        const location = driver.address || driver.location || `${driver.district || ''}, ${driver.upazila || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Rangpur, Rangpur Sadar';
        const registrationNumber = driver.ambulance_registration_number || 'N/A';

        card.innerHTML = `
            <div class="profile-section">
                <div class="profile-image">
                    <img src="${driverImage}" alt="${driverName}">
                </div>
                <div class="profile-info">
                    <div class="name">${driverName}</div>
                    <div class="location">${location}</div>
                    <div class="details">
                        <div class="detail-line">Type: ${ambulanceType}</div>
                        <div class="detail-line">Reg: ${registrationNumber}</div>
                    </div>
                </div>
            </div>
            <div class="status-section">
                <div class="status">
                    <div class="status-dot"></div>
                    <span class="status-text">Available</span>
                </div>
                <button class="driver-details-btn" onclick="openDriverProfilePopup('${driver.id}')">
                    Details
                </button>
            </div>
        `;

        return card;
    }

    // Function to call ambulance
    window.callAmbulance = async function(phoneNumber) {
        console.log(`Calling ambulance: ${phoneNumber}`);
        const shouldCall = await CustomDialog.confirm(`Do you want to call ${phoneNumber}?`, 'Confirm Call');
        if (shouldCall) {
            // In a real app, this would initiate a phone call
            window.open(`tel:${phoneNumber}`);
        }
    };

    // Driver Profile Popup Functions
    window.openDriverProfilePopup = async function(driverId) {
        const popup = document.getElementById('driver-profile-popup');
        if (popup) {
            try {
                // Fetch driver data directly from Supabase
                const driver = await window.dbService.getDriverById(driverId);
                
                if (driver) {
                    // Update popup content with driver data
                    const driverImage = driver.photo || 'https://i.ibb.co.com/0pkSwGNX/create-a-smiling-bangladeshi-ambulance-driver-am.png';
                    document.getElementById('driver-profile-image').src = driverImage;
                    document.getElementById('driver-profile-name').textContent = driver.name || 'Md. Abdul Rahman';
                    const driverLocation = driver.location || `${driver.district || ''}, ${driver.upazila || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Rangpur, Rangpur Sadar';
                    document.getElementById('driver-profile-location').textContent = driverLocation;
                    document.getElementById('driver-ambulance-reg').textContent = driver.ambulance_registration_number || 'N/A';
                    document.getElementById('driver-ambulance-type').textContent = driver.ambulance_type || 'Basic Ambulance';
                    document.getElementById('driver-experience').textContent = driver.experience ? `${driver.experience} Years` : 'N/A';
                    document.getElementById('driver-license').textContent = driver.license || 'N/A';
                    
                    // Store driver data for booking
                    window.currentDriverData = {
                        id: driver.id,
                        name: driver.name,
                        photo: driverImage,
                        ambulanceType: driver.ambulance_type,
                        location: driverLocation
                    };
                }

                popup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                console.log('Driver profile popup opened');
            } catch (error) {
                console.error('Error loading driver profile:', error);
            }
        }
    };

    window.closeDriverProfilePopup = function() {
        const popup = document.getElementById('driver-profile-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Driver profile popup closed');
        }
    };

    // Initialize driver profile popup event listeners
    function initializeDriverProfilePopup() {
        const driverProfilePopupOverlay = document.getElementById('driver-profile-popup');
        if (driverProfilePopupOverlay) {
            driverProfilePopupOverlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeDriverProfilePopup();
                }
            });
        }
    }

    // Driver Booking Popup Functions
    window.openDriverBookingPopup = function() {
        const bookingPopup = document.getElementById('driver-booking-popup');
        const profilePopup = document.getElementById('driver-profile-popup');
        
        if (bookingPopup) {
            // Copy data from profile popup to booking popup
            const driverImage = document.getElementById('driver-profile-image').src;
            const driverName = document.getElementById('driver-profile-name').textContent;
            const driverLocation = document.getElementById('driver-profile-location').textContent;
            const ambulanceType = document.getElementById('driver-ambulance-type').textContent;
            
            document.getElementById('booking-driver-image').src = driverImage;
            document.getElementById('booking-driver-name').textContent = driverName;
            document.getElementById('booking-driver-location').textContent = driverLocation;
            document.getElementById('booking-ambulance-type').textContent = ambulanceType;
            
            // Store for booking submission
            if (window.currentDriverData) {
                window.currentDriverData.displayImage = driverImage;
            }
            
            // Close profile popup and open booking popup
            if (profilePopup) {
                profilePopup.classList.remove('active');
            }
            
            bookingPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Driver booking popup opened');
            
            // Clear any previous validation errors
            clearBookingValidationErrors();
        }
    };

    window.closeDriverBookingPopup = function() {
        const popup = document.getElementById('driver-booking-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Driver booking popup closed');
            
            // Clear form and validation
            const form = document.getElementById('driver-booking-form');
            if (form) {
                form.reset();
                clearBookingValidationErrors();
            }
        }
    };

    // Initialize driver booking popup event listeners
    function initializeDriverBookingPopup() {
        const driverBookingPopupOverlay = document.getElementById('driver-booking-popup');
        if (driverBookingPopupOverlay) {
            driverBookingPopupOverlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeDriverBookingPopup();
                }
            });
        }
    }

    // Upazila options for booking popup
    const bookingUpazilaOptions = {
        rangpur: ['rangpur-sadar', 'mithapukur', 'badarganj', 'gangachara', 'kaunia', 'pirganj', 'pirgachha', 'taraganj'],
        dinajpur: ['dinajpur-sadar', 'birganj', 'birampur', 'biral', 'bochaganj', 'chirirbandar', 'fulbari', 'ghoraghat', 'hakimpur', 'kaharole', 'khansama', 'nawabganj', 'parbatipur'],
        kurigram: ['kurigram-sadar', 'bhurungamari', 'char-rajibpur', 'chilmari', 'phulbari', 'nageshwari', 'rajarhat', 'raomari', 'ulipur'],
        gaibandha: ['gaibandha-sadar', 'fulchhari', 'gobindaganj', 'palashbari', 'sadullapur', 'sughatta', 'sundarganj'],
        lalmonirhat: ['lalmonirhat-sadar', 'aditmari', 'hatibandha', 'kaliganj', 'patgram'],
        nilphamari: ['nilphamari-sadar', 'dimla', 'domar', 'jaldhaka', 'kishoreganj', 'syedpur'],
        panchagarh: ['panchagarh-sadar', 'atwari', 'boda', 'debiganj', 'tetulia'],
        thakurgaon: ['thakurgaon-sadar', 'baliadangi', 'haripur', 'pirganj', 'ranisankail']
    };

    // Update upazila options for booking popup
    window.updateBookingUpazilaOptions = function(type) {
        const districtSelect = document.getElementById(`booking-${type}-district`);
        const upazilaSelect = document.getElementById(`booking-${type}-upazila`);
        
        if (districtSelect && upazilaSelect) {
            const selectedDistrict = districtSelect.value;
            
            // Clear current options
            upazilaSelect.innerHTML = '<option value="">Upazila</option>';
            
            if (selectedDistrict && bookingUpazilaOptions[selectedDistrict]) {
                bookingUpazilaOptions[selectedDistrict].forEach(upazila => {
                    const option = document.createElement('option');
                    option.value = upazila;
                    option.textContent = upazila.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                    upazilaSelect.appendChild(option);
                });
            }
        }
    };

    // Form validation functions
    function validateBookingForm(formData) {
        let isValid = true;
        
        // Clear previous errors
        clearBookingValidationErrors();
        
        // Patient Name validation
        const patientName = formData.get('patientName');
        if (!patientName || patientName.trim().length < 2) {
            showBookingFieldError('booking-patient-name', 'Please enter a valid patient name (at least 2 characters)');
            isValid = false;
        }
        
        // Pickup address validation
        const pickupDistrict = formData.get('pickupDistrict');
        const pickupUpazila = formData.get('pickupUpazila');
        if (!pickupDistrict || !pickupUpazila) {
            showBookingFieldError('booking-pickup', 'Please select both pickup district and upazila');
            isValid = false;
        }
        
        // Destination address validation
        const destinationDistrict = formData.get('destinationDistrict');
        const destinationUpazila = formData.get('destinationUpazila');
        if (!destinationDistrict || !destinationUpazila) {
            showBookingFieldError('booking-destination', 'Please select both destination district and upazila');
            isValid = false;
        }
        
        // Contact number validation
        const contactNumber = formData.get('contactNumber');
        const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
        if (!contactNumber || !phoneRegex.test(contactNumber.replace(/\s/g, ''))) {
            showBookingFieldError('booking-contact', 'Please enter a valid Bangladeshi phone number (01XXXXXXXXX)');
            isValid = false;
        }
        
        // Urgency level validation
        const urgencyLevel = formData.get('urgencyLevel');
        if (!urgencyLevel) {
            showBookingFieldError('booking-urgency', 'Please select an urgency level');
            isValid = false;
        }
        
        return isValid;
    }

    function showBookingFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const fieldElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        if (fieldElement) {
            const fieldContainer = fieldElement.closest('.form-field');
            if (fieldContainer) {
                fieldContainer.classList.add('error');
                fieldContainer.classList.remove('success');
            }
        }
    }

    function clearBookingValidationErrors() {
        const errorElements = document.querySelectorAll('#driver-booking-popup .field-error');
        const fieldContainers = document.querySelectorAll('#driver-booking-popup .form-field');
        
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        fieldContainers.forEach(container => {
            container.classList.remove('error', 'success');
        });
    }

    // Submit driver booking form
    window.submitDriverBooking = async function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const isValid = validateBookingForm(formData);
        
        if (!isValid) return;

        const submitButton = event.target.querySelector('.booking-book-btn');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Booking...';

        try {
            // Get driver and booking data
            const driverName = document.getElementById('booking-driver-name').textContent;
            const driverLocation = document.getElementById('booking-driver-location').textContent;
            const ambulanceType = document.getElementById('booking-ambulance-type').textContent;
            const driverImage = window.currentDriverData?.displayImage || 'https://i.ibb.co.com/0pkSwGNX/create-a-smiling-bangladeshi-ambulance-driver-am.png';
            
            // Create pickup and destination location strings
            const pickupLocation = `${formData.get('pickupUpazila') ? formData.get('pickupUpazila').replace(/-/g, ' ') : ''}, ${formData.get('pickupDistrict') ? formData.get('pickupDistrict').replace(/-/g, ' ') : ''}`.replace(/^, |, $/, '');
            const destinationLocation = `${formData.get('destinationUpazila') ? formData.get('destinationUpazila').replace(/-/g, ' ') : ''}, ${formData.get('destinationDistrict') ? formData.get('destinationDistrict').replace(/-/g, ' ') : ''}`.replace(/^, |, $/, '');

            // Get current user
            const currentUser = AuthSystem.getUser();
            const currentUserId = InMemoryStorage.currentUserId;

            // Prepare data for Supabase ambulance_requests table
            const requestForDB = {
                user_id: currentUser?.supabaseId || null,
                patient_name: formData.get('patientName'),
                pickup_location: pickupLocation,
                pickup_district: formData.get('pickupDistrict'),
                pickup_upazila: formData.get('pickupUpazila'),
                destination_location: destinationLocation,
                destination_district: formData.get('destinationDistrict'),
                destination_upazila: formData.get('destinationUpazila'),
                ambulance_type: ambulanceType,
                priority_level: formData.get('urgencyLevel'),
                contact_number: formData.get('contactNumber'),
                status: 'pending',
                request_time: BangladeshTimezone.toISOString(),
                driver_id: window.currentDriverData?.id || null,
                driver_name: driverName,
                booking_type: 'driver_booking'
            };

            // Save to Supabase
            const savedRequest = await window.userSupabaseHandlers.requestAmbulance(requestForDB);

            // Generate local display data
            const bookingId = `DRV${savedRequest.id}`;
            
            // Determine fare based on ambulance type
            let fare = '৳500';
            if (ambulanceType.toLowerCase().includes('basic')) {
                fare = '৳500';
            } else if (ambulanceType.toLowerCase().includes('advanced')) {
                fare = '৳800';
            } else if (ambulanceType.toLowerCase().includes('icu')) {
                fare = '৳1200';
            } else {
                fare = '৳600';
            }

            const driverBookedData = {
                id: savedRequest.id,
                bookingId: bookingId,
                bookingDate: BangladeshTimezone.toISOString(),
                driverName: driverName,
                driverLocation: driverLocation,
                ambulanceType: ambulanceType,
                driverImage: driverImage,
                patientName: formData.get('patientName'),
                pickupDistrict: formData.get('pickupDistrict'),
                pickupUpazila: formData.get('pickupUpazila'),
                destinationDistrict: formData.get('destinationDistrict'),
                destinationUpazila: formData.get('destinationUpazila'),
                contactNumber: formData.get('contactNumber'),
                urgencyLevel: formData.get('urgencyLevel'),
                status: 'pending',
                fare: fare,
                userId: currentUserId
            };
            
            // Add to local driver booked history database
            driverBookedHistoryDatabase.unshift(driverBookedData);
            
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Close booking popup
            closeDriverBookingPopup();
            
            // Switch to history tab and refresh
            const historyTabButton = document.querySelector('.ambulance-tab-button[data-ambulance-tab="ambulance-history"]');
            if (historyTabButton) {
                historyTabButton.click();
            }
            
            // Refresh the ambulance booking history
            populateAmbulanceBookingHistory();
            
            // Show confirmation message
            CustomDialog.alert(
                `Driver booking request submitted successfully!\n\nBooking ID: ${bookingId}\nDriver: ${driverName}\nAmbulance Type: ${ambulanceType}\nPatient: ${driverBookedData.patientName}\nPickup: ${pickupLocation}\nDestination: ${destinationLocation}\nContact: ${driverBookedData.contactNumber}\nStatus: Pending Admin Approval\n\nThe admin will review and approve your request soon.`,
                'Driver Booking Submitted'
            );
            
            console.log('Driver booking saved to Supabase:', savedRequest);
        } catch (error) {
            console.error('Error submitting driver booking:', error);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            CustomDialog.alert('Failed to submit booking request. Please try again.', 'Booking Error');
        }
    };

    // Function to book ambulance
    window.bookAmbulance = async function(ambulanceId, ambulanceName) {
        console.log(`Booking ambulance: ${ambulanceName} (${ambulanceId})`);
        const shouldBook = await CustomDialog.confirm(`Do you want to book ${ambulanceName}?`, 'Confirm Booking');
        if (shouldBook) {
            // Open the book ambulance popup with pre-filled data
            openBookAmbulancePopup();

            // You could pre-fill the form with ambulance details here
            setTimeout(() => {
                const ambulanceTypeSelect = document.querySelector('select[name="ambulanceType"]');
                if (ambulanceTypeSelect) {
                    // Set default ambulance type based on the selected ambulance
                    ambulanceTypeSelect.value = 'basic';
                }
            }, 100);
        }
    };

    // Submit ambulance booking
    window.submitAmbulanceBooking = async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const ambulanceBookingData = {
            patientName: formData.get('patientName'),
            patientAge: formData.get('patientAge'),
            patientGender: formData.get('patientGender'),
            pickupDistrict: formData.get('pickupDistrict'),
            pickupUpazila: formData.get('pickupUpazila'),
            destinationDistrict: formData.get('destinationDistrict'),
            destinationUpazila: formData.get('destinationUpazila'),
            ambulanceType: formData.get('ambulanceType'),
            priorityLevel: formData.get('priorityLevel'),
            contactPerson: formData.get('contactPerson'),
            contactMobile: formData.get('contactMobile'),
            medicalCondition: formData.get('medicalCondition'),
            bookingDate: BangladeshTimezone.toISOString()
        };

        // Create pickup and destination location strings
        const pickupLocation = `${ambulanceBookingData.pickupUpazila ? ambulanceBookingData.pickupUpazila.replace(/-/g, ' ') : ''}, ${ambulanceBookingData.pickupDistrict ? ambulanceBookingData.pickupDistrict.replace(/-/g, ' ') : ''}`.replace(/^, |, $/, '');
        const destinationLocation = `${ambulanceBookingData.destinationUpazila ? ambulanceBookingData.destinationUpazila.replace(/-/g, ' ') : ''}, ${ambulanceBookingData.destinationDistrict ? ambulanceBookingData.destinationDistrict.replace(/-/g, ' ') : ''}`.replace(/^, |, $/, '');

        // Validate required fields
        const requiredFields = ['patientName', 'patientAge', 'patientGender', 'pickupDistrict', 'pickupUpazila', 'destinationDistrict', 'destinationUpazila', 'ambulanceType', 'priorityLevel', 'contactPerson', 'contactMobile'];
        const missingFields = requiredFields.filter(field => !ambulanceBookingData[field]);

        if (missingFields.length > 0) {
            CustomDialog.alert('Please fill in all required fields.', 'Form Validation');
            return;
        }

        // Validate mobile number (should be 11 digits)
        if (!/^\d{11}$/.test(ambulanceBookingData.contactMobile)) {
            CustomDialog.alert('Please enter a valid 11-digit mobile number.', 'Invalid Mobile Number');
            return;
        }

        // Validate age (should be reasonable)
        const age = parseInt(ambulanceBookingData.patientAge);
        if (age < 1 || age > 120) {
            CustomDialog.alert('Please enter a valid age.', 'Invalid Age');
            return;
        }

        console.log('Ambulance booking submitted:', ambulanceBookingData);

        // Determine ambulance type text
        let ambulanceTypeText = 'Basic Life Support';
        switch(ambulanceBookingData.ambulanceType) {
            case 'basic':
                ambulanceTypeText = 'Basic Life Support';
                break;
            case 'advanced':
                ambulanceTypeText = 'Advanced Life Support';
                break;
            case 'icu':
                ambulanceTypeText = 'ICU Ambulance';
                break;
        }

        // Generate a unique user session ID if not already present
        let currentUserId = InMemoryStorage.currentUserId;
        if (!currentUserId) {
            currentUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            InMemoryStorage.currentUserId = currentUserId;
            console.log('Generated new user ID:', currentUserId);
        } else {
            console.log('Using existing user ID:', currentUserId);
        }

        try {
            // Get current user
            const currentUser = AuthSystem.getUser();
            
            // Prepare data for Supabase
            const requestForDB = {
                user_id: currentUser?.supabaseId || null,
                patient_name: ambulanceBookingData.patientName,
                patient_age: parseInt(ambulanceBookingData.patientAge),
                patient_gender: ambulanceBookingData.patientGender,
                pickup_location: pickupLocation,
                pickup_district: ambulanceBookingData.pickupDistrict,
                pickup_upazila: ambulanceBookingData.pickupUpazila,
                destination_location: destinationLocation,
                destination_district: ambulanceBookingData.destinationDistrict,
                destination_upazila: ambulanceBookingData.destinationUpazila,
                ambulance_type: ambulanceTypeText,
                priority_level: ambulanceBookingData.priorityLevel,
                contact_person: ambulanceBookingData.contactPerson,
                contact_number: ambulanceBookingData.contactMobile,
                medical_condition: ambulanceBookingData.medicalCondition || '',
                status: 'pending',
                request_time: BangladeshTimezone.toISOString()
            };

            // Save to Supabase
            const savedRequest = await window.userSupabaseHandlers.requestAmbulance(requestForDB);

            // Add the booking to local database for immediate display
            const newBooking = {
                id: savedRequest.id,
                userId: currentUserId,
                patientName: ambulanceBookingData.patientName,
                pickupLocation: pickupLocation,
                destination: destinationLocation,
                pickupDistrict: ambulanceBookingData.pickupDistrict,
                pickupUpazila: ambulanceBookingData.pickupUpazila,
                destinationDistrict: ambulanceBookingData.destinationDistrict,
                destinationUpazila: ambulanceBookingData.destinationUpazila,
                ambulanceType: ambulanceTypeText,
                bookingDate: BangladeshTimezone.toISOString().split('T')[0],
                priority: ambulanceBookingData.priorityLevel.charAt(0).toUpperCase() + ambulanceBookingData.priorityLevel.slice(1),
                status: 'pending',
                driverName: null,
                driverContact: null,
                ambulanceLicense: null,
                driverLicense: null
            };

            ambulanceBookingHistoryDatabase.unshift(newBooking);
            console.log('Ambulance booking created with status and user ID:', {
                id: savedRequest.id,
                status: newBooking.status,
                userId: newBooking.userId
            });

            closeBookAmbulancePopup();

            CustomDialog.alert(`Ambulance booking request submitted!\n\nBooking ID: ${savedRequest.id}\nAmbulance Type: ${ambulanceTypeText}\nStatus: Pending Admin Approval\n\nYou will receive a notification once your booking is approved by the admin.`, 'Booking Submitted');

            // Refresh ambulance history if currently viewing
            populateAmbulanceBookingHistory();

            console.log(`Ambulance booking ${savedRequest.id} added to Supabase and history`);
        } catch (error) {
            console.error('Error submitting ambulance booking:', error);
            CustomDialog.alert('Failed to submit ambulance booking. Please try again.', 'Error');
        }
    };

    // Initialize ambulance history tab functionality
    function initializeAmbulanceHistoryTab() {
        populateAmbulanceBookingHistory();
        console.log('Ambulance history tab initialized');
    }

    // Initialize ambulance screen and check for approval notifications
    function initializeAmbulanceScreenNotifications() {
        // Check for any pending approval notifications when ambulance screen loads
        checkAndShowAmbulanceApprovalNotifications();
        checkAndShowDriverApprovalNotifications();
    }

    // Ensure user has a unique ID for notifications (called on app initialization)
    function ensureUserIdExists() {
        let currentUserId = InMemoryStorage.currentUserId;
        if (!currentUserId) {
            currentUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            InMemoryStorage.currentUserId = currentUserId;
            console.log('Generated new user ID for notifications:', currentUserId);
        }
        return currentUserId;
    }

    // Function to populate ambulance booking history
    function populateAmbulanceBookingHistory() {
        // Check for new approval notifications
        checkAndShowAmbulanceApprovalNotifications();
        checkAndShowDriverApprovalNotifications();
        
        const ambulanceBookingsList = document.getElementById('ambulance-booking-cards-list');
        if (!ambulanceBookingsList) return;

        ambulanceBookingsList.innerHTML = '';

        if (ambulanceBookingHistoryDatabase.length === 0 && driverBookedHistoryDatabase.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'ambulance-history-empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-ambulance"></i>
                <h4>No Ambulance Bookings</h4>
                <p>Your ambulance booking history will appear here when you book ambulances.</p>
            `;
            ambulanceBookingsList.appendChild(emptyState);
        } else {
            // Add driver booked cards first (newest first)
            if (driverBookedHistoryDatabase.length > 0) {
                const sortedDriverBookings = driverBookedHistoryDatabase.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
                sortedDriverBookings.forEach(booking => {
                    const bookingCard = createDriverBookedCard(booking);
                    ambulanceBookingsList.appendChild(bookingCard);
                });
            }
            
            // Add regular ambulance bookings
            if (ambulanceBookingHistoryDatabase.length > 0) {
                const sortedBookings = ambulanceBookingHistoryDatabase.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
                sortedBookings.forEach(booking => {
                    const bookingCard = createAmbulanceBookingCard(booking);
                    ambulanceBookingsList.appendChild(bookingCard);
                });
            }
        }
    }
    
    // Expose function globally for Supabase integration
    window.populateAmbulanceBookingHistory = populateAmbulanceBookingHistory;

    // Function to create ambulance booking card
    function createAmbulanceBookingCard(booking) {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'ambulance-booking-card';

        const formattedDate = new Date(booking.bookingDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        // Get capitalized ambulance type
        const ambulanceType = booking.ambulanceType || 'Basic Ambulance';
        const capitalizedType = ambulanceType.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');

        // Determine what to show based on approval status
        const driverNameDisplay = booking.driverName 
            ? `<div class="ambulance-booking-driver">Driver: ${booking.driverName}</div>` 
            : '';
        const contactDisplay = booking.driverContact 
            ? `<div class="ambulance-booking-contact">Contact: ${booking.driverContact}</div>`
            : `<div class="ambulance-booking-contact">Contact: ${booking.contactMobile || 'Pending Admin Approval'}</div>`;

        bookingCard.innerHTML = `
            <div class="ambulance-booking-content">
                <div class="ambulance-booking-icon">
                    <i class="fas fa-ambulance"></i>
                    <span>Ambulance</span>
                </div>
                <div class="ambulance-booking-info">
                    <div class="ambulance-booking-date">Date: ${formattedDate}</div>
                    <div class="ambulance-booking-patient">Patient: ${booking.patientName}</div>
                    <div class="ambulance-booking-pickup">Pickup: ${booking.pickupLocation || `${booking.pickupUpazila}, ${booking.pickupDistrict}`}</div>
                    <div class="ambulance-booking-destination">Destination: ${booking.destination || `${booking.destinationUpazila}, ${booking.destinationDistrict}`}</div>
                    <div class="ambulance-booking-type-heading">${capitalizedType}</div>
                    ${driverNameDisplay}
                    ${contactDisplay}
                    <div class="ambulance-booking-id">Booking ID: ${booking.id}</div>
                    <div class="ambulance-booking-status-badge ${booking.status.toLowerCase()}">
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                </div>
            </div>
        `;

        return bookingCard;
    }

    // Function to create driver booked card
    function createDriverBookedCard(booking) {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'driver-booked-card';

        const formattedDate = new Date(booking.bookingDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const contactDisplay = booking.driverContact && booking.driverContact !== 'N/A' 
            ? `<div class="driver-booked-contact">Contact: ${booking.driverContact}</div>` 
            : '';

        bookingCard.innerHTML = `
            <div class="driver-booked-content">
                <div class="driver-booked-image">
                    <img src="${booking.driverImage}" alt="${booking.driverName}">
                </div>
                <div class="driver-booked-info">
                    <div class="driver-booked-date">Date: ${formattedDate}</div>
                    <div class="driver-booked-name">Driver: ${booking.driverName}</div>
                    <div class="driver-booked-pickup">Pickup: ${booking.pickupLocation || `${booking.pickupUpazila || ''}, ${booking.pickupDistrict || ''}`.trim().replace(/^,\s*/, '') || 'N/A'}</div>
                    <div class="driver-booked-destination">Destination: ${booking.destination || `${booking.destinationUpazila || ''}, ${booking.destinationDistrict || ''}`.trim().replace(/^,\s*/, '') || 'N/A'}</div>
                    <div class="driver-booked-ambulance-type">${booking.ambulanceType}</div>
                    ${contactDisplay}
                    <div class="driver-booked-reg">Ambulance Reg. No: ${booking.ambulanceRegNo}</div>
                    <div class="driver-booked-id">Booking Id: ${booking.bookingId}</div>
                    <div class="driver-booked-status">
                        <span class="ambulance-booking-status-badge ${booking.status.toLowerCase()}">${booking.status}</span>
                    </div>
                </div>
            </div>
        `;

        return bookingCard;
    }

    // Helper functions for generating IDs
    function generateBookingId() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let result = '';
        
        // Generate format: 2 letters + 5 numbers (e.g., MaAld001)
        result += letters.charAt(Math.floor(Math.random() * letters.length));
        result += letters.charAt(Math.floor(Math.random() * letters.length)).toLowerCase();
        result += letters.charAt(Math.floor(Math.random() * letters.length));
        result += letters.charAt(Math.floor(Math.random() * letters.length)).toLowerCase();
        result += 'd';
        
        for (let i = 0; i < 3; i++) {
            result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        return result;
    }

    function generateAmbulanceRegNo() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let result = '';
        
        // Generate format: DHK-GA-1234
        result += 'DHK-GA-';
        for (let i = 0; i < 4; i++) {
            result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        return result;
    }

    // Missing emergency screen initialization functions (ambulance is already properly defined elsewhere)

    function initializePrivateHospitalScreen() {
        console.log('Private hospital screen initialized');
        // Private hospital screen functionality will be implemented here
    }

    function initializePharmacyScreen() {
        console.log('Pharmacy screen initialized');
        // Pharmacy screen functionality will be implemented here
    }

    // Blood Bank Screen Functionality
    function initializeBloodBankScreen() {
        // Sync donor profile to check if user has already registered
        if (typeof window.userSupabaseHandlers !== 'undefined' && window.userSupabaseHandlers.syncDonorProfile) {
            window.userSupabaseHandlers.syncDonorProfile().then(() => {
                const becomeDonorBtn = document.querySelector('.become-donor-btn');
                if (becomeDonorBtn) {
                    updateDonorButtonState(becomeDonorBtn);
                }
            }).catch(error => {
                console.error('Error syncing donor profile:', error);
            });
        }

        // Initialize blood hero slider
        initializeBloodHeroSlider();

        // Setup blood bank tabs
        setupBloodBankTabs();

        // Reset to default tab (need blood) when screen is opened
        resetBloodBankTabsToDefault();

        // Setup blood FAQ
        setupBloodFAQ();

        // Setup request blood button
        setupRequestBloodButton();

        // Initialize donor tab functionality
        initializeDonorTab();

        // Initialize history tab functionality
        initializeHistoryTab();

        console.log('Blood bank screen initialized');
    }

    // Blood hero slider functionality
    function initializeBloodHeroSlider() {
        const bloodSlides = document.querySelectorAll('.blood-slide');
        let currentBloodSlide = 0;

        function showBloodSlide(index) {
            bloodSlides.forEach(slide => slide.classList.remove('active'));
            if (bloodSlides[index]) {
                bloodSlides[index].classList.add('active');
            }
        }

        function nextBloodSlide() {
            currentBloodSlide = (currentBloodSlide + 1) % bloodSlides.length;
            showBloodSlide(currentBloodSlide);
        }

        // Auto-advance slides every 5 seconds
        if (bloodSlides.length > 0) {
            setInterval(nextBloodSlide, 5000);
        }
    }

    // Blood bank tabs functionality
    function setupBloodBankTabs() {
        const bloodTabButtons = document.querySelectorAll('.blood-tab-button');
        const bloodTabContents = document.querySelectorAll('.blood-tab-content');

        bloodTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetBloodTab = this.getAttribute('data-blood-tab');

                // Update blood tab buttons
                bloodTabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Update blood tab content
                bloodTabContents.forEach(content => content.classList.remove('active'));
                const targetBloodContent = document.getElementById(targetBloodTab + '-tab');
                if (targetBloodContent) {
                    targetBloodContent.classList.add('active');
                }

                console.log(`Blood bank tab switched to: ${targetBloodTab}`);
            });
        });
    }

    // Reset blood bank tabs to default state (need blood tab)
    function resetBloodBankTabsToDefault() {
        const bloodTabButtons = document.querySelectorAll('.blood-tab-button');
        const bloodTabContents = document.querySelectorAll('.blood-tab-content');

        // Remove active class from all tabs and contents
        bloodTabButtons.forEach(btn => btn.classList.remove('active'));
        bloodTabContents.forEach(content => content.classList.remove('active'));

        // Set "need blood" tab as active (default)
        const needBloodTabButton = document.querySelector('.blood-tab-button[data-blood-tab="need-blood"]');
        const needBloodTabContent = document.getElementById('need-blood-tab');

        if (needBloodTabButton) {
            needBloodTabButton.classList.add('active');
        }
        if (needBloodTabContent) {
            needBloodTabContent.classList.add('active');
        }

        console.log('Blood bank tabs reset to default: need-blood');
    }

    // Blood FAQ functionality
    function setupBloodFAQ() {
        const bloodFaqQuestions = document.querySelectorAll('.blood-faq-question');
        
        if (bloodFaqQuestions.length === 0) {
            console.warn('No blood FAQ questions found');
            return;
        }

        console.log(`Setting up ${bloodFaqQuestions.length} blood FAQ items`);

        bloodFaqQuestions.forEach(question => {
            const clone = question.cloneNode(true);
            question.parentNode.replaceChild(clone, question);
        });

        const freshBloodFaqQuestions = document.querySelectorAll('.blood-faq-question');
        
        freshBloodFaqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const targetBloodFaq = this.getAttribute('data-blood-faq');
                const targetBloodAnswer = document.getElementById(targetBloodFaq);

                // Check if this FAQ is currently open
                const isCurrentlyOpen = this.classList.contains('active');

                // Close all FAQ items
                freshBloodFaqQuestions.forEach(q => {
                    q.classList.remove('active');
                });

                const allBloodAnswers = document.querySelectorAll('.blood-faq-answer');
                allBloodAnswers.forEach(answer => {
                    answer.classList.remove('open');
                });

                // If the clicked FAQ wasn't open, open it
                if (!isCurrentlyOpen) {
                    this.classList.add('active');
                    if (targetBloodAnswer) {
                        targetBloodAnswer.classList.add('open');
                    }
                }

                console.log(`Blood FAQ ${targetBloodFaq} ${isCurrentlyOpen ? 'closed' : 'opened'}`);
            });
        });
    }

    // Request blood button functionality
    function setupRequestBloodButton() {
        const requestBloodBtn = document.querySelector('.request-blood-btn');
        if (requestBloodBtn) {
            requestBloodBtn.addEventListener('click', function() {
                console.log('Request for blood clicked');
                openBloodRequestPopup();
            });
        }
    }

    // Donor tab functionality
    function initializeDonorTab() {
        // Setup become donor button
        const becomeDonorBtn = document.querySelector('.become-donor-btn');
        if (becomeDonorBtn) {
            // Update button state based on registration status
            updateDonorButtonState(becomeDonorBtn);
            
            becomeDonorBtn.addEventListener('click', function(event) {
                console.log('Become a donor clicked');
                // Always read from InMemoryStorage to get the current value
                const currentUserDonorId = InMemoryStorage.currentUserDonorId;
                console.log('Current user donor ID:', currentUserDonorId);
                
                // Check if user has already registered as a donor
                if (currentUserDonorId) {
                    const existingDonor = donorsDatabase.find(d => String(d.id) === String(currentUserDonorId));
                    console.log('Existing donor found:', existingDonor ? existingDonor.name : 'None');
                    
                    if (existingDonor) {
                        event.preventDefault();
                        event.stopPropagation();
                        
                        CustomDialog.alert(
                            `You have already registered as a donor!\n\nDonor ID: ${currentUserDonorId}\nName: ${existingDonor.name}\nStatus: ${existingDonor.status === 'pending' ? 'Pending Admin Approval' : 'Active'}\n\nYou can only create one donor account per user.`,
                            'Already Registered'
                        );
                        console.log('Registration blocked - user already registered');
                        return false;
                    }
                }
                
                // Allow registration if no existing donor account
                console.log('Opening registration popup - no existing donor found');
                openDonorRegistrationPopup();
            });
        }

        // Setup availability tabs
        const availabilityTabButtons = document.querySelectorAll('.availability-tab-button');
        const availabilityTabContents = document.querySelectorAll('.availability-tab-content');

        availabilityTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetAvailabilityTab = this.getAttribute('data-availability-tab');

                // Update availability tab buttons
                availabilityTabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Update availability tab content
                availabilityTabContents.forEach(content => content.classList.remove('active'));
                const targetAvailabilityContent = document.getElementById(targetAvailabilityTab + '-availability');
                if (targetAvailabilityContent) {
                    targetAvailabilityContent.classList.add('active');
                }

                console.log(`Availability tab switched to: ${targetAvailabilityTab}`);
            });
        });

        // Populate donor availability lists
        populateDonorAvailabilityLists();
    }

    // Function to calculate days since last donation
    function calculateDaysSinceLastDonation(lastDonationDate) {
        const today = new Date();
        const donationDate = new Date(lastDonationDate);
        const timeDifference = today.getTime() - donationDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        return daysDifference;
    }

    // Function to update donor upazila options
    window.updateDonorUpazilaOptions = function() {
        const districtSelect = document.getElementById('donor-district');
        const upazilaSelect = document.getElementById('donor-upazila');

        if (!districtSelect || !upazilaSelect) return;

        const selectedDistrict = districtSelect.value;

        // Clear existing upazila options
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

        // Add new upazila options based on selected district
        if (selectedDistrict && upazilaData[selectedDistrict]) {
            upazilaData[selectedDistrict].forEach(upazila => {
                const option = document.createElement('option');
                option.value = upazila.toLowerCase().replace(/\s+/g, '-');
                option.textContent = upazila;
                upazilaSelect.appendChild(option);
            });
        }

        console.log(`Donor district changed to: ${selectedDistrict}`);
    };

    // Function to search donors
    window.searchDonors = function() {
        const district = document.getElementById('donor-district').value;
        const upazila = document.getElementById('donor-upazila').value;
        const bloodGroup = document.getElementById('donor-blood-group').value;

        if (!district || !upazila || !bloodGroup) {
            CustomDialog.alert('Please select all fields to search for donors.', 'Search Validation');
            return;
        }

        console.log(`Searching donors for: district="${district}", upazila="${upazila}", bloodGroup="${bloodGroup}"`);
        console.log(`Total donors in database: ${donorsDatabase.length}`);

        // Store search parameters for potential refresh after approval
        sessionStorage.setItem('lastSearchParams', JSON.stringify({ district, upazila, bloodGroup }));

        // Filter donors based on search criteria (show approved donors + current user's pending card)
        const filteredDonors = donorsDatabase.filter(donor => {
            // Normalize values for comparison (case-insensitive and format handling)
            const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '-');
            
            const districtMatch = normalizeString(donor.district) === normalizeString(district);
            const upazilaMatch = normalizeString(donor.upazila) === normalizeString(upazila);
            const bloodGroupMatch = donor.bloodGroup === bloodGroup;
            const statusMatch = (donor.status === 'approved' || donor.status == null || typeof donor.status === 'undefined') ||
                               (donor.status === 'pending' && String(donor.id) === String(InMemoryStorage.currentUserDonorId));
            
            
            return districtMatch && upazilaMatch && bloodGroupMatch && statusMatch;
        });

        // Show search results section
        const searchResultsSection = document.getElementById('donor-search-results');
        if (searchResultsSection) {
            searchResultsSection.style.display = 'block';
        }

        // Display search results
        displayDonorSearchResults(filteredDonors);

        console.log(`Found ${filteredDonors.length} matching donors`);
    };

    // Function to display donor search results
    function displayDonorSearchResults(donors) {
        const resultsList = document.getElementById('donor-results-list');
        if (!resultsList) return;

        resultsList.innerHTML = '';

        if (donors.length === 0) {
            const noResultsCard = document.createElement('div');
            noResultsCard.className = 'donor-card';
            noResultsCard.innerHTML = `
                <div class="no-donors-found">
                    <i class="fas fa-search" style="font-size: 48px; color: #BDBDBD; margin-bottom: 16px;"></i>
                    <h4 style="color: #424242; margin-bottom: 8px;">No donors found</h4>
                    <p style="color: #757575; font-size: 14px; text-align: center;">Try searching with different criteria</p>
                </div>
            `;
            noResultsCard.style.textAlign = 'center';
            noResultsCard.style.padding = '40px 20px';
            resultsList.appendChild(noResultsCard);
        } else {
            donors.forEach(donor => {
                const donorCard = createDonorCard(donor);
                resultsList.appendChild(donorCard);
            });
        }
    }

    // Function to create donor card
    function createDonorCard(donor) {
        const donorCard = document.createElement('div');
        donorCard.className = `donor-card ${donor.isReady ? 'ready' : 'not-ready'}`;

        const locationText = `${donor.upazila.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}, ${donor.district.charAt(0).toUpperCase() + donor.district.slice(1)}`;

        const daysSinceLastDonation = calculateDaysSinceLastDonation(donor.lastDonation);


        donorCard.innerHTML = `
            <div class="donor-card-content">
                <img src="${getValidImageSrc(donor.photo)}" alt="${donor.name}" class="donor-photo" onerror="this.onerror=null; this.src='https://i.ibb.co.com/YdR8KfV/donor-1.jpg';">
                <div class="donor-info">
                    <div class="donor-header">
                        <div class="donor-left-info">
                            <div class="donor-name">${donor.name}</div>
                            <div class="donor-location">${locationText}</div>
                            <div class="donor-mobile">
                                <span>${donor.contact || 'N/A'}</span>
                                <button class="copy-mobile-btn" onclick="copyMobileNumber('${donor.contact}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                            <div class="donor-status">
                                <div class="status-dot ${donor.isReady ? 'ready' : 'not-ready'}"></div>
                                <span class="status-text ${donor.isReady ? 'ready' : 'not-ready'}">${donor.isReady ? 'Ready' : 'Not Ready'}</span>
                            </div>
                            <div class="last-donation-info">
                                <span class="last-donation-text">Last donated ${daysSinceLastDonation} days ago</span>
                            </div>
                        </div>
                        <div class="donor-right-info">
                            <div class="blood-group-badge">${donor.bloodGroup}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return donorCard;
    }

    // Helper function to validate and return proper image source
    function getValidImageSrc(photoSrc) {
        // If no photo provided, use default
        if (!photoSrc) {
            return 'https://i.ibb.co.com/YdR8KfV/donor-1.jpg';
        }
        
        // Accept data: URLs (base64), blob: URLs, and http(s) URLs
        if (photoSrc.startsWith('data:') || 
            photoSrc.startsWith('blob:') || 
            /^https?:\/\//.test(photoSrc)) {
            return photoSrc;
        }
        
        // Log rejection and use fallback
        console.warn('Invalid photo URL format, using fallback:', photoSrc.substring(0, 50));
        return 'https://i.ibb.co.com/YdR8KfV/donor-1.jpg';
    }

    // Function to copy mobile number
    window.copyMobileNumber = function(mobileNumber) {
        navigator.clipboard.writeText(mobileNumber).then(() => {
            CustomDialog.alert(`Mobile number ${mobileNumber} copied to clipboard!`, 'Copied to Clipboard');
            console.log(`Mobile number copied: ${mobileNumber}`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            CustomDialog.alert('Failed to copy mobile number', 'Copy Failed');
        });
    };

    // Function to populate donor availability lists
    function populateDonorAvailabilityLists() {
        const readyDonorsList = document.getElementById('ready-donors-list');
        const notReadyDonorsList = document.getElementById('not-ready-donors-list');

        if (!readyDonorsList || !notReadyDonorsList) return;

        // Check for pending approval notifications for current user
        checkAndShowApprovalNotifications();
        
        // Clear existing content
        readyDonorsList.innerHTML = '';
        notReadyDonorsList.innerHTML = '';

        // Separate donors by availability (show approved donors + current user's pending card)
        const visibleDonors = donorsDatabase.filter(donor => 
            // Show approved donors or legacy donors without status
            (donor.status === 'approved' || donor.status == null || typeof donor.status === 'undefined') ||
            // Also show current user's own pending card (normalize string comparison)
            (donor.status === 'pending' && String(donor.id) === String(InMemoryStorage.currentUserDonorId))
        );
        const readyDonors = visibleDonors.filter(donor => donor.isReady);
        const notReadyDonors = visibleDonors.filter(donor => !donor.isReady);

        // Populate ready donors
        if (readyDonors.length === 0) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'donor-card';
            emptyCard.innerHTML = `
                <div class="no-donors-found">
                    <i class="fas fa-user-plus" style="font-size: 48px; color: #4CAF50; margin-bottom: 16px;"></i>
                    <h4 style="color: #424242; margin-bottom: 8px;">No ready donors</h4>
                    <p style="color: #757575; font-size: 14px; text-align: center;">All donors are currently not available</p>
                </div>
            `;
            emptyCard.style.textAlign = 'center';
            emptyCard.style.padding = '40px 20px';
            readyDonorsList.appendChild(emptyCard);
        } else {
            readyDonors.forEach(donor => {
                const donorCard = createDonorCard(donor);
                readyDonorsList.appendChild(donorCard);
            });
        }

        // Populate not ready donors
        if (notReadyDonors.length === 0) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'donor-card';
            emptyCard.innerHTML = `
                <div class="no-donors-found">
                    <i class="fas fa-clock" style="font-size: 48px; color: #E53935; margin-bottom: 16px;"></i>
                    <h4 style="color: #424242; margin-bottom: 8px;">No unavailable donors</h4>
                    <p style="color: #757575; font-size: 14px; text-align: center;">All donors are currently ready to donate</p>
                </div>
            `;
            emptyCard.style.textAlign = 'center';
            emptyCard.style.padding = '40px 20px';
            notReadyDonorsList.appendChild(emptyCard);
        } else {
            notReadyDonors.forEach(donor => {
                const donorCard = createDonorCard(donor);
                notReadyDonorsList.appendChild(donorCard);
            });
        }

        console.log(`Ready donors: ${readyDonors.length}, Not ready donors: ${notReadyDonors.length}`);
    }

    // Function to update donor button state based on registration status
    function updateDonorButtonState(button) {
        if (!button) return;
        
        // Always read from InMemoryStorage to get the current value
        const currentUserDonorId = InMemoryStorage.currentUserDonorId;
        
        if (currentUserDonorId) {
            const existingDonor = donorsDatabase.find(d => String(d.id) === String(currentUserDonorId));
            if (existingDonor) {
                // User has already registered - disable button completely
                button.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    Already Registered
                `;
                button.style.backgroundColor = '#28a745';
                button.style.cursor = 'default';
                button.style.opacity = '0.7';
                button.disabled = true;
                
                // Remove all existing click listeners and add a new one for the alert only
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                newButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    CustomDialog.alert(
                        `You have already registered as a donor!\n\nDonor ID: ${currentUserDonorId}\nName: ${existingDonor.name}\nStatus: ${existingDonor.status === 'pending' ? 'Pending Admin Approval' : 'Active'}\n\nYou can only create one donor account per user.`,
                        'Already Registered'
                    );
                    return false;
                });
                return;
            }
        }
        
        // User hasn't registered yet - show normal button
        button.innerHTML = `
            <i class="fas fa-plus-circle"></i>
            Become a Donor
        `;
        button.style.backgroundColor = '';
        button.style.cursor = 'pointer';
        button.style.opacity = '1';
        button.disabled = false;
    }

    // Pharmacy Screen Functionality
    window.renderPharmacyCards = function() {
        const pharmacyList = document.querySelector('#pharmacy-screen .pharmacy-list');
        if (!pharmacyList) {
            console.error('Pharmacy list container not found');
            return;
        }

        pharmacyList.innerHTML = '';

        if (!window.pharmaciesDatabase || window.pharmaciesDatabase.length === 0) {
            pharmacyList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No pharmacies available at the moment.</p>';
            return;
        }

        window.pharmaciesDatabase.forEach(pharmacy => {
            const pharmacyCard = document.createElement('div');
            pharmacyCard.className = 'pharmacy-card';
            pharmacyCard.innerHTML = `
                <div class="pharmacy-image-container">
                    <img src="${pharmacy.imageUrl}" alt="${pharmacy.name}" class="pharmacy-image">
                    ${pharmacy.discountPercentage > 0 ? `<div class="discount-tag">${pharmacy.discountTag || `Discount: ${pharmacy.discountPercentage}%`}</div>` : ''}
                </div>
                <div class="pharmacy-info">
                    <h3>${pharmacy.name}</h3>
                    <div class="pharmacy-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${pharmacy.location}</span>
                    </div>
                    ${pharmacy.offerInfo ? `<div class="pharmacy-offer">${pharmacy.offerInfo}</div>` : ''}
                </div>
            `;

            pharmacyCard.addEventListener('click', function() {
                openPharmacyInfoPopup(pharmacy.name, pharmacy.location, pharmacy);
            });

            pharmacyList.appendChild(pharmacyCard);
        });

        console.log(`✅ Rendered ${window.pharmaciesDatabase.length} pharmacy cards`);
    };

    function initializePharmacyScreen() {
        // Setup shop medicines button
        setupShopMedicinesButton();

        // Render pharmacy cards from database
        if (typeof window.renderPharmacyCards === 'function') {
            window.renderPharmacyCards();
        }

        console.log('Pharmacy screen initialized');
    }

    // Shop medicines button functionality
    function setupShopMedicinesButton() {
        const shopMedicinesBtn = document.querySelector('.shop-medicines-btn:not(.shop-medicines-popup .shop-medicines-btn)');
        if (shopMedicinesBtn) {
            shopMedicinesBtn.addEventListener('click', function() {
                console.log('Shop medicines clicked');
                openShopMedicinesPopup();
            });
        }
    }

    // Pharmacy card actions
    function setupPharmacyCardActions() {
        const pharmacyCards = document.querySelectorAll('.pharmacy-card');
        pharmacyCards.forEach(card => {
            card.addEventListener('click', function() {
                const pharmacyName = this.querySelector('h3').textContent;
                const pharmacyLocation = this.querySelector('.pharmacy-location span').textContent;
                console.log(`${pharmacyName} clicked`);
                openPharmacyInfoPopup(pharmacyName, pharmacyLocation);
            });
        });
    }

    // Pharmacy Information popup functions
    window.openPharmacyInfoPopup = function(pharmacyName, pharmacyLocation, pharmacyData) {
        const popup = document.getElementById('pharmacy-info-popup');
        if (popup) {
            // Update pharmacy title
            const titleElement = document.getElementById('pharmacy-info-title');
            if (titleElement) {
                titleElement.textContent = pharmacyName;
            }
            
            // Update about section - always reset first to avoid stale data
            const aboutSection = popup.querySelector('.info-section:nth-child(1) p');
            if (aboutSection) {
                if (pharmacyData && pharmacyData.about) {
                    aboutSection.textContent = pharmacyData.about;
                } else {
                    aboutSection.textContent = 'We are a trusted pharmacy committed to providing quality medicines and healthcare services to our community. Our experienced pharmacists are always ready to help with your medical needs and provide professional advice.';
                }
            }
            
            // Update address
            const addressElement = document.getElementById('pharmacy-address');
            if (addressElement) {
                let addressHTML = pharmacyLocation;
                if (pharmacyData && pharmacyData.address) {
                    addressHTML += '<br>' + pharmacyData.address;
                } else {
                    addressHTML += '<br>Near Central Hospital<br>Rangpur - 5400, Bangladesh';
                }
                addressElement.innerHTML = addressHTML;
            }
            
            // Update offer section - always reset first to avoid stale data
            const discountTextElement = popup.querySelector('.discount-text');
            if (discountTextElement) {
                if (pharmacyData && pharmacyData.discountText) {
                    discountTextElement.textContent = pharmacyData.discountText;
                } else if (pharmacyData && pharmacyData.discountPercentage > 0) {
                    discountTextElement.textContent = `${pharmacyData.discountPercentage}% OFF`;
                } else {
                    discountTextElement.textContent = '10% OFF';
                }
            }
            
            const offerInfoElement = popup.querySelector('.offer-info p');
            if (offerInfoElement) {
                if (pharmacyData && pharmacyData.offerInfo) {
                    offerInfoElement.textContent = pharmacyData.offerInfo;
                } else {
                    offerInfoElement.textContent = 'Get discount on all medicines and healthcare products. Special offers available on prescription medicines. Additional discounts for senior citizens and regular customers.';
                }
            }
            
            // Update contact info section
            const contactInfoSection = popup.querySelector('.info-section:nth-child(4) .contact-info');
            if (contactInfoSection && pharmacyData) {
                const contactNumber = pharmacyData.contact || '+880 1750 123456';
                const email = pharmacyData.email || 'info@pharmacy.com';
                const openTime = pharmacyData.open_time || pharmacyData.openTime || 'Open: 8:00 AM - 10:00 PM';
                
                contactInfoSection.innerHTML = `
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${contactNumber}</span>
                        <button class="contact-action-btn" onclick="makeCall('${contactNumber}')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${email}</span>
                        <button class="contact-action-btn" onclick="sendEmail('${email}')">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-clock"></i>
                        <span>${openTime}</span>
                    </div>
                `;
            }

            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log(`${pharmacyName} information popup opened`);
        }
    };

    window.closePharmacyInfoPopup = function() {
        const popup = document.getElementById('pharmacy-info-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Pharmacy information popup closed');
        }
    };

    // Contact actions
    window.makeCall = function(phoneNumber) {
        window.location.href = `tel:${phoneNumber}`;
        console.log(`Initiating call to ${phoneNumber}`);
    };

    window.sendEmail = function(emailAddress) {
        window.location.href = `mailto:${emailAddress}`;
        console.log(`Opening email client for ${emailAddress}`);
    };

    window.getDirections = function() {
        const addressElement = document.getElementById('pharmacy-address');
        if (addressElement) {
            const address = addressElement.textContent.trim();
            const encodedAddress = encodeURIComponent(address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
            console.log(`Opening directions for: ${address}`);
        }
    };

    // Close pharmacy info popup when clicking outside
    const pharmacyInfoPopupOverlay = document.getElementById('pharmacy-info-popup');
    if (pharmacyInfoPopupOverlay) {
        pharmacyInfoPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePharmacyInfoPopup();
            }
        });
    }

    // Private Hospital Screen Functionality
    function initializePrivateHospitalScreen() {
        // Check for any pending hospital approval notifications when screen loads
        checkAndShowHospitalApprovalNotifications();
        
        // Initialize private hospital hero slider
        initializePrivateHospitalHeroSlider();

        // Setup private hospital tabs
        setupPrivateHospitalTabs();

        // Render hospital cards from Supabase data
        renderPrivateHospitalCards();

        // Setup private hospital card actions (must be called after rendering cards)
        setupPrivateHospitalCardActions();

        // Load hospital booking history on initialization
        loadHospitalBookingHistory();

        console.log('Private hospital screen initialized');
    }

    // Function to render private hospital cards from Supabase data
    function renderPrivateHospitalCards() {
        const hospitalCardsList = document.querySelector('.private-hospital-cards-list');
        
        if (!hospitalCardsList) {
            console.error('Hospital cards container not found');
            return;
        }

        // Get hospitals from Supabase database
        const hospitals = window.hospitalsDatabase || [];
        
        if (hospitals.length === 0) {
            hospitalCardsList.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px 20px; color: #757575;">
                    <i class="fas fa-hospital" style="font-size: 48px; margin-bottom: 16px; color: #BDBDBD;"></i>
                    <h4 style="margin-bottom: 8px; color: #424242;">No Hospitals Available</h4>
                    <p>Hospitals will appear here once added by admin</p>
                </div>
            `;
            console.log('No hospitals available to display');
            return;
        }

        // Generate HTML for all hospital cards
        const cardsHTML = hospitals.map(hospital => {
            const discount = hospital.discountPercentage || hospital.discount || 0;
            const rating = hospital.rating || 0;
            const reviewsCount = hospital.reviewsCount || 0;
            const hospitalImage = hospital.image || 'https://i.ibb.co.com/n87Z1fCv/imgi-166-cama-uci-92.jpg';
            
            return `
                <div class="private-hospital-card" data-hospital-id="${hospital.id}">
                    <div class="hospital-image-container">
                        <img src="${hospitalImage}" alt="${hospital.name}" class="hospital-image">
                        ${discount > 0 ? `<div class="discount-badge">Discount: ${discount}%</div>` : ''}
                    </div>
                    <div class="hospital-info">
                        <h4>${hospital.name}</h4>
                        <div class="hospital-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${hospital.location || 'Location not specified'}</span>
                        </div>
                        <div class="hospital-rating">
                            <i class="fas fa-star"></i>
                            <span>${rating.toFixed(1)} (${reviewsCount})</span>
                        </div>
                        <div class="hospital-actions">
                            <button class="hospital-details-btn">Details</button>
                            <button class="book-btn" onclick="navigateToHospitalBooking(${hospital.id}, '${hospital.name}')">Book</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Insert cards into the container
        hospitalCardsList.innerHTML = cardsHTML;
        
        console.log(`✅ Rendered ${hospitals.length} hospital cards from Supabase`);
    }

    // Make render function globally available for refreshing when data changes
    window.renderPrivateHospitalCards = renderPrivateHospitalCards;

    // Private hospital hero slider functionality
    function initializePrivateHospitalHeroSlider() {
        const privateHospitalSlides = document.querySelectorAll('.private-hospital-slide');
        let currentPrivateHospitalSlide = 0;

        function showPrivateHospitalSlide(index) {
            privateHospitalSlides.forEach(slide => slide.classList.remove('active'));
            if (privateHospitalSlides[index]) {
                privateHospitalSlides[index].classList.add('active');
            }
        }

        function nextPrivateHospitalSlide() {
            currentPrivateHospitalSlide = (currentPrivateHospitalSlide + 1) % privateHospitalSlides.length;
            showPrivateHospitalSlide(currentPrivateHospitalSlide);
        }

        // Auto-advance slides every 5 seconds
        if (privateHospitalSlides.length > 0) {
            setInterval(nextPrivateHospitalSlide, 5000);
        }
    }

    // Private hospital tabs functionality
    function setupPrivateHospitalTabs() {
        const privateHospitalTabButtons = document.querySelectorAll('.private-hospital-tab-button');
        const privateHospitalTabContents = document.querySelectorAll('.private-hospital-tab-content');

        privateHospitalTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetPrivateHospitalTab = this.getAttribute('data-private-hospital-tab');

                // Update private hospital tab buttons
                privateHospitalTabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Update private hospital tab content
                privateHospitalTabContents.forEach(content => content.classList.remove('active'));
                let targetPrivateHospitalContent;
                if (targetPrivateHospitalTab === 'history') {
                    targetPrivateHospitalContent = document.getElementById('private-hospital-history-tab');
                } else {
                    targetPrivateHospitalContent = document.getElementById(targetPrivateHospitalTab + '-tab');
                }
                if (targetPrivateHospitalContent) {
                    targetPrivateHospitalContent.classList.add('active');
                }

                // Load history when history tab is selected
                if (targetPrivateHospitalTab === 'history') {
                    loadHospitalBookingHistory();
                }

                console.log(`Private hospital tab switched to: ${targetPrivateHospitalTab}`);
            });
        });
    }

    // Private hospital card actions functionality
    function setupPrivateHospitalCardActions() {
        // Setup details button click handlers for hospital cards
        const hospitalDetailsButtons = document.querySelectorAll('.hospital-details-btn');
        hospitalDetailsButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const hospitalCard = this.closest('.private-hospital-card');
                if (hospitalCard) {
                    // Get hospital ID from data attribute
                    const hospitalId = hospitalCard.getAttribute('data-hospital-id');
                    
                    // Find the full hospital object from database
                    const hospital = window.hospitalsDatabase?.find(h => h.id == hospitalId);
                    
                    if (hospital) {
                        // Update hospital profile details screen with full hospital data
                        updateHospitalProfileDetailsScreen(hospital);
                        
                        // Switch to hospital profile details screen
                        switchScreen('hospital-profile-details');
                        
                        // Initialize hospital profile details screen after switching
                        setTimeout(() => {
                            initializeHospitalProfileDetailsScreen();
                        }, 100);
                        
                        console.log(`${hospital.name} details clicked`);
                    } else {
                        console.error('Hospital not found in database:', hospitalId);
                    }
                }
            });
        });

        console.log('Private hospital card actions set up');
    }

    // Function to update hospital profile details screen
    function updateHospitalProfileDetailsScreen(hospital) {
        // Store hospital ID in the profile screen element for later use
        const profileScreen = document.getElementById('hospital-profile-details-screen');
        if (profileScreen) {
            profileScreen.dataset.hospitalId = hospital.id;
        }
        
        // Update hospital hero image
        const hospitalHeroImg = document.getElementById('hospital-hero-img');
        if (hospitalHeroImg) {
            const hospitalImage = hospital.image || 'https://i.ibb.co.com/n87Z1fCv/imgi-166-cama-uci-92.jpg';
            hospitalHeroImg.src = hospitalImage;
            hospitalHeroImg.alt = hospital.name;
        }

        // Update hospital name
        const hospitalNameEl = document.getElementById('hospital-name');
        if (hospitalNameEl) {
            hospitalNameEl.textContent = hospital.name;
        }

        // Update hospital address
        const hospitalAddressEl = document.getElementById('hospital-address');
        if (hospitalAddressEl) {
            hospitalAddressEl.textContent = hospital.location;
        }

        // Update hospital rating
        const hospitalRatingEl = document.getElementById('hospital-rating');
        if (hospitalRatingEl) {
            const reviewText = hospital.reviewsCount > 0 ? ` (${hospital.reviewsCount} reviews)` : '';
            hospitalRatingEl.textContent = `${hospital.rating}${reviewText}`;
        }

        // Update discount tag
        const discountTag = document.querySelector('.discount-tag span');
        if (discountTag && hospital.discount) {
            discountTag.textContent = `Discount: ${hospital.discount}%`;
        }

        // Update contact number
        const hospitalContactEl = document.getElementById('hospital-contact');
        if (hospitalContactEl) {
            hospitalContactEl.textContent = hospital.contact || 'Not available';
        }

        // Update special discount offer
        const specialOfferSection = document.querySelector('.special-discount-offer p');
        if (specialOfferSection) {
            if (hospital.offer_text) {
                specialOfferSection.textContent = hospital.offer_text;
            } else {
                specialOfferSection.textContent = `Book through our app and save up to ${hospital.discount || 0}% on your hospital bill`;
            }
        }

        // Update about hospital description
        const descriptionPreview = document.getElementById('hospital-description-preview');
        const descriptionFull = document.getElementById('hospital-description-full');
        if (hospital.about) {
            const aboutText = hospital.about;
            const previewLength = 200;
            
            if (descriptionPreview) {
                descriptionPreview.textContent = aboutText.length > previewLength 
                    ? aboutText.substring(0, previewLength) + '...' 
                    : aboutText;
            }
            
            if (descriptionFull) {
                descriptionFull.innerHTML = `<p>${aboutText}</p>`;
            }
        }

        // Update hospital specialties
        const specialtiesGrid = document.querySelector('.specialties-grid');
        if (specialtiesGrid && hospital.specialities && Array.isArray(hospital.specialities)) {
            specialtiesGrid.innerHTML = '';
            hospital.specialities.forEach(specialty => {
                const specialtyTag = document.createElement('div');
                specialtyTag.className = 'specialty-tag';
                specialtyTag.textContent = specialty;
                specialtiesGrid.appendChild(specialtyTag);
            });
        }

        // Update hospital facilities
        const facilitiesSection = document.querySelector('.hospital-facilities-section');
        if (facilitiesSection && hospital.facilities) {
            let facilitiesList = facilitiesSection.querySelector('.facilities-list');
            if (!facilitiesList) {
                facilitiesList = document.createElement('div');
                facilitiesList.className = 'facilities-list';
                const title = facilitiesSection.querySelector('h3');
                if (title) {
                    title.after(facilitiesList);
                }
            }
            
            facilitiesList.innerHTML = '';
            
            // Map of facility keys to display names (all lowercase for matching)
            const facilityDisplayNames = {
                'icu_beds': 'ICU',
                'ccu_beds': 'CCU',
                'emergency_beds': 'Emergency',
                'general_beds': 'General Ward',
                'icu_available': 'ICU',
                'ccu_available': 'CCU',
                'emergency_available': 'Emergency',
                'operation_theater': 'Operation Theater',
                'pharmacy': 'Pharmacy',
                'laboratory': 'Laboratory',
                'radiology': 'Radiology'
            };
            
            // Helper function to get display name with fallback
            const getFacilityDisplayName = (key) => {
                const normalizedKey = key.toLowerCase();
                if (facilityDisplayNames[normalizedKey]) {
                    return facilityDisplayNames[normalizedKey];
                }
                // Fallback: remove underscores and capitalize words
                return key.replace(/_beds|_available/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            };
            
            // Add each facility as facility-card
            Object.entries(hospital.facilities).forEach(([key, value]) => {
                const normalizedKey = key.toLowerCase();
                
                // For bed-related facilities, show name with bed count
                if (normalizedKey.endsWith('_beds') && value > 0) {
                    const facilityCard = document.createElement('div');
                    facilityCard.className = 'facility-card';
                    
                    const facilityName = getFacilityDisplayName(key);
                    
                    facilityCard.innerHTML = `
                        <div class="facility-info">
                            <h4 class="facility-name">${facilityName}</h4>
                            <p style="margin: 4px 0 0 0; font-size: 14px; color: #757575;">${value} Beds</p>
                        </div>
                        <span class="facility-status available">Available</span>
                    `;
                    facilitiesList.appendChild(facilityCard);
                }
                // For boolean facilities (available: true), just show the name
                else if (normalizedKey.endsWith('_available') && value === true) {
                    // Skip if there's a corresponding beds entry
                    const bedsKey = key.toLowerCase().replace('_available', '_beds');
                    const hasBedsEntry = Object.keys(hospital.facilities).some(k => k.toLowerCase() === bedsKey && hospital.facilities[k] > 0);
                    
                    if (!hasBedsEntry) {
                        const facilityCard = document.createElement('div');
                        facilityCard.className = 'facility-card';
                        
                        const facilityName = getFacilityDisplayName(key);
                        
                        facilityCard.innerHTML = `
                            <div class="facility-info">
                                <h4 class="facility-name">${facilityName}</h4>
                            </div>
                            <span class="facility-status available">Available</span>
                        `;
                        facilitiesList.appendChild(facilityCard);
                    }
                }
                // For other boolean facilities (pharmacy, laboratory, etc.)
                else if (value === true && !normalizedKey.endsWith('_beds') && !normalizedKey.endsWith('_available')) {
                    const facilityCard = document.createElement('div');
                    facilityCard.className = 'facility-card';
                    
                    const facilityName = getFacilityDisplayName(key);
                    
                    facilityCard.innerHTML = `
                        <div class="facility-info">
                            <h4 class="facility-name">${facilityName}</h4>
                        </div>
                        <span class="facility-status available">Available</span>
                    `;
                    facilitiesList.appendChild(facilityCard);
                }
            });
        }

        // Update room pricing
        const roomPricingSection = document.querySelector('.room-pricing-section');
        console.log('🏥 Hospital Data:', hospital);
        console.log('💰 Room Pricing:', hospital.roomPricing);
        
        if (roomPricingSection && hospital.roomPricing) {
            let roomCardsList = roomPricingSection.querySelector('.room-cards-list');
            if (!roomCardsList) {
                roomCardsList = document.createElement('div');
                roomCardsList.className = 'room-cards-list';
                const title = roomPricingSection.querySelector('h3');
                if (title) {
                    title.after(roomCardsList);
                }
            }
            
            roomCardsList.innerHTML = '';
            
            // Map of room type keys to display names (all lowercase for matching)
            const roomTypeDisplayNames = {
                'general_ward': 'General Ward',
                'ac_cabin': 'Cabin (AC)',
                'non_ac_cabin': 'Cabin (Non-AC)',
                'icu': 'ICU',
                'ccu': 'CCU'
            };
            
            // Helper function to get room display name with fallback
            const getRoomDisplayName = (key) => {
                const normalizedKey = key.toLowerCase();
                if (roomTypeDisplayNames[normalizedKey]) {
                    return roomTypeDisplayNames[normalizedKey];
                }
                // Fallback: remove common suffixes and format nicely
                return key
                    .replace(/_beds|_price|_available_beds/g, '')
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
            };
            
            // Add each room type - data is already transformed with camelCase keys
            Object.entries(hospital.roomPricing).forEach(([roomType, roomData]) => {
                const roomCard = document.createElement('div');
                roomCard.className = 'room-card';
                
                const roomDisplayName = getRoomDisplayName(roomType);
                const originalPrice = roomData.originalPrice || 0;
                const discountedPrice = roomData.discountedPrice || originalPrice;
                const savings = roomData.savings || 0;
                const beds = roomData.beds || 0;
                
                const availabilityClass = beds > 0 ? 'available' : 'unavailable';
                const availabilityText = beds > 0 
                    ? `${beds} Bed${beds > 1 ? 's' : ''} Available` 
                    : 'Not Available';
                
                const discountPercent = originalPrice > 0 && savings > 0
                    ? Math.round((savings / originalPrice) * 100)
                    : 0;
                
                roomCard.innerHTML = `
                    <div class="room-info">
                        <div class="room-name">${roomDisplayName}</div>
                        <span class="room-availability ${availabilityClass}">${availabilityText}</span>
                    </div>
                    <div class="room-pricing">
                        <div class="room-price-container">
                            ${savings > 0 ? `<span class="original-price">৳${originalPrice}</span>` : ''}
                            <span class="discounted-price">৳${discountedPrice}</span>
                        </div>
                        ${savings > 0 ? `<span class="savings">Save ${discountPercent}% (৳${savings})</span>` : ''}
                    </div>
                `;
                roomCardsList.appendChild(roomCard);
            });
        }

        console.log('✅ Hospital profile details updated with Supabase data');
    }

    // Function to initialize hospital profile details screen
    function initializeHospitalProfileDetailsScreen() {
        // Setup hospital details tabs
        setupHospitalDetailsTabs();
        
        // Setup Book Hospital Service button click handlers for all tabs
        const bookHospitalServiceBtns = document.querySelectorAll('.book-hospital-service-btn');
        bookHospitalServiceBtns.forEach(btn => {
            // Remove any existing event listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                console.log('Book Hospital Service button clicked');
                navigateToHospitalBooking();
            });
        });
        
        console.log('Hospital profile details screen initialized');
    }

    // Hospital details tabs functionality
    function setupHospitalDetailsTabs() {
        const hospitalTabButtons = document.querySelectorAll('.hospital-tab-button');
        const hospitalTabContents = document.querySelectorAll('.hospital-tab-content');

        hospitalTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetHospitalTab = this.getAttribute('data-hospital-tab');

                // Update hospital tab buttons
                hospitalTabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Update hospital tab content
                hospitalTabContents.forEach(content => content.classList.remove('active'));
                const targetHospitalContent = document.getElementById(targetHospitalTab + '-hospital-tab');
                if (targetHospitalContent) {
                    targetHospitalContent.classList.add('active');
                }

                console.log(`Hospital tab switched to: ${targetHospitalTab}`);
            });
        });
    }

    // Function to toggle hospital description read more/less
    window.toggleHospitalDescription = function() {
        const fullDescription = document.getElementById('hospital-description-full');
        const readMoreBtn = document.getElementById('read-more-btn');

        if (fullDescription && readMoreBtn) {
            if (fullDescription.classList.contains('expanded')) {
                fullDescription.classList.remove('expanded');
                readMoreBtn.textContent = 'Read More';
            } else {
                fullDescription.classList.add('expanded');
                readMoreBtn.textContent = 'Read Less';
            }
        }
    };

    // Initialize history tab functionality
    function initializeHistoryTab() {
        populateBloodRequestHistory();
        populateDonorDonationHistory();
        console.log('History tab initialized');
    }

    // Function to populate blood request history
    function populateBloodRequestHistory() {
        const bloodRequestsList = document.getElementById('blood-request-cards-list');
        if (!bloodRequestsList) return;

        bloodRequestsList.innerHTML = '';

        if (bloodRequestsDatabase.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'history-empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-hand-holding-heart"></i>
                <h4>No Blood Requests</h4>
                <p>Your blood request history will appear here when you make requests.</p>
            `;
            bloodRequestsList.appendChild(emptyState);
        } else {
            // Sort by request date (newest first)
            const sortedRequests = bloodRequestsDatabase.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

            sortedRequests.forEach(request => {
                const requestCard = createBloodRequestCard(request);
                bloodRequestsList.appendChild(requestCard);
            });
        }
    }
    
    // Expose function globally for Supabase integration
    window.populateBloodRequestHistory = populateBloodRequestHistory;

    // Function to create blood request card
    function createBloodRequestCard(request) {
        const requestCard = document.createElement('div');
        requestCard.className = 'blood-request-card';

        const formattedDate = new Date(request.requestDate).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        requestCard.innerHTML = `
            <div class="blood-request-content">
                <div class="blood-request-date">${formattedDate} • Request ID: ${request.id}</div>
                <div class="blood-request-patient">${request.patientName}</div>
                <div class="blood-request-location">${request.hospital}</div>
                <div class="blood-request-blood-info">Blood Group: ${request.bloodGroup} • Units needed: ${request.unitsNeeded}</div>
                <div class="blood-request-urgency">Urgency: ${request.urgency || 'Normal'}</div>
                <div class="blood-request-contact">Contact: ${request.contactNumber}</div>
                <div class="status-badge status-${(request.status || 'pending').toLowerCase()}">${(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1)}</div>
            </div>
        `;

        return requestCard;
    }

    // Function to populate donor donation history
    function populateDonorDonationHistory() {
        const donorDonationsList = document.getElementById('donor-donation-cards-list');
        if (!donorDonationsList) return;

        donorDonationsList.innerHTML = '';

        if (donorDonationHistoryDatabase.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'history-empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-heart"></i>
                <h4>No Donation History</h4>
                <p>Donor donation history will appear here when donations are made.</p>
            `;
            donorDonationsList.appendChild(emptyState);
        } else {
            // Sort by donation date (newest first)
            const sortedDonations = donorDonationHistoryDatabase.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));

            sortedDonations.forEach(donation => {
                const donationCard = createDonorDonationCard(donation);
                donorDonationsList.appendChild(donationCard);
            });
        }
    }

    // Function to create donor donation card
    function createDonorDonationCard(donation) {
        const donationCard = document.createElement('div');
        donationCard.className = 'donor-donation-card';

        const formattedDate = new Date(donation.donationDate).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        donationCard.innerHTML = `
            <div class="donor-donation-header">
                <div class="donor-donation-info">
                    <div class="donor-donation-patient">Donated to: ${donation.patientName}</div>
                    <div class="donor-donation-date">Donation ID: ${donation.id} • ${formattedDate}</div>
                    <div class="donor-donation-hospital">${donation.hospital}</div>
                    <div class="donor-donation-details">
                        <div class="donor-donation-group">${donation.bloodGroup}</div>
                        <div class="donor-donation-units">${donation.unitsGiven} Unit${donation.unitsGiven > 1 ? 's' : ''} Donated</div>
                        <div class="donor-donation-type">${donation.donationType}</div>
                    </div>
                    ${donation.verified ? `
                        <div class="donor-donation-verification">
                            <i class="fas fa-check-circle"></i>
                            <span class="donor-donation-verification-text">Hospital Verified</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return donationCard;
    }

    // Agreement checkbox functionality
    const agreeCheckbox = document.getElementById('agree-payment');
    const proceedButton = document.getElementById('proceed-payment');

    if (agreeCheckbox && proceedButton) {
        agreeCheckbox.addEventListener('change', function() {
            proceedButton.disabled = !this.checked;

            if (this.checked) {
                proceedButton.style.background = 'linear-gradient(135deg, #673AB7 0%, #7E57C2 100%)';
                proceedButton.style.color = '#FFFFFF';
            } else {
                proceedButton.style.background = 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)';
                proceedButton.style.color = '#9E9E9E';
            }
        });
    }

    // Proceed to payment button
    if (proceedButton) {
        proceedButton.addEventListener('click', async function() {
            if (!this.disabled) {
                console.log('Proceeding to payment...');

                // Get selected date and time
                const selectedDate = document.querySelector('.date-card.selected');
                const selectedTime = document.querySelector('.time-slot.selected');

                if (selectedDate && selectedTime) {
                    // Check if booking slots are available for the selected date
                    const currentDoctor = currentBookingSession.doctor;
                    if (currentDoctor && currentDoctor.name) {
                        const doctor = doctorsDatabase.find(doc => doc.name === currentDoctor.name);
                        const doctorBookingSlot = doctor ? (doctor.bookingSlot || 2) : 2;

                        // Get appointment count for selected date
                        const fullDate = selectedDate.getAttribute('data-full-date');
                        const dateObj = BangladeshTimezone.create(fullDate);
                        const dateString = dateObj.toISOString().split('T')[0];
                        const bookedCount = await getRealAppointmentCount(currentDoctor.name, dateString);

                        // Check if slots are available
                        if (bookedCount >= doctorBookingSlot) {
                            CustomDialog.alert('Sorry, no booking slots available for this date. Please select another date.', 'No Slots Available');
                            return;
                        }
                    }

                    const appointmentData = {
                        date: selectedDate.getAttribute('data-date'),
                        day: selectedDate.getAttribute('data-day'),
                        time: selectedTime.getAttribute('data-time'),
                        fullDate: selectedDate.getAttribute('data-full-date'),
                        fee: 100
                    };

                    // Store appointment data for booking session
                    currentBookingSession.appointment = appointmentData;
                    console.log('Appointment data:', appointmentData);

                    // Update payment method screen with appointment data
                    updatePaymentSummary(appointmentData);

                    // Navigate to payment method screen
                    switchScreen('select-payment-method');
                } else {
                    CustomDialog.alert('Please select both date and time for your appointment.', 'Appointment Validation');
                }
            }
        });
    }

    // Function to update payment summary with appointment data
    function updatePaymentSummary(appointmentData) {
        // Get doctor info from current screen
        const doctorName = document.getElementById('datetime-doctor-name').textContent;

        // Update payment summary fields
        const paymentDoctorName = document.getElementById('payment-doctor-name');
        const paymentDate = document.getElementById('payment-date');
        const paymentTime = document.getElementById('payment-time');

        if (paymentDoctorName) {
            paymentDoctorName.textContent = doctorName;
        }

        if (paymentDate) {
            // Format the date nicely
            const selectedDate = document.querySelector('.date-card.selected');
            if (selectedDate) {
                const fullDate = selectedDate.getAttribute('data-full-date');
                // Parse date parts to avoid timezone issues
                const dateParts = fullDate.split('-');
                const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                paymentDate.textContent = dateObj.toLocaleDateString('en-GB', options);
            }
        }

        if (paymentTime) {
            paymentTime.textContent = appointmentData.time;
        }
    }

    // Select Payment Method button functionality
    const selectPaymentMethodBtn = document.getElementById('select-payment-method-btn');
    if (selectPaymentMethodBtn) {
        selectPaymentMethodBtn.addEventListener('click', function() {
            const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

            if (selectedPaymentMethod) {
                let paymentMethod = selectedPaymentMethod.value;
                
                // Whitelist allowed payment methods - include all supported payment options
                const ALLOWED_METHODS = ['bkash', 'bkash-send-money'];
                if (!ALLOWED_METHODS.includes(paymentMethod)) {
                    console.warn(`Invalid payment method: ${paymentMethod}, defaulting to bkash`);
                    paymentMethod = 'bkash';
                    // Also update the UI to reflect the corrected selection
                    document.querySelector('input[name="paymentMethod"][value="bkash"]').checked = true;
                }
                
                console.log(`Selected payment method: ${paymentMethod}`);

                // Handle payment methods
                if (paymentMethod === 'bkash-send-money') {
                    // Load bKash settings and navigate to bKash Send Money confirmation screen
                    loadBkashSendMoneySettings();
                    switchScreen('bkash-send-money');
                } else if (paymentMethod === 'bkash') {
                    // Initiate bKash payment gateway
                    initiateBkashPayment();
                } else {
                    // Other payment methods coming soon
                    CustomDialog.alert('This payment method will be available soon!', 'Payment Method');
                }
            } else {
                CustomDialog.alert('Please select a payment method.', 'Payment Selection');
            }
        });
    }

    // Function to load bKash Send Money settings from database
    async function loadBkashSendMoneySettings() {
        try {
            const response = await fetch('https://mediquick-p37c.onrender.com/api/bkash-send-money-settings');
            const data = await response.json();

            if (data.success && data.settings) {
                const settings = data.settings;
                
                // Update account number
                const accountNumberEl = document.querySelector('.account-number');
                if (accountNumberEl) {
                    accountNumberEl.textContent = settings.account_number;
                }
                
                // Update account name
                const accountNameEl = document.querySelector('.account-name');
                if (accountNameEl) {
                    accountNameEl.textContent = settings.account_name;
                }
                
                // Update instructions if custom instructions are provided
                if (settings.instructions) {
                    const instructionsList = document.querySelector('.bkash-instructions-card .instructions-list');
                    if (instructionsList) {
                        // Parse instructions (assuming they're newline-separated)
                        const instructionsArray = settings.instructions.split('\n').filter(line => line.trim());
                        
                        // Build instruction steps HTML
                        let instructionsHTML = '';
                        instructionsArray.forEach((instruction, index) => {
                            // Remove step numbers if they exist (e.g., "1. " or "2. ")
                            const cleanInstruction = instruction.replace(/^\d+\.\s*/, '');
                            instructionsHTML += `
                                <div class="instruction-step">
                                    <span class="step-number">${index + 1}</span>
                                    <span class="step-text">${cleanInstruction}</span>
                                </div>
                            `;
                        });
                        
                        instructionsList.innerHTML = instructionsHTML;
                    }
                }
                
                console.log('✅ bKash Send Money settings loaded successfully');
            }
        } catch (error) {
            console.error('Error loading bKash Send Money settings:', error);
        }
    }

    // Function to initiate bKash payment gateway
    async function initiateBkashPayment() {
        try {
            // Get appointment data from booking session
            if (!currentBookingSession || !currentBookingSession.doctor || !currentBookingSession.appointment) {
                CustomDialog.alert('Please select a doctor and appointment time first.', 'Missing Information');
                return;
            }

            const doctorName = currentBookingSession.doctor.name || 'Doctor';
            const appointmentDate = currentBookingSession.appointment.fullDate;
            const appointmentTime = currentBookingSession.appointment.time;
            
            // Generate unique invoice number
            const invoiceNumber = 'APT-' + Date.now();
            
            // Fixed amount for now (you can make this dynamic based on doctor/service)
            const paymentAmount = 100;

            // Call backend to create payment
            const response = await fetch('https://mediquick-p37c.onrender.com/api/bkash/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: paymentAmount,
                    invoiceNumber: invoiceNumber,
                    userId: getCurrentUserId() || '01XXXXXXXXX'
                })
            });

            const data = await response.json();

            if (data.success && data.bkashURL) {
                // Store payment info for callback handling, including patient information
                const paymentInfoToStore = {
                    paymentID: data.paymentID,
                    invoiceNumber: invoiceNumber,
                    amount: paymentAmount,
                    doctorName: doctorName,
                    appointmentDate: appointmentDate,
                    appointmentTime: appointmentTime
                };
                
                // Include patient information from currentBookingSession
                if (currentBookingSession.patient) {
                    paymentInfoToStore.patientName = currentBookingSession.patient.name;
                    paymentInfoToStore.patientMobile = currentBookingSession.patient.mobile;
                    paymentInfoToStore.patientAge = currentBookingSession.patient.age;
                    paymentInfoToStore.patientGender = currentBookingSession.patient.gender;
                    paymentInfoToStore.patientDistrict = currentBookingSession.patient.district;
                    paymentInfoToStore.patientUpazila = currentBookingSession.patient.upazila;
                    console.log('✅ Patient info included in bKash payment session:', currentBookingSession.patient.name);
                } else {
                    console.warn('⚠️ No patient information in currentBookingSession when initiating bKash payment!');
                }
                
                sessionStorage.setItem('bkashPaymentInfo', JSON.stringify(paymentInfoToStore));

                // Open bKash payment URL in a popup window
                const width = 600;
                const height = 700;
                const left = (screen.width - width) / 2;
                const top = (screen.height - height) / 2;
                
                const popup = window.open(
                    data.bkashURL,
                    'bKashPayment',
                    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                );

                if (!popup) {
                    CustomDialog.alert('Please allow popups for this site to complete payment.', 'Popup Blocked');
                    return;
                }

                // Listen for messages from the popup (when payment completes)
                const messageHandler = async (event) => {
                    if (event.origin !== window.location.origin) return;
                    
                    if (event.data && event.data.type === 'BKASH_PAYMENT_RESULT') {
                        console.log('Received payment result from popup:', event.data);
                        window.removeEventListener('message', messageHandler);
                        clearInterval(checkPopup);
                        
                        if (event.data.success && event.data.transactionData) {
                            const paymentInfo = JSON.parse(sessionStorage.getItem('bkashPaymentInfo') || '{}');
                            await handleSuccessfulBkashPayment(paymentInfo, event.data.transactionData);
                        } else {
                            if (event.data.status === 'cancelled') {
                                CustomDialog.alert('Payment was cancelled.', 'Payment Cancelled');
                            } else {
                                CustomDialog.alert('Payment failed: ' + (event.data.error || 'Unknown error'), 'Payment Failed');
                            }
                            switchScreen('home');
                        }
                        sessionStorage.removeItem('bkashPaymentInfo');
                    }
                };
                
                window.addEventListener('message', messageHandler);

                // Fallback: Listen for popup close (in case message doesn't arrive)
                const checkPopup = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkPopup);
                        window.removeEventListener('message', messageHandler);
                        
                        setTimeout(() => {
                            const paymentInfo = sessionStorage.getItem('bkashPaymentInfo');
                            if (paymentInfo) {
                                checkBkashPaymentStatus(data.paymentID);
                            }
                        }, 500);
                    }
                }, 1000);

            } else {
                throw new Error(data.error || 'Failed to initiate payment');
            }

        } catch (error) {
            console.error('bKash payment error:', error);
            CustomDialog.alert('Failed to initiate payment: ' + error.message, 'Payment Error');
        }
    }

    // Function to handle successful bKash payment (called from popup message)
    async function handleSuccessfulBkashPayment(paymentInfo, transactionData) {
        try {
            await createAppointmentWithBkashPayment(paymentInfo, transactionData);
            
            const formattedDisplayDate = formatDateDDMMYYYY(paymentInfo.appointmentDate);
            
            const successMessage = `Payment successful!\n\n` +
                `Doctor: ${paymentInfo.doctorName}\n` +
                `Date: ${formattedDisplayDate}\n` +
                `Time: ${paymentInfo.appointmentTime}\n` +
                `Transaction ID: ${transactionData.trxID}\n\n` +
                `Your appointment has been confirmed.`;
            
            CustomDialog.alert(successMessage, 'Payment Confirmed');
            
            setTimeout(() => {
                switchScreen('appointment');
            }, 2000);
            
        } catch (error) {
            console.error('Error handling successful payment:', error);
            CustomDialog.alert('Payment was successful but there was an error creating the appointment. Please contact support with Transaction ID: ' + transactionData.trxID, 'Error');
        }
    }

    // Function to check bKash payment status after popup closes (fallback path)
    async function checkBkashPaymentStatus(paymentID) {
        try {
            console.log('Fallback: Executing and checking payment status for', paymentID);
            
            const executeResponse = await fetch('https://mediquick-p37c.onrender.com/api/bkash/execute-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentID })
            });

            const executeData = await executeResponse.json();
            console.log('Fallback: Execute payment response:', executeData);

            if (executeData.success && executeData.data) {
                const paymentInfo = JSON.parse(sessionStorage.getItem('bkashPaymentInfo') || '{}');
                
                if (executeData.data.transactionStatus === 'Completed') {
                    await handleSuccessfulBkashPayment(paymentInfo, executeData.data);
                } else if (executeData.data.transactionStatus === 'Cancelled') {
                    CustomDialog.alert('Payment was cancelled.', 'Payment Cancelled');
                    switchScreen('home');
                } else {
                    CustomDialog.alert('Payment status: ' + executeData.data.transactionStatus, 'Payment Status');
                }

                sessionStorage.removeItem('bkashPaymentInfo');
            } else {
                console.warn('Fallback: Execute failed, trying query...');
                
                const queryResponse = await fetch(`/api/bkash/query-payment/${paymentID}`);
                const queryData = await queryResponse.json();

                if (queryData.success && queryData.data) {
                    const paymentInfo = JSON.parse(sessionStorage.getItem('bkashPaymentInfo') || '{}');
                    
                    if (queryData.data.transactionStatus === 'Completed') {
                        await handleSuccessfulBkashPayment(paymentInfo, queryData.data);
                    } else if (queryData.data.transactionStatus === 'Cancelled') {
                        CustomDialog.alert('Payment was cancelled.', 'Payment Cancelled');
                        switchScreen('home');
                    } else {
                        CustomDialog.alert('Payment status: ' + queryData.data.transactionStatus, 'Payment Status');
                    }

                    sessionStorage.removeItem('bkashPaymentInfo');
                } else {
                    throw new Error(executeData.error || queryData.error || 'Failed to verify payment');
                }
            }

        } catch (error) {
            console.error('Error checking payment status:', error);
            CustomDialog.alert('Could not verify payment status. Please contact support.', 'Error');
            sessionStorage.removeItem('bkashPaymentInfo');
        }
    }

    // Function to create appointment after successful bKash payment
    async function createAppointmentWithBkashPayment(paymentInfo, transactionData) {
        try {
            const bookingId = 'MQ' + Date.now().toString().slice(-8);
            
            // Get patient information from paymentInfo first (stored in sessionStorage), then fall back to currentBookingSession
            let patientName = paymentInfo.patientName || 'Patient';
            let patientAddress = 'Rangpur, Bangladesh';
            
            console.log('Creating appointment - paymentInfo:', paymentInfo);
            console.log('Patient name from paymentInfo:', paymentInfo.patientName);
            
            // Build patient address from payment info
            if (paymentInfo.patientDistrict && paymentInfo.patientUpazila) {
                patientAddress = `${paymentInfo.patientUpazila}, ${paymentInfo.patientDistrict}`;
            } else if (currentBookingSession.patient) {
                // Fallback to currentBookingSession
                patientName = currentBookingSession.patient.name || patientName;
                console.log('Patient name from currentBookingSession:', patientName);
                if (currentBookingSession.patient.district && currentBookingSession.patient.upazila) {
                    patientAddress = `${currentBookingSession.patient.upazila}, ${currentBookingSession.patient.district}`;
                }
            }
            
            console.log('Final patient name for appointment:', patientName);
            console.log('📋 Creating appointment with category:', currentBookingSession.doctor?.specialty || 'General');

            const appointmentDetails = {
                bookingId: bookingId,
                doctorName: paymentInfo.doctorName,
                doctorCategory: currentBookingSession.doctor?.specialty || 'General',
                appointmentDate: paymentInfo.appointmentDate,
                appointmentTime: paymentInfo.appointmentTime,
                patientName: patientName,
                patientAddress: patientAddress,
                transactionId: transactionData.trxID,
                senderNumber: transactionData.customerMsisdn || 'N/A',
                paymentMethod: 'bkash',
                paymentStatus: 'confirmed'
            };

            // Save appointment using PointsSystem (same as bKash send money)
            await PointsSystem.addPendingAppointment(appointmentDetails);
            console.log('✅ Appointment saved successfully:', appointmentDetails);

            // Add system notification for pending appointment
            addSystemNotification(
                'Appointment Pending - Payment Verification',
                `Your appointment with ${paymentInfo.doctorName} has been submitted. Booking ID: ${bookingId}. Transaction ID: ${transactionData.trxID}. Payment verification is in progress.`
            );

        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    }

    // Helper function to get current user ID
    function getCurrentUserId() {
        const user = AuthSystem.getUser();
        return user ? user.mobile || user.email : null;
    }

    // bKash confirmation form handler
    const bkashConfirmationForm = document.getElementById('bkash-confirmation-form');
    if (bkashConfirmationForm) {
        const bkashConfirmBtn = document.getElementById('bkash-confirm-btn');
        if (bkashConfirmBtn) {
            bkashConfirmBtn.addEventListener('click', function() {
                submitBkashConfirmation();
            });
        }
    }

    // Function to handle bKash payment confirmation
    async function submitBkashConfirmation() {
        const form = document.getElementById('bkash-confirmation-form');
        const transactionId = document.getElementById('bkash-transaction-id').value.trim();
        const senderNumber = document.getElementById('sender-number').value.trim();
        const paymentAmount = '100'; // Fixed amount
        const paymentNote = ''; // No notes field

        // Validate required fields
        if (!transactionId) {
            CustomDialog.alert('Please enter your bKash transaction ID.', 'Required Field');
            return;
        }

        if (!senderNumber) {
            CustomDialog.alert('Please enter your bKash number.', 'Required Field');
            return;
        }

        // Validate mobile number format (11 digits)
        if (!/^\d{11}$/.test(senderNumber)) {
            CustomDialog.alert('Please enter a valid 11-digit bKash number.', 'Invalid Number');
            return;
        }

        // Validate transaction ID format (enhanced validation)
        // Check length (must be between 8-15 characters)
        if (transactionId.length < 8 || transactionId.length > 15) {
            CustomDialog.alert('Transaction ID must be between 8-15 characters long.', 'Invalid Transaction ID');
            return;
        }
        
        // Check for only alphanumeric characters (letters and numbers only)
        if (!/^[a-zA-Z0-9]+$/.test(transactionId)) {
            CustomDialog.alert('Transaction ID can only contain letters and numbers. No special characters or spaces allowed.', 'Invalid Transaction ID');
            return;
        }

        const confirmButton = document.getElementById('bkash-confirm-btn');
        const originalText = confirmButton.textContent;
        
        // Show loading state
        confirmButton.disabled = true;
        confirmButton.textContent = 'Confirming...';

        // Simulate payment confirmation processing
        setTimeout(async () => {
            confirmButton.disabled = false;
            confirmButton.textContent = originalText;

            // Generate booking confirmation
            const bookingId = 'MQ' + Date.now().toString().slice(-8);
            
            // Get appointment data primarily from booking session
            let doctorName = '';
            let appointmentDate = '';
            let appointmentTime = '';
            let doctorCategory = '';

            console.log('Current booking session:', currentBookingSession);

            // Get doctor information from booking session
            if (currentBookingSession.doctor && currentBookingSession.doctor.name) {
                doctorName = currentBookingSession.doctor.name;
                doctorCategory = currentBookingSession.doctor.specialty || 'Dentist';
            }

            // Get appointment date and time from booking session first
            if (currentBookingSession.appointment) {
                appointmentDate = currentBookingSession.appointment.fullDate;
                appointmentTime = currentBookingSession.appointment.time;
            }

            // Fallback to DOM elements if booking session data is missing
            if (!doctorName) {
                const doctorNameEl = document.getElementById('datetime-doctor-name');
                if (doctorNameEl && doctorNameEl.textContent) {
                    doctorName = doctorNameEl.textContent;
                }
            }

            if (!appointmentDate) {
                const selectedDate = document.querySelector('.date-card.selected');
                if (selectedDate) {
                    appointmentDate = selectedDate.getAttribute('data-full-date');
                }
            }

            if (!appointmentTime) {
                const selectedTime = document.querySelector('.time-slot.selected');
                if (selectedTime) {
                    appointmentTime = selectedTime.getAttribute('data-time');
                }
            }

            // Validate that we have all required appointment data
            if (!doctorName || !appointmentDate || !appointmentTime) {
                console.error('Missing appointment data:', {
                    doctorName,
                    appointmentDate,
                    appointmentTime,
                    bookingSession: currentBookingSession
                });
                CustomDialog.alert('Unable to retrieve appointment details. Please go back and complete the booking process again.', 'Booking Error');
                return;
            }

            // Get patient data from current booking session or sessionStorage
            let patientName = 'Patient';
            let patientAddress = 'Rangpur, Bangladesh';
            
            console.log('bKash Send Money - currentBookingSession:', currentBookingSession);
            console.log('bKash Send Money - Patient data:', currentBookingSession.patient);
            
            // Try to get patient information from sessionStorage first (in case page was reloaded)
            const storedPaymentInfo = sessionStorage.getItem('bkashPaymentInfo');
            if (storedPaymentInfo) {
                try {
                    const paymentInfo = JSON.parse(storedPaymentInfo);
                    if (paymentInfo.patientName) {
                        patientName = paymentInfo.patientName;
                        console.log('Patient name retrieved from sessionStorage:', patientName);
                        if (paymentInfo.patientDistrict && paymentInfo.patientUpazila) {
                            patientAddress = `${paymentInfo.patientUpazila}, ${paymentInfo.patientDistrict}`;
                        }
                    }
                } catch (e) {
                    console.error('Error parsing stored payment info:', e);
                }
            }
            
            // Fall back to currentBookingSession if not in sessionStorage
            if (patientName === 'Patient' && currentBookingSession.patient) {
                patientName = currentBookingSession.patient.name || patientName;
                console.log('Patient name retrieved from currentBookingSession:', patientName);
                if (currentBookingSession.patient.district && currentBookingSession.patient.upazila) {
                    patientAddress = `${currentBookingSession.patient.upazila}, ${currentBookingSession.patient.district}`;
                }
            }
            
            if (patientName === 'Patient') {
                console.warn('bKash Send Money - No patient data found in sessionStorage or currentBookingSession!');
            }
            
            // Set default doctor category if not already set
            if (!doctorCategory) {
            console.log('📋 Creating appointment with category:', doctorCategory);
                doctorCategory = 'Dentist';
            }

            if (currentBookingSession.doctor) {
                doctorCategory = currentBookingSession.doctor.specialty || doctorCategory;
            }

            console.log('bKash payment confirmed:', {
                bookingId,
                transactionId,
                senderNumber,
                paymentAmount,
                doctorName,
                appointmentDate,
                appointmentTime,
                paymentNote
            });

            // Create pending appointment
            const appointmentDetails = {
                bookingId: bookingId,
                doctorName: doctorName,
                doctorCategory: doctorCategory,
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                patientName: patientName,
                patientAddress: patientAddress,
                transactionId: transactionId,
                senderNumber: senderNumber,
                paymentMethod: 'bkash',
                paymentStatus: 'pending'
            };

            // Add appointment to system with pending status
            try {
                const appointment = await PointsSystem.addPendingAppointment(appointmentDetails);
                console.log('✅ Appointment saved successfully:', appointment);
            } catch (error) {
                console.error('❌ Error saving appointment:', error);
                CustomDialog.alert('Failed to save appointment. Please try again or contact support.', 'Booking Error');
                return;
            }

            // Add system notification for pending appointment
            addSystemNotification(
                'Appointment Pending - Payment Verification',
                `Your appointment with ${doctorName} has been submitted. Booking ID: ${bookingId}. Payment verification may take 2-24 hours.`
            );

            // Format the date for display in the success message
            const formattedDisplayDate = formatDateDDMMYYYY(appointmentDate);

            // Show success message with booking details
            const successMessage = `Payment confirmation submitted successfully!\n\n` +
                `Booking ID: ${bookingId}\n` +
                `Doctor: ${doctorName}\n` +
                `Date: ${formattedDisplayDate}\n` +
                `Time: ${appointmentTime}\n` +
                `Transaction ID: ${transactionId}\n\n` +
                `Your appointment has been created with PENDING status. Payment verification may take 2-24 hours. You can view your appointment in the Appointments section.`;

            CustomDialog.alert(successMessage, 'Payment Confirmed');

            // Reset form and navigate back to home
            setTimeout(() => {
                resetBkashSendMoneyScreen();
                switchScreen('home');
            }, 3000);

        }, 2000); // 2 second loading simulation
    }

    // Share icon click handler
    const shareIcons = document.querySelectorAll('.share-icon');
    shareIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            console.log('Share doctor profile clicked');
            // Add share functionality here
            if (navigator.share) {
                navigator.share({
                    title: 'Doctor Profile',
                    text: 'Check out this doctor profile on MediQuick',
                    url: window.location.href
                }).catch(console.error);
            } else {
                // Fallback for browsers that don't support Web Share API
                CustomDialog.alert('Share functionality will be implemented soon!', 'Feature Coming Soon');
            }
        });
    });

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const targetFaq = this.getAttribute('data-faq');
            const targetAnswer = document.getElementById(targetFaq);

            // Check if this FAQ is currently open
            const isCurrentlyOpen = this.classList.contains('active');

            // Close all FAQ items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
            });

            const allAnswers = document.querySelectorAll('.faq-answer');
            allAnswers.forEach(answer => {
                answer.classList.remove('open');
            });

            // If the clicked FAQ wasn't open, open it
            if (!isCurrentlyOpen) {
                this.classList.add('active');
                if (targetAnswer) {
                    targetAnswer.classList.add('open');
                }
            }

            console.log(`FAQ ${targetFaq} ${isCurrentlyOpen ? 'closed' : 'opened'}`);
        });
    });

    // Popup for "Shop Medicines" button
    window.openShopMedicinesPopup = function() {
        const popup = document.getElementById('shop-medicines-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Shop medicines popup opened');
        }
    };

    window.closeShopMedicinesPopup = function() {
        const popup = document.getElementById('shop-medicines-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Shop medicines popup closed');

            // Clear form fields
            const form = popup.querySelector('.medicine-order-form');
            if (form) {
                form.reset();
            }
        }
    };

    // Close popup when clicking outside
    const shopMedicinesPopupOverlay = document.getElementById('shop-medicines-popup');
    if (shopMedicinesPopupOverlay) {
        shopMedicinesPopupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShopMedicinesPopup();
            }
        });
    }

    // Handle form submission for medicine order
    window.submitMedicineOrder = async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const patientName = formData.get('patientName');
        const patientMobile = formData.get('patientMobile');
        const deliveryAddress = formData.get('deliveryAddress');
        const prescriptionFile = document.getElementById('prescription-file').files[0];

        if (!patientName || !patientMobile || !deliveryAddress) {
            CustomDialog.alert('Please fill in all required fields: patient name, mobile number, and delivery address.', 'Form Validation');
            return;
        }

        if (!prescriptionFile) {
            CustomDialog.alert('Please upload a prescription image.', 'Prescription Required');
            return;
        }

        const submitButton = event.target.querySelector('.shop-medicines-btn');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;

        try {
            const reader = new FileReader();
            reader.onloadend = async function() {
                const base64Prescription = reader.result;
                
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                const requestId = `MED${Date.now()}`;
                
                const medicineRequest = {
                    request_id: requestId,
                    user_id: currentUser.supabaseId || null,
                    patient_name: patientName,
                    patient_mobile: patientMobile,
                    delivery_address: deliveryAddress,
                    prescription_url: base64Prescription,
                    status: 'pending',
                    request_time: new Date().toISOString()
                };

                try {
                    await window.dbService.addMedicineRequest(medicineRequest);
                    
                    console.log('Medicine order submitted:', {
                        requestId,
                        patientName,
                        patientMobile,
                        deliveryAddress
                    });

                    CustomDialog.alert('Your medicine order has been placed successfully! We will contact you shortly.', 'Order Placed');
                    
                    addSystemNotification(
                        'Medicine Order Placed',
                        `Order for ${patientName} has been placed successfully. Request ID: ${requestId}. We will contact you at ${patientMobile} for delivery confirmation.`
                    );
                    
                    resetShopMedicinesForm();
                    
                    closeShopMedicinesPopup();
                    
                    console.log('Medicine order completed - form reset and popup closed');
                } catch (error) {
                    console.error('Error submitting medicine order:', error);
                    CustomDialog.alert('Failed to submit medicine order. Please try again.', 'Submission Error');
                } finally {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }
            };
            
            reader.readAsDataURL(prescriptionFile);
        } catch (error) {
            console.error('Error processing prescription file:', error);
            CustomDialog.alert('Failed to process prescription file. Please try again.', 'File Error');
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    };

    // Reset Shop Medicines Form Function
    window.resetShopMedicinesForm = function() {
        // Reset form fields
        const form = document.querySelector('.shop-medicines-form');
        if (form) {
            form.reset();
        }

        // Reset file upload area
        const fileInput = document.getElementById('prescription-file');
        const uploadArea = document.querySelector('.prescription-upload-area');
        const filePreview = document.getElementById('file-preview');

        if (fileInput && uploadArea && filePreview) {
            fileInput.value = '';
            uploadArea.style.display = 'flex';
            filePreview.style.display = 'none';
        }

        console.log('Shop medicines form reset to default state');
    };

    // Prescription Upload Functions
    window.handlePrescriptionUpload = function(input) {
        const file = input.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            CustomDialog.alert('Please upload only image files (JPEG, JPG, PNG, GIF).', 'Invalid File Type');
            input.value = '';
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            CustomDialog.alert('File size must be less than 5MB.', 'File Too Large');
            input.value = '';
            return;
        }

        // Update UI to show selected file
        const uploadArea = document.querySelector('.prescription-upload-area');
        const filePreview = document.getElementById('file-preview');
        const fileName = filePreview.querySelector('.file-name');

        if (uploadArea && filePreview && fileName) {
            uploadArea.style.display = 'none';
            filePreview.style.display = 'flex';
            fileName.textContent = file.name;
        }

        console.log('Prescription file uploaded:', file.name);
    };

    window.removePrescriptionFile = function() {
        const fileInput = document.getElementById('prescription-file');
        const uploadArea = document.querySelector('.prescription-upload-area');
        const filePreview = document.getElementById('file-preview');

        if (fileInput && uploadArea && filePreview) {
            fileInput.value = '';
            uploadArea.style.display = 'flex';
            filePreview.style.display = 'none';
        }

        console.log('Prescription file removed');
    };




    // Points System
    const PointsSystem = {
        POINTS_PER_APPOINTMENT: 20,
        STORAGE_KEY: 'mediQuickPoints',

        // Initialize points system
        init: function() {
            this.loadPoints();
            this.updateWalletDisplay();
            console.log('Points system initialized');
        },

        // Load points data from memory
        loadPoints: function() {
            const savedData = InMemoryStorage.pointsData;
            if (savedData) {
                this.data = typeof savedData === 'string' ? JSON.parse(savedData) : savedData;
                // Ensure adminAdjustedPoints exists for older data
                if (!this.data.hasOwnProperty('adminAdjustedPoints')) {
                    this.data.adminAdjustedPoints = 0;
                }
                // Ensure adminAdjustmentRecords exists for older data
                if (!this.data.hasOwnProperty('adminAdjustmentRecords')) {
                    this.data.adminAdjustmentRecords = [];
                }
            } else {
                // Initialize new user data
                this.data = {
                    appointments: [],
                    totalPoints: 0,
                    adminAdjustedPoints: 0,
                    redeemedPoints: 0,
                    adminAdjustmentRecords: []
                };
                this.savePoints();
            }
        },

        // Save points data to memory
        savePoints: function() {
            InMemoryStorage.pointsData = this.data;
        },

        // Add points for successful appointment
        addAppointmentPoints: async function(appointmentDetails) {
            const appointment = {
                id: Date.now(),
                bookingId: 'MQ' + Date.now().toString().slice(-8),
                date: new Date().toISOString(),
                doctorName: appointmentDetails.doctorName || 'Dr. Musa Siddik Juwel',
                doctorCategory: appointmentDetails.doctorCategory || 'Dentist',
                appointmentDate: appointmentDetails.appointmentDate || new Date().toISOString().split('T')[0],
                appointmentTime: appointmentDetails.appointmentTime || '10:00 AM',
                patientName: appointmentDetails.patientName || 'John Doe',
                patientAddress: appointmentDetails.patientAddress || 'Rangpur, Bangladesh',
                status: 'active',
                points: this.POINTS_PER_APPOINTMENT,
                transactionId: appointmentDetails.transactionId,
                paymentMethod: appointmentDetails.paymentMethod || 'points',
                paymentStatus: appointmentDetails.paymentStatus || 'confirmed'
            };

            // Save to Supabase if available
            if (typeof window.userSupabaseHandlers !== 'undefined' && window.userSupabaseHandlers.bookAppointment) {
                try {
                    const currentUser = AuthSystem.getUser();
                    const supabaseAppointment = {
                        booking_id: appointment.bookingId,
                        user_id: currentUser?.supabaseId || null,
                        patient_name: appointment.patientName,
                        doctor_name: appointment.doctorName,
                        doctor_specialty: appointment.doctorCategory,
                        date: appointment.appointmentDate,
                        time: appointment.appointmentTime,
                        status: appointment.status,
                        patient_address: appointment.patientAddress,
                        user_points: appointment.points,
                        patient_contact: currentBookingSession.patient?.mobile || '',
                        patient_gender: currentBookingSession.patient?.gender || '',
                        patient_age: currentBookingSession.patient?.age ? parseInt(currentBookingSession.patient.age) : null,
                        bkash_transaction_id: appointment.transactionId || null,
                        bkash_number: appointment.senderNumber || null
                    };
                    
                    await window.userSupabaseHandlers.bookAppointment(supabaseAppointment);
                    console.log('✅ Appointment saved to Supabase');
                } catch (error) {
                    console.error('Error saving appointment to Supabase:', error);
                }
            }

            this.data.appointments.push(appointment);
            this.data.totalPoints += this.POINTS_PER_APPOINTMENT;
            this.savePoints();
            this.updateWalletDisplay();
            await this.updateAppointmentDisplay();

            // Add points notification
            createNotification(
                'points',
                'Points Earned!',
                `You earned ${this.POINTS_PER_APPOINTMENT} points for your appointment with ${appointmentDetails.doctorName || 'your doctor'}. Keep booking to earn more!`,
                true
            );

            console.log('Points added for appointment:', appointment);
            return appointment;
        },

        // Add appointment with pending payment status
        addPendingAppointment: async function(appointmentDetails) {
            const appointment = {
                id: Date.now(),
                bookingId: appointmentDetails.bookingId || 'MQ' + Date.now().toString().slice(-8),
                date: new Date().toISOString(),
                doctorName: appointmentDetails.doctorName || 'Dr. Musa Siddik Juwel',
                doctorCategory: appointmentDetails.doctorCategory || 'Dentist',
                appointmentDate: appointmentDetails.appointmentDate || new Date().toISOString().split('T')[0],
                appointmentTime: appointmentDetails.appointmentTime || '10:00 AM',
                patientName: appointmentDetails.patientName || 'John Doe',
                patientAddress: appointmentDetails.patientAddress || 'Rangpur, Bangladesh',
                status: 'pending',
                points: 0, // No points until payment is approved
                transactionId: appointmentDetails.transactionId,
                paymentMethod: appointmentDetails.paymentMethod || 'bkash',
                paymentStatus: 'pending',
                senderNumber: appointmentDetails.senderNumber
            };

            // Save to Supabase if available
            if (typeof window.userSupabaseHandlers !== 'undefined' && window.userSupabaseHandlers.bookAppointment) {
                try {
                    const currentUser = AuthSystem.getUser();
                    const supabaseAppointment = {
                        booking_id: appointment.bookingId,
                        user_id: currentUser?.supabaseId || null,
                        patient_name: appointment.patientName,
                        doctor_name: appointment.doctorName,
                        doctor_specialty: appointment.doctorCategory,
                        date: appointment.appointmentDate,
                        time: appointment.appointmentTime,
                        status: appointment.status,
                        patient_address: appointment.patientAddress,
                        user_points: appointment.points,
                        patient_contact: currentBookingSession.patient?.mobile || '',
                        patient_gender: currentBookingSession.patient?.gender || '',
                        patient_age: currentBookingSession.patient?.age ? parseInt(currentBookingSession.patient.age) : null,
                        bkash_transaction_id: appointment.transactionId || null,
                        bkash_number: appointment.senderNumber || null
                    };
                    
                    await window.userSupabaseHandlers.bookAppointment(supabaseAppointment);
                    console.log('✅ Appointment saved to Supabase');
                } catch (error) {
                    console.error('Error saving appointment to Supabase:', error);
                }
            }

            this.data.appointments.push(appointment);
            this.savePoints();
            await this.updateAppointmentDisplay();

            console.log('Pending appointment added:', appointment);
            return appointment;
        },

        // Approve appointment and award points
        approveAppointment: async function(appointmentId) {
            const appointment = this.data.appointments.find(apt => apt.id === appointmentId);
            if (appointment && appointment.status === 'pending') {
                appointment.status = 'active';
                appointment.paymentStatus = 'confirmed';
                appointment.points = this.POINTS_PER_APPOINTMENT;
                this.data.totalPoints += this.POINTS_PER_APPOINTMENT;
                
                this.savePoints();
                this.updateWalletDisplay();
                await this.updateAppointmentDisplay();

                // Add points notification
                createNotification(
                    'points',
                    'Payment Approved!',
                    `Your payment has been verified. You earned ${this.POINTS_PER_APPOINTMENT} points for your appointment with ${appointment.doctorName}!`,
                    true
                );

                console.log('Appointment approved:', appointment);
                return appointment;
            }
            return null;
        },

        // Calculate points earned this month
        getPointsThisMonth: function() {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const thisMonthAppointments = this.data.appointments.filter(appointment => {
                if (!appointment.approvedAt || appointment.points === 0) {
                    return false;
                }
                const approvedDate = new Date(appointment.approvedAt);
                return approvedDate.getMonth() === currentMonth &&
                       approvedDate.getFullYear() === currentYear;
            });
            
            const appointmentPoints = thisMonthAppointments.reduce((total, apt) => total + apt.points, 0);
            
            const adminRecords = this.data.adminAdjustmentRecords || [];
            const thisMonthAdminAdjustments = adminRecords.filter(record => {
                const adjustmentDate = new Date(record.adjustment_date);
                return adjustmentDate.getMonth() === currentMonth &&
                       adjustmentDate.getFullYear() === currentYear;
            });
            const adminAdjustedThisMonth = thisMonthAdminAdjustments.reduce((total, record) => total + record.points_adjusted, 0);
            
            console.log(`📊 This Month Calculation: ${thisMonthAppointments.length} appointments (${appointmentPoints}pt) + admin (${adminAdjustedThisMonth}pt) = ${appointmentPoints + adminAdjustedThisMonth}pt`);
            
            return appointmentPoints + adminAdjustedThisMonth;
        },

        // Calculate points earned last month
        getPointsLastMonth: function() {
            const now = new Date();
            let lastMonth = now.getMonth() - 1;
            let lastMonthYear = now.getFullYear();

            if (lastMonth < 0) {
                lastMonth = 11;
                lastMonthYear--;
            }

            const lastMonthAppointments = this.data.appointments.filter(appointment => {
                if (!appointment.approvedAt || appointment.points === 0) {
                    return false;
                }
                const approvedDate = new Date(appointment.approvedAt);
                return approvedDate.getMonth() === lastMonth &&
                       approvedDate.getFullYear() === lastMonthYear;
            });
            
            const appointmentPoints = lastMonthAppointments.reduce((total, apt) => total + apt.points, 0);
            
            const adminRecords = this.data.adminAdjustmentRecords || [];
            const lastMonthAdminAdjustments = adminRecords.filter(record => {
                const adjustmentDate = new Date(record.adjustment_date);
                return adjustmentDate.getMonth() === lastMonth &&
                       adjustmentDate.getFullYear() === lastMonthYear;
            });
            const adminAdjustedLastMonth = lastMonthAdminAdjustments.reduce((total, record) => total + record.points_adjusted, 0);
            
            console.log(`📊 Last Month Calculation: ${lastMonthAppointments.length} appointments (${appointmentPoints}pt) + admin (${adminAdjustedLastMonth}pt) = ${appointmentPoints + adminAdjustedLastMonth}pt`);
            
            return appointmentPoints + adminAdjustedLastMonth;
        },

        // Get available (unredeemed) points
        getAvailablePoints: function() {
            const earned = this.data.totalPoints || 0;
            const adminAdjusted = this.data.adminAdjustedPoints || 0;
            const redeemed = this.data.redeemedPoints || 0;
            const available = earned + adminAdjusted - redeemed;
            
            console.log(`📊 Available Calculation: earned (${earned}pt) + admin (${adminAdjusted}pt) - redeemed (${redeemed}pt) = ${available}pt`);
            
            return available;
        },

        // Get all time points (earned from appointments + positive admin adjustments only)
        getAllTimePoints: function() {
            const earned = this.data.totalPoints || 0;
            
            const adminRecords = this.data.adminAdjustmentRecords || [];
            const positiveAdminAdjustments = adminRecords
                .filter(record => record.points_adjusted > 0)
                .reduce((total, record) => total + record.points_adjusted, 0);
            
            const allTime = earned + positiveAdminAdjustments;
            
            console.log(`📊 All Time Calculation: earned (${earned}pt) + positive admin (${positiveAdminAdjustments}pt) = ${allTime}pt`);
            
            return allTime;
        },

        // Check for expired appointments and update their status
        checkExpiredAppointments: async function() {
            const now = new Date();
            let hasUpdates = false;
            const appointmentsToUpdate = [];

            for (const appointment of this.data.appointments) {
                if (appointment.status === 'active' || appointment.status === 'approved') {
                    // Parse appointment date (YYYY-MM-DD format)
                    const dateParts = appointment.appointmentDate.split('-');
                    const appointmentDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                    
                    // Set expiry time to 12:01 AM of the next day
                    const expiryDate = new Date(appointmentDate);
                    expiryDate.setDate(expiryDate.getDate() + 1); // Next day
                    expiryDate.setHours(0, 1, 0, 0); // 12:01 AM
                    
                    // Check if the appointment has expired (after 12:01 AM of next day)
                    if (now >= expiryDate) {
                        appointment.status = 'completed';
                        hasUpdates = true;
                        
                        // Track appointment for database update
                        if (appointment.id) {
                            appointmentsToUpdate.push(appointment);
                        }
                        
                        console.log(`Appointment ${appointment.bookingId} automatically moved to completed (expired on ${expiryDate.toLocaleString()})`);
                    }
                }
            }

            // Save changes if any appointments were updated
            if (hasUpdates) {
                this.savePoints();
                
                // Update database for each expired appointment
                if (typeof dbService !== 'undefined' && appointmentsToUpdate.length > 0) {
                    for (const appointment of appointmentsToUpdate) {
                        try {
                            await dbService.updateAppointment(appointment.id, { status: 'completed' });
                            console.log(`✅ Database updated: Appointment ${appointment.bookingId} marked as completed`);
                        } catch (error) {
                            console.error(`❌ Failed to update appointment ${appointment.bookingId} in database:`, error);
                        }
                    }
                }
                
                console.log('Updated expired appointments to completed status');
            }
        },

        // Update appointment display on appointment screen
        updateAppointmentDisplay: async function() {
            console.log('🔄 Updating appointment display with', this.data.appointments.length, 'appointments');
            
            // Check for expired appointments first
            await this.checkExpiredAppointments();
            
            this.displayActiveAppointments();
            this.displayCompletedAppointments();
            
            console.log('✅ Appointment display updated');
        },

        // Display active appointments (includes pending and active)
        displayActiveAppointments: function() {
            const activeAppointments = this.data.appointments.filter(apt => apt.status === 'active' || apt.status === 'pending');
            console.log(`📋 Displaying ${activeAppointments.length} active/pending appointments`);
            
            const activeSection = document.querySelector('.appointments-section h2');
            const activeContainer = document.querySelector('.appointments-section .appointment-card');

            if (!activeContainer) {
                console.warn('⚠️ Active appointments container not found in DOM - user may not be on appointments screen');
                return;
            }

            if (activeSection) {
                activeSection.textContent = `Active Appointment (${activeAppointments.length})`;
            }

            if (activeAppointments.length > 0) {
                activeContainer.className = 'appointment-card';
                activeContainer.innerHTML = '';

                activeAppointments.forEach(appointment => {
                    const appointmentCard = this.createAppointmentCard(appointment);
                    activeContainer.appendChild(appointmentCard);
                    console.log(`  ➕ Rendered appointment card: ${appointment.bookingId} (${appointment.status})`);
                });
            } else {
                activeContainer.className = 'appointment-card empty-state';
                activeContainer.innerHTML = `
                    <i class="fas fa-calendar-alt appointment-icon"></i>
                    <div class="appointment-text">
                        <p class="no-appointments">No active appointments</p>
                        <p class="appointment-subtitle">Book an appointment with your preferred doctor</p>
                    </div>
                    <button class="find-doctor-btn" onclick="switchScreen('specialist')">Find Doctor</button>
                `;
            }
        },

        // Display completed appointments
        displayCompletedAppointments: function() {
            const completedAppointments = this.data.appointments.filter(apt => apt.status === 'completed');
            const completedSection = document.querySelectorAll('.appointments-section h2')[1];
            const completedContainer = document.querySelectorAll('.appointments-section .appointment-card')[1];

            if (completedSection) {
                completedSection.textContent = `Completed Appointment (${completedAppointments.length})`;
            }

            if (completedContainer) {
                if (completedAppointments.length > 0) {
                    completedContainer.className = 'appointment-card';
                    completedContainer.innerHTML = '';

                    completedAppointments.forEach(appointment => {
                        const appointmentCard = this.createAppointmentCard(appointment);
                        completedContainer.appendChild(appointmentCard);
                    });
                } else {
                    completedContainer.className = 'appointment-card empty-state';
                    completedContainer.innerHTML = `
                        <i class="fas fa-calendar-check appointment-icon"></i>
                        <div class="appointment-text">
                            <p class="no-appointments">No completed appointments</p>
                            <p class="appointment-subtitle">Your appointment history will appear here</p>
                        </div>
                    `;
                }
            }
        },

        // Create appointment card HTML
        createAppointmentCard: function(appointment) {
            const appointmentCard = document.createElement('div');
            appointmentCard.className = 'booking-appointment-card';

            // Format the appointment date using helper function
            const formattedDate = formatDateDDMMYYYY(appointment.appointmentDate);

            // Determine status display and styling
            let statusClass = '';
            let statusText = '';
            
            switch(appointment.status) {
                case 'pending':
                    statusClass = 'appointment-status-pending';
                    statusText = 'Pending';
                    break;
                case 'active':
                case 'approved':
                    statusClass = 'appointment-status-approved';
                    statusText = 'Approved';
                    break;
                case 'completed':
                    statusClass = 'appointment-status-completed';
                    statusText = 'Completed';
                    break;
                case 'cancelled':
                    statusClass = 'appointment-status-cancelled';
                    statusText = 'Cancelled';
                    break;
                default:
                    statusClass = 'appointment-status-pending';
                    statusText = 'Pending';
            }

            appointmentCard.innerHTML = `
                <div class="booking-card-header">
                    <div class="booking-id">BOOKING ID: ${appointment.bookingId}</div>
                </div>
                <div class="booking-card-content">
                    <div class="doctor-section">
                        <div class="doctor-name">${appointment.doctorName}</div>
                        <div class="doctor-category-badge">${appointment.doctorCategory}</div>
                    </div>
                    <div class="patient-info">
                        <div class="patient-name">${appointment.patientName}</div>
                        <div class="appointment-datetime">${formattedDate} • ${appointment.appointmentTime}</div>
                        <div class="appointment-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${appointment.patientAddress}</span>
                        </div>
                    </div>
                </div>
                <div class="booking-card-footer">
                    <button class="${statusClass}">${statusText}</button>
                    <button class="appointment-details-btn" onclick="showAppointmentDetails('${appointment.id}')">
                        DETAILS
                    </button>
                </div>
            `;

            return appointmentCard;
        },

        // Update redeem options based on available points
        updateRedeemOptions: async function() {
            const availablePointsValue = this.getAvailablePoints();
            const redeemCards = document.querySelectorAll('.redeem-card');

            // Check for pending redeem requests
            let hasPendingRequest = false;
            const currentUser = window.AuthSystem?.getUser();
            if (currentUser && currentUser.supabaseId && typeof window.dbService !== 'undefined') {
                try {
                    const existingRequests = await window.dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
                    const pendingRequests = existingRequests.filter(req => req.status === 'pending');
                    hasPendingRequest = pendingRequests.length > 0;
                } catch (error) {
                    console.error('Error checking pending requests:', error);
                }
            }

            redeemCards.forEach(card => {
                const pointsElement = card.querySelector('.redeem-points');
                const button = card.querySelector('.redeem-option-btn');
                const title = card.querySelector('h4').textContent;

                if (title === 'Sim Recharge') {
                    // Update Sim Recharge card points display to show current available points
                    const displayPoints = hasPendingRequest ? 0 : availablePointsValue;
                    pointsElement.innerHTML = `<span style="color: red;">${displayPoints} points</span>`;

                    if (availablePointsValue > 0 && !hasPendingRequest) {
                        card.classList.remove('inactive-card');
                        card.classList.add('active-card');
                        button.classList.remove('inactive');
                        button.classList.add('active');
                        button.disabled = false;
                        button.textContent = 'Redeem';
                    } else {
                        card.classList.add('inactive-card');
                        card.classList.remove('active-card');
                        button.classList.add('inactive');
                        button.classList.remove('active');
                        button.disabled = true;
                        button.textContent = hasPendingRequest ? 'Pending' : 'Redeem';
                    }
                } else if (title === '30% Bonus') {
                    if (availablePointsValue >= 300 && !hasPendingRequest) {
                        card.classList.remove('inactive-card');
                        card.classList.add('active-card');
                        button.classList.remove('inactive');
                        button.classList.add('active');
                        button.disabled = false;
                        button.textContent = 'Redeem';
                        button.onclick = openBonusPopup;
                    } else {
                        card.classList.add('inactive-card');
                        card.classList.remove('active-card');
                        button.classList.add('inactive');
                        button.classList.remove('active');
                        button.disabled = true;
                        button.textContent = hasPendingRequest ? 'Pending' : 'Redeem';
                        button.onclick = null;
                    }
                } else if (title === 'bKash Cash') {
                    if (availablePointsValue >= 100 && !hasPendingRequest) {
                        card.classList.remove('inactive-card');
                        card.classList.add('active-card');
                        button.classList.remove('inactive');
                        button.classList.add('active');
                        button.disabled = false;
                        button.textContent = 'Redeem';
                        button.onclick = openbKashCashPopup;
                    } else {
                        card.classList.add('inactive-card');
                        card.classList.remove('active-card');
                        button.classList.add('inactive');
                        button.classList.remove('active');
                        button.disabled = true;
                        button.textContent = hasPendingRequest ? 'Pending' : 'Redeem';
                        button.onclick = null;
                    }
                } else if (title === 'Get a Mobile Gift') {
                    if (availablePointsValue >= 2000 && !hasPendingRequest) {
                        card.classList.remove('inactive-card');
                        card.classList.add('active-card');
                        button.classList.remove('inactive');
                        button.classList.add('active');
                        button.disabled = false;
                        button.textContent = 'Redeem';
                        button.onclick = openMobileGiftPopup;
                    } else {
                        card.classList.add('inactive-card');
                        card.classList.remove('active-card');
                        button.classList.add('inactive');
                        button.classList.remove('active');
                        button.disabled = true;
                        button.textContent = hasPendingRequest ? 'Pending' : 'Redeem';
                        button.onclick = null;
                    }
                }
            });
        },

        // Update wallet display
        updateWalletDisplay: async function() {
            console.log('💰 Updating wallet display');
            console.log('  Earned points (from appointments):', this.data.totalPoints);
            console.log('  Admin adjusted points:', this.data.adminAdjustedPoints);
            console.log('  Redeemed points:', this.data.redeemedPoints);
            console.log('  This month earnings:', this.getPointsThisMonth());
            console.log('  Last month earnings:', this.getPointsLastMonth());
            console.log('  Available points:', this.getAvailablePoints());
            console.log('  All time points:', this.getAllTimePoints());
            
            const earnedThisMonth = document.getElementById('earned-this-month');
            const earnedLastMonth = document.getElementById('earned-last-month');
            const availablePoints = document.getElementById('available-points');
            const allTimePoints = document.getElementById('all-time-points');

            // Also update redeem tab and redeem screen available points
            const redeemAvailablePoints = document.getElementById('redeem-available-points');
            const redeemScreenAvailablePoints = document.getElementById('redeem-screen-available-points');

            const availablePointsValue = this.getAvailablePoints();
            let displayAvailablePoints = availablePointsValue <= 0 ? 0 : availablePointsValue;
            
            // Check for pending redeem requests and show 00pt if any exist
            const currentUser = window.AuthSystem?.getUser();
            if (currentUser && currentUser.supabaseId && typeof window.dbService !== 'undefined') {
                try {
                    const existingRequests = await window.dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
                    const pendingRequests = existingRequests.filter(req => req.status === 'pending');
                    
                    if (pendingRequests.length > 0) {
                        displayAvailablePoints = 0;
                        console.log('  ⚠️ Pending redeem request found - displaying 00pt');
                    }
                } catch (error) {
                    console.error('  ❌ Error checking pending requests:', error);
                }
            }
            
            const formattedPoints = String(displayAvailablePoints).padStart(2, '0');

            if (earnedThisMonth) {
                earnedThisMonth.textContent = String(this.getPointsThisMonth()).padStart(2, '0');
            }
            if (earnedLastMonth) {
                earnedLastMonth.textContent = String(this.getPointsLastMonth()).padStart(2, '0');
            }
            if (availablePoints) {
                availablePoints.textContent = formattedPoints;
                console.log('  ✅ Updated available points display');
            } else {
                console.warn('  ⚠️ Available points element not found');
            }
            if (allTimePoints) {
                allTimePoints.textContent = String(this.getAllTimePoints()).padStart(2, '0');
            }
            if (redeemAvailablePoints) {
                redeemAvailablePoints.textContent = formattedPoints;
            }
            if (redeemScreenAvailablePoints) {
                redeemScreenAvailablePoints.textContent = formattedPoints;
            }

            // Update transaction history
            this.updateTransactionHistory();

            // Update redeem options
            this.updateRedeemOptions();
            
            console.log('✅ Wallet display updated');
        },

        // Redeem points 
        redeemPoints: function(amount, description, transactionId) {
            if (amount <= this.getAvailablePoints()) {
                const redemption = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    amount: amount,
                    description: description || 'Points Redeemed',
                    transactionId: transactionId || this.generateTransactionId(),
                    type: 'redeemed'
                };

                // Initialize redemptions array if it doesn't exist
                if (!this.data.redemptions) {
                    this.data.redemptions = [];
                }

                this.data.redemptions.push(redemption);
                this.data.redeemedPoints += amount;
                this.savePoints();
                this.updateWalletDisplay();

                console.log('Points redeemed:', redemption);
                return redemption;
            }
            return false;
        },

        // Generate transaction ID
        generateTransactionId: function() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 10; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },

        // Get appointment history
        getAppointmentHistory: function() {
            return this.data.appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        // Get redemption history
        getRedemptionHistory: function() {
            if (!this.data.redemptions) {
                this.data.redemptions = [];
            }
            return this.data.redemptions.sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        // Create transaction card HTML
        createTransactionCard: function(transaction, type) {
            const transactionDate = new Date(transaction.date);
            const formattedDate = transactionDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }).toLowerCase();

            if (type === 'earned') {
                return `
                    <div class="transaction-card earned">
                        <div class="transaction-info">
                            <h4>${transaction.doctorName}</h4>
                            <p>Appointment</p>
                            <span class="transaction-date">${formattedDate}</span>
                        </div>
                        <div class="transaction-points earned-points">+${transaction.points} points</div>
                    </div>
                `;
            } else if (type === 'redeemed') {
                return `
                    <div class="transaction-card redeemed">
                        <div class="transaction-info">
                            <h4>You have redeemed</h4>
                            <p>${transaction.description}</p>
                            <span class="transaction-date">${formattedDate}</span>
                            <span class="transaction-id">Transaction id: ${transaction.transactionId}</span>
                        </div>
                        <div class="transaction-points redeemed-points">-${transaction.amount} points</div>
                    </div>
                `;
            }
        },

        // Update transaction history in tabs
        updateTransactionHistory: async function() {
            const allList = document.getElementById('all-transaction-list');
            const earnedList = document.getElementById('earned-transaction-list');
            const redeemedList = document.getElementById('redeemed-transaction-list');

            if (!allList || !earnedList || !redeemedList) return;

            // Clear existing content
            allList.innerHTML = '';
            earnedList.innerHTML = '';
            redeemedList.innerHTML = '';

            // Get all transactions
            const appointments = this.getAppointmentHistory();
            const redemptions = [];
            
            const currentUser = window.AuthSystem?.getUser();
            if (currentUser && currentUser.supabaseId && typeof window.dbService !== 'undefined') {
                try {
                    const redeemRequests = await window.dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
                    const acceptedRequests = redeemRequests.filter(req => req.status === 'accepted');
                    
                    acceptedRequests.forEach(req => {
                        redemptions.push({
                            date: req.processed_date || req.request_date,
                            description: req.redeem_type,
                            amount: req.points_to_redeem,
                            transactionId: req.request_id
                        });
                    });
                } catch (error) {
                    console.error('Error fetching redeem requests:', error);
                }
            }

            // Use Sets to track unique transaction IDs and prevent duplicates
            const seenAppointmentIds = new Set();
            const seenRedemptionIds = new Set();
            const allTransactions = [];

            // Create earned transaction cards
            appointments.forEach(appointment => {
                const transactionId = appointment.bookingId || appointment.transactionId;
                if (!seenAppointmentIds.has(transactionId)) {
                    seenAppointmentIds.add(transactionId);
                    const cardHtml = this.createTransactionCard(appointment, 'earned');
                    earnedList.insertAdjacentHTML('beforeend', cardHtml);
                    allTransactions.push({ html: cardHtml, date: appointment.appointmentDate, type: 'earned' });
                }
            });

            // Create redeemed transaction cards
            redemptions.forEach(redemption => {
                const transactionId = redemption.transactionId;
                if (!seenRedemptionIds.has(transactionId)) {
                    seenRedemptionIds.add(transactionId);
                    const cardHtml = this.createTransactionCard(redemption, 'redeemed');
                    redeemedList.insertAdjacentHTML('beforeend', cardHtml);
                    allTransactions.push({ html: cardHtml, date: redemption.date, type: 'redeemed' });
                }
            });

            // Sort all transactions by date and add to allList
            allTransactions.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });

            allTransactions.forEach(transaction => {
                allList.insertAdjacentHTML('beforeend', transaction.html);
            });

            // Show empty state if no transactions
            if (appointments.length === 0 && redemptions.length === 0) {
                allList.innerHTML = '<div class="empty-state"><p>No transactions yet. Book an appointment to start earning points!</p></div>';
            }
            if (appointments.length === 0) {
                earnedList.innerHTML = '<div class="empty-state"><p>No points earned yet. Book an appointment to start earning points!</p></div>';
            }
            if (redemptions.length === 0) {
                redeemedList.innerHTML = '<div class="empty-state"><p>No points redeemed yet.</p></div>';
            }
        }
    };

    // Initialize points system when DOM is ready
    PointsSystem.init();
    
    // Expose PointsSystem globally
    window.PointsSystem = PointsSystem;

    // Function to award points after successful appointment
    window.awardAppointmentPoints = function(appointmentDetails) {
        return PointsSystem.addAppointmentPoints(appointmentDetails);
    };

    // Function to manually update wallet display
    window.updateWalletPoints = function() {
        PointsSystem.updateWalletDisplay();
    };

    // Prescription Management System
    const PrescriptionSystem = {
        data: {
            prescriptions: []
        },

        init: function() {
            this.loadPrescriptions();
        },

        loadPrescriptions: function() {
            const saved = InMemoryStorage.prescriptionData;
            if (saved) {
                this.data = JSON.parse(saved);
            }
            if (!this.data.prescriptions) {
                this.data.prescriptions = [];
            }
        },

        savePrescriptions: function() {
            InMemoryStorage.prescriptionData = this.data;
        },

        // Generate prescription from appointment
        generatePrescriptionFromAppointment: function(appointment) {
            const prescriptionId = 'RX' + Date.now();
            const prescription = {
                id: prescriptionId,
                appointmentId: appointment.id || appointment.bookingId,
                bookingId: appointment.bookingId || `MQ${Date.now()}`,
                doctorName: appointment.doctorName,
                doctorCategory: appointment.doctorCategory,
                patientName: appointment.patientName,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                status: 'pending', // pending until admin uploads download link
                downloadable: false,
                downloadUrl: null, // Will be set by admin when prescription is uploaded
                createdDate: new Date().toISOString(),
                availableDate: null
            };

            this.data.prescriptions.push(prescription);
            this.savePrescriptions();
            console.log('Prescription generated:', prescription);
            return prescription;
        },

        // Make prescription available for download (admin function)
        makePrescriptionAvailable: function(prescriptionId, downloadUrl, patientName) {
            const prescription = this.data.prescriptions.find(p => p.id === prescriptionId);
            if (!prescription) {
                console.error('Prescription not found:', prescriptionId);
                return null;
            }
            
            // Validate download URL for security
            if (!downloadUrl || typeof downloadUrl !== 'string') {
                console.error('Invalid download URL provided');
                return null;
            }
            
            // Only allow http/https URLs for security
            const urlPattern = /^https?:\/\/.+/i;
            if (!urlPattern.test(downloadUrl)) {
                console.error('Download URL must be http or https:', downloadUrl);
                return null;
            }
            
            // Update prescription status atomically
            prescription.status = 'available';
            prescription.downloadable = true;
            prescription.downloadUrl = downloadUrl;
            prescription.availableDate = new Date().toISOString();
            this.savePrescriptions();

            // Update UI immediately
            if (typeof updatePrescriptionDisplay === 'function') {
                updatePrescriptionDisplay();
            }

            // Send notification to user
            this.sendPrescriptionNotification(patientName, prescription);
            
            // Show success confirmation popup
            this.showDownloadAvailableConfirmation(prescription);
            
            console.log('Prescription made available with download link:', prescription);
            return prescription;
        },

        // Send notification about prescription availability
        sendPrescriptionNotification: function(patientName, prescription) {
            const notification = {
                id: Date.now(),
                type: 'prescription',
                title: 'Prescription Available',
                message: `Your ${patientName} prescription is available, you can download prescription`,
                date: new Date().toISOString(),
                read: false,
                prescriptionId: prescription.id
            };

            // Add to notification system
            NotificationsSystem.addNotification('general', notification);
            
            console.log('Prescription notification sent:', notification);
        },

        // Show confirmation popup when prescription becomes available
        showDownloadAvailableConfirmation: function(prescription) {
            const message = `Great news! Your prescription is now ready for download.\\n\\n` +
                          `Doctor: ${prescription.doctorName}\\n` +
                          `Patient: ${prescription.patientName}\\n` +
                          `Booking ID: ${prescription.bookingId}\\n\\n` +
                          `You can now successfully download your prescription from the prescription screen.`;
            
            // Use CustomDialog for consistent UI
            if (typeof CustomDialog !== 'undefined') {
                CustomDialog.alert(message, 'Prescription Ready for Download');
            } else {
                alert(message);
            }
            
            console.log('Download available confirmation shown for prescription:', prescription.id);
        },

        // Helper function to check if prescription is downloadable
        isPrescriptionDownloadable: function(prescription) {
            return prescription.status === 'available' && 
                   prescription.downloadable === true && 
                   prescription.downloadUrl && 
                   prescription.downloadUrl !== '#' &&
                   /^https?:\/\/.+/i.test(prescription.downloadUrl);
        },

        // Get prescriptions for current user
        getUserPrescriptions: function() {
            return this.data.prescriptions.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        },

        // Check appointment date and return appropriate download message
        getDownloadMessage: function(prescription) {
            const appointmentDate = new Date(prescription.appointmentDate);
            const today = new Date();
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());

            if (prescription.status === 'available') {
                return null; // Can download
            }

            if (appointmentDateOnly.getTime() === todayDate.getTime()) {
                return "Prescription will be available for download soon";
            } else {
                return "You can download prescription after doctor visit";
            }
        },

        // Create prescription card HTML
        createPrescriptionCard: function(prescription) {
            const appointmentDate = new Date(prescription.appointmentDate);
            const formattedDate = formatDateDDMMYYYY(prescription.appointmentDate);

            const downloadMessage = this.getDownloadMessage(prescription);
            
            return `
                <div class="prescription-card">
                    <div class="prescription-card-header">
                        <div class="prescription-booking-id">Booking ID: ${prescription.bookingId}</div>
                        <div class="prescription-icon">
                            <i class="fas fa-prescription-bottle"></i>
                        </div>
                    </div>
                    <div class="prescription-card-body">
                        <div class="prescription-doctor-info">
                            <div class="prescription-doctor-name">${prescription.doctorName}</div>
                            <div class="prescription-doctor-category">${prescription.doctorCategory}</div>
                            <div class="prescription-patient-name">Patient: ${prescription.patientName}</div>
                            <div class="prescription-datetime">${formattedDate} • ${prescription.appointmentTime}</div>
                        </div>
                    </div>
                    <div class="prescription-card-footer">
                        <div class="prescription-status ${prescription.status}">
                            ${prescription.status === 'available' ? 'Available' : 'Pending'}
                        </div>
                        ${this.isPrescriptionDownloadable(prescription) ? 
                            `<button class="prescription-download-btn" onclick="downloadPrescription('${prescription.id}')">
                                <i class="fas fa-download"></i>
                                Download
                            </button>` : 
                            `<button class="prescription-download-btn disabled" style="opacity: 0.5; cursor: not-allowed;" onclick="showDownloadConfirmation('${prescription.id}')">
                                <i class="fas fa-download"></i>
                                Download
                            </button>`
                        }
                    </div>
                </div>
            `;
        }
    };

    // Initialize prescription system
    PrescriptionSystem.init();

    // Global functions for prescription screen
    window.updatePrescriptionDisplay = function() {
        console.log('Updating prescription display');
        
        const emptyState = document.getElementById('prescription-empty-state');
        const prescriptionList = document.getElementById('prescription-list');
        
        if (!emptyState || !prescriptionList) {
            console.log('Prescription elements not found');
            return;
        }

        // Get prescriptions from Supabase synced data
        const prescriptionData = InMemoryStorage.prescriptionData || { prescriptions: [] };
        const prescriptions = prescriptionData.prescriptions || [];
        
        console.log('Prescription data from Supabase:', prescriptions);
        
        if (prescriptions.length === 0) {
            emptyState.style.display = 'block';
            prescriptionList.style.display = 'none';
            console.log('No prescriptions found, showing empty state');
        } else {
            emptyState.style.display = 'none';
            prescriptionList.style.display = 'block';
            
            prescriptionList.innerHTML = '';
            prescriptions.forEach(prescription => {
                const cardHtml = createPrescriptionCardHTML(prescription);
                prescriptionList.insertAdjacentHTML('beforeend', cardHtml);
            });
            
            console.log(`Displayed ${prescriptions.length} prescriptions`);
        }
    };

    function createPrescriptionCardHTML(prescription) {
        const isDownloadable = prescription.prescriptionUrl && prescription.status === 'available';
        const formattedDate = new Date(prescription.appointmentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Escape URL for safe HTML attribute usage
        const escapedUrl = prescription.prescriptionUrl ? prescription.prescriptionUrl.replace(/'/g, "\\'") : '';
        
        return `
            <div class="prescription-card">
                <div class="prescription-card-header">
                    <div class="prescription-info">
                        <h3>Dr. ${prescription.doctorName}</h3>
                        <p class="specialty">${prescription.doctorSpecialty}</p>
                    </div>
                    <div class="booking-id">ID: ${prescription.bookingId}</div>
                </div>
                <div class="prescription-card-body">
                    <div class="info-row">
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-clock"></i>
                        <span>${prescription.appointmentTime}</span>
                    </div>
                    ${prescription.prescriptionNotes ? `
                        <div class="info-row">
                            <i class="fas fa-notes-medical"></i>
                            <span>${prescription.prescriptionNotes}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="prescription-card-footer">
                    <div class="prescription-status ${prescription.status}">
                        ${prescription.status === 'available' ? 'Available' : 'Pending'}
                    </div>
                    ${isDownloadable ? 
                        `<button class="prescription-download-btn" onclick="window.downloadPrescriptionFromSupabase('${prescription.id}', '${escapedUrl}')">
                            <i class="fas fa-download"></i>
                            Download
                        </button>` : 
                        `<button class="prescription-download-btn disabled" style="opacity: 0.5; cursor: not-allowed;" disabled>
                            <i class="fas fa-download"></i>
                            Not Available
                        </button>`
                    }
                </div>
            </div>
        `;
    }

    // Show download confirmation popup
    window.showDownloadConfirmation = function(prescriptionId) {
        console.log('Download confirmation clicked for prescription:', prescriptionId);
        const prescription = PrescriptionSystem.data.prescriptions.find(p => p.id === prescriptionId);
        if (!prescription) {
            console.log('Prescription not found:', prescriptionId);
            CustomDialog.alert('Prescription not found.', 'Error');
            return;
        }

        console.log('Prescription found:', prescription);
        
        if (prescription.status === 'pending') {
            const message = `Your prescription is currently being processed.\\n\\n` +
                          `Doctor: ${prescription.doctorName}\\n` +
                          `Patient: ${prescription.patientName}\\n` +
                          `Booking ID: ${prescription.bookingId}\\n\\n` +
                          `The download button will become active once admin uploads your prescription file and makes it available.`;
            CustomDialog.alert(message, 'Prescription Pending');
        } else {
            const message = PrescriptionSystem.getDownloadMessage(prescription);
            console.log('Download message:', message);
            if (message) {
                CustomDialog.alert(message, 'Download Information');
            } else {
                CustomDialog.alert('Prescription will be available for download soon.', 'Download Information');
            }
        }
    };

    // Download prescription from Supabase (when available)
    window.downloadPrescriptionFromSupabase = function(prescriptionId, prescriptionUrl) {
        console.log('Download button clicked for prescription:', prescriptionId);
        console.log('Prescription URL:', prescriptionUrl);
        
        // Validate URL
        if (!prescriptionUrl || prescriptionUrl.trim() === '' || prescriptionUrl === 'undefined' || prescriptionUrl === 'null') {
            console.log('Prescription URL not available or invalid');
            CustomDialog.alert('Prescription is not available for download yet. Please wait for the admin to upload the prescription file.', 'Download Not Available');
            return;
        }

        // Basic URL validation
        try {
            new URL(prescriptionUrl);
        } catch (e) {
            console.error('Invalid URL format:', prescriptionUrl);
            CustomDialog.alert('The prescription link is invalid. Please contact support.', 'Invalid Link');
            return;
        }

        try {
            // Open the download URL in a new tab with security attributes
            const downloadWindow = window.open(prescriptionUrl, '_blank', 'noopener,noreferrer');
            
            // Check if popup was blocked
            if (!downloadWindow || downloadWindow.closed || typeof downloadWindow.closed === 'undefined') {
                console.warn('Popup blocked, trying alternative method');
                // Alternative: create a temporary link and click it
                const link = document.createElement('a');
                link.href = prescriptionUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                CustomDialog.alert('Prescription download initiated. If it doesn\'t open automatically, please check your popup blocker.', 'Download Started');
            } else {
                console.log('Opening prescription download URL:', prescriptionUrl);
                CustomDialog.alert('Prescription download started successfully!', 'Download Complete');
            }
        } catch (error) {
            console.error('Error opening download URL:', error);
            CustomDialog.alert('There was an error opening the download link. Please try again or contact support.', 'Download Error');
        }
    };

    // Legacy download prescription function (kept for backward compatibility)
    window.downloadPrescription = function(prescriptionId) {
        console.log('Download button clicked for prescription:', prescriptionId);
        const prescription = PrescriptionSystem.data.prescriptions.find(p => p.id === prescriptionId);
        console.log('Found prescription:', prescription);
        
        if (!prescription) {
            console.log('Prescription not found');
            CustomDialog.alert('Prescription not found.', 'Download Error');
            return;
        }
        
        // Use the helper function to check if downloadable
        if (!PrescriptionSystem.isPrescriptionDownloadable(prescription)) {
            console.log('Prescription not downloadable, status:', prescription.status, 'URL:', prescription.downloadUrl);
            CustomDialog.alert('Prescription is not available for download yet. Please wait for admin to upload the prescription file.', 'Download Not Available');
            return;
        }

        try {
            // Open the download URL in a new tab with security attributes
            const downloadWindow = window.open(prescription.downloadUrl, '_blank', 'noopener,noreferrer');
            
            // Check if popup was blocked
            if (!downloadWindow) {
                console.warn('Popup blocked, trying alternative method');
                // Alternative: create a temporary link and click it
                const link = document.createElement('a');
                link.href = prescription.downloadUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            console.log('Opening prescription download URL:', prescription.downloadUrl);
            CustomDialog.alert('Prescription download started successfully!', 'Download Complete');
        } catch (error) {
            console.error('Error opening download URL:', error);
            CustomDialog.alert('There was an error opening the download link. Please try again or contact support.', 'Download Error');
        }
        
        console.log('Prescription download initiated:', prescriptionId);
    };

    // Admin function to make prescription available with download link
    window.makePrescriptionAvailable = function(prescriptionId, downloadUrl, patientName) {
        return PrescriptionSystem.makePrescriptionAvailable(prescriptionId, downloadUrl, patientName);
    };

    // Function to activate all existing prescriptions (admin use only)
    window.activateAllPrescriptions = function(downloadUrl) {
        const prescriptions = PrescriptionSystem.getUserPrescriptions();
        console.log('Activating', prescriptions.length, 'prescriptions');
        
        prescriptions.forEach(prescription => {
            if (prescription.status === 'pending') {
                prescription.status = 'available';
                prescription.downloadable = true;
                prescription.downloadUrl = downloadUrl || '#';
                prescription.availableDate = new Date().toISOString();
            }
        });
        
        PrescriptionSystem.savePrescriptions();
        updatePrescriptionDisplay();
        console.log('All prescriptions are now available for download with URL:', downloadUrl);
        
        // Show confirmation for first prescription as example
        if (prescriptions.length > 0) {
            const firstPrescription = prescriptions[0];
            PrescriptionSystem.showDownloadAvailableConfirmation(firstPrescription);
        }
    };

    // Note: Prescriptions now start as 'pending' by default and require admin activation
    // No auto-activation on page load - prescriptions remain pending until admin uploads download link

    // Expose PrescriptionSystem globally for testing
    window.PrescriptionSystem = PrescriptionSystem;

    // Settings Modal Functions

    // Open modal function
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    // Close modal function
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('settings-modal')) {
            closeModal(e.target.id);
        }
    });

    // Password visibility toggle
    window.togglePasswordVisibility = function(inputId) {
        const input = document.getElementById(inputId);
        const button = input.nextElementSibling;
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    // Password Strength Validation Functions
    window.checkPasswordRequirement = function(password, type) {
        switch (type) {
            case 'length':
                return password.length >= 8;
            case 'uppercase':
                return /[A-Z]/.test(password);
            case 'lowercase':
                return /[a-z]/.test(password);
            case 'number':
                return /[0-9]/.test(password);
            default:
                return false;
        }
    };

    window.calculatePasswordStrength = function(password) {
        if (!password) return { score: 0, text: 'Password strength', class: '' };

        let score = 0;
        const requirements = ['length', 'uppercase', 'lowercase', 'number'];
        
        requirements.forEach(req => {
            if (checkPasswordRequirement(password, req)) {
                score++;
            }
        });

        if (score === 0) {
            return { score: 0, text: 'Very weak', class: 'weak' };
        } else if (score === 1) {
            return { score: 1, text: 'Weak', class: 'weak' };
        } else if (score === 2) {
            return { score: 2, text: 'Fair', class: 'fair' };
        } else if (score === 3) {
            return { score: 3, text: 'Good', class: 'good' };
        } else {
            return { score: 4, text: 'Strong', class: 'strong' };
        }
    };

    window.updatePasswordStrength = function(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthFill || !strengthText) return;

        const strength = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthFill.className = 'strength-fill';
        if (strength.class) {
            strengthFill.classList.add(strength.class);
        }
        
        // Update strength bar width and color based on score
        const widths = ['0%', '25%', '50%', '75%', '100%'];
        const colors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#44aa44'];
        
        strengthFill.style.width = widths[strength.score] || '0%';
        strengthFill.style.backgroundColor = colors[strength.score] || '#ff4444';
        
        // Update strength text
        strengthText.textContent = strength.text;
        strengthText.className = 'strength-text';
        if (strength.class) {
            strengthText.classList.add(strength.class);
        }
        
        // Update requirement indicators
        const requirements = [
            { id: 'req-length', type: 'length' },
            { id: 'req-uppercase', type: 'uppercase' },
            { id: 'req-lowercase', type: 'lowercase' },
            { id: 'req-number', type: 'number' }
        ];
        
        requirements.forEach(req => {
            const element = document.getElementById(req.id);
            const icon = element?.querySelector('i');
            
            if (element && icon) {
                const isMet = checkPasswordRequirement(password, req.type);
                
                element.className = 'requirement-item';
                element.classList.add(isMet ? 'met' : 'unmet');
                
                icon.className = isMet ? 'fas fa-check-circle' : 'fas fa-times-circle';
            }
        });
    };

    // Initialize password strength checker
    window.initializePasswordStrengthChecker = function() {
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
                updatePasswordMatch();
            });
            
            // Initialize with empty state
            updatePasswordStrength('');
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', updatePasswordMatch);
        }
        
        // Initialize password match indicator
        updatePasswordMatch();
    };

    // Password Match Checker
    window.updatePasswordMatch = function() {
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const matchIndicator = document.getElementById('passwordMatchStatus');
        
        if (!newPasswordInput || !confirmPasswordInput || !matchIndicator) return;
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const icon = matchIndicator.querySelector('i');
        const text = matchIndicator.querySelector('span');
        
        if (!confirmPassword) {
            // Empty confirm password field
            matchIndicator.className = 'match-item';
            icon.className = 'fas fa-times-circle';
            text.textContent = 'Passwords must match';
        } else if (newPassword === confirmPassword) {
            // Passwords match
            matchIndicator.className = 'match-item matched';
            icon.className = 'fas fa-check-circle';
            text.textContent = 'Passwords match';
        } else {
            // Passwords don't match
            matchIndicator.className = 'match-item mismatched';
            icon.className = 'fas fa-times-circle';
            text.textContent = 'Passwords do not match';
        }
    };

    // Enhanced Change Password Form Validation
    window.validateChangePasswordForm = function(currentPassword, newPassword, confirmPassword) {
        const errors = [];
        
        // Check if current password is provided
        if (!currentPassword.trim()) {
            errors.push('Current password is required');
        }
        
        // Check minimum length
        if (newPassword.length < 8) {
            errors.push('New password must be at least 8 characters long');
        }
        
        // Check password strength requirements
        if (!checkPasswordRequirement(newPassword, 'uppercase')) {
            errors.push('New password must contain at least one uppercase letter');
        }
        
        if (!checkPasswordRequirement(newPassword, 'lowercase')) {
            errors.push('New password must contain at least one lowercase letter');
        }
        
        if (!checkPasswordRequirement(newPassword, 'number')) {
            errors.push('New password must contain at least one number');
        }
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            errors.push('New passwords do not match');
        }
        
        return errors;
    };


    // Change Password Form Handler
    document.addEventListener('DOMContentLoaded', function() {
        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            const newPasswordInput = document.getElementById('newPassword');

            // Initialize enhanced password strength checker
            initializePasswordStrengthChecker();

            changePasswordForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                // Enhanced validation using new functions
                const validationErrors = validateChangePasswordForm(currentPassword, newPassword, confirmPassword);
                
                if (validationErrors.length > 0) {
                    CustomDialog.alert('Please fix the following issues:\n\n• ' + validationErrors.join('\n• '), 'Password Validation');
                    return;
                }

                if (currentPassword === newPassword) {
                    CustomDialog.alert('New password must be different from current password!', 'Password Validation');
                    return;
                }

                // Get current user data
                const currentUser = AuthSystem.getUser();
                if (!currentUser || !currentUser.supabaseId) {
                    CustomDialog.alert('Unable to verify your account. Please sign in again.', 'Authentication Error');
                    return;
                }

                // Disable submit button and show loading state
                const submitButton = changePasswordForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Updating...';

                try {
                    // Call the backend API to change password
                    const response = await fetch('https://mediquick-p37c.onrender.com/api/change-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: currentUser.supabaseId,
                            currentPassword: currentPassword,
                            newPassword: newPassword
                        })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        // Handle error response
                        CustomDialog.alert(data.error || 'Failed to update password. Please try again.', 'Password Update Failed');
                        return;
                    }

                    // Clear form and close modal
                    changePasswordForm.reset();
                    updatePasswordStrength('');
                    closeModal('changePasswordModal');

                    // Show success popup
                    const successPopup = document.getElementById('passwordChangeSuccessPopup');
                    if (successPopup) {
                        successPopup.style.display = 'flex';
                    }

                    // Wait 2 seconds, then redirect to sign in
                    setTimeout(() => {
                        // Hide success popup completely
                        if (successPopup) {
                            successPopup.style.display = 'none';
                            successPopup.style.visibility = 'hidden';
                        }
                        
                        // Clear any lingering modals or popups
                        document.querySelectorAll('.popup-overlay, .settings-modal').forEach(el => {
                            el.style.display = 'none';
                        });
                        
                        // Log out user and redirect to sign-in
                        AuthSystem.logout();
                    }, 2000);

                    console.log('Password changed successfully');

                } catch (error) {
                    console.error('Error changing password:', error);
                    CustomDialog.alert('Network error. Please check your connection and try again.', 'Connection Error');
                } finally {
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            });
        }
    });

    // Notification Settings Functions
    window.loadNotificationSettings = function() {
        // Load saved settings from memory
        const settings = InMemoryStorage.notificationSettings;

        // Apply saved settings to checkboxes
        Object.keys(settings).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = settings[key];
            }
        });
    };

    window.saveNotificationSettings = function() {
        const settings = {};
        const checkboxes = document.querySelectorAll('#notificationSettingsModal input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            settings[checkbox.id] = checkbox.checked;
        });

        InMemoryStorage.notificationSettings = settings;

        // Add settings notification
        createNotification(
            'settings',
            'Settings Updated',
            'Your notification preferences have been saved successfully.',
            true
        );

        CustomDialog.alert('Notification settings saved successfully!', 'Settings Saved');
        closeModal('notificationSettingsModal');

        console.log('Notification settings saved:', settings);
    };

    // Privacy Settings Functions
    window.loadPrivacySettings = function() {
        // Load saved settings from memory
        const settings = InMemoryStorage.privacySettings;

        // Apply saved settings to checkboxes
        Object.keys(settings).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = settings[key];
            }
        });
    };

    window.savePrivacySettings = function() {
        const settings = {};
        const checkboxes = document.querySelectorAll('#privacySettingsModal input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            settings[checkbox.id] = checkbox.checked;
        });

        InMemoryStorage.privacySettings = settings;

        // Add privacy settings notification
        createNotification(
            'security',
            'Privacy Settings Updated',
            'Your privacy and security preferences have been updated successfully.',
            true
        );

        CustomDialog.alert('Privacy & security settings saved successfully!', 'Settings Saved');
        closeModal('privacySettingsModal');

        console.log('Privacy settings saved:', settings);
    };

    // Privacy action functions
    // Device detection and real-time login activity functions
    window.getDeviceInfo = function() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        let deviceType = 'desktop';
        let deviceIcon = 'fas fa-desktop';
        let deviceName = 'Desktop Computer';
        let browser = 'Unknown Browser';
        let os = 'Unknown OS';
        
        // Detect device type
        if (/Android/i.test(userAgent)) {
            deviceType = 'mobile';
            deviceIcon = 'fas fa-mobile-alt';
            os = 'Android';
            deviceName = 'Android Device';
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            deviceType = 'mobile';
            deviceIcon = userAgent.includes('iPad') ? 'fas fa-tablet-alt' : 'fas fa-mobile-alt';
            os = 'iOS';
            deviceName = userAgent.includes('iPad') ? 'iPad' : 'iPhone';
        } else if (/Windows/i.test(userAgent)) {
            os = 'Windows';
            deviceName = 'Windows Computer';
        } else if (/Mac/i.test(userAgent)) {
            os = 'macOS';
            deviceName = 'Mac Computer';
        } else if (/Linux/i.test(userAgent)) {
            os = 'Linux';
            deviceName = 'Linux Computer';
        }
        
        // Detect browser
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            browser = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browser = 'Safari';
        } else if (userAgent.includes('Edg')) {
            browser = 'Edge';
        }
        
        return {
            deviceType,
            deviceIcon,
            deviceName,
            browser,
            os,
            fullInfo: `${browser} on ${os}`
        };
    };
    
    window.getLocationInfo = function() {
        // Simulate location data (in real app, this would use geolocation API)
        const locations = [
            'Rangpur, Bangladesh',
            'Dhaka, Bangladesh',
            'Chittagong, Bangladesh',
            'Sylhet, Bangladesh',
            'Rajshahi, Bangladesh'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    };
    
    window.getRealLoginActivityData = function() {
        // Get real browser session and login data from memory
        const activities = [];
        
        try {
            // Check if there are any stored login sessions
            const storedSessions = InMemoryStorage.loginSessions;
            
            // Get current device info for comparison
            const currentDevice = getDeviceInfo();
            
            // If we have stored sessions, process them
            storedSessions.forEach(session => {
                if (session.timestamp && session.device) {
                    const loginTime = new Date(session.timestamp);
                    const now = new Date();
                    const hoursDiff = Math.floor((now - loginTime) / (1000 * 60 * 60));
                    
                    let timeString;
                    if (hoursDiff < 1) {
                        timeString = 'Just now';
                    } else if (hoursDiff < 24) {
                        timeString = `${hoursDiff} hour${hoursDiff === 1 ? '' : 's'} ago`;
                    } else {
                        const daysDiff = Math.floor(hoursDiff / 24);
                        if (daysDiff < 7) {
                            timeString = `${daysDiff} day${daysDiff === 1 ? '' : 's'} ago`;
                        } else {
                            timeString = loginTime.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            });
                        }
                    }
                    
                    activities.push({
                        device: session.device || 'Unknown Device',
                        icon: session.icon || 'fas fa-desktop',
                        info: session.info || 'Unknown Browser',
                        location: session.location || 'Unknown Location',
                        time: timeString,
                        timestamp: loginTime
                    });
                }
            });
            
            // Sort by most recent first
            activities.sort((a, b) => b.timestamp - a.timestamp);
            
        } catch (error) {
            console.log('No stored login sessions found');
        }
        
        return activities;
    };
    
    window.storeCurrentLoginSession = function() {
        try {
            const currentDevice = getDeviceInfo();
            const currentLocation = getLocationInfo();
            const now = new Date();
            
            const newSession = {
                device: currentDevice.deviceName,
                icon: currentDevice.deviceIcon,
                info: currentDevice.fullInfo,
                location: currentLocation,
                timestamp: now.getTime()
            };
            
            // Get existing sessions
            let sessions = InMemoryStorage.loginSessions;
            
            // Add new session at the beginning
            sessions.unshift(newSession);
            
            // Keep only last 10 sessions
            sessions = sessions.slice(0, 10);
            
            // Store back to memory
            InMemoryStorage.loginSessions = sessions;
            
        } catch (error) {
            console.log('Could not store login session');
        }
    };
    
    window.showLoginActivity = function() {
        console.log('Login Activity clicked');
        
        // Open the new login activity modal
        openModal('loginActivityModal');
        
        // Populate current device information
        const currentDevice = getDeviceInfo();
        const currentLocation = getLocationInfo();
        const currentTime = new Date();
        
        // Update current session info
        document.getElementById('current-device-icon').className = currentDevice.deviceIcon;
        document.getElementById('current-device-name').textContent = currentDevice.deviceName;
        document.getElementById('current-device-info').textContent = currentDevice.fullInfo;
        document.getElementById('current-location').textContent = currentLocation;
        document.getElementById('current-login-time').textContent = currentTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        // Store current session when opening login activity
        storeCurrentLoginSession();
        
        // Get and display real recent activity
        const activities = getRealLoginActivityData();
        const activityList = document.getElementById('loginActivityList');
        
        if (activities.length === 0) {
            // Show empty state when no real data is available
            activityList.innerHTML = `
                <div class="empty-activity-state">
                    <div class="empty-activity-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <h5>No Recent Activity</h5>
                    <p>No previous login sessions found. This will populate as you use the app from different devices.</p>
                </div>
            `;
        } else {
            // Filter out current session from recent activity (since it's shown separately)
            const currentTime = new Date();
            const recentActivities = activities.filter(activity => {
                const timeDiff = currentTime - activity.timestamp;
                return timeDiff > 60000; // Show activities older than 1 minute
            });
            
            if (recentActivities.length === 0) {
                activityList.innerHTML = `
                    <div class="empty-activity-state">
                        <div class="empty-activity-icon">
                            <i class="fas fa-history"></i>
                        </div>
                        <h5>No Recent Activity</h5>
                        <p>No previous login sessions found. This will populate as you use the app from different devices.</p>
                    </div>
                `;
            } else {
                activityList.innerHTML = recentActivities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-device-icon">
                            <i class="${activity.icon}"></i>
                        </div>
                        <div class="activity-details">
                            <h6>${activity.device}</h6>
                            <p>${activity.info} • ${activity.location}</p>
                        </div>
                        <div class="activity-time">
                            ${activity.time}
                        </div>
                    </div>
                `).join('');
            }
        }
    };
    
    // Security action functions
    window.terminateAllSessions = async function() {
        const shouldTerminate = await CustomDialog.confirm(
            'This will sign you out of all devices except this one. You will need to sign in again on other devices.\n\nContinue?', 
            'Sign Out All Devices'
        );
        
        if (shouldTerminate) {
            CustomDialog.alert('All other sessions have been terminated successfully. Other devices will need to sign in again.', 'Sessions Terminated');
            // In a real app, this would make an API call to invalidate all sessions
        }
    };
    
    window.reportSuspiciousActivity = function() {
        CustomDialog.alert('If you notice any suspicious login activity, please contact our support team immediately at support@mediquick.com or call +880-1750-913031.', 'Report Suspicious Activity');
        // In a real app, this would open a security report form
    };

    window.downloadData = async function() {
        const shouldDownload = await CustomDialog.confirm('This will download all your personal data in JSON format. Continue?', 'Download Data');
        if (shouldDownload) {
            const userData = {
                profile: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+8801750913031'
                },
                appointments: PointsSystem.getAppointmentHistory(),
                points: PointsSystem.data,
                settings: {
                    notifications: InMemoryStorage.notificationSettings,
                    privacy: InMemoryStorage.privacySettings
                }
            };

            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'mediquick-user-data.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            CustomDialog.alert('Your data has been downloaded successfully!', 'Download Complete');
        }
    };

    window.deactivateAccount = async function() {
        const shouldDeactivate = await CustomDialog.confirm('Are you sure you want to deactivate your account?\n\nThis will temporarily disable your account. You can reactivate it by logging in again.', 'Deactivate Account');
        if (shouldDeactivate) {
            CustomDialog.alert('Account deactivated successfully. You can reactivate by logging in again.', 'Account Deactivated');
            // In a real app, this would make an API call to deactivate the account
        }
    };

    window.deleteAccount = async function() {
        const confirmation = await CustomDialog.prompt('Type "DELETE" to confirm permanent account deletion:', 'Confirm Account Deletion');
        if (confirmation === 'DELETE') {
            const shouldDelete = await CustomDialog.confirm('This action cannot be undone. All your data will be permanently deleted.\n\nAre you absolutely sure?', 'Confirm Deletion');
            if (shouldDelete) {
                CustomDialog.alert('Account deletion request submitted. You will receive a confirmation email within 24 hours.', 'Deletion Request Submitted');
                // In a real app, this would make an API call to request account deletion
            }
        } else if (confirmation !== null) {
            CustomDialog.alert('Account deletion cancelled - confirmation text did not match.', 'Deletion Cancelled');
        }
    };

    // Language Settings Functions
    window.loadLanguageSettings = function() {
        const savedLanguage = PreferencesSystem.getLanguage();
        const languageRadio = document.getElementById('lang-' + savedLanguage);
        if (languageRadio) {
            languageRadio.checked = true;
        }
    };

    window.selectLanguage = function(language) {
        const languageRadio = document.getElementById('lang-' + language);
        if (languageRadio) {
            languageRadio.checked = true;
        }
    };

    window.saveLanguageSettings = function() {
        const selectedLanguage = document.querySelector('input[name="language"]:checked');
        if (selectedLanguage) {
            PreferencesSystem.setLanguage(selectedLanguage.value);

            // Update the profile menu text
            const languageMenuText = document.querySelector('[onclick="openLanguageSettings()"] .menu-text p');
            if (languageMenuText) {
                if (selectedLanguage.value === 'bangla') {
                    languageMenuText.textContent = 'বাংলা (Bangla)';
                } else {
                    languageMenuText.textContent = 'English';
                }
            }

            // Add language change notification
            createNotification(
                'settings',
                'Language Updated',
                `Language preference changed to ${selectedLanguage.value === 'bangla' ? 'Bangla' : 'English'} successfully.`,
                true
            );

            CustomDialog.alert('Language preference saved successfully!', 'Settings Saved');
            closeModal('languageSettingsModal');
            console.log('Language changed to:', selectedLanguage.value);
        }
    };

    // Theme Settings Functions
    window.loadThemeSettings = function() {
        const savedTheme = PreferencesSystem.getTheme();
        const themeRadio = document.getElementById('theme-' + savedTheme);
        if (themeRadio) {
            themeRadio.checked = true;
        }
    };

    window.selectTheme = function(theme) {
        const themeRadio = document.getElementById('theme-' + theme);
        if (themeRadio) {
            themeRadio.checked = true;
        }
    };

    window.saveThemeSettings = function() {
        const selectedTheme = document.querySelector('input[name="theme"]:checked');
        if (selectedTheme) {
            PreferencesSystem.setTheme(selectedTheme.value);

            // Apply theme to document
            document.body.className = selectedTheme.value === 'dark' ? 'dark-theme' : '';

            // Update the profile menu text
            const themeMenuText = document.querySelector('[onclick="openThemeSettings()"] .menu-text p');
            if (themeMenuText) {
                themeMenuText.textContent = selectedTheme.value === 'dark' ? 'Dark mode' : 'Light mode';
            }

            // Add theme change notification
            createNotification(
                'settings',
                'Theme Applied',
                `${selectedTheme.value === 'dark' ? 'Dark' : 'Light'} theme has been applied successfully.`,
                true
            );

            CustomDialog.alert('Theme applied successfully!', 'Theme Applied');
            closeModal('themeSettingsModal');
            console.log('Theme changed to:', selectedTheme.value);
        }
    };

    // Help Center Functions
    window.showHelpTopic = function(topic) {
        let helpContent = '';

        switch(topic) {
            case 'appointments':
                helpContent = 'Booking Appointments:\n\n• Tap on a doctor to view their profile\n• Select available time slot\n• Fill in appointment details\n• Confirm your booking\n• You will receive a confirmation notification\n\nManaging Appointments:\n• View your appointments in the Appointments tab\n• Cancel or reschedule up to 2 hours before\n• Get reminders 30 minutes before your appointment';
                break;
            case 'payments':
                helpContent = 'Payment Methods:\n\n• Credit/Debit Cards\n• Cash payments at clinic\n\nBilling Questions:\n• All prices are shown upfront\n• Consultation fees vary by doctor\n• Emergency services have additional charges\n• Payment is required at time of booking';
                break;
            case 'profile':
                helpContent = 'Managing Your Profile:\n\n• Update personal information in Edit Profile\n• Change password for security\n• Manage notification preferences\n• Control privacy settings\n• View and download your data\n\nVerification:\n• Verify your phone number for security\n• Add emergency contact information\n• Keep your medical history updated';
                break;
            case 'emergency':
                helpContent = 'Emergency Services:\n\n• Call 999 for immediate emergencies\n• Use ambulance booking for non-critical transport\n• Emergency services available 24/7\n• Provide accurate location information\n• Have your medical information ready\n\nAmbulance Booking:\n• Select pickup and destination\n• Choose ambulance type\n• Track ambulance location\n• Emergency contact will be notified';
                break;
        }

        CustomDialog.alert(helpContent, 'Help & FAQ');
    };

    window.openContactModal = function() {
        closeModal('helpCenterModal');
        setTimeout(() => {
            openModal('contactUsModal');
            loadContactInfo();
        }, 300);
    };

    window.loadContactInfo = async function() {
        console.log('📞 Loading contact info...');
        try {
            console.log('📞 Calling dbService.getContactInfo() with skipCache=true...');
            const contactInfo = await window.dbService.getContactInfo(null, true);
            console.log('📞 Contact info received:', contactInfo);
            console.log('📞 Contact info length:', contactInfo ? contactInfo.length : 0);
            
            // Load phone numbers
            const phonesList = document.getElementById('contact-phones-list');
            const phones = contactInfo.filter(c => c.type === 'phone' && c.is_active);
            console.log('📞 Phones found:', phones.length, phones);
            if (phonesList && phones.length > 0) {
                phonesList.innerHTML = phones.map(phone => 
                    `<p>${escapeHtml(phone.value)}${phone.label ? ' <small>(' + escapeHtml(phone.label) + ')</small>' : ''}</p>`
                ).join('');
                console.log('📞 Phones list updated');
            } else if (phonesList) {
                phonesList.innerHTML = '<p>No phone numbers available</p>';
                console.log('📞 No phones available');
            }
            
            // Load email addresses
            const emailsList = document.getElementById('contact-emails-list');
            const emails = contactInfo.filter(c => c.type === 'email' && c.is_active);
            console.log('📧 Emails found:', emails.length, emails);
            if (emailsList && emails.length > 0) {
                emailsList.innerHTML = emails.map(email => 
                    `<p>${escapeHtml(email.value)}${email.label ? ' <small>(' + escapeHtml(email.label) + ')</small>' : ''}</p>`
                ).join('');
                console.log('📧 Emails list updated');
            } else if (emailsList) {
                emailsList.innerHTML = '<p>No email addresses available</p>';
                console.log('📧 No emails available');
            }
            
            // Load office address
            const addressDisplay = document.getElementById('contact-address-display');
            const addresses = contactInfo.filter(c => c.type === 'address' && c.is_active);
            console.log('📍 Addresses found:', addresses.length, addresses);
            if (addressDisplay && addresses.length > 0) {
                const address = addresses[0];
                let addressData;
                try {
                    addressData = typeof address.value === 'string' ? JSON.parse(address.value) : address.value;
                    console.log('📍 Address data parsed:', addressData);
                } catch (e) {
                    console.error('📍 Error parsing address:', e);
                    addressData = { name: 'MediQuick Healthcare Center', line1: '', line2: '', country: '', hours: '' };
                }
                
                addressDisplay.innerHTML = `
                    <p>${escapeHtml(addressData.name || 'MediQuick Healthcare Center')}</p>
                    <p>${escapeHtml(addressData.line1 || '')}</p>
                    <p>${escapeHtml(addressData.line2 || '')}</p>
                    <p>${escapeHtml(addressData.country || '')}</p>
                    <span>${escapeHtml(addressData.hours || '')}</span>
                `;
                console.log('📍 Address display updated');
            } else if (addressDisplay) {
                addressDisplay.innerHTML = '<p>No office address available</p>';
                console.log('📍 No addresses available');
            }
            console.log('✅ Contact info loaded successfully');
        } catch (error) {
            console.error('❌ Error loading contact info:', error);
            console.error('❌ Error details:', error.message, error.stack);
            
            // Fallback to showing error message
            const phonesList = document.getElementById('contact-phones-list');
            const emailsList = document.getElementById('contact-emails-list');
            const addressDisplay = document.getElementById('contact-address-display');
            
            if (phonesList) phonesList.innerHTML = '<p>Unable to load phone numbers</p>';
            if (emailsList) emailsList.innerHTML = '<p>Unable to load email addresses</p>';
            if (addressDisplay) addressDisplay.innerHTML = '<p>Unable to load office address</p>';
        }
    };

    window.callSupport = async function() {
        // Try to get the first active phone number from database
        try {
            const contactInfo = await window.dbService.getContactInfo('phone');
            const phones = contactInfo.filter(c => c.is_active);
            const primaryPhone = phones.length > 0 ? phones[0].value : '+880 1750-913031';
            const phoneNumber = primaryPhone.replace(/[\s\-]/g, '');
            
            const shouldCall = await CustomDialog.confirm(`Call MediQuick Support at ${primaryPhone}?`, 'Call Support');
            if (shouldCall) {
                window.location.href = `tel:${phoneNumber}`;
            }
        } catch (error) {
            console.error('Error getting phone number:', error);
            // Fallback to default number
            const shouldCall = await CustomDialog.confirm('Call MediQuick Support at +880 1750-913031?', 'Call Support');
            if (shouldCall) {
                window.location.href = 'tel:+8801750913031';
            }
        }
    };

    // Contact Form Handler
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = {
                    name: document.getElementById('contactName').value,
                    email: document.getElementById('contactEmail').value,
                    subject: document.getElementById('contactSubject').value,
                    message: document.getElementById('contactMessage').value
                };

                // Validate form
                if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                    CustomDialog.alert('Please fill in all required fields.', 'Form Validation');
                    return;
                }

                try {
                    // Check if Supabase is initialized
                    if (typeof window.supabase === 'undefined' || typeof window.dbService === 'undefined') {
                        console.error('❌ Supabase not initialized yet');
                        CustomDialog.alert('The system is still loading. Please wait a moment and try again.', 'System Loading');
                        return;
                    }

                    // Get current user if logged in
                    const currentUser = AuthSystem.getUser();
                    const userId = currentUser ? (currentUser.supabaseId || currentUser.id) : null;

                    // Prepare message data for database
                    const messageData = {
                        user_id: userId,
                        name: formData.name,
                        email: formData.email,
                        subject: formData.subject,
                        message: formData.message,
                        status: 'new',
                        created_at: new Date().toISOString()
                    };

                    // Save to database
                    console.log('📤 Attempting to save contact message to database...');
                    const savedMessage = await window.dbService.addContactMessage(messageData);
                    console.log('✅ Contact message saved to database:', savedMessage);

                    CustomDialog.alert('Thank you for contacting us! We have received your message and will respond within 24 hours.', 'Message Sent Successfully');

                    // Clear form
                    contactForm.reset();
                    closeModal('contactUsModal');
                } catch (error) {
                    console.error('❌ Error saving contact message:', error);
                    console.error('Error details:', error.message, error.stack);
                    CustomDialog.alert('There was an error sending your message. Please try again or contact us directly.', 'Error');
                }
            });
        }

        // Help search functionality
        const helpSearchInput = document.getElementById('helpSearchInput');
        if (helpSearchInput) {
            helpSearchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const helpCategories = document.querySelectorAll('.help-category');

                helpCategories.forEach(category => {
                    const title = category.querySelector('h5').textContent.toLowerCase();
                    const description = category.querySelector('p').textContent.toLowerCase();

                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        category.style.display = 'flex';
                    } else {
                        category.style.display = searchTerm ? 'none' : 'flex';
                    }
                });
            });
        }
    });

    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        const savedTheme = PreferencesSystem.getTheme();
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Initialize profile data
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        }

        const savedLanguage = PreferencesSystem.getLanguage();
        const languageMenuText = document.querySelector('[onclick="openLanguageSettings()"] .menu-text p');
        if (languageMenuText && savedLanguage === 'bangla') {
            languageMenuText.textContent = 'বাংলা (Bangla)';
        }

        const themeMenuText = document.querySelector('[onclick="openThemeSettings()"] .menu-text p');
        if (themeMenuText) {
            themeMenuText.textContent = savedTheme === 'dark' ? 'Dark mode' : 'Light mode';
        }
    });

    // Terms & Conditions Functions
    window.acceptTerms = function() {
        const acceptanceDate = new Date().toISOString();
        InMemoryStorage.termsAccepted = {
            accepted: true,
            date: acceptanceDate,
            version: '1.0'
        };

        // Add terms acceptance notification
        createNotification(
            'system',
            'Terms Accepted',
            'Thank you for accepting our Terms & Conditions. You can review them anytime.',
            true
        );

        CustomDialog.alert('Thank you for accepting our Terms & Conditions. You can review them anytime in the profile settings.', 'Terms Accepted');
        closeModal('termsConditionsModal');
        console.log('Terms & Conditions accepted on:', acceptanceDate);
    };

    // Privacy Policy Functions
    window.acknowledgePrivacy = function() {
        const acknowledgementDate = new Date().toISOString();
        InMemoryStorage.privacyAcknowledged = {
            acknowledged: true,
            date: acknowledgementDate,
            version: '1.0'
        };

        // Add privacy policy acknowledgment notification
        createNotification(
            'system',
            'Privacy Policy Acknowledged',
            'Thank you for reviewing our Privacy Policy. We are committed to protecting your privacy and data security.',
            true
        );

        CustomDialog.alert('Thank you for reviewing our Privacy Policy. We are committed to protecting your privacy and data security.', 'Privacy Policy Reviewed');
        closeModal('privacyPolicyModal');
        console.log('Privacy Policy acknowledged on:', acknowledgementDate);
    };

    // Check if user has accepted terms and privacy on app load
    document.addEventListener('DOMContentLoaded', function() {
        const termsAccepted = InMemoryStorage.termsAccepted;
        const privacyAcknowledged = InMemoryStorage.privacyAcknowledged;

        // Optional: Show acceptance status in profile or handle first-time users
        if (!termsAccepted || !privacyAcknowledged) {
            console.log('User has not accepted all legal documents');
        }
    });

    // Profile Functions
    window.loadProfileData = async function() {
        // Get user data from AuthSystem
        const userData = AuthSystem.getUser();
        if (!userData) {
            console.log('No user data found');
            return;
        }

        // Load user data into edit profile form fields
        const form = document.getElementById('editProfileForm');
        if (!form) {
            console.error('Edit profile form not found');
            return;
        }

        // Fetch fresh data from Supabase to get latest district and upazila
        let freshUserData = userData;
        if (userData.supabaseId && typeof window.dbService !== 'undefined') {
            try {
                const dbUser = await window.dbService.getUserById(userData.supabaseId);
                if (dbUser) {
                    console.log('✅ Fetched fresh user data from Supabase:', {
                        district: dbUser.district,
                        upazila: dbUser.upazila
                    });
                    // Merge fresh data with session data
                    freshUserData = {
                        ...userData,
                        district: dbUser.district,
                        upazila: dbUser.upazila,
                        avatar: dbUser.avatar || userData.avatar,
                        mobile: dbUser.mobile || userData.mobile
                    };
                }
            } catch (error) {
                console.error('Error fetching fresh user data:', error);
            }
        }

        // Map the correct field names from user data to form fields
        if (freshUserData.firstName) {
            const field = form.querySelector('#firstName');
            if (field) field.value = freshUserData.firstName;
        }
        
        if (freshUserData.lastName) {
            const field = form.querySelector('#lastName');
            if (field) field.value = freshUserData.lastName;
        }
        
        if (freshUserData.email) {
            const field = form.querySelector('#email');
            if (field) field.value = freshUserData.email;
        }
        
        if (freshUserData.mobile) {
            const field = form.querySelector('#phone');
            if (field) field.value = freshUserData.mobile;
        }
        
        // Load district and upazila from fresh data
        if (freshUserData.district) {
            const field = form.querySelector('#district');
            if (field) {
                field.value = freshUserData.district;
                console.log('📍 Set district value:', freshUserData.district);
                // Trigger upazila options update
                if (typeof window.updateEditProfileUpazilaOptions === 'function') {
                    window.updateEditProfileUpazilaOptions(field);
                }
            }
        }
        
        // Load upazila after district options are populated
        if (freshUserData.upazila) {
            setTimeout(() => {
                const field = form.querySelector('#upazila');
                if (field) {
                    field.value = freshUserData.upazila;
                    console.log('📍 Set upazila value:', freshUserData.upazila);
                }
            }, 100);
        }
        
        // Load avatar if exists
        if (freshUserData.avatar) {
            updateModalAvatar(freshUserData.avatar);
        }

        console.log('Profile data loaded into edit form:', {
            firstName: freshUserData.firstName,
            lastName: freshUserData.lastName,
            email: freshUserData.email,
            mobile: freshUserData.mobile,
            district: freshUserData.district,
            upazila: freshUserData.upazila,
            profileComplete: freshUserData.profileComplete
        });
    };

    // Edit Profile Form Submission Handler
    window.handleEditProfile = async function(event) {
        event.preventDefault();
        console.log('Edit profile form submitted');
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Get current user data
        const currentUser = AuthSystem.getUser();
        if (!currentUser) {
            console.error('No current user found');
            alert('Unable to save changes. Please sign in again.');
            return;
        }
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = formData.get(field)?.trim();
            if (!value) {
                console.error(`Required field ${field} is empty`);
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate email format
        const email = formData.get('email');
        if (!ValidationUtils.isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Handle avatar update if changed
        const modalAvatarImg = document.getElementById('modal-avatar-img');
        let newAvatar = currentUser.avatar; // Keep existing avatar by default
        
        if (modalAvatarImg && modalAvatarImg.src && modalAvatarImg.style.display !== 'none') {
            newAvatar = modalAvatarImg.src; // Update to new avatar if uploaded
        }
        
        const profileUpdatedAt = new Date().toISOString();
        
        // Update user data with form values, preserving existing fields
        const updatedUser = {
            ...currentUser, // Preserve all existing user data
            firstName: formData.get('firstName')?.trim(),
            lastName: formData.get('lastName')?.trim(),
            email: email.trim(),
            mobile: formData.get('phone')?.trim(),
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            avatar: newAvatar, // Update avatar
            profileUpdatedAt: profileUpdatedAt
        };
        
        // Save updated user data using AuthSystem (this will update UI automatically)
        AuthSystem.setUser(updatedUser);
        
        // Save to Supabase database if dbService is available
        // Note: User ID is stored as 'supabaseId' in session, not 'id'
        const userId = currentUser.supabaseId || currentUser.id;
        
        if (typeof window.dbService !== 'undefined' && userId) {
            try {
                console.log('📝 Saving profile to Supabase for user ID:', userId);
                
                // Prepare database update object - only include fields that exist in users table
                const dbUpdates = {
                    name: `${updatedUser.firstName} ${updatedUser.lastName}`,
                    email: updatedUser.email,
                    mobile: updatedUser.mobile,
                    district: updatedUser.district || null,
                    upazila: updatedUser.upazila || null,
                    avatar: newAvatar || null,
                    updated_at: profileUpdatedAt
                };
                
                console.log('📤 Sending updates to database:', dbUpdates);
                
                const savedUser = await window.dbService.updateUser(userId, dbUpdates);
                console.log('✅ Profile saved to database successfully:', {
                    name: dbUpdates.name,
                    email: dbUpdates.email,
                    mobile: dbUpdates.mobile,
                    district: dbUpdates.district,
                    upazila: dbUpdates.upazila
                });
                
                // Refresh AuthSystem with updated data from Supabase to ensure sync
                if (savedUser) {
                    const refreshedUser = {
                        ...updatedUser,
                        id: savedUser.id,
                        name: savedUser.name,
                        email: savedUser.email,
                        mobile: savedUser.mobile,
                        district: savedUser.district,
                        upazila: savedUser.upazila,
                        avatar: savedUser.avatar,
                        points: savedUser.points,
                        profile_complete: savedUser.profile_complete,
                        // Keep firstName/lastName from local session for UI display
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName
                    };
                    AuthSystem.setUser(refreshedUser);
                    console.log('✅ AuthSystem refreshed with Supabase data');
                }
            } catch (error) {
                console.error('❌ Failed to save profile to database:', error);
                alert('Profile updated locally but failed to save to database. Please try again.');
                return;
            }
        }
        
        // Close modal
        closeModal('editProfileModal');
        
        // Show success message
        console.log('Profile updated successfully via AuthSystem');
        
        // Create success notification
        if (typeof addSystemNotification === 'function') {
            addSystemNotification(
                'Profile Updated',
                'Your profile information has been successfully updated.'
            );
        } else if (typeof createNotification === 'function') {
            createNotification(
                'profile',
                'Profile Updated',
                'Your profile information has been successfully updated.',
                true
            );
        }
        
        console.log('Profile updated through AuthSystem:', {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            avatar: newAvatar ? 'Updated' : 'Unchanged'
        });
    };
    
    // Robust edit profile form handler attachment
    function attachEditProfileHandler() {
        const editProfileForm = document.getElementById('editProfileForm');
        if (editProfileForm) {
            // Remove any existing listeners to avoid duplicates
            editProfileForm.removeEventListener('submit', handleEditProfile);
            
            // Add the dedicated edit profile handler
            editProfileForm.addEventListener('submit', handleEditProfile);
            
            // Mark the form as having the dedicated handler to prevent conflicts
            editProfileForm.setAttribute('data-has-dedicated-handler', 'true');
            
            console.log('Edit profile form handler attached successfully to form:', editProfileForm.id);
            return true;
        } else {
            console.log('Edit profile form not found, will retry...');
            return false;
        }
    }
    
    // Enhanced openEditProfile function with proper handler attachment
    window.openEditProfile = async function() {
        console.log('Edit Profile clicked - loading profile data and opening modal');
        
        // Load current profile data into form
        await loadProfileData();
        
        // Open the modal
        openModal('editProfileModal');
        
        // Ensure the form handler is attached after modal opens
        setTimeout(() => {
            const attached = attachEditProfileHandler();
            if (!attached) {
                console.error('Failed to attach edit profile handler after modal opened');
            }
        }, 150);
    };
    
    // Try to attach handler on DOM load as well
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded - attempting to attach edit profile handler');
        attachEditProfileHandler();
    });

    window.changeProfilePhoto = function() {
        selectModalPhoto();
    };

    window.selectModalPhoto = function() {
        const fileInput = document.getElementById('modal-photo-upload');
        if (!fileInput) {
            // Create file input if it doesn't exist
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            input.id = 'modal-photo-upload';
            input.onchange = handleModalPhotoUpload;
            document.body.appendChild(input);
            input.click();
        } else {
            fileInput.click();
        }
    };

    window.handleModalPhotoUpload = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                updateModalAvatar(imageData);
                console.log('Modal photo selected');
            };
            reader.readAsDataURL(file);
        }
    };

    function updateModalAvatar(imageSrc) {
        const modalAvatarIcon = document.getElementById('modal-avatar-icon');
        const modalAvatarImg = document.getElementById('modal-avatar-img');
        
        if (modalAvatarIcon) {
            modalAvatarIcon.style.display = 'none';
        }
        
        if (!modalAvatarImg) {
            const photoContainer = document.getElementById('modal-profile-photo') || document.querySelector('.profile-photo');
            if (photoContainer) {
                const newImg = document.createElement('img');
                newImg.id = 'modal-avatar-img';
                newImg.src = imageSrc;
                newImg.style.cssText = 'width: 80px; height: 80px; border-radius: 50%; object-fit: cover; display: block;';
                photoContainer.appendChild(newImg);
            }
        } else {
            modalAvatarImg.src = imageSrc;
            modalAvatarImg.style.display = 'block';
        }
    }

    // Handle profile form submission - Completely exclude edit profile form
    function attachProfileFormListeners() {
        const profileForms = document.querySelectorAll('.profile-form:not(#editProfileForm)');
        console.log('Found profile forms (excluding editProfileForm):', profileForms.length);
        profileForms.forEach(function(profileForm, index) {
            console.log('Attaching legacy handler to form', index + 1, 'ID:', profileForm.id);
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Legacy profile form submission prevented for:', this.id);

                const formData = new FormData(this);
                const profileData = {};

                // Convert form data to object
                for (let [key, value] of formData.entries()) {
                    profileData[key] = value;
                }

                // For non-edit profile forms, still use the in-memory approach
                // This maintains backward compatibility for profile creation forms
                InMemoryStorage.userProfile = profileData;

                // Update displayed name throughout the app
                updateDisplayedUserName(profileData.firstName, profileData.lastName);
                
                // Update profile contact information in profile card
                updateProfileContactInfo(profileData);
                
                // Save avatar if uploaded from modal
                const modalAvatarImg = document.getElementById('modal-avatar-img');
                if (modalAvatarImg && modalAvatarImg.src && modalAvatarImg.style.display !== 'none') {
                    profileData.avatarImage = modalAvatarImg.src;
                    InMemoryStorage.userProfile = profileData;
                    updateProfileAvatar(modalAvatarImg.src);
                }

                // Add profile update notification
                createNotification(
                    'profile',
                    'Profile Updated',
                    'Your profile information has been updated successfully.',
                    true
                );

                CustomDialog.alert('Profile updated successfully! Your changes have been saved.', 'Profile Updated');
                closeModal('editProfileModal');
                console.log('Profile saved via legacy handler:', profileData);
            });
        });
    }

    // Call the function immediately and also on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachProfileFormListeners);
    } else {
        attachProfileFormListeners();
    }

    // Function to update displayed user name throughout the app
    function updateDisplayedUserName(firstName, lastName) {
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'John Doe';
        
        console.log('Updating name to:', fullName);
        console.log('First name:', firstName, 'Last name:', lastName);
        
        // Update profile card name
        const profileCardName = document.querySelector('.profile-details h2');
        console.log('Profile card element found:', profileCardName);
        if (profileCardName) {
            profileCardName.textContent = fullName;
            console.log('Updated profile card name');
        }
        
        // Update all profile sections in headers (home, top-now, specialist screens)
        const profileSections = document.querySelectorAll('.profile-section span');
        console.log('Profile sections found:', profileSections.length);
        profileSections.forEach((span, index) => {
            span.textContent = fullName;
            console.log(`Updated profile section ${index + 1}`);
        });
        
        console.log('User name updated to:', fullName);
    }

    // Function to update profile contact information
    function updateProfileContactInfo(profileData) {
        const profileDetailsElement = document.querySelector('.profile-details');
        if (profileDetailsElement) {
            const pElements = profileDetailsElement.querySelectorAll('p');
            
            // Update phone number (first p element)
            if (pElements[0] && profileData.phone) {
                pElements[0].textContent = profileData.phone;
                console.log('Updated profile phone:', profileData.phone);
            }
            
            // Update email (second p element)
            if (pElements[1] && profileData.email) {
                pElements[1].textContent = profileData.email;
                console.log('Updated profile email:', profileData.email);
            }
        }
    }

    // Load profile data on app initialization
    window.initializeProfile = function() {
        const profileData = InMemoryStorage.userProfile || {};
        
        if (profileData.firstName || profileData.lastName) {
            updateDisplayedUserName(profileData.firstName, profileData.lastName);
        }
        
        if (profileData.phone || profileData.email) {
            updateProfileContactInfo(profileData);
        }
        
        if (profileData.avatarImage) {
            updateProfileAvatar(profileData.avatarImage);
        }
    };

    // Medical History Functions
    let medicalData = {
        conditions: InMemoryStorage.medicalData.conditions,
        medications: InMemoryStorage.medicalData.medications,
        allergies: InMemoryStorage.medicalData.allergies,
        vitals: InMemoryStorage.medicalData.vitals
    };

    window.loadMedicalHistory = function() {
        // Update counters in overview
        document.getElementById('activeMedicationsCount').textContent =
            medicalData.medications.length + (medicalData.medications.length === 1 ? ' medication' : ' medications');
        document.getElementById('knownAllergiesCount').textContent =
            medicalData.allergies.length + (medicalData.allergies.length === 1 ? ' allergy' : ' allergies') + ' recorded';

        // Load vital signs
        loadVitalSigns();

        // Load lists
        loadConditionsList();
        loadMedicationsList();
        loadAllergiesList();
        loadAppointmentHistory();

        console.log('Medical history loaded');
    };

    window.switchMedicalTab = function(tabName) {
        // Hide all tabs
        document.querySelectorAll('.medical-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById('medical' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');

        // Add active class to clicked button
        event.target.classList.add('active');

        console.log('Medical tab switched to:', tabName);
    };

    window.loadVitalSigns = function() {
        if (medicalData.vitals.bloodPressure) {
            document.querySelector('.vital-item:nth-child(1) .vital-value').textContent = medicalData.vitals.bloodPressure + ' mmHg';
        }
        if (medicalData.vitals.heartRate) {
            document.querySelector('.vital-item:nth-child(2) .vital-value').textContent = medicalData.vitals.heartRate + ' bpm';
        }
        if (medicalData.vitals.temperature) {
            document.querySelector('.vital-item:nth-child(3) .vital-value').textContent = medicalData.vitals.temperature + '°F';
        }
        if (medicalData.vitals.weight) {
            document.querySelector('.vital-item:nth-child(4) .vital-value').textContent = medicalData.vitals.weight + ' kg';
        }
    };

    window.addVitalSigns = async function() {
        const bloodPressure = await CustomDialog.prompt('Enter Blood Pressure (e.g., 120/80):', 'Blood Pressure');
        if (!bloodPressure) return;
        const heartRate = await CustomDialog.prompt('Enter Heart Rate (bpm):', 'Heart Rate');
        if (!heartRate) return;
        const temperature = await CustomDialog.prompt('Enter Temperature (°F):', 'Temperature');
        if (!temperature) return;
        const weight = await CustomDialog.prompt('Enter Weight (kg):', 'Weight');

        if (bloodPressure || heartRate || temperature || weight) {
            if (bloodPressure) medicalData.vitals.bloodPressure = bloodPressure;
            if (heartRate) medicalData.vitals.heartRate = heartRate;
            if (temperature) medicalData.vitals.temperature = temperature;
            if (weight) medicalData.vitals.weight = weight;

            InMemoryStorage.medicalData.vitals = medicalData.vitals;
            loadVitalSigns();
            CustomDialog.alert('Vital signs updated successfully!', 'Vital Signs Saved');
            console.log('Vital signs added:', medicalData.vitals);
        }
    };

    window.loadConditionsList = function() {
        const conditionsList = document.getElementById('conditionsList');

        if (medicalData.conditions.length === 0) {
            conditionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-notes-medical"></i>
                    <p>No medical conditions recorded</p>
                    <span>Add your medical conditions to help doctors provide better care</span>
                </div>
            `;
        } else {
            conditionsList.innerHTML = medicalData.conditions.map(condition => `
                <div class="medical-item">
                    <div class="item-info">
                        <h5>${condition.name}</h5>
                        <p>Diagnosed: ${condition.diagnosed}</p>
                        <span class="severity ${condition.severity}">${condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}</span>
                    </div>
                    <button class="item-remove" onclick="removeCondition('${condition.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    };

    window.addMedicalCondition = async function() {
        const name = await CustomDialog.prompt('Enter condition name:', 'Condition Name');
        if (!name) return;
        const diagnosed = await CustomDialog.prompt('Enter diagnosis date (YYYY-MM-DD):', 'Diagnosis Date');
        if (!diagnosed) return;
        const severity = await CustomDialog.prompt('Enter severity (mild/moderate/severe):', 'Severity') || 'mild';

        if (name && diagnosed) {
            const condition = {
                id: Date.now().toString(),
                name: name,
                diagnosed: diagnosed,
                severity: severity.toLowerCase()
            };

            medicalData.conditions.push(condition);
            InMemoryStorage.medicalData.conditions = medicalData.conditions;
            loadConditionsList();
            CustomDialog.alert('Medical condition added successfully!', 'Condition Added');
            console.log('Medical condition added:', condition);
        }
    };

    window.removeCondition = async function(id) {
        const shouldRemove = await CustomDialog.confirm('Are you sure you want to remove this condition?', 'Remove Condition');
        if (shouldRemove) {
            medicalData.conditions = medicalData.conditions.filter(condition => condition.id !== id);
            InMemoryStorage.medicalData.conditions = medicalData.conditions;
            loadConditionsList();
            console.log('Medical condition removed:', id);
        }
    };

    window.loadMedicationsList = function() {
        const medicationsList = document.getElementById('medicationsList');

        if (medicalData.medications.length === 0) {
            medicationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pills"></i>
                    <p>No medications recorded</p>
                    <span>Keep track of your medications for better healthcare management</span>
                </div>
            `;
        } else {
            medicationsList.innerHTML = medicalData.medications.map(medication => `
                <div class="medical-item">
                    <div class="item-info">
                        <h5>${medication.name}</h5>
                        <p>Dosage: ${medication.dosage}</p>
                        <p>Frequency: ${medication.frequency}</p>
                        <span class="status ${medication.active ? 'active' : 'inactive'}">${medication.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <button class="item-remove" onclick="removeMedication('${medication.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    };

    window.addMedication = async function() {
        const name = await CustomDialog.prompt('Enter medication name:', 'Medication Name');
        if (!name) return;
        const dosage = await CustomDialog.prompt('Enter dosage (e.g., 10mg):', 'Dosage');
        if (!dosage) return;
        const frequency = await CustomDialog.prompt('Enter frequency (e.g., twice daily):', 'Frequency');

        if (name && dosage && frequency) {
            const medication = {
                id: Date.now().toString(),
                name: name,
                dosage: dosage,
                frequency: frequency,
                active: true
            };

            medicalData.medications.push(medication);
            InMemoryStorage.medicalData.medications = medicalData.medications;
            loadMedicationsList();
            loadMedicalHistory(); // Refresh overview
            CustomDialog.alert('Medication added successfully!', 'Medication Added');
            console.log('Medication added:', medication);
        }
    };

    window.removeMedication = async function(id) {
        const shouldRemove = await CustomDialog.confirm('Are you sure you want to remove this medication?', 'Remove Medication');
        if (shouldRemove) {
            medicalData.medications = medicalData.medications.filter(medication => medication.id !== id);
            InMemoryStorage.medicalData.medications = medicalData.medications;
            loadMedicationsList();
            loadMedicalHistory(); // Refresh overview
            console.log('Medication removed:', id);
        }
    };

    window.loadAllergiesList = function() {
        const allergiesList = document.getElementById('allergiesList');

        if (medicalData.allergies.length === 0) {
            allergiesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No allergies recorded</p>
                    <span>Record your allergies to ensure safe medical treatment</span>
                </div>
            `;
        } else {
            allergiesList.innerHTML = medicalData.allergies.map(allergy => `
                <div class="medical-item">
                    <div class="item-info">
                        <h5>${allergy.name}</h5>
                        <p>Type: ${allergy.type}</p>
                        <p>Reaction: ${allergy.reaction}</p>
                        <span class="severity ${allergy.severity}">${allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}</span>
                    </div>
                    <button class="item-remove" onclick="removeAllergy('${allergy.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    };

    window.addAllergy = async function() {
        const name = await CustomDialog.prompt('Enter allergy name (e.g., Penicillin, Peanuts):', 'Allergy Name');
        if (!name) return;
        const type = await CustomDialog.prompt('Enter allergy type (medication/food/environmental):', 'Allergy Type');
        if (!type) return;
        const reaction = await CustomDialog.prompt('Enter reaction (e.g., rash, swelling, difficulty breathing):', 'Reaction');
        if (!reaction) return;
        const severity = await CustomDialog.prompt('Enter severity (mild/moderate/severe):', 'Severity') || 'mild';

        if (name && type && reaction) {
            const allergy = {
                id: Date.now().toString(),
                name: name,
                type: type,
                reaction: reaction,
                severity: severity.toLowerCase()
            };

            medicalData.allergies.push(allergy);
            InMemoryStorage.medicalData.allergies = medicalData.allergies;
            loadAllergiesList();
            loadMedicalHistory(); // Refresh overview
            CustomDialog.alert('Allergy added successfully!', 'Allergy Added');
            console.log('Allergy added:', allergy);
        }
    };

    window.removeAllergy = async function(id) {
        const shouldRemove = await CustomDialog.confirm('Are you sure you want to remove this allergy?', 'Remove Allergy');
        if (shouldRemove) {
            medicalData.allergies = medicalData.allergies.filter(allergy => allergy.id !== id);
            InMemoryStorage.medicalData.allergies = medicalData.allergies;
            loadAllergiesList();
            loadMedicalHistory(); // Refresh overview
            console.log('Allergy removed:', id);
        }
    };

    window.loadAppointmentHistory = function() {
        const appointmentHistory = document.getElementById('appointmentHistory');
        const completedAppointments = InMemoryStorage.completedAppointments || [];

        if (completedAppointments.length === 0) {
            appointmentHistory.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-check"></i>
                    <p>No appointment history</p>
                    <span>Your completed appointments will appear here</span>
                </div>
            `;
        } else {
            appointmentHistory.innerHTML = completedAppointments.slice(-5).reverse().map(appointment => `
                <div class="medical-item">
                    <div class="item-info">
                        <h5>${appointment.doctorName}</h5>
                        <p>Date: ${appointment.date}</p>
                        <p>Type: ${appointment.type || 'General Consultation'}</p>
                        <span class="status completed">Completed</span>
                    </div>
                </div>
            `).join('');
        }
    };

    window.viewAllAppointments = function() {
        CustomDialog.alert('View all appointments feature will redirect to the appointments section.', 'Feature Information');
        closeModal('medicalHistoryModal');
        switchScreen('appointment');
        console.log('Redirecting to appointments view');
    };

    // Initialize sponsor screen slider if on sponsor screen
    if (document.getElementById('sponsor-screen')) {
        initializeSponsorSlider();
    }

    // Note: Doctor list population is now handled by Supabase integration
    // The applySortingToAllDoctorLists function will be called after Supabase data is loaded
});

// Load Sponsor Content from Supabase
async function loadSponsorContentFromDatabase() {
    try {
        console.log('🔄 Loading sponsor content from Supabase...');
        
        const { data, error } = await supabase
            .from('sponsor_content')
            .select('*')
            .eq('status', 'active')
            .order('id', { ascending: false })
            .limit(1)
            .maybeSingle();
        
        if (error) {
            console.error('Error loading sponsor content:', error);
            return;
        }
        
        if (data) {
            console.log('✅ Sponsor content loaded from database:', data);
            
            // Helper function to safely update element
            const safeUpdate = (elementId, value, defaultValue = '') => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = value || defaultValue;
                } else {
                    console.warn(`Element not found: ${elementId}`);
                }
            };
            
            // Update hero section
            safeUpdate('sponsor-company-name', data.company_name, 'HealthCare Plus');
            safeUpdate('sponsor-company-tagline', data.company_tagline, 'Your Trusted Healthcare Partner');
            
            // Update about section
            safeUpdate('sponsor-about-title', data.about_title, 'About HealthCare Plus');
            
            // Update info cards
            safeUpdate('sponsor-heritage-title', data.heritage_title, 'Our Heritage');
            safeUpdate('sponsor-heritage-description', data.heritage_description, '');
            
            safeUpdate('sponsor-research-title', data.research_title, 'Research & Innovation');
            safeUpdate('sponsor-research-description', data.research_description, '');
            
            safeUpdate('sponsor-quality-title', data.quality_title, 'Quality Assurance');
            safeUpdate('sponsor-quality-description', data.quality_description, '');
            
            safeUpdate('sponsor-global-title', data.global_title, 'Global Reach');
            safeUpdate('sponsor-global-description', data.global_description, '');
            
            // Update stats
            safeUpdate('sponsor-stat1-number', data.stat1_number, '500+');
            safeUpdate('sponsor-stat1-label', data.stat1_label, 'Medicine Products');
            
            safeUpdate('sponsor-stat2-number', data.stat2_number, '10,000+');
            safeUpdate('sponsor-stat2-label', data.stat2_label, 'Healthcare Partners');
            
            safeUpdate('sponsor-stat3-number', data.stat3_number, '50M+');
            safeUpdate('sponsor-stat3-label', data.stat3_label, 'Patients Served');
            
            safeUpdate('sponsor-stat4-number', data.stat4_number, '38');
            safeUpdate('sponsor-stat4-label', data.stat4_label, 'Years Experience');
            
            // Update partnership section
            safeUpdate('sponsor-partnership-title', data.partnership_title, 'Our Partnership with MediQuick');
            safeUpdate('sponsor-partnership-description', data.partnership_description, '');
            
            console.log('✅ Sponsor screen updated with database content');
        } else {
            console.log('ℹ️ No sponsor content found in database, using default values');
        }
    } catch (error) {
        console.error('Error in loadSponsorContentFromDatabase:', error);
    }
}

// Sponsor Screen Navigation Function
function navigateToSponsor() {
    console.log('Sponsor banner clicked');
    
    // Use the proper navigation function to maintain history
    switchScreen('sponsor');
    
    // Load sponsor content from database
    loadSponsorContentFromDatabase();
    
    // Initialize slider after screen is shown
    setTimeout(() => {
        initializeSponsorSlider();
    }, 100);
}

// Make functions globally accessible
window.navigateToSponsor = navigateToSponsor;
window.loadSponsorContentFromDatabase = loadSponsorContentFromDatabase;

// Function to navigate back to home from sponsor screen
function navigateToHome() {
    console.log('Navigating back to home from sponsor screen');
    switchScreen('home');
    
    // Ensure home nav item is active
    const homeNavItem = document.querySelector('.nav-item[data-screen="home"]');
    if (homeNavItem) {
        homeNavItem.classList.add('active');
    }
}

// Make navigateToHome globally accessible
window.navigateToHome = navigateToHome;

// Sponsor Slider Functionality
function initializeSponsorSlider() {
    const slides = document.querySelectorAll('.sponsor-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto advance every 4 seconds
    const slideInterval = setInterval(nextSlide, 4000);
    
    // Clean up interval when leaving the screen
    const sponsorScreen = document.getElementById('sponsor-screen');
    if (sponsorScreen) {
        sponsorScreen.addEventListener('hidden', () => {
            clearInterval(slideInterval);
        });
    }
    
    // Initialize first slide
    showSlide(0);
    
    console.log('Sponsor slider initialized with', slides.length, 'slides');
}

// Hospital Booking Screen Functions
function navigateToHospitalBooking(hospitalId, hospitalName) {
    console.log('Navigating to hospital booking screen', hospitalId, hospitalName);
    
    // Get hospital data from database
    const hospitals = window.hospitalsDatabase || [];
    let selectedHospital = null;
    
    if (hospitalId) {
        // Normalize hospitalId to number for comparison (IDs from HTML attributes are strings)
        const normalizedId = typeof hospitalId === 'string' ? parseInt(hospitalId) : hospitalId;
        
        // Check for invalid ID (NaN or null)
        if (isNaN(normalizedId) || normalizedId === null) {
            console.error('Invalid hospital ID provided:', hospitalId);
            CustomDialog.alert('Invalid hospital selection. Please try again.', 'Error');
            return;
        }
        
        // Find hospital by ID
        selectedHospital = hospitals.find(h => h.id === normalizedId);
        
        if (!selectedHospital) {
            console.error(`Hospital with ID ${normalizedId} not found in database`);
            CustomDialog.alert('Selected hospital not found. Please try again.', 'Error');
            return;
        }
    } else {
        // Use the currently displayed hospital from profile details
        const profileScreen = document.getElementById('hospital-profile-details-screen');
        if (profileScreen && profileScreen.dataset.hospitalId) {
            const profileHospitalId = parseInt(profileScreen.dataset.hospitalId);
            selectedHospital = hospitals.find(h => h.id === profileHospitalId);
            
            if (!selectedHospital) {
                console.error(`Hospital with ID ${profileHospitalId} not found in profile screen`);
                CustomDialog.alert('Hospital data not available. Please try again.', 'Error');
                return;
            }
        } else {
            console.error('No hospital ID provided and no profile screen data available');
            CustomDialog.alert('Please select a hospital first.', 'Error');
            return;
        }
    }
    
    // Store the selected hospital data globally
    window.currentSelectedHospital = selectedHospital;
    
    console.log('Selected hospital for booking:', selectedHospital);
    
    switchScreen('hospital-booking');
    setTimeout(() => {
        initializeHospitalBookingForm();
    }, 100);
}

function initializeHospitalBookingForm() {
    console.log('Hospital booking form initialized');
    
    // Update hospital name in the banner
    const hospitalBanner = document.querySelector('#hospital-booking-screen .hospital-booking-hero-banner p');
    if (hospitalBanner && window.currentSelectedHospital) {
        hospitalBanner.textContent = window.currentSelectedHospital.name;
    }
    
    // Populate room options from Supabase data
    populateHospitalBookingRooms();
    
    // Add event listeners for form validation
    const requiredFields = ['patient-name', 'patient-age', 'patient-gender', 'contact-number'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateNextButtonState);
            field.addEventListener('change', updateNextButtonState);
        }
    });
    
    updateNextButtonState();
}

function populateHospitalBookingRooms() {
    const roomSelectionList = document.querySelector('.room-selection-list');
    if (!roomSelectionList) {
        console.error('Room selection list not found');
        return;
    }
    
    // Use the selected hospital or fallback to first hospital
    const hospital = window.currentSelectedHospital || (window.hospitalsDatabase && window.hospitalsDatabase[0]);
    
    if (!hospital) {
        console.warn('No hospital data available');
        return;
    }
    
    if (!hospital.roomPricing) {
        console.warn('No room pricing data available');
        return;
    }
    
    // Map of room type keys to display names and values
    const roomTypeMapping = {
        'general_ward': { displayName: 'General Ward', value: 'general-ward' },
        'ac_cabin': { displayName: 'Cabin (AC)', value: 'cabin-ac' },
        'non_ac_cabin': { displayName: 'Cabin (Non-AC)', value: 'cabin-non-ac' },
        'icu': { displayName: 'ICU', value: 'icu' },
        'ccu': { displayName: 'CCU', value: 'ccu' }
    };
    
    // Clear existing content
    roomSelectionList.innerHTML = '';
    
    // Generate room options from Supabase data
    Object.entries(hospital.roomPricing).forEach(([roomType, roomData]) => {
        const mapping = roomTypeMapping[roomType];
        if (!mapping) return;
        
        const originalPrice = roomData.originalPrice || 0;
        const discountedPrice = roomData.discountedPrice || originalPrice;
        const savings = roomData.savings || 0;
        const beds = roomData.beds || 0;
        
        const availabilityClass = beds > 0 ? 'available' : 'unavailable';
        const availabilityText = beds > 0 
            ? `${beds} Available` 
            : 'Not Available';
        
        const roomOption = document.createElement('label');
        roomOption.className = 'room-option';
        roomOption.innerHTML = `
            <input type="radio" name="roomType" value="${mapping.value}" data-price="${discountedPrice}" data-original-price="${originalPrice}">
            <div class="room-card">
                <div class="room-info">
                    <div class="room-name">${mapping.displayName}</div>
                    <div class="room-availability ${availabilityClass}">${availabilityText}</div>
                </div>
                <div class="room-pricing">
                    <div class="current-price">৳${discountedPrice}</div>
                    ${savings > 0 ? `<div class="original-price">৳${originalPrice}</div>` : ''}
                    ${savings > 0 ? `<div class="savings">Save ৳${savings}</div>` : ''}
                </div>
            </div>
        `;
        roomSelectionList.appendChild(roomOption);
    });
    
    // Add event listeners for room selection after populating
    const roomOptions = document.querySelectorAll('input[name="roomType"]');
    roomOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                console.log('Room selected:', this.value);
                updateNextButtonState();
            }
        });
    });
    
    console.log('✅ Hospital booking rooms populated from Supabase data');
}

function updateNextButtonState() {
    const nextBtn = document.querySelector('.booking-next-btn');
    if (!nextBtn) {
        return;
    }
    
    // Always keep button enabled and ready
    nextBtn.disabled = false;
    nextBtn.textContent = 'Next';
    nextBtn.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
    nextBtn.style.color = '#FFFFFF';
    nextBtn.style.cursor = 'pointer';
}

function proceedHospitalBooking() {
    const form = document.getElementById('hospital-booking-form');
    const formData = new FormData(form);
    const selectedRoom = document.querySelector('input[name="roomType"]:checked');
    
    // Validate required fields
    const requiredFields = [];
    
    const patientName = formData.get('patientName') ? formData.get('patientName').trim() : '';
    const patientAge = formData.get('patientAge');
    const patientGender = formData.get('patientGender');
    const contactNumber = formData.get('contactNumber') ? formData.get('contactNumber').trim() : '';
    const emergencyContact = formData.get('emergencyContact') ? formData.get('emergencyContact').trim() : '';
    
    // Check for missing required fields
    if (!patientName) {
        requiredFields.push('Patient Name');
    }
    
    if (!patientAge) {
        requiredFields.push('Patient Age');
    }
    
    if (!patientGender) {
        requiredFields.push('Patient Gender');
    }
    
    if (!contactNumber) {
        requiredFields.push('Contact Number');
    }
    
    if (!selectedRoom) {
        requiredFields.push('Room Type');
    }
    
    // Show validation message if any required fields are missing
    if (requiredFields.length > 0) {
        CustomDialog.alert(`Please fill in all required fields:\n\n• ${requiredFields.join('\n• ')}`, 'Required Fields Missing');
        return;
    }
    
    // Validate patient name (minimum 2 characters)
    if (patientName.length < 2) {
        CustomDialog.alert('Patient name must be at least 2 characters long.', 'Invalid Patient Name');
        return;
    }
    
    // Validate patient age (should be between 1 and 120)
    const age = parseInt(patientAge);
    if (isNaN(age) || age < 1 || age > 120) {
        CustomDialog.alert('Please enter a valid age between 1 and 120.', 'Invalid Age');
        return;
    }
    
    // Validate contact number (should be 11 digits Bangladeshi format)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(contactNumber)) {
        CustomDialog.alert('Please enter a valid Bangladeshi mobile number (01XXXXXXXXX).', 'Invalid Contact Number');
        return;
    }
    
    // Validate emergency contact if provided
    if (emergencyContact && !phoneRegex.test(emergencyContact.replace(/^\+880/, '0'))) {
        CustomDialog.alert('Please enter a valid emergency contact number.', 'Invalid Emergency Contact');
        return;
    }
    
    // Get the selected hospital data
    const selectedHospital = window.currentSelectedHospital;
    const hospitalName = selectedHospital ? selectedHospital.name : 'Hospital';
    const hospitalId = selectedHospital ? selectedHospital.id : null;
    
    // Store booking data for the next screen
    window.currentBookingData = {
        patientName: patientName,
        patientAge: patientAge,
        patientGender: patientGender,
        contactNumber: contactNumber,
        emergencyContact: formData.get('emergencyContact') || '',
        roomType: selectedRoom.value,
        roomPrice: selectedRoom.getAttribute('data-price'),
        originalPrice: selectedRoom.getAttribute('data-original-price'),
        roomName: selectedRoom.closest('.room-option').querySelector('.room-name').textContent,
        hospital: hospitalName,
        hospitalId: hospitalId,
        hospitalData: selectedHospital,
        bookingDate: new Date().toISOString()
    };
    
    console.log('Moving to hospital booking details with data:', window.currentBookingData);
    
    // Navigate to hospital booking details screen
    switchScreen('hospital-booking-details');
    setTimeout(() => {
        initializeHospitalBookingDetailsScreen();
    }, 100);
}

// Function to navigate back to private hospital screen specifically
function goBackToPrivateHospital() {
    console.log('Going back to private hospital screen');
    switchScreen('private-hospital');
}

// Hospital Booking Details Screen Functions
function initializeHospitalBookingDetailsScreen() {
    console.log('Hospital booking details screen initialized');
    
    // Update hospital name in the banner
    const hospitalBanner = document.querySelector('#hospital-booking-details-screen .hospital-booking-hero-banner p');
    if (hospitalBanner && window.currentBookingData && window.currentBookingData.hospital) {
        hospitalBanner.textContent = window.currentBookingData.hospital;
    }
    
    // Set today's date as default (minimum date)
    const today = new Date();
    const dateInput = document.getElementById('checkin-date');
    if (dateInput) {
        const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format for date input
        dateInput.value = formattedDate;
        dateInput.min = formattedDate; // Set minimum date to today
    }
    
    // Initialize time input
    const timeInput = document.getElementById('checkin-time');
    if (timeInput) {
        timeInput.value = '10:00'; // 24-hour format for time input
    }
    
    // Initialize duration dropdown change listener
    const durationSelect = document.getElementById('expected-duration');
    if (durationSelect) {
        durationSelect.addEventListener('change', updateBookingSummary);
    }
    
    // Update booking summary with stored data
    updateBookingSummary();
}

function updateBookingSummary() {
    if (!window.currentBookingData) {
        return;
    }
    
    const summaryContent = document.getElementById('booking-summary-content');
    const summaryEmpty = document.querySelector('.summary-empty');
    const durationSelect = document.getElementById('expected-duration');
    
    if (summaryContent && summaryEmpty) {
        // Show summary content and hide empty state
        summaryEmpty.style.display = 'none';
        summaryContent.style.display = 'block';
        
        // Update summary values
        document.getElementById('summary-room-type').textContent = window.currentBookingData.roomName;
        
        const duration = durationSelect ? durationSelect.value : '1';
        const durationText = durationSelect ? durationSelect.options[durationSelect.selectedIndex].text : '1 Day';
        document.getElementById('summary-duration').textContent = durationText;
        
        // Get actual hospital discount percentage from the booking data
        const hospitalDiscount = window.currentBookingData.hospitalData?.discount || 0;
        console.log('Hospital discount percentage:', hospitalDiscount, 'from hospital:', window.currentBookingData.hospitalData?.name);
        const discountPercentage = hospitalDiscount / 100;
        
        const originalPrice = parseInt(window.currentBookingData.originalPrice) * parseInt(duration);
        const discountAmount = Math.round(originalPrice * discountPercentage);
        const finalPrice = originalPrice - discountAmount;
        
        // Update payment preference text to show actual discount
        const paymentDetails = document.querySelector('#hospital-booking-details-screen .payment-details');
        const discountBadge = document.querySelector('#hospital-booking-details-screen .discount-badge');
        
        if (paymentDetails) {
            if (hospitalDiscount > 0) {
                paymentDetails.textContent = `Get ${hospitalDiscount}% discount • Secure payment • Instant confirmation`;
            } else {
                paymentDetails.textContent = `Secure payment • Instant confirmation`;
            }
        }
        
        if (discountBadge) {
            if (hospitalDiscount > 0) {
                discountBadge.textContent = `${hospitalDiscount}% OFF`;
                discountBadge.style.display = 'inline-block';
            } else {
                discountBadge.style.display = 'none';
            }
        }
        
        // Update summary discount label with actual percentage
        const summaryDiscountLabel = document.getElementById('summary-discount-label');
        const summaryDiscountRow = document.getElementById('summary-discount-row');
        
        if (summaryDiscountLabel) {
            summaryDiscountLabel.textContent = `Discount (${hospitalDiscount}%):`;
        }
        
        // Hide discount row if there's no discount
        if (summaryDiscountRow) {
            if (hospitalDiscount > 0) {
                summaryDiscountRow.style.display = 'flex';
            } else {
                summaryDiscountRow.style.display = 'none';
            }
        }
        
        document.getElementById('summary-original-price').textContent = `৳${originalPrice}`;
        document.getElementById('summary-discount').textContent = `-৳${discountAmount}`;
        document.getElementById('summary-total').textContent = `৳${finalPrice}`;
    }
}

function goBackToHospitalBooking() {
    console.log('Going back to hospital booking screen');
    goBackToPreviousScreen();
}

async function submitHospitalBookingRequest() {
    const checkinDate = document.getElementById('checkin-date').value;
    const checkinTime = document.getElementById('checkin-time').value;
    const duration = document.getElementById('expected-duration').value;
    const specialRequirements = document.getElementById('special-requirements').value;
    const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');
    
    // Validate required fields
    const requiredFields = [];
    
    if (!checkinDate) {
        requiredFields.push('Check-in Date');
    }
    
    // Check-in time is optional (no asterisk in HTML label), so we don't validate it as required
    // if (!checkinTime) {
    //     requiredFields.push('Check-in Time');
    // }
    
    if (!duration) {
        requiredFields.push('Expected Duration');
    }
    
    if (!paymentMethodElement) {
        requiredFields.push('Payment Method');
    }
    
    // Show validation message if any required fields are missing
    if (requiredFields.length > 0) {
        const missingFieldsList = requiredFields.join(', ');
        CustomDialog.alert(`Please fill in all required fields:\n\n• ${requiredFields.join('\n• ')}`, 'Required Fields Missing');
        return;
    }
    
    // Validate check-in date is not in the past
    const selectedDate = new Date(checkinDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        CustomDialog.alert('Check-in date cannot be in the past. Please select today or a future date.', 'Invalid Date');
        return;
    }
    
    const paymentMethod = paymentMethodElement.value;
    
    // Format date for display (convert YYYY-MM-DD to readable format)
    const dateObj = new Date(checkinDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Format time for display (convert 24h to 12h format)
    const timeObj = new Date(`2000-01-01T${checkinTime}:00`);
    const formattedTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const finalBookingData = {
        ...window.currentBookingData,
        checkinDate: checkinDate,
        checkinTime: checkinTime,
        formattedDate: formattedDate,
        formattedTime: formattedTime,
        duration: duration,
        specialRequirements: specialRequirements,
        paymentMethod: paymentMethod,
        submittedAt: new Date().toISOString()
    };
    
    console.log('Final hospital booking request:', finalBookingData);
    
    // Generate unique request ID
    const requestId = 'HBR-' + Date.now().toString() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Get actual hospital discount percentage
    const hospitalDiscount = window.currentBookingData.hospitalData?.discount || 0;
    
    // Calculate final pricing with actual discount
    const originalPrice = parseInt(window.currentBookingData.originalPrice) * parseInt(duration);
    const discountAmount = Math.round(originalPrice * (hospitalDiscount / 100));
    const finalPrice = originalPrice - discountAmount;
    
    // Get current user info
    const currentUser = window.AuthSystem?.getUser();
    const userId = currentUser?.supabaseId || null;
    
    // Create hospital request data for Supabase
    const hospitalRequestData = {
        request_id: requestId,
        patient_name: window.currentBookingData.patientName,
        patient_age: window.currentBookingData.patientAge,
        patient_gender: window.currentBookingData.patientGender,
        hospital: window.currentBookingData.hospital,
        hospital_id: window.currentBookingData.hospitalId,
        room_type: window.currentBookingData.roomType,
        room_name: window.currentBookingData.roomName,
        check_in_date: checkinDate,
        check_in_time: checkinTime || '10:00',
        duration: parseInt(duration),
        special_requirements: specialRequirements || null,
        contact: window.currentBookingData.contactNumber,
        emergency_contact: window.currentBookingData.emergencyContact || null,
        payment_method: paymentMethod,
        original_price: originalPrice,
        discount_amount: discountAmount,
        total_price: finalPrice,
        status: 'pending',
        user_id: userId
    };
    
    console.log('Submitting hospital request to Supabase:', hospitalRequestData);
    
    // Save to Supabase
    if (window.handleHospitalRequest) {
        try {
            const savedRequest = await window.handleHospitalRequest(hospitalRequestData);
            console.log('✅ Hospital request saved to Supabase:', savedRequest);
            
            // Also save to local storage for backward compatibility
            const hospitalBookings = InMemoryStorage.hospitalBookings;
            const bookingRecord = {
                ...finalBookingData,
                bookingId: requestId,
                requestId: requestId,
                status: 'pending',
                totalPrice: finalPrice,
                originalPrice: originalPrice,
                discountAmount: discountAmount,
                userId: userId || InMemoryStorage.currentUserId
            };
            hospitalBookings.unshift(bookingRecord);
            InMemoryStorage.hospitalBookings = hospitalBookings;
            
            // Persist to localStorage so it survives page reloads
            localStorage.setItem('mediquick_hospital_bookings', JSON.stringify(hospitalBookings));
            
            console.log('Hospital booking saved to history and localStorage:', bookingRecord);
        } catch (error) {
            console.error('Error saving hospital request:', error);
            CustomDialog.alert('Failed to submit booking request. Please try again.', 'Error');
            return;
        }
    } else {
        console.error('❌ handleHospitalRequest function not available');
        CustomDialog.alert('Booking service is not ready. Please refresh the page and try again.', 'Service Error');
        return;
    }
    
    // Show success message with formatted date and time
    CustomDialog.alert(`Hospital booking request sent successfully!\n\nRequest ID: ${requestId}\nPatient: ${finalBookingData.patientName}\nHospital: ${finalBookingData.hospital}\nRoom: ${window.currentBookingData.roomName}\nCheck-in: ${formattedDate} at ${formattedTime}\nTotal: ৳${finalPrice}\nStatus: Pending Admin Approval\n\nYou will receive a confirmation call within 30 minutes.`, 'Request Submitted');
    
    // Clear booking data and navigate back
    window.currentBookingData = null;
    
    // Navigate to Private Hospital screen's history tab
    navigationHistory = [];
    switchScreen('private-hospital');
    
    // Switch to history tab after the screen loads
    setTimeout(() => {
        const historyTabButton = document.querySelector('.private-hospital-tab-button[data-private-hospital-tab="history"]');
        if (historyTabButton) {
            historyTabButton.click();
        }
    }, 100);
}

// Make functions globally accessible
window.navigateToHospitalBooking = navigateToHospitalBooking;
window.initializeHospitalBookingForm = initializeHospitalBookingForm;
window.proceedHospitalBooking = proceedHospitalBooking;
window.goBackToPrivateHospital = goBackToPrivateHospital;
window.initializeHospitalBookingDetailsScreen = initializeHospitalBookingDetailsScreen;
window.goBackToHospitalBooking = goBackToHospitalBooking;
window.submitHospitalBookingRequest = submitHospitalBookingRequest;

// Hospital Booking History Functions
async function loadHospitalBookingHistory() {
    // Check for new hospital approval notifications
    checkAndShowHospitalApprovalNotifications();
    
    const historyContainer = document.querySelector('#private-hospital-history-tab .hospital-booking-history-section');
    
    if (!historyContainer) return;
    
    let hospitalBookings = [];
    
    // Try to load from Supabase if available
    if (window.dbService && window.dbService.getHospitalRequestsByUserId) {
        const currentUser = window.AuthSystem?.getUser();
        const userId = currentUser?.supabaseId;
        
        try {
            if (userId) {
                // Load user-specific requests
                hospitalBookings = await window.dbService.getHospitalRequestsByUserId(userId);
                console.log('✅ Loaded hospital requests from Supabase:', hospitalBookings);
            } else {
                // For non-logged-in users, try to get from local storage
                console.log('ℹ️ No user logged in, using local storage for hospital bookings');
                hospitalBookings = InMemoryStorage.hospitalBookings || [];
            }
        } catch (error) {
            console.error('Error loading hospital requests from Supabase:', error);
            // Fallback to local storage
            hospitalBookings = InMemoryStorage.hospitalBookings || [];
        }
    } else {
        // Fallback to local storage if Supabase not available
        hospitalBookings = InMemoryStorage.hospitalBookings || [];
    }
    
    if (hospitalBookings.length === 0) {
        // Show empty state
        historyContainer.innerHTML = `
            <h3>Booking Hospital History</h3>
            <div class="hospital-booking-empty-state">
                <div class="hospital-empty-icon">
                    <i class="fas fa-hospital"></i>
                </div>
                <h4>No Hospital Request</h4>
                <p>Your Hospital Booking Request Will Appear Here When You Make Requests.</p>
            </div>
        `;
    } else {
        // Show booking cards
        const cardsHTML = hospitalBookings.map(booking => {
            // Handle both Supabase format (snake_case) and local format (camelCase)
            const requestId = booking.request_id || booking.requestId || booking.bookingId;
            const patientName = booking.patient_name || booking.patientName;
            const hospital = booking.hospital;
            const roomName = booking.room_name || booking.roomName;
            const checkInDate = booking.check_in_date || booking.checkinDate;
            const checkInTime = booking.check_in_time || booking.checkinTime;
            const duration = booking.duration;
            const status = booking.status;
            const requestTime = booking.request_time || booking.submittedAt;
            
            // Format dates
            const displayDate = requestTime ? new Date(requestTime).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) : 'N/A';
            
            const formattedCheckInDate = checkInDate ? new Date(checkInDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) : (booking.formattedDate || 'N/A');
            
            const formattedCheckInTime = checkInTime || booking.formattedTime || 'N/A';
            
            return `
                <div class="hospital-booking-history-card">
                    <div class="booking-card-header">
                        <span class="booking-date">Date: ${displayDate}</span>
                    </div>
                    <div class="booking-card-content">
                        <div class="booking-card-left">
                            <div class="booking-icon">
                                <i class="fas fa-hospital"></i>
                            </div>
                        </div>
                        <div class="booking-card-right">
                            <div class="booking-detail">
                                <span class="booking-label">Request ID:</span>
                                <span class="booking-value">${requestId}</span>
                            </div>
                            <div class="booking-detail">
                                <span class="booking-label">Hospital:</span>
                                <span class="booking-value">${hospital}</span>
                            </div>
                            <div class="booking-detail">
                                <span class="booking-label">Patient:</span>
                                <span class="booking-value">${patientName}</span>
                            </div>
                            <div class="booking-detail">
                                <span class="booking-label">Room:</span>
                                <span class="booking-value">${roomName}</span>
                            </div>
                            <div class="booking-detail">
                                <span class="booking-label">Check-in:</span>
                                <span class="booking-value">${formattedCheckInDate} at ${formattedCheckInTime}</span>
                            </div>
                            <div class="booking-detail">
                                <span class="booking-label">Duration:</span>
                                <span class="booking-value">${duration} day${duration !== 1 && duration !== '1' ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                    <div class="booking-card-footer">
                        <div class="booking-status ${status}">
                            ${status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        historyContainer.innerHTML = `
            <h3>Booking Hospital History</h3>
            <div class="hospital-booking-cards-container">
                ${cardsHTML}
            </div>
        `;
    }
    
    console.log(`Loaded ${hospitalBookings.length} hospital booking(s) in history`);
}

window.loadHospitalBookingHistory = loadHospitalBookingHistory;

// Custom Dialog System - to replace native alert() and confirm() without domain name
const CustomDialog = {
    // Custom Alert Dialog
    alert: function(message, title = 'MediQuick') {
        return new Promise((resolve) => {
            // Remove any existing dialog
            const existingDialog = document.querySelector('.custom-dialog-overlay');
            if (existingDialog) {
                existingDialog.remove();
            }

            // Create dialog HTML
            const dialogHTML = `
                <div class="custom-dialog-overlay">
                    <div class="custom-dialog">
                        <div class="custom-dialog-header">
                            <h3>${title}</h3>
                        </div>
                        <div class="custom-dialog-content">
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="custom-dialog-actions">
                            <button class="custom-dialog-btn custom-dialog-btn-primary" onclick="CustomDialog.closeAlert()">OK</button>
                        </div>
                    </div>
                </div>
            `;

            // Add to body
            document.body.insertAdjacentHTML('beforeend', dialogHTML);
            document.body.style.overflow = 'hidden';

            // Store resolve function
            CustomDialog._alertResolve = resolve;

            // Close on overlay click
            const overlay = document.querySelector('.custom-dialog-overlay');
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    CustomDialog.closeAlert();
                }
            });
        });
    },

    // Custom Confirm Dialog
    confirm: function(message, title = 'Confirm Action') {
        return new Promise((resolve) => {
            // Remove any existing dialog
            const existingDialog = document.querySelector('.custom-dialog-overlay');
            if (existingDialog) {
                existingDialog.remove();
            }

            // Create dialog HTML
            const dialogHTML = `
                <div class="custom-dialog-overlay">
                    <div class="custom-dialog">
                        <div class="custom-dialog-header">
                            <h3>${title}</h3>
                        </div>
                        <div class="custom-dialog-content">
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="custom-dialog-actions">
                            <button class="custom-dialog-btn custom-dialog-btn-secondary" onclick="CustomDialog.closeConfirm(false)">Cancel</button>
                            <button class="custom-dialog-btn custom-dialog-btn-primary" onclick="CustomDialog.closeConfirm(true)">OK</button>
                        </div>
                    </div>
                </div>
            `;

            // Add to body
            document.body.insertAdjacentHTML('beforeend', dialogHTML);
            document.body.style.overflow = 'hidden';

            // Store resolve function
            CustomDialog._confirmResolve = resolve;

            // Close on overlay click (cancel)
            const overlay = document.querySelector('.custom-dialog-overlay');
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    CustomDialog.closeConfirm(false);
                }
            });
        });
    },

    // Close alert dialog
    closeAlert: function() {
        const dialog = document.querySelector('.custom-dialog-overlay');
        if (dialog) {
            dialog.remove();
            document.body.style.overflow = '';
        }
        if (CustomDialog._alertResolve) {
            CustomDialog._alertResolve();
            CustomDialog._alertResolve = null;
        }
    },

    // Close confirm dialog
    closeConfirm: function(result) {
        const dialog = document.querySelector('.custom-dialog-overlay');
        if (dialog) {
            dialog.remove();
            document.body.style.overflow = '';
        }
        if (CustomDialog._confirmResolve) {
            CustomDialog._confirmResolve(result);
            CustomDialog._confirmResolve = null;
        }
    },

    // Custom Prompt Dialog
    prompt: function(message, title = 'Input Required', defaultValue = '') {
        return new Promise((resolve) => {
            // Remove any existing dialog
            const existingDialog = document.querySelector('.custom-dialog-overlay');
            if (existingDialog) {
                existingDialog.remove();
            }

            // Create dialog HTML
            const dialogHTML = `
                <div class="custom-dialog-overlay">
                    <div class="custom-dialog">
                        <div class="custom-dialog-header">
                            <h3>${title}</h3>
                        </div>
                        <div class="custom-dialog-content">
                            <p>${message.replace(/\n/g, '<br>')}</p>
                            <input type="text" class="custom-prompt-input" value="${defaultValue}" placeholder="Enter value..." autofocus>
                        </div>
                        <div class="custom-dialog-actions">
                            <button class="custom-dialog-btn custom-dialog-btn-secondary" onclick="CustomDialog.closePrompt(null)">Cancel</button>
                            <button class="custom-dialog-btn custom-dialog-btn-primary" onclick="CustomDialog.closePrompt('value')">OK</button>
                        </div>
                    </div>
                </div>
            `;

            // Add to body
            document.body.insertAdjacentHTML('beforeend', dialogHTML);
            document.body.style.overflow = 'hidden';

            // Focus the input
            const input = document.querySelector('.custom-prompt-input');
            if (input) {
                input.focus();
                input.select();
                
                // Handle Enter key
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        CustomDialog.closePrompt('value');
                    }
                });
            }

            // Store resolve function
            CustomDialog._promptResolve = resolve;

            // Close on overlay click (cancel)
            const overlay = document.querySelector('.custom-dialog-overlay');
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    CustomDialog.closePrompt(null);
                }
            });
        });
    },

    // Close prompt dialog
    closePrompt: function(result) {
        const dialog = document.querySelector('.custom-dialog-overlay');
        const input = document.querySelector('.custom-prompt-input');
        
        let value = null;
        if (result === 'value' && input) {
            value = input.value.trim();
        }
        
        if (dialog) {
            dialog.remove();
            document.body.style.overflow = '';
        }
        if (CustomDialog._promptResolve) {
            CustomDialog._promptResolve(value);
            CustomDialog._promptResolve = null;
        }
    }
};

// Make CustomDialog available globally
window.CustomDialog = CustomDialog;

window.updateAllBannerImages = function() {
    if (!window.bannerImagesCache) {
        console.log('⚠️ Banner images cache not loaded yet');
        return;
    }
    
    console.log('🖼️ Updating all banner images from database...');
    
    const homeHeroImages = window.bannerImagesCache['home-hero-slider'] || [];
    if (homeHeroImages.length > 0) {
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.innerHTML = homeHeroImages.map((image, index) => `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <img src="${image.image_url}" alt="${image.type} ${index + 1}">
                </div>
            `).join('');
            console.log(`✅ Updated home hero slider with ${homeHeroImages.length} images`);
            
            if (typeof window.initializeHeroSlider === 'function') {
                window.initializeHeroSlider();
            }
        }
    }
    
    const sponsorImages = window.bannerImagesCache['sponsor-banner'] || [];
    if (sponsorImages.length > 0) {
        const sponsorImg = document.querySelector('.sponsor-banner .sponsor-image');
        if (sponsorImg) {
            sponsorImg.src = sponsorImages[0].image_url;
            console.log('✅ Updated sponsor banner');
        }
        
        const sponsorSlider = document.querySelector('.sponsor-hero-images .sponsor-slider');
        if (sponsorSlider) {
            sponsorSlider.innerHTML = sponsorImages.map((image, index) => `
                <div class="sponsor-slide ${index === 0 ? 'active' : ''}">
                    <img src="${image.image_url}" alt="Sponsor ${index + 1}">
                </div>
            `).join('');
            console.log(`✅ Updated sponsor slider with ${sponsorImages.length} images`);
        }
    }
    
    const bloodHeroImages = window.bannerImagesCache['blood-hero-slider'] || [];
    if (bloodHeroImages.length > 0) {
        const bloodSlider = document.querySelector('.blood-hero-slider .blood-slider-container');
        if (bloodSlider) {
            bloodSlider.innerHTML = bloodHeroImages.map((image, index) => `
                <div class="blood-slide ${index === 0 ? 'active' : ''}">
                    <img src="${image.image_url}" alt="Blood Donation ${index + 1}">
                </div>
            `).join('');
            console.log(`✅ Updated blood hero slider with ${bloodHeroImages.length} images`);
        }
    }
    
    const donorHeroImages = window.bannerImagesCache['donor-hero-image'] || [];
    if (donorHeroImages.length > 0) {
        const donorHeroImg = document.querySelector('.donor-hero-section .donor-hero-image');
        if (donorHeroImg) {
            donorHeroImg.src = donorHeroImages[0].image_url;
            console.log('✅ Updated donor hero image');
        }
    }
    
    const ambulanceHeroImages = window.bannerImagesCache['ambulance-hero-slider'] || [];
    if (ambulanceHeroImages.length > 0) {
        const ambulanceSlider = document.querySelector('.ambulance-hero-slider .ambulance-slider-container');
        if (ambulanceSlider) {
            ambulanceSlider.innerHTML = ambulanceHeroImages.map((image, index) => `
                <div class="ambulance-slide ${index === 0 ? 'active' : ''}">
                    <img src="${image.image_url}" alt="Ambulance Service ${index + 1}">
                </div>
            `).join('');
            console.log(`✅ Updated ambulance hero slider with ${ambulanceHeroImages.length} images`);
        }
    }
    
    const hospitalHeroImages = window.bannerImagesCache['private-hospital-hero-slider'] || [];
    if (hospitalHeroImages.length > 0) {
        const hospitalSlider = document.querySelector('.private-hospital-hero-slider .private-hospital-slider-container');
        if (hospitalSlider) {
            hospitalSlider.innerHTML = hospitalHeroImages.map((image, index) => `
                <div class="private-hospital-slide ${index === 0 ? 'active' : ''}">
                    <img src="${image.image_url}" alt="Private Hospital ${index + 1}">
                </div>
            `).join('');
            console.log(`✅ Updated hospital hero slider with ${hospitalHeroImages.length} images`);
        }
    }
    
    const pharmacyPromoImages = window.bannerImagesCache['pharmacy-promotional-image'] || [];
    if (pharmacyPromoImages.length > 0) {
        const pharmacyImg = document.querySelector('.pharmacy-promotional-section .promotional-image img');
        if (pharmacyImg) {
            pharmacyImg.src = pharmacyPromoImages[0].image_url;
            console.log('✅ Updated pharmacy promo image');
        }
    }
    
    console.log('✅ All banner images updated from database');
};

// =================================== 
// WELCOME BENEFITS POPUP FUNCTIONS
// ===================================

let welcomePopupTimer = null;

// Load and show welcome popup from Supabase
async function showWelcomePopup() {
    console.log('🎉 showWelcomePopup() called');
    try {
        // Check if popup has been shown in this session
        const popupShownKey = 'welcomePopupShown_' + new Date().toDateString();
        if (sessionStorage.getItem(popupShownKey)) {
            console.log('⏭️ Welcome popup already shown in this session');
            return;
        }
        console.log('✅ Popup not shown yet in this session, proceeding...');

        // Fetch popup data from Supabase
        console.log('📡 Fetching popup data from Supabase...');
        const { data, error } = await supabase
            .from('starting_ads_popup')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single();

        if (error) {
            console.error('❌ Error fetching welcome popup data:', error);
            return;
        }

        if (!data) {
            console.log('⚠️ No active welcome popup found in database');
            return;
        }

        console.log('✅ Popup data fetched:', data);

        // Update popup content
        const titleEl = document.getElementById('welcome-popup-title');
        const descEl = document.getElementById('welcome-popup-description');
        const imageEl = document.getElementById('welcome-popup-image');
        const benefitsEl = document.getElementById('welcome-popup-benefits');
        const buttonEl = document.getElementById('welcome-popup-button');
        const countdownEl = document.getElementById('welcome-popup-countdown');

        console.log('🔍 Finding popup elements...', {
            titleEl: !!titleEl,
            descEl: !!descEl,
            imageEl: !!imageEl,
            benefitsEl: !!benefitsEl,
            buttonEl: !!buttonEl,
            countdownEl: !!countdownEl
        });

        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.description;
        if (imageEl && data.image_url) {
            imageEl.src = data.image_url;
            imageEl.style.display = 'block';
        } else if (imageEl) {
            imageEl.style.display = 'none';
        }

        if (buttonEl) buttonEl.textContent = data.button_text || 'Get Started';

        // Update benefits list
        if (benefitsEl && data.benefits && Array.isArray(data.benefits)) {
            console.log('📝 Updating benefits list with', data.benefits.length, 'items');
            benefitsEl.innerHTML = data.benefits.map(benefit => `
                <li><i class="fas fa-check-circle"></i> ${benefit}</li>
            `).join('');
        }

        // Show the popup
        const popupOverlay = document.getElementById('welcome-benefits-popup');
        console.log('🔍 Popup overlay element found:', !!popupOverlay);
        
        if (popupOverlay) {
            console.log('✅ Showing popup...');
            popupOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling

            // Start auto-close timer
            const autoCloseSeconds = data.auto_close_seconds || 5;
            console.log('⏱️ Starting auto-close timer:', autoCloseSeconds, 'seconds');
            startAutoCloseTimer(autoCloseSeconds);

            // Mark as shown in this session
            sessionStorage.setItem(popupShownKey, 'true');
            console.log('🎉 Welcome popup displayed successfully!');
        } else {
            console.error('❌ Popup overlay element not found in DOM!');
        }

    } catch (error) {
        console.error('❌ Error showing welcome popup:', error);
    }
}

// Start auto-close countdown timer
function startAutoCloseTimer(seconds) {
    const countdownEl = document.getElementById('welcome-popup-countdown');
    let remaining = seconds;

    if (countdownEl) {
        countdownEl.textContent = remaining;
    }

    welcomePopupTimer = setInterval(() => {
        remaining--;
        if (countdownEl) {
            countdownEl.textContent = remaining;
        }

        if (remaining <= 0) {
            closeWelcomePopup();
        }
    }, 1000);
}

// Close the welcome popup
function closeWelcomePopup() {
    // Clear timer
    if (welcomePopupTimer) {
        clearInterval(welcomePopupTimer);
        welcomePopupTimer = null;
    }

    // Hide popup
    const popupOverlay = document.getElementById('welcome-benefits-popup');
    if (popupOverlay) {
        popupOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }

    console.log('Welcome popup closed');
}

// Make functions globally accessible
window.showWelcomePopup = showWelcomePopup;
window.closeWelcomePopup = closeWelcomePopup;

// Offline Detection and Screen Management
(function initOfflineDetection() {
    const offlineScreen = document.getElementById('offline-screen');
    
    if (!offlineScreen) {
        console.error('Offline screen element not found');
        return;
    }

    function showOfflineScreen() {
        offlineScreen.classList.add('active');
        console.log('🔴 Offline: No internet connection detected');
    }

    function hideOfflineScreen() {
        offlineScreen.classList.remove('active');
        console.log('🟢 Online: Internet connection restored');
    }

    function updateOnlineStatus() {
        if (navigator.onLine) {
            hideOfflineScreen();
        } else {
            showOfflineScreen();
        }
    }

    window.addEventListener('online', () => {
        console.log('📡 Network status changed: ONLINE');
        hideOfflineScreen();
    });

    window.addEventListener('offline', () => {
        console.log('📡 Network status changed: OFFLINE');
        showOfflineScreen();
    });

    updateOnlineStatus();

    console.log('✅ Offline detection initialized');
})();
