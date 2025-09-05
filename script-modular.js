// Main Script for Modular Calendar Components
// Initialize all calendar instances
const calendars = {};

// Calendar component mapping
const CalendarComponents = {
    'modern': ModernCalendar,
    'minimal': MinimalCalendar,
    'dark': DarkCalendar,
    'compact': CompactCalendar,
    'multiselect': MultiSelectCalendar,
    'daterange': DateRangeCalendar,
    'dropdown': DropdownCalendar,
    'inline': InlineCalendar,
    'datepicker': DatePickerCalendar,
    'events': EventCalendar
};

// Navigation functionality
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn[data-component]');
    const sections = document.querySelectorAll('.component-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetComponent = button.getAttribute('data-component');
            console.log('Button clicked:', button, 'Target component:', targetComponent);
            
            if (!targetComponent) {
                console.error('Button does not have data-component attribute:', button);
                return;
            }
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(targetComponent);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error('Target section not found:', targetComponent);
                return;
            }
            
            // Initialize calendar if not already done
            if (!calendars[targetComponent]) {
                const ComponentClass = CalendarComponents[targetComponent];
                console.log('Trying to initialize:', targetComponent, 'Class found:', !!ComponentClass);
                if (ComponentClass) {
                    try {
                        calendars[targetComponent] = new ComponentClass(targetComponent);
                        console.log('Successfully initialized:', targetComponent);
                    } catch (error) {
                        console.error('Error initializing calendar:', targetComponent, error);
                    }
                } else {
                    console.error('Component class not found:', targetComponent);
                    console.error('Available components:', Object.keys(CalendarComponents));
                }
            } else {
                console.log('Calendar already exists:', targetComponent);
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();
    
    // Initialize the first calendar (events - since it's the default active)
    calendars['events'] = new EventCalendar('events');
    
    // Add interactive features
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
        
        // For special calendar types that have their own keyboard handling, 
        // only handle keys when not inside their calendar components
        const target = e.target;
        const calendarElement = target.closest('.calendar');
        
        // For inline calendar, check if calendar is visible and we're inside it
        if (calendarId === 'inline') {
            const inlineCalendarElement = document.getElementById('inline-calendar');
            const isCalendarVisible = inlineCalendarElement && inlineCalendarElement.style.display !== 'none';
            const isInsideCalendar = inlineCalendarElement && inlineCalendarElement.contains(target);
            
            // If calendar is visible and we're inside it, let it handle navigation
            if (isCalendarVisible && isInsideCalendar) {
                // The inline calendar handles its own navigation
                return;
            }
            // If calendar is not visible or we're outside it, handle globally
        }
        
        // For datepicker, check if it's open and we're inside it
        if (calendarId === 'datepicker') {
            const datepickerCalendar = document.getElementById('datepicker-calendar');
            const isOpen = calendar.isOpen;
            const isInsideCalendar = datepickerCalendar && datepickerCalendar.contains(target);
            
            // If calendar is open and we're inside it, let it handle navigation
            if (isOpen && isInsideCalendar) {
                // The datepicker handles its own navigation
                return;
            }
        }
        
        // For dropdown, check if it's open and we're inside it
        if (calendarId === 'dropdown') {
            const dropdownCalendar = document.querySelector('.dropdown-calendar');
            const isOpen = calendar.isOpen;
            const isInsideCalendar = dropdownCalendar && dropdownCalendar.contains(target);
            
            // If calendar is open and we're inside it, let it handle navigation
            if (isOpen && isInsideCalendar) {
                // The dropdown handles its own navigation
                return;
            }
        }
        
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
                    if (inlineCalendar && calendar.isCalendarVisible) {
                        calendar.hideCalendar();
                    }
                } else if (calendarId === 'datepicker' && calendar.isOpen) {
                    calendar.closeCalendar();
                } else if (calendarId === 'dropdown' && calendar.isOpen) {
                    calendar.closeCalendar();
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
                // Use setToday() method for datepicker, setDate() for others
                if (calendarId === 'datepicker' && calendars[calendarId].setToday) {
                    calendars[calendarId].setToday();
                } else if (calendars[calendarId].setDate) {
                    calendars[calendarId].setDate(new Date());
                }
            }
        });
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

// DatePicker helper functions
function setTodayDate() {
    if (calendars['datepicker']) {
        calendars['datepicker'].setToday();
    }
}

function clearDatePicker() {
    if (calendars['datepicker']) {
        calendars['datepicker'].clearSelection();
    }
}

// Export functions for potential external use
window.calendars = calendars;
window.CalendarComponents = CalendarComponents;
window.setTodayDate = setTodayDate;
window.clearDatePicker = clearDatePicker;