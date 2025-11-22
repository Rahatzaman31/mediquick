// Admin Dashboard JavaScript

// ============= UTILITY FUNCTIONS =============

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

// ============= ADMIN AUTHENTICATION =============

// Admin credentials are now stored securely in .env file and validated via API

// Default health tips/FAQs for doctors
const DEFAULT_HEALTH_TIPS = [
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

// Session management
const adminSession = {
    isLoggedIn: false,
    sessionKey: 'mediquick_admin_session',

    // Check if admin is logged in
    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            const sessionData = JSON.parse(session);
            const currentTime = Date.now();
            // Session expires after 24 hours (24 * 60 * 60 * 1000 ms)
            if (currentTime - sessionData.timestamp < 86400000) {
                this.isLoggedIn = true;
                return true;
            } else {
                // Session expired, clear it
                this.clearSession();
                return false;
            }
        }
        return false;
    },

    // Create new session
    createSession(password) {
        const sessionData = {
            timestamp: Date.now(),
            user: 'admin',
            adminPassword: password
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        this.isLoggedIn = true;
    },
    
    // Get admin password from session
    getPassword() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            const sessionData = JSON.parse(session);
            return sessionData.adminPassword || null;
        }
        return null;
    },

    // Clear session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        this.isLoggedIn = false;
    }
};

// Handle admin login form submission
async function handleAdminLogin(event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    // Clear previous error messages
    document.getElementById('username-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    // Validate inputs
    if (!username) {
        document.getElementById('username-error').textContent = 'Username is required';
        return;
    }

    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required';
        return;
    }

    // Show loading state
    const loginButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = loginButton.innerHTML;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginButton.disabled = true;

    try {
        // Authenticate via API
        const response = await fetch('https://mediquick-p37c.onrender.com/api/admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Successful login
            adminSession.createSession(password);
            showAdminDashboard();

            // Clear form
            document.getElementById('admin-login-form').reset();

            // Show success message
            setTimeout(() => {
                showNotification('Welcome to MediQuick Admin Dashboard!', 'success');
            }, 500);
        } else {
            // Failed login
            const errorMessage = data.error || 'Invalid username or password';
            document.getElementById('password-error').textContent = errorMessage;

            // Clear password field for security
            document.getElementById('admin-password').value = '';
        }
    } catch (error) {
        console.error('Admin login error:', error);
        document.getElementById('password-error').textContent = 'Login failed. Please try again.';
    } finally {
        // Restore button state
        loginButton.innerHTML = originalButtonText;
        loginButton.disabled = false;
    }
}

// Toggle password visibility
function toggleAdminPassword() {
    const passwordInput = document.getElementById('admin-password');
    const toggleIcon = document.querySelector('.password-toggle i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('admin-login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
}

// Show login screen
function showAdminLogin() {
    document.getElementById('admin-login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

// Check authentication on page load
function initializeAdminApp() {
    if (adminSession.checkSession()) {
        // User is already logged in, show dashboard
        showAdminDashboard();
        console.log('Admin session found, showing dashboard');
    } else {
        // User is not logged in, show login screen
        showAdminLogin();
        console.log('No admin session found, showing login screen');
    }
}

// ============= END ADMIN AUTHENTICATION =============

// Global admin data storage
const adminData = {
    doctors: [
        {
            id: 1,
            name: 'Dr. Musa Siddik Juwel',
            specialty: 'Dentistry',
            degree: 'BDS, MDS, FCPS (Oral & Maxillofacial Surgery)',
            workplace: 'Rangpur Medical College & Hospital',
            image: 'https://i.ibb.co.com/wryX5fXx/Rectangle-66.png',
            rating: 5.0,
            reviews: 220,
            status: 'active',
            patients: '1500+',
            experience: '10+',
            about: 'Highly experienced dental surgeon',
            visitingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            offDays: ['Saturday', 'Sunday'],
            chamberAddress: 'Dental Care Center, Station Road, Rangpur',
            inactiveReason: null,
            inactiveDetails: null,
            returnDate: null,
            healthTips: [
                {
                    question: 'How often should I brush my teeth?',
                    answer: 'You should brush your teeth at least twice a day, preferably after meals.'
                },
                {
                    question: 'When should I visit a dentist?',
                    answer: 'Regular dental checkups should be done every 6 months for optimal oral health.'
                }
            ],
            fakeReviews: [
                {
                    reviewerName: 'John Doe',
                    rating: 5,
                    reviewText: 'Excellent doctor! Very gentle and professional. Highly recommended.'
                },
                {
                    reviewerName: 'Sarah Ahmed',
                    rating: 5,
                    reviewText: 'Best dental surgeon in Rangpur. Pain-free treatment and great care.'
                }
            ]
        },
        {
            id: 2,
            name: 'Dr. Mizanur Rahman',
            specialty: 'ENT',
            degree: 'MBBS, MS (ENT), FRCS (Edinburgh)',
            workplace: 'Rangpur ENT & Head Neck Surgery Center',
            image: 'https://i.ibb.co.com/5hZY8WLY/Rectangle-70.png',
            rating: 4.9,
            reviews: 112,
            status: 'active',
            patients: '950+',
            experience: '12+',
            about: 'Expert ENT specialist with international certification',
            visitingDays: ['Sunday', 'Monday', 'Wednesday', 'Thursday'],
            offDays: ['Tuesday', 'Friday', 'Saturday'],
            chamberAddress: 'ENT Care Center, Medical Road, Rangpur',
            inactiveReason: null,
            inactiveDetails: null,
            returnDate: null,
            healthTips: [
                {
                    question: 'How to prevent ear infections?',
                    answer: 'Keep ears dry, avoid inserting objects, and maintain good hygiene.'
                }
            ],
            fakeReviews: [
                {
                    reviewerName: 'Maria Khan',
                    rating: 5,
                    reviewText: 'Great ENT specialist. Solved my chronic sinusitis problem.'
                }
            ]
        },
        {
            id: 3,
            name: 'Dr. Dip Jyoti Sarker',
            specialty: 'Pulmonology',
            degree: 'MBBS, MD (Pulmonology), FCCP',
            workplace: 'Rangpur Chest Disease Hospital',
            image: 'https://i.ibb.co.com/1GYSTSZV/Rectangle-68.png',
            rating: 4.8,
            reviews: 180,
            status: 'inactive',
            patients: '1200+',
            experience: '8+',
            about: 'Specialized in respiratory medicine',
            visitingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            offDays: ['Sunday', 'Wednesday', 'Saturday'],
            chamberAddress: 'Lung Care Center, Hospital Road, Rangpur',
            inactiveReason: 'medical_leave',
            inactiveDetails: 'On medical leave for surgery recovery',
            returnDate: '2024-03-15',
            healthTips: [
                {
                    question: 'How to maintain healthy lungs?',
                    answer: 'Avoid smoking, exercise regularly, and practice deep breathing exercises.'
                }
            ],
            fakeReviews: [
                {
                    reviewerName: 'Rahman Ali',
                    rating: 5,
                    reviewText: 'Excellent pulmonologist. Very knowledgeable and caring.'
                }
            ]
        },
        {
            id: 4,
            name: 'Dr. Hasanur Rahman',
            specialty: 'Cardiology',
            degree: 'MBBS, MD (Cardiology), FACC',
            workplace: 'Rangpur Heart Foundation',
            image: 'https://i.ibb.co.com/gM0fNHFN/Rectangle-71.png',
            rating: 4.9,
            reviews: 200,
            patients: '2000+',
            experience: '15+',
            about: 'Leading cardiologist with extensive experience',
            visitingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            offDays: ['Friday', 'Saturday'],
            chamberAddress: 'Heart Care Center, Central Road, Rangpur',
            inactiveReason: null,
            inactiveDetails: null,
            returnDate: null,
            healthTips: [
                {
                    question: 'How to maintain a healthy heart?',
                    answer: 'Exercise regularly, eat a balanced diet, avoid smoking, and manage stress.'
                },
                {
                    question: 'What are the signs of heart problems?',
                    answer: 'Chest pain, shortness of breath, fatigue, and irregular heartbeat.'
                }
            ],
            fakeReviews: [
                {
                    reviewerName: 'Ahmed Hassan',
                    rating: 5,
                    reviewText: 'Saved my life! Best cardiologist in the region.'
                },
                {
                    reviewerName: 'Fatima Begum',
                    rating: 4,
                    reviewText: 'Very professional and knowledgeable doctor.'
                }
            ]
        }
    ],
    users: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            mobile: '+880123456789',
            district: 'Rangpur',
            upazila: 'Rangpur Sadar',
            joinDate: '2024-01-15',
            status: 'active',
            avatar: null,
            points: 100
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            mobile: '+880987654321',
            district: 'Dinajpur',
            upazila: 'Dinajpur Sadar',
            joinDate: '2024-02-20',
            status: 'active',
            avatar: null,
            points: 75
        }
    ],
    appointments: [
        {
            id: 1,
            bookingId: 'MQ2024001',
            patientName: 'John Doe',
            doctorName: 'Dr. Musa Siddik Juwel',
            doctorSpecialty: 'Dentistry',
            date: '2024-02-15',
            time: '10:00 AM',
            status: 'pending',
            patientContact: '+880123456789',
            patientGender: 'Male',
            patientAge: 28,
            patientAddress: '123 Medical Street, Rangpur Sadar, Rangpur',
            userPoints: 50
        },
        {
            id: 2,
            bookingId: 'MQ2024002',
            patientName: 'Jane Smith',
            doctorName: 'Dr. Hasanur Rahman',
            doctorSpecialty: 'Cardiology',
            date: '2024-02-16',
            time: '2:00 PM',
            status: 'approved',
            patientContact: '+880987654321',
            patientGender: 'Female',
            patientAge: 35,
            patientAddress: '456 Health Avenue, Dinajpur Sadar, Dinajpur',
            userPoints: 80
        },
        {
            id: 3,
            bookingId: 'MQ2024003',
            patientName: 'Ahmed Hassan',
            doctorName: 'Dr. Mizanur Rahman',
            doctorSpecialty: 'ENT',
            date: '2024-02-17',
            time: '11:30 AM',
            status: 'completed',
            patientContact: '+880111222333',
            patientGender: 'Male',
            patientAge: 42,
            patientAddress: '789 Care Road, Kurigram Sadar, Kurigram',
            userPoints: 120
        },
        {
            id: 4,
            bookingId: 'MQ2024004',
            patientName: 'Fatima Begum',
            doctorName: 'Dr. Dip Jyoti Sarker',
            doctorSpecialty: 'Pulmonology',
            date: '2024-02-18',
            time: '3:00 PM',
            status: 'cancelled',
            patientContact: '+880444555666',
            patientGender: 'Female',
            patientAge: 31,
            patientAddress: '321 Wellness Lane, Gaibandha Sadar, Gaibandha',
            userPoints: 30
        }
    ],
    emergencyServices: {
        ambulanceRequests: [
            {
                id: 1,
                requestId: 'AMB001',
                patientName: 'Ahmed Hassan',
                contact: '+880111111111',
                location: 'Rangpur Medical College',
                emergencyType: 'Heart Attack',
                status: 'pending',
                requestTime: '2024-02-10 14:30'
            }
        ],
        bloodRequests: [
            {
                id: 1,
                requestId: 'BLOOD001',
                patientName: 'Fatima Khatun',
                bloodGroup: 'O+',
                unitsNeeded: 2,
                hospital: 'Rangpur Medical College',
                status: 'urgent',
                requestTime: '2024-02-09 10:15',
                contact: '+880123456789'
            }
        ],
        hospitalRequests: [
            {
                id: 1,
                requestId: 'HOSP001',
                patientName: 'Karim Rahman',
                hospital: 'Rangpur General Hospital',
                department: 'Emergency',
                priority: 'high',
                status: 'approved',
                requestTime: '2024-02-08 16:45',
                contact: '+880987654321'
            }
        ]
    },
    bloodDonors: [
        {
            id: 1,
            name: 'Mohammad Ali',
            bloodGroup: 'O+',
            contact: '+880222222222',
            age: 28,
            gender: 'Male',
            weight: 70,
            district: 'Rangpur',
            upazila: 'Rangpur Sadar',
            location: 'Rangpur Sadar',
            address: 'House 123, Ward 5, Rangpur Sadar, Rangpur',
            emergencyContact: '+880777777777',
            lastDonation: '2023-12-15',
            lastDonationDate: '2023-12-15',
            medicalConditions: 'None',
            medications: 'None',
            donationFrequency: 'Every 3 months',
            notes: 'Regular donor, very cooperative',
            status: 'available',
            approved: true,
            approvalDate: '2023-10-01',
            requestDate: '2023-09-28'
        },
        {
            id: 2,
            name: 'Rashida Begum',
            bloodGroup: 'A+',
            contact: '+880333333333',
            age: 32,
            gender: 'Female',
            weight: 60,
            district: 'Dinajpur',
            upazila: 'Dinajpur Sadar',
            location: 'Dinajpur Sadar',
            address: 'House 456, Ward 3, Dinajpur Sadar, Dinajpur',
            emergencyContact: '+880888888888',
            lastDonation: '2024-01-20',
            lastDonationDate: '2024-01-20',
            medicalConditions: 'None',
            medications: 'Iron supplements',
            donationFrequency: 'Every 6 months',
            notes: 'Experienced donor',
            status: 'available',
            approved: true,
            approvalDate: '2023-11-15',
            requestDate: '2023-11-10'
        },
        {
            id: 3,
            name: 'Abdul Rahman',
            bloodGroup: 'B+',
            contact: '+880444444444',
            age: 25,
            gender: 'Male',
            weight: 75,
            district: 'Kurigram',
            upazila: 'Kurigram Sadar',
            location: 'Kurigram Sadar',
            address: 'House 789, Ward 7, Kurigram Sadar, Kurigram',
            emergencyContact: '+880999999999',
            lastDonation: null,
            lastDonationDate: null,
            medicalConditions: 'None',
            medications: 'None',
            donationFrequency: 'First Time',
            notes: 'New donor request from user app',
            status: 'pending',
            approved: false,
            approvalDate: null,
            requestDate: '2024-02-20'
        }
    ],
    hospitals: [
        {
            id: 1,
            name: 'Rangpur Medical College & Hospital',
            type: 'Government',
            location: 'Rangpur',
            contact: '+880521234567',
            totalBeds: 500,
            availableBeds: 45,
            status: 'active',
            rating: 4.5,
            reviewsCount: 300,
            discountPercentage: 10,
            specialOffer: '10% off on OPD consultation',
            about: 'A leading government medical college and hospital providing comprehensive healthcare services.',
            specialities: ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'General Surgery'],
            facilities: {
                icu: { available: true, bedCount: 50 },
                ccu: { available: true, bedCount: 30 },
                emergency: { available: true, bedCount: 20 },
                operationTheater: { available: true },
                pharmacy: { available: true },
                laboratory: { available: true },
                radiology: { available: true }
            },
            roomPricing: {
                generalWard: { beds: 100, originalPrice: 500, discountedPrice: 450, savings: 50 },
                cabinAC: { beds: 50, originalPrice: 2000, discountedPrice: 1800, savings: 200 },
                cabinNonAC: { beds: 50, originalPrice: 1200, discountedPrice: 1100, savings: 100 },
                icu: { beds: 50, originalPrice: 5000, discountedPrice: 4500, savings: 500 },
                ccu: { beds: 30, originalPrice: 4500, discountedPrice: 4000, savings: 500 }
            }
        },
        {
            id: 2,
            name: 'Popular Hospital Rangpur',
            type: 'Private',
            location: 'Rangpur',
            contact: '+880529876543',
            totalBeds: 200,
            availableBeds: 15,
            status: 'active',
            rating: 4.8,
            reviewsCount: 150,
            discountPercentage: 15,
            specialOffer: 'Free health check-up for senior citizens',
            about: 'A premier private hospital known for its advanced medical technology and patient-centric care.',
            specialities: ['Orthopedics', 'Gastroenterology', 'Dermatology', 'ENT'],
            facilities: {
                icu: { available: true, bedCount: 20 },
                emergency: { available: true, bedCount: 10 },
                operationTheater: { available: true },
                pharmacy: { available: true },
                laboratory: { available: true },
                radiology: { available: true }
            },
            roomPricing: {
                cabinAC: { beds: 80, originalPrice: 2500, discountedPrice: 2125, savings: 375 },
                cabinNonAC: { beds: 70, originalPrice: 1500, discountedPrice: 1350, savings: 150 },
                icu: { beds: 20, originalPrice: 6000, discountedPrice: 5100, savings: 900 }
            }
        }
    ],
    pharmacies: [],
    drivers: [
        {
            id: 1,
            name: 'Abdul Karim',
            license: 'RNG123456',
            vehicleType: 'Ambulance',
            contact: '+880444444444',
            location: 'Rangpur',
            status: 'available',
            photo: null
        },
        {
            id: 2,
            name: 'Ibrahim Hossain',
            license: 'DIN789012',
            vehicleType: 'ICU Ambulance',
            contact: '+880555555555',
            location: 'Dinajpur',
            status: 'busy',
            photo: null
        }
    ],
    specialistCategories: [
        {
            id: 1,
            categoryKey: 'cardiology',
            title: 'Cardiologist',
            subtitle: 'Find Best Cardiologist In Rangpur',
            iconClass: 'fas fa-heartbeat',
            iconColor: '#E91E63',
            iconUrl: null,
            searchTerms: ['cardiac', 'cardiology', 'cardiologist', 'heart'],
            status: 'active',
            sortOrder: 1,
            description: 'Heart and cardiovascular system specialists'
        },
        {
            id: 2,
            categoryKey: 'oncology',
            title: 'Oncologist',
            subtitle: 'Find Best Oncologist In Rangpur',
            iconClass: 'fas fa-ribbon',
            iconColor: '#9C27B0',
            searchTerms: ['oncology', 'oncologist', 'cancer'],
            status: 'active',
            sortOrder: 2,
            description: 'Cancer treatment specialists'
        },
        {
            id: 3,
            categoryKey: 'pulmonology',
            title: 'Pulmonologist',
            subtitle: 'Find Best Pulmonologist In Rangpur',
            iconClass: 'fas fa-lungs',
            iconColor: '#2196F3',
            searchTerms: ['pulmonology', 'pulmonologist', 'lung', 'pulmonol'],
            status: 'active',
            sortOrder: 3,
            description: 'Lung and respiratory system specialists'
        },
        {
            id: 4,
            categoryKey: 'pediatrics',
            title: 'Pediatrician',
            subtitle: 'Find Best Pediatrician In Rangpur',
            iconClass: 'fas fa-baby',
            iconColor: '#FF9800',
            searchTerms: ['pediatrics', 'pediatrician', 'child', 'pediatric'],
            status: 'active',
            sortOrder: 4,
            description: 'Children healthcare specialists'
        },
        {
            id: 5,
            categoryKey: 'dentists',
            title: 'Dentist',
            subtitle: 'Find Best Dentist In Rangpur',
            iconClass: 'fas fa-tooth',
            iconColor: '#4CAF50',
            searchTerms: ['dentist', 'dental', 'tooth'],
            status: 'active',
            sortOrder: 5,
            description: 'Dental and oral health specialists'
        },
        {
            id: 6,
            categoryKey: 'neurology',
            title: 'Neurologist',
            subtitle: 'Find Best Neurologist In Rangpur',
            iconClass: 'fas fa-brain',
            iconColor: '#FF5722',
            searchTerms: ['neurology', 'neurologist', 'brain', 'neurolog'],
            status: 'active',
            sortOrder: 6,
            description: 'Brain and nervous system specialists'
        },
        {
            id: 7,
            categoryKey: 'orthopedics',
            title: 'Orthopedist',
            subtitle: 'Find Best Orthopedist In Rangpur',
            iconClass: 'fas fa-bone',
            iconColor: '#795548',
            searchTerms: ['orthopedics', 'orthopedist', 'bone', 'orthoped'],
            status: 'active',
            sortOrder: 7,
            description: 'Bone and joint specialists'
        },
        {
            id: 8,
            categoryKey: 'gynecology',
            title: 'Gynecologist',
            subtitle: 'Find Best Gynecologist In Rangpur',
            iconClass: 'fas fa-female',
            iconColor: '#E91E63',
            searchTerms: ['gynecology', 'gynecologist', 'women', 'gynecol'],
            status: 'active',
            sortOrder: 8,
            description: 'Women health specialists'
        },
        {
            id: 9,
            categoryKey: 'dermatology',
            title: 'Dermatologist',
            subtitle: 'Find Best Dermatologist In Rangpur',
            iconClass: 'fas fa-hand-paper',
            iconColor: '#FFC107',
            searchTerms: ['dermatology', 'dermatologist', 'skin'],
            status: 'active',
            sortOrder: 9,
            description: 'Skin and hair specialists'
        },
        {
            id: 10,
            categoryKey: 'ophthalmology',
            title: 'Ophthalmologist',
            subtitle: 'Find Best Ophthalmologist In Rangpur',
            iconClass: 'fas fa-eye',
            iconColor: '#00BCD4',
            searchTerms: ['ophthalmology', 'ophthalmologist', 'eye'],
            status: 'active',
            sortOrder: 10,
            description: 'Eye care specialists'
        },
        {
            id: 11,
            categoryKey: 'ent',
            title: 'ENT Specialist',
            subtitle: 'Find Best ENT Specialist In Rangpur',
            iconClass: 'fas fa-head-side-virus',
            iconColor: '#673AB7',
            searchTerms: ['ent', 'ear', 'nose', 'throat'],
            status: 'active',
            sortOrder: 11,
            description: 'Ear, Nose, and Throat specialists'
        },
        {
            id: 12,
            categoryKey: 'urology',
            title: 'Urologist',
            subtitle: 'Find Best Urologist In Rangpur',
            iconClass: 'fas fa-kidneys',
            iconColor: '#607D8B',
            searchTerms: ['urology', 'urologist', 'kidney'],
            status: 'active',
            sortOrder: 12,
            description: 'Urinary system specialists'
        },
        {
            id: 13,
            categoryKey: 'psychiatry',
            title: 'Psychiatrist',
            subtitle: 'Find Best Psychiatrist In Rangpur',
            iconClass: 'fas fa-user-md',
            iconColor: '#9E9E9E',
            searchTerms: ['psychiatry', 'psychiatrist', 'mental'],
            status: 'active',
            sortOrder: 13,
            description: 'Mental health specialists'
        },
        {
            id: 14,
            categoryKey: 'gastroenterology',
            title: 'Gastroenterologist',
            subtitle: 'Find Best Gastroenterologist In Rangpur',
            iconColor: '#8BC34A',
            iconClass: 'fas fa-stomach',
            searchTerms: ['gastroenterology', 'gastroenterologist', 'stomach'],
            status: 'active',
            sortOrder: 14,
            description: 'Digestive system specialists'
        },
        {
            id: 15,
            categoryKey: 'endocrinology',
            title: 'Endocrinologist',
            subtitle: 'Find Best Endocrinologist In Rangpur',
            iconClass: 'fas fa-dna',
            iconColor: '#FFEB3B',
            searchTerms: ['endocrinology', 'endocrinologist', 'hormone'],
            status: 'active',
            sortOrder: 15,
            description: 'Hormone and diabetes specialists'
        },
        {
            id: 16,
            categoryKey: 'rheumatology',
            title: 'Rheumatologist',
            subtitle: 'Find Best Rheumatologist In Rangpur',
            iconClass: 'fas fa-hand-holding-medical',
            iconColor: '#FF9800',
            searchTerms: ['rheumatology', 'rheumatologist', 'arthritis'],
            status: 'active',
            sortOrder: 16,
            description: 'Arthritis and joint disease specialists'
        },
        {
            id: 17,
            categoryKey: 'nephrology',
            title: 'Nephrologist',
            subtitle: 'Find Best Nephrologist In Rangpur',
            iconClass: 'fas fa-kidneys',
            iconColor: '#3F51B5',
            searchTerms: ['nephrology', 'nephrologist', 'kidney'],
            status: 'active',
            sortOrder: 17,
            description: 'Kidney disease specialists'
        },
        {
            id: 18,
            categoryKey: 'hematology',
            title: 'Hematologist',
            subtitle: 'Find Best Hematologist In Rangpur',
            iconClass: 'fas fa-tint',
            iconColor: '#F44336',
            searchTerms: ['hematology', 'hematologist', 'blood'],
            status: 'active',
            sortOrder: 18,
            description: 'Blood disorder specialists'
        },
        {
            id: 19,
            categoryKey: 'infectious-disease',
            title: 'Infectious Disease Specialist',
            subtitle: 'Find Best Infectious Disease Specialist In Rangpur',
            iconClass: 'fas fa-virus',
            iconColor: '#795548',
            searchTerms: ['infectious', 'infection', 'virus'],
            status: 'active',
            sortOrder: 19,
            description: 'Infectious disease specialists'
        },
        {
            id: 20,
            categoryKey: 'plastic-surgery',
            title: 'Plastic Surgeon',
            subtitle: 'Find Best Plastic Surgeon In Rangpur',
            iconClass: 'fas fa-scalpel-path',
            iconColor: '#E91E63',
            searchTerms: ['plastic', 'surgery', 'cosmetic'],
            status: 'active',
            sortOrder: 20,
            description: 'Plastic and reconstructive surgery specialists'
        },
        {
            id: 21,
            categoryKey: 'anesthesiology',
            title: 'Anesthesiologist',
            subtitle: 'Find Best Anesthesiologist In Rangpur',
            iconClass: 'fas fa-syringe',
            iconColor: '#607D8B',
            searchTerms: ['anesthesiology', 'anesthesiologist', 'anesthesia'],
            status: 'active',
            sortOrder: 21,
            description: 'Anesthesia and pain management specialists'
        },
        {
            id: 22,
            categoryKey: 'surgery',
            title: 'Surgeon',
            subtitle: 'Find Best Surgeon In Rangpur',
            iconClass: 'fas fa-user-md',
            iconColor: '#9C27B0',
            searchTerms: ['surgery', 'surgeon', 'operation'],
            status: 'active',
            sortOrder: 22,
            description: 'Surgery specialists'
        },
        {
            id: 23,
            categoryKey: 'pathology',
            title: 'Pathologist',
            subtitle: 'Find Best Pathologist In Rangpur',
            iconClass: 'fas fa-microscope',
            iconColor: '#FF5722',
            searchTerms: ['pathology', 'pathologist', 'lab'],
            status: 'active',
            sortOrder: 23,
            description: 'Disease diagnosis specialists'
        },
        {
            id: 24,
            categoryKey: 'emergency-medicine',
            title: 'Emergency Medicine Doctor',
            subtitle: 'Find Best Emergency Doctor In Rangpur',
            iconClass: 'fas fa-ambulance',
            iconColor: '#F44336',
            searchTerms: ['emergency', 'urgent', 'trauma'],
            status: 'active',
            sortOrder: 24,
            description: 'Emergency care specialists'
        }
    ],
    activities: [
        {
            id: 1,
            type: 'doctor_added',
            message: 'New doctor Dr. Sarah Johnson added',
            time: '2 hours ago',
            icon: 'fas fa-user-md',
            color: '#667eea'
        },
        {
            id: 2,
            type: 'appointment_booked',
            message: 'New appointment booked by John Doe',
            time: '4 hours ago',
            icon: 'fas fa-calendar-check',
            color: '#4facfe'
        },
        {
            id: 3,
            type: 'emergency_request',
            message: 'Emergency ambulance request received',
            time: '6 hours ago',
            icon: 'fas fa-ambulance',
            color: '#43e97b'
        },
        {
            id: 4,
            type: 'blood_request',
            message: 'Urgent blood request for O+ blood type',
            time: '1 day ago',
            icon: 'fas fa-tint',
            color: '#f093fb'
        },
        {
            id: 5,
            type: 'user_registered',
            message: 'New user Jane Smith registered',
            time: '2 days ago',
            icon: 'fas fa-user-plus',
            color: '#ffeaa7'
        }
    ],
    // Initialize bannerImages object
    bannerImages: {
        'home-hero-slider': [],
        'sponsor-banner': [],
        'blood-hero-slider': [],
        'donor-hero-image': [],
        'ambulance-hero-slider': [],
        'private-hospital-hero-slider': [],
        'pharmacy-promotional-image': []
    },
    redeemRequests: [],
    prescriptions: [
        // Sample prescription data - in real app this would be linked to completed appointments
        {
            id: 1,
            appointmentId: 3, // Links to completed appointment
            bookingId: 'MQ2024003',
            patientName: 'Ahmed Hassan',
            doctorName: 'Dr. Mizanur Rahman',
            doctorSpecialty: 'ENT',
            appointmentDate: '2024-02-17',
            appointmentTime: '11:30 AM',
            prescriptionUrl: 'https://example.com/prescriptions/prescription_001.jpg',
            notes: 'Antibiotic course for sinus infection',
            addedDate: '2024-02-17',
            addedBy: 'admin'
        }
    ]
};

// Global variables
let currentSection = 'dashboard';
let currentEmergencyTab = 'ambulance';
let currentBannerTab = 'home-hero-slider'; // Initialize current banner tab
let bannerImageIdCounter = 0;

