class CalendarComponent {
    constructor(id) {
        this.id = id;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedDates = []; // For multi-select
        this.rangeStart = null; // For date range
        this.rangeEnd = null; // For date range
        this.events = this.loadEvents(); // For event calendar
        this.editingEventId = null; // For editing events
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.shortMonthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSpecialFeatures();
        this.render();
    }

    setupEventListeners() {
        const prevBtn = document.getElementById(`${this.id}-prev`);
        const nextBtn = document.getElementById(`${this.id}-next`);
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousMonth());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextMonth());

        // Setup clear buttons for multi-select and date range
        const clearBtn = document.getElementById(`clear-${this.id}`);
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSelection());
        }
    }

    setupSpecialFeatures() {
        // Setup dropdown functionality for dropdown calendar
        if (this.id === 'dropdown') {
            this.setupDropdowns();
        }

        // Setup inline datepicker functionality
        if (this.id === 'inline') {
            this.setupInlineDatepicker();
        }

        // Setup event calendar functionality
        if (this.id === 'events') {
            this.setupEventCalendar();
        }
    }

    setupDropdowns() {
        const monthDropdown = document.getElementById('month-dropdown');
        const yearDropdown = document.getElementById('year-dropdown');

        // Populate year dropdown
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 50; year <= currentYear + 10; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === currentYear) option.selected = true;
            yearDropdown.appendChild(option);
        }

        // Add event listeners
        monthDropdown.addEventListener('change', () => {
            this.currentDate.setMonth(parseInt(monthDropdown.value));
            this.render();
        });

        yearDropdown.addEventListener('change', () => {
            this.currentDate.setFullYear(parseInt(yearDropdown.value));
            this.render();
        });
    }

    setupInlineDatepicker() {
        const dateInput = document.getElementById('date-input');
        const quickButtons = document.querySelectorAll('.quick-btn');

        dateInput.addEventListener('click', () => {
            const calendar = document.getElementById('inline-calendar');
            calendar.style.display = calendar.style.display === 'none' ? 'block' : 'none';
        });

        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const date = new Date();

                switch(action) {
                    case 'today':
                        this.selectDateForInput(date);
                        break;
                    case 'tomorrow':
                        date.setDate(date.getDate() + 1);
                        this.selectDateForInput(date);
                        break;
                    case 'week':
                        date.setDate(date.getDate() + 7);
                        this.selectDateForInput(date);
                        break;
                }
            });
        });
    }

    selectDateForInput(date) {
        const dateInput = document.getElementById('date-input');
        dateInput.value = this.formatDateForInput(date);
        this.selectedDate = new Date(date);
        this.currentDate = new Date(date);
        this.render();
        document.getElementById('inline-calendar').style.display = 'none';
    }

    formatDateForInput(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
        addEventBtn.addEventListener('click', () => {
            this.showEventForm();
        });

        // Close form buttons
        closeForm.addEventListener('click', () => {
            this.hideEventForm();
        });

        cancelEvent.addEventListener('click', () => {
            this.hideEventForm();
        });

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

        // Modal form submission
        if (modalEventForm) {
            modalEventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEventFromModal();
            });
        }

        // Form submission
        eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });

        // Close on backdrop click
        eventFormContainer.addEventListener('click', (e) => {
            if (e.target === eventFormContainer) {
                this.hideEventForm();
            }
        });

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

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    render() {
        this.updateHeader();
        this.renderCalendarDays();
        this.updateSelectedDisplay();
    }

    updateHeader() {
        const monthElement = document.getElementById(`${this.id}-month`);
        const yearElement = document.getElementById(`${this.id}-year`);
        
        if (monthElement && yearElement) {
            const monthName = this.id === 'compact' 
                ? this.shortMonthNames[this.currentDate.getMonth()]
                : this.monthNames[this.currentDate.getMonth()];
            
            monthElement.textContent = monthName;
            yearElement.textContent = this.currentDate.getFullYear();
        }

        // Update dropdowns if this is dropdown calendar
        if (this.id === 'dropdown') {
            const monthDropdown = document.getElementById('month-dropdown');
            const yearDropdown = document.getElementById('year-dropdown');
            if (monthDropdown) monthDropdown.value = this.currentDate.getMonth();
            if (yearDropdown) yearDropdown.value = this.currentDate.getFullYear();
        }
    }

    renderCalendarDays() {
        const daysContainer = document.getElementById(`${this.id}-days`);
        if (!daysContainer) return;

        daysContainer.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = date.getDate();

            // Add classes based on date properties
            if (date.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }

            if (date.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }

            // Handle different calendar types
            this.handleCalendarSpecificStyling(dayElement, date);

            // Add click event based on calendar type
            dayElement.addEventListener('click', () => {
                this.handleDayClick(dayElement, date);
            });

            daysContainer.appendChild(dayElement);
        }
    }

    handleCalendarSpecificStyling(dayElement, date) {
        switch(this.id) {
            case 'multiselect':
                if (this.selectedDates.some(d => d.getTime() === date.getTime())) {
                    dayElement.classList.add('multi-selected');
                }
                break;

            case 'daterange':
                if (this.rangeStart && date.getTime() === this.rangeStart.getTime()) {
                    dayElement.classList.add('range-start');
                }
                if (this.rangeEnd && date.getTime() === this.rangeEnd.getTime()) {
                    dayElement.classList.add('range-end');
                }
                if (this.rangeStart && this.rangeEnd && 
                    date.getTime() > this.rangeStart.getTime() && 
                    date.getTime() < this.rangeEnd.getTime()) {
                    dayElement.classList.add('range-between');
                }
                break;

            case 'events':
                const dateKey = this.getDateKey(date);
                if (this.events[dateKey] && this.events[dateKey].length > 0) {
                    dayElement.classList.add('has-events');
                    
                    // Add event dots
                    const dotsContainer = document.createElement('div');
                    dotsContainer.className = 'event-dots';
                    
                    this.events[dateKey].slice(0, 3).forEach(event => {
                        const dot = document.createElement('span');
                        dot.className = `event-dot ${event.type}`;
                        dotsContainer.appendChild(dot);
                    });
                    
                    dayElement.appendChild(dotsContainer);
                }
                break;

            default:
                if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
                    dayElement.classList.add('selected');
                }
                break;
        }
    }

    handleDayClick(dayElement, date) {
        const daysContainer = document.getElementById(`${this.id}-days`);

        switch(this.id) {
            case 'multiselect':
                this.handleMultiSelect(dayElement, date);
                break;

            case 'daterange':
                this.handleDateRange(dayElement, date);
                break;

            case 'events':
                this.handleEventCalendarClick(dayElement, date);
                break;

            case 'inline':
                this.selectDateForInput(date);
                break;

            default:
                // Single date selection
                daysContainer.querySelectorAll('.day.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                dayElement.classList.add('selected');
                this.selectedDate = new Date(date);
                this.updateSelectedDisplay();
                break;
        }
    }

    handleMultiSelect(dayElement, date) {
        const existingIndex = this.selectedDates.findIndex(d => d.getTime() === date.getTime());
        
        if (existingIndex !== -1) {
            // Remove from selection
            this.selectedDates.splice(existingIndex, 1);
            dayElement.classList.remove('multi-selected');
        } else {
            // Add to selection
            this.selectedDates.push(new Date(date));
            dayElement.classList.add('multi-selected');
        }
        
        this.updateSelectedDisplay();
    }

    handleDateRange(dayElement, date) {
        if (!this.rangeStart || (this.rangeStart && this.rangeEnd)) {
            // Start new range
            this.rangeStart = new Date(date);
            this.rangeEnd = null;
        } else if (this.rangeStart && !this.rangeEnd) {
            // Complete range
            if (date.getTime() < this.rangeStart.getTime()) {
                this.rangeEnd = this.rangeStart;
                this.rangeStart = new Date(date);
            } else {
                this.rangeEnd = new Date(date);
            }
        }
        
        this.render(); // Re-render to update range styling
    }

    handleEventCalendarClick(dayElement, date) {
        // Remove previous selection
        document.querySelectorAll(`#${this.id}-days .day.selected`).forEach(el => {
            el.classList.remove('selected');
        });
        
        dayElement.classList.add('selected');
        
        const dateKey = this.getDateKey(date);
        const dayEvents = this.events[dateKey] || [];
        
        const eventInfo = document.getElementById('event-info');
        const eventCount = eventInfo.querySelector('.event-count');
        
        if (dayEvents.length > 0) {
            eventCount.textContent = `${dayEvents.length} event(s): ${dayEvents.map(e => e.name).join(', ')}`;
            this.showEventModal(date, dayEvents);
        } else {
            eventCount.textContent = 'No events for this date';
            this.showEventModal(date, []);
        }
    }

    updateSelectedDisplay() {
        const displayElement = document.getElementById(`${this.id}-selected`);
        if (!displayElement) return;

        const listElement = displayElement.querySelector('.selected-list');
        if (!listElement) return;

        switch(this.id) {
            case 'multiselect':
                if (this.selectedDates.length === 0) {
                    listElement.textContent = 'No dates selected';
                } else {
                    const dateStrings = this.selectedDates
                        .sort((a, b) => a.getTime() - b.getTime())
                        .map(d => d.toLocaleDateString())
                        .join(', ');
                    listElement.textContent = dateStrings;
                }
                break;

            case 'daterange':
                if (!this.rangeStart && !this.rangeEnd) {
                    listElement.textContent = 'No range selected';
                } else if (this.rangeStart && !this.rangeEnd) {
                    listElement.textContent = `Start: ${this.rangeStart.toLocaleDateString()}`;
                } else if (this.rangeStart && this.rangeEnd) {
                    listElement.textContent = `${this.rangeStart.toLocaleDateString()} - ${this.rangeEnd.toLocaleDateString()}`;
                }
                break;

            default:
                if (this.selectedDate) {
                    listElement.textContent = this.formatDateForInput(this.selectedDate);
                } else {
                    listElement.textContent = 'No date selected';
                }
                break;
        }
    }

    clearSelection() {
        switch(this.id) {
            case 'multiselect':
                this.selectedDates = [];
                break;
            case 'daterange':
                this.rangeStart = null;
                this.rangeEnd = null;
                break;
            default:
                this.selectedDate = null;
                break;
        }
        this.render();
    }

    setDate(date) {
        this.currentDate = new Date(date);
        this.render();
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    getSelectedDates() {
        return this.selectedDates;
    }

    getDateRange() {
        return { start: this.rangeStart, end: this.rangeEnd };
    }

    // Event Management Methods
    showEventForm(date = null, event = null) {
        const formContainer = document.getElementById('event-form-container');
        const formTitle = document.getElementById('form-title');
        const eventDateInput = document.getElementById('event-date');
        
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
        formContainer.style.display = 'none';
        this.editingEventId = null;
    }

    showEventModal(date, events) {
        this.selectedEventDate = date;
        const modalContainer = document.getElementById('event-modal-container');
        const modalTitle = document.getElementById('modal-title');
        
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
        if (!events) {
            const dateKey = this.getDateKey(this.selectedEventDate);
            events = this.events[dateKey] || [];
        }
        
        const eventListView = document.getElementById('event-list-view');
        const eventFormView = document.getElementById('event-form-view');
        const eventList = document.getElementById('event-list');
        
        // Show list view, hide form view
        eventListView.style.display = 'block';
        eventFormView.style.display = 'none';
        
        // Clear and populate event list
        eventList.innerHTML = '';
        
        if (events.length === 0) {
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
            
            // Set current event date for editing - use event's own date if available
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
        modalContainer.style.display = 'none';
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
                <button class="edit-event-btn" data-event-id="${event.id}" title="Edit event"></button>
                <button class="delete-event-btn" data-event-id="${event.id}" title="Delete event"></button>
            </div>
        `;
        
        // Add event listeners
        const editBtn = eventItem.querySelector('.edit-event-btn');
        const deleteBtn = eventItem.querySelector('.delete-event-btn');
        
        editBtn.addEventListener('click', () => {
            this.showEventFormInModal(event);
        });
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this event?')) {
                this.deleteEvent(event.id, date);
            }
        });
        
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
                    description: eventData.description
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
        const eventCount = eventInfo.querySelector('.event-count');
        eventCount.textContent = this.editingEventId ? 'Event updated successfully!' : 'Event added successfully!';
        
        setTimeout(() => {
            eventCount.textContent = 'Click on a date to see events';
        }, 2000);
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
        const eventCount = eventInfo.querySelector('.event-count');
        eventCount.textContent = this.editingEventId ? 'Event updated successfully!' : 'Event added successfully!';
        
        setTimeout(() => {
            eventCount.textContent = 'Click on a date to see events';
        }, 2000);
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
            const eventCount = eventInfo.querySelector('.event-count');
            eventCount.textContent = 'Event deleted successfully!';
            
            setTimeout(() => {
                eventCount.textContent = 'Click on a date to see events';
            }, 2000);
        }
    }
}

// Initialize all calendar instances
const calendars = {};

// Navigation functionality
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.component-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetComponent = button.getAttribute('data-component');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetComponent).classList.add('active');
            
            // Initialize calendar if not already done
            if (!calendars[targetComponent]) {
                calendars[targetComponent] = new CalendarComponent(targetComponent);
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();
    
    // Initialize the first calendar (events)
    calendars['events'] = new CalendarComponent('events');
    
    // Add some interactive features
    addInteractiveFeatures();
});

function addInteractiveFeatures() {
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle arrow keys if not in an input field or modal
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Check if any modal is open
        const openModal = document.querySelector('.event-form-container[style*="flex"], .event-modal-container[style*="flex"]');
        if (openModal) {
            return;
        }
        
        const activeSection = document.querySelector('.component-section.active');
        if (!activeSection) return;
        
        const calendarId = activeSection.id;
        const calendar = calendars[calendarId];
        if (!calendar) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                calendar.previousMonth();
                break;
            case 'ArrowRight':
                e.preventDefault();
                calendar.nextMonth();
                break;
            case 'Home':
                e.preventDefault();
                calendar.setDate(new Date());
                break;
            case 'Escape':
                if (calendarId === 'inline') {
                    const inlineCalendar = document.getElementById('inline-calendar');
                    if (inlineCalendar) {
                        inlineCalendar.style.display = 'none';
                    }
                }
                break;
        }
    });
    
    // Add today button functionality (could be extended)
    const todayButtons = document.querySelectorAll('.today-btn');
    todayButtons.forEach(button => {
        button.addEventListener('click', () => {
            const calendarId = button.getAttribute('data-calendar');
            if (calendars[calendarId]) {
                calendars[calendarId].setDate(new Date());
            }
        });
    });

    // Close inline calendar when clicking outside
    document.addEventListener('click', (e) => {
        const inlineCalendar = document.getElementById('inline-calendar');
        const dateInput = document.getElementById('date-input');
        const inlineSection = document.getElementById('inline');
        
        if (inlineCalendar && dateInput && inlineSection && 
            inlineSection.classList.contains('active') &&
            !inlineCalendar.contains(e.target) && 
            !dateInput.contains(e.target)) {
            inlineCalendar.style.display = 'none';
        }
    });
}

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function isSameMonth(date1, date2) {
    return date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

// Export functions for potential external use
window.CalendarComponent = CalendarComponent;
window.calendars = calendars;