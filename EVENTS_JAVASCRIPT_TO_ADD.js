// ===============================================
// EVENTS JAVASCRIPT
// Copy this ENTIRE file and paste it in admin.html
// Paste it RIGHT BEFORE the closing </script> tag
// ===============================================

let editingEvent = null;
let uploadedEventImage = null;
let allEvents = [];

// Event image upload handler (add after DOM loads)
setTimeout(() => {
    const eventImageInput = document.getElementById('eventImageInput');
    if (eventImageInput) {
        eventImageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.startsWith('image/')) {
                showError('Please select an image file');
                return;
            }

            await uploadEventImage(file);
        });
    }
}, 1000);

async function uploadEventImage(file) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;

        const { data, error } = await supabaseClient.storage
            .from('venue-images')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabaseClient.storage
            .from('venue-images')
            .getPublicUrl(filePath);

        uploadedEventImage = publicUrl;
        renderEventImagePreview();
        showSuccess('Image uploaded!');
    } catch (error) {
        showError('Upload failed: ' + error.message);
    }
}

function renderEventImagePreview() {
    const container = document.getElementById('eventImagePreview');
    if (!container) return;
    if (!uploadedEventImage) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = `
        <div class="image-preview-item main-image">
            <img src="${uploadedEventImage}" alt="Event image">
            <div class="main-badge">MAIN</div>
            <button type="button" class="remove-image" onclick="removeEventImage()">×</button>
        </div>
    `;
}

function removeEventImage() {
    uploadedEventImage = null;
    renderEventImagePreview();
    const input = document.getElementById('eventImageInput');
    if (input) input.value = '';
}

function toggleEventRepeatOptions() {
    const checkbox = document.getElementById('event_repeat');
    const repeatOptions = document.getElementById('eventRepeatOptions');
    
    if (checkbox && repeatOptions) {
        if (checkbox.checked) {
            repeatOptions.classList.remove('hidden');
        } else {
            repeatOptions.classList.add('hidden');
        }
    }
}

function cancelEventEdit() {
    editingEvent = null;
    const form = document.getElementById('eventForm');
    if (form) form.reset();
    
    const title = document.getElementById('eventFormTitle');
    if (title) title.textContent = 'Add New Event & Happening';
    
    const submitBtn = document.getElementById('eventSubmitBtn');
    if (submitBtn) submitBtn.textContent = 'Add Event';
    
    const cancelBtn = document.getElementById('eventCancelBtn');
    if (cancelBtn) cancelBtn.style.display = 'none';
    
    uploadedEventImage = null;
    renderEventImagePreview();
}

// Event form submit handler (add after DOM loads)
setTimeout(() => {
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const eventName = document.getElementById('event_name').value;
            const eventCategory = document.getElementById('event_category').value;
            const eventDescription = document.getElementById('event_description').value;
            const eventPhone = document.getElementById('event_phone').value;
            const venueId = document.getElementById('event_venue_link').value;
            const eventDate = document.getElementById('event_date').value;
            const startTime = document.getElementById('event_start_time').value;
            const endTime = document.getElementById('event_end_time').value;
            const isRepeat = document.getElementById('event_repeat').checked;
            const eventPrice = document.getElementById('event_price').value;
            const eventViews = parseInt(document.getElementById('event_views').value) || 0;
            const registeredDate = document.getElementById('event_registered_date').value || null;

            try {
                const repeatDaysCheckboxes = document.querySelectorAll('input[name="event_repeat_days"]:checked');
                const repeatDays = Array.from(repeatDaysCheckboxes).map(cb => cb.value);
                const repeatWeeks = parseInt(document.getElementById('event_repeat_weeks').value) || 0;

                const eventData = {
                    name: eventName,
                    category: eventCategory,
                    description: eventDescription,
                    phone: eventPhone,
                    venue_id: parseInt(venueId),
                    event_date: eventDate,
                    start_time: startTime || null,
                    end_time: endTime || null,
                    is_recurring: isRepeat,
                    recurring_day: (isRepeat && repeatDays.length > 0) ? repeatDays.join(',') : null,
                    recurring_weeks: (isRepeat && repeatWeeks > 0) ? repeatWeeks : null,
                    price: eventPrice,
                    price_range: document.getElementById('event_price_range').value || null,
                    image_url: uploadedEventImage,
                    views: eventViews,
                    registered_date: registeredDate,
                    active: true
                };

                if (editingEvent) {
                    const { error } = await supabaseClient.from('events').update(eventData).eq('id', editingEvent);
                    if (error) throw error;
                    showSuccess('Event updated successfully!');
                } else {
                    const { error } = await supabaseClient.from('events').insert([eventData]);
                    if (error) throw error;
                    showSuccess('Event created successfully!');
                }
                
                cancelEventEdit();
                loadEvents();
            } catch (error) {
                showError('Error: ' + error.message);
            }
        });
    }
}, 1000);

