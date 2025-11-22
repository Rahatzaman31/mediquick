window.supabaseDataLoaded = false;
window.supabaseSubscriptions = [];
window.bannerImagesCache = {};

function findAndClearArray(arrayName) {
    const scripts = Array.from(document.querySelectorAll('script[src*="script.js"]'));
    
    if (typeof window[arrayName] !== 'undefined') {
        return window[arrayName];
    }
    
    const possibleNames = [arrayName, `${arrayName}Database`, arrayName.replace('Database', '')];
    for (const name of possibleNames) {
        if (typeof window[name] !== 'undefined' && Array.isArray(window[name])) {
            return window[name];
        }
    }
    return null;
}

function mapSpecialtyToCategory(specialty) {
    if (!specialty) return 'general';
    
    const specialtyMap = {
        'dentistry': 'dentists',
        'dental': 'dentists',
        'cardiology': 'cardiology',
        'cardiac': 'cardiology',
        'dermatology': 'dermatology',
        'skin': 'dermatology',
        'ent': 'ent',
        'ear nose throat': 'ent',
        'pediatrics': 'pediatrics',
        'pediatric': 'pediatrics',
        'child': 'pediatrics',
        'orthopedics': 'orthopedics',
        'orthopedic': 'orthopedics',
        'bone': 'orthopedics',
        'neurology': 'neurology',
        'neuro': 'neurology',
        'brain': 'neurology',
        'gynecology': 'gynecology',
        'gynae': 'gynecology',
        'obstetrics': 'gynecology',
        'women': 'gynecology',
        'ophthalmology': 'ophthalmology',
        'eye': 'ophthalmology',
        'psychiatry': 'psychiatry',
        'mental': 'psychiatry',
        'psychology': 'psychology',
        'general': 'general',
        'pulmonology': 'pulmonology',
        'lung': 'pulmonology',
        'oncology': 'oncology',
        'cancer': 'oncology',
        'gastroenterology': 'gastroenterology',
        'gastro': 'gastroenterology',
        'stomach': 'gastroenterology',
        'medicine': 'medicine',
        'emergency': 'medicine'
    };
    
    const normalizedSpecialty = specialty.toLowerCase().trim();
    
    const sortedEntries = Object.entries(specialtyMap).sort((a, b) => b[0].length - a[0].length);
    
    for (const [key, value] of sortedEntries) {
        if (normalizedSpecialty.includes(key)) {
            return value;
        }
    }
    
    return normalizedSpecialty.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function refreshDoctorsData() {
    try {
        const doctors = await dbService.getDoctors();
        let doctorsDb = findAndClearArray('doctorsDatabase');
        
        if (doctorsDb && Array.isArray(doctorsDb)) {
            doctorsDb.length = 0;
            
            if (doctors.length > 0) {
                const transformedDoctors = doctors
                    .map(doc => ({
                        name: doc.name,
                        specialty: doc.specialty,
                        category: mapSpecialtyToCategory(doc.specialty),
                        image: doc.image || 'https://via.placeholder.com/150',
                        rating: doc.rating ? String(doc.rating) : '0',
                        reviews: doc.reviews ? String(doc.reviews) : '0',
                        offDays: doc.off_days || [],
                        degree: doc.degree,
                        workplace: doc.workplace,
                        about: doc.about,
                        visitingTime: doc.visiting_time,
                        chamberAddress: doc.chamber_address,
                        locationDetails: doc.location_details,
                        experience: doc.experience,
                        patients: doc.patients,
                        visitingDays: doc.visiting_days || [],
                        bookingSlot: doc.booking_slot || 2,
                        status: doc.status,
                        inactiveReason: doc.inactive_reason,
                        inactiveDetails: doc.inactive_details,
                        returnDate: doc.return_date,
                        healthTips: doc.health_tips || [],
                        userReview: doc.user_review || []
                    }));
                
                doctorsDb.push(...transformedDoctors);
                console.log(`🔄 Refreshed: ${transformedDoctors.length} doctors loaded`);
            }
            
            if (typeof window.populateTopNowSections === 'function') {
                window.populateTopNowSections();
            }
            
            if (typeof window.applySortingToAllDoctorLists === 'function') {
                window.applySortingToAllDoctorLists();
            }
        }
    } catch (error) {
        console.error('Error refreshing doctors data:', error);
    }
}

async function refreshBannerImages() {
    try {
        const allBannerImages = await dbService.getBannerImages();
        
        window.bannerImagesCache = {
            'home-hero-slider': [],
            'sponsor-banner': [],
            'blood-hero-slider': [],
            'donor-hero-image': [],
            'ambulance-hero-slider': [],
            'private-hospital-hero-slider': [],
            'pharmacy-promotional-image': []
        };
        
        allBannerImages.forEach(image => {
            if (window.bannerImagesCache[image.type]) {
                window.bannerImagesCache[image.type].push(image);
            }
        });
        
        console.log('🖼️ Banner images loaded from database:', window.bannerImagesCache);
        
        if (typeof window.updateAllBannerImages === 'function') {
            window.updateAllBannerImages();
        }
    } catch (error) {
        console.error('Error refreshing banner images:', error);
    }
}

async function getBannerImagesByType(type) {
    if (!window.bannerImagesCache[type] || window.bannerImagesCache[type].length === 0) {
        try {
            const images = await dbService.getBannerImages(type);
            if (!window.bannerImagesCache[type]) {
                window.bannerImagesCache[type] = [];
            }
            window.bannerImagesCache[type] = images;
            return images;
        } catch (error) {
            console.error(`Error fetching ${type} images:`, error);
            return [];
        }
    }
    return window.bannerImagesCache[type];
}

async function refreshDonorsData() {
    try {
        const donors = await dbService.getBloodDonors();
        let donorsDb = findAndClearArray('donorsDatabase');
        
        if (donorsDb && Array.isArray(donorsDb)) {
            donorsDb.length = 0;
            
            if (donors.length > 0) {
                const transformedDonors = donors
                    .filter(d => d.approved && d.status === 'active')
                    .map(donor => {
                        // Calculate if donor is ready based on last donation date
                        let isReady = true; // Default to ready if no last donation date
                        if (donor.last_donation_date) {
                            const today = new Date();
                            const lastDonation = new Date(donor.last_donation_date);
                            const daysSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
                            // Ready if 90 or more days since last donation
                            isReady = daysSinceLastDonation >= 90;
                        }
                        
                        return {
                            id: donor.id,
                            name: donor.name,
                            bloodGroup: donor.blood_group,
                            contact: donor.contact,
                            photo: donor.photo || 'https://i.ibb.co/YdR8KfV/donor-1.jpg',
                            district: donor.district,
                            upazila: donor.upazila,
                            age: donor.age,
                            gender: donor.gender,
                            lastDonation: donor.last_donation_date,
                            medicalConditions: donor.medical_conditions,
                            weight: donor.weight,
                            isReady: isReady
                        };
                    });
                
                donorsDb.push(...transformedDonors);
                console.log(`🔄 Refreshed: ${transformedDonors.length} donors loaded`);
            }
            
            if (typeof window.populateDonorAvailabilityLists === 'function') {
                window.populateDonorAvailabilityLists();
            }
        }
    } catch (error) {
        console.error('Error refreshing donors data:', error);
    }
}

async function refreshHospitalsData() {
    try {
        console.log('🔄 Refreshing hospitals data...');
        const hospitals = await dbService.getHospitals();
        
        let hospitalsDb = findAndClearArray('hospitalsDatabase');
        if (!hospitalsDb) {
            window.hospitalsDatabase = [];
            hospitalsDb = window.hospitalsDatabase;
        }
        
        if (hospitalsDb && Array.isArray(hospitalsDb)) {
            hospitalsDb.length = 0;
            
            if (hospitals.length > 0) {
                // Log raw room_pricing structure for debugging
                if (hospitals[0]?.room_pricing) {
                    console.log('📋 Raw room_pricing from Supabase:', hospitals[0].room_pricing);
                }
                
                const transformedHospitals = hospitals
                    .filter(h => h.status === 'active')
                    .map(hospital => {
                        // Transform room_pricing from flat structure to nested objects
                        const roomPricing = {};
                        const discount = hospital.discount_percentage || 0;
                        
                        if (hospital.room_pricing) {
                            const rp = hospital.room_pricing;
                            
                            // Define room type mappings
                            const roomMappings = {
                                'general_ward': { price: rp.general_ward_price, beds: rp.general_ward_beds },
                                'ac_cabin': { price: rp.ac_cabin_price, beds: rp.ac_cabin_beds },
                                'non_ac_cabin': { price: rp.non_ac_cabin_price, beds: rp.non_ac_cabin_beds },
                                'icu': { price: rp.icu_price, beds: rp.icu_available_beds },
                                'ccu': { price: rp.ccu_price, beds: rp.ccu_available_beds }
                            };
                            
                            // Transform each room type
                            Object.entries(roomMappings).forEach(([roomType, data]) => {
                                const originalPrice = data.price || 0;
                                const beds = data.beds || 0;
                                
                                if (originalPrice > 0) {
                                    const discountedPrice = discount > 0 
                                        ? Math.round(originalPrice * (1 - discount / 100))
                                        : originalPrice;
                                    const savings = originalPrice - discountedPrice;
                                    
                                    roomPricing[roomType] = {
                                        originalPrice: originalPrice,
                                        discountedPrice: discountedPrice,
                                        savings: savings,
                                        beds: beds
                                    };
                                }
                            });
                        }
                        const transformedRoomPricing = roomPricing;
                        
                        return {
                            id: hospital.id,
                            name: hospital.name,
                            type: hospital.type || 'General Hospital',
                            location: hospital.location,
                            contact: hospital.contact,
                            image: hospital.image_url,
                            totalBeds: hospital.total_beds || 0,
                            availableBeds: hospital.available_beds || 0,
                            rating: hospital.rating || 0,
                            reviewsCount: hospital.reviews_count || 0,
                            discount: hospital.discount_percentage || 0,
                            discountPercentage: hospital.discount_percentage || 0,
                            specialOffer: hospital.special_offer,
                            about: hospital.about,
                            specialities: hospital.specialities || [],
                            facilities: hospital.facilities || {},
                            roomPricing: transformedRoomPricing
                        };
                    });
                
                hospitalsDb.push(...transformedHospitals);
                console.log(`🔄 Refreshed: ${transformedHospitals.length} hospitals loaded`);
            }
            
            if (typeof window.renderPrivateHospitalCards === 'function') {
                window.renderPrivateHospitalCards();
                console.log('🔄 Hospital cards UI updated');
            }
        }
    } catch (error) {
        console.error('Error refreshing hospitals data:', error);
    }
}

async function refreshPharmaciesData() {
    try {
        console.log('🔄 Refreshing pharmacies data...');
        const pharmacies = await dbService.getPharmacies();
        
        let pharmaciesDb = findAndClearArray('pharmaciesDatabase');
        if (!pharmaciesDb) {
            window.pharmaciesDatabase = [];
            pharmaciesDb = window.pharmaciesDatabase;
        }
        
        if (pharmaciesDb && Array.isArray(pharmaciesDb)) {
            pharmaciesDb.length = 0;
            
            if (pharmacies.length > 0) {
                const transformedPharmacies = pharmacies
                    .filter(p => p.status === 'active')
                    .map(pharmacy => ({
                        id: pharmacy.id,
                        name: pharmacy.name,
                        location: pharmacy.location,
                        address: pharmacy.address,
                        contact: pharmacy.contact,
                        email: pharmacy.email,
                        open_time: pharmacy.open_time,
                        imageUrl: pharmacy.image_url || 'https://uc.healthnetcalifornia.com/content/dam/centene/healthnet/images/groups/uc-pharmacy-banner.jpg',
                        discountPercentage: pharmacy.discount_percentage || 0,
                        discountText: pharmacy.discount_text,
                        discountTag: pharmacy.discount_tag,
                        offerInfo: pharmacy.offer_info,
                        offerBadge: pharmacy.offer_badge,
                        about: pharmacy.about,
                        infoSection: pharmacy.info_section,
                        status: pharmacy.status
                    }));
                
                pharmaciesDb.push(...transformedPharmacies);
                console.log(`🔄 Refreshed: ${transformedPharmacies.length} pharmacies loaded`);
            }
            
            if (typeof window.renderPharmacyCards === 'function') {
                window.renderPharmacyCards();
                console.log('🔄 Pharmacy cards UI updated');
            }
        }
    } catch (error) {
        console.error('Error refreshing pharmacies data:', error);
    }
}

function setupRealtimeSubscriptions() {
    console.log('📡 Setting up real-time subscriptions (optimized for bandwidth reduction)...');
    console.log('ℹ️  Static data (doctors, hospitals, pharmacies, donors) will use 30-day cache instead of real-time');
    
    const appointmentsChannel = window.supabase
        .channel('appointments-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'appointments' },
            (payload) => {
                console.log('🔔 Appointments table changed:', payload.eventType, 'Record ID:', payload.new?.id || payload.old?.id);
                console.log('🔄 Triggering appointment, prescription, and notification sync...');
                setTimeout(async () => {
                    await syncUserAppointments();
                    await syncUserPrescriptions();
                    const currentUser = window.AuthSystem?.getUser();
                    if (currentUser && currentUser.supabaseId) {
                        await syncUserPoints();
                        // Also reload notifications when appointments change
                        if (typeof window.loadNotificationsFromSupabase === 'function') {
                            console.log('🔔 Reloading notifications after appointment change...');
                            await window.loadNotificationsFromSupabase();
                        }
                    }
                }, 500);
            }
        )
        .subscribe();
    
    window.supabaseSubscriptions.push(appointmentsChannel);
    console.log('✅ Real-time subscriptions enabled for appointments');
    
    const redeemRequestsChannel = window.supabase
        .channel('redeem-requests-changes')
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'redeem_requests' },
            async (payload) => {
                console.log('🔔 Redeem request status changed:', payload);
                
                const currentUser = window.AuthSystem?.getUser();
                if (!currentUser || !currentUser.supabaseId) return;
                
                const request = payload.new;
                
                if (request.user_id === currentUser.supabaseId) {
                    if (request.status === 'accepted') {
                        await syncUserPoints();
                        
                        if (typeof window.PointsSystem !== 'undefined' && window.PointsSystem.updateTransactionHistory) {
                            await window.PointsSystem.updateTransactionHistory();
                        }
                        
                        if (typeof window.createNotification === 'function') {
                            window.createNotification(
                                'redeem',
                                'Redeem Request Approved!',
                                `Your redeem request (ID: ${request.request_id}) has been approved! ${request.points_to_redeem} points have been deducted from your account.`,
                                true
                            );
                        }
                        
                        if (typeof window.updateNotificationsDisplay === 'function') {
                            window.updateNotificationsDisplay();
                        }
                        
                        if (typeof CustomDialog !== 'undefined') {
                            CustomDialog.alert(
                                `Your redeem request has been approved!\n\nRequest ID: ${request.request_id}\nPoints Deducted: ${request.points_to_redeem}\n\nYour recharge will be processed shortly.`,
                                'Redeem Successful'
                            );
                        }
                    } else if (request.status === 'cancelled') {
                        await syncUserPoints();
                        
                        if (typeof window.PointsSystem !== 'undefined' && window.PointsSystem.updateTransactionHistory) {
                            await window.PointsSystem.updateTransactionHistory();
                        }
                        
                        if (typeof window.createNotification === 'function') {
                            window.createNotification(
                                'redeem',
                                'Redeem Request Cancelled',
                                `Your redeem request (ID: ${request.request_id}) has been cancelled. Reason: ${request.cancellation_reason || 'Not specified'}. Your points remain in your wallet.`,
                                true
                            );
                        }
                        
                        if (typeof window.updateNotificationsDisplay === 'function') {
                            window.updateNotificationsDisplay();
                        }
                        
                        if (typeof CustomDialog !== 'undefined') {
                            CustomDialog.alert(
                                `Your redeem request has been cancelled.\n\nRequest ID: ${request.request_id}\nReason: ${request.cancellation_reason || 'Technical difficulties. Please contact support for solutions.'}\n\nYour points remain in your wallet. Please contact support for assistance.`,
                                'Request Cancelled'
                            );
                        }
                    }
                }
            }
        )
        .subscribe();
    
    window.supabaseSubscriptions.push(redeemRequestsChannel);
    console.log('✅ Real-time subscriptions enabled for redeem requests');
    
    // Hospital requests real-time subscription
    const hospitalRequestsChannel = window.supabase
        .channel('hospital-requests-user-changes')
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'hospital_requests' },
            async (payload) => {
                console.log('🔔 Hospital request status changed:', payload);
                
                const currentUser = window.AuthSystem?.getUser();
                const request = payload.new;
                
                // Update localStorage with new status
                if (request) {
                    const savedBookings = localStorage.getItem('mediquick_hospital_bookings');
                    if (savedBookings) {
                        try {
                            let bookings = JSON.parse(savedBookings);
                            const bookingIndex = bookings.findIndex(b => b.requestId === request.request_id);
                            
                            if (bookingIndex !== -1) {
                                bookings[bookingIndex].status = request.status;
                                localStorage.setItem('mediquick_hospital_bookings', JSON.stringify(bookings));
                                InMemoryStorage.hospitalBookings = bookings;
                                console.log('✅ Hospital booking status updated in localStorage:', request.request_id, '→', request.status);
                            }
                        } catch (error) {
                            console.error('Error updating hospital booking status:', error);
                        }
                    }
                }
                
                // Refresh hospital booking history if function exists
                if (typeof window.loadHospitalBookingHistory === 'function') {
                    await window.loadHospitalBookingHistory();
                    console.log('🔄 Hospital booking history refreshed');
                }
                
                // Show notification for user's own requests
                if (currentUser && request.user_id === currentUser.supabaseId) {
                    if (request.status === 'approved') {
                        if (typeof window.createNotification === 'function') {
                            window.createNotification(
                                'booking',
                                'Hospital Booking Approved!',
                                `Your hospital booking request (${request.request_id}) at ${request.hospital} has been approved! Room: ${request.room_name}, Check-in: ${request.check_in_date}.`,
                                true
                            );
                        }
                        
                        if (typeof window.updateNotificationsDisplay === 'function') {
                            window.updateNotificationsDisplay();
                        }
                    }
                }
            }
        )
        .subscribe();
    
    window.supabaseSubscriptions.push(hospitalRequestsChannel);
    console.log('✅ Real-time subscriptions enabled for hospital requests');
    
    const notificationsChannel = window.supabase
        .channel('notifications-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'notifications' },
            async (payload) => {
                console.log('🔔 Notifications table changed:', payload.eventType);
                
                const currentUser = window.AuthSystem?.getUser();
                if (!currentUser || !currentUser.supabaseId) return;
                
                const notification = payload.new || payload.old;
                
                // Only reload notifications if this notification belongs to the current user
                if (notification && notification.user_id === currentUser.supabaseId) {
                    if (typeof window.loadNotificationsFromSupabase === 'function') {
                        console.log('🔔 Reloading notifications for current user');
                        setTimeout(() => window.loadNotificationsFromSupabase(), 500);
                    }
                }
            }
        )
        .subscribe();
    
    window.supabaseSubscriptions.push(notificationsChannel);
    console.log('✅ Real-time subscriptions enabled for notifications');
    
    console.log('✅ Real-time optimization complete:');
    console.log('   ✓ Appointments (user-specific)');
    console.log('   ✓ Redeem Requests (user-specific)');
    console.log('   ✓ Hospital Requests (user-specific)');
    console.log('   ✓ Notifications (user-specific)');
    console.log('   ✗ Doctors, Hospitals, Pharmacies, Blood Donors (using 30-day cache)');
    console.log('💡 Use manual refresh button to update static data when needed');
}

