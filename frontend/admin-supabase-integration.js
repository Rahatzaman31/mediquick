adminData.doctors = [];
adminData.hospitals = [];
adminData.pharmacies = [];
adminData.bloodDonors = [];
adminData.drivers = [];
adminData.users = [];
adminData.appointments = [];
adminData.specialistCategories = [];
adminData.emergencyServices = {
    ambulanceRequests: [],
    bloodRequests: [],
    hospitalRequests: []
};
adminData.bannerImages = {};
adminData.prescriptions = [];
adminData.contactMessages = [];
adminData.termsConditions = [];
adminData.privacyPolicy = [];

const originalLoadDoctorsTable = window.loadDoctorsTable;
window.loadDoctorsTable = async function() {
    try {
        const doctors = await dbService.getDoctors();
        adminData.doctors = doctors;
        
        const tbody = document.getElementById('doctors-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (doctors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">No doctors found. Click "Add Doctor" to add your first doctor.</td></tr>';
            return;
        }
        
        doctors.forEach(doctor => {
            const row = `
                <tr>
                    <td><img src="${doctor.image || 'https://via.placeholder.com/50'}" alt="${doctor.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"></td>
                    <td>${doctor.name}</td>
                    <td>${doctor.specialty}</td>
                    <td>${doctor.degree || 'N/A'}</td>
                    <td>${doctor.workplace || 'N/A'}</td>
                    <td>${doctor.rating || 0} ⭐ (${doctor.reviews || 0})</td>
                    <td><span class="status-badge ${doctor.status}">${doctor.status}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="editDoctor(${doctor.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteDoctor(${doctor.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
        showNotification('Error loading doctors: ' + error.message, 'error');
    }
};

window.loadHospitalsTable = async function() {
    try {
        const hospitals = await dbService.getHospitals();
        adminData.hospitals = hospitals;
        
        const tbody = document.getElementById('hospitals-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (hospitals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #64748b;">No hospitals found. Click "Add Hospital" to add your first hospital.</td></tr>';
            return;
        }
        
        hospitals.forEach(hospital => {
            const row = `
                <tr>
                    <td>
                        <strong>${hospital.name}</strong>
                    </td>
                    <td>
                        ${hospital.type || 'N/A'}<br>
                        ${hospital.discount_percentage ? `<span class="discount-badge">${hospital.discount_percentage}% OFF</span>` : ''}
                    </td>
                    <td>
                        ${hospital.location || 'N/A'}<br>
                        ${hospital.contact || 'N/A'}
                    </td>
                    <td>
                        ${hospital.rating || 0} ⭐ (${hospital.reviews_count || 0})<br>
                        Beds: ${hospital.available_beds || 0}/${hospital.total_beds || 0}
                    </td>
                    <td>${hospital.specialities ? hospital.specialities.join(', ') : 'N/A'}</td>
                    <td><span class="status-badge ${hospital.status}">${hospital.status}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="showEditHospitalModal(${hospital.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteHospital(${hospital.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading hospitals:', error);
        showNotification('Error loading hospitals: ' + error.message, 'error');
    }
};

window.loadPharmaciesTable = async function() {
    try {
        const pharmacies = await dbService.getPharmacies();
        adminData.pharmacies = pharmacies;
        
        const tbody = document.getElementById('pharmacies-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (pharmacies.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #64748b;">No pharmacies found. Click "Add Pharmacy" to add your first pharmacy.</td></tr>';
            return;
        }
        
        pharmacies.forEach(pharmacy => {
            const row = `
                <tr>
                    <td>
                        <strong>${pharmacy.name}</strong>
                        ${pharmacy.image_url ? `<br><small>Image: Available</small>` : ''}
                    </td>
                    <td>
                        ${pharmacy.location || 'N/A'}<br>
                        ${pharmacy.contact || 'N/A'}
                    </td>
                    <td>
                        ${pharmacy.discount_percentage ? `<span class="discount-badge">${pharmacy.discount_percentage}% OFF</span>` : ''}
                        ${pharmacy.discount_tag ? `<br><small>${pharmacy.discount_tag}</small>` : ''}
                    </td>
                    <td><span class="status-badge ${pharmacy.status}">${pharmacy.status}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="editPharmacy(${pharmacy.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deletePharmacy(${pharmacy.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading pharmacies:', error);
        showNotification('Error loading pharmacies: ' + error.message, 'error');
    }
};

window.loadBloodDonorsTable = async function() {
    try {
        const donors = await dbService.getBloodDonors();
        adminData.bloodDonors = donors;
        
        const tbody = document.getElementById('donors-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (donors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">No blood donors found. Click "Add Donor" to add your first donor.</td></tr>';
            return;
        }
        
        donors.forEach(donor => {
            const row = `
                <tr>
                    <td>${donor.name}</td>
                    <td><span class="blood-group-badge">${donor.blood_group}</span></td>
                    <td>${donor.contact}</td>
                    <td>${donor.district || 'N/A'}, ${donor.upazila || 'N/A'}</td>
                    <td>${donor.age || 'N/A'} / ${donor.gender || 'N/A'}</td>
                    <td>${donor.last_donation_date || 'Never'}</td>
                    <td><span class="status-badge ${donor.approved ? 'approved' : 'pending'}">${donor.approved ? 'Approved' : 'Pending'}</span></td>
                    <td>
                        ${!donor.approved ? `<button class="action-btn approve" onclick="approveDonor(${donor.id})"><i class="fas fa-check"></i></button>` : ''}
                        <button class="action-btn edit" onclick="showEditDonorModal(${donor.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteBloodDonor(${donor.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading blood donors:', error);
        showNotification('Error loading blood donors: ' + error.message, 'error');
    }
};

window.loadDriversTable = async function() {
    try {
        const drivers = await dbService.getDrivers();
        adminData.drivers = drivers;
        
        const tbody = document.getElementById('drivers-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (drivers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">No drivers found. Click "Add Driver" to add your first driver.</td></tr>';
            return;
        }
        
        drivers.forEach(driver => {
            const row = `
                <tr>
                    <td>
                        ${driver.photo ? `<img src="${driver.photo}" alt="${driver.name}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">` : ''}
                        <strong>${driver.name}</strong><br>
                        ${driver.contact}
                    </td>
                    <td>
                        ${driver.license}<br>
                        Exp: ${driver.experience || 'N/A'}
                    </td>
                    <td>
                        ${driver.ambulance_type || 'N/A'}<br>
                        ${driver.ambulance_registration_number || 'N/A'}
                    </td>
                    <td>
                        ${driver.district || 'N/A'}, ${driver.upazila || 'N/A'}<br>
                        ${driver.location || driver.address || 'N/A'}
                    </td>
                    <td><span class="status-badge ${driver.status}">${driver.status}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="showEditDriverModal(${driver.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteDriver(${driver.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading drivers:', error);
        showNotification('Error loading drivers: ' + error.message, 'error');
    }
};

window.loadUsersTable = async function() {
    try {
        const users = await dbService.getUsers();
        adminData.users = users;
        
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #64748b;">No users registered yet.</td></tr>';
            return;
        }
        
        users.forEach(user => {
            const row = `
                <tr>
                    <td><div class="user-avatar">${user.avatar ? `<img src="${user.avatar}">` : user.name.charAt(0)}</div></td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.mobile || 'N/A'}</td>
                    <td>${user.district || 'N/A'}, ${user.upazila || 'N/A'}</td>
                    <td>${user.points || 0}</td>
                    <td>${user.join_date || 'N/A'}</td>
                    <td><span class="status-badge ${user.status}">${user.status}</span></td>
                    <td>
                        <button class="action-btn view" onclick="viewUserDetails(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="showEditUserModal(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Error loading users: ' + error.message, 'error');
    }
};

window.loadSpecialistCategoriesTable = async function() {
    try {
        const categories = await dbService.getSpecialistCategories();
        adminData.specialistCategories = categories;
        
        const tbody = document.getElementById('specialist-categories-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">No specialist categories found. Click "Add Category" to add your first category.</td></tr>';
            return;
        }
        
        categories.forEach(category => {
            const iconDisplay = category.icon_url ?
                `<img src="${category.icon_url}" style="width: 32px; height: 32px; object-fit: contain;" alt="${category.title}">` :
                `<i class="${category.icon_class}" style="color: ${category.icon_color}; font-size: 28px;"></i>`;
            
            const searchTerms = category.search_terms ? category.search_terms.join(', ') : 'N/A';
            const statusBadge = category.is_active ? 'active' : 'inactive';
            const statusText = category.is_active ? 'Active' : 'Inactive';
            
            const row = `
                <tr>
                    <td>${iconDisplay}</td>
                    <td><strong>${category.title}</strong><br><small>${category.category_key}</small></td>
                    <td>${category.subtitle || 'N/A'}</td>
                    <td><small>${searchTerms}</small></td>
                    <td><span class="status-badge ${statusBadge}">${statusText}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="editSpecialistCategory(${category.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteSpecialistCategory(${category.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading specialist categories:', error);
        showNotification('Error loading specialist categories: ' + error.message, 'error');
    }
};

window.loadAppointmentsTable = async function(filteredAppointments = null) {
    try {
        const appointments = filteredAppointments || await dbService.getAppointments();
        if (!filteredAppointments) {
            adminData.appointments = appointments;
        }
        
        const tbody = document.getElementById('appointments-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">No appointments found.</td></tr>';
            return;
        }
        
        appointments.forEach(appointment => {
            const row = `
                <tr>
                    <td><strong>${appointment.user_id || 'N/A'}</strong></td>
                    <td><strong>${appointment.booking_id}</strong></td>
                    <td>${appointment.patient_name}</td>
                    <td>${appointment.doctor_name}<br><small>${appointment.doctor_specialty || ''}</small></td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <button class="action-btn view" onclick="viewAppointmentDetails(${appointment.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${appointment.status === 'pending' ? `<button class="action-btn approve" onclick="approveAppointment(${appointment.id})"><i class="fas fa-check"></i></button>` : ''}
                        ${appointment.status !== 'cancelled' ? `<button class="action-btn delete" onclick="cancelAppointment(${appointment.id})"><i class="fas fa-times"></i></button>` : ''}
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
        showNotification('Error loading appointments: ' + error.message, 'error');
    }
};

window.loadDashboardStats = async function() {
    try {
        const [doctors, users, appointments, donors, hospitals, categories, banners] = await Promise.all([
            dbService.getDoctors(),
            dbService.getUsers(),
            dbService.getAppointments(),
            dbService.getBloodDonors(),
            dbService.getHospitals(),
            dbService.getSpecialistCategories(),
            dbService.getBannerImages()
        ]);
        
        const ambulanceReqs = await dbService.getAmbulanceRequests();
        const bloodReqs = await dbService.getBloodRequests();
        const hospitalReqs = await dbService.getHospitalRequests();
        
        adminData.emergencyServices.ambulanceRequests = ambulanceReqs;
        adminData.emergencyServices.bloodRequests = bloodReqs;
        adminData.emergencyServices.hospitalRequests = hospitalReqs;
        
        const totalEmergency = ambulanceReqs.length + bloodReqs.length + hospitalReqs.length;
        
        document.getElementById('total-doctors').textContent = doctors.length;
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-appointments').textContent = appointments.length;
        document.getElementById('total-emergency').textContent = totalEmergency;
        document.getElementById('total-categories').textContent = categories.length;
        document.getElementById('total-banner-images').textContent = banners.length;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
};

window.deleteDoctor = async function(doctorId) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
        await dbService.deleteDoctor(doctorId);
        showNotification('Doctor deleted successfully', 'success');
        loadDoctorsTable();
        loadDashboardStats();
    } catch (error) {
        console.error('Error deleting doctor:', error);
        showNotification('Error deleting doctor: ' + error.message, 'error');
    }
};

window.deleteHospital = async function(hospitalId) {
    if (!confirm('Are you sure you want to delete this hospital?')) return;
    
    try {
        await dbService.deleteHospital(hospitalId);
        showNotification('Hospital deleted successfully', 'success');
        loadHospitalsTable();
        loadDashboardStats();
    } catch (error) {
        console.error('Error deleting hospital:', error);
        showNotification('Error deleting hospital: ' + error.message, 'error');
    }
};

window.deleteBloodDonor = async function(donorId) {
    if (!confirm('Are you sure you want to delete this blood donor?')) return;
    
    try {
        await dbService.deleteBloodDonor(donorId);
        showNotification('Blood donor deleted successfully', 'success');
        loadBloodDonorsTable();
    } catch (error) {
        console.error('Error deleting blood donor:', error);
        showNotification('Error deleting blood donor: ' + error.message, 'error');
    }
};

window.deleteDriver = async function(driverId) {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    
    try {
        await dbService.deleteDriver(driverId);
        showNotification('Driver deleted successfully', 'success');
        loadDriversTable();
    } catch (error) {
        console.error('Error deleting driver:', error);
        showNotification('Error deleting driver: ' + error.message, 'error');
    }
};

window.showEditDriverModal = async function(driverId) {
    try {
        const driver = await dbService.getDriverById(driverId);
        if (!driver) {
            showNotification('Driver not found', 'error');
            return;
        }
        
        document.getElementById('edit-driver-id').value = driver.id;
        document.getElementById('edit-driver-name').value = driver.name || '';
        document.getElementById('edit-driver-contact').value = driver.contact || '';
        document.getElementById('edit-driver-district').value = driver.district || '';
        document.getElementById('edit-driver-photo').value = driver.photo || '';
        document.getElementById('edit-driver-license').value = driver.license || '';
        document.getElementById('edit-driver-experience').value = driver.experience || '';
        document.getElementById('edit-driver-licenseExpiry').value = driver.license_expiry || '';
        document.getElementById('edit-driver-ambulanceType').value = driver.ambulance_type || '';
        document.getElementById('edit-driver-ambulanceRegNo').value = driver.ambulance_registration_number || '';
        document.getElementById('edit-driver-vehicleModel').value = driver.vehicle_model || '';
        document.getElementById('edit-driver-manufacturingYear').value = driver.manufacturing_year || '';
        document.getElementById('edit-driver-availability').value = driver.status || 'available';
        document.getElementById('edit-driver-workingShift').value = driver.working_shift || 'flexible';
        document.getElementById('edit-driver-emergencyContact').value = driver.emergency_contact || '';
        document.getElementById('edit-driver-joiningDate').value = driver.joining_date || '';
        document.getElementById('edit-driver-serviceArea').value = driver.service_area || 'local';
        document.getElementById('edit-driver-rating').value = driver.rating || '';
        document.getElementById('edit-driver-address').value = driver.address || '';
        document.getElementById('edit-driver-specialSkills').value = driver.special_skills || '';
        document.getElementById('edit-driver-notes').value = driver.notes || '';
        
        updateDriverUpazilaOptions('edit');
        setTimeout(() => {
            document.getElementById('edit-driver-upazila').value = driver.upazila || '';
        }, 100);
        
        showModal('edit-driver-modal');
    } catch (error) {
        console.error('Error loading driver for edit:', error);
        showNotification('Error loading driver: ' + error.message, 'error');
    }
};

window.handleEditDriver = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const driverId = parseInt(formData.get('id'));
    
    try {
        const experienceValue = formData.get('experience');
        const manufacturingYearValue = formData.get('manufacturingYear');
        const ratingValue = formData.get('rating');
        
        const updates = {
            name: formData.get('name'),
            contact: formData.get('contact'),
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            address: formData.get('address') || null,
            photo: formData.get('photo') || null,
            license: formData.get('license'),
            license_expiry: formData.get('licenseExpiry') || null,
            experience: experienceValue && experienceValue.trim() ? parseInt(experienceValue) : 0,
            ambulance_type: formData.get('ambulanceType'),
            ambulance_registration_number: formData.get('ambulanceRegNo'),
            vehicle_model: formData.get('vehicleModel') || null,
            manufacturing_year: manufacturingYearValue && manufacturingYearValue.trim() ? parseInt(manufacturingYearValue) : null,
            status: formData.get('availability') || 'available',
            working_shift: formData.get('workingShift') || 'flexible',
            emergency_contact: formData.get('emergencyContact') || null,
            joining_date: formData.get('joiningDate') || null,
            service_area: formData.get('serviceArea') || 'local',
            rating: ratingValue && ratingValue.trim() ? parseFloat(ratingValue) : null,
            special_skills: formData.get('specialSkills') || null,
            notes: formData.get('notes') || null
        };
        
        console.log('🔍 Driver ID:', driverId);
        console.log('🔍 Update data:', updates);
        
        await dbService.updateDriver(driverId, updates);
        showNotification('Driver updated successfully', 'success');
        closeModal('edit-driver-modal');
        loadDriversTable();
    } catch (error) {
        console.error('Error updating driver:', error);
        showNotification('Error updating driver: ' + error.message, 'error');
    }
};

window.approveDonor = async function(donorId) {
    try {
        await dbService.updateBloodDonor(donorId, {
            approved: true,
            approval_date: new Date().toISOString().split('T')[0]
        });
        showNotification('Donor approved successfully', 'success');
        loadBloodDonorsTable();
    } catch (error) {
        console.error('Error approving donor:', error);
        showNotification('Error approving donor: ' + error.message, 'error');
    }
};

window.approveAppointment = async function(appointmentId) {
    try {
        console.log('🔄 Admin approving appointment:', appointmentId);
        const appointment = await dbService.getAppointmentById(appointmentId);
        if (!appointment) {
            showNotification('Appointment not found', 'error');
            return;
        }
        
        console.log('📋 Appointment details:', {
            id: appointment.id,
            booking_id: appointment.booking_id,
            user_id: appointment.user_id,
            status: appointment.status
        });
        
        await dbService.updateAppointment(appointmentId, { 
            status: 'approved',
            approved_at: new Date().toISOString()
        });
        console.log('✅ Appointment status updated to: approved');
        
        // Send appointment approval notification to user
        if (appointment.user_id) {
            try {
                const approvalNotificationData = {
                    user_id: appointment.user_id,
                    type: 'appointment',
                    title: 'Appointment Payment Verified',
                    message: `Your appointment payment has been verified successfully! Your appointment with ${appointment.doctor_name || 'doctor'} is now confirmed. Booking ID: ${appointment.booking_id || appointment.bookingId}`,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: appointment.booking_id || `${appointmentId}`,
                    request_type: 'appointment'
                };
                await window.dbService.addNotification(approvalNotificationData);
                console.log('✅ Appointment approval notification sent to user:', appointment.user_id);
            } catch (notifError) {
                console.error('❌ Error sending appointment approval notification:', notifError);
            }
        }
        
        let pointsEarned = 0;
        if (appointment.user_id) {
            try {
                const user = await dbService.getUserById(appointment.user_id);
                if (user) {
                    console.log('🔍 DEBUG: User data from database:', {
                        id: user.id,
                        name: user.name,
                        points: user.points,
                        points_per_appointment: user.points_per_appointment,
                        raw_points_per_appointment_value: JSON.stringify(user.points_per_appointment)
                    });
                    const oldPoints = user.points || 0;
                    const pointsToAdd = user.points_per_appointment || 20;
                    console.log(`🔍 DEBUG: Using points_per_appointment=${pointsToAdd} (from user.points_per_appointment=${user.points_per_appointment})`);
                    const newPoints = oldPoints + pointsToAdd;
                    await dbService.updateUser(appointment.user_id, { points: newPoints });
                    pointsEarned = pointsToAdd;
                    console.log(`✅ Added ${pointsToAdd} points to user ${user.name || user.email}. Points: ${oldPoints} → ${newPoints}`);
                    
                    // Send points earned notification to user
                    try {
                        const pointsNotificationData = {
                            user_id: appointment.user_id,
                            type: 'points',
                            title: 'Points Earned!',
                            message: `Congratulations! You earned ${pointsToAdd} points for your completed appointment with ${appointment.doctor_name || 'doctor'}. Total points: ${newPoints}`,
                            is_read: false,
                            created_at: new Date().toISOString(),
                            request_id: appointment.booking_id || `${appointmentId}`,
                            request_type: 'points'
                        };
                        await window.dbService.addNotification(pointsNotificationData);
                        console.log('✅ Points earned notification sent to user:', appointment.user_id);
                    } catch (notifError) {
                        console.error('❌ Error sending points earned notification:', notifError);
                    }
                } else {
                    console.warn('⚠️ User not found for user_id:', appointment.user_id);
                }
            } catch (pointsError) {
                console.error('❌ Error adding points to user:', pointsError);
            }
        } else {
            console.warn('⚠️ Appointment has no user_id, cannot award points');
        }
        
        const successMessage = pointsEarned > 0 
            ? `Appointment approved successfully. User earned ${pointsEarned} points!`
            : 'Appointment approved successfully';
        showNotification(successMessage, 'success');
        loadAppointmentsTable();
        console.log('🔄 Appointment table refreshed');
    } catch (error) {
        console.error('❌ Error approving appointment:', error);
        showNotification('Error approving appointment: ' + error.message, 'error');
    }
};

window.completeAppointment = async function(appointmentId) {
    try {
        console.log('🔄 Admin completing appointment:', appointmentId);
        const appointment = await dbService.getAppointmentById(appointmentId);
        if (!appointment) {
            showNotification('Appointment not found', 'error');
            return;
        }
        
        await dbService.updateAppointment(appointmentId, { 
            status: 'completed',
            completed_at: new Date().toISOString()
        });
        console.log('✅ Appointment status updated to: completed');
        
        // Send notification to user
        if (appointment.user_id) {
            try {
                const notificationData = {
                    user_id: appointment.user_id,
                    type: 'appointment',
                    title: 'Appointment Completed',
                    message: `Your appointment with ${appointment.doctor_name || 'doctor'} has been completed successfully. Booking ID: ${appointment.booking_id || appointment.bookingId}`,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    request_id: appointment.booking_id || `${appointmentId}`,
                    request_type: 'appointment'
                };
                await window.dbService.addNotification(notificationData);
                console.log('Appointment completion notification sent to user:', appointment.user_id);
            } catch (notifError) {
                console.error('Error sending appointment completion notification:', notifError);
            }
        }
        
        showNotification('Appointment marked as completed successfully', 'success');
        loadAppointmentsTable();
        console.log('🔄 Appointment table refreshed');
    } catch (error) {
        console.error('❌ Error completing appointment:', error);
        showNotification('Error completing appointment: ' + error.message, 'error');
    }
};

window.cancelAppointment = async function(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
        const appointment = await dbService.getAppointmentById(appointmentId);
        if (!appointment) {
            showNotification('Appointment not found', 'error');
            return;
        }
        
        await dbService.updateAppointment(appointmentId, { status: 'cancelled' });
        
        showNotification('Appointment cancelled successfully', 'success');
        loadAppointmentsTable();
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        showNotification('Error cancelling appointment: ' + error.message, 'error');
    }
};

const originalHandleAddDoctor = window.handleAddDoctor;
window.handleAddDoctor = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const visitingDays = Array.from(formData.getAll('visitingDays'));
        const offDays = Array.from(formData.getAll('offDays'));
        
        // Get health tips from form or use default FAQs
        const healthTipQuestions = formData.getAll('healthTipQuestion[]');
        const healthTipAnswers = formData.getAll('healthTipAnswer[]');
        let healthTips = [];
        for (let i = 0; i < healthTipQuestions.length; i++) {
            if (healthTipQuestions[i] && healthTipAnswers[i]) {
                healthTips.push({
                    question: healthTipQuestions[i],
                    answer: healthTipAnswers[i]
                });
            }
        }
        
        // If no health tips provided, use DEFAULT_HEALTH_TIPS from admin-script.js (deep copy to avoid mutation)
        if (healthTips.length === 0 && typeof DEFAULT_HEALTH_TIPS !== 'undefined') {
            healthTips = JSON.parse(JSON.stringify(DEFAULT_HEALTH_TIPS));
        }
        
        const newDoctor = {
            name: formData.get('name'),
            specialty: formData.get('specialty'),
            degree: formData.get('degree'),
            workplace: formData.get('workplace'),
            image: formData.get('image') || 'https://via.placeholder.com/80x80',
            status: formData.get('status') || 'active',
            rating: parseFloat(formData.get('rating')) || 0,
            reviews: parseInt(formData.get('reviews')) || 0,
            patients: formData.get('patients'),
            experience: formData.get('experience'),
            about: formData.get('about') || 'Professional healthcare provider',
            visiting_days: visitingDays,
            off_days: offDays,
            chamber_address: formData.get('chamberAddress') || '',
            health_tips: healthTips
        };
        
        await dbService.addDoctor(newDoctor);
        await loadDoctorsTable();
        await loadDashboardStats();
        
        closeModal('add-doctor-modal');
        event.target.reset();
        if (typeof clearDynamicSections === 'function') clearDynamicSections('add');
        
        showNotification(`Dr. ${newDoctor.name} has been successfully added to the system.`, 'success');
    } catch (error) {
        console.error('Error adding doctor:', error);
        showNotification('Error adding doctor: ' + error.message, 'error');
    }
};

window.handleAddHospital = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        console.log('🏥 Adding Hospital - Form Data:');
        console.log('name:', formData.get('name'));
        console.log('type:', formData.get('type'));
        console.log('address:', formData.get('address'));
        console.log('contact:', formData.get('contact'));
        console.log('imageUrl:', formData.get('imageUrl'));
        console.log('rating:', formData.get('rating'));
        console.log('reviewsCount:', formData.get('reviewsCount'));
        console.log('discountPercentage:', formData.get('discountPercentage'));
        console.log('specialOffer:', formData.get('specialOffer'));
        console.log('offerText:', formData.get('offerText'));
        console.log('about:', formData.get('about'));
        
        const selectedSpecialities = [];
        document.querySelectorAll('#add-hospital-form input[name="specialities"]:checked').forEach(checkbox => {
            selectedSpecialities.push(checkbox.value);
        });
        console.log('selectedSpecialities:', selectedSpecialities);
        
        const facilities = {
            icu_available: formData.get('icuAvailable') === 'true',
            icu_beds: parseInt(formData.get('icuBeds')) || 0,
            ccu_available: formData.get('ccuAvailable') === 'true',
            ccu_beds: parseInt(formData.get('ccuBeds')) || 0,
            emergency_available: formData.get('emergencyAvailable') === 'true',
            emergency_beds: parseInt(formData.get('emergencyBeds')) || 0,
            operation_theater: formData.get('operationTheater') === 'true',
            pharmacy: formData.get('pharmacy') === 'true',
            laboratory: formData.get('laboratory') === 'true',
            radiology: formData.get('radiology') === 'true'
        };
        console.log('facilities:', facilities);
        
        const roomPricing = {
            general_ward_beds: parseInt(formData.get('generalWardBeds')) || 0,
            general_ward_price: parseInt(formData.get('generalWardPrice')) || 0,
            ac_cabin_beds: parseInt(formData.get('acCabinBeds')) || 0,
            ac_cabin_price: parseInt(formData.get('acCabinPrice')) || 0,
            non_ac_cabin_beds: parseInt(formData.get('nonAcCabinBeds')) || 0,
            non_ac_cabin_price: parseInt(formData.get('nonAcCabinPrice')) || 0,
            icu_available_beds: parseInt(formData.get('icuAvailableBeds')) || 0,
            icu_price: parseInt(formData.get('icuPrice')) || 0,
            ccu_available_beds: parseInt(formData.get('ccuAvailableBeds')) || 0,
            ccu_price: parseInt(formData.get('ccuPrice')) || 0
        };
        console.log('roomPricing:', roomPricing);
        
        const newHospital = {
            name: formData.get('name'),
            type: formData.get('type'),
            location: formData.get('address'),
            contact: formData.get('contact'),
            image_url: formData.get('imageUrl') || null,
            status: 'active',
            rating: parseFloat(formData.get('rating')) || 0,
            reviews_count: parseInt(formData.get('reviewsCount')) || 0,
            discount_percentage: parseInt(formData.get('discountPercentage')) || 0,
            special_offer: formData.get('specialOffer') || '',
            offer_text: formData.get('offerText') || '',
            about: formData.get('about') || '',
            specialities: selectedSpecialities,
            facilities: facilities,
            room_pricing: roomPricing
        };
        
        console.log('📤 Sending to database:', newHospital);
        
        await dbService.addHospital(newHospital);
        
        console.log('✅ Hospital added successfully');
        
        await loadHospitalsTable();
        await loadDashboardStats();
        
        closeModal('add-hospital-modal');
        event.target.reset();
        
        showNotification(`${newHospital.name} has been successfully added.`, 'success');
    } catch (error) {
        console.error('❌ Error adding hospital:', error);
        showNotification('Error adding hospital: ' + error.message, 'error');
    }
};

window.showEditHospitalModal = async function(hospitalId) {
    try {
        const hospital = await dbService.getHospitalById(hospitalId);
        if (!hospital) {
            showNotification('Hospital not found', 'error');
            return;
        }
        
        document.getElementById('edit-hospital-id').value = hospital.id;
        document.getElementById('edit-hospital-name').value = hospital.name || '';
        document.getElementById('edit-hospital-type').value = hospital.type || '';
        document.getElementById('edit-hospital-contact').value = hospital.contact || '';
        document.getElementById('edit-hospital-imageUrl').value = hospital.image_url || '';
        document.getElementById('edit-hospital-address').value = hospital.location || '';
        document.getElementById('edit-hospital-rating').value = hospital.rating || '';
        document.getElementById('edit-hospital-reviewsCount').value = hospital.reviews_count || '';
        document.getElementById('edit-hospital-discountPercentage').value = hospital.discount_percentage || '';
        document.getElementById('edit-hospital-specialOffer').value = hospital.special_offer || '';
        document.getElementById('edit-hospital-offerText').value = hospital.offer_text || '';
        document.getElementById('edit-hospital-about').value = hospital.about || '';
        
        const specialities = hospital.specialities || [];
        document.querySelectorAll('#edit-hospital-form input[name="specialities"]').forEach(checkbox => {
            checkbox.checked = specialities.includes(checkbox.value);
        });
        
        const facilities = hospital.facilities || {};
        document.getElementById('edit-hospital-icuAvailable').value = facilities.icu_available !== false ? 'true' : 'false';
        document.getElementById('edit-hospital-icuBeds').value = facilities.icu_beds || '';
        document.getElementById('edit-hospital-ccuAvailable').value = facilities.ccu_available !== false ? 'true' : 'false';
        document.getElementById('edit-hospital-ccuBeds').value = facilities.ccu_beds || '';
        document.getElementById('edit-hospital-emergencyAvailable').value = facilities.emergency_available !== false ? 'true' : 'false';
        document.getElementById('edit-hospital-emergencyBeds').value = facilities.emergency_beds || '';
        document.getElementById('edit-hospital-operationTheater').value = facilities.operation_theater !== false ? 'true' : 'false';
        document.getElementById('edit-hospital-pharmacy').value = facilities.pharmacy !== false ? 'true' : 'false';
        document.getElementById('edit-hospital-laboratory').value = facilities.laboratory !== false ? 'true' : 'false';
        document.getElementById('edit-hospital-radiology').value = facilities.radiology !== false ? 'true' : 'false';
        
        const roomPricing = hospital.room_pricing || {};
        document.getElementById('edit-hospital-generalWardBeds').value = roomPricing.general_ward_beds || '';
        document.getElementById('edit-hospital-generalWardPrice').value = roomPricing.general_ward_price || '';
        document.getElementById('edit-hospital-acCabinBeds').value = roomPricing.ac_cabin_beds || '';
        document.getElementById('edit-hospital-acCabinPrice').value = roomPricing.ac_cabin_price || '';
        document.getElementById('edit-hospital-nonAcCabinBeds').value = roomPricing.non_ac_cabin_beds || '';
        document.getElementById('edit-hospital-nonAcCabinPrice').value = roomPricing.non_ac_cabin_price || '';
        document.getElementById('edit-hospital-icuAvailableBeds').value = roomPricing.icu_available_beds || '';
        document.getElementById('edit-hospital-icuPrice').value = roomPricing.icu_price || '';
        document.getElementById('edit-hospital-ccuAvailableBeds').value = roomPricing.ccu_available_beds || '';
        document.getElementById('edit-hospital-ccuPrice').value = roomPricing.ccu_price || '';
        
        showModal('edit-hospital-modal');
    } catch (error) {
        console.error('Error loading hospital for edit:', error);
        showNotification('Error loading hospital: ' + error.message, 'error');
    }
};

window.handleEditHospital = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const hospitalId = parseInt(formData.get('id'));
    
    try {
        const selectedSpecialities = [];
        document.querySelectorAll('#edit-hospital-form input[name="specialities"]:checked').forEach(checkbox => {
            selectedSpecialities.push(checkbox.value);
        });
        
        const facilities = {
            icu_available: formData.get('icuAvailable') === 'true',
            icu_beds: parseInt(formData.get('icuBeds')) || 0,
            ccu_available: formData.get('ccuAvailable') === 'true',
            ccu_beds: parseInt(formData.get('ccuBeds')) || 0,
            emergency_available: formData.get('emergencyAvailable') === 'true',
            emergency_beds: parseInt(formData.get('emergencyBeds')) || 0,
            operation_theater: formData.get('operationTheater') === 'true',
            pharmacy: formData.get('pharmacy') === 'true',
            laboratory: formData.get('laboratory') === 'true',
            radiology: formData.get('radiology') === 'true'
        };
        
        const roomPricing = {
            general_ward_beds: parseInt(formData.get('generalWardBeds')) || 0,
            general_ward_price: parseInt(formData.get('generalWardPrice')) || 0,
            ac_cabin_beds: parseInt(formData.get('acCabinBeds')) || 0,
            ac_cabin_price: parseInt(formData.get('acCabinPrice')) || 0,
            non_ac_cabin_beds: parseInt(formData.get('nonAcCabinBeds')) || 0,
            non_ac_cabin_price: parseInt(formData.get('nonAcCabinPrice')) || 0,
            icu_available_beds: parseInt(formData.get('icuAvailableBeds')) || 0,
            icu_price: parseInt(formData.get('icuPrice')) || 0,
            ccu_available_beds: parseInt(formData.get('ccuAvailableBeds')) || 0,
            ccu_price: parseInt(formData.get('ccuPrice')) || 0
        };
        
        const updatedHospital = {
            name: formData.get('name'),
            type: formData.get('type'),
            location: formData.get('address'),
            contact: formData.get('contact'),
            image_url: formData.get('imageUrl') || null,
            rating: parseFloat(formData.get('rating')) || 0,
            reviews_count: parseInt(formData.get('reviewsCount')) || 0,
            discount_percentage: parseInt(formData.get('discountPercentage')) || 0,
            special_offer: formData.get('specialOffer') || '',
            offer_text: formData.get('offerText') || '',
            about: formData.get('about') || '',
            specialities: selectedSpecialities,
            facilities: facilities,
            room_pricing: roomPricing
        };
        
        await dbService.updateHospital(hospitalId, updatedHospital);
        await loadHospitalsTable();
        await loadDashboardStats();
        
        closeModal('edit-hospital-modal');
        
        showNotification(`${updatedHospital.name} has been successfully updated.`, 'success');
    } catch (error) {
        console.error('Error updating hospital:', error);
        showNotification('Error updating hospital: ' + error.message, 'error');
    }
};

