// Inline Calendar Component
class InlineCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.selectedDate = null;
        this.isCalendarVisible = false;
        this.setupInlineDatepicker();
    }

    setupInlineDatepicker() {
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            this.initializeEventListeners();
        }, 100);
    }

    initializeEventListeners() {
        const dateInput = document.getElementById('date-input');
        const quickButtons = document.querySelectorAll('.quick-btn');
        const calendar = document.getElementById('inline-calendar');

        console.log('Setting up inline calendar:', { dateInput, quickButtons, calendar });

        if (dateInput) {
            dateInput.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCalendar();
            });
        }

        quickButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
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

        // Close calendar when clicking outside
        document.addEventListener('click', (e) => {
            const inlineSection = document.getElementById('inline');
            
            if (inlineSection && inlineSection.classList.contains('active')) {
                const calendar = document.getElementById('inline-calendar');
                const dateInput = document.getElementById('date-input');
                const quickButtons = document.querySelector('.quick-buttons');
                
                if (calendar && this.isCalendarVisible &&
                    !calendar.contains(e.target) && 
                    !dateInput.contains(e.target) &&
                    !quickButtons.contains(e.target)) {
                    this.hideCalendar();
                }
            }
        });
        
        // Handle keyboard navigation when calendar is visible
        document.addEventListener('keydown', (e) => {
            if (!this.isCalendarVisible) return;
            
            const inlineSection = document.getElementById('inline');
            if (!inlineSection || !inlineSection.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    this.hideCalendar();
                    break;
                case 'ArrowLeft':
                    if (e.target.closest('#inline-calendar')) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.previousMonth();
                    }
                    break;
                case 'ArrowRight':
                    if (e.target.closest('#inline-calendar')) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.nextMonth();
                    }
                    break;
            }
        });
    }

    toggleCalendar() {
        const calendar = document.getElementById('inline-calendar');
        if (calendar) {
            if (this.isCalendarVisible) {
                this.hideCalendar();
            } else {
                this.showCalendar();
            }
        }
    }

    showCalendar() {
        const calendar = document.getElementById('inline-calendar');
        if (calendar) {
            calendar.style.display = 'block';
            this.isCalendarVisible = true;
            // Navigate to current month if we have a selected date
            if (this.selectedDate) {
                this.currentDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
                this.render();
            }
        }
    }

    hideCalendar() {
        const calendar = document.getElementById('inline-calendar');
        if (calendar) {
            calendar.style.display = 'none';
            this.isCalendarVisible = false;
        }
    }

    // Override navigation methods to keep calendar visible
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
        // Keep calendar visible if it was visible
        if (this.isCalendarVisible) {
            const calendar = document.getElementById('inline-calendar');
            if (calendar) {
                calendar.style.display = 'block';
            }
        }
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
        // Keep calendar visible if it was visible
        if (this.isCalendarVisible) {
            const calendar = document.getElementById('inline-calendar');
            if (calendar) {
                calendar.style.display = 'block';
            }
        }
    }

    selectDateForInput(date) {
        const dateInput = document.getElementById('date-input');
        if (dateInput) {
            dateInput.value = this.formatDate(date);
        }
        this.selectedDate = new Date(date);
        this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
        this.render();
        this.hideCalendar();
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    handleCalendarSpecificStyling(dayElement, date) {
        if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
            dayElement.classList.add('selected', 'inline-selected');
        }

        // Add today styling
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date.getTime() === today.getTime()) {
            dayElement.classList.add('today');
        }
    }

    handleDayClick(dayElement, date) {
        // Remove previous selection
        const daysContainer = document.getElementById(`${this.id}-days`);
        if (daysContainer) {
            daysContainer.querySelectorAll('.day.selected').forEach(el => {
                el.classList.remove('selected', 'inline-selected');
            });
            
            // Remove today class from all days when making a selection
            daysContainer.querySelectorAll('.day.today').forEach(el => {
                el.classList.remove('today');
            });
        }
        
        // Add selection to clicked day
        dayElement.classList.add('selected', 'inline-selected');
        this.selectDateForInput(date);
    }
    
    updateSelectedDisplay() {
        // No selected display for inline calendar - date shown in input field
        return;
    }
}

// Export for use in main script
window.InlineCalendar = InlineCalendar;