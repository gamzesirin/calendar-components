// Multi-Select Calendar Component
class MultiSelectCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.selectedDates = [];
        this.setupClearButton();
    }

    initializeCalendar() {
        // Initialize selectedDates first, then call parent init
        this.selectedDates = [];
        this.init();
    }

    setupClearButton() {
        // For multiselect calendar, the clear button has ID 'clear-multiselect'
        const clearBtn = document.getElementById('clear-multiselect');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSelection());
        }
    }

    handleCalendarSpecificStyling(dayElement, date) {
        // Safety check for selectedDates
        if (!this.selectedDates) {
            this.selectedDates = [];
        }
        
        if (this.selectedDates && this.selectedDates.some(d => d.getTime() === date.getTime())) {
            dayElement.classList.add('multi-selected');
            // Remove today class if this date is selected
            dayElement.classList.remove('today');
        }
    }

    handleDayClick(dayElement, date) {
        // Safety check for selectedDates
        if (!this.selectedDates) {
            this.selectedDates = [];
        }
        
        const existingIndex = this.selectedDates.findIndex(d => d.getTime() === date.getTime());
        
        if (existingIndex !== -1) {
            // Remove from selection
            this.selectedDates.splice(existingIndex, 1);
            dayElement.classList.remove('multi-selected');
        } else {
            // Add to selection
            this.selectedDates.push(new Date(date));
            dayElement.classList.add('multi-selected');
            // Remove today class when selecting
            dayElement.classList.remove('today');
        }
        
        // Remove today class from all selected dates
        if (this.selectedDates.length > 0) {
            const daysContainer = document.getElementById(`${this.id}-days`);
            daysContainer.querySelectorAll('.day.multi-selected').forEach(el => {
                el.classList.remove('today');
            });
        }
        
        this.updateSelectedDisplay();
    }

    updateSelectedDisplay() {
        // For multiselect calendar, the display element has class 'selected-dates-list'
        const listElement = document.querySelector('.selected-dates-list');
        if (!listElement) return;

        // Safety check for selectedDates
        if (!this.selectedDates || this.selectedDates.length === 0) {
            listElement.textContent = 'No dates selected';
        } else {
            const dateStrings = this.selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map(d => d.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit'
                }))
                .join(', ');
            const count = this.selectedDates.length;
            listElement.textContent = `${dateStrings} (${count} date${count > 1 ? 's' : ''})`;
        }
    }

    clearSelection() {
        this.selectedDates = [];
        this.render();
        this.updateSelectedDisplay();
    }

    render() {
        super.render();
        this.updateSelectedDisplay();
    }

    getSelectedDates() {
        return this.selectedDates;
    }
}

// Export for use in main script
window.MultiSelectCalendar = MultiSelectCalendar;