// Modal management functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');

        // Reset any form inside the modal
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }

        // Reset global variables
        if (modalId.includes('prescription')) {
            currentPrescriptionId = null;
        }
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard initializing...');

    // Setup navigation
    setupNavigation();

    // Load initial dashboard data
    loadDashboardStats();
    loadRecentActivity();
    loadAllSections();

    // Setup modal functionality
    setupModals();

    // Initialize AdminSettings if available
    if (typeof AdminSettings !== 'undefined') {
        AdminSettings.init();
    }

    console.log('Admin dashboard initialized successfully');
});

// Navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const section = this.getAttribute('data-section');
            switchSection(section);

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Switch between sections
function switchSection(section) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(section + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = section;

        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ');
        }

        // Load section-specific data
        loadSectionData(section);
    }
}

// Load section-specific data
function loadSectionData(section) {
    switch(section) {
        case 'doctors':
            loadDoctorsTable();
            break;
        case 'appointments':
            loadAppointmentsTable();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'emergency':
            loadEmergencyTabs();
            break;
        case 'blood-donors':
            loadBloodDonorsTable();
            break;
        case 'hospitals':
            loadHospitalsTable();
            break;
        case 'pharmacies':
            loadPharmaciesTable();
            break;
        case 'medicine-requests':
            loadMedicineRequestsTable();
            break;
        case 'drivers':
            loadDriversTable();
            break;
        case 'specialist-categories':
            loadSpecialistCategoriesTable();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'settings': // New case for settings
            loadSettingsSection(); // Load the settings section
            break;
        case 'banner-images': // New case for banner images
            setupBannerImageTabs(); // Setup tabs for banner images
            loadBannerImagesSection(); // Load the initial banner images
            break;
        case 'sponsor': // Sponsor content management
            loadSponsorContent(); // Load sponsor content data
            break;
        case 'prescriptions':
            loadPrescriptionsSection();
            break;
        case 'redeem-requests':
            loadRedeemRequestsTable();
            break;
        case 'contact-messages':
            loadContactMessagesTable();
            break;
        case 'contact-info':
            loadContactInfoTable('phone');
            break;
        case 'terms-conditions':
            loadTermsConditionsTable();
            break;
        case 'privacy-policy':
            loadPrivacyPolicyTable();
            break;
        case 'weekly-booking':
            loadWeeklyBookingSection();
            break;
        case 'bkash':
            loadBkashSection();
            break;
        case 'bkash-send-money':
            loadBkashSendMoneySection();
            break;
        case 'starting-ads':
            initializeStartingAdsSection();
            break;
    }
}

// Load all sections initially
function loadAllSections() {
    loadDoctorsTable();
    loadAppointmentsTable();
    loadUsersTable();
    loadEmergencyTabs();
    loadBloodDonorsTable();
    loadHospitalsTable();
    loadPharmaciesTable();
    loadMedicineRequestsTable();
    loadDriversTable();
    loadSpecialistCategoriesTable(); // Load specialist categories
    loadPrescriptionsSection(); // Load prescriptions section
    // Weekly booking section will be loaded when its tab is clicked
    // Banner images section will be loaded when its tab is clicked or the section is navigated to.
}

// Refresh all data
function refreshAllData() {
    const refreshBtn = document.querySelector('.refresh-btn i');
    if (refreshBtn) {
        refreshBtn.style.animation = 'spin 0.5s linear';
        setTimeout(() => {
            refreshBtn.style.animation = '';
        }, 500);
    }
    
    loadAllSections();
    showNotification('Data refreshed successfully', 'success');
}

// Force user cache refresh globally
async function forceUserCacheRefresh() {
    const btn = document.querySelector('.force-cache-btn i');
    if (btn) {
        btn.style.animation = 'spin 0.5s linear';
    }
    
    try {
        const { data: currentVersion, error: fetchError } = await supabase
            .from('cache_version')
            .select('version')
            .eq('id', 1)
            .single();
        
        if (fetchError) {
            console.error('Error fetching cache version:', fetchError);
            showNotification('Failed to fetch current cache version', 'error');
            return;
        }
        
        const newVersion = (currentVersion?.version || 1) + 1;
        
        const { error: updateError } = await supabase
            .from('cache_version')
            .update({
                version: newVersion,
                updated_at: new Date().toISOString(),
                updated_by: 'admin'
            })
            .eq('id', 1);
        
        if (updateError) {
            console.error('Error updating cache version:', updateError);
            showNotification('Failed to update cache version', 'error');
        } else {
            console.log(`✅ Cache version updated from ${currentVersion.version} to ${newVersion}`);
            showNotification(
                `Cache version updated to v${newVersion}. All users will refresh their cache on next app launch.`,
                'success'
            );
        }
    } catch (error) {
        console.error('Error in forceUserCacheRefresh:', error);
        showNotification('An error occurred while updating cache version', 'error');
    } finally {
        setTimeout(() => {
            if (btn) btn.style.animation = '';
        }, 500);
    }
}

// Prescription Management Functions
let currentPrescriptionTab = 'pending';
let currentPrescriptionId = null;

// Weekly Booking Variables
let currentWeekStart = new Date();
let selectedDate = null;
let selectedDoctor = null;

function loadPrescriptionsSection() {
    loadPendingPrescriptions();
    loadCompletedPrescriptions();
}

