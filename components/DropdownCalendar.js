// Dropdown Calendar Component
class DropdownCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.isOpen = false;
        this.setupDropdowns();
        this.setupDropdownToggle();
    }

    setupDropdowns() {
        const monthDropdown = document.getElementById('month-dropdown');
        const yearDropdown = document.getElementById('year-dropdown');

        // Set current month as selected
        const currentMonth = new Date().getMonth();
        monthDropdown.value = currentMonth;

        // Populate year dropdown
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 50; year <= currentYear + 10; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === currentYear) option.selected = true;
            yearDropdown.appendChild(option);
        }

        // Style dropdowns with transparent background and black text
        monthDropdown.style.backgroundColor = 'transparent';
        monthDropdown.style.color = 'black';
        monthDropdown.style.border = '1px solid #ddd';
        monthDropdown.style.boxShadow = 'none';
        
        yearDropdown.style.backgroundColor = 'transparent';
        yearDropdown.style.color = 'black';
        yearDropdown.style.border = '1px solid #ddd';
        yearDropdown.style.boxShadow = 'none';

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

    setupDropdownToggle() {
        const toggleBtn = document.getElementById('dropdown-toggle');
        const input = document.getElementById('dropdown-input');
        const calendar = document.querySelector('.dropdown-calendar');

        // Hide dropdown elements
        if (toggleBtn) {
            toggleBtn.style.display = 'none';
        }
        if (input) {
            input.style.display = 'none';
        }

        // Show calendar by default
        if (calendar) {
            calendar.style.display = 'block';
            this.isOpen = true;
        }
    }

    isInsideDropdown(target) {
        const section = document.getElementById('dropdown');
        return section && section.contains(target);
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
        const calendar = document.querySelector('.dropdown-calendar');
        if (calendar) {
            calendar.style.display = 'block';
        }
    }

    closeCalendar() {
        this.isOpen = false;
        const calendar = document.querySelector('.dropdown-calendar');
        if (calendar) {
            calendar.style.display = 'none';
        }
    }

    updateHeader() {
        super.updateHeader();
        
        // Update dropdowns
        const monthDropdown = document.getElementById('month-dropdown');
        const yearDropdown = document.getElementById('year-dropdown');
        if (monthDropdown) monthDropdown.value = this.currentDate.getMonth();
        if (yearDropdown) yearDropdown.value = this.currentDate.getFullYear();
    }

    handleCalendarSpecificStyling(dayElement, date) {
        if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
            dayElement.classList.add('selected');
        }
    }

    handleDayClick(dayElement, date) {
        // Single date selection
        const daysContainer = document.getElementById(`${this.id}-days`);
        daysContainer.querySelectorAll('.day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Remove today class from all days when making a selection
        daysContainer.querySelectorAll('.day.today').forEach(el => {
            el.classList.remove('today');
        });
        
        dayElement.classList.add('selected');
        this.selectedDate = new Date(date);
        // No need to update input or close calendar - just keep calendar visible
    }

    updateDropdownInput() {
        const inputElement = document.getElementById('dropdown-input');
        if (!inputElement) return;

        if (this.selectedDate) {
            inputElement.value = this.selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } else {
            inputElement.value = '';
        }
    }

    render() {
        super.render();
        // No need to update dropdown input since it's hidden
    }
    
    updateSelectedDisplay() {
        // No selected display for dropdown calendar
        return;
    }
    
    // Override navigation methods to maintain dropdown visibility
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }
}

// Export for use in main script
window.DropdownCalendar = DropdownCalendar;