// Expose refresh functions globally
window.refreshDoctorsData = refreshDoctorsData;
window.refreshDonorsData = refreshDonorsData;
window.refreshPharmaciesData = refreshPharmaciesData;
window.refreshBannerImages = refreshBannerImages;
window.getBannerImagesByType = getBannerImagesByType;

window.manualRefreshData = async function() {
    console.log('🔄 Manual refresh triggered...');
    await refreshDoctorsData();
    await refreshDonorsData();
    await refreshPharmaciesData();
    
    if (typeof window.userSupabaseHandlers !== 'undefined') {
        if (window.userSupabaseHandlers.syncAppointments) {
            await window.userSupabaseHandlers.syncAppointments();
        }
        if (window.userSupabaseHandlers.syncPoints) {
            await window.userSupabaseHandlers.syncPoints();
        }
        if (window.userSupabaseHandlers.syncBloodRequests) {
            await window.userSupabaseHandlers.syncBloodRequests();
        }
        if (window.userSupabaseHandlers.syncAmbulanceRequests) {
            await window.userSupabaseHandlers.syncAmbulanceRequests();
        }
        if (window.userSupabaseHandlers.syncPrescriptions) {
            await window.userSupabaseHandlers.syncPrescriptions();
        }
    }
    
    if (typeof CustomDialog !== 'undefined' && CustomDialog.alert) {
        CustomDialog.alert('Data refreshed successfully! Your appointments, points, blood requests, ambulance requests, and prescriptions are now up to date.', 'Refresh Complete');
    } else {
        alert('✅ Data refreshed successfully! Your appointments, points, blood requests, ambulance requests, and prescriptions are now up to date.');
    }
};

