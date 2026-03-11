# Finance Copilot Frontend

A React-based financial dashboard with AI-powered insights.

## Tech Stack

- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard/         # Dashboard widgets
│   │   │   ├── FinancialHealthScore.jsx
│   │   │   ├── SpendingSummary.jsx
│   │   │   └── BudgetWarnings.jsx
│   │   ├── Chat/              # AI chat interface
│   │   │   └── ChatInterface.jsx
│   │   ├── Charts/            # Chart components
│   │   │   └── SpendingChart.jsx
│   │   ├── Reports/           # Report viewers
│   │   │   └── WeeklyReportViewer.jsx
│   │   └── Layout.jsx         # Main layout wrapper
│   ├── pages/
│   │   ├── Dashboard.jsx      # Main dashboard page
│   │   └── Reports.jsx        # Reports page
│   ├── App.jsx                # Root component with routing
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles (Tailwind)
├── public/                    # Static assets
├── package.json
├── vite.config.js
└── postcss.config.js
```

## Features

### Dashboard
- **Financial Health Score**: Visual 0-100 score with trend indicator
- **Spending Summary**: Monthly overview with budget progress
- **Budget Warnings**: Real-time alerts for budget categories
- **Spending Chart**: Monthly spending comparison (bar chart)
- **AI Chat Interface**: Conversational financial assistant

### Reports
- **Weekly Report Viewer**: Detailed financial summaries
  - Income/Expense breakdown
  - Category-wise spending
  - AI-generated insights
  - Trend analysis

## Component Details

### Dashboard Components
All dashboard components are responsive and include:
- Loading states
- Error handling placeholders
- Consistent styling using Tailwind utility classes
- Mobile-first design

### Charts
- Uses Recharts for responsive, animated charts
- Custom tooltips and styling
- Responsive container for all screen sizes

### AI Chat
- Real-time messaging interface
- Bot and user message distinction
- Smooth animations and transitions
- Auto-scroll to latest messages

## Styling

Tailwind CSS v4 is configured with:
- Custom color scheme (primary, success, warning, danger)
- Responsive breakpoints
- Consistent spacing system
- Focus states for accessibility

## Next Steps

1. **Backend Integration**
   - Connect to API endpoints for real data
   - Implement authentication
   - Add loading and error states

2. **Enhanced Features**
   - User preferences and settings
   - Data export functionality
   - More chart types and visualizations
   - Real-time data updates

3. **Testing**
   - Add unit tests (Jest + React Testing Library)
   - E2E testing (Playwright)
   - Component storybook

4. **Performance**
   - Code splitting for routes
   - Lazy loading for charts
   - Optimize bundle size