async function loadEvents() {
    const listDiv = document.getElementById('eventsList');
    if (!listDiv) return;
    
    listDiv.innerHTML = '<div class="loading">Loading events...</div>';
    
    try {
        const { data, error } = await supabaseClient
            .from('events')
            .select(`
                *,
                venues!events_venue_id_fkey(name, location_short)
            `)
            .order('event_date', { ascending: false });
            
        if (error) throw error;
        
        allEvents = data;
        
        if (data.length === 0) {
            listDiv.innerHTML = '<p style="text-align:center;color:#999;">No events yet! Create your first event.</p>';
            return;
        }
        
        renderEvents(data);
    } catch (error) {
        showError('Error loading events: ' + error.message);
        listDiv.innerHTML = '<p style="text-align:center;color:#e74c3c;">Error loading events.</p>';
    }
}

function renderEvents(events) {
    const listDiv = document.getElementById('eventsList');
    if (!listDiv) return;
    
    if (events.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center;color:#999;">No events match your filters.</p>';
        return;
    }
    
    listDiv.innerHTML = events.map(event => `
        <div class="venue-item">
            <div class="venue-info">
                <h3>${event.name}</h3>
                <p><strong>Category:</strong> ${event.category || 'N/A'}</p>
                <p><strong>Venue:</strong> ${event.venues?.name || 'N/A'} - ${event.venues?.location_short || ''}</p>
                <p><strong>Date:</strong> ${event.event_date} ${event.start_time ? `(${event.start_time} - ${event.end_time})` : ''}</p>
                ${event.is_recurring ? `<p><strong>Recurring:</strong> ${event.recurring_day} (${event.recurring_weeks} weeks)</p>` : ''}
                <p><strong>Price:</strong> ${event.price || 'Free'} | <strong>Status:</strong> ${event.active ? '✅ Active' : '❌ Inactive'}</p>
                ${event.image_url ? '<p><strong>Image:</strong> 📸</p>' : ''}
            </div>
            <div class="venue-actions">
                ${!event.active ? `<button class="reactivate" onclick="reactivateEvent(${event.id})">🔄 Reactivate</button>` : ''}
                <button class="edit" onclick="editEvent(${event.id})">Edit</button>
                <button class="delete" onclick="deleteEvent(${event.id}, '${event.name.replace(/'/g, "\\'")}')" >Delete</button>
            </div>
        </div>
    `).join('');
}

function filterEvents() {
    const searchTerm = document.getElementById('eventSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('eventCategoryFilter')?.value || '';
    const statusFilter = document.getElementById('eventStatusFilter')?.value || 'all';
    
    let filtered = allEvents;
    
    if (searchTerm) {
        filtered = filtered.filter(e => e.name.toLowerCase().includes(searchTerm));
    }
    
    if (categoryFilter) {
        filtered = filtered.filter(e => e.category === categoryFilter);
    }
    
    if (statusFilter === 'active') {
        filtered = filtered.filter(e => e.active === true);
    } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(e => e.active === false);
    }
    
    const resultsDiv = document.getElementById('eventFilterResults');
    if (resultsDiv) {
        if (searchTerm || categoryFilter || statusFilter !== 'all') {
            resultsDiv.style.display = 'block';
            resultsDiv.textContent = `Showing ${filtered.length} of ${allEvents.length} events`;
        } else {
            resultsDiv.style.display = 'none';
        }
    }
    
    renderEvents(filtered);
}