function switchPrescriptionTab(tab) {
    // Hide all prescription tab contents
    const tabContents = document.querySelectorAll('.prescription-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.prescription-tabs .tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab content
    const selectedTabContent = document.getElementById(tab + '-prescriptions-tab');
    if (selectedTabContent) {
        selectedTabContent.classList.add('active');
    }

    // Add active class to selected tab button
    const selectedTabButton = document.querySelector(`.prescription-tabs .tab-btn[onclick="switchPrescriptionTab('${tab}')"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }

    currentPrescriptionTab = tab;
    console.log('Switched to prescription tab:', tab);
}

function loadPendingPrescriptions() {
    const tableBody = document.getElementById('pending-prescriptions-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        // Get completed appointments that don't have prescriptions
        const completedAppointments = adminData.appointments.filter(apt => apt.status === 'completed');
        const pendingPrescriptions = completedAppointments.filter(apt => !apt.prescription_url && !apt.prescriptionUrl);

        if (pendingPrescriptions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No completed appointments pending prescription</td></tr>';
            return;
        }

        pendingPrescriptions.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${appointment.booking_id || appointment.bookingId}</strong></td>
                <td>${appointment.patient_name || appointment.patientName}</td>
                <td>${appointment.doctor_name || appointment.doctorName}<br><small>${appointment.doctor_specialty || appointment.doctorSpecialty}</small></td>
                <td>${formatDate(appointment.date)}<br><small>${appointment.time}</small></td>
                <td>${appointment.patient_contact || appointment.patientContact}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn approve" onclick="showAddPrescriptionModal(${appointment.id})">Add Prescription</button>
                        <button class="action-btn view" onclick="viewAppointmentDetails(${appointment.id})">View Details</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading pending prescriptions');
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading pending prescriptions</td></tr>';
    }
}

function loadCompletedPrescriptions() {
    const tableBody = document.getElementById('completed-prescriptions-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        // Get completed appointments that have prescriptions
        const completedPrescriptions = adminData.appointments.filter(apt => 
            apt.status === 'completed' && (apt.prescription_url || apt.prescriptionUrl)
        );

        if (completedPrescriptions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No prescriptions added yet</td></tr>';
            return;
        }

        completedPrescriptions.forEach(appointment => {
            const prescriptionUrl = appointment.prescription_url || appointment.prescriptionUrl;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${appointment.booking_id || appointment.bookingId}</strong></td>
                <td>${appointment.patient_name || appointment.patientName}</td>
                <td>${appointment.doctor_name || appointment.doctorName}<br><small>${appointment.doctor_specialty || appointment.doctorSpecialty}</small></td>
                <td>${formatDate(appointment.date)}<br><small>${appointment.time}</small></td>
                <td class="prescription-url-cell">
                    <a href="${prescriptionUrl}" target="_blank" rel="noopener">
                        ${prescriptionUrl.length > 30 ? prescriptionUrl.substring(0, 30) + '...' : prescriptionUrl}
                    </a>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="showEditPrescriptionModal(${appointment.id})">Edit</button>
                        <button class="action-btn delete" onclick="deletePrescription(${appointment.id})">Delete</button>
                        <button class="action-btn view" onclick="viewPrescription(${appointment.id})">View</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading completed prescriptions');
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading completed prescriptions</td></tr>';
    }
}

function showAddPrescriptionModal(appointmentId) {
    const appointment = adminData.appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }

    currentPrescriptionId = appointmentId;

    // Populate appointment details
    const detailsContainer = document.getElementById('prescription-appointment-details');
    detailsContainer.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">${appointment.booking_id || appointment.bookingId}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Patient:</span>
            <span class="detail-value">${appointment.patient_name || appointment.patientName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Doctor:</span>
            <span class="detail-value">${appointment.doctor_name || appointment.doctorName} (${appointment.doctor_specialty || appointment.doctorSpecialty})</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span class="detail-value">${formatDate(appointment.date)} at ${appointment.time}</span>
        </div>
    `;

    // Clear form
    document.getElementById('add-prescription-form').reset();

    // Show modal
    document.getElementById('add-prescription-modal').classList.add('show');
}

function showEditPrescriptionModal(appointmentId) {
    const appointment = adminData.appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }

    currentPrescriptionId = appointmentId;

    // Populate appointment details
    const detailsContainer = document.getElementById('edit-prescription-appointment-details');
    detailsContainer.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">${appointment.booking_id || appointment.bookingId}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Patient:</span>
            <span class="detail-value">${appointment.patient_name || appointment.patientName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Doctor:</span>
            <span class="detail-value">${appointment.doctor_name || appointment.doctorName} (${appointment.doctor_specialty || appointment.doctorSpecialty})</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span class="detail-value">${formatDate(appointment.date)} at ${appointment.time}</span>
        </div>
    `;

    // Populate form with existing data
    document.getElementById('edit-prescription-image-url').value = appointment.prescription_url || appointment.prescriptionUrl || '';
    document.getElementById('edit-prescription-notes').value = appointment.prescription_notes || appointment.notes || '';

    // Show modal
    document.getElementById('edit-prescription-modal').classList.add('show');
}

function handleAddPrescription(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const appointment = adminData.appointments.find(apt => apt.id === currentPrescriptionId);

    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }

    // Create new prescription
    const newPrescription = {
        id: adminData.prescriptions.length + 1,
        appointmentId: appointment.id,
        bookingId: appointment.bookingId,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        doctorSpecialty: appointment.doctorSpecialty,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        prescriptionUrl: formData.get('prescriptionUrl'),
        notes: formData.get('notes'),
        addedDate: new Date().toISOString().split('T')[0],
        addedBy: 'admin'
    };

    // Add to prescriptions array
    adminData.prescriptions.push(newPrescription);
    
    // Send notification to user about prescription upload
    if (appointment.user_id) {
        (async () => {
            try {
                const notificationData = {
                    user_id: appointment.user_id,
                    type: 'appointment',
                    title: 'Prescription Available',
                    message: `Your prescription from Dr. ${appointment.doctorName} is now available for download. Visit your appointment history to view it.`,
                    is_read: false,
                    request_id: appointment.booking_id || appointment.bookingId || `${appointment.id}`,
                    request_type: 'prescription'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Prescription upload notification sent to user:', appointment.user_id);
            } catch (notifError) {
                console.error('Error sending prescription notification:', notifError);
            }
        })();
    }

    // Reload both tables
    loadPendingPrescriptions();
    loadCompletedPrescriptions();

    // Close modal and reset form
    closeModal('add-prescription-modal');
    event.target.reset();
    currentPrescriptionId = null;

    showNotification('Prescription added successfully!', 'success');
    console.log('Added prescription:', newPrescription);
}

function handleEditPrescription(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const prescriptionIndex = adminData.prescriptions.findIndex(p => p.id === currentPrescriptionId);

    if (prescriptionIndex === -1) {
        showNotification('Prescription not found', 'error');
        return;
    }

    // Update prescription
    adminData.prescriptions[prescriptionIndex].prescriptionUrl = formData.get('prescriptionUrl');
    adminData.prescriptions[prescriptionIndex].notes = formData.get('notes');
    adminData.prescriptions[prescriptionIndex].updatedDate = new Date().toISOString().split('T')[0];

    // Reload completed prescriptions table
    loadCompletedPrescriptions();

    // Close modal and reset form
    closeModal('edit-prescription-modal');
    event.target.reset();
    currentPrescriptionId = null;

    showNotification('Prescription updated successfully!', 'success');
}

function deletePrescription(prescriptionId) {
    if (confirm('Are you sure you want to delete this prescription?')) {
        const prescriptionIndex = adminData.prescriptions.findIndex(p => p.id === prescriptionId);

        if (prescriptionIndex !== -1) {
            const prescription = adminData.prescriptions[prescriptionIndex];
            adminData.prescriptions.splice(prescriptionIndex, 1);

            // Reload both tables
            loadPendingPrescriptions();
            loadCompletedPrescriptions();

            showNotification('Prescription deleted successfully!', 'success');
            console.log('Deleted prescription:', prescription);
        } else {
            showNotification('Prescription not found', 'error');
        }
    }
}

function viewPrescription(prescriptionId) {
    const prescription = adminData.prescriptions.find(p => p.id === prescriptionId);
    if (!prescription) {
        showNotification('Prescription not found', 'error');
        return;
    }

    // Open prescription URL in new tab
    window.open(prescription.prescriptionUrl, '_blank', 'noopener,noreferrer');
}

// Weekly Booking System Functions
function loadWeeklyBookingSection() {
    console.log('Loading weekly booking section');
    
    // Set current week to start of this week (Monday)
    currentWeekStart = getStartOfWeek(new Date());
    selectedDate = null;
    selectedDoctor = null;
    
    // Initialize the week view
    generateWeekDays();
    updateWeekDisplay();
    loadBookingOverview();
    showAllDoctorsView();
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}

function generateWeekDays() {
    const weekDaysBar = document.getElementById('week-days-bar');
    if (!weekDaysBar) return;
    
    weekDaysBar.innerHTML = '';
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        
        const dayButton = document.createElement('div');
        dayButton.className = 'day-button';
        dayButton.setAttribute('data-date', getLocalDateString(date));
        
        // Check if this is today
        const isToday = date.getTime() === today.getTime();
        if (isToday) {
            dayButton.classList.add('today');
        }
        
        // Get appointment count for this date
        const appointmentCount = getAppointmentCountForDate(date);
        
        dayButton.innerHTML = `
            <span class="day-name">${days[i]}</span>
            <span class="day-date">${date.getDate()}</span>
            <span class="day-count">${appointmentCount} appointments</span>
        `;
        
        dayButton.addEventListener('click', function() {
            selectDate(date, dayButton);
        });
        
        weekDaysBar.appendChild(dayButton);
    }
}

function getAppointmentCountForDate(date) {
    const dateString = getLocalDateString(date);
    return adminData.appointments.filter(apt => apt.date === dateString).length;
}

function selectDate(date, buttonElement) {
    // Remove previous selection
    document.querySelectorAll('.day-button').forEach(btn => btn.classList.remove('selected'));
    
    // Add selection to clicked button
    buttonElement.classList.add('selected');
    
    selectedDate = date;
    selectedDoctor = null;
    
    // Show selected date header
    const selectedDateHeader = document.getElementById('selected-date-header');
    const selectedDateTitle = document.getElementById('selected-date-title');
    
    if (selectedDateHeader && selectedDateTitle) {
        selectedDateTitle.textContent = `Appointments for ${formatDateForDisplay(date)}`;
        selectedDateHeader.style.display = 'flex';
    }
    
    // Hide doctor detail view if open
    const doctorDetail = document.getElementById('doctor-appointments-detail');
    if (doctorDetail) {
        doctorDetail.style.display = 'none';
    }
    
    // Show doctors list for selected date
    showDoctorsForSelectedDate();
    
    console.log('Selected date:', formatDateForDisplay(date));
}

function showDoctorsForSelectedDate() {
    if (!selectedDate) return;
    
    const doctorsListContainer = document.getElementById('doctors-booking-list');
    if (!doctorsListContainer) return;
    
    const dateString = getLocalDateString(selectedDate);
    
    // Get appointments for selected date
    const appointmentsForDate = adminData.appointments.filter(apt => apt.date === dateString);
    
    // Group appointments by doctor
    const doctorAppointments = {};
    appointmentsForDate.forEach(apt => {
        // Support both snake_case (Supabase) and camelCase (demo data)
        const doctorName = apt.doctor_name || apt.doctorName;
        if (!doctorName) return;
        
        if (!doctorAppointments[doctorName]) {
            doctorAppointments[doctorName] = {
                doctor: adminData.doctors.find(d => d.name === doctorName),
                appointments: []
            };
        }
        doctorAppointments[doctorName].appointments.push(apt);
    });
    
    // Generate HTML for doctors list
    let htmlContent = '';
    
    if (Object.keys(doctorAppointments).length === 0) {
        htmlContent = `
            <div class="empty-state-message">
                <i class="fas fa-calendar-times"></i>
                <h3>No Appointments</h3>
                <p>No appointments scheduled for ${formatDateForDisplay(selectedDate)}</p>
            </div>
        `;
    } else {
        Object.entries(doctorAppointments).forEach(([doctorName, data]) => {
            const doctor = data.doctor || { name: doctorName, specialty: 'Unknown', image: 'https://via.placeholder.com/50' };
            const appointments = data.appointments;
            
            const pending = appointments.filter(apt => apt.status === 'pending').length;
            const approved = appointments.filter(apt => apt.status === 'approved').length;
            const completed = appointments.filter(apt => apt.status === 'completed').length;
            const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;
            
            htmlContent += `
                <div class="doctor-booking-card" onclick="showDoctorAppointments('${doctorName}')">
                    <div class="doctor-booking-info">
                        <img src="${doctor.image}" alt="${doctor.name}" class="doctor-booking-avatar">
                        <div class="doctor-booking-details">
                            <h4>${doctor.name}</h4>
                            <p>${doctor.specialty}</p>
                        </div>
                    </div>
                    <div class="doctor-booking-stats">
                        <div class="stat-item">
                            <span class="stat-number">${appointments.length}</span>
                            <span class="stat-label">Total</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${pending}</span>
                            <span class="stat-label">Pending</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${approved}</span>
                            <span class="stat-label">Approved</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${completed}</span>
                            <span class="stat-label">Completed</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    doctorsListContainer.innerHTML = htmlContent;
}

function showDoctorAppointments(doctorName) {
    selectedDoctor = doctorName;
    
    // Get appointments for selected doctor
    // Support both snake_case (Supabase) and camelCase (demo data)
    let appointments;
    
    if (selectedDate) {
        // Filter by doctor and date if a date is selected
        const dateString = getLocalDateString(selectedDate);
        appointments = adminData.appointments.filter(apt => 
            (apt.doctor_name || apt.doctorName) === doctorName && apt.date === dateString
        );
    } else {
        // Show all appointments for the doctor if no date is selected
        appointments = adminData.appointments.filter(apt => 
            (apt.doctor_name || apt.doctorName) === doctorName
        );
    }
    
    // Update detail title
    const doctorDetailTitle = document.getElementById('doctor-detail-title');
    if (doctorDetailTitle) {
        if (selectedDate) {
            doctorDetailTitle.textContent = `${doctorName} - ${formatDateForDisplay(selectedDate)} (${appointments.length} appointments)`;
        } else {
            doctorDetailTitle.textContent = `${doctorName} - All Appointments (${appointments.length} total)`;
        }
    }
    
    // Generate appointments list HTML
    const appointmentsDetailList = document.getElementById('appointments-detail-list');
    if (!appointmentsDetailList) return;
    
    let htmlContent = '';
    
    if (appointments.length === 0) {
        const message = selectedDate 
            ? `No appointments found for ${doctorName} on ${formatDateForDisplay(selectedDate)}`
            : `No appointments found for ${doctorName}`;
        htmlContent = `
            <div class="empty-state-message">
                <i class="fas fa-calendar-times"></i>
                <h3>No Appointments</h3>
                <p>${message}</p>
            </div>
        `;
    } else {
        appointments.forEach(apt => {
            const statusClass = apt.status.toLowerCase();
            // Support both snake_case (Supabase) and camelCase (demo data)
            const bookingId = apt.booking_id || apt.bookingId;
            const patientName = apt.patient_name || apt.patientName;
            const patientContact = apt.patient_contact || apt.patientContact;
            const patientGender = apt.patient_gender || apt.patientGender;
            const patientAge = apt.patient_age || apt.patientAge;
            const patientAddress = apt.patient_address || apt.patientAddress;
            
            htmlContent += `
                <div class="appointment-detail-card">
                    <div class="appointment-detail-header">
                        <span class="appointment-booking-id">${bookingId}</span>
                        <span class="appointment-time">${apt.time}</span>
                    </div>
                    <div class="appointment-patient-info">
                        <h4 class="patient-name">${patientName}</h4>
                        <p class="patient-contact">${patientContact || 'Contact not available'}</p>
                    </div>
                    <div class="appointment-details">
                        <p><strong>Gender:</strong> ${patientGender || 'Not specified'}</p>
                        <p><strong>Age:</strong> ${patientAge || 'Not specified'}</p>
                        <p><strong>Address:</strong> ${patientAddress || 'Not provided'}</p>
                        <span class="appointment-status-badge status-badge ${statusClass}">${apt.status}</span>
                    </div>
                </div>
            `;
        });
    }
    
    appointmentsDetailList.innerHTML = htmlContent;
    
    // Hide doctors list and show doctor detail
    document.getElementById('doctors-booking-list').style.display = 'none';
    document.getElementById('doctor-appointments-detail').style.display = 'block';
    
    const dateInfo = selectedDate ? `on ${formatDateForDisplay(selectedDate)}` : '(all dates)';
    console.log(`Showing ${appointments.length} appointments for ${doctorName} ${dateInfo}`);
}

function showAllDoctorsView() {
    selectedDoctor = null;
    
    // Hide doctor detail view
    const doctorDetail = document.getElementById('doctor-appointments-detail');
    if (doctorDetail) {
        doctorDetail.style.display = 'none';
    }
    
    // Show doctors list
    const doctorsList = document.getElementById('doctors-booking-list');
    if (doctorsList) {
        doctorsList.style.display = 'block';
    }
    
    // If a date is selected, show doctors for that date, otherwise show all doctors
    if (selectedDate) {
        showDoctorsForSelectedDate();
    } else {
        loadDefaultDoctorsView();
    }
}

function loadDefaultDoctorsView() {
    const doctorsListContainer = document.getElementById('doctors-booking-list');
    if (!doctorsListContainer) return;
    
    // Show all doctors with their total appointment counts
    let htmlContent = '';
    
    adminData.doctors.forEach(doctor => {
        // Support both snake_case (Supabase) and camelCase (demo data)
        const totalAppointments = adminData.appointments.filter(apt => (apt.doctor_name || apt.doctorName) === doctor.name).length;
        const pending = adminData.appointments.filter(apt => (apt.doctor_name || apt.doctorName) === doctor.name && apt.status === 'pending').length;
        const approved = adminData.appointments.filter(apt => (apt.doctor_name || apt.doctorName) === doctor.name && apt.status === 'approved').length;
        const completed = adminData.appointments.filter(apt => (apt.doctor_name || apt.doctorName) === doctor.name && apt.status === 'completed').length;
        
        htmlContent += `
            <div class="doctor-booking-card" onclick="showDoctorAppointments('${doctor.name}')">
                <div class="doctor-booking-info">
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-booking-avatar">
                    <div class="doctor-booking-details">
                        <h4>${doctor.name}</h4>
                        <p>${doctor.specialty}</p>
                    </div>
                </div>
                <div class="doctor-booking-stats">
                    <div class="stat-item">
                        <span class="stat-number">${totalAppointments}</span>
                        <span class="stat-label">Total</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${pending}</span>
                        <span class="stat-label">Pending</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${approved}</span>
                        <span class="stat-label">Approved</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${completed}</span>
                        <span class="stat-label">Completed</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    doctorsListContainer.innerHTML = htmlContent;
}

function backToDoctorsList() {
    showAllDoctorsView();
}

function navigateWeek(direction) {
    // Move week by 7 days
    currentWeekStart.setDate(currentWeekStart.getDate() + (direction * 7));
    
    // Reset selections
    selectedDate = null;
    selectedDoctor = null;
    
    // Hide selected date header
    const selectedDateHeader = document.getElementById('selected-date-header');
    if (selectedDateHeader) {
        selectedDateHeader.style.display = 'none';
    }
    
    // Regenerate week display
    generateWeekDays();
    updateWeekDisplay();
    loadBookingOverview();
    loadDefaultDoctorsView();
}

function updateWeekDisplay() {
    const currentWeekDisplay = document.getElementById('current-week-display');
    if (!currentWeekDisplay) return;
    
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(currentWeekStart.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    const startStr = currentWeekStart.toLocaleDateString('en-US', options);
    const endStr = endOfWeek.toLocaleDateString('en-US', options);
    const year = currentWeekStart.getFullYear();
    
    currentWeekDisplay.textContent = `${startStr} - ${endStr}, ${year}`;
}

function loadBookingOverview() {
    // Calculate overview statistics for current week
    const weekStart = new Date(currentWeekStart);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weekStartStr = getLocalDateString(weekStart);
    const weekEndStr = getLocalDateString(weekEnd);
    
    let totalBookings = 0;
    let pendingAppointments = 0;
    let completedAppointments = 0;
    const activeDoctors = new Set();
    
    adminData.appointments.forEach(apt => {
        if (apt.date >= weekStartStr && apt.date <= weekEndStr) {
            totalBookings++;
            if (apt.status === 'pending') pendingAppointments++;
            if (apt.status === 'completed') completedAppointments++;
            // Support both snake_case (Supabase) and camelCase (demo data)
            const doctorName = apt.doctor_name || apt.doctorName;
            if (doctorName) {
                activeDoctors.add(doctorName);
            }
        }
    });
    
    // Update overview cards
    document.getElementById('total-bookings-count').textContent = totalBookings;
    document.getElementById('active-doctors-count').textContent = activeDoctors.size;
    document.getElementById('pending-appointments-count').textContent = pendingAppointments;
    document.getElementById('completed-appointments-count').textContent = completedAppointments;
}

function formatDateForDisplay(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function exportDayData() {
    if (!selectedDate) {
        showNotification('Please select a date first', 'warning');
        return;
    }
    
    const dateString = getLocalDateString(selectedDate);
    const appointments = adminData.appointments.filter(apt => apt.date === dateString);
    
    if (appointments.length === 0) {
        showNotification('No appointments to export for selected date', 'warning');
        return;
    }
    
    // Create CSV content
    const csvHeaders = ['Booking ID', 'Doctor Name', 'Patient Name', 'Time', 'Status', 'Contact', 'Age', 'Gender', 'Address'];
    const csvRows = appointments.map(apt => [
        apt.bookingId,
        apt.doctorName,
        apt.patientName,
        apt.time,
        apt.status,
        apt.patientContact || '',
        apt.patientAge || '',
        apt.patientGender || '',
        apt.patientAddress || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments-${dateString}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification(`Exported ${appointments.length} appointments for ${formatDateForDisplay(selectedDate)}`, 'success');
}

// Make functions globally accessible
window.navigateWeek = navigateWeek;
window.showAllDoctorsView = showAllDoctorsView;
window.backToDoctorsList = backToDoctorsList;
window.exportDayData = exportDayData;
window.showDoctorAppointments = showDoctorAppointments;

// Load the settings section
function loadSettingsSection() {
    // This function might be used to load specific settings components or views
    // For now, we rely on AdminSettings.init() which populates the forms
    console.log('Loading settings section content...');
}

// Dashboard stats
function loadDashboardStats() {
    document.getElementById('total-doctors').textContent = adminData.doctors.length;
    document.getElementById('total-users').textContent = adminData.users.length;
    document.getElementById('total-appointments').textContent = adminData.appointments.length;

    const totalEmergency = adminData.emergencyServices.ambulanceRequests.length +
                          adminData.emergencyServices.bloodRequests.length +
                          adminData.emergencyServices.hospitalRequests.length;
    document.getElementById('total-emergency').textContent = totalEmergency;
    const totalCategoriesElement = document.getElementById('total-categories');
    if (totalCategoriesElement) {
        totalCategoriesElement.textContent = adminData.specialistCategories.length;
    }
    // Update banner images count if element exists
    const totalBannerImagesElement = document.getElementById('total-banner-images');
    if (totalBannerImagesElement) {
        let totalImages = 0;
        for (const category in adminData.bannerImages) {
            totalImages += adminData.bannerImages[category].length;
        }
        totalBannerImagesElement.textContent = totalImages;
    }
    
    // Calculate real revenue: 100 taka per appointment
    const revenuePerAppointment = 100;
    const totalRevenue = adminData.appointments.length * revenuePerAppointment;
    
    // Update revenue in analytics data for consistency
    if (typeof analyticsData !== 'undefined' && analyticsData.sampleData) {
        analyticsData.sampleData.revenue.total = totalRevenue;
    }
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('recent-activity');
    if (!activityList) return;

    activityList.innerHTML = '';

    adminData.activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        activityItem.innerHTML = `
            <div class="activity-icon" style="background-color: ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <h4>${activity.message}</h4>
                <p>${activity.time}</p>
            </div>
        `;

        activityList.appendChild(activityItem);
    });
}

// Load doctors table
async function loadDoctorsTable() {
    const tableBody = document.getElementById('doctors-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        // Check for auto-activation of doctors based on return date
        await autoActivateExpiredInactiveDoctors();
        
        adminData.doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${doctor.image}" alt="${doctor.name}" class="doctor-photo"></td>
                <td><strong>${doctor.name}</strong></td>
                <td>${doctor.specialty}</td>
                <td>${doctor.degree}</td>
                <td>${doctor.workplace}</td>
                <td>${doctor.rating} (${doctor.reviews} reviews)</td>
                <td><span class="status-badge ${doctor.status}">${doctor.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editDoctor(${doctor.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteDoctor(${doctor.id})">Delete</button>
                        <button class="action-btn view" onclick="viewDoctor(${doctor.id})">View</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading doctors table');
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading doctors</td></tr>';
    }
}

// Load appointments table
function loadAppointmentsTable(filteredAppointments = null) {
    const tableBody = document.getElementById('appointments-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const appointmentsToShow = filteredAppointments || adminData.appointments;

    try {
        appointmentsToShow.forEach(appointment => {
            // Handle both camelCase and snake_case for user_id
            const userId = appointment.user_id || appointment.userId || 'N/A';
            const bookingId = appointment.booking_id || appointment.bookingId;
            const patientName = appointment.patient_name || appointment.patientName;
            const doctorName = appointment.doctor_name || appointment.doctorName;
            const doctorSpecialty = appointment.doctor_specialty || appointment.doctorSpecialty;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${userId}</strong></td>
                <td><strong>${bookingId}</strong></td>
                <td>${patientName}</td>
                <td>${doctorName}<br><small>${doctorSpecialty}</small></td>
                <td>${formatDate(appointment.date)}</td>
                <td>${appointment.time}</td>
                <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewAppointmentDetails(${appointment.id})">Details</button>
                        <button class="action-btn approve" onclick="approveAppointment(${appointment.id})">Approve</button>
                        <button class="action-btn complete" onclick="completeAppointment(${appointment.id})">Complete</button>
                        <button class="action-btn edit" onclick="editAppointment(${appointment.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteAppointment(${appointment.id})">Cancel</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading appointments table');
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading appointments</td></tr>';
    }
}

// Load users table
function loadUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${user.avatar ?
                        `<img src="${user.avatar}" alt="${user.name}" class="doctor-photo">` :
                        '<i class="fas fa-user-circle" style="font-size: 40px; color: #64748b;"></i>'
                    }
                </td>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td>${user.district}, ${user.upazila}</td>
                <td><span class="points-badge">${user.points || 0} pts</span></td>
                <td>${formatDate(user.joinDate)}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewUser(${user.id})">View</button>
                        <button class="action-btn edit" onclick="editUser(${user.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteUser(${user.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading users table');
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading users</td></tr>';
    }
}

// Load emergency tabs
function loadEmergencyTabs() {
    loadAmbulanceRequests();
    loadBloodRequests();
    loadHospitalRequests();
}

// Load ambulance requests
function loadAmbulanceRequests() {
    const tableBody = document.getElementById('ambulance-requests-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.emergencyServices.ambulanceRequests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>#${request.id}</strong></td>
                <td>${request.patient_name || 'N/A'}</td>
                <td>${request.contact_number || 'N/A'}</td>
                <td>${request.pickup_location || 'N/A'} → ${request.destination_location || 'N/A'}</td>
                <td>${request.ambulance_type || 'N/A'}</td>
                <td><span class="status-badge ${request.status || 'pending'}">${request.status || 'pending'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn approve" onclick="approveEmergencyRequest('ambulance', ${request.id})">Approve</button>
                        <button class="action-btn view" onclick="viewEmergencyRequest('ambulance', ${request.id})">View</button>
                        <button class="action-btn delete" onclick="deleteEmergencyRequest('ambulance', ${request.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading ambulance requests');
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading ambulance requests</td></tr>';
    }
}

// Load blood requests
function loadBloodRequests() {
    const tableBody = document.getElementById('blood-requests-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.emergencyServices.bloodRequests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>#${request.id}</strong></td>
                <td>${request.patient_name || 'N/A'}</td>
                <td><span style="font-weight: bold; color: #e53e3e;">${request.blood_group || 'N/A'}</span></td>
                <td>${request.units_needed || 0} units</td>
                <td>${request.hospital_name || 'N/A'}</td>
                <td><span class="status-badge ${request.status || 'pending'}">${request.status || 'pending'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn approve" onclick="approveEmergencyRequest('blood', ${request.id})">Approve</button>
                        <button class="action-btn view" onclick="viewEmergencyRequest('blood', ${request.id})">View</button>
                        <button class="action-btn delete" onclick="deleteEmergencyRequest('blood', ${request.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading blood requests');
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading blood requests</td></tr>';
    }
}

// Load hospital requests
function loadHospitalRequests() {
    const tableBody = document.getElementById('hospital-requests-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        const requests = adminData.emergencyServices.hospitalRequests || [];
        
        if (requests.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No hospital booking requests found</td></tr>';
            return;
        }
        
        requests.forEach(request => {
            // Format check-in date and time
            const checkInDate = request.check_in_date ? new Date(request.check_in_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) : 'N/A';
            
            const checkInTime = request.check_in_time || 'N/A';
            const duration = request.duration ? `${request.duration} day${request.duration > 1 ? 's' : ''}` : 'N/A';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${request.request_id || '#' + request.id}</strong></td>
                <td>
                    <div><strong>${request.patient_name}</strong></div>
                    <small>${request.patient_age || 'N/A'} yrs, ${request.patient_gender || 'N/A'}</small><br>
                    <small>📞 ${request.contact}</small>
                </td>
                <td>
                    <div><strong>${request.hospital}</strong></div>
                    <small>Room: ${request.room_name || request.room_type || 'N/A'}</small>
                </td>
                <td>
                    <div>${checkInDate}</div>
                    <small>${checkInTime}</small><br>
                    <small>Duration: ${duration}</small>
                </td>
                <td>
                    <div><strong>৳${request.total_price?.toLocaleString() || 'N/A'}</strong></div>
                    ${request.discount_amount > 0 ? `<small style="color: #22c55e;">Discount: ৳${request.discount_amount.toLocaleString()}</small>` : ''}
                </td>
                <td><span class="status-badge ${request.status}">${request.status}</span></td>
                <td>
                    <div class="action-buttons">
                        ${request.status === 'pending' ? `<button class="action-btn approve" onclick="approveHospitalRequest(${request.id})">Approve</button>` : ''}
                        <button class="action-btn view" onclick="viewHospitalRequest(${request.id})">View</button>
                        <button class="action-btn delete" onclick="deleteHospitalRequest(${request.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading hospital requests');
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading hospital requests</td></tr>';
    }
}

// Load blood donors table
function loadBloodDonorsTable() {
    const tableBody = document.getElementById('donors-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.bloodDonors.forEach(donor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${donor.name}</strong></td>
                <td><span style="font-weight: bold; color: #e53e3e;">${donor.bloodGroup}</span></td>
                <td>${donor.contact}</td>
                <td>${donor.district}, ${donor.upazila}</td>
                <td>${donor.age} yrs, ${donor.gender}</td>
                <td>${formatDate(donor.lastDonation) || 'Never'}</td>
                <td>
                    <span class="status-badge ${donor.approved ? 'approved' : 'pending'}">${donor.approved ? 'Approved' : 'Pending Approval'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editBloodDonor(${donor.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteBloodDonor(${donor.id})">Delete</button>
                        <button class="action-btn view" onclick="viewBloodDonor(${donor.id})">View</button>
                        ${!donor.approved ? `<button class="action-btn approve" onclick="approveDonor(${donor.id})">Approve</button>` : ''}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading blood donors');
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading blood donors</td></tr>';
    }
}

// Load hospitals table
function loadHospitalsTable() {
    const tableBody = document.getElementById('hospitals-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.hospitals.forEach(hospital => {
            const row = document.createElement('tr');

            // Hospital Info Column
            const hospitalInfo = `
                <div class="hospital-info-cell">
                    <strong>${hospital.name}</strong>
                    ${hospital.imageUrl ? `<br><small>Image: Available</small>` : ''}
                </div>
            `;

            // Type & Offers Column
            const typeOffers = `
                <div class="hospital-type-cell">
                    <span class="hospital-type-badge ${hospital.type.toLowerCase()}">${hospital.type}</span>
                    ${hospital.discountPercentage ? `<br><span class="discount-badge">${hospital.discountPercentage}% OFF</span>` : ''}
                    ${hospital.specialOffer ? `<br><small class="special-offer-text">${hospital.specialOffer}</small>` : ''}
                </div>
            `;

            // Location & Contact Column
            const locationContact = `
                <div class="location-contact-cell">
                    <div><i class="fas fa-map-marker-alt"></i> ${hospital.location}</div>
                    <div><i class="fas fa-phone"></i> ${hospital.contact}</div>
                </div>
            `;

            // Rating & Beds Column
            const ratingBeds = `
                <div class="rating-beds-cell">
                    <div class="rating-info">
                        <i class="fas fa-star"></i> ${hospital.rating || 'N/A'}
                        <small>(${hospital.reviewsCount || 0} reviews)</small>
                    </div>
                    <div class="beds-info">
                        <i class="fas fa-bed"></i> ${hospital.availableBeds}/${hospital.totalBeds} beds
                    </div>
                </div>
            `;

            // Facilities Column
            const facilitiesArray = [];
            if (hospital.facilities) {
                if (hospital.facilities.icu?.available) facilitiesArray.push(`ICU (${hospital.facilities.icu.bedCount})`);
                if (hospital.facilities.ccu?.available) facilitiesArray.push(`CCU (${hospital.facilities.ccu.bedCount})`);
                if (hospital.facilities.emergency?.available) facilitiesArray.push(`Emergency (${hospital.facilities.emergency.bedCount})`);
                if (hospital.facilities.operationTheater?.available) facilitiesArray.push('OT');
                if (hospital.facilities.pharmacy?.available) facilitiesArray.push('Pharmacy');
                if (hospital.facilities.laboratory?.available) facilitiesArray.push('Lab');
                if (hospital.facilities.radiology?.available) facilitiesArray.push('Radiology');
            }
            const facilities = `
                <div class="facilities-cell">
                    ${facilitiesArray.length > 0 ? facilitiesArray.join('<br>') : 'Basic facilities'}
                </div>
            `;

            row.innerHTML = `
                <td>${hospitalInfo}</td>
                <td>${typeOffers}</td>
                <td>${locationContact}</td>
                <td>${ratingBeds}</td>
                <td>${facilities}</td>
                <td><span class="status-badge ${hospital.status}">${hospital.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editHospital(${hospital.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteHospital(${hospital.id})">Delete</button>
                        <button class="action-btn view" onclick="viewHospital(${hospital.id})">View</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading hospitals');
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading hospitals</td></tr>';
    }
}

// Load pharmacies table
function loadPharmaciesTable() {
    const tableBody = document.getElementById('pharmacies-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.pharmacies.forEach(pharmacy => {
            const row = document.createElement('tr');

            const pharmacyInfo = `
                <div class="pharmacy-info-cell">
                    <strong>${pharmacy.name}</strong>
                    ${pharmacy.image_url ? `<br><small>Image: Available</small>` : ''}
                </div>
            `;

            const locationContact = `
                <div class="location-contact-cell">
                    <div><i class="fas fa-map-marker-alt"></i> ${pharmacy.location || 'N/A'}</div>
                    <div><i class="fas fa-phone"></i> ${pharmacy.contact}</div>
                </div>
            `;

            const discountOffers = `
                <div class="discount-offers-cell">
                    ${pharmacy.discount_percentage ? `<span class="discount-badge">${pharmacy.discount_percentage}% OFF</span>` : ''}
                    ${pharmacy.discount_tag ? `<br><small>${pharmacy.discount_tag}</small>` : ''}
                    ${pharmacy.offer_badge ? `<br><span class="offer-badge-text">${pharmacy.offer_badge}</span>` : ''}
                </div>
            `;

            row.innerHTML = `
                <td>${pharmacyInfo}</td>
                <td>${locationContact}</td>
                <td>${discountOffers}</td>
                <td><span class="status-badge ${pharmacy.status}">${pharmacy.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editPharmacy(${pharmacy.id})">Edit</button>
                        <button class="action-btn delete" onclick="deletePharmacy(${pharmacy.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading pharmacies');
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">Error loading pharmacies</td></tr>';
    }
}

// Show add pharmacy modal
window.showAddPharmacyModal = function() {
    document.getElementById('add-pharmacy-form').reset();
    showModal('add-pharmacy-modal');
};

// Handle add pharmacy form submission
window.handleAddPharmacy = async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const pharmacy = {
        name: formData.get('name'),
        location: formData.get('location'),
        address: formData.get('address'),
        contact: formData.get('contact'),
        email: formData.get('email') || null,
        open_time: formData.get('openTime') || null,
        image_url: formData.get('imageUrl') || null,
        discount_percentage: parseInt(formData.get('discountPercentage')) || 0,
        discount_text: formData.get('discountText') || null,
        discount_tag: formData.get('discountTag') || null,
        offer_info: formData.get('offerInfo') || null,
        offer_badge: formData.get('offerBadge') || null,
        about: formData.get('about') || null,
        info_section: formData.get('infoSection') || null,
        status: formData.get('status') || 'active'
    };

    try {
        const newPharmacy = await window.dbService.addPharmacy(pharmacy);
        adminData.pharmacies.push(newPharmacy);
        loadPharmaciesTable();
        closeModal('add-pharmacy-modal');
        showNotification('Pharmacy added successfully!', 'success');
    } catch (error) {
        handleError(error, 'Adding pharmacy');
    }
};

// Edit pharmacy
window.editPharmacy = async function(id) {
    try {
        const pharmacy = await window.dbService.getPharmacyById(id);
        if (!pharmacy) {
            showNotification('Pharmacy not found', 'error');
            return;
        }

        document.getElementById('edit-pharmacy-id').value = pharmacy.id;
        document.getElementById('edit-pharmacy-name').value = pharmacy.name;
        document.getElementById('edit-pharmacy-contact').value = pharmacy.contact;
        document.getElementById('edit-pharmacy-email').value = pharmacy.email || '';
        document.getElementById('edit-pharmacy-openTime').value = pharmacy.open_time || '';
        document.getElementById('edit-pharmacy-imageUrl').value = pharmacy.image_url || '';
        document.getElementById('edit-pharmacy-location').value = pharmacy.location || '';
        document.getElementById('edit-pharmacy-address').value = pharmacy.address || '';
        document.getElementById('edit-pharmacy-discountPercentage').value = pharmacy.discount_percentage || 0;
        document.getElementById('edit-pharmacy-discountText').value = pharmacy.discount_text || '';
        document.getElementById('edit-pharmacy-discountTag').value = pharmacy.discount_tag || '';
        document.getElementById('edit-pharmacy-offerInfo').value = pharmacy.offer_info || '';
        document.getElementById('edit-pharmacy-offerBadge').value = pharmacy.offer_badge || '';
        document.getElementById('edit-pharmacy-about').value = pharmacy.about || '';
        document.getElementById('edit-pharmacy-infoSection').value = pharmacy.info_section || '';
        document.getElementById('edit-pharmacy-status').value = pharmacy.status || 'active';

        showModal('edit-pharmacy-modal');
    } catch (error) {
        handleError(error, 'Loading pharmacy');
    }
};

// Handle edit pharmacy form submission
window.handleEditPharmacy = async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const id = parseInt(formData.get('id'));
    const updates = {
        name: formData.get('name'),
        location: formData.get('location'),
        address: formData.get('address'),
        contact: formData.get('contact'),
        email: formData.get('email') || null,
        open_time: formData.get('openTime') || null,
        image_url: formData.get('imageUrl') || null,
        discount_percentage: parseInt(formData.get('discountPercentage')) || 0,
        discount_text: formData.get('discountText') || null,
        discount_tag: formData.get('discountTag') || null,
        offer_info: formData.get('offerInfo') || null,
        offer_badge: formData.get('offerBadge') || null,
        about: formData.get('about') || null,
        info_section: formData.get('infoSection') || null,
        status: formData.get('status') || 'active'
    };

    try {
        await window.dbService.updatePharmacy(id, updates);
        const index = adminData.pharmacies.findIndex(p => p.id === id);
        if (index !== -1) {
            adminData.pharmacies[index] = { ...adminData.pharmacies[index], ...updates };
        }
        loadPharmaciesTable();
        closeModal('edit-pharmacy-modal');
        showNotification('Pharmacy updated successfully!', 'success');
    } catch (error) {
        handleError(error, 'Updating pharmacy');
    }
};

// Delete pharmacy
window.deletePharmacy = async function(id) {
    if (!confirm('Are you sure you want to delete this pharmacy? This action cannot be undone.')) {
        return;
    }

    try {
        await window.dbService.deletePharmacy(id);
        adminData.pharmacies = adminData.pharmacies.filter(p => p.id !== id);
        loadPharmaciesTable();
        showNotification('Pharmacy deleted successfully', 'success');
    } catch (error) {
        handleError(error, 'Deleting pharmacy');
    }
};

// Load medicine requests table
async function loadMedicineRequestsTable() {
    const tableBody = document.getElementById('medicine-requests-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">Loading medicine requests...</td></tr>';

    try {
        const medicineRequests = await window.dbService.getMedicineRequests();
        adminData.medicineRequests = medicineRequests || [];

        if (adminData.medicineRequests.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No medicine requests found</td></tr>';
            return;
        }

        tableBody.innerHTML = '';

        adminData.medicineRequests.forEach(request => {
            const row = document.createElement('tr');

            const requestTime = request.request_time ? formatDateTime(request.request_time) : 'N/A';
            
            const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
            const statusClass = validStatuses.includes(request.status) ? request.status : 'pending';

            row.innerHTML = `
                <td><strong>${escapeHtml(request.request_id)}</strong></td>
                <td>
                    <div><strong>${escapeHtml(request.patient_name)}</strong></div>
                </td>
                <td>
                    <div><i class="fas fa-phone"></i> ${escapeHtml(request.patient_mobile)}</div>
                </td>
                <td>
                    <div>${escapeHtml(request.delivery_address)}</div>
                </td>
                <td>
                    <button class="action-btn view view-prescription-btn" data-prescription-url="${escapeHtml(request.prescription_url)}">
                        <i class="fas fa-image"></i> View
                    </button>
                </td>
                <td>${requestTime}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(statusClass)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn approve approve-medicine-request-btn" data-request-id="${request.id}">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="action-btn view complete-medicine-request-btn" data-request-id="${request.id}">
                            <i class="fas fa-check-double"></i> Complete
                        </button>
                        <button class="action-btn delete cancel-medicine-request-btn" data-request-id="${request.id}">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        setupMedicineRequestsEventListeners();
    } catch (error) {
        handleError(error, 'Loading medicine requests');
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading medicine requests</td></tr>';
    }
}

function setupMedicineRequestsEventListeners() {
    const tableBody = document.getElementById('medicine-requests-table-body');
    if (!tableBody) return;

    tableBody.removeEventListener('click', handleMedicineRequestClick);
    tableBody.addEventListener('click', handleMedicineRequestClick);
}

function handleMedicineRequestClick(e) {
    if (e.target.closest('.view-prescription-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.view-prescription-btn');
        const prescriptionUrl = btn.dataset.prescriptionUrl;
        viewMedicinePrescription(prescriptionUrl);
    } else if (e.target.closest('.approve-medicine-request-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.approve-medicine-request-btn');
        const requestId = parseInt(btn.dataset.requestId);
        updateMedicineRequestStatus(requestId, 'processing');
    } else if (e.target.closest('.complete-medicine-request-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.complete-medicine-request-btn');
        const requestId = parseInt(btn.dataset.requestId);
        updateMedicineRequestStatus(requestId, 'completed');
    } else if (e.target.closest('.cancel-medicine-request-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.cancel-medicine-request-btn');
        const requestId = parseInt(btn.dataset.requestId);
        updateMedicineRequestStatus(requestId, 'cancelled');
    }
}

// Filter medicine requests by status
window.filterMedicineRequestsByStatus = function() {
    const filterSelect = document.getElementById('medicine-request-status-filter');
    const selectedStatus = filterSelect.value;
    const tableBody = document.getElementById('medicine-requests-table-body');
    
    if (!tableBody || !adminData.medicineRequests) return;

    tableBody.innerHTML = '';

    const filteredRequests = selectedStatus 
        ? adminData.medicineRequests.filter(req => req.status === selectedStatus)
        : adminData.medicineRequests;

    if (filteredRequests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No medicine requests found</td></tr>';
        return;
    }

    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        const requestTime = request.request_time ? formatDateTime(request.request_time) : 'N/A';
        
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        const statusClass = validStatuses.includes(request.status) ? request.status : 'pending';

        row.innerHTML = `
            <td><strong>${escapeHtml(request.request_id)}</strong></td>
            <td>
                <div><strong>${escapeHtml(request.patient_name)}</strong></div>
            </td>
            <td>
                <div><i class="fas fa-phone"></i> ${escapeHtml(request.patient_mobile)}</div>
            </td>
            <td>
                <div>${escapeHtml(request.delivery_address)}</div>
            </td>
            <td>
                <button class="action-btn view view-prescription-btn" data-prescription-url="${escapeHtml(request.prescription_url)}">
                    <i class="fas fa-image"></i> View
                </button>
            </td>
            <td>${requestTime}</td>
            <td><span class="status-badge ${statusClass}">${escapeHtml(statusClass)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn approve approve-medicine-request-btn" data-request-id="${request.id}">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn view complete-medicine-request-btn" data-request-id="${request.id}">
                        <i class="fas fa-check-double"></i> Complete
                    </button>
                    <button class="action-btn delete cancel-medicine-request-btn" data-request-id="${request.id}">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    setupMedicineRequestsEventListeners();
};

// View medicine prescription
window.viewMedicinePrescription = function(prescriptionUrl) {
    if (!prescriptionUrl) {
        showNotification('No prescription image available', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'prescription-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%; background: white; border-radius: 8px; padding: 20px;">
            <button onclick="this.closest('.prescription-modal').remove()" style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 18px;">×</button>
            <img src="${prescriptionUrl}" alt="Prescription" style="max-width: 100%; max-height: 80vh; display: block; margin: 0 auto;">
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
};

// Update medicine request status
window.updateMedicineRequestStatus = async function(id, newStatus) {
    if (!newStatus) return;

    try {
        await window.dbService.updateMedicineRequest(id, { 
            status: newStatus
        });

        const index = adminData.medicineRequests.findIndex(req => req.id === id);
        if (index !== -1) {
            adminData.medicineRequests[index].status = newStatus;
            
            // Send notification to user about status change
            const request = adminData.medicineRequests[index];
            if (request.user_id) {
                try {
                    const statusMessages = {
                        'pending': 'Your medicine order is pending review.',
                        'processing': 'Your medicine order is being processed. We will deliver it soon.',
                        'completed': 'Your medicine order has been completed and delivered. Thank you!',
                        'cancelled': 'Your medicine order has been cancelled. Please contact us if you have any questions.'
                    };
                    
                    const notificationData = {
                        user_id: request.user_id,
                        type: 'system',
                        title: `Medicine Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
                        message: statusMessages[newStatus] || `Your medicine order status has been updated to ${newStatus}.`,
                        is_read: false,
                        request_id: request.request_id || `${id}`,
                        request_type: 'medicine'
                    };
                    await window.dbService.addNotification(notificationData);
                    console.log('Medicine status notification sent to user:', request.user_id);
                } catch (notifError) {
                    console.error('Error sending medicine status notification:', notifError);
                }
            }
        }

        loadMedicineRequestsTable();
        showNotification(`Medicine request status updated to ${newStatus}`, 'success');
    } catch (error) {
        handleError(error, 'Updating medicine request status');
    }
};

// Delete medicine request
window.deleteMedicineRequest = async function(id) {
    if (!confirm('Are you sure you want to delete this medicine request? This action cannot be undone.')) {
        return;
    }

    try {
        await window.dbService.deleteMedicineRequest(id);
        adminData.medicineRequests = adminData.medicineRequests.filter(req => req.id !== id);
        loadMedicineRequestsTable();
        showNotification('Medicine request deleted successfully', 'success');
    } catch (error) {
        handleError(error, 'Deleting medicine request');
    }
};

// Load drivers table
function loadDriversTable() {
    const tableBody = document.getElementById('drivers-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.drivers.forEach(driver => {
            const row = document.createElement('tr');

            // Personal Info Cell
            const personalInfo = `
                <div class="driver-personal-cell">
                    ${driver.photo ?
                        `<img src="${driver.photo}" alt="${driver.name}" class="doctor-photo">` :
                        '<i class="fas fa-user-circle" style="font-size: 40px; color: #64748b;"></i>'
                    }
                    <div>
                        <strong>${driver.name}</strong><br>
                        <small>${driver.contact}</small>
                    </div>
                </div>
            `;

            // License & Experience Cell
            const licenseExp = `
                <div class="driver-license-cell">
                    <div><strong>License:</strong> ${driver.license}</div>
                    <div><strong>Experience:</strong> ${driver.experience || 0} years</div>
                    ${driver.licenseExpiry ? `<div><small>Expires: ${formatDate(driver.licenseExpiry)}</small></div>` : ''}
                </div>
            `;

            // Ambulance Info Cell
            const ambulanceInfo = `
                <div class="driver-ambulance-cell">
                    <div><strong>Type:</strong> ${driver.ambulanceType || driver.vehicleType}</div>
                    <div><strong>Reg No:</strong> ${driver.ambulanceRegNo || 'N/A'}</div>
                    ${driver.vehicleModel ? `<div><small>Model: ${driver.vehicleModel}</small></div>` : ''}
                </div>
            `;

            // Location & Address Cell
            const locationInfo = `
                <div class="driver-location-cell">
                    <div><i class="fas fa-map-marker-alt"></i> ${driver.location}</div>
                    ${driver.address ? `<div><small>${driver.address}</small></div>` : ''}
                    <div><small>Service: ${driver.serviceArea || 'Local'}</small></div>
                </div>
            `;

            // Availability Cell
            const availabilityInfo = `
                <div class="driver-availability-cell">
                    <span class="status-badge ${driver.availability || driver.status}">${driver.availability || driver.status}</span>
                    ${driver.workingShift ? `<br><small>${driver.workingShift}</small>` : ''}
                    ${driver.rating ? `<br><small>⭐ ${driver.rating}</small>` : ''}
                </div>
            `;

            row.innerHTML = `
                <td>${personalInfo}</td>
                <td>${licenseExp}</td>
                <td>${ambulanceInfo}</td>
                <td>${locationInfo}</td>
                <td>${availabilityInfo}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editDriver(${driver.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteDriver(${driver.id})">Delete</button>
                        <button class="action-btn view" onclick="viewDriver(${driver.id})">View</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading drivers');
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading drivers</td></tr>';
    }
}

// Load specialist categories table
function loadSpecialistCategoriesTable() {
    const tableBody = document.getElementById('specialist-categories-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        adminData.specialistCategories.forEach(category => {
            const row = document.createElement('tr');

            // Handle icon display - use URL if available, otherwise use FontAwesome
            const iconDisplay = category.iconUrl ?
                `<img src="${category.iconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="${category.title}">` :
                `<i class="${category.iconClass}" style="color: ${category.iconColor}; font-size: 24px;"></i>`;

            row.innerHTML = `
                <td>${iconDisplay}</td>
                <td><strong>${category.title}</strong></td>
                <td>${category.description}</td>
                <td>${category.searchTerms.join(', ')}</td>
                <td><span class="status-badge ${category.status}">${category.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editSpecialistCategory(${category.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteSpecialistCategory(${category.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Loading specialist categories');
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading categories</td></tr>';
    }
}

// Emergency tab switching
function switchEmergencyTab(tab) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    const tabContents = document.querySelectorAll('.emergency-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tab + '-tab').classList.add('active');

    currentEmergencyTab = tab;
}

// Modal functionality
function setupModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        // Check if the clicked element is a modal background
        if (event.target.classList.contains('modal')) {
            // Find the modal ID from the clicked element
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        // Use CSS to control overflow, or set it here if needed
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        // Reset overflow, ensure it's not permanently hidden
        document.body.style.overflow = '';
    }
}

// Make modal functions globally accessible
window.showModal = showModal;
window.closeModal = closeModal;

// Add Doctor Modal
function showAddDoctorModal() {
    showModal('add-doctor-modal');
}

// Handle add doctor form submission
async function handleAddDoctor(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Get visiting days
    const visitingDays = Array.from(formData.getAll('visitingDays'));
    const offDays = Array.from(formData.getAll('offDays'));

    // Get health tips
    const healthTipQuestions = formData.getAll('healthTipQuestion[]');
    const healthTipAnswers = formData.getAll('healthTipAnswer[]');
    const healthTips = [];
    for (let i = 0; i < healthTipQuestions.length; i++) {
        if (healthTipQuestions[i] && healthTipAnswers[i]) {
            healthTips.push({
                question: healthTipQuestions[i],
                answer: healthTipAnswers[i]
            });
        }
    }

    // Get fake reviews
    const reviewerNames = formData.getAll('reviewerName[]');
    const reviewRatings = formData.getAll('reviewRating[]');
    const reviewTexts = formData.getAll('reviewText[]');
    const fakeReviews = [];
    for (let i = 0; i < reviewerNames.length; i++) {
        if (reviewerNames[i] && reviewTexts[i]) {
            fakeReviews.push({
                reviewerName: reviewerNames[i],
                rating: parseInt(reviewRatings[i]),
                reviewText: reviewTexts[i]
            });
        }
    }

    const doctorStatus = formData.get('status');
    const newDoctor = {
        id: adminData.doctors.length + 1,
        name: formData.get('name'),
        specialty: formData.get('specialty'),
        degree: formData.get('degree'),
        workplace: formData.get('workplace'),
        image: formData.get('image') || 'https://via.placeholder.com/80x80',
        status: doctorStatus,
        rating: parseFloat(formData.get('rating')),
        reviews: parseInt(formData.get('reviews')),
        patients: formData.get('patients'),
        experience: formData.get('experience'),
        about: formData.get('about') || 'Professional healthcare provider',
        visitingDays: visitingDays,
        offDays: offDays,
        visitingTime: formData.get('visitingTime') || '',
        chamberAddress: formData.get('chamberAddress') || '',
        bookingSlot: parseInt(formData.get('bookingSlot')) || 2,
        inactiveReason: (doctorStatus === 'inactive' && doctorInactiveData['new']) ? doctorInactiveData['new'].reason : null,
        inactiveDetails: (doctorStatus === 'inactive' && doctorInactiveData['new']) ? doctorInactiveData['new'].details : null,
        returnDate: (doctorStatus === 'inactive' && doctorInactiveData['new']) ? doctorInactiveData['new'].returnDate : null,
        healthTips: healthTips,
        fakeReviews: fakeReviews
    };

    // Add doctor to Supabase if dbService is available
    if (typeof window.dbService !== 'undefined') {
        try {
            const doctorData = {
                name: newDoctor.name,
                specialty: newDoctor.specialty,
                degree: newDoctor.degree,
                workplace: newDoctor.workplace,
                image: newDoctor.image,
                status: newDoctor.status,
                rating: newDoctor.rating,
                reviews: newDoctor.reviews,
                patients: newDoctor.patients,
                experience: newDoctor.experience,
                about: newDoctor.about,
                visiting_days: visitingDays,
                off_days: offDays,
                visiting_time: newDoctor.visitingTime,
                chamber_address: newDoctor.chamberAddress,
                booking_slot: newDoctor.bookingSlot,
                inactive_reason: newDoctor.inactiveReason,
                inactive_details: newDoctor.inactiveDetails,
                return_date: newDoctor.returnDate,
                health_tips: healthTips,
                user_review: fakeReviews
            };
            await window.dbService.addDoctor(doctorData);
            console.log('✅ Doctor added to Supabase');
        } catch (error) {
            console.error('Error adding doctor to Supabase:', error);
            showNotification('Error adding doctor to database: ' + error.message, 'error');
            return;
        }
    }

    adminData.doctors.push(newDoctor);
    
    // Clean up stored inactive data after adding
    if (doctorInactiveData['new']) {
        delete doctorInactiveData['new'];
    }
    
    loadDoctorsTable();
    loadDashboardStats();

    closeModal('add-doctor-modal');
    event.target.reset();
    clearDynamicSections('add');

    showNotification(`Dr. ${newDoctor.name} has been successfully added to the system with ${newDoctor.specialty} specialty.`, 'success');
}

// Auto-activate all doctors whose return date has passed
async function autoActivateExpiredInactiveDoctors() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let activatedCount = 0;
    
    for (const doctor of adminData.doctors) {
        if (doctor.status === 'inactive' && doctor.return_date) {
            const returnDate = new Date(doctor.return_date);
            returnDate.setHours(0, 0, 0, 0);
            
            // If return date has passed or is today, auto-activate
            if (returnDate <= today) {
                try {
                    // Update doctor status to active
                    doctor.status = 'active';
                    doctor.inactive_reason = null;
                    doctor.inactive_details = null;
                    doctor.return_date = null;
                    
                    // Update in database if available
                    if (typeof window.dbService !== 'undefined') {
                        await window.dbService.updateDoctor(doctor.id, {
                            status: 'active',
                            inactive_reason: null,
                            inactive_details: null,
                            return_date: null
                        });
                    }
                    
                    activatedCount++;
                    console.log(`✅ Auto-activated Dr. ${doctor.name} (return date reached)`);
                } catch (error) {
                    console.error(`Error auto-activating Dr. ${doctor.name}:`, error);
                }
            }
        }
    }
    
    if (activatedCount > 0) {
        console.log(`✅ Auto-activated ${activatedCount} doctor(s) whose return date has passed`);
    }
}

// Check and auto-activate doctor based on return date
async function checkAndAutoActivateDoctor(doctor) {
    if (doctor.status === 'inactive' && doctor.return_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
        
        const returnDate = new Date(doctor.return_date);
        returnDate.setHours(0, 0, 0, 0);
        
        // If return date has passed or is today, auto-activate the doctor
        if (returnDate <= today) {
            try {
                // Update doctor status to active
                doctor.status = 'active';
                doctor.inactive_reason = null;
                doctor.inactive_details = null;
                doctor.return_date = null;
                
                // Update in database if available
                if (typeof window.dbService !== 'undefined') {
                    await window.dbService.updateDoctor(doctor.id, {
                        status: 'active',
                        inactive_reason: null,
                        inactive_details: null,
                        return_date: null
                    });
                }
                
                // Update in local data
                const doctorIndex = adminData.doctors.findIndex(d => d.id === doctor.id);
                if (doctorIndex !== -1) {
                    adminData.doctors[doctorIndex] = doctor;
                }
                
                // Refresh displays
                loadDoctorsTable();
                loadDashboardStats();
                
                showNotification(`Dr. ${doctor.name} has been automatically activated (return date reached).`, 'success');
            } catch (error) {
                console.error('Error auto-activating doctor:', error);
            }
        }
    }
}

// Edit doctor
function editDoctor(doctorId) {
    const doctor = adminData.doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    // Check if doctor needs automatic activation based on return date
    checkAndAutoActivateDoctor(doctor);

    // Populate edit form
    document.getElementById('edit-doctor-id').value = doctor.id;
    document.getElementById('edit-doctor-name').value = doctor.name;
    document.getElementById('edit-doctor-specialty').value = doctor.specialty;
    document.getElementById('edit-doctor-degree').value = doctor.degree || '';
    document.getElementById('edit-doctor-workplace').value = doctor.workplace || '';
    document.getElementById('edit-doctor-patients').value = doctor.patients;
    document.getElementById('edit-doctor-experience').value = doctor.experience;
    document.getElementById('edit-doctor-rating').value = doctor.rating;
    document.getElementById('edit-doctor-reviews').value = doctor.reviews;
    document.getElementById('edit-doctor-image').value = doctor.image || '';
    document.getElementById('edit-doctor-status').value = doctor.status;
    document.getElementById('edit-doctor-visiting-time').value = doctor.visiting_time || '';
    document.getElementById('edit-doctor-chamber').value = doctor.chamber_address || '';
    document.getElementById('edit-doctor-location').value = doctor.location_details || '';
    document.getElementById('edit-doctor-about').value = doctor.about || '';
    document.getElementById('edit-doctor-booking-slot').value = doctor.booking_slot || 2;

    // Set visiting days (Supabase uses snake_case: visiting_days)
    const visitingDayCheckboxes = document.querySelectorAll('#edit-visiting-days input[name="visitingDays"]');
    visitingDayCheckboxes.forEach(checkbox => {
        checkbox.checked = doctor.visiting_days && doctor.visiting_days.includes(checkbox.value);
    });

    // Set off days (Supabase uses snake_case: off_days)
    const offDayCheckboxes = document.querySelectorAll('#edit-off-days input[name="offDays"]');
    offDayCheckboxes.forEach(checkbox => {
        checkbox.checked = doctor.off_days && doctor.off_days.includes(checkbox.value);
    });

    // Load health tips (Supabase uses snake_case: health_tips)
    loadHealthTipsForEdit(doctor.health_tips || []);

    // Load reviews (Supabase uses snake_case: user_review)
    loadReviewsForEdit(doctor.user_review || []);

    // If doctor is inactive, store existing inactive data and show inactive reason modal
    if (doctor.status === 'inactive' && (doctor.inactive_reason || doctor.return_date)) {
        // Store existing inactive data
        doctorInactiveData[doctor.id] = {
            reason: doctor.inactive_reason,
            details: doctor.inactive_details,
            returnDate: doctor.return_date
        };

        // Open edit modal first
        showModal('edit-doctor-modal');
        
        // Then show inactive reason modal on top with existing data
        setTimeout(() => {
            showInactiveReasonModalForEdit(doctor);
        }, 100);
    } else {
        showModal('edit-doctor-modal');
    }
}

// Show inactive reason modal with existing data for editing
function showInactiveReasonModalForEdit(doctor) {
    const form = document.getElementById('inactive-reason-form');
    
    // Pre-populate with existing data
    const reasonSelect = form.querySelector('select[name="inactiveReason"]');
    const detailsTextarea = form.querySelector('textarea[name="inactiveDetails"]');
    const returnDateInput = form.querySelector('input[name="returnDate"]');
    
    if (reasonSelect && doctor.inactive_reason) {
        reasonSelect.value = doctor.inactive_reason;
    }
    if (detailsTextarea && doctor.inactive_details) {
        detailsTextarea.value = doctor.inactive_details;
    }
    if (returnDateInput && doctor.return_date) {
        returnDateInput.value = doctor.return_date;
    }
    
    // Set up the pending status change for this edit
    pendingStatusChange = {
        formMode: 'edit',
        element: document.getElementById('edit-doctor-status')
    };
    
    showModal('inactive-reason-modal');
}

// Handle edit doctor form submission
async function handleEditDoctor(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const doctorId = parseInt(formData.get('id'));

    const doctorIndex = adminData.doctors.findIndex(d => d.id === doctorId);
    if (doctorIndex !== -1) {
        // Get visiting days and off days
        const visitingDays = Array.from(formData.getAll('visitingDays'));
        const offDays = Array.from(formData.getAll('offDays'));

        // Get health tips
        const healthTipQuestions = formData.getAll('healthTipQuestion[]');
        const healthTipAnswers = formData.getAll('healthTipAnswer[]');
        const healthTips = [];
        for (let i = 0; i < healthTipQuestions.length; i++) {
            if (healthTipQuestions[i] && healthTipAnswers[i]) {
                healthTips.push({
                    question: healthTipQuestions[i],
                    answer: healthTipAnswers[i]
                });
            }
        }

        // Get fake reviews (stored as JSONB in database, but not part of schema yet)
        const reviewerNames = formData.getAll('reviewerName[]');
        const reviewRatings = formData.getAll('reviewRating[]');
        const reviewTexts = formData.getAll('reviewText[]');
        const fakeReviews = [];
        for (let i = 0; i < reviewerNames.length; i++) {
            if (reviewerNames[i] && reviewTexts[i]) {
                fakeReviews.push({
                    reviewerName: reviewerNames[i],
                    rating: parseInt(reviewRatings[i]),
                    reviewText: reviewTexts[i]
                });
            }
        }

        const doctorStatus = formData.get('status');
        const updatedDoctorData = {
            name: formData.get('name'),
            specialty: formData.get('specialty'),
            degree: formData.get('degree'),
            workplace: formData.get('workplace'),
            patients: formData.get('patients'),
            experience: formData.get('experience'),
            rating: parseFloat(formData.get('rating')),
            reviews: parseInt(formData.get('reviews')),
            image: formData.get('image'),
            status: doctorStatus,
            visiting_time: formData.get('visitingTime'),
            chamber_address: formData.get('chamberAddress'),
            location_details: formData.get('locationDetails'),
            about: formData.get('about'),
            visiting_days: visitingDays,
            off_days: offDays,
            booking_slot: parseInt(formData.get('bookingSlot')) || 2,
            health_tips: healthTips,
            user_review: fakeReviews
        };

        // Include inactive data if doctor is being set to inactive
        if (doctorStatus === 'inactive' && doctorInactiveData[doctorId]) {
            updatedDoctorData.inactive_reason = doctorInactiveData[doctorId].reason;
            updatedDoctorData.inactive_details = doctorInactiveData[doctorId].details;
            updatedDoctorData.return_date = doctorInactiveData[doctorId].returnDate;
        } else if (doctorStatus === 'active') {
            // Clear inactive data if doctor is being set to active
            updatedDoctorData.inactive_reason = null;
            updatedDoctorData.inactive_details = null;
            updatedDoctorData.return_date = null;
        }

        // Update doctor in Supabase if dbService is available
        if (typeof window.dbService !== 'undefined') {
            try {
                await window.dbService.updateDoctor(doctorId, updatedDoctorData);
                console.log('✅ Doctor updated in Supabase');
            } catch (error) {
                console.error('Error updating doctor in Supabase:', error);
                showNotification('Error updating doctor in database: ' + error.message, 'error');
                return;
            }
        }

        // Update local adminData with all data including fakeReviews and inactive data
        adminData.doctors[doctorIndex] = {
            ...adminData.doctors[doctorIndex],
            ...updatedDoctorData,
            id: doctorId,
            visitingTime: updatedDoctorData.visiting_time,
            chamberAddress: updatedDoctorData.chamber_address,
            visitingDays: visitingDays,
            offDays: offDays,
            healthTips: healthTips,
            fakeReviews: fakeReviews,
            inactiveReason: updatedDoctorData.inactive_reason,
            inactiveDetails: updatedDoctorData.inactive_details,
            returnDate: updatedDoctorData.return_date
        };

        // Clean up stored inactive data after saving
        if (doctorInactiveData[doctorId]) {
            delete doctorInactiveData[doctorId];
        }

        loadDoctorsTable();
        closeModal('edit-doctor-modal');
        showNotification(`Dr. ${adminData.doctors[doctorIndex].name}'s profile has been updated successfully.`, 'success');
    }
}

// Delete doctor
function deleteDoctor(doctorId) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        adminData.doctors = adminData.doctors.filter(d => d.id !== doctorId);
        loadDoctorsTable();
        loadDashboardStats();
        showNotification('Doctor profile has been permanently removed from the system.', 'success');
    }
}