window.handleAddDriver = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const newDriver = {
            name: formData.get('name'),
            contact: formData.get('contact'),
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            address: formData.get('address') || null,
            photo: formData.get('photo') || null,
            license: formData.get('license'),
            license_expiry: formData.get('licenseExpiry') || null,
            experience: parseInt(formData.get('experience')) || 0,
            ambulance_type: formData.get('ambulanceType'),
            ambulance_registration_number: formData.get('ambulanceRegNo'),
            vehicle_model: formData.get('vehicleModel') || null,
            manufacturing_year: parseInt(formData.get('manufacturingYear')) || null,
            status: formData.get('availability') || 'active',
            working_shift: formData.get('workingShift') || 'flexible',
            emergency_contact: formData.get('emergencyContact') || null,
            joining_date: formData.get('joiningDate') || null,
            service_area: formData.get('serviceArea') || 'local',
            rating: parseFloat(formData.get('rating')) || null,
            special_skills: formData.get('specialSkills') || null,
            notes: formData.get('notes') || null
        };
        
        await dbService.addDriver(newDriver);
        await loadDriversTable();
        await loadDashboardStats();
        
        closeModal('add-driver-modal');
        event.target.reset();
        
        showNotification(`Driver ${newDriver.name} has been successfully added.`, 'success');
    } catch (error) {
        console.error('Error adding driver:', error);
        showNotification('Error adding driver: ' + error.message, 'error');
    }
};