window.refreshAllStaticData = async function() {
    if (typeof showNotification === 'function') {
        showNotification('Refreshing data...', 'info');
    }
    
    try {
        console.log('🔄 Refreshing all static data...');
        
        window.cacheService.forceRefresh('doctors');
        window.cacheService.forceRefresh('hospitals');
        window.cacheService.forceRefresh('pharmacies');
        window.cacheService.forceRefresh('blood_donors');
        
        await Promise.all([
            refreshDoctorsData(),
            refreshHospitalsData(),
            refreshPharmaciesData(),
            refreshDonorsData()
        ]);
        
        console.log('✅ All static data refreshed successfully');
        
        if (typeof showNotification === 'function') {
            showNotification('Data refreshed successfully!', 'success');
        } else if (typeof CustomDialog !== 'undefined' && CustomDialog.alert) {
            CustomDialog.alert('Static data refreshed successfully! Doctors, hospitals, pharmacies, and blood donors are now up to date.', 'Refresh Complete');
        } else {
            alert('✅ Data refreshed successfully!');
        }
        
        updateCacheStatusSummary();
    } catch (error) {
        console.error('❌ Error refreshing data:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error refreshing data. Please try again.', 'error');
        } else if (typeof CustomDialog !== 'undefined' && CustomDialog.alert) {
            CustomDialog.alert('Error refreshing data. Please try again.', 'Refresh Failed');
        } else {
            alert('❌ Error refreshing data. Please try again.');
        }
    }
};

window.confirmClearCache = function() {
    if (typeof CustomDialog !== 'undefined' && CustomDialog.confirm) {
        CustomDialog.confirm(
            'Are you sure you want to clear all cached data? This will require re-downloading data from the server.',
            'Clear Cache',
            () => {
                window.cacheService.invalidateAll();
                console.log('🗑️ All cache cleared by user');
                if (typeof showNotification === 'function') {
                    showNotification('Cache cleared successfully', 'success');
                } else {
                    alert('✅ Cache cleared successfully');
                }
                updateCacheStatusSummary();
            }
        );
    } else {
        if (confirm('Are you sure you want to clear all cached data?')) {
            window.cacheService.invalidateAll();
            console.log('🗑️ All cache cleared by user');
            if (typeof showNotification === 'function') {
                showNotification('Cache cleared successfully', 'success');
            } else {
                alert('✅ Cache cleared successfully');
            }
            updateCacheStatusSummary();
        }
    }
};