// View doctor
function viewDoctor(doctorId) {
    const doctor = adminData.doctors.find(d => d.id === doctorId);
    if (doctor) {
        alert(`Doctor Details:\n\nName: ${doctor.name}\nSpecialty: ${doctor.specialty}\nDegree: ${doctor.degree}\nWorkplace: ${doctor.workplace}\nRating: ${doctor.rating} (${doctor.reviews} reviews)\nStatus: ${doctor.status}`);
    }
}

// Add Driver Modal
function showAddDriverModal() {
    showModal('add-driver-modal');
}

// Handle add driver form submission
function handleAddDriver(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newDriver = {
        id: adminData.drivers.length + 1,
        name: formData.get('name'),
        contact: formData.get('contact'),
        district: formData.get('district'),
        upazila: formData.get('upazila'),
        location: `${formData.get('district')}, ${formData.get('upazila')}`,
        address: formData.get('address'),
        photo: formData.get('photo') || null,
        license: formData.get('license'),
        licenseExpiry: formData.get('licenseExpiry') || null,
        experience: parseInt(formData.get('experience')) || 0,
        ambulanceType: formData.get('ambulanceType'),
        ambulanceRegNo: formData.get('ambulanceRegNo'),
        vehicleModel: formData.get('vehicleModel') || null,
        manufacturingYear: parseInt(formData.get('manufacturingYear')) || null,
        availability: formData.get('availability'),
        workingShift: formData.get('workingShift') || 'flexible',
        emergencyContact: formData.get('emergencyContact') || null,
        joiningDate: formData.get('joiningDate') || new Date().toISOString().split('T')[0],
        serviceArea: formData.get('serviceArea') || 'local',
        rating: parseFloat(formData.get('rating')) || 4.5,
        specialSkills: formData.get('specialSkills') || null,
        notes: formData.get('notes') || null,
        status: formData.get('availability') || 'available',
        vehicleType: formData.get('ambulanceType'), // Keep for backward compatibility
        totalTrips: 0,
        successfulTrips: 0
    };

    adminData.drivers.push(newDriver);
    loadDriversTable();
    loadDashboardStats();

    closeModal('add-driver-modal');
    event.target.reset();
    clearDriverUpazilaOptions('add');

    showNotification(`Driver ${newDriver.name} has been successfully registered with ${newDriver.ambulanceType} ambulance.`, 'success');
}

// Add Hospital Modal
function showAddHospitalModal() {
    showModal('add-hospital-modal');
}

// Handle add hospital form submission
async function handleAddHospital(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    
    try {
        // Get specialities from checkboxes
        const specialitiesCheckboxes = event.target.querySelectorAll('input[name="specialities"]:checked');
        const specialities = Array.from(specialitiesCheckboxes).map(cb => cb.value);
        
        // Build facilities object
        const facilities = {
            icu: {
                available: formData.get('icuAvailable') === 'true',
                beds: parseInt(formData.get('icuBeds')) || 0
            },
            ccu: {
                available: formData.get('ccuAvailable') === 'true',
                beds: parseInt(formData.get('ccuBeds')) || 0
            },
            emergency: {
                available: formData.get('emergencyAvailable') === 'true',
                beds: parseInt(formData.get('emergencyBeds')) || 0
            },
            operationTheater: formData.get('operationTheater') === 'true',
            pharmacy: formData.get('pharmacy') === 'true',
            laboratory: formData.get('laboratory') === 'true',
            radiology: formData.get('radiology') === 'true'
        };
        
        // Build room pricing object
        const roomPricing = {
            generalWard: {
                beds: parseInt(formData.get('generalWardBeds')) || 0,
                price: parseInt(formData.get('generalWardPrice')) || 0
            },
            acCabin: {
                beds: parseInt(formData.get('acCabinBeds')) || 0,
                price: parseInt(formData.get('acCabinPrice')) || 0
            },
            nonAcCabin: {
                beds: parseInt(formData.get('nonAcCabinBeds')) || 0,
                price: parseInt(formData.get('nonAcCabinPrice')) || 0
            },
            icu: {
                beds: parseInt(formData.get('icuAvailableBeds')) || 0,
                price: parseInt(formData.get('icuPrice')) || 0
            },
            ccu: {
                beds: parseInt(formData.get('ccuAvailableBeds')) || 0,
                price: parseInt(formData.get('ccuPrice')) || 0
            }
        };
        
        // Calculate total beds from room pricing
        const totalBedsCalculated = 
            (roomPricing.generalWard.beds || 0) +
            (roomPricing.acCabin.beds || 0) +
            (roomPricing.nonAcCabin.beds || 0) +
            (roomPricing.icu.beds || 0) +
            (roomPricing.ccu.beds || 0);
        
        const newHospital = {
            name: formData.get('name'),
            type: formData.get('type'),
            image_url: formData.get('imageUrl') || null,
            address: formData.get('address'),
            location: formData.get('address'), // Keep for backward compatibility
            contact: formData.get('contact'),
            total_beds: totalBedsCalculated || 0,
            available_beds: totalBedsCalculated || 0, // Initially all beds are available
            status: 'active',
            rating: parseFloat(formData.get('rating')) || 0,
            reviews_count: parseInt(formData.get('reviewsCount')) || 0,
            discount_percentage: parseInt(formData.get('discountPercentage')) || 0,
            special_offer: formData.get('specialOffer') || null,
            offer_text: formData.get('offerText') || null,
            about: formData.get('about') || null,
            specialities: specialities,
            facilities: facilities,
            room_pricing: roomPricing
        };
        
        await dbService.addHospital(newHospital);
        await loadHospitalsTable();
        await loadDashboardStats();
        
        closeModal('add-hospital-modal');
        event.target.reset();
        
        showNotification(`${newHospital.name} has been successfully added to the hospital network.`, 'success');
    } catch (error) {
        console.error('Error adding hospital:', error);
        showNotification('Error adding hospital: ' + error.message, 'error');
    }
}

// Add Blood Donor Modal
function showAddDonorModal() {
    showModal('add-donor-modal');
}

// Handle add donor form submission
async function handleAddDonor(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const donorData = {
        name: formData.get('name'),
        blood_group: formData.get('bloodGroup'),
        contact: formData.get('contact'),
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        district: formData.get('district'),
        upazila: formData.get('upazila'),
        last_donation_date: formData.get('lastDonationDate') || null,
        donation_frequency: formData.get('donationFrequency') || 'Not specified',
        status: formData.get('status') || 'active',
        approved: formData.get('approved') === 'true',
        approval_date: formData.get('approved') === 'true' ? new Date().toISOString().split('T')[0] : null,
        request_date: new Date().toISOString().split('T')[0],
        photo: formData.get('photoUrl') || null
    };

    try {
        await dbService.addBloodDonor(donorData);
        showNotification(`${donorData.name} (${donorData.blood_group}) has been successfully registered as a blood donor.`, 'success');
        
        loadBloodDonorsTable();
        loadDashboardStats();

        closeModal('add-donor-modal');
        event.target.reset();
        clearDonorUpazilaOptions('add');
    } catch (error) {
        console.error('Error adding blood donor:', error);
        showNotification('Error adding blood donor: ' + error.message, 'error');
    }
}

// Approve appointment
async function approveAppointment(appointmentId) {
    const appointmentIndex = adminData.appointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex !== -1) {
        try {
            // Update in database
            await window.dbService.updateAppointment(appointmentId, { status: 'approved' });
            
            // Update local data
            adminData.appointments[appointmentIndex].status = 'approved';
            
            // Send notification to user
            const appointment = adminData.appointments[appointmentIndex];
            if (appointment.user_id) {
                try {
                    const notificationData = {
                        user_id: appointment.user_id,
                        type: 'appointment',
                        title: 'Appointment Approved',
                        message: `Your appointment with Dr. ${appointment.doctor_name} on ${appointment.date} at ${appointment.time} has been approved.`,
                        is_read: false,
                        request_id: appointment.booking_id || `${appointmentId}`,
                        request_type: 'appointment'
                    };
                    await window.dbService.addNotification(notificationData);
                    console.log('Appointment approval notification sent to user:', appointment.user_id);
                } catch (notifError) {
                    console.error('Error sending appointment approval notification:', notifError);
                }
            }
            
            loadAppointmentsTable();
            showNotification(`Appointment has been approved and the patient will be notified automatically.`, 'success');
        } catch (error) {
            console.error('Error approving appointment:', error);
            showNotification('Failed to approve appointment. Please try again.', 'error');
        }
    }
}

// Complete appointment
async function completeAppointment(appointmentId) {
    const appointmentIndex = adminData.appointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex !== -1) {
        try {
            // Update in database
            await window.dbService.updateAppointment(appointmentId, { 
                status: 'completed',
                completed_at: new Date().toISOString()
            });
            
            // Update local data
            adminData.appointments[appointmentIndex].status = 'completed';
            adminData.appointments[appointmentIndex].completed_at = new Date().toISOString();
            
            const appointment = adminData.appointments[appointmentIndex];
            
            // Award loyalty points to user (50 points for completed appointment)
            if (appointment.user_id) {
                const userId = appointment.user_id;
                const pointsToAward = 50;
                
                // Get current user points
                let currentPoints = 0;
                const userIndex = adminData.users.findIndex(u => u.id === userId);
                if (userIndex !== -1) {
                    currentPoints = adminData.users[userIndex].points || 0;
                }
                
                const newPoints = currentPoints + pointsToAward;
                
                try {
                    // Update points in database
                    await window.dbService.updateUser(userId, { points: newPoints });
                    
                    // Update local data
                    if (userIndex !== -1) {
                        adminData.users[userIndex].points = newPoints;
                    }
                    
                    console.log(`✅ Awarded ${pointsToAward} points to user ${userId} for completed appointment. Total: ${newPoints}`);
                } catch (pointsError) {
                    console.error('Error updating user points:', pointsError);
                }
                
                // Send notification to user about completion and points earned
                try {
                    const notificationData = {
                        user_id: userId,
                        type: 'appointment',
                        title: 'Appointment Completed - Points Earned!',
                        message: `Your appointment with Dr. ${appointment.doctor_name} has been completed. You've earned ${pointsToAward} loyalty points! Total points: ${newPoints}`,
                        is_read: false,
                        request_id: appointment.booking_id || `${appointmentId}`,
                        request_type: 'appointment'
                    };
                    await window.dbService.addNotification(notificationData);
                    console.log('Appointment completion notification sent to user:', userId);
                } catch (notifError) {
                    console.error('Error sending appointment completion notification:', notifError);
                }
            }
            
            loadAppointmentsTable();
            loadDashboardStats();
            showNotification(`Appointment has been marked as completed${appointment.user_id ? ' and loyalty points awarded to patient' : ''}.`, 'success');
        } catch (error) {
            console.error('Error completing appointment:', error);
            showNotification('Failed to complete appointment. Please try again.', 'error');
        }
    }
}

// Delete appointment
async function deleteAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointmentIndex = adminData.appointments.findIndex(a => a.id === appointmentId);
        if (appointmentIndex !== -1) {
            try {
                // Update in database
                await window.dbService.updateAppointment(appointmentId, { status: 'cancelled' });
                
                // Update local data
                adminData.appointments[appointmentIndex].status = 'cancelled';
                
                // Send notification to user
                const appointment = adminData.appointments[appointmentIndex];
                if (appointment.user_id) {
                    try {
                        const notificationData = {
                            user_id: appointment.user_id,
                            type: 'appointment',
                            title: 'Appointment Cancelled',
                            message: `Your appointment with Dr. ${appointment.doctor_name} on ${appointment.date} at ${appointment.time} has been cancelled. Please contact us for rescheduling.`,
                            is_read: false,
                            request_id: appointment.booking_id || `${appointmentId}`,
                            request_type: 'appointment'
                        };
                        await window.dbService.addNotification(notificationData);
                        console.log('Appointment cancellation notification sent to user:', appointment.user_id);
                    } catch (notifError) {
                        console.error('Error sending appointment cancellation notification:', notifError);
                    }
                }
                
                loadAppointmentsTable();
                showNotification('Appointment has been cancelled and the patient will be notified of the cancellation.', 'warning');
            } catch (error) {
                console.error('Error cancelling appointment:', error);
                showNotification('Failed to cancel appointment. Please try again.', 'error');
            }
        }
    }
}