window.handleAddDonor = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const newDonor = {
            name: formData.get('name'),
            blood_group: formData.get('bloodGroup'),
            contact: formData.get('contact'),
            age: parseInt(formData.get('age')) || null,
            gender: formData.get('gender'),
            weight: parseFloat(formData.get('weight')) || null,
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            last_donation_date: formData.get('lastDonationDate') || null,
            medical_conditions: formData.get('medicalConditions') || '',
            medications: formData.get('medications') || '',
            donation_frequency: formData.get('donationFrequency') || '',
            notes: formData.get('notes') || '',
            photo: formData.get('photoUrl') || 'https://i.ibb.co/YdR8KfV/donor-1.jpg',
            status: 'active',
            approved: true,
            approval_date: new Date().toISOString().split('T')[0]
        };
        
        await dbService.addBloodDonor(newDonor);
        await loadBloodDonorsTable();
        await loadDashboardStats();
        
        closeModal('add-donor-modal');
        event.target.reset();
        
        showNotification(`Blood donor ${newDonor.name} has been successfully added.`, 'success');
    } catch (error) {
        console.error('Error adding donor:', error);
        showNotification('Error adding donor: ' + error.message, 'error');
    }
};

window.showEditDonorModal = async function(donorId) {
    try {
        const donor = await dbService.getBloodDonorById(donorId);
        if (!donor) {
            showNotification('Donor not found', 'error');
            return;
        }
        
        document.getElementById('edit-donor-id').value = donor.id;
        document.getElementById('edit-donor-name').value = donor.name || '';
        document.getElementById('edit-donor-bloodGroup').value = donor.blood_group || '';
        document.getElementById('edit-donor-contact').value = donor.contact || '';
        document.getElementById('edit-donor-age').value = donor.age || '';
        document.getElementById('edit-donor-gender').value = donor.gender || '';
        document.getElementById('edit-donor-district').value = donor.district || '';
        document.getElementById('edit-donor-lastDonationDate').value = donor.last_donation_date || '';
        document.getElementById('edit-donor-donationFrequency').value = donor.donation_frequency || '';
        document.getElementById('edit-donor-photoUrl').value = donor.photo || '';
        document.getElementById('edit-donor-status').value = donor.status || 'active';
        document.getElementById('edit-donor-approved').value = donor.approved ? 'true' : 'false';
        
        updateDonorUpazilaOptions('edit');
        setTimeout(() => {
            document.getElementById('edit-donor-upazila').value = donor.upazila || '';
        }, 100);
        
        showModal('edit-donor-modal');
    } catch (error) {
        console.error('Error loading donor for edit:', error);
        showNotification('Error loading donor: ' + error.message, 'error');
    }
};

