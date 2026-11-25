export function generateSettingsSeed() {
  return {
    id: 'current_settings',
    profile: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'Staff Frontend Engineer',
      avatar: '',
    },
    theme: 'dark',
    notifications: true,
    dateFormat: 'MMM d, yyyy',
    timeFormat: '12h',
    defaultTaskPriority: 'medium',
  };
}
