// Event Calendar Component
class EventCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.events = this.loadEvents();
        this.editingEventId = null;
        this.selectedEventDate = null;
        this.setupEventCalendar();
        // Initial render to show event indicators
        setTimeout(() => {
            this.render();
        }, 100);
    }

    setupEventCalendar() {
        const addEventBtn = document.getElementById('add-event-btn');
        const eventFormContainer = document.getElementById('event-form-container');
        const eventForm = document.getElementById('event-form');
        const closeForm = document.getElementById('close-form');
        const cancelEvent = document.getElementById('cancel-event');
        const eventModalContainer = document.getElementById('event-modal-container');
        const closeModal = document.getElementById('close-modal');
        const addEventModalBtn = document.getElementById('add-event-modal-btn');
        const backToListBtn = document.getElementById('back-to-list');
        const modalEventForm = document.getElementById('modal-event-form');

        // Add event button
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                this.showEventForm();
            });
        }

        // Close form buttons
        if (closeForm) {
            closeForm.addEventListener('click', () => {
                this.hideEventForm();
            });
        }

        if (cancelEvent) {
            cancelEvent.addEventListener('click', () => {
                this.hideEventForm();
            });
        }

        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.hideEventModal();
            });
        }

        // Add event from modal
        if (addEventModalBtn) {
            addEventModalBtn.addEventListener('click', () => {
                this.showEventFormInModal();
            });
        }

        // Back to list
        if (backToListBtn) {
            backToListBtn.addEventListener('click', () => {
                this.showEventListInModal();
            });
        }

        // Form submission
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEvent();
            });
        }

        // Modal form submission
        if (modalEventForm) {
            modalEventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEventFromModal();
            });
        }

        // Close on backdrop click
        if (eventFormContainer) {
            eventFormContainer.addEventListener('click', (e) => {
                if (e.target === eventFormContainer) {
                    this.hideEventForm();
                }
            });
        }

        if (eventModalContainer) {
            eventModalContainer.addEventListener('click', (e) => {
                if (e.target === eventModalContainer) {
                    this.hideEventModal();
                }
            });
        }
    }

    loadEvents() {
        // Try to load events from localStorage first
        const savedEvents = localStorage.getItem('calendar-events');
        if (savedEvents) {
            return JSON.parse(savedEvents);
        }
        
        // Generate some sample events if none exist
        return this.generateSampleEvents();
    }

    generateSampleEvents() {
        const events = {};
        const today = new Date();
        
        // Generate some sample events for the current month
        const sampleEvents = [
            { date: new Date(today.getFullYear(), today.getMonth(), 5), type: 'work', name: 'Team Meeting', description: 'Weekly team standup meeting' },
            { date: new Date(today.getFullYear(), today.getMonth(), 12), type: 'personal', name: 'Doctor Appointment', description: 'Annual checkup' },
            { date: new Date(today.getFullYear(), today.getMonth(), 18), type: 'work', name: 'Project Deadline', description: 'Submit final project deliverables' },
            { date: new Date(today.getFullYear(), today.getMonth(), 25), type: 'holiday', name: 'Family Dinner', description: 'Monthly family gathering' }
        ];

        sampleEvents.forEach((event, index) => {
            const dateKey = this.getDateKey(event.date);
            if (!events[dateKey]) events[dateKey] = [];
            events[dateKey].push({
                id: `event-${Date.now()}-${index}`,
                type: event.type,
                name: event.name,
                description: event.description,
                date: event.date
            });
        });
        
        return events;
    }

    saveEvents() {
        localStorage.setItem('calendar-events', JSON.stringify(this.events));
    }

    getDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    handleCalendarSpecificStyling(dayElement, date) {
        const dateKey = this.getDateKey(date);
        if (this.events && this.events[dateKey] && this.events[dateKey].length > 0) {
            dayElement.classList.add('has-events');
            
            // Add simple dot indicator
            const dot = document.createElement('span');
            dot.className = 'event-indicator';
            dot.textContent = '•';
            dayElement.appendChild(dot);
        }

        if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
            dayElement.classList.add('selected');
            // Remove today class if this date is selected
            dayElement.classList.remove('today');
        }
    }

    handleDayClick(dayElement, date) {
        // Remove previous selection
        document.querySelectorAll(`#${this.id}-days .day.selected`).forEach(el => {
            el.classList.remove('selected');
        });
        
        // Remove today class from all days when making a selection
        document.querySelectorAll(`#${this.id}-days .day.today`).forEach(el => {
            el.classList.remove('today');
        });
        
        dayElement.classList.add('selected');
        
        const dateKey = this.getDateKey(date);
        const dayEvents = this.events[dateKey] || [];
        
        const eventInfo = document.getElementById('event-info');
        const eventCount = eventInfo ? eventInfo.querySelector('.event-count') : null;
        
        if (dayEvents.length > 0) {
            if (eventCount) {
                eventCount.textContent = `${dayEvents.length} event(s): ${dayEvents.map(e => e.name).join(', ')}`;
            }
            this.showEventModal(date, dayEvents);
        } else {
            if (eventCount) {
                eventCount.textContent = 'No events for this date';
            }
            this.showEventModal(date, []);
        }
    }

    // Event Management Methods
    showEventForm(date = null, event = null) {
        const formContainer = document.getElementById('event-form-container');
        const formTitle = document.getElementById('form-title');
        const eventDateInput = document.getElementById('event-date');
        
        if (!formContainer || !eventDateInput) return;
        
        // Reset form
        document.getElementById('event-form').reset();
        this.editingEventId = null;
        
        if (event) {
            // Editing existing event
            formTitle.textContent = 'Edit Event';
            document.getElementById('event-title').value = event.name;
            document.getElementById('event-type').value = event.type;
            document.getElementById('event-description').value = event.description || '';
            this.editingEventId = event.id;
            
            // Use event's own date if available, otherwise use selected date
            if (event.date) {
                date = event.date;
            }
        } else {
            // Creating new event
            formTitle.textContent = 'Add New Event';
        }
        
        // Set date
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            eventDateInput.value = `${year}-${month}-${day}`;
        } else if (!event) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            eventDateInput.value = `${year}-${month}-${day}`;
        }
        
        formContainer.style.display = 'flex';
    }

    hideEventForm() {
        const formContainer = document.getElementById('event-form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
        }
        this.editingEventId = null;
    }

    showEventModal(date, events) {
        this.selectedEventDate = date;
        const modalContainer = document.getElementById('event-modal-container');
        const modalTitle = document.getElementById('modal-title');
        
        if (!modalContainer || !modalTitle) return;
        
        modalTitle.textContent = `Events for ${date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`;
        
        this.showEventListInModal(events);
        modalContainer.style.display = 'flex';
    }

    showEventListInModal(events = null) {
        if (!events && this.selectedEventDate) {
            const dateKey = this.getDateKey(this.selectedEventDate);
            events = this.events[dateKey] || [];
        }
        
        const eventListView = document.getElementById('event-list-view');
        const eventFormView = document.getElementById('event-form-view');
        const eventList = document.getElementById('event-list');
        
        if (!eventListView || !eventFormView || !eventList) return;
        
        // Show list view, hide form view
        eventListView.style.display = 'block';
        eventFormView.style.display = 'none';
        
        // Clear and populate event list
        eventList.innerHTML = '';
        
        if (!events || events.length === 0) {
            eventList.innerHTML = '<div class="no-events">No events for this date. Click "Add Event" to create one.</div>';
        } else {
            events.forEach(event => {
                const eventItem = this.createEventListItem(event, this.selectedEventDate);
                eventList.appendChild(eventItem);
            });
        }
    }

    showEventFormInModal(event = null) {
        const eventListView = document.getElementById('event-list-view');
        const eventFormView = document.getElementById('event-form-view');
        const modalEventForm = document.getElementById('modal-event-form');
        
        if (!eventListView || !eventFormView || !modalEventForm) return;
        
        // Show form view, hide list view
        eventListView.style.display = 'none';
        eventFormView.style.display = 'block';
        
        // Reset form
        modalEventForm.reset();
        this.editingEventId = null;
        
        if (event) {
            // Editing existing event
            document.getElementById('modal-event-title').value = event.name;
            document.getElementById('modal-event-type').value = event.type;
            document.getElementById('modal-event-description').value = event.description || '';
            this.editingEventId = event.id;
            
            // Use event's own date if available, otherwise use selected date
            const dateToUse = event.date || this.selectedEventDate;
            if (dateToUse) {
                const year = dateToUse.getFullYear();
                const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
                const day = String(dateToUse.getDate()).padStart(2, '0');
                document.getElementById('modal-event-date').value = `${year}-${month}-${day}`;
            }
        } else {
            // New event - set to selected date
            if (this.selectedEventDate) {
                const year = this.selectedEventDate.getFullYear();
                const month = String(this.selectedEventDate.getMonth() + 1).padStart(2, '0');
                const day = String(this.selectedEventDate.getDate()).padStart(2, '0');
                document.getElementById('modal-event-date').value = `${year}-${month}-${day}`;
            } else {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                document.getElementById('modal-event-date').value = `${year}-${month}-${day}`;
            }
        }
    }

    hideEventModal() {
        const modalContainer = document.getElementById('event-modal-container');
        if (modalContainer) {
            modalContainer.style.display = 'none';
        }
        this.selectedEventDate = null;
    }

    createEventListItem(event, date) {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        
        const eventTypeText = event.type.charAt(0).toUpperCase() + event.type.slice(1);
        
        eventItem.innerHTML = `
            <div class="event-item-header">
                <h4 class="event-item-title">${event.name}</h4>
                <div class="event-item-type">
                    <span class="event-dot ${event.type}"></span>
                    ${eventTypeText}
                </div>
            </div>
            ${event.description ? `<p class="event-item-description">${event.description}</p>` : ''}
            <div class="event-item-actions">
                <button class="edit-event-btn" data-event-id="${event.id}">Edit</button>
                <button class="delete-event-btn" data-event-id="${event.id}">Delete</button>
            </div>
        `;
        
        // Add event listeners
        const editBtn = eventItem.querySelector('.edit-event-btn');
        const deleteBtn = eventItem.querySelector('.delete-event-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.showEventFormInModal(event);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this event?')) {
                    this.deleteEvent(event.id, date);
                }
            });
        }
        
        return eventItem;
    }

    saveEvent() {
        const form = document.getElementById('event-form');
        const formData = new FormData(form);
        
        const eventData = {
            id: this.editingEventId || `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: formData.get('title'),
            type: formData.get('type'),
            description: formData.get('description'),
            date: formData.get('date')
        };
        
        // Parse date properly to avoid timezone issues
        const dateParts = eventData.date.split('-');
        const eventDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        const dateKey = this.getDateKey(eventDate);
        
        if (!this.events[dateKey]) {
            this.events[dateKey] = [];
        }
        
        if (this.editingEventId) {
            // Update existing event
            const eventIndex = this.events[dateKey].findIndex(e => e.id === this.editingEventId);
            if (eventIndex !== -1) {
                this.events[dateKey][eventIndex] = {
                    id: eventData.id,
                    name: eventData.name,
                    type: eventData.type,
                    description: eventData.description,
                    date: eventDate
                };
            }
        } else {
            // Add new event
            this.events[dateKey].push({
                id: eventData.id,
                name: eventData.name,
                type: eventData.type,
                description: eventData.description,
                date: eventDate
            });
        }
        
        this.saveEvents();
        this.hideEventForm();
        this.render();
        
        // Show success message
        const eventInfo = document.getElementById('event-info');
        const eventCount = eventInfo ? eventInfo.querySelector('.event-count') : null;
        if (eventCount) {
            eventCount.textContent = this.editingEventId ? 'Event updated successfully!' : 'Event added successfully!';
            
            setTimeout(() => {
                eventCount.textContent = 'Click on a date to see events';
            }, 2000);
        }
    }

    saveEventFromModal() {
        const form = document.getElementById('modal-event-form');
        const formData = new FormData(form);
        
        const eventData = {
            id: this.editingEventId || `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: formData.get('title'),
            type: formData.get('type'),
            description: formData.get('description'),
            date: formData.get('date')
        };
        
        // Parse date properly to avoid timezone issues
        const dateParts = eventData.date.split('-');
        const eventDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        const newDateKey = this.getDateKey(eventDate);
        
        if (this.editingEventId) {
            // Find and remove existing event from all dates
            let foundEvent = null;
            let oldDateKey = null;
            
            for (const [dateKey, events] of Object.entries(this.events)) {
                const eventIndex = events.findIndex(e => e.id === this.editingEventId);
                if (eventIndex !== -1) {
                    foundEvent = events[eventIndex];
                    oldDateKey = dateKey;
                    events.splice(eventIndex, 1);
                    if (events.length === 0) {
                        delete this.events[dateKey];
                    }
                    break;
                }
            }
            
            // Add updated event to new date
            if (!this.events[newDateKey]) {
                this.events[newDateKey] = [];
            }
            this.events[newDateKey].push({
                id: eventData.id,
                name: eventData.name,
                type: eventData.type,
                description: eventData.description,
                date: eventDate
            });
        } else {
            // Add new event
            if (!this.events[newDateKey]) {
                this.events[newDateKey] = [];
            }
            this.events[newDateKey].push({
                id: eventData.id,
                name: eventData.name,
                type: eventData.type,
                description: eventData.description,
                date: eventDate
            });
        }
        
        this.saveEvents();
        this.render();
        
        // Update selected date if needed
        if (this.editingEventId && this.selectedEventDate) {
            this.selectedEventDate = eventDate;
        }
        
        this.showEventListInModal();
        
        // Show success message
        const eventInfo = document.getElementById('event-info');
        const eventCount = eventInfo ? eventInfo.querySelector('.event-count') : null;
        if (eventCount) {
            eventCount.textContent = this.editingEventId ? 'Event updated successfully!' : 'Event added successfully!';
            
            setTimeout(() => {
                eventCount.textContent = 'Click on a date to see events';
            }, 2000);
        }
    }

    deleteEvent(eventId, date) {
        // Find and remove event from any date
        let found = false;
        for (const [dateKey, events] of Object.entries(this.events)) {
            const eventIndex = events.findIndex(event => event.id === eventId);
            if (eventIndex !== -1) {
                events.splice(eventIndex, 1);
                
                // Remove the date key if no events left
                if (events.length === 0) {
                    delete this.events[dateKey];
                }
                found = true;
                break;
            }
        }
        
        if (found) {
            this.saveEvents();
            this.render();
            this.showEventListInModal();
            
            // Show success message
            const eventInfo = document.getElementById('event-info');
            const eventCount = eventInfo ? eventInfo.querySelector('.event-count') : null;
            if (eventCount) {
                eventCount.textContent = 'Event deleted successfully!';
                
                setTimeout(() => {
                    eventCount.textContent = 'Click on a date to see events';
                }, 2000);
            }
        }
    }
    
    updateSelectedDisplay() {
        // Event calendar uses event-info instead of selected display
        return;
    }
}

// Export for use in main script
window.EventCalendar = EventCalendar;