async function editEvent(id) {
    try {
        const { data, error } = await supabaseClient.from('events').select('*').eq('id', id).single();
        if (error) throw error;
        
        editingEvent = id;
        document.getElementById('eventFormTitle').textContent = 'Edit Event';
        document.getElementById('eventSubmitBtn').textContent = 'Update Event';
        document.getElementById('eventCancelBtn').style.display = 'inline-block';
        
        switchPage('add-event');
        
        document.getElementById('event_name').value = data.name || '';
        document.getElementById('event_category').value = data.category || '';
        document.getElementById('event_description').value = data.description || '';
        document.getElementById('event_phone').value = data.phone || '';
        document.getElementById('event_venue_link').value = data.venue_id || '';
        document.getElementById('event_date').value = data.event_date || '';
        document.getElementById('event_start_time').value = data.start_time || '20:00';
        document.getElementById('event_end_time').value = data.end_time || '23:00';
        document.getElementById('event_price').value = data.price || '';
        document.getElementById('event_price_range').value = data.price_range || '';
        document.getElementById('event_views').value = data.views || 0;
        document.getElementById('event_registered_date').value = data.registered_date || '';
        
        uploadedEventImage = data.image_url || null;
        renderEventImagePreview();
        
        if (data.is_recurring) {
            document.getElementById('event_repeat').checked = true;
            toggleEventRepeatOptions();
            
            if (data.recurring_day) {
                const days = data.recurring_day.split(',');
                days.forEach(day => {
                    const dayCheckbox = document.querySelector(`input[name="event_repeat_days"][value="${day.trim()}"]`);
                    if (dayCheckbox) dayCheckbox.checked = true;
                });
            }
            
            if (data.recurring_weeks) {
                document.getElementById('event_repeat_weeks').value = data.recurring_weeks;
            }
        } else {
            document.getElementById('event_repeat').checked = false;
            toggleEventRepeatOptions();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showError('Error loading event: ' + error.message);
    }
}

async function reactivateEvent(id) {
    try {
        const { data, error } = await supabaseClient.from('events').select('*').eq('id', id).single();
        if (error) throw error;
        
        editingEvent = id;
        document.getElementById('eventFormTitle').textContent = 'Reactivate Event - Set New Date';
        document.getElementById('eventSubmitBtn').textContent = 'Reactivate Event';
        document.getElementById('eventCancelBtn').style.display = 'inline-block';
        
        switchPage('add-event');
        
        document.getElementById('event_name').value = data.name || '';
        document.getElementById('event_category').value = data.category || '';
        document.getElementById('event_description').value = data.description || '';
        document.getElementById('event_phone').value = data.phone || '';
        document.getElementById('event_venue_link').value = data.venue_id || '';
        document.getElementById('event_date').value = '';
        document.getElementById('event_start_time').value = data.start_time || '20:00';
        document.getElementById('event_end_time').value = data.end_time || '23:00';
        document.getElementById('event_price').value = data.price || '';
        document.getElementById('event_price_range').value = data.price_range || '';
        document.getElementById('event_views').value = 0;
        document.getElementById('event_registered_date').value = '';
        
        uploadedEventImage = data.image_url || null;
        renderEventImagePreview();
        
        if (data.is_recurring) {
            document.getElementById('event_repeat').checked = true;
            toggleEventRepeatOptions();
            
            if (data.recurring_day) {
                const days = data.recurring_day.split(',');
                days.forEach(day => {
                    const dayCheckbox = document.querySelector(`input[name="event_repeat_days"][value="${day.trim()}"]`);
                    if (dayCheckbox) dayCheckbox.checked = true;
                });
            }
            
            if (data.recurring_weeks) {
                document.getElementById('event_repeat_weeks').value = data.recurring_weeks;
            }
        } else {
            document.getElementById('event_repeat').checked = false;
            toggleEventRepeatOptions();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showSuccess('Set a new date and click "Reactivate Event"!');
    } catch (error) {
        showError('Error loading event: ' + error.message);
    }
}

async function deleteEvent(id, name) {
    if (!confirm(`Delete event "${name}"?`)) return;
    
    try {
        const { error } = await supabaseClient.from('events').delete().eq('id', id);
        if (error) throw error;
        showSuccess('Event deleted!');
        loadEvents();
    } catch (error) {
        showError('Error deleting event: ' + error.message);
    }
}

async function loadVenuesForEventDropdown() {
    try {
        const { data, error } = await supabaseClient.from('venues').select('id, name, location_short').order('name', { ascending: true });
        if (error) throw error;
        
        const dropdown = document.getElementById('event_venue_link');
        if (!dropdown) return;
        
        dropdown.innerHTML = '<option value="">Select venue...</option>';
        
        data.forEach(venue => {
            const option = document.createElement('option');
            option.value = venue.id;
            option.textContent = venue.name;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading venues for event dropdown:', error);
    }
}