window.openCacheStatus = function() {
    const cacheInfo = window.cacheService.getAllCacheInfo();
    
    let message = 'Cache Status:\n\n';
    
    const dataTypes = [
        { key: 'doctors', name: 'Doctors' },
        { key: 'hospitals', name: 'Hospitals' },
        { key: 'pharmacies', name: 'Pharmacies' },
        { key: 'blood_donors', name: 'Blood Donors' }
    ];
    
    dataTypes.forEach(type => {
        const info = cacheInfo[type.key];
        if (info) {
            const daysOld = Math.floor(info.age / 86400);
            const hoursOld = Math.floor((info.age % 86400) / 3600);
            const daysLeft = Math.floor(info.expiresIn / 86400);
            
            message += `${type.name}:\n`;
            message += `  Last Updated: ${info.lastUpdated}\n`;
            message += `  Age: ${daysOld}d ${hoursOld}h\n`;
            message += `  Expires in: ${daysLeft} days\n\n`;
        } else {
            message += `${type.name}: Not cached\n\n`;
        }
    });
    
    message += '\nCached data reduces bandwidth usage and loads faster. Data automatically expires after 30 days.';
    
    if (typeof CustomDialog !== 'undefined' && CustomDialog.alert) {
        CustomDialog.alert(message, 'Cache Status');
    } else {
        alert(message);
    }
};

function updateCacheStatusSummary() {
    const summaryElement = document.getElementById('cache-status-summary');
    if (!summaryElement) return;
    
    const cacheInfo = window.cacheService.getAllCacheInfo();
    const cachedCount = Object.keys(cacheInfo).length;
    
    if (cachedCount === 0) {
        summaryElement.textContent = 'No cached data available';
    } else {
        const oldestCache = Object.values(cacheInfo).reduce((oldest, current) => {
            return (oldest.age > current.age) ? oldest : current;
        });
        
        const daysOld = Math.floor(oldestCache.age / 86400);
        const hoursOld = Math.floor((oldestCache.age % 86400) / 3600);
        
        if (daysOld > 0) {
            summaryElement.textContent = `${cachedCount} datasets cached (oldest: ${daysOld}d ${hoursOld}h)`;
        } else {
            summaryElement.textContent = `${cachedCount} datasets cached (fresh)`;
        }
    }
}

setInterval(updateCacheStatusSummary, 60000);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(updateCacheStatusSummary, 1000);
} else {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(updateCacheStatusSummary, 1000);
    });
}

// Check cache version and force refresh if admin has updated it
async function checkAndUpdateCacheVersion() {
    try {
        // Get the current cache version from database
        const { data: dbVersion, error } = await supabase
            .from('cache_version')
            .select('version')
            .eq('id', 1)
            .maybeSingle();
        
        if (error) {
            console.error('❌ Error fetching cache version:', error);
            return;
        }
        
        if (!dbVersion) {
            console.log('ℹ️ Cache version table not set up yet, skipping version check');
            return;
        }
        
        // Get local cache version from localStorage
        const localVersion = parseInt(localStorage.getItem('mediquick_cache_version') || '0');
        const currentVersion = dbVersion?.version || 1;
        
        console.log(`📌 Cache version check: local=${localVersion}, database=${currentVersion}`);
        
        if (localVersion < currentVersion) {
            console.log(`🔄 Cache version outdated (local: v${localVersion}, database: v${currentVersion}). Clearing cache...`);
            
            // Clear all cached data
            window.cacheService.invalidateAll();
            
            // Update local version
            localStorage.setItem('mediquick_cache_version', String(currentVersion));
            
            // Show user feedback if CustomDialog is available
            if (typeof CustomDialog !== 'undefined' && CustomDialog.alert) {
                CustomDialog.alert(
                    'New data available! Your app cache has been refreshed to show the latest information.',
                    'Cache Updated'
                );
            }
            
            console.log(`✅ Cache cleared and version updated to v${currentVersion}`);
        } else {
            console.log(`✅ Cache version is up to date (v${currentVersion})`);
            
            // Still update the version in case it wasn't set before
            localStorage.setItem('mediquick_cache_version', String(currentVersion));
        }
    } catch (error) {
        console.error('❌ Error in checkAndUpdateCacheVersion:', error);
    }
}