window.handleEditDonor = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const donorId = parseInt(formData.get('id'));
    
    try {
        const updates = {
            name: formData.get('name'),
            blood_group: formData.get('bloodGroup'),
            contact: formData.get('contact'),
            age: parseInt(formData.get('age')) || null,
            gender: formData.get('gender'),
            district: formData.get('district'),
            upazila: formData.get('upazila'),
            last_donation_date: formData.get('lastDonationDate') || null,
            donation_frequency: formData.get('donationFrequency') || '',
            photo: formData.get('photoUrl') || 'https://i.ibb.co/YdR8KfV/donor-1.jpg',
            status: formData.get('status') || 'active',
            approved: formData.get('approved') === 'true',
            approval_date: formData.get('approved') === 'true' ? new Date().toISOString().split('T')[0] : null
        };
        
        console.log('🔍 Editing donor ID:', donorId);
        console.log('🔍 Status value from form:', formData.get('status'));
        console.log('🔍 Approved value from form:', formData.get('approved'));
        console.log('🔍 Final updates object:', updates);
        console.log('🔍 Will show in user app?', updates.status === 'active' && updates.approved === true);
        
        await dbService.updateBloodDonor(donorId, updates);
        showNotification('Donor updated successfully', 'success');
        closeModal('edit-donor-modal');
        loadBloodDonorsTable();
    } catch (error) {
        console.error('Error updating donor:', error);
        showNotification('Error updating donor: ' + error.message, 'error');
    }
};

// Migration function to update existing doctors with default health tips
window.migrateDefaultHealthTips = async function() {
    try {
        console.log('🔄 Starting migration: Adding default health tips to doctors...');
        const doctors = await dbService.getDoctors();
        let updatedCount = 0;
        
        for (const doctor of doctors) {
            // If doctor has no health tips or empty health tips array
            if (!doctor.health_tips || doctor.health_tips.length === 0) {
                // Deep copy to avoid mutation of DEFAULT_HEALTH_TIPS
                await dbService.updateDoctor(doctor.id, {
                    health_tips: JSON.parse(JSON.stringify(DEFAULT_HEALTH_TIPS))
                });
                updatedCount++;
                console.log(`✅ Updated doctor: ${doctor.name}`);
            }
        }
        
        console.log(`✅ Migration complete: ${updatedCount} doctors updated with default health tips`);
        if (updatedCount > 0) {
            showNotification(`Migration complete: ${updatedCount} doctors updated with default FAQs`, 'success');
        }
        await loadDoctorsTable();
    } catch (error) {
        console.error('❌ Error during migration:', error);
        showNotification('Error during migration: ' + error.message, 'error');
    }
};

// Auto-run migration when admin panel loads (only once per session)
if (!sessionStorage.getItem('health_tips_migration_done')) {
    setTimeout(async () => {
        if (typeof DEFAULT_HEALTH_TIPS !== 'undefined' && typeof dbService !== 'undefined') {
            await migrateDefaultHealthTips();
            sessionStorage.setItem('health_tips_migration_done', 'true');
        }
    }, 2000);
}

// User Management Functions
window.viewUserDetails = async function(userId) {
    try {
        const user = await dbService.getUserById(userId);
        if (!user) {
            showNotification('User not found', 'error');
            return;
        }
        
        const appointments = await dbService.getAppointmentsByUserId(userId);
        const approvedCount = appointments.filter(apt => apt.status === 'approved' || apt.status === 'completed').length;
        const pendingCount = appointments.filter(apt => apt.status === 'pending').length;
        
        document.getElementById('user-detail-name').textContent = user.name || 'N/A';
        document.getElementById('user-detail-email').textContent = user.email || 'N/A';
        document.getElementById('user-detail-mobile').textContent = user.mobile || 'N/A';
        document.getElementById('user-detail-district').textContent = user.district || 'N/A';
        document.getElementById('user-detail-upazila').textContent = user.upazila || 'N/A';
        document.getElementById('user-detail-status').textContent = user.status || 'N/A';
        document.getElementById('user-detail-points').textContent = user.points || 0;
        document.getElementById('user-detail-points-per-appointment').textContent = user.points_per_appointment || 20;
        document.getElementById('user-detail-join-date').textContent = user.join_date || 'N/A';
        
        const appointmentsSummary = `
            <p><strong>Total Appointments:</strong> ${appointments.length}</p>
            <p><strong>Approved/Completed:</strong> ${approvedCount}</p>
            <p><strong>Pending:</strong> ${pendingCount}</p>
        `;
        document.getElementById('user-detail-appointments').innerHTML = appointmentsSummary;
        
        showModal('user-details-modal');
    } catch (error) {
        console.error('Error viewing user details:', error);
        showNotification('Error loading user details: ' + error.message, 'error');
    }
};

// Upazila data based on districts (same as user application)
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

