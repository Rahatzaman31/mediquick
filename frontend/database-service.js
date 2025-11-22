const dbService = {
    async getDoctors(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('doctors');
            if (cached) return cached;
        }
        
        const { data, error} = await window.supabase
            .from('doctors')
            .select('*')
            .order('name');
        if (error) throw error;
        
        if (window.cacheService && data) {
            window.cacheService.set('doctors', data);
        }
        
        return data || [];
    },

    async getDoctorById(id) {
        const { data, error } = await window.supabase
            .from('doctors')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async addDoctor(doctor) {
        const { data, error } = await window.supabase
            .from('doctors')
            .insert([doctor])
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('doctors');
        }
        
        return data[0];
    },

    async updateDoctor(id, updates) {
        const { data, error } = await window.supabase
            .from('doctors')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('doctors');
        }
        
        return data[0];
    },

    async deleteDoctor(id) {
        const { error } = await window.supabase
            .from('doctors')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('doctors');
        }
    },

    async getHospitals(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('hospitals');
            if (cached) return cached;
        }
        
        const { data, error } = await window.supabase
            .from('hospitals')
            .select('*')
            .order('name');
        if (error) throw error;
        
        if (window.cacheService && data) {
            window.cacheService.set('hospitals', data);
        }
        
        return data || [];
    },

    async addHospital(hospital) {
        const { data, error } = await window.supabase
            .from('hospitals')
            .insert([hospital])
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('hospitals');
        }
        
        return data[0];
    },

    async updateHospital(id, updates) {
        const { data, error } = await window.supabase
            .from('hospitals')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('hospitals');
        }
        
        return data[0];
    },

    async getHospitalById(id) {
        const { data, error } = await window.supabase
            .from('hospitals')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async deleteHospital(id) {
        const { error } = await window.supabase
            .from('hospitals')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('hospitals');
        }
    },

    async getPharmacies(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('pharmacies');
            if (cached) return cached;
        }
        
        const { data, error } = await window.supabase
            .from('pharmacies')
            .select('*')
            .order('name');
        if (error) throw error;
        
        if (window.cacheService && data) {
            window.cacheService.set('pharmacies', data);
        }
        
        return data || [];
    },

    async getPharmacyById(id) {
        const { data, error } = await window.supabase
            .from('pharmacies')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async addPharmacy(pharmacy) {
        const { data, error } = await window.supabase
            .from('pharmacies')
            .insert([pharmacy])
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('pharmacies');
        }
        
        return data[0];
    },

    async updatePharmacy(id, updates) {
        const { data, error } = await window.supabase
            .from('pharmacies')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('pharmacies');
        }
        
        return data[0];
    },

    async deletePharmacy(id) {
        const { error } = await window.supabase
            .from('pharmacies')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('pharmacies');
        }
    },

    async getBloodDonors(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('blood_donors');
            if (cached) return cached;
        }
        
        const { data, error } = await window.supabase
            .from('blood_donors')
            .select('*')
            .order('name');
        if (error) throw error;
        
        if (window.cacheService && data) {
            window.cacheService.set('blood_donors', data);
        }
        
        return data || [];
    },

    async getBloodDonorById(id) {
        const { data, error } = await window.supabase
            .from('blood_donors')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async getBloodDonorByUserId(userId) {
        const { data, error } = await window.supabase
            .from('blood_donors')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async addBloodDonor(donor) {
        const { data, error } = await window.supabase
            .from('blood_donors')
            .insert([donor])
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('blood_donors');
        }
        
        return data[0];
    },

    async updateBloodDonor(id, updates) {
        const { data, error } = await window.supabase
            .from('blood_donors')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('blood_donors');
        }
        
        return data[0];
    },

    async deleteBloodDonor(id) {
        const { error } = await window.supabase
            .from('blood_donors')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        if (window.cacheService) {
            window.cacheService.invalidate('blood_donors');
        }
    },

    async getDrivers() {
        const { data, error } = await window.supabase
            .from('drivers')
            .select('*')
            .order('name');
        if (error) throw error;
        return data || [];
    },

    async getDriverById(id) {
        const { data, error } = await window.supabase
            .from('drivers')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async addDriver(driver) {
        const { data, error } = await window.supabase
            .from('drivers')
            .insert([driver])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateDriver(id, updates) {
        const { data, error } = await window.supabase
            .from('drivers')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async deleteDriver(id) {
        const { error } = await window.supabase
            .from('drivers')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getUsers() {
        const { data, error } = await window.supabase
            .from('users')
            .select('*')
            .order('name');
        if (error) throw error;
        return data || [];
    },

    async getUserByEmail(email) {
        const { data, error } = await window.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async addUser(user) {
        const { data, error } = await window.supabase
            .from('users')
            .insert([user])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateUser(id, updates) {
        const { data, error } = await window.supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getUserById(id) {
        const { data, error } = await window.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async deleteUser(id) {
        const { error } = await window.supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async addAdminPointAdjustment(adjustment) {
        console.log('🔵 addAdminPointAdjustment called with:', adjustment);
        const { data, error } = await window.supabase
            .from('admin_point_adjustments')
            .insert([adjustment])
            .select();
        if (error) {
            console.error('❌ Error inserting into admin_point_adjustments:', error);
            console.error('  Error code:', error.code);
            console.error('  Error message:', error.message);
            console.error('  Error details:', error.details);
            console.error('  Error hint:', error.hint);
            throw error;
        }
        console.log('✅ Successfully inserted into admin_point_adjustments:', data);
        return data[0];
    },

    async getAdminPointAdjustmentsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('admin_point_adjustments')
            .select('*')
            .eq('user_id', userId)
            .order('adjustment_date', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getAdminPointAdjustmentsByUserIdAndMonth(userId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        
        const { data, error } = await window.supabase
            .from('admin_point_adjustments')
            .select('*')
            .eq('user_id', userId)
            .gte('adjustment_date', startDate.toISOString())
            .lt('adjustment_date', endDate.toISOString())
            .order('adjustment_date', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getAppointments() {
        const { data, error } = await window.supabase
            .from('appointments')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async addAppointment(appointment) {
        const { data, error } = await window.supabase
            .from('appointments')
            .insert([appointment])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateAppointment(id, updates) {
        const { data, error } = await window.supabase
            .from('appointments')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getAppointmentById(id) {
        const { data, error } = await window.supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async getAppointmentsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getUserAppointmentsWithPrescriptions(userId) {
        const { data, error } = await window.supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .not('prescription_url', 'is', null)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async deleteAppointment(id) {
        const { error } = await window.supabase
            .from('appointments')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async getSpecialistCategories() {
        const { data, error } = await window.supabase
            .from('specialist_categories')
            .select('*')
            .order('sort_order');
        if (error) throw error;
        return data || [];
    },

    async addSpecialistCategory(category) {
        const { data, error } = await window.supabase
            .from('specialist_categories')
            .insert([category])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateSpecialistCategory(id, updates) {
        const { data, error } = await window.supabase
            .from('specialist_categories')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async deleteSpecialistCategory(id) {
        const { error } = await window.supabase
            .from('specialist_categories')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getBannerImages(type = null) {
        let query = window.supabase
            .from('banner_images')
            .select('*')
            .order('sort_order');
        
        if (type) {
            query = query.eq('type', type);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    async addBannerImage(banner) {
        const { data, error } = await window.supabase
            .from('banner_images')
            .insert([banner])
            .select();
        if (error) throw error;
        return data[0];
    },

    async deleteBannerImage(id) {
        const { error } = await window.supabase
            .from('banner_images')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getAmbulanceRequests() {
        const { data, error } = await window.supabase
            .from('ambulance_requests')
            .select(`
                *,
                user:users!ambulance_requests_user_id_fkey(name)
            `)
            .order('request_time', { ascending: false });
        
        if (error) {
            console.warn('Error fetching with join, trying without join:', error);
            const { data: basicData, error: basicError } = await window.supabase
                .from('ambulance_requests')
                .select('*')
                .order('request_time', { ascending: false });
            
            if (basicError) throw basicError;
            
            const userIds = [...new Set(basicData.filter(req => req.user_id).map(req => req.user_id))];
            let users = [];
            
            if (userIds.length > 0) {
                const { data: usersData, error: usersError } = await window.supabase
                    .from('users')
                    .select('id, name')
                    .in('id', userIds.map(id => parseInt(id)).filter(id => !isNaN(id)));
                
                if (!usersError) {
                    users = usersData || [];
                }
            }
            
            return basicData.map(req => {
                const userId = parseInt(req.user_id);
                const user = users.find(u => u.id === userId);
                return {
                    ...req,
                    user_name: user?.name || null
                };
            });
        }
        
        return (data || []).map(req => ({
            ...req,
            user_name: req.user?.name || null
        }));
    },

    async addAmbulanceRequest(request) {
        const { data, error } = await window.supabase
            .from('ambulance_requests')
            .insert([request])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateAmbulanceRequest(id, updates) {
        const { data, error } = await window.supabase
            .from('ambulance_requests')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getAmbulanceRequestsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('ambulance_requests')
            .select('*')
            .eq('user_id', userId)
            .order('request_time', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async deleteAmbulanceRequest(id) {
        const { data, error } = await window.supabase
            .from('ambulance_requests')
            .delete()
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getBloodRequests() {
        const { data, error } = await window.supabase
            .from('blood_requests')
            .select('*')
            .order('request_time', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async addBloodRequest(request) {
        const { data, error } = await window.supabase
            .from('blood_requests')
            .insert([request])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateBloodRequest(id, updates) {
        const { data, error } = await window.supabase
            .from('blood_requests')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getBloodRequestsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('blood_requests')
            .select('*')
            .eq('user_id', userId)
            .order('request_time', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async deleteBloodRequest(id) {
        const { data, error } = await window.supabase
            .from('blood_requests')
            .delete()
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getHospitalRequests() {
        const { data, error } = await window.supabase
            .from('hospital_requests')
            .select('*')
            .order('request_time', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async addHospitalRequest(request) {
        const { data, error} = await window.supabase
            .from('hospital_requests')
            .insert([request])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateHospitalRequest(id, updates) {
        const { data, error } = await window.supabase
            .from('hospital_requests')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getHospitalRequestsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('hospital_requests')
            .select('*')
            .eq('user_id', userId)
            .order('request_time', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async deleteHospitalRequest(id) {
        const { data, error } = await window.supabase
            .from('hospital_requests')
            .delete()
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getRedeemRequests() {
        const { data, error } = await window.supabase
            .from('redeem_requests')
            .select('*')
            .order('request_date', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getRedeemRequestById(id) {
        const { data, error } = await window.supabase
            .from('redeem_requests')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async addRedeemRequest(request) {
        const { data, error } = await window.supabase
            .from('redeem_requests')
            .insert([request])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateRedeemRequest(id, updates) {
        const { data, error } = await window.supabase
            .from('redeem_requests')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async deleteRedeemRequest(id) {
        const { error } = await window.supabase
            .from('redeem_requests')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async getRedeemRequestsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('redeem_requests')
            .select('*')
            .eq('user_id', userId)
            .order('request_date', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getMedicineRequests() {
        const { data, error } = await window.supabase
            .from('medicine_requests')
            .select('*')
            .order('request_time', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getMedicineRequestById(id) {
        const { data, error } = await window.supabase
            .from('medicine_requests')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async addMedicineRequest(request) {
        const { data, error } = await window.supabase
            .from('medicine_requests')
            .insert([request])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateMedicineRequest(id, updates) {
        const { data, error } = await window.supabase
            .from('medicine_requests')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getMedicineRequestsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('medicine_requests')
            .select('*')
            .eq('user_id', userId)
            .order('request_time', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async deleteMedicineRequest(id) {
        const { error } = await window.supabase
            .from('medicine_requests')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async addNotification(notification) {
        const { data, error } = await window.supabase
            .from('notifications')
            .insert([notification])
            .select();
        if (error) throw error;
        return data[0];
    },

    async getNotificationsByUserId(userId) {
        const { data, error } = await window.supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async markNotificationAsRead(id) {
        const { data, error } = await window.supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async deleteNotification(id) {
        const { error } = await window.supabase
            .from('notifications')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async getEmailSettings() {
        const { data, error } = await window.supabase
            .from('email_settings')
            .select('*')
            .limit(1)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async updateEmailSettings(id, updates) {
        const { data, error } = await window.supabase
            .from('email_settings')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getContactMessages(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('contact_messages');
            if (cached) return cached;
        }

        const { data, error } = await window.supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;

        if (window.cacheService && data) {
            window.cacheService.set('contact_messages', data);
        }

        return data || [];
    },

    async getContactMessageById(id) {
        const { data, error } = await window.supabase
            .from('contact_messages')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async addContactMessage(message) {
        const { data, error } = await window.supabase
            .from('contact_messages')
            .insert([message])
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('contact_messages');
        }

        return data[0];
    },

    async updateContactMessage(id, updates) {
        const updatedData = {
            ...updates,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await window.supabase
            .from('contact_messages')
            .update(updatedData)
            .eq('id', id)
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('contact_messages');
        }

        return data[0];
    },

    async deleteContactMessage(id) {
        const { error } = await window.supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('contact_messages');
        }

        return true;
    },

    async getContactMessagesByStatus(status) {
        const { data, error } = await window.supabase
            .from('contact_messages')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getContactMessagesByUserId(userId) {
        const { data, error } = await window.supabase
            .from('contact_messages')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    // Contact Info Management
    async getContactInfo(type = null, skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cacheKey = type ? `contact_info_${type}` : 'contact_info';
            const cached = window.cacheService.get(cacheKey);
            if (cached) return cached;
        }

        let query = window.supabase
            .from('contact_info')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (window.cacheService && data) {
            const cacheKey = type ? `contact_info_${type}` : 'contact_info';
            window.cacheService.set(cacheKey, data);
        }

        return data || [];
    },

    async getAllContactInfo(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('contact_info_all');
            if (cached) return cached;
        }

        const { data, error } = await window.supabase
            .from('contact_info')
            .select('*')
            .order('type')
            .order('display_order');
        if (error) throw error;

        if (window.cacheService && data) {
            window.cacheService.set('contact_info_all', data);
        }

        return data || [];
    },

    async addContactInfo(contactInfo) {
        const { data, error } = await window.supabase
            .from('contact_info')
            .insert([contactInfo])
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('contact_info');
            window.cacheService.invalidate('contact_info_all');
            window.cacheService.invalidate(`contact_info_${contactInfo.type}`);
        }

        return data[0];
    },

    async updateContactInfo(id, updates) {
        const { data, error } = await window.supabase
            .from('contact_info')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('contact_info');
            window.cacheService.invalidate('contact_info_all');
            if (data && data[0]) {
                window.cacheService.invalidate(`contact_info_${data[0].type}`);
            }
        }

        return data[0];
    },

    async deleteContactInfo(id) {
        const { error } = await window.supabase
            .from('contact_info')
            .delete()
            .eq('id', id);
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('contact_info');
            window.cacheService.invalidate('contact_info_all');
            window.cacheService.invalidate('contact_info_phone');
            window.cacheService.invalidate('contact_info_email');
            window.cacheService.invalidate('contact_info_address');
        }

        return true;
    },

    async reorderContactInfo(id, newOrder) {
        const { data, error } = await window.supabase
            .from('contact_info')
            .update({ display_order: newOrder })
            .eq('id', id)
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('contact_info');
            window.cacheService.invalidate('contact_info_all');
            if (data && data[0]) {
                window.cacheService.invalidate(`contact_info_${data[0].type}`);
            }
        }

        return data[0];
    },

    async getTermsAndConditions(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('terms_and_conditions');
            if (cached) return cached;
        }

        const { data, error } = await window.supabase
            .from('terms_and_conditions')
            .select('*')
            .eq('is_active', true)
            .order('section_order');
        if (error) throw error;

        if (window.cacheService && data) {
            window.cacheService.set('terms_and_conditions', data);
        }

        return data || [];
    },

    async getAllTermsSections(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('terms_all_sections');
            if (cached) return cached;
        }

        const { data, error } = await window.supabase
            .from('terms_and_conditions')
            .select('*')
            .order('section_order');
        if (error) throw error;

        if (window.cacheService && data) {
            window.cacheService.set('terms_all_sections', data);
        }

        return data || [];
    },

    async addTermsSection(section) {
        const { data, error } = await window.supabase
            .from('terms_and_conditions')
            .insert([section])
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('terms_and_conditions');
            window.cacheService.invalidate('terms_all_sections');
        }

        return data[0];
    },

    async updateTermsSection(id, updates) {
        const { data, error } = await window.supabase
            .from('terms_and_conditions')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('terms_and_conditions');
            window.cacheService.invalidate('terms_all_sections');
        }

        return data[0];
    },

    async deleteTermsSection(id) {
        const { error } = await window.supabase
            .from('terms_and_conditions')
            .delete()
            .eq('id', id);
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('terms_and_conditions');
            window.cacheService.invalidate('terms_all_sections');
        }

        return true;
    },

    async updateTermsMetadata(effectiveDate, lastUpdated) {
        const { data, error } = await window.supabase
            .from('terms_and_conditions')
            .update({ 
                effective_date: effectiveDate,
                last_updated: lastUpdated
            })
            .in('section_order', [0, 1])
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('terms_and_conditions');
            window.cacheService.invalidate('terms_all_sections');
        }

        return data;
    },

    async getPrivacyPolicy(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('privacy_policy');
            if (cached) return cached;
        }

        const { data, error } = await window.supabase
            .from('privacy_policy')
            .select('*')
            .eq('is_active', true)
            .order('section_order');
        if (error) throw error;

        if (window.cacheService && data) {
            window.cacheService.set('privacy_policy', data);
        }

        return data || [];
    },

    async getAllPrivacySections(skipCache = false) {
        if (!skipCache && window.cacheService) {
            const cached = window.cacheService.get('privacy_all_sections');
            if (cached) return cached;
        }

        const { data, error } = await window.supabase
            .from('privacy_policy')
            .select('*')
            .order('section_order');
        if (error) throw error;

        if (window.cacheService && data) {
            window.cacheService.set('privacy_all_sections', data);
        }

        return data || [];
    },

    async addPrivacySection(section) {
        const { data, error } = await window.supabase
            .from('privacy_policy')
            .insert([section])
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('privacy_policy');
            window.cacheService.invalidate('privacy_all_sections');
        }

        return data[0];
    },

    async updatePrivacySection(id, updates) {
        const { data, error } = await window.supabase
            .from('privacy_policy')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('privacy_policy');
            window.cacheService.invalidate('privacy_all_sections');
        }

        return data[0];
    },

    async deletePrivacySection(id) {
        const { error } = await window.supabase
            .from('privacy_policy')
            .delete()
            .eq('id', id);
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('privacy_policy');
            window.cacheService.invalidate('privacy_all_sections');
        }

        return true;
    },

    async updatePrivacyMetadata(effectiveDate, lastUpdated) {
        const { data, error } = await window.supabase
            .from('privacy_policy')
            .update({ 
                effective_date: effectiveDate,
                last_updated: lastUpdated
            })
            .in('section_order', [0, 1])
            .select();
        if (error) throw error;

        if (window.cacheService) {
            window.cacheService.invalidate('privacy_policy');
            window.cacheService.invalidate('privacy_all_sections');
        }

        return data;
    }
};

window.dbService = dbService;
