// Minimal Calendar Component - Clean and simple
class MinimalCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.selectedDate = null;
        this.setupMinimalDesign();
    }

    setupMinimalDesign() {
        // Apply minimal styling to calendar container
        const calendar = document.querySelector(`#${this.id}`).closest('.calendar');
        if (calendar) {
            calendar.classList.add('minimal-design');
        }

        // Hide navigation arrows initially, show on hover
        this.setupHoverNavigation();
        
        // Simplify month/year display
        this.simplifyHeader();
    }

    setupHoverNavigation() {
        const calendarContainer = document.querySelector(`#${this.id}`).closest('.calendar-container');
        if (!calendarContainer) return;

        const calendar = calendarContainer.querySelector('.calendar');
        const navButtons = calendar.querySelectorAll('.nav-btn');
        
        // Hide navigation buttons initially
        navButtons.forEach(btn => {
            btn.classList.add('minimal-nav-hidden');
        });

        // Show on calendar hover
        calendar.addEventListener('mouseenter', () => {
            navButtons.forEach(btn => {
                btn.classList.remove('minimal-nav-hidden');
                btn.classList.add('minimal-nav-visible');
            });
        });

        calendar.addEventListener('mouseleave', () => {
            navButtons.forEach(btn => {
                btn.classList.remove('minimal-nav-visible');
                btn.classList.add('minimal-nav-hidden');
            });
        });
    }

    simplifyHeader() {
        const monthYear = document.querySelector(`#${this.id}`).closest('.calendar').querySelector('.month-year');
        if (monthYear) {
            monthYear.classList.add('minimal-header');
        }
    }

    handleCalendarSpecificStyling(dayElement, date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Apply minimal styling classes
        dayElement.classList.add('minimal-day');

        // Minimal today indicator (just a small dot)
        if (date.getTime() === today.getTime()) {
            dayElement.classList.add('minimal-today');
        }

        // Minimal selected state
        if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
            dayElement.classList.add('minimal-selected');
        }

        // Very subtle weekend styling
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayElement.classList.add('minimal-weekend');
        }

        // Minimal hover effect
        dayElement.addEventListener('mouseenter', () => {
            dayElement.classList.add('minimal-hover');
        });

        dayElement.addEventListener('mouseleave', () => {
            dayElement.classList.remove('minimal-hover');
        });
    }

    handleDayClick(dayElement, date) {
        // Remove previous minimal selection
        const daysContainer = document.getElementById(`${this.id}-days`);
        daysContainer.querySelectorAll('.day.minimal-selected').forEach(el => {
            el.classList.remove('minimal-selected');
        });
        
        // Remove today class from all days when making a selection
        daysContainer.querySelectorAll('.day.today').forEach(el => {
            el.classList.remove('today', 'minimal-today');
        });
        
        // Add minimal selection styling
        dayElement.classList.add('minimal-selected');
        this.selectedDate = new Date(date);

        // Minimal feedback - just a subtle animation
        dayElement.classList.add('minimal-click');
        setTimeout(() => {
            dayElement.classList.remove('minimal-click');
        }, 150);
    }

    // Override render to maintain minimal approach
    render() {
        super.render();
        // No additional UI elements in minimal version
    }
    
    updateSelectedDisplay() {
        // No selected display in minimal calendar
        return;
    }
}

// Export for use in main script
window.MinimalCalendar = MinimalCalendar;