async function initializeUserApp() {
    try {
        console.log('🔄 Loading data from Supabase...');
        
        // Check cache version and invalidate if needed
        await checkAndUpdateCacheVersion();
        
        // Clear Top Now sections immediately to prevent showing stale data
        const topNowSections = document.querySelectorAll('.top-doctors .doctors-list');
        topNowSections.forEach(section => {
            section.innerHTML = '';
        });
        
        const [doctors, donors, drivers, hospitals, pharmacies, bannerImages] = await Promise.all([
            dbService.getDoctors().catch(err => { console.error('Error loading doctors:', err); return []; }),
            dbService.getBloodDonors().catch(err => { console.error('Error loading donors:', err); return []; }),
            dbService.getDrivers().catch(err => { console.error('Error loading drivers:', err); return []; }),
            dbService.getHospitals().catch(err => { console.error('Error loading hospitals:', err); return []; }),
            dbService.getPharmacies().catch(err => { console.error('Error loading pharmacies:', err); return []; }),
            dbService.getBannerImages().then(imgs => { console.log('🖼️ Banner images fetched from DB:', imgs); return imgs; }).catch(err => { console.error('Error loading banner images:', err); return []; })
        ]);
        
        // Clear and populate immediately after data is fetched
        let doctorsDb = findAndClearArray('doctorsDatabase');
        if (doctorsDb && Array.isArray(doctorsDb)) {
            doctorsDb.length = 0;
            
            if (doctors.length > 0) {
                const transformedDoctors = doctors
                    .map(doc => ({
                        name: doc.name,
                        specialty: doc.specialty,
                        category: mapSpecialtyToCategory(doc.specialty),
                        image: doc.image || 'https://via.placeholder.com/150',
                        rating: doc.rating ? String(doc.rating) : '0',
                        reviews: doc.reviews ? String(doc.reviews) : '0',
                        offDays: doc.off_days || [],
                        degree: doc.degree,
                        workplace: doc.workplace,
                        about: doc.about,
                        visitingTime: doc.visiting_time,
                        chamberAddress: doc.chamber_address,
                        locationDetails: doc.location_details,
                        experience: doc.experience,
                        patients: doc.patients,
                        visitingDays: doc.visiting_days || [],
                        bookingSlot: doc.booking_slot || 2,
                        status: doc.status,
                        inactiveReason: doc.inactive_reason,
                        inactiveDetails: doc.inactive_details,
                        returnDate: doc.return_date,
                        healthTips: doc.health_tips || [],
                        userReview: doc.user_review || []
                    }));
                
                doctorsDb.push(...transformedDoctors);
                console.log(`✅ Loaded ${transformedDoctors.length} doctors into doctorsDatabase`);
            }
        }
        
        let donorsDb = findAndClearArray('donorsDatabase');
        if (donorsDb && Array.isArray(donorsDb)) {
            donorsDb.length = 0;
            
            if (donors.length > 0) {
                const transformedDonors = donors
                    .filter(d => d.approved && d.status === 'active')
                    .map(donor => {
                        // Calculate if donor is ready based on last donation date
                        let isReady = true; // Default to ready if no last donation date
                        if (donor.last_donation_date) {
                            const today = new Date();
                            const lastDonation = new Date(donor.last_donation_date);
                            const daysSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
                            // Ready if 90 or more days since last donation
                            isReady = daysSinceLastDonation >= 90;
                        }
                        
                        return {
                            id: donor.id,
                            name: donor.name,
                            bloodGroup: donor.blood_group,
                            contact: donor.contact,
                            photo: donor.photo || 'https://i.ibb.co/YdR8KfV/donor-1.jpg',
                            district: donor.district,
                            upazila: donor.upazila,
                            age: donor.age,
                            gender: donor.gender,
                            lastDonation: donor.last_donation_date,
                            medicalConditions: donor.medical_conditions,
                            weight: donor.weight,
                            isReady: isReady
                        };
                    });
                
                donorsDb.push(...transformedDonors);
                console.log(`✅ Loaded ${transformedDonors.length} blood donors into donorsDatabase`);
            }
        }
        
        let ambulancesDb = findAndClearArray('ambulancesDatabase');
        if (ambulancesDb && Array.isArray(ambulancesDb)) {
            ambulancesDb.length = 0;
            
            if (drivers.length > 0) {
                const transformedDrivers = drivers
                    .filter(d => d.status === 'available' || d.status === 'active')
                    .map(driver => {
                        const normalizeAmbulanceType = (type) => {
                            if (!type) return 'basic';
                            const typeStr = type.toLowerCase();
                            if (typeStr.includes('basic')) return 'basic';
                            if (typeStr.includes('advanced')) return 'advanced';
                            if (typeStr.includes('icu')) return 'icu';
                            if (typeStr.includes('mortuary')) return 'mortuary';
                            return 'basic';
                        };
                        
                        return {
                            id: driver.id,
                            driverName: driver.name,
                            name: driver.ambulance_type || 'Ambulance',
                            type: normalizeAmbulanceType(driver.ambulance_type),
                            district: driver.district ? driver.district.toLowerCase() : '',
                            upazila: driver.upazila ? driver.upazila.toLowerCase().replace(/\s+/g, '-') : '',
                            location: driver.location || driver.district || 'Rangpur',
                            registrationNumber: driver.ambulance_registration_number || driver.license,
                            isAvailable: driver.status === 'available' || driver.status === 'active',
                            distance: '0 km',
                            contact: driver.contact,
                            photo: driver.photo
                        };
                    });
                
                ambulancesDb.push(...transformedDrivers);
                console.log(`✅ Loaded ${transformedDrivers.length} ambulances into ambulancesDatabase`);
            }
        }
        
        let hospitalsDb = findAndClearArray('hospitalsDatabase');
        if (!hospitalsDb) {
            window.hospitalsDatabase = [];
            hospitalsDb = window.hospitalsDatabase;
        }
        
        if (hospitalsDb && Array.isArray(hospitalsDb)) {
            hospitalsDb.length = 0;
            
            if (hospitals.length > 0) {
                // Log raw room_pricing structure for debugging
                if (hospitals[0]?.room_pricing) {
                    console.log('📋 Raw room_pricing from Supabase (init):', hospitals[0].room_pricing);
                }
                
                const transformedHospitals = hospitals
                    .filter(h => h.status === 'active')
                    .map(hospital => {
                        // Transform room_pricing from flat structure to nested objects
                        const roomPricing = {};
                        const discount = hospital.discount_percentage || 0;
                        
                        if (hospital.room_pricing) {
                            const rp = hospital.room_pricing;
                            
                            // Define room type mappings
                            const roomMappings = {
                                'general_ward': { price: rp.general_ward_price, beds: rp.general_ward_beds },
                                'ac_cabin': { price: rp.ac_cabin_price, beds: rp.ac_cabin_beds },
                                'non_ac_cabin': { price: rp.non_ac_cabin_price, beds: rp.non_ac_cabin_beds },
                                'icu': { price: rp.icu_price, beds: rp.icu_available_beds },
                                'ccu': { price: rp.ccu_price, beds: rp.ccu_available_beds }
                            };
                            
                            // Transform each room type
                            Object.entries(roomMappings).forEach(([roomType, data]) => {
                                const originalPrice = data.price || 0;
                                const beds = data.beds || 0;
                                
                                if (originalPrice > 0) {
                                    const discountedPrice = discount > 0 
                                        ? Math.round(originalPrice * (1 - discount / 100))
                                        : originalPrice;
                                    const savings = originalPrice - discountedPrice;
                                    
                                    roomPricing[roomType] = {
                                        originalPrice: originalPrice,
                                        discountedPrice: discountedPrice,
                                        savings: savings,
                                        beds: beds
                                    };
                                }
                            });
                        }
                        const transformedRoomPricing = roomPricing;
                        
                        return {
                            id: hospital.id,
                            name: hospital.name,
                            type: hospital.type || 'General Hospital',
                            location: hospital.location,
                            contact: hospital.contact,
                            image: hospital.image_url,
                            totalBeds: hospital.total_beds || 0,
                            availableBeds: hospital.available_beds || 0,
                            rating: hospital.rating || 0,
                            reviewsCount: hospital.reviews_count || 0,
                            discount: hospital.discount_percentage || 0,
                            discountPercentage: hospital.discount_percentage || 0,
                            specialOffer: hospital.special_offer,
                            about: hospital.about,
                            specialities: hospital.specialities || [],
                            facilities: hospital.facilities || {},
                            roomPricing: transformedRoomPricing
                        };
                    });
                
                hospitalsDb.push(...transformedHospitals);
                console.log(`✅ Loaded ${transformedHospitals.length} hospitals into hospitalsDatabase`);
                if (transformedHospitals.length > 0) {
                    console.log('🏥 Transformed hospital room pricing:', transformedHospitals[0].roomPricing);
                    console.log('💰 First hospital discount:', transformedHospitals[0].discount);
                }
            }
        }
        
        let pharmaciesDb = findAndClearArray('pharmaciesDatabase');
        if (!pharmaciesDb) {
            window.pharmaciesDatabase = [];
            pharmaciesDb = window.pharmaciesDatabase;
        }
        
        if (pharmaciesDb && Array.isArray(pharmaciesDb)) {
            pharmaciesDb.length = 0;
            
            if (pharmacies.length > 0) {
                const transformedPharmacies = pharmacies
                    .filter(p => p.status === 'active')
                    .map(pharmacy => ({
                        id: pharmacy.id,
                        name: pharmacy.name,
                        location: pharmacy.location,
                        address: pharmacy.address,
                        contact: pharmacy.contact,
                        email: pharmacy.email,
                        open_time: pharmacy.open_time,
                        imageUrl: pharmacy.image_url || 'https://uc.healthnetcalifornia.com/content/dam/centene/healthnet/images/groups/uc-pharmacy-banner.jpg',
                        discountPercentage: pharmacy.discount_percentage || 0,
                        discountText: pharmacy.discount_text,
                        discountTag: pharmacy.discount_tag,
                        offerInfo: pharmacy.offer_info,
                        offerBadge: pharmacy.offer_badge,
                        about: pharmacy.about,
                        infoSection: pharmacy.info_section,
                        status: pharmacy.status
                    }));
                
                pharmaciesDb.push(...transformedPharmacies);
                console.log(`✅ Loaded ${transformedPharmacies.length} pharmacies into pharmaciesDatabase`);
            }
        }
        
        window.bannerImagesCache = {
            'home-hero-slider': [],
            'sponsor-banner': [],
            'blood-hero-slider': [],
            'donor-hero-image': [],
            'ambulance-hero-slider': [],
            'private-hospital-hero-slider': [],
            'pharmacy-promotional-image': []
        };
        
        if (bannerImages && bannerImages.length > 0) {
            bannerImages.forEach(image => {
                if (window.bannerImagesCache[image.type]) {
                    window.bannerImagesCache[image.type].push(image);
                }
            });
            console.log(`✅ Loaded ${bannerImages.length} banner images into cache`);
            console.log('🖼️ Banner images by type:', Object.keys(window.bannerImagesCache).map(type => 
                `${type}: ${window.bannerImagesCache[type].length}`).join(', '));
        }
        
        window.supabaseDataLoaded = true;
        console.log('✅ Supabase data loaded successfully and injected into app databases');
        console.log(`📊 Total loaded: ${doctors.length} doctors, ${donors.length} donors, ${drivers.length} drivers, ${hospitals.length} hospitals, ${pharmacies.length} pharmacies, ${bannerImages.length} banner images`);
        
        // Update UI immediately after data is loaded
        if (typeof window.populateTopNowSections === 'function') {
            window.populateTopNowSections();
            console.log('🔄 UI updated with Supabase doctors data');
        }
        
        if (typeof window.applySortingToAllDoctorLists === 'function') {
            window.applySortingToAllDoctorLists();
            console.log('🔄 All doctor lists sorted and refreshed');
        }
        
        if (typeof window.populateNearbyAmbulancesList === 'function') {
            window.populateNearbyAmbulancesList();
            console.log('🔄 Ambulances list updated');
        }
        
        if (typeof window.populateDonorAvailabilityLists === 'function') {
            window.populateDonorAvailabilityLists();
            console.log('🔄 Blood donors list updated');
        }
        
        if (typeof window.renderPrivateHospitalCards === 'function') {
            window.renderPrivateHospitalCards();
            console.log('🔄 Private hospital cards updated');
        }
        
        if (typeof window.updateAllBannerImages === 'function') {
            window.updateAllBannerImages();
            console.log('🔄 Banner images updated');
        }
        
        setupRealtimeSubscriptions();
        
        // Sync user-specific data (appointments, points, blood requests, ambulance requests, prescriptions)
        console.log('🔄 Syncing user-specific data...');
        await syncUserAppointments();
        await syncUserPoints();
        await syncBloodRequests();
        await syncAmbulanceRequests();
        await syncUserPrescriptions();
        console.log('✅ User-specific data synced');
        
    } catch (error) {
        console.error('❌ Error initializing user app with Supabase:', error);
        console.log('⚠️ Application will use empty databases. Please ensure:');
        console.log('   1. Supabase tables are created (run SQL from setup-database.js)');
        console.log('   2. Database connection is working');
        console.log('   3. Check browser console for specific error messages');
    }
}

