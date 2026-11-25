import { createStorageService } from './storageService';

const baseService = createStorageService('settings');

const DEFAULT_SETTINGS = {
  id: 'current_settings',
  profile: {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'Full Stack Engineer',
    avatar: '',
  },
  theme: 'dark',
  notifications: true,
  dateFormat: 'MMM d, yyyy',
  timeFormat: '12h',
  defaultTaskPriority: 'medium',
};

export const settingsService = {
  async getAll() {
    const list = await baseService.getAll();
    return list.length ? list[0] : DEFAULT_SETTINGS;
  },

  async getById() {
    return this.getAll();
  },

  async create(payload) {
    const existing = await baseService.getAll();
    if (existing.length) {
      return baseService.update(existing[0].id, payload);
    }
    return baseService.create({ ...DEFAULT_SETTINGS, ...payload });
  },

  async update(id, payload) {
    const existing = await baseService.getAll();
    if (!existing.length) {
      return baseService.create({ ...DEFAULT_SETTINGS, ...payload });
    }
    return baseService.update(existing[0].id, payload);
  },

  async remove() {
    return { success: false, message: 'Settings cannot be removed' };
  },
};
