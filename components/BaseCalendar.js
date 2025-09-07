// Base Calendar Component
class BaseCalendar {
    constructor(id) {
        this.id = id;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.shortMonthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        // Allow child classes to override initialization
        if (this.initializeCalendar) {
            this.initializeCalendar();
        } else {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Remove any existing listeners first
        this.removeEventListeners();
        
        const prevBtn = document.getElementById(`${this.id}-prev`);
        const nextBtn = document.getElementById(`${this.id}-next`);
        
        // Store bound functions for cleanup
        this.prevHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousMonth();
        };
        
        this.nextHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextMonth();
        };
        
        if (prevBtn) {
            prevBtn.addEventListener('click', this.prevHandler);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', this.nextHandler);
        }
    }

    removeEventListeners() {
        if (this.prevHandler) {
            const prevBtn = document.getElementById(`${this.id}-prev`);
            if (prevBtn) {
                prevBtn.removeEventListener('click', this.prevHandler);
            }
        }
        if (this.nextHandler) {
            const nextBtn = document.getElementById(`${this.id}-next`);
            if (nextBtn) {
                nextBtn.removeEventListener('click', this.nextHandler);
            }
        }
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
            dayElement.dataset.date = date.toISOString(); // Add data attribute for date

            // Add classes based on date properties
            if (date.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }

            // Add today class first
            if (date.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }

            // Handle calendar-specific styling (may override today styling)
            this.handleCalendarSpecificStyling(dayElement, date);

            // Add click event
            dayElement.addEventListener('click', () => {
                this.handleDayClick(dayElement, date);
            });

            daysContainer.appendChild(dayElement);
        }
    }

    handleCalendarSpecificStyling(dayElement, date) {
        // Override in child classes
        if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
            dayElement.classList.add('selected');
        }
    }

    handleDayClick(dayElement, date) {
        // Single date selection by default
        const daysContainer = document.getElementById(`${this.id}-days`);
        
        // Remove selected class from all days
        daysContainer.querySelectorAll('.day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Remove today class from all days when making a selection
        daysContainer.querySelectorAll('.day.today').forEach(el => {
            el.classList.remove('today');
        });
        
        dayElement.classList.add('selected');
        this.selectedDate = new Date(date);
    }

    setDate(date) {
        this.currentDate = new Date(date);
        this.render();
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// Export for use in other files
window.BaseCalendar = BaseCalendar;