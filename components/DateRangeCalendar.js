// Date Range Calendar Component
class DateRangeCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        this.rangeStart = null;
        this.rangeEnd = null;
        this.setupClearButton();
    }

    setupClearButton() {
        // For daterange calendar, the clear button has ID 'clear-daterange'
        const clearBtn = document.getElementById('clear-daterange');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSelection());
        }
    }

    handleCalendarSpecificStyling(dayElement, date) {
        // Clear previous range classes first
        dayElement.classList.remove('range-start', 'range-end', 'range-between');
        
        if (this.rangeStart && date.getTime() === this.rangeStart.getTime()) {
            dayElement.classList.add('range-start');
            // Remove today class if this date is part of range
            dayElement.classList.remove('today');
        }
        if (this.rangeEnd && date.getTime() === this.rangeEnd.getTime()) {
            dayElement.classList.add('range-end');
            // Remove today class if this date is part of range
            dayElement.classList.remove('today');
        }
        if (this.rangeStart && this.rangeEnd && 
            date.getTime() > this.rangeStart.getTime() && 
            date.getTime() < this.rangeEnd.getTime()) {
            dayElement.classList.add('range-between');
            // Remove today class if this date is part of range
            dayElement.classList.remove('today');
        }

        // Add hover effect for range selection
        dayElement.addEventListener('mouseenter', () => {
            if (this.rangeStart && !this.rangeEnd) {
                this.highlightPotentialRange(date);
            }
        });

        dayElement.addEventListener('mouseleave', () => {
            if (this.rangeStart && !this.rangeEnd) {
                this.clearPotentialRange();
            }
        });
    }

    handleDayClick(dayElement, date) {
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
        
        // Remove today class from all days when making a range selection
        const daysContainer = document.getElementById(`${this.id}-days`);
        if (this.rangeStart || this.rangeEnd) {
            daysContainer.querySelectorAll('.day.today').forEach(el => {
                el.classList.remove('today');
            });
        }
        
        this.render(); // Re-render to update range styling
    }

    updateSelectedDisplay() {
        // For daterange calendar, the display element has class 'selected-range-info'
        const listElement = document.querySelector('.selected-range-info');
        if (!listElement) return;

        if (!this.rangeStart && !this.rangeEnd) {
            listElement.textContent = 'No range selected';
        } else if (this.rangeStart && !this.rangeEnd) {
            const startStr = this.rangeStart.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit'
            });
            listElement.textContent = `Start: ${startStr} (click end date)`;
        } else if (this.rangeStart && this.rangeEnd) {
            const startStr = this.rangeStart.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit'
            });
            const endStr = this.rangeEnd.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit'
            });
            const daysDiff = Math.ceil((this.rangeEnd - this.rangeStart) / (1000 * 60 * 60 * 24)) + 1;
            listElement.textContent = `${startStr} - ${endStr} (${daysDiff} days)`;
        }
    }

    clearSelection() {
        this.rangeStart = null;
        this.rangeEnd = null;
        this.render();
        this.updateSelectedDisplay();
    }

    render() {
        super.render();
        this.updateSelectedDisplay();
    }

    highlightPotentialRange(hoverDate) {
        if (!this.rangeStart) return;
        
        const daysContainer = document.getElementById(`${this.id}-days`);
        if (!daysContainer) return;

        const startTime = this.rangeStart.getTime();
        const hoverTime = hoverDate.getTime();
        const minTime = Math.min(startTime, hoverTime);
        const maxTime = Math.max(startTime, hoverTime);

        // Clear previous hover highlights
        daysContainer.querySelectorAll('.range-hover').forEach(el => {
            el.classList.remove('range-hover');
        });

        // Add hover highlights
        daysContainer.querySelectorAll('.day').forEach(dayEl => {
            const dayDate = new Date(dayEl.dataset.date);
            if (dayDate.getTime() >= minTime && dayDate.getTime() <= maxTime) {
                dayEl.classList.add('range-hover');
            }
        });
    }

    clearPotentialRange() {
        const daysContainer = document.getElementById(`${this.id}-days`);
        if (!daysContainer) return;

        daysContainer.querySelectorAll('.range-hover').forEach(el => {
            el.classList.remove('range-hover');
        });
    }

    getDateRange() {
        return { start: this.rangeStart, end: this.rangeEnd };
    }
}

// Export for use in main script
window.DateRangeCalendar = DateRangeCalendar;