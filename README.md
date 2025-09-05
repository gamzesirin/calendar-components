# 📅 Calendar Components Collection

A beautiful and comprehensive collection of interactive calendar components built with vanilla JavaScript, HTML, and CSS. This project features 10 different calendar designs, each with unique functionality and styling.

## 🚀 Features

- **10 Unique Calendar Types** - Modern, Minimal, Dark, Colorful, Compact, Multi-Select, Date Range, Dropdown, Inline, and Event calendars
- **Modular Architecture** - Each calendar is a separate component extending a base class
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Event Management** - Complete event creation, editing, and deletion with local storage
- **Multiple Selection Modes** - Single date, multiple dates, and date range selection
- **Keyboard Navigation** - Arrow keys for month navigation, Home key for today, Escape to close
- **Beautiful UI/UX** - Clean, modern design with smooth animations
- **No Dependencies** - Built with pure vanilla JavaScript, no external libraries required

## 📁 Project Structure

```
📦 Calendar Components
├── 📄 index.html                 # Main HTML file
├── 📄 styles.css                # All styles and themes
├── 📄 script-modular.js          # Main application script
├── 📄 script.js                  # Original monolithic script (legacy)
├── 📄 README.md                  # This file
└── 📁 components/                # Modular calendar components
    ├── 📄 BaseCalendar.js        # Base class for all calendars
    ├── 📄 ModernCalendar.js      # Modern calendar component
    ├── 📄 MinimalCalendar.js     # Minimal calendar component
    ├── 📄 DarkCalendar.js        # Dark theme calendar component
    ├── 📄 CompactCalendar.js     # Compact calendar component
    ├── 📄 MultiSelectCalendar.js # Multi-select calendar component
    ├── 📄 DateRangeCalendar.js   # Date range picker component
    ├── 📄 DropdownCalendar.js    # Calendar with month/year dropdowns
    ├── 📄 InlineCalendar.js      # Inline date picker component
    └── 📄 EventCalendar.js       # Full-featured event calendar
```

## 🎨 Calendar Types

### 1. 🎯 Modern Calendar
- Clean, contemporary design
- Hover effects and smooth transitions
- Single date selection

### 2. ✨ Minimal Calendar
- Ultra-clean minimalist interface
- Subtle styling and typography
- Perfect for simple date picking

### 3. 🌙 Dark Calendar
- Dark theme with light text
- Easy on the eyes for night usage
- High contrast for accessibility

### 4. 📦 Compact Calendar
- Space-saving design
- Smaller size perfect for sidebars
- Abbreviated month names

### 5. ✅ Multi-Select Calendar
- Select multiple dates simultaneously
- Visual indication of selected dates
- Clear all selection button
- Perfect for booking systems

### 6. 📊 Date Range Calendar
- Select start and end dates
- Visual range highlighting
- Great for date filtering and reports

### 7. 📋 Dropdown Calendar
- Month and year dropdown selectors
- Quick navigation to any month/year
- Keyboard accessible

### 8. 📱 Inline Calendar
- Always visible calendar
- Input field integration
- Quick action buttons (Today, Tomorrow, Next Week)

### 9. 📅 Event Calendar (Default)
- Full event management system
- Create, edit, and delete events
- Event categories (Work, Personal, Holiday)
- Color-coded event indicators
- Modal-based event forms
- Local storage persistence
- Event list view with descriptions

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Navigate** between different calendar types using the top navigation

### Running with a Local Server (Recommended)

```bash
# Using Python 3
python -m http.server 3000

# Using Node.js (if you have http-server installed)
http-server -p 3000

# Using PHP
php -S localhost:3000
```

Then open `http://localhost:3000` in your browser.

## 💻 Usage

### Basic Usage

The application automatically initializes when the page loads. The **Event Calendar** is set as the default active calendar.

### Navigation

- **Click** on navigation buttons to switch between calendar types
- **Arrow Keys** - Navigate between months
- **Home Key** - Jump to current date
- **Escape Key** - Close inline calendar

### Event Calendar Usage

#### Creating Events
1. Click **"+ Add Event"** button
2. Fill in event details:
   - Event title (required)
   - Date (required)
   - Category: Work, Personal, or Holiday
   - Description (optional)
3. Click **"Save Event"**

#### Viewing Events
1. **Click** on any date with events (indicated by colored dots)
2. **View** event list in the modal
3. **See** event details and categories

#### Editing Events
1. **Click** on a date with events
2. **Click** the edit button (✎) on any event
3. **Modify** event details
4. **Save** changes

#### Deleting Events
1. **Click** on a date with events
2. **Click** the delete button (×) on any event
3. **Confirm** deletion

### Multi-Select Calendar
- **Click** dates to select/deselect
- **View** selected dates in the info panel
- **Click** "Clear All" to reset selection

### Date Range Calendar
- **Click** first date for range start
- **Click** second date for range end
- **View** selected range in the info panel
- **Click** "Clear Range" to reset

## 🛠️ Customization

### Adding a New Calendar Type

1. **Create** a new component file in `/components/`:

```javascript
// components/MyCustomCalendar.js
class MyCustomCalendar extends BaseCalendar {
    constructor(id) {
        super(id);
        // Your custom initialization
    }

    handleCalendarSpecificStyling(dayElement, date) {
        // Your custom day styling logic
    }

    handleDayClick(dayElement, date) {
        // Your custom click handling
    }
}

window.MyCustomCalendar = MyCustomCalendar;
```

2. **Add** the component to `script-modular.js`:

```javascript
const CalendarComponents = {
    // ... existing components
    'mycustom': MyCustomCalendar
};
```

3. **Add** HTML structure to `index.html`
4. **Add** CSS styles to `styles.css`
5. **Add** navigation button

### Styling Customization

All styles are contained in `styles.css`. Each calendar type has its own CSS classes:

```css
/* Example: Customizing the modern calendar */
.modern-calendar {
    background: your-color;
    border: your-border;
}

.modern-days .day:hover {
    background: your-hover-color;
}
```

### Event Categories

To add new event categories, modify the `EventCalendar.js`:

1. **Add** the category to form options in HTML
2. **Add** corresponding CSS styles:

```css
.event-dot.yourcategory {
    background: your-category-color;
}
```


## 🔧 Technical Details

### Architecture

The project uses a **modular object-oriented architecture**:

- **BaseCalendar**: Abstract base class with common functionality
- **Specialized Calendars**: Each calendar type extends BaseCalendar
- **Component Registration**: Dynamic component loading and initialization
- **Event-Driven**: Uses DOM events for user interactions

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Extend `BaseCalendar` for new calendar types
- Add comprehensive CSS for new components
- Test across different browsers
- Update this README if needed