function formatLocationForDropdown(value) {
    if (!value) return '';
    return value
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatLocationForDatabase(value) {
    if (!value) return '';
    return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Function to update upazila options based on selected district in edit user modal
window.updateEditUserUpazilaOptions = function() {
    const districtSelect = document.getElementById('edit-user-district');
    const upazilaSelect = document.getElementById('edit-user-upazila');

    if (!districtSelect || !upazilaSelect) return;

    const selectedDistrict = districtSelect.value.toLowerCase().replace(/\s+/g, '-');

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

    console.log(`Edit User - District changed to: ${selectedDistrict}`);
};

window.showEditUserModal = async function(userId) {
    try {
        const user = await dbService.getUserById(userId);
        if (!user) {
            showNotification('User not found', 'error');
            return;
        }
        
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.name || '';
        document.getElementById('edit-user-email').value = user.email || '';
        document.getElementById('edit-user-mobile').value = user.mobile || '';
        document.getElementById('edit-user-status').value = user.status || 'active';
        document.getElementById('edit-user-district').value = formatLocationForDropdown(user.district);
        document.getElementById('edit-user-points').value = user.points || 0;
        document.getElementById('edit-user-admin-points').value = user.admin_adjusted_points || 0;
        document.getElementById('edit-user-points-per-appointment').value = user.points_per_appointment || 20;
        document.getElementById('edit-user-avatar').value = user.avatar || '';
        document.getElementById('adjust-points-value').value = '';
        
        // Update upazila options based on district, then set the value
        setTimeout(() => {
            updateEditUserUpazilaOptions();
            // Set upazila value after options are populated (using raw database value)
            document.getElementById('edit-user-upazila').value = user.upazila || '';
        }, 50);
        
        showModal('edit-user-modal');
    } catch (error) {
        console.error('Error loading user for edit:', error);
        showNotification('Error loading user: ' + error.message, 'error');
    }
};

window.handleEditUser = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const userId = parseInt(formData.get('id'));
        const updates = {
            name: formData.get('name'),
            email: formData.get('email'),
            mobile: formData.get('mobile'),
            status: formData.get('status'),
            district: formatLocationForDatabase(formData.get('district')),
            upazila: formatLocationForDatabase(formData.get('upazila')),
            points_per_appointment: parseInt(formData.get('points_per_appointment')) || 20,
            avatar: formData.get('avatar') || null
        };
        
        await dbService.updateUser(userId, updates);
        showNotification('User updated successfully', 'success');
        closeModal('edit-user-modal');
        loadUsersTable();
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification('Error updating user: ' + error.message, 'error');
    }
};

window.adjustUserPoints = async function(action) {
    try {
        console.log('🎯 adjustUserPoints called with action:', action);
        const userId = parseInt(document.getElementById('edit-user-id').value);
        const adjustValue = parseInt(document.getElementById('adjust-points-value').value);
        console.log('  User ID:', userId, 'Adjust Value:', adjustValue);
        
        if (isNaN(adjustValue) || adjustValue <= 0) {
            showNotification('Please enter a valid positive number', 'warning');
            return;
        }
        
        // Calculate the points adjustment (positive for add, negative for subtract)
        const pointsAdjusted = action === 'add' ? adjustValue : -adjustValue;
        console.log('  Points adjusted:', pointsAdjusted);
        
        // Get current admin adjusted points
        const user = await dbService.getUserById(userId);
        console.log('  Current user admin_adjusted_points:', user.admin_adjusted_points);
        const currentAdminPoints = user.admin_adjusted_points || 0;
        const newAdminPoints = currentAdminPoints + pointsAdjusted;
        console.log('  New admin_adjusted_points will be:', newAdminPoints);
        
        // Create adjustment record in the ledger table
        const adjustment = {
            user_id: userId,
            points_adjusted: pointsAdjusted,
            reason: action === 'add' ? 'Bonus points added by admin' : 'Points deducted by admin',
            adjusted_by: 'admin',
            adjustment_date: new Date().toISOString()
        };
        console.log('  📝 Inserting adjustment record:', adjustment);
        
        const insertResult = await dbService.addAdminPointAdjustment(adjustment);
        console.log('  ✅ Adjustment record inserted successfully:', insertResult);
        
        // Update user's admin_adjusted_points (cumulative total)
        console.log('  🔄 Updating user admin_adjusted_points to:', newAdminPoints);
        await dbService.updateUser(userId, { admin_adjusted_points: newAdminPoints });
        console.log('  ✅ User admin_adjusted_points updated');
        
        // Update the display in the modal
        const adminPointsField = document.getElementById('edit-user-admin-points');
        if (adminPointsField) {
            adminPointsField.value = newAdminPoints;
        }
        
        showNotification(`${adjustValue} points ${action === 'add' ? 'added to' : 'removed from'} user's available points successfully`, 'success');
        document.getElementById('adjust-points-value').value = '';
        loadUsersTable();
        console.log('✅ adjustUserPoints completed successfully');
    } catch (error) {
        console.error('❌ Error adjusting user points:', error);
        console.error('  Error details:', error.message, error.code, error.details);
        showNotification('Error adjusting points: ' + error.message, 'error');
    }
};

window.deleteUser = async function(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will also delete all associated data (appointments, redeem requests, etc.).')) {
        return;
    }
    
    try {
        console.log('🗑️ Deleting user and all associated data for user ID:', userId);
        
        // Delete appointments
        const appointments = await dbService.getAppointmentsByUserId(userId);
        console.log(`  📋 Found ${appointments.length} appointments to delete`);
        for (const appointment of appointments) {
            await dbService.deleteAppointment(appointment.id);
        }
        
        // Delete redeem requests
        const redeemRequests = await dbService.getRedeemRequestsByUserId(userId);
        console.log(`  💰 Found ${redeemRequests.length} redeem requests to delete`);
        for (const request of redeemRequests) {
            await dbService.deleteRedeemRequest(request.id);
        }
        
        // Delete the user
        console.log('  👤 Deleting user...');
        await dbService.deleteUser(userId);
        
        console.log('✅ User and all associated data deleted successfully');
        showNotification('User and all associated data deleted successfully', 'success');
        loadUsersTable();
        loadDashboardStats();
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        showNotification('Error deleting user: ' + error.message, 'error');
    }
};

function setupRealtimeSubscriptions() {
    if (!window.supabase) {
        console.warn('⚠️ Supabase not available for real-time subscriptions');
        return;
    }

    const ambulanceRequestsChannel = window.supabase
        .channel('ambulance-requests-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'ambulance_requests' },
            async (payload) => {
                console.log('🔔 Ambulance request changed:', payload.eventType);
                try {
                    const ambulanceReqs = await dbService.getAmbulanceRequests();
                    adminData.emergencyServices.ambulanceRequests = ambulanceReqs;
                    
                    if (typeof loadAmbulanceRequests === 'function') {
                        loadAmbulanceRequests();
                    }
                    
                    await loadDashboardStats();
                } catch (error) {
                    console.error('Error refreshing ambulance requests:', error);
                }
            }
        )
        .subscribe();
    
    console.log('✅ Real-time subscriptions enabled for ambulance requests');

    const bloodRequestsChannel = window.supabase
        .channel('blood-requests-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'blood_requests' },
            async (payload) => {
                console.log('🔔 Blood request changed:', payload.eventType);
                try {
                    const bloodReqs = await dbService.getBloodRequests();
                    adminData.emergencyServices.bloodRequests = bloodReqs;
                    
                    if (typeof loadBloodRequests === 'function') {
                        loadBloodRequests();
                    }
                    
                    await loadDashboardStats();
                } catch (error) {
                    console.error('Error refreshing blood requests:', error);
                }
            }
        )
        .subscribe();
    
    console.log('✅ Real-time subscriptions enabled for blood requests');

    const hospitalRequestsChannel = window.supabase
        .channel('hospital-requests-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'hospital_requests' },
            async (payload) => {
                console.log('🔔 Hospital request changed:', payload.eventType);
                try {
                    const hospitalReqs = await dbService.getHospitalRequests();
                    adminData.emergencyServices.hospitalRequests = hospitalReqs;
                    
                    if (typeof loadHospitalRequests === 'function') {
                        loadHospitalRequests();
                    }
                    
                    await loadDashboardStats();
                } catch (error) {
                    console.error('Error refreshing hospital requests:', error);
                }
            }
        )
        .subscribe();
    
    console.log('✅ Real-time subscriptions enabled for hospital requests');

    const medicineRequestsChannel = window.supabase
        .channel('medicine-requests-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'medicine_requests' },
            async (payload) => {
                console.log('🔔 Medicine request changed:', payload.eventType);
                try {
                    if (typeof loadMedicineRequestsTable === 'function') {
                        await loadMedicineRequestsTable();
                    }
                    
                    await loadDashboardStats();
                } catch (error) {
                    console.error('Error refreshing medicine requests:', error);
                }
            }
        )
        .subscribe();
    
    console.log('✅ Real-time subscriptions enabled for medicine requests');
}