function isAllowedEmailDomain(email) {
    const allowedDomains = [
        '@gmail.com',
        '@hotmail.com',
        '@outlook.com',
        '@live.com',
        '@msn.com'
    ];
    
    const emailLower = email.toLowerCase();
    return allowedDomains.some(domain => emailLower.endsWith(domain));
}

async function handleUserSignUp(email, password) {
    try {
        if (!isAllowedEmailDomain(email)) {
            throw new Error('Only Gmail and Hotmail email addresses are allowed');
        }
        
        const response = await fetch('https://mediquick-p37c.onrender.com/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create account');
        }
        
        return data.user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function handleUserSignIn(email, password) {
    try {
        const response = await fetch('https://mediquick-p37c.onrender.com/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to sign in');
        }
        
        return data.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

async function handleUserProfileUpdate(userId, profileData) {
    try {
        const updatedUser = await dbService.updateUser(userId, {
            ...profileData,
            profile_complete: true
        });
        
        // Send notification to user about profile completion
        if (userId) {
            try {
                const notificationData = {
                    user_id: userId,
                    type: 'account',
                    title: 'Profile Completed!',
                    message: 'Your profile has been completed successfully. You can now enjoy all the features and benefits of MediQuick!',
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: `profile_complete_${userId}`,
                    request_type: 'account'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Profile completion notification sent to user:', userId);
            } catch (notifError) {
                console.error('Error sending profile completion notification:', notifError);
            }
        }
        
        return updatedUser;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

async function handleAppointmentBooking(appointmentData) {
    try {
        const booking = await dbService.addAppointment(appointmentData);
        
        // Send notification to user about pending appointment
        if (appointmentData.user_id) {
            try {
                const notificationData = {
                    user_id: appointmentData.user_id,
                    type: 'appointment',
                    title: 'Appointment Booking Submitted',
                    message: `Your appointment with Dr. ${appointmentData.doctor_name} has been submitted and is pending admin approval for payment verification.`,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: booking.booking_id || `${booking.id}`,
                    request_type: 'appointment'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Appointment booking notification sent to user:', appointmentData.user_id);
            } catch (notifError) {
                console.error('Error sending appointment booking notification:', notifError);
            }
        }
        
        return booking;
    } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
    }
}

async function handleBloodRequest(requestData) {
    try {
        const request = await dbService.addBloodRequest(requestData);
        
        // Send notification to user about pending blood request
        if (requestData.user_id) {
            try {
                const notificationData = {
                    user_id: requestData.user_id,
                    type: 'blood',
                    title: 'Blood Request Submitted',
                    message: `Your blood request for ${requestData.blood_group} (${requestData.units_needed} units) has been submitted and is pending admin approval.`,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: request.request_id || `${request.id}`,
                    request_type: 'blood'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Blood request notification sent to user:', requestData.user_id);
            } catch (notifError) {
                console.error('Error sending blood request notification:', notifError);
            }
        }
        
        return request;
    } catch (error) {
        console.error('Error submitting blood request:', error);
        throw error;
    }
}

async function handleAmbulanceRequest(requestData) {
    try {
        const request = await dbService.addAmbulanceRequest(requestData);
        
        // Send notification to user about pending ambulance request
        if (requestData.user_id) {
            try {
                const notificationData = {
                    user_id: requestData.user_id,
                    type: 'ambulance',
                    title: 'Ambulance Booking Submitted',
                    message: `Your ambulance booking request has been submitted and is pending admin approval. We will notify you once it's confirmed.`,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: request.request_id || `${request.id}`,
                    request_type: 'ambulance'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Ambulance request notification sent to user:', requestData.user_id);
            } catch (notifError) {
                console.error('Error sending ambulance request notification:', notifError);
            }
        }
        
        return request;
    } catch (error) {
        console.error('Error submitting ambulance request:', error);
        throw error;
    }
}

async function handleHospitalRequest(requestData) {
    try {
        const request = await dbService.addHospitalRequest(requestData);
        
        // Send notification to user about pending hospital booking
        if (requestData.user_id) {
            try {
                const notificationData = {
                    user_id: requestData.user_id,
                    type: 'hospital',
                    title: 'Hospital Booking Submitted',
                    message: `Your hospital booking request for ${requestData.hospital} has been submitted and is pending admin approval.`,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: request.request_id || `${request.id}`,
                    request_type: 'hospital'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Hospital request notification sent to user:', requestData.user_id);
            } catch (notifError) {
                console.error('Error sending hospital request notification:', notifError);
            }
        }
        
        return request;
    } catch (error) {
        console.error('Error submitting hospital request:', error);
        throw error;
    }
}

async function handleDonorRegistration(donorData) {
    try {
        if (donorData.user_id) {
            const existingDonor = await dbService.getBloodDonorByUserId(donorData.user_id);
            if (existingDonor) {
                throw new Error(`You have already registered as a donor! Donor ID: ${existingDonor.id}. Each user can only create one donor profile.`);
            }
        }
        
        const donor = await dbService.addBloodDonor(donorData);
        
        // Send notification to user about donor registration
        if (donorData.user_id) {
            try {
                const notificationData = {
                    user_id: donorData.user_id,
                    type: 'donor',
                    title: 'Donor Registration Submitted',
                    message: `Thank you for registering as a blood donor! Your profile is pending admin approval and will be visible once approved.`,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: `${donor.id}`,
                    request_type: 'donor'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Donor registration notification sent to user:', donorData.user_id);
            } catch (notifError) {
                console.error('Error sending donor registration notification:', notifError);
            }
        }
        
        return donor;
    } catch (error) {
        console.error('Error registering donor:', error);
        throw error;
    }
}

async function syncUserAppointments() {
    try {
        const currentUser = window.AuthSystem?.getUser();
        let userAppointments = [];
        
        console.log('🔄 syncUserAppointments called');
        console.log('  📍 AuthSystem available:', typeof window.AuthSystem !== 'undefined');
        console.log('  📍 Current user:', currentUser ? { email: currentUser.email, supabaseId: currentUser.supabaseId } : 'null');
        console.log('  📍 Notification system check:', typeof window.loadNotificationsFromSupabase === 'function' ? 'Available' : 'Not available');
        
        if (currentUser && currentUser.supabaseId) {
            console.log('🔄 Syncing appointments for logged-in user:', currentUser.supabaseId);
            const allAppointments = await dbService.getAppointments();
            
            userAppointments = allAppointments.filter(apt => {
                const aptUserId = String(apt.user_id);
                const currentUserId = String(currentUser.supabaseId);
                return aptUserId === currentUserId;
            });
            console.log(`📋 Found ${userAppointments.length} appointments for current user out of ${allAppointments.length} total`);
        } else {
            console.log('👤 No user logged in - syncing guest appointments by booking ID');
            
            if (typeof window.PointsSystem !== 'undefined' && window.PointsSystem.data.appointments) {
                const localBookingIds = window.PointsSystem.data.appointments
                    .map(apt => apt.bookingId)
                    .filter(id => id);
                
                if (localBookingIds.length > 0) {
                    console.log(`🔍 Looking for ${localBookingIds.length} guest appointments in database:`, localBookingIds);
                    const allAppointments = await dbService.getAppointments();
                    
                    userAppointments = allAppointments.filter(apt => {
                        return localBookingIds.includes(apt.booking_id);
                    });
                    console.log(`📋 Found ${userAppointments.length} matching guest appointments in database`);
                } else {
                    console.log('ℹ️ No local appointments to sync');
                    return;
                }
            } else {
                console.log('⚠️ PointsSystem not available or no local appointments');
                return;
            }
        }
        
        if (typeof window.PointsSystem !== 'undefined') {
            // Get user's points_per_appointment value
            let userPointsPerAppointment = 20; // default
            if (currentUser && currentUser.supabaseId) {
                try {
                    const user = await dbService.getUserById(currentUser.supabaseId);
                    if (user && user.points_per_appointment) {
                        userPointsPerAppointment = user.points_per_appointment;
                        console.log(`📊 Using user's custom points_per_appointment: ${userPointsPerAppointment}`);
                    }
                } catch (error) {
                    console.warn('⚠️ Could not fetch user points_per_appointment, using default 20:', error);
                }
            }
            
            window.PointsSystem.data.appointments = userAppointments.map(apt => {
                let points = 0;
                if (apt.status === 'approved' || apt.status === 'completed') {
                    points = userPointsPerAppointment;
                }
                
                const mappedApt = {
                    id: apt.id,
                    bookingId: apt.booking_id,
                    date: apt.created_at,
                    doctorName: apt.doctor_name,
                    doctorCategory: apt.doctor_specialty || 'General',
                    appointmentDate: apt.date,
                    appointmentTime: apt.time,
                    patientName: apt.patient_name,
                    patientAddress: apt.patient_address,
                    status: apt.status === 'approved' ? 'active' : apt.status,
                    points: points,
                    approvedAt: apt.approved_at,
                    transactionId: apt.bkash_transaction_id,
                    senderNumber: apt.bkash_number,
                    paymentMethod: apt.bkash_transaction_id ? 'bkash' : 'points',
                    paymentStatus: apt.status === 'approved' ? 'confirmed' : apt.status
                };
                
                console.log(`  📌 Appointment ${apt.booking_id}: status=${apt.status} → display_status=${mappedApt.status}, points=${points}`);
                return mappedApt;
            });
            
            window.PointsSystem.savePoints();
            await window.PointsSystem.updateAppointmentDisplay();
            console.log(`✅ Synced ${userAppointments.length} appointments and updated UI`);
            
            // Load notifications after syncing appointments to catch any new approval notifications
            if (currentUser && currentUser.supabaseId && typeof window.loadNotificationsFromSupabase === 'function') {
                console.log('🔔 Loading notifications after appointment sync...');
                await window.loadNotificationsFromSupabase();
            }
        } else {
            console.warn('⚠️ PointsSystem not available, cannot sync appointments');
        }
    } catch (error) {
        console.error('❌ Error syncing appointments:', error);
    }
}

async function syncUserPoints() {
    try {
        const currentUser = window.AuthSystem?.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            console.log('⚠️ No user logged in, skipping points sync');
            return;
        }

        console.log('💰 Syncing points for user:', currentUser.supabaseId);
        const user = await dbService.getUserById(currentUser.supabaseId);
        
        if (user && typeof window.PointsSystem !== 'undefined') {
            const totalEarnedPoints = user.points || 0;
            const adminAdjustedPoints = user.admin_adjusted_points || 0;
            
            const redeemRequests = await dbService.getRedeemRequestsByUserId(currentUser.supabaseId);
            const acceptedRequests = redeemRequests.filter(req => req.status === 'accepted');
            const totalRedeemedPoints = acceptedRequests.reduce((sum, req) => sum + req.points_to_redeem, 0);
            
            const adminAdjustments = await dbService.getAdminPointAdjustmentsByUserId(currentUser.supabaseId);
            
            const oldTotalPoints = window.PointsSystem.data.totalPoints || 0;
            const oldAdminPoints = window.PointsSystem.data.adminAdjustedPoints || 0;
            const oldRedeemedPoints = window.PointsSystem.data.redeemedPoints || 0;
            
            window.PointsSystem.data.totalPoints = totalEarnedPoints;
            window.PointsSystem.data.adminAdjustedPoints = adminAdjustedPoints;
            window.PointsSystem.data.redeemedPoints = totalRedeemedPoints;
            window.PointsSystem.data.adminAdjustmentRecords = adminAdjustments || [];
            window.PointsSystem.savePoints();
            window.PointsSystem.updateWalletDisplay();
            
            if (window.PointsSystem.updateTransactionHistory) {
                await window.PointsSystem.updateTransactionHistory();
            }
            
            if (totalEarnedPoints !== oldTotalPoints || adminAdjustedPoints !== oldAdminPoints || totalRedeemedPoints !== oldRedeemedPoints) {
                console.log(`✅ Points updated: Earned ${oldTotalPoints} → ${totalEarnedPoints}, Admin ${oldAdminPoints} → ${adminAdjustedPoints}, Redeemed ${oldRedeemedPoints} → ${totalRedeemedPoints}`);
            } else {
                console.log(`✅ Points synced: ${totalEarnedPoints} earned, ${adminAdjustedPoints} admin, ${totalRedeemedPoints} redeemed (no change)`);
            }
        } else if (!user) {
            console.warn('⚠️ User not found in database');
        } else {
            console.warn('⚠️ PointsSystem not available, cannot sync points');
        }
    } catch (error) {
        console.error('❌ Error syncing points:', error);
    }
}

async function syncBloodRequests() {
    try {
        const currentUser = window.AuthSystem?.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            console.log('⚠️ No user logged in, skipping blood requests sync');
            return;
        }

        console.log('🩸 Syncing blood requests for user:', currentUser.supabaseId);
        const userBloodRequests = await dbService.getBloodRequestsByUserId(currentUser.supabaseId);
        
        if (typeof window.bloodRequestsDatabase !== 'undefined' && Array.isArray(window.bloodRequestsDatabase)) {
            window.bloodRequestsDatabase.length = 0;
            
            const transformedRequests = userBloodRequests.map(req => ({
                id: req.id,
                patientName: req.patient_name,
                bloodGroup: req.blood_group,
                unitsNeeded: req.units_needed,
                hospital: req.hospital_name,
                requestDate: req.request_time ? req.request_time.split('T')[0] : new Date().toISOString().split('T')[0],
                urgency: req.priority_level ? req.priority_level.charAt(0).toUpperCase() + req.priority_level.slice(1) : 'Normal',
                status: req.status || 'pending',
                contactNumber: req.contact_number
            }));
            
            window.bloodRequestsDatabase.push(...transformedRequests);
            console.log(`✅ Synced ${transformedRequests.length} blood requests`);
            
            if (typeof window.populateBloodRequestHistory === 'function') {
                window.populateBloodRequestHistory();
            }
        }
    } catch (error) {
        console.error('❌ Error syncing blood requests:', error);
    }
}

async function syncAmbulanceRequests() {
    try {
        const currentUser = window.AuthSystem?.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            console.log('⚠️ No user logged in, skipping ambulance requests sync');
            return;
        }

        console.log('🚑 Syncing ambulance requests for user:', currentUser.supabaseId);
        const userAmbulanceRequests = await dbService.getAmbulanceRequestsByUserId(currentUser.supabaseId);
        
        // Clear both arrays
        if (typeof window.ambulanceBookingHistoryDatabase !== 'undefined' && Array.isArray(window.ambulanceBookingHistoryDatabase)) {
            window.ambulanceBookingHistoryDatabase.length = 0;
        }
        if (typeof window.driverBookedHistoryDatabase !== 'undefined' && Array.isArray(window.driverBookedHistoryDatabase)) {
            window.driverBookedHistoryDatabase.length = 0;
        }
        
        // Get unique driver IDs for driver bookings
        const driverBookings = userAmbulanceRequests.filter(req => req.booking_type === 'driver_booking');
        const driverIds = [...new Set(driverBookings.map(req => req.driver_id).filter(id => id))];
        
        // Fetch driver details for driver bookings
        let driversMap = {};
        if (driverIds.length > 0) {
            const { data: driversData, error: driversError } = await window.supabase
                .from('drivers')
                .select('id, name, photo, location, contact, ambulance_registration_number, ambulance_type')
                .in('id', driverIds);
            
            if (!driversError && driversData) {
                driversMap = driversData.reduce((acc, driver) => {
                    acc[driver.id] = driver;
                    return acc;
                }, {});
            }
        }
        
        // Separate and transform requests
        for (const req of userAmbulanceRequests) {
            if (req.booking_type === 'driver_booking' && req.driver_id) {
                // This is a driver booking
                const driver = driversMap[req.driver_id] || {};
                const driverBooking = {
                    id: req.id,
                    bookingId: `DB${req.id}`,
                    userId: currentUser.supabaseId,
                    driverName: req.driver_name || driver.name || 'Unknown Driver',
                    driverImage: driver.photo || 'https://via.placeholder.com/100',
                    driverLocation: driver.location || req.pickup_district || 'Unknown',
                    driverContact: req.driver_contact || driver.contact || 'N/A',
                    ambulanceType: req.ambulance_type || driver.ambulance_type || 'Basic Ambulance',
                    ambulanceRegNo: driver.ambulance_registration_number || 'N/A',
                    bookingDate: req.request_time ? req.request_time.split('T')[0] : new Date().toISOString().split('T')[0],
                    status: req.status || 'pending',
                    pickupLocation: req.pickup_location,
                    pickupDistrict: req.pickup_district,
                    pickupUpazila: req.pickup_upazila,
                    destination: req.destination_location,
                    destinationDistrict: req.destination_district,
                    destinationUpazila: req.destination_upazila
                };
                window.driverBookedHistoryDatabase.push(driverBooking);
            } else {
                // This is a regular ambulance request
                const ambulanceRequest = {
                    id: req.id,
                    userId: currentUser.supabaseId,
                    patientName: req.patient_name,
                    pickupLocation: req.pickup_location,
                    destination: req.destination_location,
                    pickupDistrict: req.pickup_district,
                    pickupUpazila: req.pickup_upazila,
                    destinationDistrict: req.destination_district,
                    destinationUpazila: req.destination_upazila,
                    ambulanceType: req.ambulance_type,
                    bookingDate: req.request_time ? req.request_time.split('T')[0] : new Date().toISOString().split('T')[0],
                    priority: req.priority_level ? req.priority_level.charAt(0).toUpperCase() + req.priority_level.slice(1) : 'Normal',
                    status: req.status || 'pending',
                    driverName: req.driver_name || null,
                    driverContact: req.driver_contact || null
                };
                window.ambulanceBookingHistoryDatabase.push(ambulanceRequest);
            }
        }
        
        console.log(`✅ Synced ${window.driverBookedHistoryDatabase.length} driver bookings and ${window.ambulanceBookingHistoryDatabase.length} ambulance requests`);
        
        if (typeof window.populateAmbulanceBookingHistory === 'function') {
            window.populateAmbulanceBookingHistory();
        }
    } catch (error) {
        console.error('❌ Error syncing ambulance requests:', error);
    }
}

async function syncUserPrescriptions() {
    try {
        const currentUser = window.AuthSystem?.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            console.log('⚠️ No user logged in, skipping prescriptions sync');
            return;
        }

        console.log('💊 Syncing prescriptions for user:', currentUser.supabaseId);
        const prescriptions = await dbService.getUserAppointmentsWithPrescriptions(currentUser.supabaseId);
        
        if (prescriptions && Array.isArray(prescriptions)) {
            const prescriptionData = {
                prescriptions: prescriptions.map(apt => ({
                    id: apt.id,
                    appointmentId: apt.id,
                    bookingId: apt.booking_id,
                    doctorName: apt.doctor_name,
                    doctorSpecialty: apt.doctor_specialty,
                    appointmentDate: apt.date,
                    appointmentTime: apt.time,
                    prescriptionUrl: apt.prescription_url,
                    prescriptionNotes: apt.prescription_notes,
                    status: 'available',
                    downloadable: true,
                    availableDate: apt.updated_at,
                    patientName: apt.patient_name
                }))
            };
            
            InMemoryStorage.prescriptionData = prescriptionData;
            console.log('✅ Prescriptions synced from Supabase:', prescriptionData.prescriptions.length);
            
            if (typeof window.updatePrescriptionDisplay === 'function') {
                window.updatePrescriptionDisplay();
            }
        } else {
            InMemoryStorage.prescriptionData = { prescriptions: [] };
            console.log('ℹ️ No prescriptions found for user');
            
            if (typeof window.updatePrescriptionDisplay === 'function') {
                window.updatePrescriptionDisplay();
            }
        }
    } catch (error) {
        console.error('❌ Error syncing prescriptions:', error);
    }
}

window.syncUserPrescriptions = syncUserPrescriptions;

async function syncDonorProfile() {
    try {
        const currentUser = window.AuthSystem?.getUser();
        if (!currentUser || !currentUser.supabaseId) {
            console.log('⚠️ No user logged in, skipping donor profile sync');
            InMemoryStorage.currentUserDonorId = null;
            return;
        }

        console.log('🩸 Checking for donor profile for user:', currentUser.supabaseId);
        const donorProfile = await dbService.getBloodDonorByUserId(currentUser.supabaseId);
        
        if (donorProfile) {
            InMemoryStorage.currentUserDonorId = donorProfile.id;
            console.log('✅ Found donor profile:', donorProfile.id);
            
            const donorStatus = donorProfile.approved ? 'Active' : 'Pending Admin Approval';
            console.log(`   Donor Status: ${donorStatus}`);
        } else {
            InMemoryStorage.currentUserDonorId = null;
            console.log('ℹ️ No donor profile found for user');
        }
    } catch (error) {
        console.error('❌ Error syncing donor profile:', error);
        InMemoryStorage.currentUserDonorId = null;
    }
}

window.syncDonorProfile = syncDonorProfile;

async function handleRedeemRequest(redeemData) {
    try {
        // Server-side check for pending requests to prevent race conditions
        const existingRequests = await dbService.getRedeemRequestsByUserId(redeemData.user_id);
        const pendingRequests = existingRequests.filter(req => req.status === 'pending');
        
        if (pendingRequests.length > 0) {
            throw new Error(`DUPLICATE_REQUEST: You already have a pending redeem request (ID: ${pendingRequests[0].request_id})`);
        }
        
        const request = await dbService.addRedeemRequest(redeemData);
        return request;
    } catch (error) {
        console.error('Error submitting redeem request:', error);
        throw error;
    }
}

window.userSupabaseHandlers = {
    signUp: handleUserSignUp,
    signIn: handleUserSignIn,
    updateProfile: handleUserProfileUpdate,
    bookAppointment: handleAppointmentBooking,
    requestBlood: handleBloodRequest,
    requestAmbulance: handleAmbulanceRequest,
    requestHospital: handleHospitalRequest,
    registerDonor: handleDonorRegistration,
    syncAppointments: syncUserAppointments,
    syncPoints: syncUserPoints,
    syncBloodRequests: syncBloodRequests,
    syncAmbulanceRequests: syncAmbulanceRequests,
    syncPrescriptions: syncUserPrescriptions,
    syncDonorProfile: syncDonorProfile,
    submitRedeemRequest: handleRedeemRequest
};

window.handleBloodRequest = handleBloodRequest;
window.handleAmbulanceRequest = handleAmbulanceRequest;
window.handleHospitalRequest = handleHospitalRequest;
window.handleRedeemRequest = handleRedeemRequest;

if (typeof window.supabase !== 'undefined' && typeof window.dbService !== 'undefined') {
    setTimeout(() => {
        initializeUserApp();
    }, 1500);
} else {
    console.warn('⚠️ Supabase or dbService not loaded. Waiting for initialization...');
    const checkInterval = setInterval(() => {
        if (typeof window.supabase !== 'undefined' && typeof window.dbService !== 'undefined') {
            clearInterval(checkInterval);
            setTimeout(() => {
                initializeUserApp();
            }, 1500);
        }
    }, 500);
}

console.log('✅ User Supabase integration loaded');
console.log('📱 User application will now use Supabase for data');
console.log('🔄 Demo data will be replaced with Supabase data once loaded');
