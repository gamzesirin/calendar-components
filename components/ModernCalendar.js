// Modern Calendar Component with advanced features
class ModernCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.selectedDate = null;
        this.hoveredDate = null;
        this.setupModernFeatures();
    }

    setupModernFeatures() {
        // Add today button
        this.createTodayButton();
        // Add date display
        this.createDateDisplay();
        // Add smooth animations
        this.addAnimationClasses();
    }

    createTodayButton() {
        const calendarContainer = document.querySelector(`#${this.id}`).closest('.calendar-container');
        if (!calendarContainer) return;

        const todayBtn = document.createElement('button');
        todayBtn.className = 'today-btn modern-today-btn';
        todayBtn.textContent = 'Today';
        todayBtn.addEventListener('click', () => this.goToToday());

        // Insert after calendar
        const calendar = calendarContainer.querySelector('.calendar');
        calendar.insertAdjacentElement('afterend', todayBtn);
    }

    createDateDisplay() {
        const calendarContainer = document.querySelector(`#${this.id}`).closest('.calendar-container');
        if (!calendarContainer) return;

        const dateDisplay = document.createElement('div');
        dateDisplay.className = 'modern-date-display';
        dateDisplay.id = `${this.id}-date-display`;
        dateDisplay.innerHTML = '<span class="selected-date-text">Select a date to see details</span>';

        // Insert after calendar
        const calendar = calendarContainer.querySelector('.calendar');
        calendar.insertAdjacentElement('afterend', dateDisplay);
    }

    addAnimationClasses() {
        const calendar = document.querySelector(`#${this.id}`).closest('.calendar');
        if (calendar) {
            calendar.classList.add('modern-animated');
        }
    }

    goToToday() {
        const today = new Date();
        this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.selectedDate = today;
        this.render();
        this.updateDateDisplay();
    }

    handleCalendarSpecificStyling(dayElement, date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Add modern hover effect
        dayElement.addEventListener('mouseenter', () => {
            this.hoveredDate = date;
            dayElement.classList.add('modern-hover');
            this.showDatePreview(date);
        });

        dayElement.addEventListener('mouseleave', () => {
            this.hoveredDate = null;
            dayElement.classList.remove('modern-hover');
        });

        // Weekend styling
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayElement.classList.add('weekend');
        }

        // Selected date styling
        if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
            dayElement.classList.add('selected', 'modern-selected');
        }

        // Today styling
        if (date.getTime() === today.getTime()) {
            dayElement.classList.add('today', 'modern-today');
        }
    }

    handleDayClick(dayElement, date) {
        // Remove previous selection
        const daysContainer = document.getElementById(`${this.id}-days`);
        daysContainer.querySelectorAll('.day.selected').forEach(el => {
            el.classList.remove('selected', 'modern-selected');
        });
        
        // Remove today class from all days when making a selection
        daysContainer.querySelectorAll('.day.today').forEach(el => {
            el.classList.remove('today', 'modern-today');
        });
        
        // Add selection with animation
        dayElement.classList.add('selected', 'modern-selected', 'click-animation');
        this.selectedDate = new Date(date);
        this.updateDateDisplay();

        // Remove animation class after animation completes
        setTimeout(() => {
            dayElement.classList.remove('click-animation');
        }, 300);
    }

    showDatePreview(date) {
        const display = document.getElementById(`${this.id}-date-display`);
        if (display) {
            const previewText = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            display.querySelector('.selected-date-text').textContent = `Hover: ${previewText}`;
        }
    }

    updateDateDisplay() {
        const display = document.getElementById(`${this.id}-date-display`);
        if (!display) return;

        if (this.selectedDate) {
            const dateText = this.selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            display.querySelector('.selected-date-text').textContent = `Selected: ${dateText}`;
            display.classList.add('has-selection');
        } else {
            display.querySelector('.selected-date-text').textContent = 'Select a date to see details';
            display.classList.remove('has-selection');
        }
    }

    render() {
        super.render();
        this.updateDateDisplay();
    }
    
    updateSelectedDisplay() {
        // Modern calendar uses its own date display instead
        return;
    }
}

// Export for use in main script
window.ModernCalendar = ModernCalendar;