// Approve emergency request
async function approveEmergencyRequest(type, requestId) {
    if (type === 'ambulance') {
        // Open modal for ambulance requests
        document.getElementById('approve-request-id').value = requestId;
        document.getElementById('approve-driver-name').value = '';
        document.getElementById('approve-driver-contact').value = '';
        showModal('approve-ambulance-modal');
        return;
    }

    const services = adminData.emergencyServices;
    let requests;
    let updateFunction;

    switch(type) {
        case 'blood':
            requests = services.bloodRequests;
            updateFunction = window.dbService.updateBloodRequest;
            break;
        case 'hospital':
            requests = services.hospitalRequests;
            updateFunction = window.dbService.updateHospitalRequest;
            break;
        default:
            return;
    }

    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
        try {
            // Update in Supabase database
            await updateFunction(requestId, { status: 'approved' });
            
            // Update local data
            requests[requestIndex].status = 'approved';
            
            // Send notification to user
            const request = requests[requestIndex];
            if (request.user_id) {
                try {
                    const notificationData = {
                        user_id: request.user_id,
                        type: 'blood-bank',
                        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Request Approved`,
                        message: `Your ${type} request has been approved by the admin. We will contact you soon for further details.`,
                        is_read: false,
                        request_id: request.request_id || `${requestId}`,
                        request_type: type
                    };
                    await window.dbService.addNotification(notificationData);
                    console.log('Notification sent to user:', request.user_id);
                } catch (notifError) {
                    console.error('Error sending notification:', notifError);
                }
            }
            
            loadEmergencyTabs();
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} request approved successfully!`, 'success');
        } catch (error) {
            console.error(`Error approving ${type} request:`, error);
            showNotification(`Failed to approve ${type} request. Please try again.`, 'error');
        }
    }
}

// Handle approve ambulance request form submission
async function handleApproveAmbulanceRequest(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const requestId = parseInt(formData.get('requestId'));
    const driverName = formData.get('driverName');
    const driverContact = formData.get('driverContact');
    
    console.log('Approving ambulance request:', { requestId, driverName, driverContact });
    
    if (!driverName || !driverContact) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    try {
        // Get the request to check if it's a driver booking
        const requests = adminData.emergencyServices.ambulanceRequests;
        console.log('Current ambulance requests:', requests);
        console.log('Looking for request ID:', requestId);
        
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex === -1) {
            console.error('Request not found in local data. Request ID:', requestId);
            showNotification('Request not found.', 'error');
            return;
        }
        
        const request = requests[requestIndex];
        console.log('Found request:', request);
        
        // Prepare update data
        const updateData = {
            status: 'approved',
            driver_name: driverName,
            driver_contact: driverContact
        };
        
        // If this is a driver booking with a driver_id, fetch ambulance registration number
        if (request.driver_id && request.booking_type === 'driver_booking') {
            try {
                const { data: driverData, error: driverError } = await window.supabase
                    .from('drivers')
                    .select('ambulance_registration_number')
                    .eq('id', request.driver_id)
                    .single();
                
                if (!driverError && driverData && driverData.ambulance_registration_number) {
                    updateData.ambulance_license = driverData.ambulance_registration_number;
                }
            } catch (error) {
                console.warn('Could not fetch driver ambulance registration:', error);
            }
        }
        
        console.log('Update data:', updateData);
        console.log('Calling dbService.updateAmbulanceRequest...');
        
        // Update in Supabase database
        const result = await window.dbService.updateAmbulanceRequest(requestId, updateData);
        console.log('Update result:', result);
        
        // Update local data
        requests[requestIndex].status = 'approved';
        requests[requestIndex].driver_name = driverName;
        requests[requestIndex].driver_contact = driverContact;
        if (updateData.ambulance_license) {
            requests[requestIndex].ambulance_license = updateData.ambulance_license;
        }
        
        // Send notification to user
        if (request.user_id) {
            try {
                const notificationData = {
                    user_id: request.user_id,
                    type: 'ambulance',
                    title: 'Ambulance Request Approved',
                    message: `Your ambulance request has been approved. Driver: ${driverName}, Contact: ${driverContact}. The driver will contact you shortly.`,
                    is_read: false,
                    request_id: request.request_id || `${requestId}`,
                    request_type: 'ambulance'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Ambulance approval notification sent to user:', request.user_id);
            } catch (notifError) {
                console.error('Error sending ambulance notification:', notifError);
            }
        }
        
        closeModal('approve-ambulance-modal');
        loadEmergencyTabs();
        showNotification('Ambulance request approved successfully! Driver details have been assigned.', 'success');
    } catch (error) {
        console.error('Error approving ambulance request:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        showNotification('Failed to approve ambulance request. Please try again.', 'error');
    }
}

// Delete emergency request
async function deleteEmergencyRequest(type, requestId) {
    if (!confirm(`Are you sure you want to delete this ${type} request?`)) {
        return;
    }

    const services = adminData.emergencyServices;
    let requests;
    let deleteFunction;

    switch(type) {
        case 'ambulance':
            requests = services.ambulanceRequests;
            deleteFunction = window.dbService.deleteAmbulanceRequest;
            break;
        case 'blood':
            requests = services.bloodRequests;
            deleteFunction = window.dbService.deleteBloodRequest;
            break;
        case 'hospital':
            requests = services.hospitalRequests;
            deleteFunction = window.dbService.deleteHospitalRequest;
            break;
        default:
            return;
    }

    try {
        // Get request data before deleting (to send notification)
        const requestIndex = requests.findIndex(r => r.id === requestId);
        const request = requestIndex !== -1 ? requests[requestIndex] : null;
        
        // Delete from Supabase database
        await deleteFunction(requestId);
        
        // Send notification to user before removing from local data
        if (request && request.user_id) {
            try {
                const notificationData = {
                    user_id: request.user_id,
                    type: 'blood-bank',
                    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Request Deleted`,
                    message: `Your ${type} request has been deleted by the admin. If you have any questions, please contact support.`,
                    is_read: false,
                    request_id: request.request_id || `${requestId}`,
                    request_type: type
                };
                await window.dbService.addNotification(notificationData);
                console.log('Deletion notification sent to user:', request.user_id);
            } catch (notifError) {
                console.error('Error sending deletion notification:', notifError);
            }
        }
        
        // Remove from local data
        if (requestIndex !== -1) {
            requests.splice(requestIndex, 1);
        }
        
        loadEmergencyTabs();
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} request deleted successfully!`, 'success');
    } catch (error) {
        console.error(`Error deleting ${type} request:`, error);
        showNotification(`Failed to delete ${type} request. Please try again.`, 'error');
    }
}

// Hospital Request specific functions (wrappers for clearer API)
async function approveHospitalRequest(requestId) {
    await approveEmergencyRequest('hospital', requestId);
}

async function deleteHospitalRequest(requestId) {
    await deleteEmergencyRequest('hospital', requestId);
}

function viewHospitalRequest(requestId) {
    const request = adminData.emergencyServices.hospitalRequests.find(r => r.id === requestId);
    if (!request) {
        showNotification('Hospital request not found.', 'error');
        return;
    }
    
    // Format check-in date
    const checkInDate = request.check_in_date ? new Date(request.check_in_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : 'N/A';
    
    const duration = request.duration ? `${request.duration} day${request.duration > 1 ? 's' : ''}` : 'N/A';
    
    // Create detailed view modal content
    const modalContent = `
        <div class="request-detail-modal">
            <div class="detail-grid">
                <div class="detail-row">
                    <span class="detail-label">Request ID:</span>
                    <span class="detail-value"><strong>${request.request_id || '#' + request.id}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value"><span class="status-badge ${request.status}">${request.status}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Patient Name:</span>
                    <span class="detail-value">${request.patient_name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Age:</span>
                    <span class="detail-value">${request.patient_age || 'N/A'} years</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Gender:</span>
                    <span class="detail-value">${request.patient_gender || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${request.contact}</span>
                </div>
                ${request.emergency_contact ? `
                <div class="detail-row">
                    <span class="detail-label">Emergency Contact:</span>
                    <span class="detail-value">${request.emergency_contact}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Hospital:</span>
                    <span class="detail-value"><strong>${request.hospital}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Room Type:</span>
                    <span class="detail-value">${request.room_name || request.room_type || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in Date:</span>
                    <span class="detail-value">${checkInDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in Time:</span>
                    <span class="detail-value">${request.check_in_time || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${duration}</span>
                </div>
                ${request.special_requirements ? `
                <div class="detail-row">
                    <span class="detail-label">Special Requirements:</span>
                    <span class="detail-value">${request.special_requirements}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${request.payment_method === 'app' ? 'Pay via App' : request.payment_method || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Original Price:</span>
                    <span class="detail-value">৳${request.original_price?.toLocaleString() || 'N/A'}</span>
                </div>
                ${request.discount_amount > 0 ? `
                <div class="detail-row">
                    <span class="detail-label">Discount:</span>
                    <span class="detail-value" style="color: #22c55e;">৳${request.discount_amount.toLocaleString()}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Total Price:</span>
                    <span class="detail-value"><strong style="font-size: 1.2em; color: #2196F3;">৳${request.total_price?.toLocaleString() || 'N/A'}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Request Time:</span>
                    <span class="detail-value">${request.created_at ? new Date(request.created_at).toLocaleString('en-GB') : (request.request_time ? new Date(request.request_time).toLocaleString('en-GB') : 'N/A')}</span>
                </div>
                ${request.user_id ? `
                <div class="detail-row">
                    <span class="detail-label">User ID:</span>
                    <span class="detail-value">${request.user_id}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Populate and show the modal
    const modalContentElement = document.getElementById('hospital-requests-details-content');
    if (modalContentElement) {
        modalContentElement.innerHTML = modalContent;
        showModal('hospital-requests-details-modal');
    }
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const filteredUsers = adminData.users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.mobile.includes(searchTerm)
    );

    // Temporarily update display with filtered results
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    try {
        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${user.avatar ?
                        `<img src="${user.avatar}" alt="${user.name}" class="doctor-photo">` :
                        '<i class="fas fa-user-circle" style="font-size: 40px; color: #64748b;"></i>'
                    }
                </td>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td>${user.district}, ${user.upazila}</td>
                <td><span class="points-badge">${user.points || 0} pts</span></td>
                <td>${formatDate(user.joinDate)}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewUser(${user.id})">View</button>
                        <button class="action-btn edit" onclick="editUser(${user.id})">Edit</button>
                        <button class="action-btn delete" onclick="deleteUser(${user.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        handleError(error, 'Searching users');
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">Error performing search</td></tr>';
    }

    if (filteredUsers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No users found matching your search.</td></tr>';
    }
}

// View user
function viewUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}\nLocation: ${user.district}, ${user.upazila}\nJoin Date: ${user.joinDate}\nStatus: ${user.status}\nPoints: ${user.points}`);
    }
}

// Edit user
function editUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (!user) return;

    // Populate the edit user modal
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-user-name').value = user.name;
    document.getElementById('edit-user-email').value = user.email;
    document.getElementById('edit-user-mobile').value = user.mobile;
    document.getElementById('edit-user-district').value = user.district;
    document.getElementById('edit-user-upazila').value = user.upazila;
    document.getElementById('edit-user-status').value = user.status;
    document.getElementById('edit-user-points').value = user.points || 0; // Ensure points is set

    showModal('edit-user-modal');
}

// Handle edit user form submission
function handleEditUser(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userId = parseInt(formData.get('id'));

    const userIndex = adminData.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        adminData.users[userIndex] = {
            ...adminData.users[userIndex],
            name: formData.get('name'),
            email: formData.get('email'),
            mobile: formData.get('mobile'),
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            status: formData.get('status'),
            points: parseInt(formData.get('points')) || 0,
            updatedAt: new Date().toISOString()
        };

        loadUsersTable();
        closeModal('edit-user-modal');
        showNotification(`User ${adminData.users[userIndex].name}'s profile has been updated successfully.`, 'success');
    }
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        adminData.users = adminData.users.filter(u => u.id !== userId);
        loadUsersTable();
        loadDashboardStats();
        showNotification('User account has been permanently removed from the system.', 'success');
    }
}

// Analytics functionality
const analyticsData = {
    currentPeriod: '30days',
    realTimeUpdates: true,
    updateInterval: null,

    // Sample data - in production, this would come from your backend
    sampleData: {
        appointments: {
            total: 156,
            change: 12.5,
            daily: [12, 19, 15, 25, 22, 18, 28, 34, 26, 31, 28, 24, 33, 29, 22, 18, 25, 28, 32, 19, 24, 27, 31, 26, 22, 28, 25, 29, 33, 24],
            weekly: [85, 92, 78, 105, 98, 112, 124, 118, 135, 142, 156, 149, 165, 172],
            monthly: [1250, 1380, 1456, 1620, 1785, 1924, 2156, 2384, 2567, 2789, 2945, 3156]
        },
        revenue: {
            total: 45000,
            change: 18.2,
            byService: {
                'Doctor Consultations': 25000,
                'Emergency Services': 12000,
                'Hospital Bookings': 5000,
                'Blood Bank Services': 3000
            }
        },
        users: {
            active: 1248,
            change: 8.7,
            demographics: {
                'Age 18-25': 324,
                'Age 26-35': 456,
                'Age 36-45': 287,
                'Age 46-60': 134,
                'Age 60+': 47
            }
        },
        satisfaction: {
            average: 4.8,
            change: 0.2
        },
        specialties: {
            'Cardiology': 45,
            'Dentistry': 38,
            'ENT': 32,
            'Pulmonology': 28,
            'Neurology': 24,
            'Orthopedics': 22,
            'Gynecology': 18,
            'Dermatology': 15
        },
        doctors: [
            { name: 'Dr. Musa Siddik Juwel', specialty: 'Dentistry', appointments: 45, revenue: 15000, rating: 5.0, growth: 15.2 },
            { name: 'Dr. Hasanur Rahman', specialty: 'Cardiology', appointments: 42, revenue: 18000, rating: 4.9, growth: 12.8 },
            { name: 'Dr. Mizanur Rahman', specialty: 'ENT', appointments: 38, revenue: 12500, rating: 4.9, growth: 8.5 },
            { name: 'Dr. Dip Jyoti Sarker', specialty: 'Pulmonology', appointments: 25, revenue: 8500, rating: 4.8, growth: -5.2 }
        ],
        services: [
            { name: 'Doctor Consultations', usage: 156, revenue: 25000, successRate: 98.5, rating: 4.8, trend: 'up' },
            { name: 'Emergency Services', usage: 24, revenue: 12000, successRate: 94.2, rating: 4.6, trend: 'up' },
            { name: 'Hospital Bookings', usage: 18, revenue: 5000, successRate: 96.8, rating: 4.7, trend: 'down' },
            { name: 'Blood Bank Services', usage: 12, revenue: 3000, successRate: 100, rating: 4.9, trend: 'up' }
        ],
        emergencyServices: {
            'Ambulance': 45,
            'Blood Requests': 28,
            'Hospital Emergency': 15
        }
    }
};

// Load analytics
function loadAnalytics() {
    console.log('Loading comprehensive analytics...');

    // Update key metrics
    updateKeyMetrics();

    // Initialize charts
    initializeAnalyticsCharts();

    // Load analytics tables
    loadAnalyticsTables();

    // Start real-time updates
    if (analyticsData.realTimeUpdates) {
        startRealTimeUpdates();
    }

    // Setup chart controls
    setupChartControls();

    console.log('Analytics loaded successfully');
}

// Update key metrics
function updateKeyMetrics() {
    // Use real data from adminData
    const totalAppointments = adminData.appointments.length;
    const revenuePerAppointment = 100;
    const totalRevenue = totalAppointments * revenuePerAppointment;
    const activeUsers = adminData.users.length;

    document.getElementById('total-appointments-metric').textContent = totalAppointments;
    document.getElementById('appointments-change').textContent = `+12.5%`; // Static for now

    document.getElementById('total-revenue-metric').textContent = `৳${totalRevenue.toLocaleString()}`;
    document.getElementById('revenue-change').textContent = `+18.2%`; // Static for now

    document.getElementById('active-users-metric').textContent = activeUsers.toLocaleString();
    document.getElementById('users-change').textContent = `+8.7%`; // Static for now
}

// Initialize all charts
function initializeAnalyticsCharts() {
    initializeAppointmentsChart();
    initializeRevenueChart();
    initializeSpecialtyChart();
    initializeDoctorPerformanceChart();
    initializeDemographicsChart();
    initializeEmergencyChart();
}

// Appointments over time chart
function initializeAppointmentsChart() {
    const ctx = document.getElementById('appointmentsChart').getContext('2d');
    const data = analyticsData.sampleData.appointments;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Appointments',
                data: data.daily,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Revenue breakdown chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Calculate real revenue from appointments: 100 taka per appointment
    const revenuePerAppointment = 100;
    const doctorAppointments = adminData.appointments.length;
    const totalRevenue = doctorAppointments * revenuePerAppointment;
    
    // Service breakdown (currently only doctor consultations generate revenue)
    const revenueData = {
        'Doctor Consultations': totalRevenue,
        'Emergency Services': 0,
        'Hospital Bookings': 0,
        'Blood Bank Services': 0
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(revenueData),
            datasets: [{
                data: Object.values(revenueData),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#43e97b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Popular specialties chart
function initializeSpecialtyChart() {
    const ctx = document.getElementById('specialtyChart').getContext('2d');
    
    // Count appointments by specialty from real data
    const specialtyCounts = {};
    
    adminData.appointments.forEach(appointment => {
        const doctor = adminData.doctors.find(d => d.id === appointment.doctorId || d.id === appointment.doctor_id);
        if (doctor && doctor.specialty) {
            const specialty = doctor.specialty;
            specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
        }
    });
    
    // Sort by count descending
    const sortedSpecialties = Object.entries(specialtyCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Top 8 specialties

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedSpecialties.map(s => s[0]),
            datasets: [{
                label: 'Appointments',
                data: sortedSpecialties.map(s => s[1]),
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#43e97b',
                    '#fa709a', '#4facfe', '#a8edea', '#fed6e3'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Doctor performance chart
function initializeDoctorPerformanceChart() {
    const ctx = document.getElementById('doctorPerformanceChart').getContext('2d');
    const doctors = analyticsData.sampleData.doctors;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: doctors.map(d => d.name.split(' ').slice(-2).join(' ')),
            datasets: [{
                label: 'Appointments',
                data: doctors.map(d => d.appointments),
                backgroundColor: '#667eea',
                borderRadius: 8,
                borderSkipped: false
            }, {
                label: 'Revenue (in thousands)',
                data: doctors.map(d => d.revenue / 1000),
                backgroundColor: '#43e97b',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// User demographics chart
function initializeDemographicsChart() {
    const ctx = document.getElementById('demographicsChart').getContext('2d');
    const data = analyticsData.sampleData.users.demographics;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#43e97b',
                    '#fa709a'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Emergency services chart
function initializeEmergencyChart() {
    const ctx = document.getElementById('emergencyChart').getContext('2d');
    const data = analyticsData.sampleData.emergencyServices;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#ff6b6b',
                    '#4ecdc4',
                    '#45b7d1'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load analytics tables
function loadAnalyticsTables() {
    loadTopDoctorsAnalytics();
    loadServiceAnalytics();
}

// Load top doctors analytics table
function loadTopDoctorsAnalytics() {
    const tableBody = document.getElementById('top-doctors-analytics');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    analyticsData.sampleData.doctors.forEach(doctor => {
        const row = document.createElement('tr');
        const trendIcon = doctor.growth > 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        const trendColor = doctor.growth > 0 ? '#10b981' : '#ef4444';

        row.innerHTML = `
            <td><strong>${doctor.name}</strong></td>
            <td>${doctor.specialty}</td>
            <td>${doctor.appointments}</td>
            <td>৳${doctor.revenue.toLocaleString()}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <i class="fas fa-star" style="color: #fbbf24; font-size: 12px;"></i>
                    ${doctor.rating}
                </div>
            </td>
            <td>
                <span style="color: ${trendColor}; display: flex; align-items: center; gap: 4px;">
                    <i class="fas ${trendIcon}" style="font-size: 10px;"></i>
                    ${Math.abs(doctor.growth)}%
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load service analytics table
function loadServiceAnalytics() {
    const tableBody = document.getElementById('service-analytics');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Calculate real service data from adminData
    const revenuePerAppointment = 100;
    const services = [
        {
            name: 'Doctor Consultations',
            usage: adminData.appointments.length,
            revenue: adminData.appointments.length * revenuePerAppointment,
            successRate: adminData.appointments.length > 0 ? 100 : 0,
            trend: 'up'
        },
        {
            name: 'Emergency Services',
            usage: adminData.emergencyServices.ambulanceRequests.length,
            revenue: 0,
            successRate: adminData.emergencyServices.ambulanceRequests.length > 0 ? 95 : 0,
            trend: 'up'
        },
        {
            name: 'Hospital Bookings',
            usage: adminData.emergencyServices.hospitalRequests.length,
            revenue: 0,
            successRate: adminData.emergencyServices.hospitalRequests.length > 0 ? 98 : 0,
            trend: 'up'
        },
        {
            name: 'Blood Bank Services',
            usage: adminData.emergencyServices.bloodRequests.length,
            revenue: 0,
            successRate: adminData.emergencyServices.bloodRequests.length > 0 ? 100 : 0,
            trend: 'up'
        }
    ];

    services.forEach(service => {
        const row = document.createElement('tr');
        const trendIcon = service.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
        const trendColor = service.trend === 'up' ? '#10b981' : '#ef4444';

        row.innerHTML = `
            <td><strong>${service.name}</strong></td>
            <td>${service.usage}</td>
            <td>৳${service.revenue.toLocaleString()}</td>
            <td>${service.successRate}%</td>
            <td>
                <i class="fas ${trendIcon}" style="color: ${trendColor};"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Setup chart controls
function setupChartControls() {
    const controlButtons = document.querySelectorAll('.chart-control-btn');
    controlButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            if (period) {
                // Update active state
                this.parentElement.querySelectorAll('.chart-control-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Update chart data based on period
                updateAppointmentsChartPeriod(period);
            }
        });
    });
}

// Update appointments chart based on period
function updateAppointmentsChartPeriod(period) {
    const canvas = document.getElementById('appointmentsChart');
    const chart = Chart.getChart(canvas);
    const data = analyticsData.sampleData.appointments;

    let chartData, labels;

    switch(period) {
        case 'daily':
            chartData = data.daily;
            labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
            break;
        case 'weekly':
            chartData = data.weekly;
            labels = Array.from({length: 14}, (_, i) => `Week ${i + 1}`);
            break;
        case 'monthly':
            chartData = data.monthly;
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            break;
        default:
            chartData = data.daily;
            labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = chartData;
    chart.update();
}

// Real-time updates
function startRealTimeUpdates() {
    if (analyticsData.updateInterval) {
        clearInterval(analyticsData.updateInterval);
    }

    analyticsData.updateInterval = setInterval(() => {
        if (analyticsData.realTimeUpdates) {
            generateRealTimeActivity();
        }
    }, 5000); // Update every 5 seconds
}

// Generate real-time activity
function generateRealTimeActivity() {
    const activities = [
        { icon: 'fas fa-calendar-plus', color: '#667eea', title: 'New appointment booked', desc: 'Dr. Rahman - Cardiology', time: 'Just now' },
        { icon: 'fas fa-ambulance', color: '#ff6b6b', title: 'Emergency request', desc: 'Ambulance - Rangpur Medical', time: '2 min ago' },
        { icon: 'fas fa-user-plus', color: '#4ecdc4', title: 'New user registered', desc: 'John Doe from Rangpur', time: '5 min ago' },
        { icon: 'fas fa-tint', color: '#e74c3c', title: 'Blood request fulfilled', desc: 'O+ Blood - 2 units', time: '8 min ago' },
        { icon: 'fas fa-star', color: '#f39c12', title: 'New review', desc: '5-star rating for Dr. Juwel', time: '12 min ago' }
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    addRealTimeActivity(randomActivity);
}

// Add real-time activity to feed
function addRealTimeActivity(activity) {
    const feed = document.getElementById('real-time-activity-feed');
    if (!feed) return;

    const activityElement = document.createElement('div');
    activityElement.className = 'activity-item';

    activityElement.innerHTML = `
        <div class="activity-item-icon" style="background-color: ${activity.color};">
            <i class="${activity.icon}"></i>
        </div>
        <div class="activity-item-info">
            <h5>${activity.title}</h5>
            <p>${activity.desc}</p>
        </div>
        <div class="activity-item-time">${activity.time}</div>
    `;

    feed.insertBefore(activityElement, feed.firstChild);

    // Keep only last 10 activities
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
}

// Toggle real-time updates
function toggleRealTimeUpdates() {
    analyticsData.realTimeUpdates = !analyticsData.realTimeUpdates;
    const btn = document.querySelector('.activity-control-btn');

    if (analyticsData.realTimeUpdates) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause Updates';
        startRealTimeUpdates();
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-play"></i> Start Updates';
        if (analyticsData.updateInterval) {
            clearInterval(analyticsData.updateInterval);
        }
    }
}

// Clear activity feed
function clearActivityFeed() {
    const feed = document.getElementById('real-time-activity-feed');
    if (feed) {
        feed.innerHTML = '<div class="activity-item" style="text-align: center; color: #64748b; padding: 20px;">Activity feed cleared</div>';
    }
}

// Update analytics period
function updateAnalyticsPeriod() {
    const period = document.getElementById('analytics-period').value;
    analyticsData.currentPeriod = period;

    // Update all charts and metrics based on new period
    updateKeyMetrics();
    loadAnalyticsTables();

    showNotification(`Analytics updated for ${period.replace(/(\d+)/, '$1 ').replace(/([a-z])([A-Z])/g, '$1 $2')}`, 'success');
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');
    const overlay = document.querySelector('.sidebar-overlay');

    // Toggle sidebar visibility
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');

    // For mobile, also toggle show class and overlay
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show');

        // Create overlay if it doesn't exist
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'sidebar-overlay';
            newOverlay.onclick = toggleSidebar;
            document.body.appendChild(newOverlay);
            newOverlay.classList.toggle('active');
        } else {
            overlay.classList.toggle('active');
        }
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.admin-sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');

    // Only on mobile
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('show')) {
            toggleSidebar();
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (window.innerWidth > 768) {
        sidebar.classList.remove('show');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
});

// Admin logout
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin session
        adminSession.clearSession();

        // Show login screen instead of redirecting
        showAdminLogin();

        // Clear login form
        document.getElementById('admin-login-form').reset();

        // Show logout message
        setTimeout(() => {
            showNotification('Successfully logged out', 'info');
        }, 300);
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    });
    return `${dateStr} ${timeStr}`;
}

// Enhanced notification system
function showNotification(message, type = 'success', duration = 4000) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.admin-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;

    // Get appropriate icon based on type
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };

    const icon = icons[type] || icons['info'];

    notification.innerHTML = `
        <div class="admin-notification-content">
            <div class="admin-notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="admin-notification-message">
                <strong>${getNotificationTitle(type)}</strong>
                <p>${message}</p>
            </div>
            <button class="admin-notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="admin-notification-progress"></div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('admin-notification-show');
    }, 100);

    // Auto remove after duration
    const progressBar = notification.querySelector('.admin-notification-progress');
    progressBar.style.animationDuration = `${duration}ms`;

    setTimeout(() => {
        notification.classList.add('admin-notification-hide');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Get notification title based on type
function getNotificationTitle(type) {
    const titles = {
        'success': 'Success!',
        'error': 'Error!',
        'warning': 'Warning!',
        'info': 'Information'
    };
    return titles[type] || 'Notification';
}

// Global variables for status handling
let pendingStatusChange = null;
let currentFormMode = null;
let doctorInactiveData = {};

// AdminSettings object for handling settings functionality
const AdminSettings = {
    settings: {
        appName: 'MediQuick',
        appSubtitle: 'Your Trusted Platform To Find Doctors',
        maintenanceMode: false,
        userRegistration: true,
        guestAccess: false,
        autoLogoutTime: 60,
        defaultLanguage: 'english',
        passwordRequirements: 'basic',
        profilePhotoRequired: false,
        doctorAppointmentsEnabled: true,
        emergencyServicesEnabled: true,
        bloodBankEnabled: true,
        ambulanceBookingEnabled: true,
        hospitalBookingEnabled: true,
        pharmacyServicesEnabled: true,
        pushNotificationsEnabled: true,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false,
        appointmentReminders: '24hours',
        pointsSystemEnabled: true,
        pointsPerAppointment: 50,
        pointsPerRegistration: 100,
        pointsRedemptionRate: 10,
        minRedemptionAmount: 500,
        bkashEnabled: true,
        nagadEnabled: true,
        rocketEnabled: false,
        bankTransferEnabled: false,
        cashEnabled: false,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        twoFactorAuth: 'disabled',
        dataRetentionPeriod: '2years',
        featuredDoctorsCount: 3,
        sponsorBannerEnabled: true,
        heroSliderAutoplay: true,
        heroSliderSpeed: 5,
        reviewsDisplay: 'all',
        googleOauthEnabled: true,
        facebookLoginEnabled: false,
        locationServicesEnabled: true,
        analyticsTrackingEnabled: true,
        thirdPartyIntegrations: 'all',
        adminEmail: 'admin@mediquick.com',
        adminSessionTimeout: '8hours',
        adminAccessLevel: 'super-admin',
        emergencyContact: '+880-999-911',
        statusPageEnabled: true,
        autoBackupEnabled: 'daily',
        backupRetention: '30days',
        errorLoggingLevel: 'standard'
    },

    init() {
        this.loadSettings();
        this.setupEventListeners();
        console.log('AdminSettings initialized');
    },

    loadSettings() {
        // Load settings from localStorage if available
        const savedSettings = localStorage.getItem('mediquick_admin_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
            } catch (error) {
                console.warn('Failed to load saved settings:', error);
            }
        }
        this.updateUI();
    },

    saveSettings() {
        localStorage.setItem('mediquick_admin_settings', JSON.stringify(this.settings));
        showNotification('Settings saved successfully!', 'success');
    },

    updateUI() {
        // Update form elements with current settings
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    },

    setupEventListeners() {
        // Setup form submission handlers
        const settingsForms = [
            'app-settings-form',
            'ux-settings-form',
            'services-settings-form',
            'notifications-settings-form',
            'email-settings-form',
            'payment-settings-form',
            'security-settings-form',
            'content-settings-form',
            'api-settings-form',
            'admin-settings-form',
            'emergency-settings-form'
        ];

        settingsForms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (formId === 'email-settings-form') {
                        this.handleEmailSettingsSubmission(form);
                    } else {
                        this.handleFormSubmission(form);
                    }
                });
            }
        });

        // Load email settings from Supabase
        this.loadEmailSettings();
    },

    handleFormSubmission(form) {
        const formData = new FormData(form);
        
        // Update settings object with form data
        for (let [key, value] of formData.entries()) {
            // Convert kebab-case to camelCase
            const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            
            // Handle different input types
            if (form.querySelector(`[name="${key}"]`).type === 'checkbox') {
                this.settings[camelKey] = value === 'on';
            } else if (form.querySelector(`[name="${key}"]`).type === 'number') {
                this.settings[camelKey] = parseInt(value) || 0;
            } else {
                this.settings[camelKey] = value;
            }
        }

        // Handle checkbox groups (like payment methods)
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const camelKey = checkbox.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            this.settings[camelKey] = checkbox.checked;
        });

        this.saveSettings();
    },

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'mediquick-settings.json';
        link.click();
        
        showNotification('Settings exported successfully!', 'success');
    },

    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                this.settings = { ...this.settings, ...importedSettings };
                this.saveSettings();
                this.updateUI();
                showNotification('Settings imported successfully!', 'success');
            } catch (error) {
                showNotification('Failed to import settings: Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    },

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
            localStorage.removeItem('mediquick_admin_settings');
            // Reload the page to reset everything
            location.reload();
        }
    },

    async loadEmailSettings() {
        try {
            const settings = await dbService.getEmailSettings();
            if (settings) {
                // Populate form fields with settings from Supabase
                document.getElementById('email-sender-name').value = settings.sender_name || '';
                document.getElementById('email-sender-email-display').value = settings.sender_email_display || '';
                document.getElementById('email-reply-to-email').value = settings.reply_to_email || '';
                document.getElementById('email-support-email').value = settings.support_email || '';
                document.getElementById('email-email-notifications-enabled').value = settings.email_notifications_enabled ? 'true' : 'false';
                document.getElementById('email-password-reset-subject').value = settings.password_reset_subject || '';
                document.getElementById('email-password-reset-enabled').value = settings.password_reset_enabled ? 'true' : 'false';
                document.getElementById('email-appointment-confirmation-subject').value = settings.appointment_confirmation_subject || '';
                document.getElementById('email-appointment-confirmation-enabled').value = settings.appointment_confirmation_enabled ? 'true' : 'false';
                document.getElementById('email-email-footer-text').value = settings.email_footer_text || '';
                document.getElementById('email-email-logo-url').value = settings.email_logo_url || '';
            }
        } catch (error) {
            console.error('Error loading email settings:', error);
            showNotification('Failed to load email settings: ' + error.message, 'error');
        }
    },

    async handleEmailSettingsSubmission(form) {
        try {
            const settings = await dbService.getEmailSettings();
            if (!settings) {
                showNotification('Email settings not found', 'error');
                return;
            }

            const updates = {
                sender_name: document.getElementById('email-sender-name').value,
                sender_email_display: document.getElementById('email-sender-email-display').value,
                reply_to_email: document.getElementById('email-reply-to-email').value,
                support_email: document.getElementById('email-support-email').value,
                email_notifications_enabled: document.getElementById('email-email-notifications-enabled').value === 'true',
                password_reset_subject: document.getElementById('email-password-reset-subject').value,
                password_reset_enabled: document.getElementById('email-password-reset-enabled').value === 'true',
                appointment_confirmation_subject: document.getElementById('email-appointment-confirmation-subject').value,
                appointment_confirmation_enabled: document.getElementById('email-appointment-confirmation-enabled').value === 'true',
                email_footer_text: document.getElementById('email-email-footer-text').value,
                email_logo_url: document.getElementById('email-email-logo-url').value,
                updated_at: new Date().toISOString()
            };

            await dbService.updateEmailSettings(settings.id, updates);
            showNotification('Email settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving email settings:', error);
            showNotification('Failed to save email settings: ' + error.message, 'error');
        }
    }
};

// Global variables for status handling

// Handle status change for inactive reason popup
function handleStatusChange(formMode) {
    const statusSelect = document.getElementById(formMode === 'add' ? 'add-doctor-status' : 'edit-doctor-status');
    if (statusSelect.value === 'inactive') {
        pendingStatusChange = {
            formMode: formMode,
            element: statusSelect
        };
        showModal('inactive-reason-modal');
    }
}

// Cancel inactive reason
function cancelInactiveReason() {
    if (pendingStatusChange) {
        const formMode = pendingStatusChange.formMode;
        const doctorId = formMode === 'edit' ? parseInt(document.getElementById('edit-doctor-id').value) : null;
        
        // If editing an existing inactive doctor, restore to inactive status
        if (formMode === 'edit' && doctorId) {
            const doctor = adminData.doctors.find(d => d.id === doctorId);
            if (doctor && doctor.status === 'inactive') {
                pendingStatusChange.element.value = 'inactive'; // Keep as inactive
            } else {
                pendingStatusChange.element.value = 'active'; // Reset to active for new or active doctors
            }
        } else {
            pendingStatusChange.element.value = 'active'; // Reset to active for new doctors
        }
        
        pendingStatusChange = null;
    }
    
    // Clear the form
    const form = document.getElementById('inactive-reason-form');
    if (form) {
        form.reset();
    }
    
    closeModal('inactive-reason-modal');
}

// Confirm inactive reason
function confirmInactiveReason() {
    const form = document.getElementById('inactive-reason-form');
    const formData = new FormData(form);

    if (!formData.get('inactiveReason')) {
        showNotification('Please select a reason for making doctor inactive.', 'error');
        return;
    }

    // Store the inactive reason data in persistent storage
    if (pendingStatusChange) {
        const formMode = pendingStatusChange.formMode;
        const doctorId = formMode === 'edit' ? parseInt(document.getElementById('edit-doctor-id').value) : 'new';
        
        doctorInactiveData[doctorId] = {
            reason: formData.get('inactiveReason'),
            details: formData.get('inactiveDetails'),
            returnDate: formData.get('returnDate')
        };
    }

    closeModal('inactive-reason-modal');
    form.reset();
    pendingStatusChange = null;
    showNotification('Inactive reason recorded. Please save changes to apply.', 'success');
}

// Add health tip
function addHealthTip(formMode) {
    const container = document.getElementById(formMode + '-health-tips-container');
    const tipItem = document.createElement('div');
    tipItem.className = 'health-tip-item';
    tipItem.innerHTML = `
        <button type="button" class="remove-item-btn" onclick="removeItem(this)">Remove</button>
        <div class="form-row">
            <div class="form-group">
                <label>Question</label>
                <input type="text" name="healthTipQuestion[]" placeholder="Enter health tip question">
            </div>
        </div>
        <div class="form-group">
            <label>Answer</label>
            <textarea name="healthTipAnswer[]" rows="2" placeholder="Enter answer"></textarea>
        </div>
    `;
    container.appendChild(tipItem);
}

// Add review
function addReview(formMode) {
    const container = document.getElementById(formMode + '-reviews-container');
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
        <button type="button" class="remove-item-btn" onclick="removeItem(this)">Remove</button>
        <div class="form-row">
            <div class="form-group">
                <label>Reviewer Name</label>
                <input type="text" name="reviewerName[]" placeholder="Patient name">
            </div>
            <div class="form-group">
                <label>Rating</label>
                <select name="reviewRating[]">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Review Text</label>
            <textarea name="reviewText[]" rows="2" placeholder="Enter review text"></textarea>
        </div>
    `;
    container.appendChild(reviewItem);
}

// Remove item
function removeItem(button) {
    button.parentElement.remove();
}

// Load health tips for edit
function loadHealthTipsForEdit(healthTips) {
    const container = document.getElementById('edit-health-tips-container');
    container.innerHTML = '';

    // If no health tips, use default FAQs (deep copy to avoid mutation)
    const tipsToLoad = (healthTips && healthTips.length > 0) ? healthTips : JSON.parse(JSON.stringify(DEFAULT_HEALTH_TIPS));

    tipsToLoad.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'health-tip-item';
        tipItem.innerHTML = `
            <button type="button" class="remove-item-btn" onclick="removeItem(this)">Remove</button>
            <div class="form-row">
                <div class="form-group">
                    <label>Question</label>
                    <input type="text" name="healthTipQuestion[]" value="${tip.question}" placeholder="Enter health tip question">
                </div>
            </div>
            <div class="form-group">
                <label>Answer</label>
                <textarea name="healthTipAnswer[]" rows="2" placeholder="Enter answer">${tip.answer}</textarea>
            </div>
        `;
        container.appendChild(tipItem);
    });
}

// Load reviews for edit
function loadReviewsForEdit(reviews) {
    const container = document.getElementById('edit-reviews-container');
    container.innerHTML = '';

    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <button type="button" class="remove-item-btn" onclick="removeItem(this)">Remove</button>
            <div class="form-row">
                <div class="form-group">
                    <label>Reviewer Name</label>
                    <input type="text" name="reviewerName[]" value="${review.reviewerName}" placeholder="Patient name">
                </div>
                <div class="form-group">
                    <label>Rating</label>
                    <select name="reviewRating[]">
                        <option value="5" ${review.rating === 5 ? 'selected' : ''}>5 Stars</option>
                        <option value="4" ${review.rating === 4 ? 'selected' : ''}>4 Stars</option>
                        <option value="3" ${review.rating === 3 ? 'selected' : ''}>3 Stars</option>
                        <option value="2" ${review.rating === 2 ? 'selected' : ''}>2 Stars</option>
                        <option value="1" ${review.rating === 1 ? 'selected' : ''}>1 Star</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Review Text</label>
                <textarea name="reviewText[]" rows="2" placeholder="Enter review text">${review.reviewText}</textarea>
            </div>
        `;
        container.appendChild(reviewItem);
    });
}

// Clear dynamic sections
function clearDynamicSections(formMode) {
    document.getElementById(formMode + '-health-tips-container').innerHTML = `
        <div class="health-tip-item">
            <div class="form-row">
                <div class="form-group">
                    <label>Question</label>
                    <input type="text" name="healthTipQuestion[]" placeholder="Enter health tip question">
                </div>
            </div>
            <div class="form-group">
                <label>Answer</label>
                <textarea name="healthTipAnswer[]" rows="2" placeholder="Enter answer"></textarea>
            </div>
        </div>
    `;

    document.getElementById(formMode + '-reviews-container').innerHTML = `
        <div class="review-item">
            <div class="form-row">
                <div class="form-group">
                    <label>Reviewer Name</label>
                    <input type="text" name="reviewerName[]" placeholder="Patient name">
                </div>
                <div class="form-group">
                    <label>Rating</label>
                    <select name="reviewRating[]">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Review Text</label>
                <textarea name="reviewText[]" rows="2" placeholder="Enter review text"></textarea>
            </div>
        </div>
    `;
}

// Filter appointments by status
function filterAppointmentsByStatus() {
    const statusFilter = document.getElementById('appointment-status-filter').value;

    if (!statusFilter) {
        loadAppointmentsTable();
        return;
    }

    const filteredAppointments = adminData.appointments.filter(appointment =>
        appointment.status === statusFilter
    );

    loadAppointmentsTable(filteredAppointments);
}

// View appointment details
function viewAppointmentDetails(appointmentId) {
    const appointment = adminData.appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    // Handle both camelCase (demo data) and snake_case (Supabase data)
    const userId = appointment.user_id || appointment.userId || 'N/A';
    const bookingId = appointment.booking_id || appointment.bookingId;
    const doctorName = appointment.doctor_name || appointment.doctorName;
    const doctorSpecialty = appointment.doctor_specialty || appointment.doctorSpecialty;
    const patientName = appointment.patient_name || appointment.patientName;
    const patientContact = appointment.patient_contact || appointment.patientContact;
    const patientGender = appointment.patient_gender || appointment.patientGender;
    const patientAge = appointment.patient_age || appointment.patientAge;
    const patientAddress = appointment.patient_address || appointment.patientAddress;

    // Get user information from users array
    const user = adminData.users.find(u => u.id === userId);
    const userName = user ? user.name : 'N/A';
    const userPoints = user ? (user.points || 0) : 0;

    // Populate modal with appointment details
    document.getElementById('detail-booking-id').textContent = bookingId || 'N/A';
    document.getElementById('detail-date').textContent = formatDate(appointment.date);
    document.getElementById('detail-time').textContent = appointment.time;

    const statusElement = document.getElementById('detail-status');
    statusElement.textContent = appointment.status;
    statusElement.className = `status-badge ${appointment.status}`;

    // Populate user information
    document.getElementById('detail-user-id').textContent = userId;
    document.getElementById('detail-user-name').textContent = userName;

    document.getElementById('detail-doctor-name').textContent = doctorName || 'N/A';
    document.getElementById('detail-doctor-specialty').textContent = doctorSpecialty || 'N/A';

    document.getElementById('detail-patient-name').textContent = patientName || 'N/A';
    document.getElementById('detail-patient-contact').textContent = patientContact || 'N/A';
    document.getElementById('detail-patient-gender').textContent = patientGender || 'N/A';
    document.getElementById('detail-patient-age').textContent = (patientAge ? patientAge + ' years' : 'N/A');
    document.getElementById('detail-patient-address').textContent = patientAddress || 'N/A';

    const bkashTransactionId = appointment.bkash_transaction_id || appointment.bkashTransactionId;
    const bkashNumber = appointment.bkash_number || appointment.bkashNumber;
    document.getElementById('detail-bkash-transaction-id').textContent = bkashTransactionId || 'N/A';
    document.getElementById('detail-bkash-number').textContent = bkashNumber || 'N/A';

    // Display real user points from user record
    document.getElementById('detail-user-points').textContent = userPoints;

    // Store current appointment ID and user ID for points update
    window.currentAppointmentId = appointmentId;
    window.currentAppointmentUserId = userId;

    showModal('appointment-details-modal');
}

// Update user points
async function updateUserPoints() {
    const pointsToAdd = parseInt(document.getElementById('points-to-add').value) || 0;
    const userId = window.currentAppointmentUserId;

    if (pointsToAdd <= 0 || pointsToAdd > 100) {
        showNotification('Please enter points between 1 and 100.', 'error');
        return;
    }

    if (!userId || userId === 'N/A') {
        showNotification('User ID not found for this appointment.', 'error');
        return;
    }

    // Find user in adminData.users
    const userIndex = adminData.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const currentPoints = adminData.users[userIndex].points || 0;
        const newPoints = currentPoints + pointsToAdd;
        
        // Update user points in local data
        adminData.users[userIndex].points = newPoints;

        // Update in database if available
        if (typeof window.dbService !== 'undefined') {
            try {
                await window.dbService.updateUser(userId, { points: newPoints });
                console.log(`✅ Updated points in database for user ${userId}: ${currentPoints} → ${newPoints}`);
            } catch (error) {
                console.error('Error updating points in database:', error);
            }
        }

        // Update the display
        document.getElementById('detail-user-points').textContent = newPoints;
        document.getElementById('points-to-add').value = '20'; // Reset to default

        // Refresh users table if on that section
        loadUsersTable();

        showNotification(`${pointsToAdd} loyalty points have been successfully added to user's account (Total: ${newPoints} points).`, 'success');
    } else {
        showNotification('User not found in the system.', 'error');
    }
}

// Edit blood donor
function editBloodDonor(donorId) {
    const donor = adminData.bloodDonors.find(d => d.id === donorId);
    if (!donor) return;

    // Populate the edit form
    document.getElementById('edit-donor-id').value = donor.id;
    document.getElementById('edit-donor-name').value = donor.name;
    document.getElementById('edit-donor-bloodGroup').value = donor.bloodGroup;
    document.getElementById('edit-donor-contact').value = donor.contact;
    document.getElementById('edit-donor-age').value = donor.age;
    document.getElementById('edit-donor-gender').value = donor.gender;
    document.getElementById('edit-donor-district').value = donor.district;
    document.getElementById('edit-donor-lastDonationDate').value = donor.lastDonationDate || '';
    document.getElementById('edit-donor-donationFrequency').value = donor.donationFrequency;
    document.getElementById('edit-donor-status').value = donor.status;
    document.getElementById('edit-donor-approved').value = donor.approved.toString();
    document.getElementById('edit-donor-photoUrl').value = donor.photoUrl || '';

    // Load upazila options for district
    updateDonorUpazilaOptions('edit');
    setTimeout(() => {
        document.getElementById('edit-donor-upazila').value = donor.upazila;
    }, 100);

    showModal('edit-donor-modal');
}

// Handle edit donor form submission
function handleEditDonor(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const donorId = parseInt(formData.get('id'));

    const donorIndex = adminData.bloodDonors.findIndex(d => d.id === donorId);
    if (donorIndex !== -1) {
        adminData.bloodDonors[donorIndex] = {
            ...adminData.bloodDonors[donorIndex],
            name: formData.get('name'),
            bloodGroup: formData.get('bloodGroup'),
            contact: formData.get('contact'),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            location: `${formData.get('district')}, ${formData.get('upazila')}`,
            lastDonationDate: formData.get('lastDonationDate') || null,
            lastDonation: formData.get('lastDonationDate') || null,
            donationFrequency: formData.get('donationFrequency'),
            status: formData.get('status'),
            approved: formData.get('approved') === 'true',
            photoUrl: formData.get('photoUrl') || null
        };

        loadBloodDonorsTable();
        closeModal('edit-donor-modal');
        showNotification(`${adminData.bloodDonors[donorIndex].name}'s donor profile has been updated successfully.`, 'success');
    }
}

// Delete blood donor
function deleteBloodDonor(donorId) {
    if (confirm('Are you sure you want to delete this blood donor?')) {
        adminData.bloodDonors = adminData.bloodDonors.filter(d => d.id !== donorId);
        loadBloodDonorsTable();
        loadDashboardStats();
        showNotification('Blood donor profile has been removed from the system and is no longer available for blood requests.', 'success');
    }
}

// View blood donor details
function viewBloodDonor(donorId) {
    const donor = adminData.bloodDonors.find(d => d.id === donorId);
    if (donor) {
        const details = `Donor Details:\n\n` +
            `Name: ${donor.name}\n` +
            `Blood Group: ${donor.bloodGroup}\n` +
            `Contact: ${donor.contact}\n` +
            `Age: ${donor.age} years\n` +
            `Gender: ${donor.gender}\n` +
            `Weight: ${donor.weight} kg\n` +
            `Location: ${donor.location}\n` +
            `Address: ${donor.address}\n` +
            `Emergency Contact: ${donor.emergencyContact}\n` +
            `Last Donation: ${donor.lastDonation || 'Never'}\n` +
            `Medical Conditions: ${donor.medicalConditions}\n` +
            `Medications: ${donor.medications}\n` +
            `Donation Frequency: ${donor.donationFrequency}\n` +
            `Status: ${donor.status}\n` +
            `Approved: ${donor.approved ? 'Yes' : 'No'}\n` +
            `Notes: ${donor.notes || 'None'}`;
        alert(details);
    }
}

// Approve donor
function approveDonor(donorId) {
    const donorIndex = adminData.bloodDonors.findIndex(d => d.id === donorId);
    if (donorIndex !== -1) {
        adminData.bloodDonors[donorIndex].approved = true;
        adminData.bloodDonors[donorIndex].approvalDate = new Date().toISOString().split('T')[0];
        adminData.bloodDonors[donorIndex].status = 'available';
        loadBloodDonorsTable();
        showNotification(`${adminData.bloodDonors[donorIndex].name} has been approved and is now available for blood donation requests.`, 'success');
    }
}

// Update upazila options for donor forms
window.updateDonorUpazilaOptions = function(formMode) {
    const districtSelect = document.getElementById(formMode === 'add' ? 'add-donor-district' : 'edit-donor-district');
    const upazilaSelect = document.getElementById(formMode === 'add' ? 'add-donor-upazila' : 'edit-donor-upazila');

    if (!districtSelect || !upazilaSelect) return;

    const selectedDistrict = districtSelect.value;

    // Clear current options
    upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

    const upazilaOptions = {
        'Rangpur': ['Rangpur Sadar', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj', 'Badarganj'],
        'Dinajpur': ['Dinajpur Sadar', 'Biral', 'Birampur', 'Birganj', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharol', 'Khansama', 'Nawabganj', 'Parbatipur'],
        'Kurigram': ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Nageshwari', 'Rajarhat', 'Raomari', 'Ulipur'],
        'Gaibandha': ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Sundarganj', 'Saghata'],
        'Lalmonirhat': ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'],
        'Nilphamari': ['Nilphamari Sadar', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj', 'Saidpur'],
        'Panchagarh': ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'],
        'Thakurgaon': ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail']
    };

    if (selectedDistrict && upazilaOptions[selectedDistrict]) {
        upazilaOptions[selectedDistrict].forEach(upazila => {
            const option = document.createElement('option');
            option.value = upazila;
            option.textContent = upazila;
            upazilaSelect.appendChild(option);
        });
    }
}

// Clear donor upazila options
function clearDonorUpazilaOptions(formMode) {
    const upazilaSelect = document.getElementById(formMode === 'add' ? 'add-donor-upazila' : 'edit-donor-upazila');
    if (upazilaSelect) {
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
    }
}

// Edit hospital function
function editHospital(hospitalId) {
    const hospital = adminData.hospitals.find(h => h.id === hospitalId);
    if (!hospital) return;

    // Populate basic information
    document.getElementById('edit-hospital-id').value = hospital.id;
    document.getElementById('edit-hospital-name').value = hospital.name;
    document.getElementById('edit-hospital-type').value = hospital.type;
    document.getElementById('edit-hospital-contact').value = hospital.contact;
    document.getElementById('edit-hospital-address').value = hospital.location;
    document.getElementById('edit-hospital-rating').value = hospital.rating || 4.5;
    document.getElementById('edit-hospital-reviewsCount').value = hospital.reviewsCount || 0;
    document.getElementById('edit-hospital-discountPercentage').value = hospital.discountPercentage || 0;
    document.getElementById('edit-hospital-specialOffer').value = hospital.specialOffer || '';
    document.getElementById('edit-hospital-offerText').value = hospital.specialOfferText || '';
    document.getElementById('edit-hospital-about').value = hospital.about || '';
    document.getElementById('edit-hospital-imageUrl').value = hospital.imageUrl || '';

    // Populate specialities checkboxes
    const specialityCheckboxes = document.querySelectorAll('#edit-hospital-modal input[name="specialities"]');
    specialityCheckboxes.forEach(checkbox => {
        checkbox.checked = hospital.specialities && hospital.specialities.includes(checkbox.value);
    });

    // Populate facilities
    if (hospital.facilities) {
        document.getElementById('edit-hospital-icuAvailable').value = hospital.facilities.icu?.available ? 'true' : 'false';
        document.getElementById('edit-hospital-icuBeds').value = hospital.facilities.icu?.bedCount || 0;
        document.getElementById('edit-hospital-ccuAvailable').value = hospital.facilities.ccu?.available ? 'true' : 'false';
        document.getElementById('edit-hospital-ccuBeds').value = hospital.facilities.ccu?.bedCount || 0;
        document.getElementById('edit-hospital-emergencyAvailable').value = hospital.facilities.emergency?.available ? 'true' : 'false';
        document.getElementById('edit-hospital-emergencyBeds').value = hospital.facilities.emergency?.bedCount || 0;
        document.getElementById('edit-hospital-operationTheater').value = hospital.facilities.operationTheater?.available ? 'true' : 'false';
        document.getElementById('edit-hospital-pharmacy').value = hospital.facilities.pharmacy?.available ? 'true' : 'false';
        document.getElementById('edit-hospital-laboratory').value = hospital.facilities.laboratory?.available ? 'true' : 'false';
        document.getElementById('edit-hospital-radiology').value = hospital.facilities.radiology?.available ? 'true' : 'false';
    }

    // Populate room pricing
    if (hospital.roomPricing) {
        document.getElementById('edit-hospital-generalWardBeds').value = hospital.roomPricing.generalWard?.beds || 0;
        document.getElementById('edit-hospital-generalWardPrice').value = hospital.roomPricing.generalWard?.originalPrice || 0;
        document.getElementById('edit-hospital-acCabinBeds').value = hospital.roomPricing.cabinAC?.beds || 0;
        document.getElementById('edit-hospital-acCabinPrice').value = hospital.roomPricing.cabinAC?.originalPrice || 0;
        document.getElementById('edit-hospital-nonAcCabinBeds').value = hospital.roomPricing.cabinNonAC?.beds || 0;
        document.getElementById('edit-hospital-nonAcCabinPrice').value = hospital.roomPricing.cabinNonAC?.originalPrice || 0;
        document.getElementById('edit-hospital-icuAvailableBeds').value = hospital.roomPricing.icu?.beds || 0;
        document.getElementById('edit-hospital-icuPrice').value = hospital.roomPricing.icu?.originalPrice || 0;
        document.getElementById('edit-hospital-ccuAvailableBeds').value = hospital.roomPricing.ccu?.beds || 0;
        document.getElementById('edit-hospital-ccuPrice').value = hospital.roomPricing.ccu?.originalPrice || 0;
    }

    showModal('edit-hospital-modal');
}

// Handle edit hospital form submission
function handleEditHospital(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const hospitalId = parseInt(formData.get('id'));

    const hospitalIndex = adminData.hospitals.findIndex(h => h.id === hospitalId);
    if (hospitalIndex !== -1) {
        // Get specialities
        const specialities = Array.from(formData.getAll('specialities'));

        // Calculate discount pricing
        const discountPercentage = parseInt(formData.get('discountPercentage')) || 0;
        const discountMultiplier = (100 - discountPercentage) / 100;

        // Build facilities object
        const facilities = {
            icu: {
                available: formData.get('icuAvailable') === 'true',
                bedCount: parseInt(formData.get('icuBeds')) || 0
            },
            ccu: {
                available: formData.get('ccuAvailable') === 'true',
                bedCount: parseInt(formData.get('ccuBeds')) || 0
            },
            emergency: {
                available: formData.get('emergencyAvailable') === 'true',
                bedCount: parseInt(formData.get('emergencyBeds')) || 0
            },
            operationTheater: { available: formData.get('operationTheater') === 'true' },
            pharmacy: { available: formData.get('pharmacy') === 'true' },
            laboratory: { available: formData.get('laboratory') === 'true' },
            radiology: { available: formData.get('radiology') === 'true' }
        };

        // Build room pricing object
        const roomPricing = {};

        const generalWardPrice = parseInt(formData.get('generalWardPrice')) || 0;
        if (generalWardPrice > 0) {
            roomPricing.generalWard = {
                beds: parseInt(formData.get('generalWardBeds')) || 0,
                originalPrice: generalWardPrice,
                discountedPrice: Math.round(generalWardPrice * discountMultiplier),
                savings: Math.round(generalWardPrice * (discountPercentage / 100))
            };
        }

        const acCabinPrice = parseInt(formData.get('acCabinPrice')) || 0;
        if (acCabinPrice > 0) {
            roomPricing.cabinAC = {
                beds: parseInt(formData.get('acCabinBeds')) || 0,
                originalPrice: acCabinPrice,
                discountedPrice: Math.round(acCabinPrice * discountMultiplier),
                savings: Math.round(acCabinPrice * (discountPercentage / 100))
            };
        }

        const nonAcCabinPrice = parseInt(formData.get('nonAcCabinPrice')) || 0;
        if (nonAcCabinPrice > 0) {
            roomPricing.cabinNonAC = {
                beds: parseInt(formData.get('nonAcCabinBeds')) || 0,
                originalPrice: nonAcCabinPrice,
                discountedPrice: Math.round(nonAcCabinPrice * discountMultiplier),
                savings: Math.round(nonAcCabinPrice * (discountPercentage / 100))
            };
        }

        const icuPrice = parseInt(formData.get('icuPrice')) || 0;
        if (icuPrice > 0) {
            roomPricing.icu = {
                beds: parseInt(formData.get('icuAvailableBeds')) || 0,
                originalPrice: icuPrice,
                discountedPrice: Math.round(icuPrice * discountMultiplier),
                savings: Math.round(icuPrice * (discountPercentage / 100))
            };
        }

        const ccuPrice = parseInt(formData.get('ccuPrice')) || 0;
        if (ccuPrice > 0) {
            roomPricing.ccu = {
                beds: parseInt(formData.get('ccuAvailableBeds')) || 0,
                originalPrice: ccuPrice,
                discountedPrice: Math.round(ccuPrice * discountMultiplier),
                savings: Math.round(ccuPrice * (discountPercentage / 100))
            };
        }

        // Calculate total and available beds
        const totalBeds = Object.values(roomPricing).reduce((sum, room) => sum + (room.beds || 0), 0);
        const availableBeds = Math.floor(totalBeds * 0.3); // 30% available

        // Prepare update data with correct database field names
        const updateData = {
            name: formData.get('name'),
            type: formData.get('type'),
            contact: formData.get('contact'),
            address: formData.get('address'),
            location: formData.get('address'), // Keep for backward compatibility
            image_url: formData.get('imageUrl') || null,
            rating: parseFloat(formData.get('rating')),
            reviews_count: parseInt(formData.get('reviewsCount')),
            discount_percentage: discountPercentage,
            special_offer: formData.get('specialOffer') || null,
            offer_text: formData.get('offerText') || null,
            about: formData.get('about') || null,
            specialities: specialities,
            facilities: facilities,
            room_pricing: roomPricing,
            total_beds: totalBeds,
            available_beds: availableBeds
        };

        // Update in database
        dbService.updateHospital(hospitalId, updateData)
            .then(() => {
                loadHospitalsTable();
                closeModal('edit-hospital-modal');
                showNotification(`${updateData.name} information has been updated with new facilities and pricing details.`, 'success');
            })
            .catch(error => {
                console.error('Error updating hospital:', error);
                showNotification('Error updating hospital: ' + error.message, 'error');
            });
    }
}

// Update upazila options for driver forms
function updateDriverUpazilaOptions(formMode) {
    const districtSelect = document.getElementById(formMode === 'add' ? 'add-driver-district' : 'edit-driver-district');
    const upazilaSelect = document.getElementById(formMode === 'add' ? 'add-driver-upazila' : 'edit-driver-upazila');

    if (!districtSelect || !upazilaSelect) return;

    const selectedDistrict = districtSelect.value;

    // Clear current options
    upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

    const upazilaOptions = {
        'Rangpur': ['Rangpur Sadar', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj', 'Badarganj'],
        'Dinajpur': ['Dinajpur Sadar', 'Biral', 'Birampur', 'Birganj', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharol', 'Khansama', 'Nawabganj', 'Parbatipur'],
        'Kurigram': ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Nageshwari', 'Rajarhat', 'Raomari', 'Ulipur'],
        'Gaibandha': ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Sundarganj', 'Saghata'],
        'Lalmonirhat': ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'],
        'Nilphamari': ['Nilphamari Sadar', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj', 'Saidpur'],
        'Panchagarh': ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'],
        'Thakurgaon': ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail']
    };

    if (selectedDistrict && upazilaOptions[selectedDistrict]) {
        upazilaOptions[selectedDistrict].forEach(upazila => {
            const option = document.createElement('option');
            option.value = upazila;
            option.textContent = upazila;
            upazilaSelect.appendChild(option);
        });
    }
}

// Clear driver upazila options
function clearDriverUpazilaOptions(formMode) {
    const upazilaSelect = document.getElementById(formMode === 'add' ? 'add-driver-upazila' : 'edit-driver-upazila');
    if (upazilaSelect) {
        upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
    }
}

// Delete hospital
function deleteHospital(hospitalId) {
    if (confirm('Are you sure you want to delete this hospital?')) {
        adminData.hospitals = adminData.hospitals.filter(h => h.id !== hospitalId);
        loadHospitalsTable();
        loadDashboardStats();
        showNotification('Hospital has been removed from the network and is no longer available for bookings.', 'success');
    }
}

// View hospital details
function viewHospital(hospitalId) {
    const hospital = adminData.hospitals.find(h => h.id === hospitalId);
    if (hospital) {
        let facilityDetails = '';
        if (hospital.facilities) {
            facilityDetails = Object.entries(hospital.facilities)
                .map(([key, value]) => {
                    if (typeof value === 'object') {
                        return `${key.toUpperCase()}: ${value.available ? 'Available' : 'Not Available'}${value.bedCount ? ` (${value.bedCount} beds)` : ''}`;
                    }
                    return `${key.toUpperCase()}: ${value ? 'Available' : 'Not Available'}`;
                })
                .join('\n');
        }

        let roomPricingDetails = '';
        if (hospital.roomPricing) {
            roomPricingDetails = Object.entries(hospital.roomPricing)
                .map(([roomType, details]) => {
                    const savings = details.savings > 0 ? ` (Save ৳${details.savings})` : '';
                    return `${roomType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${details.beds} beds - ৳${details.originalPrice}${details.discountedPrice !== details.originalPrice ? ` → ৳${details.discountedPrice}${savings}` : ''}`;
                })
                .join('\n');
        }

        const specialitiesText = hospital.specialities && hospital.specialities.length > 0
            ? hospital.specialities.join(', ')
            : 'Not specified';

        const details = `Hospital Details:\n\n` +
            `Name: ${hospital.name}\n` +
            `Type: ${hospital.type}\n` +
            `Rating: ${hospital.rating || 'N/A'} (${hospital.reviewsCount || 0} reviews)\n` +
            `Location: ${hospital.location}\n` +
            `Contact: ${hospital.contact}\n` +
            `Discount: ${hospital.discountPercentage || 0}%\n` +
            `Special Offer: ${hospital.specialOffer || 'None'}\n\n` +
            `About: ${hospital.about || 'Not provided'}\n\n` +
            `Specialities: ${specialitiesText}\n\n` +
            `Facilities:\n${facilityDetails || 'Not specified'}\n\n` +
            `Room Pricing:\n${roomPricingDetails || 'Not specified'}\n\n` +
            `Total Beds: ${hospital.totalBeds}\n` +
            `Available Beds: ${hospital.availableBeds}\n` +
            `Status: ${hospital.status}`;

        // Using a placeholder for CustomDialog as it's not defined in the original code
        // Replace with actual alert or modal if CustomDialog is available elsewhere
        if (typeof CustomDialog !== 'undefined' && CustomDialog.alert) {
            CustomDialog.alert(details, 'Hospital Details');
        } else {
            alert(details);
        }
    }
}

// Edit driver
function editDriver(driverId) {
    const driver = adminData.drivers.find(d => d.id === driverId);
    if (!driver) return;

    // Store driver ID for form submission
    const form = document.getElementById('edit-driver-form');
    form.dataset.driverId = driver.id;

    // Populate basic information
    document.getElementById('edit-driver-name').value = driver.name;
    document.getElementById('edit-driver-contact').value = driver.contact;
    document.getElementById('edit-driver-district').value = driver.district || driver.location.split(',')[0];
    document.getElementById('edit-driver-photo').value = driver.photo || '';

    // License & Experience
    document.getElementById('edit-driver-license').value = driver.license;
    document.getElementById('edit-driver-experience').value = driver.experience || 0;
    document.getElementById('edit-driver-license-expiry').value = driver.licenseExpiry || '';

    // Ambulance Information
    document.getElementById('edit-driver-ambulance-type').value = driver.ambulanceType || driver.vehicleType;
    document.getElementById('edit-driver-ambulance-reg').value = driver.ambulanceRegNo || '';
    document.getElementById('edit-driver-vehicle-model').value = driver.vehicleModel || '';
    document.getElementById('edit-driver-manufacturing-year').value = driver.manufacturingYear || '';

    // Availability & Status
    document.getElementById('edit-driver-availability').value = driver.availability || driver.status;
    document.getElementById('edit-driver-working-shift').value = driver.workingShift || 'flexible';
    document.getElementById('edit-driver-emergency-contact').value = driver.emergencyContact || '';
    document.getElementById('edit-driver-joining-date').value = driver.joiningDate || '';

    // Additional Information
    document.getElementById('edit-driver-service-area').value = driver.serviceArea || 'local';
    document.getElementById('edit-driver-rating').value = driver.rating || '';

    // Load upazila options for district
    updateDriverUpazilaOptions('edit');
    setTimeout(() => {
        const upazila = driver.upazila || driver.location.split(',')[1]?.trim();
        if (upazila) {
            document.getElementById('edit-driver-upazila').value = upazila;
        }
    }, 100);

    showModal('edit-driver-modal');
}

// Handle edit driver form submission
function handleEditDriver(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const driverId = parseInt(event.target.dataset.driverId);

    const driverIndex = adminData.drivers.findIndex(d => d.id === driverId);
    if (driverIndex !== -1) {
        adminData.drivers[driverIndex] = {
            ...adminData.drivers[driverIndex],
            name: formData.get('name'),
            contact: formData.get('contact'),
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            location: `${formData.get('district')}, ${formData.get('upazila')}`,
            photo: formData.get('photo') || null,
            license: formData.get('license'),
            licenseExpiry: formData.get('licenseExpiry') || null,
            experience: parseInt(formData.get('experience')) || 0,
            ambulanceType: formData.get('ambulanceType'),
            ambulanceRegNo: formData.get('ambulanceRegNo'),
            vehicleModel: formData.get('vehicleModel') || null,
            manufacturingYear: parseInt(formData.get('manufacturingYear')) || null,
            availability: formData.get('availability'),
            workingShift: formData.get('workingShift') || 'flexible',
            emergencyContact: formData.get('emergencyContact') || null,
            joiningDate: formData.get('joiningDate') || new Date().toISOString().split('T')[0],
            serviceArea: formData.get('serviceArea') || 'local',
            rating: parseFloat(formData.get('rating')) || null,
            status: formData.get('availability') || 'available',
            vehicleType: formData.get('ambulanceType') // Keep for backward compatibility
        };

        loadDriversTable();
        closeModal('edit-driver-modal');
        showNotification(`${adminData.drivers[driverIndex].name}'s profile and ambulance details have been updated successfully.`, 'success');
    }
}
function deleteDriver(driverId) {
    if (confirm('Are you sure you want to delete this driver?')) {
        adminData.drivers = adminData.drivers.filter(d => d.id !== driverId);
        loadDriversTable();
        loadDashboardStats();
        showNotification('Driver profile has been removed from the system and their ambulance is no longer available for booking.', 'success');
    }
}
function viewEmergencyRequest(type, requestId) {
    console.log('Viewing emergency request:', type, requestId);

    let request;
    switch(type) {
        case 'ambulance':
            request = adminData.emergencyServices.ambulanceRequests.find(r => r.id === requestId);
            if (request) {
                document.getElementById('ambulance-detail-id').textContent = request.id || 'N/A';
                document.getElementById('ambulance-detail-patient-name').textContent = request.patient_name || 'N/A';
                document.getElementById('ambulance-detail-contact').textContent = request.contact_number || 'N/A';
                document.getElementById('ambulance-detail-user-name').textContent = request.user_name || 'N/A';
                document.getElementById('ambulance-detail-user-id').textContent = request.user_id || 'N/A';
                
                // Handle driver fields conditionally
                const driverNameContainer = document.getElementById('ambulance-detail-driver-name-container');
                const driverIdContainer = document.getElementById('ambulance-detail-driver-id-container');
                
                if (request.driver_id) {
                    // Show driver fields if driver is assigned
                    document.getElementById('ambulance-detail-driver-name').textContent = request.driver_name || 'N/A';
                    document.getElementById('ambulance-detail-driver-id').textContent = request.driver_id || 'N/A';
                    driverNameContainer.style.display = 'flex';
                    driverIdContainer.style.display = 'flex';
                } else {
                    // Hide driver fields if no driver assigned
                    driverNameContainer.style.display = 'none';
                    driverIdContainer.style.display = 'none';
                }
                
                document.getElementById('ambulance-detail-pickup').textContent = request.pickup_location || 'N/A';
                document.getElementById('ambulance-detail-destination').textContent = request.destination_location || 'N/A';
                document.getElementById('ambulance-detail-type').textContent = request.ambulance_type || 'N/A';
                document.getElementById('ambulance-detail-emergency-type').textContent = request.priority_level || 'N/A';
                document.getElementById('ambulance-detail-status').textContent = request.status || 'pending';
                document.getElementById('ambulance-detail-time').textContent = request.request_time || 'N/A';
                document.getElementById('ambulance-detail-notes').textContent = request.notes || 'No additional notes';
                showModal('ambulance_requests-details-modal');
            }
            break;
        case 'blood':
            request = adminData.emergencyServices.bloodRequests.find(r => r.id === requestId);
            if (request) {
                document.getElementById('blood-detail-id').textContent = request.id || 'N/A';
                document.getElementById('blood-detail-patient-name').textContent = request.patient_name || 'N/A';
                document.getElementById('blood-detail-blood-group').textContent = request.blood_group || 'N/A';
                document.getElementById('blood-detail-units').textContent = (request.units_needed || 0) + ' units';
                document.getElementById('blood-detail-hospital').textContent = request.hospital_name || 'N/A';
                document.getElementById('blood-detail-contact').textContent = request.contact_number || 'N/A';
                document.getElementById('blood-detail-urgency').textContent = request.urgency || 'N/A';
                document.getElementById('blood-detail-status').textContent = request.status || 'pending';
                document.getElementById('blood-detail-time').textContent = request.request_time || 'N/A';
                document.getElementById('blood-detail-notes').textContent = request.notes || 'No additional notes';
                showModal('blood_requests-details-modal');
            }
            break;
        case 'hospital':
            request = adminData.emergencyServices.hospitalRequests.find(r => r.id === requestId);
            if (request) {
                let details = `${type.toUpperCase()} REQUEST DETAILS:\n\n`;
                details += `Request ID: ${request.requestId}\n`;
                details += `Patient: ${request.patientName}\n`;
                details += `Contact: ${request.contact}\n`;
                details += `Hospital: ${request.hospital}\n`;
                details += `Department: ${request.department}\n`;
                details += `Priority: ${request.priority}\n`;
                details += `Status: ${request.status}\n`;
                details += `Request Time: ${request.requestTime}`;
                alert(details);
            }
            break;
    }
}

// Helper function for error handling
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    // Potentially show a user-friendly error message on the UI
}

// ============= PAGE INITIALIZATION =============

// Initialize admin app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing admin application...');

    // Initialize authentication
    initializeAdminApp();

    // If user is authenticated, initialize dashboard
    if (adminSession.isLoggedIn) {
        // Setup navigation and load dashboard data
        setupNavigation();
        loadDashboardData(); // This function seems to be missing, but it's called. Assuming it's meant to load general dashboard stats.

        console.log('Admin dashboard initialized');
    }

    console.log('Admin application loaded');
});

// Placeholder function for loadDashboardData if it's not defined elsewhere
function loadDashboardData() {
    loadDashboardStats();
    loadRecentActivity();
    // Potentially load other dashboard-specific data here
}

// ====== SPECIALIST CATEGORIES MANAGEMENT ======

// Add Specialist Category Modal
function showAddSpecialistCategoryModal() {
    showModal('add-specialist-category-modal');
}

// Show add category modal (alias for specialist categories)
function showAddCategoryModal() {
    showModal('add-category-modal');
}

// Handle add category form submission
window.handleAddCategory = function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newCategory = {
        id: adminData.specialistCategories.length + 1,
        categoryKey: formData.get('categoryKey'),
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        iconClass: formData.get('iconClass'),
        iconColor: formData.get('iconColor'),
        iconUrl: formData.get('iconUrl') || null,
        searchTerms: formData.get('searchTerms').split(',').map(term => term.trim()).filter(term => term),
        status: formData.get('status'),
        sortOrder: parseInt(formData.get('sortOrder')) || adminData.specialistCategories.length + 1,
        description: formData.get('description')
    };

    adminData.specialistCategories.push(newCategory);
    loadSpecialistCategoriesTable();
    loadDashboardStats();

    closeModal('add-category-modal');
    event.target.reset();

    showNotification(`Specialist category "${newCategory.title}" has been added successfully.`, 'success');
};

// Handle edit category form submission
window.handleEditCategory = function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const categoryId = parseInt(formData.get('id'));

    const categoryIndex = adminData.specialistCategories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
        adminData.specialistCategories[categoryIndex] = {
            ...adminData.specialistCategories[categoryIndex],
            categoryKey: formData.get('categoryKey'),
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            iconClass: formData.get('iconClass'),
            iconColor: formData.get('iconColor'),
            searchTerms: formData.get('searchTerms').split(',').map(term => term.trim()).filter(term => term),
            status: formData.get('status'),
            sortOrder: parseInt(formData.get('sortOrder')),
            description: formData.get('description')
        };

        loadSpecialistCategoriesTable();
        closeModal('edit-category-modal');
        showNotification(`Specialist category "${adminData.specialistCategories[categoryIndex].title}" has been updated successfully.`, 'success');
    }
};

// Handle add specialist category form submission (called from add-category-modal)
async function handleAddCategory(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const searchTermsString = formData.get('searchTerms') || '';
    const searchTerms = searchTermsString.split(',').map(term => term.trim()).filter(term => term);
    
    const newCategory = {
        category_key: formData.get('categoryKey'),
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        icon_class: formData.get('iconClass'),
        icon_color: formData.get('iconColor'),
        icon_url: formData.get('iconUrl') || null,
        search_terms: searchTerms,
        sort_order: parseInt(formData.get('sortOrder')) || 0,
        is_active: formData.get('status') === 'active'
    };

    try {
        await dbService.createSpecialistCategory(newCategory);
        await loadSpecialistCategoriesTable();
        await loadDashboardStats();
        
        closeModal('add-category-modal');
        event.target.reset();
        
        showNotification(`Specialist category "${newCategory.title}" has been added successfully.`, 'success');
    } catch (error) {
        console.error('Error adding specialist category:', error);
        showNotification('Error adding specialist category: ' + error.message, 'error');
    }
}

// Edit Specialist Category
function editSpecialistCategory(categoryId) {
    const category = adminData.specialistCategories.find(c => c.id === categoryId);
    if (!category) return;

    // Populate edit form
    document.getElementById('edit-specialist-category-id').value = category.id;
    document.getElementById('edit-specialist-category-key').value = category.category_key;
    document.getElementById('edit-specialist-category-title').value = category.title;
    document.getElementById('edit-specialist-category-subtitle').value = category.subtitle || '';
    document.getElementById('edit-specialist-category-iconClass').value = category.icon_class;
    document.getElementById('edit-specialist-category-iconColor').value = category.icon_color;
    document.getElementById('edit-specialist-category-iconUrl').value = category.icon_url || '';
    document.getElementById('edit-specialist-category-searchTerms').value = category.search_terms ? category.search_terms.join(', ') : '';
    document.getElementById('edit-specialist-category-sortOrder').value = category.sort_order || 0;
    document.getElementById('edit-specialist-category-status').value = category.is_active ? 'active' : 'inactive';

    showModal('edit-specialist-category-modal');
}

// Handle edit specialist category form submission
async function handleEditSpecialistCategory(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const categoryId = parseInt(formData.get('id'));
    const searchTermsString = formData.get('searchTerms') || '';
    const searchTerms = searchTermsString.split(',').map(term => term.trim()).filter(term => term);

    const updates = {
        category_key: formData.get('categoryKey'),
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        icon_class: formData.get('iconClass'),
        icon_color: formData.get('iconColor'),
        icon_url: formData.get('iconUrl') || null,
        search_terms: searchTerms,
        sort_order: parseInt(formData.get('sortOrder')) || 0,
        is_active: formData.get('status') === 'active'
    };

    try {
        await dbService.updateSpecialistCategory(categoryId, updates);
        await loadSpecialistCategoriesTable();
        await loadDashboardStats();
        
        closeModal('edit-specialist-category-modal');
        showNotification(`Specialist category "${updates.title}" has been updated successfully.`, 'success');
    } catch (error) {
        console.error('Error updating specialist category:', error);
        showNotification('Error updating specialist category: ' + error.message, 'error');
    }
}

// Delete Specialist Category
async function deleteSpecialistCategory(categoryId) {
    if (confirm('Are you sure you want to delete this specialist category? This action cannot be undone.')) {
        try {
            await dbService.deleteSpecialistCategory(categoryId);
            await loadSpecialistCategoriesTable();
            await loadDashboardStats();
            
            showNotification('Specialist category has been deleted successfully.', 'success');
        } catch (error) {
            console.error('Error deleting specialist category:', error);
            showNotification('Error deleting specialist category: ' + error.message, 'error');
        }
    }
}

// ============= BANNER IMAGES MANAGEMENT =============

// Load all banner images from database
async function loadAllBannerImages() {
    try {
        const allImages = await dbService.getBannerImages();
        
        // Reset all categories
        adminData.bannerImages = {
            'home-hero-slider': [],
            'sponsor-banner': [],
            'blood-hero-slider': [],
            'donor-hero-image': [],
            'ambulance-hero-slider': [],
            'private-hospital-hero-slider': [],
            'pharmacy-promotional-image': []
        };
        
        // Group images by type
        allImages.forEach(img => {
            if (adminData.bannerImages[img.type]) {
                adminData.bannerImages[img.type].push(img);
            }
        });
        
        console.log('Loaded banner images from database:', adminData.bannerImages);
    } catch (error) {
        console.error('Error loading banner images:', error);
        showNotification('Error loading banner images: ' + error.message, 'error');
    }
}

// Setup banner image tabs
function setupBannerImageTabs() {
    const bannerTabButtons = document.querySelectorAll('.banner-tab-btn');
    bannerTabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchBannerTab(tab);
        });
    });

    // Set initial active tab based on currentBannerTab
    const activeTabButton = document.querySelector(`.banner-tab-btn[data-tab="${currentBannerTab}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
    }
}

// Load banner images section
async function loadBannerImagesSection() {
    await loadAllBannerImages();
    setupBannerImageTabs();
    loadBannerImagesForTab(currentBannerTab);
}

// Switch between banner tabs
function switchBannerTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.banner-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.banner-tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab content
    const targetContent = document.getElementById(tabName + '-tab');
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // Set active tab button
    const activeButton = document.querySelector(`.banner-tab-btn[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    currentBannerTab = tabName;
    loadBannerImagesForTab(tabName);
}

// Load banner images for specific tab
function loadBannerImagesForTab(tabName) {
    const imagesContainer = document.getElementById(`${tabName}-images`);
    if (!imagesContainer) return;

    const images = adminData.bannerImages[tabName] || [];
    imagesContainer.innerHTML = '';

    if (images.length === 0) {
        imagesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-images" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px;"></i>
                <p>No banner images found for this category</p>
                <button class="add-btn" onclick="showAddBannerImageModal('${tabName}')">
                    <i class="fas fa-plus"></i> Add First Image
                </button>
            </div>
        `;
    } else {
        images.forEach(image => {
            const imageCard = createBannerImageCard(image, tabName);
            imagesContainer.appendChild(imageCard);
        });
    }
}

// Create banner image card
function createBannerImageCard(image, tabName) {
    const card = document.createElement('div');
    card.className = 'banner-image-card';
    card.innerHTML = `
        <div class="banner-image-preview">
            <img src="${image.image_url}" alt="${image.type}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="image-error" style="display:none; align-items:center; justify-content:center; height:100%; background:#f5f5f5; color:#999;">
                <i class="fas fa-image" style="font-size:24px;"></i>
            </div>
        </div>
        <div class="banner-image-info">
            <div class="image-meta">
                <span class="sort-order">Order: ${image.sort_order}</span>
                <span class="status-badge ${image.status}">${image.status}</span>
            </div>
            <h4>${image.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
            <p><strong>Status:</strong> <span class="status-badge ${image.status}">${image.status}</span></p>
            <p><strong>Sort Order:</strong> ${image.sort_order}</p>
            <div class="image-actions">
                <button class="action-btn edit" onclick="editBannerImage(${image.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete" onclick="deleteBannerImage(${image.id}, '${tabName}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

// Toggle between URL input and file upload
function toggleImageSource(mode, value) {
    const urlInput = document.getElementById(`${mode}-url-input`);
    const fileInput = document.getElementById(`${mode}-file-input`);
    const urlField = document.getElementById(`${mode}-image-url`);
    const fileField = document.getElementById(`${mode}-image-file`);

    if (value === 'url') {
        urlInput.style.display = 'block';
        fileInput.style.display = 'none';
        if (urlField) urlField.required = true;
        if (fileField) fileField.required = false;
    } else {
        urlInput.style.display = 'none';
        fileInput.style.display = 'block';
        if (urlField) urlField.required = false;
        if (fileField) fileField.required = true;
    }
}

// Show add banner image modal
function showAddBannerImageModal(category = null) {
    const modal = document.getElementById('add-banner-image-modal');
    const categorySelect = modal.querySelector('select[name="category"]');

    if (category && categorySelect) {
        categorySelect.value = category;
    }

    toggleImageSource('add', 'url');
    showModal('add-banner-image-modal');
}

// Handle add banner image form submission
async function handleAddBannerImage(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const category = formData.get('category');
    const imageSource = formData.get('imageSource');
    const status = formData.get('status') || 'active';
    const sortOrder = parseInt(formData.get('sortOrder')) || 1;
    
    let imageUrl;

    try {
        if (imageSource === 'url') {
            imageUrl = formData.get('imageUrl');
            
            try {
                new URL(imageUrl);
            } catch {
                showNotification('Please enter a valid image URL', 'error');
                return;
            }
        } else {
            const imageFile = formData.get('imageFile');
            
            if (!imageFile || imageFile.size === 0) {
                showNotification('Please select an image file to upload', 'error');
                return;
            }

            if (imageFile.size > 5 * 1024 * 1024) {
                showNotification('File size must be less than 5MB', 'error');
                return;
            }

            const uploadFormData = new FormData();
            uploadFormData.append('bannerImage', imageFile);

            const uploadResponse = await fetch('https://mediquick-p37c.onrender.com/api/upload-banner', {
                method: 'POST',
                headers: {
                    'X-Admin-Password': adminSession.getPassword()
                },
                body: uploadFormData
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const uploadResult = await uploadResponse.json();
            imageUrl = uploadResult.imageUrl;
        }

        const newBanner = {
            type: category,
            image_url: imageUrl,
            sort_order: sortOrder,
            status: status
        };

        const savedBanner = await dbService.addBannerImage(newBanner);
        
        await loadAllBannerImages();
        
        if (currentBannerTab === category) {
            loadBannerImagesForTab(category);
        }

        loadDashboardStats();

        closeModal('add-banner-image-modal');
        event.target.reset();
        toggleImageSource('add', 'url');

        showNotification(`Banner image has been added to ${category.replace(/-/g, ' ')} successfully.`, 'success');
    } catch (error) {
        console.error('Error adding banner image:', error);
        showNotification('Error adding banner image: ' + error.message, 'error');
    }
}

// Edit banner image
function editBannerImage(imageId) {
    // Find the image across all categories
    let image = null;
    let imageCategory = null;

    for (const [category, images] of Object.entries(adminData.bannerImages)) {
        const foundImage = images.find(img => img.id === imageId);
        if (foundImage) {
            image = foundImage;
            imageCategory = category;
            break;
        }
    }

    if (!image) return;

    // Populate edit form
    document.getElementById('edit-banner-image-id').value = image.id;
    document.getElementById('edit-banner-image-category').value = imageCategory;
    document.getElementById('edit-banner-image-url').value = image.image_url;
    document.getElementById('edit-banner-image-status').value = image.status;
    document.getElementById('edit-banner-image-order').value = image.sort_order;

    toggleImageSource('edit', 'url');
    showModal('edit-banner-image-modal');
}

// Handle edit banner image form submission
async function handleEditBannerImage(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const imageId = parseInt(formData.get('id'));
    const newCategory = formData.get('category');
    const imageSource = formData.get('imageSource');
    const status = formData.get('status');
    const sortOrder = parseInt(formData.get('sortOrder'));
    
    let imageUrl;
    let oldImageUrl;

    try {
        const image = Object.values(adminData.bannerImages)
            .flat()
            .find(img => img.id === imageId);
        
        if (image) {
            oldImageUrl = image.image_url;
        }

        if (imageSource === 'url') {
            imageUrl = formData.get('imageUrl');
            
            try {
                new URL(imageUrl);
            } catch {
                showNotification('Please enter a valid image URL', 'error');
                return;
            }
        } else {
            const imageFile = formData.get('imageFile');
            
            if (!imageFile || imageFile.size === 0) {
                showNotification('Please select an image file to upload', 'error');
                return;
            }

            if (imageFile.size > 5 * 1024 * 1024) {
                showNotification('File size must be less than 5MB', 'error');
                return;
            }

            const uploadFormData = new FormData();
            uploadFormData.append('bannerImage', imageFile);

            const uploadResponse = await fetch('https://mediquick-p37c.onrender.com/api/upload-banner', {
                method: 'POST',
                headers: {
                    'X-Admin-Password': adminSession.getPassword()
                },
                body: uploadFormData
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const uploadResult = await uploadResponse.json();
            imageUrl = uploadResult.imageUrl;

            if (oldImageUrl && oldImageUrl.startsWith('/banners/')) {
                const filename = oldImageUrl.split('/').pop();
                await fetch(`/api/delete-banner/${filename}`, { 
                    method: 'DELETE',
                    headers: {
                        'X-Admin-Password': adminSession.getPassword()
                    }
                });
            }
        }

        const updates = {
            type: newCategory,
            image_url: imageUrl,
            status: status,
            sort_order: sortOrder
        };

        await window.supabase
            .from('banner_images')
            .update(updates)
            .eq('id', imageId);
        
        await loadAllBannerImages();
        loadBannerImagesForTab(currentBannerTab);

        closeModal('edit-banner-image-modal');
        showNotification('Banner image has been updated successfully.', 'success');
    } catch (error) {
        console.error('Error updating banner image:', error);
        showNotification('Error updating banner image: ' + error.message, 'error');
    }
}

// Delete banner image
async function deleteBannerImage(imageId, category) {
    if (!confirm('Are you sure you want to delete this banner image?')) return;

    try {
        const image = Object.values(adminData.bannerImages)
            .flat()
            .find(img => img.id === imageId);
        
        if (image && image.image_url && image.image_url.startsWith('/banners/')) {
            const filename = image.image_url.split('/').pop();
            try {
                await fetch(`/api/delete-banner/${filename}`, { 
                    method: 'DELETE',
                    headers: {
                        'X-Admin-Password': adminSession.getPassword()
                    }
                });
            } catch (fileError) {
                console.warn('Failed to delete file from server:', fileError);
            }
        }

        await dbService.deleteBannerImage(imageId);
        await loadAllBannerImages();
        loadBannerImagesForTab(currentBannerTab);
        loadDashboardStats();

        showNotification('Banner image has been deleted successfully.', 'success');
    } catch (error) {
        console.error('Error deleting banner image:', error);
        showNotification('Error deleting banner image: ' + error.message, 'error');
    }
}

// ============= REDEEM REQUESTS MANAGEMENT =============

// Load redeem requests table
window.loadRedeemRequestsTable = async function(filteredRequests = null) {
    try {
        const requests = filteredRequests || await dbService.getRedeemRequests();
        if (!filteredRequests) {
            adminData.redeemRequests = requests;
        }
        
        const tbody = document.getElementById('redeem-requests-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">No redeem requests found.</td></tr>';
            return;
        }
        
        requests.forEach(request => {
            const statusClass = request.status === 'pending' ? 'pending' : 
                               request.status === 'accepted' ? 'approved' : 'cancelled';
            
            const actionButtons = request.status === 'pending' ? `
                <button class="action-btn approve" onclick="acceptRedeemRequest(${request.id})">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button class="action-btn delete" onclick="cancelRedeemRequest(${request.id})">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="action-btn delete" onclick="deleteRedeemRequest(${request.id})" style="background: #dc2626;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            ` : `
                <button class="action-btn view" onclick="viewRedeemRequestDetails(${request.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn delete" onclick="deleteRedeemRequest(${request.id})" style="background: #dc2626;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            `;
            
            const row = `
                <tr>
                    <td><strong>${request.request_id}</strong></td>
                    <td>
                        <strong>${request.user_name}</strong><br>
                        <small>ID: ${request.user_id}</small><br>
                        <small>${request.user_email}</small><br>
                        <small>${request.user_mobile || 'N/A'}</small>
                    </td>
                    <td><span class="points-badge">${request.user_available_points} pts</span></td>
                    <td><span class="points-badge" style="background: #fef2f2; color: #dc2626;">${request.points_to_redeem} pts</span></td>
                    <td>${request.redeem_type}</td>
                    <td>${formatDate(request.request_date)}<br><small>${formatTime(request.request_date)}</small></td>
                    <td><span class="status-badge ${statusClass}">${request.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${actionButtons}
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading redeem requests:', error);
        showNotification('Error loading redeem requests: ' + error.message, 'error');
    }
};

// Filter redeem requests by status
window.filterRedeemRequestsByStatus = function() {
    const statusFilter = document.getElementById('redeem-status-filter').value;
    
    if (!statusFilter) {
        loadRedeemRequestsTable();
        return;
    }
    
    const filteredRequests = adminData.redeemRequests.filter(req => req.status === statusFilter);
    loadRedeemRequestsTable(filteredRequests);
};

// Accept redeem request
window.acceptRedeemRequest = async function(requestId) {
    if (!confirm('Are you sure you want to accept this redeem request? Points will be deducted from user account.')) {
        return;
    }
    
    try {
        const request = await dbService.getRedeemRequestById(requestId);
        if (!request || request.status !== 'pending') {
            showNotification('Request not found or already processed', 'error');
            return;
        }
        
        const user = await dbService.getUserById(request.user_id);
        if (!user) {
            showNotification('User not found', 'error');
            return;
        }
        
        const earnedPoints = user.points || 0;
        const adminAdjustedPoints = user.admin_adjusted_points || 0;
        const redeemRequests = await dbService.getRedeemRequestsByUserId(request.user_id);
        const acceptedRequests = redeemRequests.filter(req => req.status === 'accepted');
        const totalRedeemedPoints = acceptedRequests.reduce((sum, req) => sum + req.points_to_redeem, 0);
        
        const availablePoints = earnedPoints + adminAdjustedPoints - totalRedeemedPoints;
        
        if (availablePoints < request.points_to_redeem) {
            showNotification(`User does not have enough points. Available: ${availablePoints}, Requested: ${request.points_to_redeem}`, 'error');
            return;
        }
        
        await dbService.updateRedeemRequest(requestId, {
            status: 'accepted',
            processed_date: new Date().toISOString(),
            processed_by: 'admin'
        });
        
        // Send notification to user
        if (request.user_id) {
            try {
                const notificationData = {
                    user_id: request.user_id,
                    type: 'redeem',
                    title: 'Points Redeemed Successfully',
                    message: `Your redemption request of ${request.points_to_redeem} points for ${request.redeem_type} has been accepted and processed. Thank you!`,
                    is_read: false,
                    request_id: request.request_id || `${requestId}`,
                    request_type: 'redeem'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Redeem acceptance notification sent to user:', request.user_id);
            } catch (notifError) {
                console.error('Error sending redeem acceptance notification:', notifError);
            }
        }
        
        showNotification('Redeem request accepted successfully! Points will be deducted from user account.', 'success');
        loadRedeemRequestsTable();
        loadDashboardStats();
    } catch (error) {
        console.error('Error accepting redeem request:', error);
        showNotification('Error accepting redeem request: ' + error.message, 'error');
    }
};

// Cancel redeem request
window.cancelRedeemRequest = async function(requestId) {
    if (!confirm('Are you sure you want to cancel this redeem request? User will be notified.')) {
        return;
    }
    
    try {
        const request = await dbService.getRedeemRequestById(requestId);
        if (!request || request.status !== 'pending') {
            showNotification('Request not found or already processed', 'error');
            return;
        }
        
        await dbService.updateRedeemRequest(requestId, {
            status: 'cancelled',
            processed_date: new Date().toISOString(),
            processed_by: 'admin',
            cancellation_reason: 'Technical difficulties. Please contact support for solutions.'
        });
        
        // Send notification to user
        if (request.user_id) {
            try {
                const notificationData = {
                    user_id: request.user_id,
                    type: 'redeem',
                    title: 'Redemption Request Cancelled',
                    message: `Your redemption request of ${request.points_to_redeem} points has been cancelled due to technical difficulties. Please contact support for assistance.`,
                    is_read: false,
                    request_id: request.request_id || `${requestId}`,
                    request_type: 'redeem'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Redeem cancellation notification sent to user:', request.user_id);
            } catch (notifError) {
                console.error('Error sending redeem cancellation notification:', notifError);
            }
        }
        
        showNotification('Redeem request cancelled. User will be notified.', 'success');
        loadRedeemRequestsTable();
    } catch (error) {
        console.error('Error cancelling redeem request:', error);
        showNotification('Error cancelling redeem request: ' + error.message, 'error');
    }
};

// View redeem request details
window.viewRedeemRequestDetails = async function(requestId) {
    try {
        const request = await dbService.getRedeemRequestById(requestId);
        if (!request) {
            showNotification('Request not found', 'error');
            return;
        }
        
        const details = `Redeem Request Details:\n\n` +
            `Request ID: ${request.request_id}\n` +
            `User: ${request.user_name} (ID: ${request.user_id})\n` +
            `Email: ${request.user_email}\n` +
            `Mobile: ${request.user_mobile || 'N/A'}\n` +
            `Available Points: ${request.user_available_points}\n` +
            `Points to Redeem: ${request.points_to_redeem}\n` +
            `Redeem Type: ${request.redeem_type}\n` +
            `Status: ${request.status}\n` +
            `Request Date: ${formatDate(request.request_date)} ${formatTime(request.request_date)}\n` +
            `${request.processed_date ? 'Processed Date: ' + formatDate(request.processed_date) + ' ' + formatTime(request.processed_date) + '\n' : ''}` +
            `${request.cancellation_reason ? 'Cancellation Reason: ' + request.cancellation_reason : ''}`;
        
        alert(details);
    } catch (error) {
        console.error('Error viewing redeem request:', error);
        showNotification('Error loading request details', 'error');
    }
};

// Delete redeem request
window.deleteRedeemRequest = async function(requestId) {
    if (!confirm('Are you sure you want to permanently delete this redeem request? This action cannot be undone.')) {
        return;
    }
    
    try {
        await dbService.deleteRedeemRequest(requestId);
        showNotification('Redeem request deleted successfully.', 'success');
        loadRedeemRequestsTable();
    } catch (error) {
        console.error('Error deleting redeem request:', error);
        showNotification('Error deleting redeem request: ' + error.message, 'error');
    }
};

// Format time helper function
function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ============= END REDEEM REQUESTS MANAGEMENT =============

// ============= SPONSOR CONTENT MANAGEMENT =============

// Load sponsor content from database
async function loadSponsorContent() {
    try {
        console.log('Loading sponsor content...');
        
        const { data, error } = await supabase
            .from('sponsor_content')
            .select('*')
            .eq('status', 'active')
            .order('id', { ascending: false })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        if (data) {
            // Populate form fields with existing data
            document.getElementById('company-name').value = data.company_name || '';
            document.getElementById('company-tagline').value = data.company_tagline || '';
            document.getElementById('about-title').value = data.about_title || '';
            
            // Info cards
            document.getElementById('heritage-title').value = data.heritage_title || '';
            document.getElementById('heritage-description').value = data.heritage_description || '';
            
            document.getElementById('research-title').value = data.research_title || '';
            document.getElementById('research-description').value = data.research_description || '';
            
            document.getElementById('quality-title').value = data.quality_title || '';
            document.getElementById('quality-description').value = data.quality_description || '';
            
            document.getElementById('global-title').value = data.global_title || '';
            document.getElementById('global-description').value = data.global_description || '';
            
            // Stats
            document.getElementById('stat1-number').value = data.stat1_number || '';
            document.getElementById('stat1-label').value = data.stat1_label || '';
            document.getElementById('stat2-number').value = data.stat2_number || '';
            document.getElementById('stat2-label').value = data.stat2_label || '';
            document.getElementById('stat3-number').value = data.stat3_number || '';
            document.getElementById('stat3-label').value = data.stat3_label || '';
            document.getElementById('stat4-number').value = data.stat4_number || '';
            document.getElementById('stat4-label').value = data.stat4_label || '';
            
            // Partnership
            document.getElementById('partnership-title').value = data.partnership_title || '';
            document.getElementById('partnership-description').value = data.partnership_description || '';
            
            console.log('✅ Sponsor content loaded successfully');
        } else {
            console.log('No sponsor content found in database');
        }
    } catch (error) {
        console.error('Error loading sponsor content:', error);
        showNotification('Error loading sponsor content: ' + error.message, 'error');
    }
}

// Save sponsor content to database
async function saveSponsorContent(event) {
    event.preventDefault();
    
    try {
        const form = document.getElementById('sponsor-content-form');
        const formData = new FormData(form);
        
        const sponsorData = {
            company_name: formData.get('company_name'),
            company_tagline: formData.get('company_tagline'),
            about_title: formData.get('about_title'),
            heritage_title: formData.get('heritage_title'),
            heritage_description: formData.get('heritage_description'),
            research_title: formData.get('research_title'),
            research_description: formData.get('research_description'),
            quality_title: formData.get('quality_title'),
            quality_description: formData.get('quality_description'),
            global_title: formData.get('global_title'),
            global_description: formData.get('global_description'),
            stat1_number: formData.get('stat1_number'),
            stat1_label: formData.get('stat1_label'),
            stat2_number: formData.get('stat2_number'),
            stat2_label: formData.get('stat2_label'),
            stat3_number: formData.get('stat3_number'),
            stat3_label: formData.get('stat3_label'),
            stat4_number: formData.get('stat4_number'),
            stat4_label: formData.get('stat4_label'),
            partnership_title: formData.get('partnership_title'),
            partnership_description: formData.get('partnership_description'),
            updated_at: new Date().toISOString()
        };
        
        // Check if sponsor content already exists
        const { data: allActive, error: checkError } = await supabase
            .from('sponsor_content')
            .select('id')
            .eq('status', 'active')
            .order('id', { ascending: false });
        
        if (checkError) {
            throw checkError;
        }
        
        // If multiple active records exist, clean up duplicates
        if (allActive && allActive.length > 1) {
            console.log(`Found ${allActive.length} active sponsor records, cleaning up duplicates...`);
            
            // Keep the first one, deactivate the rest
            const idsToDeactivate = allActive.slice(1).map(item => item.id);
            await supabase
                .from('sponsor_content')
                .update({ status: 'inactive' })
                .in('id', idsToDeactivate);
        }
        
        if (allActive && allActive.length > 0) {
            // Update existing record (the first/latest one)
            const { error } = await supabase
                .from('sponsor_content')
                .update(sponsorData)
                .eq('id', allActive[0].id);
            
            if (error) throw error;
            
            showNotification('Sponsor content updated successfully!', 'success');
        } else {
            // Insert new record
            const { error } = await supabase
                .from('sponsor_content')
                .insert([{
                    ...sponsorData,
                    status: 'active'
                }]);
            
            if (error) throw error;
            
            showNotification('Sponsor content created successfully!', 'success');
        }
        
        console.log('✅ Sponsor content saved successfully');
        
        // Reload to show updated data
        await loadSponsorContent();
        
    } catch (error) {
        console.error('Error saving sponsor content:', error);
        showNotification('Error saving sponsor content: ' + error.message, 'error');
    }
}

// Make functions globally accessible
window.loadSponsorContent = loadSponsorContent;
window.saveSponsorContent = saveSponsorContent;

// ============= END SPONSOR CONTENT MANAGEMENT =============

// ============= BKASH PAYMENT GATEWAY MANAGEMENT =============

// Load bKash section
async function loadBkashSection() {
    console.log('Loading bKash section...');
    
    try {
        // Fetch bKash config from backend
        const response = await fetch('https://mediquick-p37c.onrender.com/api/admin/bkash-config', {
            headers: {
                'x-admin-password': adminSession.getPassword()
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.config) {
            const config = data.config;
            
            // Update form fields (only if credentials exist)
            if (config.hasCredentials) {
                document.getElementById('bkash-is-sandbox').value = config.is_sandbox ? 'true' : 'false';
                document.getElementById('bkash-is-active').value = config.is_active ? 'true' : 'false';
            }
            
            // Update status display
            updateBkashStatusDisplay(config);
        } else {
            // Load sandbox defaults if no config exists
            loadSandboxCredentials();
        }
        
        // Setup form submit handler
        const form = document.getElementById('bkash-credentials-form');
        if (form && !form.hasAttribute('data-listener')) {
            form.setAttribute('data-listener', 'true');
            form.addEventListener('submit', saveBkashCredentials);
        }
        
    } catch (error) {
        console.error('Error loading bKash config:', error);
        showNotification('Error loading bKash configuration', 'error');
        // Load sandbox defaults on error
        loadSandboxCredentials();
    }
}

// Update bKash status display
function updateBkashStatusDisplay(config) {
    const envStatus = document.getElementById('bkash-env-status');
    const activeStatus = document.getElementById('bkash-active-status');
    const credentialsStatus = document.getElementById('bkash-credentials-status');
    
    if (envStatus) {
        envStatus.textContent = config.is_sandbox ? 'Sandbox (Testing)' : 'Production (Live)';
        envStatus.style.color = config.is_sandbox ? '#ff9800' : '#4caf50';
    }
    
    if (activeStatus) {
        activeStatus.textContent = config.is_active ? 'Active' : 'Inactive';
        activeStatus.style.color = config.is_active ? '#4caf50' : '#f44336';
    }
    
    if (credentialsStatus) {
        credentialsStatus.textContent = config.hasCredentials ? 'Configured' : 'Not Set';
        credentialsStatus.style.color = config.hasCredentials ? '#4caf50' : '#f44336';
    }
}

// Save bKash credentials
async function saveBkashCredentials(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        const formData = {
            username: document.getElementById('bkash-username').value,
            password: document.getElementById('bkash-password').value,
            app_key: document.getElementById('bkash-app-key').value,
            app_secret: document.getElementById('bkash-app-secret').value,
            is_sandbox: document.getElementById('bkash-is-sandbox').value === 'true',
            is_active: document.getElementById('bkash-is-active').value === 'true'
        };
        
        const response = await fetch('https://mediquick-p37c.onrender.com/api/admin/bkash-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': adminSession.getPassword()
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('bKash credentials saved successfully!', 'success');
            
            // Update status display
            updateBkashStatusDisplay({
                is_sandbox: formData.is_sandbox,
                is_active: formData.is_active,
                hasCredentials: true
            });
        } else {
            throw new Error(data.error || 'Failed to save credentials');
        }
        
    } catch (error) {
        console.error('Error saving bKash credentials:', error);
        showNotification('Error: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Load sandbox credentials (default values)
function loadSandboxCredentials() {
    document.getElementById('bkash-username').value = 'sandboxTokenizedUser02';
    document.getElementById('bkash-password').value = 'sandboxTokenizedUser02@12345';
    document.getElementById('bkash-app-key').value = '4f6o0cjiki2rfm34kfdadl1eqq';
    document.getElementById('bkash-app-secret').value = '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b';
    document.getElementById('bkash-is-sandbox').value = 'true';
    document.getElementById('bkash-is-active').value = 'true';
    
    showNotification('Sandbox credentials loaded. Click "Save Credentials" to apply.', 'info');
}

// Test bKash connection
async function testBkashConnection() {
    const testBtn = event.target;
    const originalText = testBtn.innerHTML;
    testBtn.disabled = true;
    testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    
    try {
        // Create a test payment with small amount
        const response = await fetch('https://mediquick-p37c.onrender.com/api/bkash/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: 10,
                invoiceNumber: 'TEST-' + Date.now(),
                userId: '01700000000'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Connection successful! bKash API is working.', 'success');
        } else {
            throw new Error(data.error || 'Connection test failed');
        }
        
    } catch (error) {
        console.error('bKash connection test error:', error);
        showNotification('Connection failed: ' + error.message, 'error');
    } finally {
        testBtn.disabled = false;
        testBtn.innerHTML = originalText;
    }
}

// Make functions globally accessible
window.loadBkashSection = loadBkashSection;
window.saveBkashCredentials = saveBkashCredentials;
window.loadSandboxCredentials = loadSandboxCredentials;
window.testBkashConnection = testBkashConnection;

// ============= END BKASH PAYMENT GATEWAY MANAGEMENT =============

// ============= BKASH SEND MONEY SETTINGS MANAGEMENT =============

// Load bKash Send Money section
async function loadBkashSendMoneySection() {
    console.log('Loading bKash Send Money section...');
    
    try {
        // Fetch bKash Send Money settings from backend
        const response = await fetch('https://mediquick-p37c.onrender.com/api/admin/bkash-send-money-settings', {
            headers: {
                'x-admin-password': adminSession.getPassword()
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.settings) {
            const settings = data.settings;
            
            // Update form fields
            document.getElementById('send-money-account-number').value = settings.account_number || '';
            document.getElementById('send-money-account-name').value = settings.account_name || '';
            document.getElementById('send-money-instructions').value = settings.instructions || '';
            document.getElementById('send-money-is-active').value = settings.is_active ? 'true' : 'false';
            
            // Update preview
            updateBkashSendMoneyPreview(settings);
        }
        
        // Setup form submit handler
        const form = document.getElementById('bkash-send-money-form');
        if (form && !form.hasAttribute('data-listener')) {
            form.setAttribute('data-listener', 'true');
            form.addEventListener('submit', saveBkashSendMoneySettings);
        }
        
        // Setup real-time preview updates
        setupBkashSendMoneyPreview();
        
    } catch (error) {
        console.error('Error loading bKash Send Money settings:', error);
        showNotification('Error loading bKash Send Money settings', 'error');
    }
}

// Update bKash Send Money preview
function updateBkashSendMoneyPreview(settings) {
    const accountNumberEl = document.getElementById('preview-account-number');
    const accountNameEl = document.getElementById('preview-account-name');
    const statusEl = document.getElementById('preview-status');
    
    if (accountNumberEl) {
        accountNumberEl.textContent = settings.account_number || '01750123456';
    }
    
    if (accountNameEl) {
        accountNameEl.textContent = settings.account_name || 'MediQuick Healthcare Ltd.';
    }
    
    if (statusEl) {
        statusEl.textContent = settings.is_active ? 'Active' : 'Inactive';
        statusEl.style.color = settings.is_active ? '#4CAF50' : '#f44336';
    }
}

// Setup real-time preview updates
function setupBkashSendMoneyPreview() {
    const accountNumberInput = document.getElementById('send-money-account-number');
    const accountNameInput = document.getElementById('send-money-account-name');
    const statusSelect = document.getElementById('send-money-is-active');
    
    if (accountNumberInput) {
        accountNumberInput.addEventListener('input', function() {
            const preview = document.getElementById('preview-account-number');
            if (preview) preview.textContent = this.value || '01750123456';
        });
    }
    
    if (accountNameInput) {
        accountNameInput.addEventListener('input', function() {
            const preview = document.getElementById('preview-account-name');
            if (preview) preview.textContent = this.value || 'MediQuick Healthcare Ltd.';
        });
    }
    
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            const preview = document.getElementById('preview-status');
            if (preview) {
                const isActive = this.value === 'true';
                preview.textContent = isActive ? 'Active' : 'Inactive';
                preview.style.color = isActive ? '#4CAF50' : '#f44336';
            }
        });
    }
}

// Save bKash Send Money settings
async function saveBkashSendMoneySettings(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        const formData = {
            account_number: document.getElementById('send-money-account-number').value,
            account_name: document.getElementById('send-money-account-name').value,
            instructions: document.getElementById('send-money-instructions').value,
            is_active: document.getElementById('send-money-is-active').value === 'true'
        };
        
        const response = await fetch('https://mediquick-p37c.onrender.com/api/admin/bkash-send-money-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': adminSession.getPassword()
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('bKash Send Money settings saved successfully!', 'success');
            
            // Update preview
            updateBkashSendMoneyPreview(formData);
        } else {
            throw new Error(data.error || 'Failed to save settings');
        }
        
    } catch (error) {
        console.error('Error saving bKash Send Money settings:', error);
        showNotification('Error: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Reload bKash Send Money settings
function loadBkashSendMoneySettings() {
    loadBkashSendMoneySection();
    showNotification('Settings reloaded', 'info');
}

// Make functions globally accessible
window.loadBkashSendMoneySection = loadBkashSendMoneySection;
window.saveBkashSendMoneySettings = saveBkashSendMoneySettings;
window.loadBkashSendMoneySettings = loadBkashSendMoneySettings;

// ============= END BKASH SEND MONEY SETTINGS MANAGEMENT =============

// ============= STARTING ADS POPUP MANAGEMENT =============

// Load starting ads popup data
async function loadStartingAdsData() {
    try {
        const { data, error } = await supabase
            .from('starting_ads_popup')
            .select('*')
            .limit(1)
            .maybeSingle();

        // Handle case where no data exists yet (fresh setup)
        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (data) {
            // Populate form fields with existing data
            document.getElementById('popup-title').value = data.title || '';
            document.getElementById('popup-description').value = data.description || '';
            document.getElementById('popup-image-url').value = data.image_url || '';
            document.getElementById('popup-button-text').value = data.button_text || 'Get Started';
            document.getElementById('popup-auto-close').value = data.auto_close_seconds || 5;
            document.getElementById('popup-is-active').value = data.is_active ? 'true' : 'false';

            // Populate benefits list
            const benefitsContainer = document.getElementById('benefits-list-container');
            benefitsContainer.innerHTML = '';
            
            const benefits = Array.isArray(data.benefits) ? data.benefits : [];
            if (benefits.length > 0) {
                benefits.forEach(benefit => {
                    addBenefitField(benefit);
                });
            } else {
                addBenefitField('');
            }
        } else {
            // No data exists yet - set default values
            document.getElementById('popup-title').value = 'Welcome to MediQuick! 🏥';
            document.getElementById('popup-description').value = 'Your complete healthcare solution at your fingertips';
            document.getElementById('popup-image-url').value = 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png';
            document.getElementById('popup-button-text').value = 'Explore Now';
            document.getElementById('popup-auto-close').value = 5;
            document.getElementById('popup-is-active').value = 'true';

            // Populate with default benefits
            const benefitsContainer = document.getElementById('benefits-list-container');
            benefitsContainer.innerHTML = '';
            const defaultBenefits = [
                '✅ Book appointments with verified doctors instantly',
                '🚑 24/7 Emergency ambulance service',
                '🩸 Find blood donors in your area',
                '💊 Order medicines with up to 30% discount',
                '🎁 Earn reward points on every booking',
                '📱 Track all your health records in one place'
            ];
            defaultBenefits.forEach(benefit => addBenefitField(benefit));
        }
    } catch (error) {
        console.error('Error loading starting ads data:', error);
        showNotification('Error loading popup data: ' + error.message, 'error');
    }
}

// Add a benefit input field
function addBenefit() {
    addBenefitField('');
}

function addBenefitField(value = '') {
    const container = document.getElementById('benefits-list-container');
    const benefitItem = document.createElement('div');
    benefitItem.className = 'benefit-item';
    benefitItem.innerHTML = `
        <input type="text" class="benefit-input" placeholder="Enter a benefit" value="${escapeHtml(value)}" />
        <button type="button" class="remove-benefit-btn" onclick="removeBenefit(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(benefitItem);
}

// Remove a benefit field
function removeBenefit(button) {
    const container = document.getElementById('benefits-list-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        showNotification('At least one benefit is required', 'warning');
    }
}

// Save starting ads data
async function saveStartingAdsData(event) {
    event.preventDefault();
    
    try {
        // Collect benefits
        const benefitInputs = document.querySelectorAll('.benefit-input');
        const benefits = Array.from(benefitInputs)
            .map(input => input.value.trim())
            .filter(value => value.length > 0);

        if (benefits.length === 0) {
            showNotification('Please add at least one benefit', 'warning');
            return;
        }

        const formData = {
            title: document.getElementById('popup-title').value.trim(),
            description: document.getElementById('popup-description').value.trim(),
            benefits: benefits,
            image_url: document.getElementById('popup-image-url').value.trim() || null,
            button_text: document.getElementById('popup-button-text').value.trim(),
            auto_close_seconds: parseInt(document.getElementById('popup-auto-close').value),
            is_active: document.getElementById('popup-is-active').value === 'true',
            updated_at: new Date().toISOString()
        };

        // Check if record exists
        const { data: existing } = await supabase
            .from('starting_ads_popup')
            .select('id')
            .limit(1)
            .single();

        let result;
        if (existing) {
            // Update existing record
            result = await supabase
                .from('starting_ads_popup')
                .update(formData)
                .eq('id', existing.id);
        } else {
            // Insert new record
            result = await supabase
                .from('starting_ads_popup')
                .insert([formData]);
        }

        if (result.error) throw result.error;

        showNotification('Starting ads popup updated successfully!', 'success');
        loadStartingAdsData();
    } catch (error) {
        console.error('Error saving starting ads data:', error);
        showNotification('Error saving popup data: ' + error.message, 'error');
    }
}

// Preview the popup
function previewStartingAds() {
    const title = document.getElementById('popup-title').value.trim();
    const description = document.getElementById('popup-description').value.trim();
    const imageUrl = document.getElementById('popup-image-url').value.trim();
    const buttonText = document.getElementById('popup-button-text').value.trim();
    const autoCloseSeconds = parseInt(document.getElementById('popup-auto-close').value);
    
    const benefitInputs = document.querySelectorAll('.benefit-input');
    const benefits = Array.from(benefitInputs)
        .map(input => input.value.trim())
        .filter(value => value.length > 0);

    const previewArea = document.getElementById('popup-preview-area');
    
    let benefitsList = '';
    if (benefits.length > 0) {
        benefitsList = '<ul style="text-align: left; margin: 20px auto; max-width: 400px; list-style: none; padding: 0;">';
        benefits.forEach(benefit => {
            benefitsList += `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><i class="fas fa-check-circle" style="color: #10b981; margin-right: 8px;"></i>${escapeHtml(benefit)}</li>`;
        });
        benefitsList += '</ul>';
    }

    previewArea.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 500px; margin: 0 auto;">
            ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%;" onerror="this.style.display='none'" />` : ''}
            <h2 style="color: #1e293b; margin-bottom: 10px; font-size: 24px;">${escapeHtml(title)}</h2>
            <p style="color: #64748b; margin-bottom: 20px;">${escapeHtml(description)}</p>
            ${benefitsList}
            <button style="background: linear-gradient(135deg, #673AB7, #9575CD); color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 15px;">
                ${escapeHtml(buttonText)}
            </button>
            <p style="color: #999; font-size: 12px; margin-top: 15px;">Auto-closes in ${autoCloseSeconds} seconds</p>
        </div>
    `;
}

// Initialize starting ads section
function initializeStartingAdsSection() {
    loadStartingAdsData();
    
    // Add form submit handler
    const form = document.getElementById('starting-ads-form');
    if (form) {
        form.addEventListener('submit', saveStartingAdsData);
    }
}

// Make functions globally accessible
window.addBenefit = addBenefit;
window.removeBenefit = removeBenefit;
window.previewStartingAds = previewStartingAds;
window.loadStartingAdsData = loadStartingAdsData;
window.initializeStartingAdsSection = initializeStartingAdsSection;

// ============= END STARTING ADS POPUP MANAGEMENT =============

// Logout function
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin session
        adminSession.clearSession();

        // Show login screen instead of redirecting
        showAdminLogin();

        // Clear login form
        document.getElementById('admin-login-form').reset();

        // Show logout message
        setTimeout(() => {
            showNotification('Successfully logged out', 'info');
        }, 300);
    }
}