import type { Step } from 'react-joyride';

export const tourSteps: Step[] = [
  {
    target: '[data-tour="sidebar"]',
    content: 'Navigate between different modules — Dashboard, Orders, Kitchen, Inventory, Payments, Reports, and Users.',
    title: '📍 Navigation Sidebar',
    placement: 'right',
  },
  {
    target: '[data-tour="dashboard-stats"]',
    content: "Quick overview of today's revenue, total orders, active orders, and average order value.",
    title: '📊 Dashboard Widgets',
    placement: 'bottom',
  },
  {
    target: '[data-tour="header-search"]',
    content: 'Use the search bar to quickly find what you need across the application.',
    title: '🔍 Quick Search',
    placement: 'bottom',
  },
  {
    target: '[data-tour="theme-switcher"]',
    content: 'Switch between Light, Dark, or System theme modes. Use arrow keys for quick switching.',
    title: '🎨 Theme Switcher',
    placement: 'bottom',
  },
  {
    target: '[data-tour="header-notifications"]',
    content: 'See active order notifications at a glance. The badge shows pending orders count.',
    title: '🔔 Notifications',
    placement: 'bottom',
  },
  {
    target: '[data-tour="header-logout"]',
    content: 'Click here to securely log out of the system.',
    title: '🚪 Logout',
    placement: 'bottom',
  },
];
