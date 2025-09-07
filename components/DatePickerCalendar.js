// DatePicker Calendar Component
class DatePickerCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.selectedDate = null;
        this.isOpen = false;
        this.setupDatePicker();
    }

    initializeCalendar() {
        this.init();
    }

    setupDatePicker() {
        const input = document.getElementById(`${this.id}-input`);
        const clearBtn = document.getElementById(`clear-${this.id}`);
        const toggleBtn = document.getElementById(`toggle-${this.id}`);
        const calendar = document.getElementById(`${this.id}-calendar`);
        
        // Style input similar to dropdown calendar
        if (input) {
            input.style.border = '1px solid #ddd';
            input.style.backgroundColor = 'transparent';
            input.addEventListener('click', () => this.toggleCalendar());
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSelection());
        }
        
        if (toggleBtn) {
            toggleBtn.style.border = 'none';
            toggleBtn.style.backgroundColor = 'transparent';
            toggleBtn.addEventListener('click', () => this.toggleCalendar());
        }

        // Initially hide calendar
        if (calendar) {
            calendar.style.display = 'none';
        }

        // Close calendar on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.isInsideComponent(e.target)) {
                this.closeCalendar();
            }
        });
    }

    isInsideComponent(element) {
        const container = document.getElementById(this.id);
        return container && container.contains(element);
    }

    handleCalendarSpecificStyling(dayElement, date) {
        if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
            dayElement.classList.add('selected');
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
        this.selectedDate = new Date(date);
        
        this.updateInput();
        this.closeCalendar();
    }

    toggleCalendar() {
        if (this.isOpen) {
            this.closeCalendar();
        } else {
            this.openCalendar();
        }
    }

    openCalendar() {
        this.isOpen = true;
        const calendarContainer = document.getElementById(`${this.id}-calendar`);
        
        if (calendarContainer) {
            calendarContainer.style.display = 'block';
        }
        
        // Set current date to selected date if available
        if (this.selectedDate) {
            this.currentDate = new Date(this.selectedDate);
            this.render();
        }
    }

    closeCalendar() {
        this.isOpen = false;
        const calendarContainer = document.getElementById(`${this.id}-calendar`);
        
        if (calendarContainer) {
            calendarContainer.style.display = 'none';
        }
    }

    updateInput() {
        const input = document.getElementById(`${this.id}-input`);
        if (!input) return;

        if (this.selectedDate) {
            input.value = this.formatDateForInput(this.selectedDate);
        } else {
            input.value = '';
        }
    }

    updateSelectedDisplay() {
        // No longer showing selected display for datepicker
        return;
    }

    clearSelection() {
        this.selectedDate = null;
        this.updateInput();
        this.render();
        this.closeCalendar();
    }

    render() {
        super.render();
    }

    formatDateForInput(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    setSelectedDate(date) {
        this.selectedDate = date ? new Date(date) : null;
        if (this.selectedDate) {
            this.currentDate = new Date(this.selectedDate);
        }
        this.updateInput();
        this.render();
    }

    setToday() {
        this.setSelectedDate(new Date());
    }
    
    setDate(date) {
        // Set the current calendar view to the specified date
        this.currentDate = new Date(date);
        this.render();
    }
    
    // Override navigation methods to maintain calendar visibility
    previousMonth() {
        const wasOpen = this.isOpen;
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
        // Keep calendar open if it was open
        if (wasOpen && !this.isOpen) {
            this.openCalendar();
        }
    }
    
    nextMonth() {
        const wasOpen = this.isOpen;
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
        // Keep calendar open if it was open
        if (wasOpen && !this.isOpen) {
            this.openCalendar();
        }
    }
}

// Export for use in main script
window.DatePickerCalendar = DatePickerCalendar;