// Load Real Recent Activity from Supabase
window.loadRecentActivity = async function() {
    const activityList = document.getElementById('recent-activity');
    if (!activityList) return;

    try {
        const activities = [];
        
        // Helper function to sort by created_at descending and filter valid timestamps
        const sortAndFilter = (items, limit = 5) => {
            return items
                .filter(item => item.created_at || item.createdAt) // Only items with valid timestamps
                .sort((a, b) => {
                    const timeA = new Date(a.created_at || a.createdAt);
                    const timeB = new Date(b.created_at || b.createdAt);
                    return timeB - timeA; // Descending order (newest first)
                })
                .slice(0, limit);
        };
        
        // Get recent appointments (sorted by newest first)
        const appointments = await dbService.getAppointments();
        sortAndFilter(appointments, 5).forEach(apt => {
            activities.push({
                type: 'appointment',
                message: `New appointment: ${apt.patient_name || apt.patientName || 'Patient'} with ${apt.doctor_name || apt.doctorName || 'Doctor'}`,
                timestamp: apt.created_at || apt.createdAt,
                icon: 'fas fa-calendar-check',
                color: '#4facfe'
            });
        });

        // Get recent doctors (sorted by newest first)
        const doctors = await dbService.getDoctors();
        sortAndFilter(doctors, 3).forEach(doc => {
            activities.push({
                type: 'doctor',
                message: `New doctor added: ${doc.name} (${doc.specialty})`,
                timestamp: doc.created_at || doc.createdAt,
                icon: 'fas fa-user-md',
                color: '#667eea'
            });
        });

        // Get recent users (sorted by newest first)
        const users = await dbService.getUsers();
        sortAndFilter(users, 3).forEach(user => {
            activities.push({
                type: 'user',
                message: `New user registered: ${user.name || user.email}`,
                timestamp: user.created_at || user.createdAt,
                icon: 'fas fa-user-plus',
                color: '#ffeaa7'
            });
        });

        // Get recent ambulance requests (sorted by newest first)
        const ambulanceReqs = await dbService.getAmbulanceRequests();
        sortAndFilter(ambulanceReqs, 3).forEach(req => {
            activities.push({
                type: 'ambulance',
                message: `Emergency ambulance request: ${req.patient_name || req.patientName || 'Patient'} (${req.emergency_type || req.emergencyType || 'Emergency'})`,
                timestamp: req.created_at || req.createdAt,
                icon: 'fas fa-ambulance',
                color: '#43e97b'
            });
        });

        // Get recent blood requests (sorted by newest first)
        const bloodReqs = await dbService.getBloodRequests();
        sortAndFilter(bloodReqs, 3).forEach(req => {
            activities.push({
                type: 'blood',
                message: `Blood request: ${req.blood_group || req.bloodGroup || 'Blood'} needed for ${req.patient_name || req.patientName || 'Patient'}`,
                timestamp: req.created_at || req.createdAt,
                icon: 'fas fa-tint',
                color: '#f093fb'
            });
        });

        // Get recent hospital requests (sorted by newest first)
        const hospitalReqs = await dbService.getHospitalRequests();
        sortAndFilter(hospitalReqs, 3).forEach(req => {
            activities.push({
                type: 'hospital',
                message: `Hospital booking: ${req.patient_name || req.patientName || 'Patient'} - ${req.room_type || req.roomType || 'Room'} room`,
                timestamp: req.created_at || req.createdAt,
                icon: 'fas fa-hospital',
                color: '#764ba2'
            });
        });

        // Get recent redeem requests (sorted by newest first)
        const redeemReqs = await dbService.getRedeemRequests();
        sortAndFilter(redeemReqs, 3).forEach(req => {
            activities.push({
                type: 'redeem',
                message: `Points redeem request: ${req.user_name || req.userName || 'User'} - ${req.points || 0} points`,
                timestamp: req.created_at || req.createdAt,
                icon: 'fas fa-gift',
                color: '#ffa502'
            });
        });

        // Sort by timestamp (most recent first) and take top 10
        activities.sort((a, b) => {
            const timeA = new Date(a.timestamp || 0);
            const timeB = new Date(b.timestamp || 0);
            return timeB - timeA;
        });

        const recentActivities = activities.slice(0, 10);

        // Clear existing activities
        activityList.innerHTML = '';

        if (recentActivities.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: #64748b;">
                    <i class="fas fa-info-circle" style="font-size: 48px; opacity: 0.5; margin-bottom: 16px;"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }

        // Display activities
        recentActivities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';

            // Calculate time ago
            const timeAgo = getTimeAgo(activity.timestamp);

            activityItem.innerHTML = `
                <div class="activity-icon" style="background-color: ${activity.color}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-info">
                    <h4>${activity.message}</h4>
                    <p>${timeAgo}</p>
                </div>
            `;

            activityList.appendChild(activityItem);
        });

    } catch (error) {
        console.error('Error loading recent activity:', error);
        activityList.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; opacity: 0.5; margin-bottom: 16px;"></i>
                <p>Error loading recent activity</p>
            </div>
        `;
    }
};

// Helper function to calculate time ago
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

// Prescription Management Handlers (Supabase-compatible)
window.handleAddPrescription = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const appointmentId = currentPrescriptionId;
    
    try {
        const prescriptionUrl = formData.get('prescriptionUrl');
        const notes = formData.get('notes');
        
        await dbService.updateAppointment(appointmentId, {
            prescription_url: prescriptionUrl,
            prescription_notes: notes
        });
        
        await loadAppointmentsTable();
        loadPendingPrescriptions();
        loadCompletedPrescriptions();
        
        closeModal('add-prescription-modal');
        event.target.reset();
        currentPrescriptionId = null;
        
        showNotification('Prescription added successfully!', 'success');
    } catch (error) {
        console.error('Error adding prescription:', error);
        showNotification('Error adding prescription: ' + error.message, 'error');
    }
};

window.handleEditPrescription = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const appointmentId = currentPrescriptionId;
    
    try {
        const prescriptionUrl = formData.get('prescriptionUrl');
        const notes = formData.get('notes');
        
        await dbService.updateAppointment(appointmentId, {
            prescription_url: prescriptionUrl,
            prescription_notes: notes
        });
        
        await loadAppointmentsTable();
        loadCompletedPrescriptions();
        
        closeModal('edit-prescription-modal');
        event.target.reset();
        currentPrescriptionId = null;
        
        showNotification('Prescription updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating prescription:', error);
        showNotification('Error updating prescription: ' + error.message, 'error');
    }
};

window.deletePrescription = async function(appointmentId) {
    if (!confirm('Are you sure you want to delete this prescription?')) {
        return;
    }
    
    try {
        await dbService.updateAppointment(appointmentId, {
            prescription_url: null,
            prescription_notes: null
        });
        
        await loadAppointmentsTable();
        loadPendingPrescriptions();
        loadCompletedPrescriptions();
        
        showNotification('Prescription deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting prescription:', error);
        showNotification('Error deleting prescription: ' + error.message, 'error');
    }
};

window.viewPrescription = function(appointmentId) {
    const appointment = adminData.appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    const prescriptionUrl = appointment.prescription_url || appointment.prescriptionUrl;
    if (prescriptionUrl) {
        window.open(prescriptionUrl, '_blank', 'noopener,noreferrer');
    } else {
        showNotification('No prescription URL found', 'error');
    }
};

window.loadContactMessagesTable = async function() {
    try {
        const messages = await dbService.getContactMessages();
        adminData.contactMessages = messages;
        
        const tbody = document.getElementById('contact-messages-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (messages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">No contact messages found.</td></tr>';
            return;
        }
        
        messages.forEach(message => {
            const date = new Date(message.created_at).toLocaleDateString();
            const truncatedMessage = message.message.length > 50 ? message.message.substring(0, 50) + '...' : message.message;
            const statusClass = message.status === 'new' ? 'pending' : message.status === 'resolved' ? 'approved' : 'in-progress';
            
            const row = `
                <tr>
                    <td>#${escapeHtml(message.id)}</td>
                    <td>${escapeHtml(message.name)}</td>
                    <td>${escapeHtml(message.email)}</td>
                    <td>${escapeHtml(message.subject)}</td>
                    <td title="${escapeHtml(message.message)}">${escapeHtml(truncatedMessage)}</td>
                    <td><span class="status-badge ${statusClass}">${escapeHtml(message.status.replace('_', ' '))}</span></td>
                    <td>${escapeHtml(date)}</td>
                    <td>
                        <button class="action-btn view" onclick="viewContactMessage(${message.id})" title="View/Respond">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteContactMessage(${message.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading contact messages:', error);
        showNotification('Error loading contact messages: ' + error.message, 'error');
    }
};

window.filterContactMessagesByStatus = function() {
    const filter = document.getElementById('contact-status-filter').value;
    const tbody = document.getElementById('contact-messages-table-body');
    if (!tbody) return;
    
    let filteredMessages = adminData.contactMessages;
    if (filter) {
        filteredMessages = adminData.contactMessages.filter(msg => msg.status === filter);
    }
    
    tbody.innerHTML = '';
    
    if (filteredMessages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">No messages found for this status.</td></tr>';
        return;
    }
    
    filteredMessages.forEach(message => {
        const date = new Date(message.created_at).toLocaleDateString();
        const truncatedMessage = message.message.length > 50 ? message.message.substring(0, 50) + '...' : message.message;
        const statusClass = message.status === 'new' ? 'pending' : message.status === 'resolved' ? 'approved' : 'in-progress';
        
        const row = `
            <tr>
                <td>#${escapeHtml(message.id)}</td>
                <td>${escapeHtml(message.name)}</td>
                <td>${escapeHtml(message.email)}</td>
                <td>${escapeHtml(message.subject)}</td>
                <td title="${escapeHtml(message.message)}">${escapeHtml(truncatedMessage)}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(message.status.replace('_', ' '))}</span></td>
                <td>${escapeHtml(date)}</td>
                <td>
                    <button class="action-btn view" onclick="viewContactMessage(${message.id})" title="View/Respond">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteContactMessage(${message.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
};

window.viewContactMessage = function(messageId) {
    const message = adminData.contactMessages.find(msg => msg.id === messageId);
    if (!message) {
        showNotification('Message not found', 'error');
        return;
    }
    
    const details = document.getElementById('contact-message-details');
    const date = new Date(message.created_at).toLocaleString();
    
    details.innerHTML = `
        <div style="padding: 20px; background: #f8fafc; border-radius: 8px; margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
                <strong>From:</strong> ${escapeHtml(message.name)} (${escapeHtml(message.email)})
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Subject:</strong> ${escapeHtml(message.subject)}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Date:</strong> ${escapeHtml(date)}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Message:</strong>
                <div style="margin-top: 8px; padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">
                    ${escapeHtml(message.message)}
                </div>
            </div>
            ${message.admin_response ? `
                <div style="margin-top: 15px; padding: 12px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px;">
                    <strong>Previous Admin Response:</strong>
                    <div style="margin-top: 8px; white-space: pre-wrap;">${escapeHtml(message.admin_response)}</div>
                    <small style="color: #64748b; margin-top: 8px; display: block;">
                        Responded by: ${escapeHtml(message.admin_user || 'Unknown')} on ${escapeHtml(message.responded_at ? new Date(message.responded_at).toLocaleString() : 'N/A')}
                    </small>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('respond-message-id').value = message.id;
    document.getElementById('respond-message-status').value = message.status;
    document.getElementById('respond-message-response').value = message.admin_response || '';
    
    showModal('view-contact-message-modal');
};

window.handleRespondContactMessage = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const messageId = parseInt(formData.get('id'));
    const status = formData.get('status');
    const adminResponse = formData.get('adminResponse');
    
    try {
        const updates = {
            status: status,
            admin_response: adminResponse || null,
            admin_user: 'Admin User',
            responded_at: adminResponse ? new Date().toISOString() : null
        };
        
        await dbService.updateContactMessage(messageId, updates);
        
        closeModal('view-contact-message-modal');
        await loadContactMessagesTable();
        showNotification('Message updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating contact message:', error);
        showNotification('Error updating message: ' + error.message, 'error');
    }
};

window.deleteContactMessage = async function(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    try {
        await dbService.deleteContactMessage(messageId);
        await loadContactMessagesTable();
        showNotification('Message deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting contact message:', error);
        showNotification('Error deleting message: ' + error.message, 'error');
    }
};

// ===============================
// Contact Info Management Functions
// ===============================

let currentContactTab = 'phone';

window.switchContactTab = function(type) {
    currentContactTab = type;
    
    // Update tab buttons
    document.querySelectorAll('.contact-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.borderBottomColor = 'transparent';
        btn.style.color = '#64748b';
    });
    const activeBtn = document.querySelector(`.contact-tab-btn[data-tab="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.borderBottomColor = '#4f46e5';
        activeBtn.style.color = '#4f46e5';
    }
    
    // Update tab content
    document.querySelectorAll('.contact-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    const activeContent = document.getElementById(`${type}-tab-content`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
    
    // Load appropriate data
    loadContactInfoTable(type);
};

window.loadContactInfoTable = async function(type = 'phone') {
    try {
        const contactInfo = await dbService.getAllContactInfo();
        adminData.contactInfo = contactInfo;
        
        if (type === 'phone') {
            loadPhoneContactsTable(contactInfo.filter(c => c.type === 'phone'));
        } else if (type === 'email') {
            loadEmailContactsTable(contactInfo.filter(c => c.type === 'email'));
        } else if (type === 'address') {
            loadOfficeAddressDisplay(contactInfo.filter(c => c.type === 'address'));
        }
    } catch (error) {
        console.error('Error loading contact info:', error);
        showNotification('Error loading contact information: ' + error.message, 'error');
    }
};

function loadPhoneContactsTable(phones) {
    const tbody = document.getElementById('phone-contacts-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (phones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #64748b;">No phone numbers found. Click "Add Contact Info" to add one.</td></tr>';
        return;
    }
    
    phones.forEach(phone => {
        const statusClass = phone.is_active ? 'approved' : 'cancelled';
        const statusText = phone.is_active ? 'Active' : 'Inactive';
        
        const row = `
            <tr>
                <td>${escapeHtml(phone.display_order)}</td>
                <td>${escapeHtml(phone.label || 'N/A')}</td>
                <td>${escapeHtml(phone.value)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn edit" onclick="editContactInfo(${phone.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteContactInfo(${phone.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function loadEmailContactsTable(emails) {
    const tbody = document.getElementById('email-contacts-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (emails.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #64748b;">No email addresses found. Click "Add Contact Info" to add one.</td></tr>';
        return;
    }
    
    emails.forEach(email => {
        const statusClass = email.is_active ? 'approved' : 'cancelled';
        const statusText = email.is_active ? 'Active' : 'Inactive';
        
        const row = `
            <tr>
                <td>${escapeHtml(email.display_order)}</td>
                <td>${escapeHtml(email.label || 'N/A')}</td>
                <td>${escapeHtml(email.value)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn edit" onclick="editContactInfo(${email.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteContactInfo(${email.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function loadOfficeAddressDisplay(addresses) {
    const display = document.getElementById('office-address-display');
    if (!display) return;
    
    if (addresses.length === 0) {
        display.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <p>No office address found. Click "Add Contact Info" to add one.</p>
            </div>
        `;
        return;
    }
    
    const address = addresses[0];
    let addressData;
    try {
        addressData = typeof address.value === 'string' ? JSON.parse(address.value) : address.value;
    } catch (e) {
        addressData = { name: 'Error parsing address', line1: '', line2: '', country: '', hours: '' };
    }
    
    const statusClass = address.is_active ? 'approved' : 'cancelled';
    const statusText = address.is_active ? 'Active' : 'Inactive';
    
    display.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
            <div>
                <h3 style="margin: 0 0 10px 0; color: #1e293b;">${escapeHtml(addressData.name || 'Office Address')}</h3>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <button class="action-btn edit" onclick="editOfficeAddress(${address.id})" title="Edit Address">
                <i class="fas fa-edit"></i> Edit Address
            </button>
        </div>
        <div style="line-height: 1.8; color: #475569;">
            <p style="margin: 5px 0;"><i class="fas fa-map-marker-alt" style="width: 20px; color: #4f46e5;"></i> ${escapeHtml(addressData.line1 || '')}</p>
            <p style="margin: 5px 0;"><i class="fas fa-map-marker-alt" style="width: 20px; color: transparent;"></i> ${escapeHtml(addressData.line2 || '')}</p>
            <p style="margin: 5px 0;"><i class="fas fa-globe" style="width: 20px; color: #4f46e5;"></i> ${escapeHtml(addressData.country || '')}</p>
            <p style="margin: 5px 0;"><i class="fas fa-clock" style="width: 20px; color: #4f46e5;"></i> ${escapeHtml(addressData.hours || '')}</p>
        </div>
    `;
}

window.showAddContactInfoModal = function() {
    const modal = document.getElementById('contact-info-modal');
    const title = document.getElementById('contact-info-modal-title');
    const form = document.getElementById('contact-info-form');
    
    title.textContent = `Add ${currentContactTab === 'phone' ? 'Phone Number' : currentContactTab === 'email' ? 'Email Address' : 'Office Address'}`;
    form.reset();
    document.getElementById('contact-info-id').value = '';
    document.getElementById('contact-info-type').value = currentContactTab;
    
    // Show/hide appropriate fields
    document.getElementById('phone-value-group').style.display = currentContactTab === 'phone' ? 'block' : 'none';
    document.getElementById('email-value-group').style.display = currentContactTab === 'email' ? 'block' : 'none';
    
    // Set required attributes
    document.getElementById('contact-info-phone-value').required = currentContactTab === 'phone';
    document.getElementById('contact-info-email-value').required = currentContactTab === 'email';
    
    showModal('contact-info-modal');
};

window.editContactInfo = async function(id) {
    const contactInfo = adminData.contactInfo.find(c => c.id === id);
    if (!contactInfo) {
        showNotification('Contact info not found', 'error');
        return;
    }
    
    const modal = document.getElementById('contact-info-modal');
    const title = document.getElementById('contact-info-modal-title');
    
    title.textContent = `Edit ${contactInfo.type === 'phone' ? 'Phone Number' : 'Email Address'}`;
    
    document.getElementById('contact-info-id').value = contactInfo.id;
    document.getElementById('contact-info-type').value = contactInfo.type;
    document.getElementById('contact-info-label').value = contactInfo.label || '';
    document.getElementById('contact-info-display-order').value = contactInfo.display_order;
    document.getElementById('contact-info-is-active').value = contactInfo.is_active ? 'true' : 'false';
    
    // Show/hide and populate appropriate fields
    if (contactInfo.type === 'phone') {
        document.getElementById('phone-value-group').style.display = 'block';
        document.getElementById('email-value-group').style.display = 'none';
        document.getElementById('contact-info-phone-value').value = contactInfo.value;
        document.getElementById('contact-info-phone-value').required = true;
        document.getElementById('contact-info-email-value').required = false;
    } else if (contactInfo.type === 'email') {
        document.getElementById('phone-value-group').style.display = 'none';
        document.getElementById('email-value-group').style.display = 'block';
        document.getElementById('contact-info-email-value').value = contactInfo.value;
        document.getElementById('contact-info-email-value').required = true;
        document.getElementById('contact-info-phone-value').required = false;
    }
    
    showModal('contact-info-modal');
};

window.editOfficeAddress = async function(id) {
    const address = adminData.contactInfo.find(c => c.id === id);
    if (!address) {
        showNotification('Address not found', 'error');
        return;
    }
    
    let addressData;
    try {
        addressData = typeof address.value === 'string' ? JSON.parse(address.value) : address.value;
    } catch (e) {
        addressData = { name: '', line1: '', line2: '', country: '', hours: '' };
    }
    
    document.getElementById('office-address-id').value = address.id;
    document.getElementById('office-address-name').value = addressData.name || '';
    document.getElementById('office-address-line1').value = addressData.line1 || '';
    document.getElementById('office-address-line2').value = addressData.line2 || '';
    document.getElementById('office-address-country').value = addressData.country || '';
    document.getElementById('office-address-hours').value = addressData.hours || '';
    
    showModal('office-address-modal');
};

window.handleSaveContactInfo = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const id = formData.get('id');
    const type = formData.get('type');
    const label = formData.get('label');
    const displayOrder = parseInt(formData.get('displayOrder'));
    const isActive = formData.get('isActive') === 'true';
    
    let value;
    if (type === 'phone') {
        value = formData.get('phoneValue');
    } else if (type === 'email') {
        value = formData.get('emailValue');
    }
    
    try {
        const contactInfoData = {
            type,
            label,
            value,
            display_order: displayOrder,
            is_active: isActive
        };
        
        if (id) {
            await dbService.updateContactInfo(parseInt(id), contactInfoData);
            showNotification(`${type === 'phone' ? 'Phone number' : 'Email address'} updated successfully!`, 'success');
        } else {
            await dbService.addContactInfo(contactInfoData);
            showNotification(`${type === 'phone' ? 'Phone number' : 'Email address'} added successfully!`, 'success');
        }
        
        closeModal('contact-info-modal');
        await loadContactInfoTable(type);
    } catch (error) {
        console.error('Error saving contact info:', error);
        showNotification('Error saving contact info: ' + error.message, 'error');
    }
};

window.handleSaveOfficeAddress = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const id = formData.get('id');
    
    const addressData = {
        name: formData.get('officeName'),
        line1: formData.get('addressLine1'),
        line2: formData.get('addressLine2'),
        country: formData.get('country'),
        hours: formData.get('hours')
    };
    
    try {
        await dbService.updateContactInfo(parseInt(id), {
            value: JSON.stringify(addressData)
        });
        
        showNotification('Office address updated successfully!', 'success');
        closeModal('office-address-modal');
        await loadContactInfoTable('address');
    } catch (error) {
        console.error('Error saving office address:', error);
        showNotification('Error saving office address: ' + error.message, 'error');
    }
};

window.deleteContactInfo = async function(id) {
    const contactInfo = adminData.contactInfo.find(c => c.id === id);
    if (!contactInfo) return;
    
    const type = contactInfo.type;
    const typeName = type === 'phone' ? 'phone number' : type === 'email' ? 'email address' : 'address';
    
    if (!confirm(`Are you sure you want to delete this ${typeName}?`)) {
        return;
    }
    
    try {
        await dbService.deleteContactInfo(id);
        showNotification(`${typeName.charAt(0).toUpperCase() + typeName.slice(1)} deleted successfully!`, 'success');
        await loadContactInfoTable(type);
    } catch (error) {
        console.error('Error deleting contact info:', error);
        showNotification('Error deleting contact info: ' + error.message, 'error');
    }
};

window.loadTermsConditionsTable = async function() {
    try {
        const termsSections = await dbService.getAllTermsSections();
        adminData.termsConditions = termsSections;
        
        const tbody = document.getElementById('terms-sections-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (termsSections.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #64748b;">No terms sections found. Click "Add Section" to add your first section.</td></tr>';
            return;
        }

        const effectiveDateSection = termsSections.find(s => s.section_order === 0);
        const lastUpdatedSection = termsSections.find(s => s.section_order === 1);
        
        if (effectiveDateSection) {
            document.getElementById('terms-effective-date').value = effectiveDateSection.effective_date || '';
        }
        if (lastUpdatedSection) {
            document.getElementById('terms-last-updated').value = lastUpdatedSection.last_updated || '';
        }
        
        termsSections.forEach(section => {
            const truncatedContent = section.section_content.length > 100 
                ? section.section_content.substring(0, 100) + '...' 
                : section.section_content;
            
            const row = `
                <tr>
                    <td>${section.section_order}</td>
                    <td><strong>${section.section_title}</strong></td>
                    <td style="max-width: 400px; overflow: hidden; text-overflow: ellipsis;">${truncatedContent}</td>
                    <td><span class="status-badge ${section.is_active ? 'active' : 'inactive'}">${section.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="showEditTermsSectionModal(${section.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteTermsSection(${section.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading terms & conditions:', error);
        showNotification('Error loading terms & conditions: ' + error.message, 'error');
    }
};

window.showAddTermsSectionModal = function() {
    document.getElementById('add-terms-section-form').reset();
    showModal('add-terms-section-modal');
};

window.handleAddTermsSection = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const sectionData = {
        section_order: parseInt(formData.get('sectionOrder')),
        section_title: formData.get('sectionTitle'),
        section_content: formData.get('sectionContent'),
        is_active: formData.get('isActive') === 'true',
        effective_date: document.getElementById('terms-effective-date').value || new Date().toISOString().split('T')[0],
        last_updated: document.getElementById('terms-last-updated').value || new Date().toISOString().split('T')[0]
    };
    
    try {
        await dbService.addTermsSection(sectionData);
        showNotification('Terms section added successfully!', 'success');
        closeModal('add-terms-section-modal');
        await loadTermsConditionsTable();
    } catch (error) {
        console.error('Error adding terms section:', error);
        showNotification('Error adding terms section: ' + error.message, 'error');
    }
};

window.showEditTermsSectionModal = function(id) {
    const section = adminData.termsConditions.find(s => s.id === id);
    if (!section) return;
    
    document.getElementById('edit-section-id').value = section.id;
    document.getElementById('edit-section-order').value = section.section_order;
    document.getElementById('edit-section-title').value = section.section_title;
    document.getElementById('edit-section-content').value = section.section_content;
    document.getElementById('edit-section-active').value = section.is_active.toString();
    
    showModal('edit-terms-section-modal');
};

window.handleEditTermsSection = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const id = parseInt(formData.get('sectionId'));
    const updates = {
        section_order: parseInt(formData.get('sectionOrder')),
        section_title: formData.get('sectionTitle'),
        section_content: formData.get('sectionContent'),
        is_active: formData.get('isActive') === 'true'
    };
    
    try {
        await dbService.updateTermsSection(id, updates);
        showNotification('Terms section updated successfully!', 'success');
        closeModal('edit-terms-section-modal');
        await loadTermsConditionsTable();
    } catch (error) {
        console.error('Error updating terms section:', error);
        showNotification('Error updating terms section: ' + error.message, 'error');
    }
};

window.deleteTermsSection = async function(id) {
    if (!confirm('Are you sure you want to delete this terms section?')) {
        return;
    }
    
    try {
        await dbService.deleteTermsSection(id);
        showNotification('Terms section deleted successfully!', 'success');
        await loadTermsConditionsTable();
    } catch (error) {
        console.error('Error deleting terms section:', error);
        showNotification('Error deleting terms section: ' + error.message, 'error');
    }
};

window.saveAllTermsMetadata = async function() {
    const effectiveDate = document.getElementById('terms-effective-date').value;
    const lastUpdated = document.getElementById('terms-last-updated').value;
    
    if (!effectiveDate || !lastUpdated) {
        showNotification('Please fill in both dates', 'error');
        return;
    }
    
    try {
        await dbService.updateTermsMetadata(effectiveDate, lastUpdated);
        showNotification('Terms dates updated successfully!', 'success');
        await loadTermsConditionsTable();
    } catch (error) {
        console.error('Error updating terms dates:', error);
        showNotification('Error updating terms dates: ' + error.message, 'error');
    }
};

window.previewTermsConditions = async function() {
    try {
        const terms = await dbService.getTermsAndConditions();
        
        let previewHtml = '<div style="max-width: 800px; margin: 20px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">';
        previewHtml += '<h2 style="color: #1e293b; margin-bottom: 20px;">Terms & Conditions Preview</h2>';
        
        terms.forEach(section => {
            if (section.section_order === 0) {
                previewHtml += `<p style="color: #64748b; margin-bottom: 10px;"><strong>Effective Date:</strong> ${section.section_content}</p>`;
            } else if (section.section_order === 1) {
                previewHtml += `<p style="color: #64748b; margin-bottom: 20px;"><strong>Last Updated:</strong> ${section.section_content}</p>`;
            } else {
                previewHtml += `<div style="margin-bottom: 20px;">`;
                previewHtml += `<h4 style="color: #334155; margin-bottom: 10px;">${section.section_title}</h4>`;
                const content = section.section_content.replace(/\n/g, '<br>').replace(/•/g, '<br>•');
                previewHtml += `<p style="color: #475569; line-height: 1.6;">${content}</p>`;
                previewHtml += `</div>`;
            }
        });
        
        previewHtml += '</div>';
        
        const previewWindow = window.open('', 'Terms Preview', 'width=900,height=700');
        previewWindow.document.write(previewHtml);
        previewWindow.document.close();
    } catch (error) {
        console.error('Error previewing terms:', error);
        showNotification('Error previewing terms: ' + error.message, 'error');
    }
};

window.loadPrivacyPolicyTable = async function() {
    try {
        const privacySections = await dbService.getAllPrivacySections();
        adminData.privacyPolicy = privacySections;
        
        const tbody = document.getElementById('privacy-sections-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (privacySections.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #64748b;">No privacy policy sections found. Click "Add Section" to add your first section.</td></tr>';
            return;
        }
        
        const effectiveDateSection = privacySections.find(s => s.section_order === 0);
        const lastUpdatedSection = privacySections.find(s => s.section_order === 1);
        
        if (effectiveDateSection) {
            document.getElementById('privacy-effective-date').value = effectiveDateSection.effective_date || '';
        }
        if (lastUpdatedSection) {
            document.getElementById('privacy-last-updated').value = lastUpdatedSection.last_updated || '';
        }
        
        privacySections.forEach(section => {
            const truncatedContent = section.section_content.length > 100 
                ? section.section_content.substring(0, 100) + '...' 
                : section.section_content;
            
            const row = `
                <tr>
                    <td>${section.section_order}</td>
                    <td><strong>${section.section_title}</strong></td>
                    <td style="max-width: 400px; overflow: hidden; text-overflow: ellipsis;">${truncatedContent}</td>
                    <td><span class="status-badge ${section.is_active ? 'active' : 'inactive'}">${section.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="showEditPrivacySectionModal(${section.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deletePrivacySection(${section.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading privacy policy:', error);
        showNotification('Error loading privacy policy: ' + error.message, 'error');
    }
};

window.showAddPrivacySectionModal = function() {
    document.getElementById('add-privacy-section-form').reset();
    showModal('add-privacy-section-modal');
};

window.handleAddPrivacySection = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const sectionData = {
        section_order: parseInt(formData.get('sectionOrder')),
        section_title: formData.get('sectionTitle'),
        section_content: formData.get('sectionContent'),
        is_active: formData.get('isActive') === 'true',
        effective_date: document.getElementById('privacy-effective-date').value || new Date().toISOString().split('T')[0],
        last_updated: document.getElementById('privacy-last-updated').value || new Date().toISOString().split('T')[0]
    };
    
    try {
        await dbService.addPrivacySection(sectionData);
        showNotification('Privacy policy section added successfully!', 'success');
        closeModal('add-privacy-section-modal');
        await loadPrivacyPolicyTable();
    } catch (error) {
        console.error('Error adding privacy section:', error);
        showNotification('Error adding privacy section: ' + error.message, 'error');
    }
};

window.showEditPrivacySectionModal = function(id) {
    const section = adminData.privacyPolicy.find(s => s.id === id);
    if (!section) return;
    
    document.getElementById('edit-privacy-section-id').value = section.id;
    document.getElementById('edit-privacy-section-order').value = section.section_order;
    document.getElementById('edit-privacy-section-title').value = section.section_title;
    document.getElementById('edit-privacy-section-content').value = section.section_content;
    document.getElementById('edit-privacy-section-active').value = section.is_active.toString();
    
    showModal('edit-privacy-section-modal');
};

window.handleEditPrivacySection = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const id = parseInt(formData.get('sectionId'));
    const updates = {
        section_order: parseInt(formData.get('sectionOrder')),
        section_title: formData.get('sectionTitle'),
        section_content: formData.get('sectionContent'),
        is_active: formData.get('isActive') === 'true'
    };
    
    try {
        await dbService.updatePrivacySection(id, updates);
        showNotification('Privacy policy section updated successfully!', 'success');
        closeModal('edit-privacy-section-modal');
        await loadPrivacyPolicyTable();
    } catch (error) {
        console.error('Error updating privacy section:', error);
        showNotification('Error updating privacy section: ' + error.message, 'error');
    }
};

window.deletePrivacySection = async function(id) {
    if (!confirm('Are you sure you want to delete this privacy policy section?')) {
        return;
    }
    
    try {
        await dbService.deletePrivacySection(id);
        showNotification('Privacy policy section deleted successfully!', 'success');
        await loadPrivacyPolicyTable();
    } catch (error) {
        console.error('Error deleting privacy section:', error);
        showNotification('Error deleting privacy section: ' + error.message, 'error');
    }
};

window.saveAllPrivacyMetadata = async function() {
    const effectiveDate = document.getElementById('privacy-effective-date').value;
    const lastUpdated = document.getElementById('privacy-last-updated').value;
    
    if (!effectiveDate || !lastUpdated) {
        showNotification('Please fill in both dates', 'error');
        return;
    }
    
    try {
        await dbService.updatePrivacyMetadata(effectiveDate, lastUpdated);
        showNotification('Privacy policy dates updated successfully!', 'success');
        await loadPrivacyPolicyTable();
    } catch (error) {
        console.error('Error updating privacy dates:', error);
        showNotification('Error updating privacy dates: ' + error.message, 'error');
    }
};

window.previewPrivacyPolicy = async function() {
    try {
        const privacy = await dbService.getPrivacyPolicy();
        
        let previewHtml = '<div style="max-width: 800px; margin: 20px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">';
        previewHtml += '<h2 style="color: #1e293b; margin-bottom: 20px;">Privacy Policy Preview</h2>';
        
        privacy.forEach(section => {
            if (section.section_order === 0) {
                previewHtml += `<p style="color: #64748b; margin-bottom: 10px;"><strong>Effective Date:</strong> ${section.section_content}</p>`;
            } else if (section.section_order === 1) {
                previewHtml += `<p style="color: #64748b; margin-bottom: 20px;"><strong>Last Updated:</strong> ${section.section_content}</p>`;
            } else {
                previewHtml += `<div style="margin-bottom: 20px;">`;
                previewHtml += `<h4 style="color: #334155; margin-bottom: 10px;">${section.section_order}. ${section.section_title}</h4>`;
                const content = section.section_content.replace(/\n/g, '<br>').replace(/•/g, '<br>•');
                previewHtml += `<p style="color: #475569; line-height: 1.6;">${content}</p>`;
                previewHtml += `</div>`;
            }
        });
        
        previewHtml += '</div>';
        
        const previewWindow = window.open('', 'Privacy Policy Preview', 'width=900,height=700');
        previewWindow.document.write(previewHtml);
        previewWindow.document.close();
    } catch (error) {
        console.error('Error previewing privacy policy:', error);
        showNotification('Error previewing privacy policy: ' + error.message, 'error');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRealtimeSubscriptions);
} else {
    setupRealtimeSubscriptions();
}

console.log('✅ Supabase integration loaded for admin panel');
console.log('📊 All data will now be fetched from and saved to Supabase database');
console.log('🔄 Demo data has been removed');
console.log('💾 CRUD handlers overridden to use Supabase');
