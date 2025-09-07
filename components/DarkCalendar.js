// Dark Calendar Component
class DarkCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
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
    }
    
    updateSelectedDisplay() {
        // No selected display in dark calendar
        return;
    }
}

// Export for use in main script
window.DarkCalendar = DarkCalendar;