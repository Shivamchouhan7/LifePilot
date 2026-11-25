import { createStorageService } from './storageService';

const baseService = createStorageService('settings');

const DEFAULT_SETTINGS = {
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

export const settingsService = {
  async getAll() {
    const list = await baseService.getAll();
    const saved = list[0] || {};
    return {
      ...DEFAULT_SETTINGS,
      ...saved,
      profile: { ...DEFAULT_SETTINGS.profile, ...(saved.profile || {}) },
    };
  },

  async getById() {
    return this.getAll();
  },

  async create(payload) {
    const existing = await baseService.getAll();
    if (existing.length) {
      return this.update(existing[0].id, payload);
    }
    return baseService.create({
      ...DEFAULT_SETTINGS,
      ...payload,
      profile: { ...DEFAULT_SETTINGS.profile, ...(payload.profile || {}) },
    });
  },

  async update(id, payload) {
    const existing = await baseService.getAll();
    if (!existing.length) {
      return baseService.create({
        ...DEFAULT_SETTINGS,
        ...payload,
        profile: { ...DEFAULT_SETTINGS.profile, ...(payload.profile || {}) },
      });
    }
    const current = existing[0];
    return baseService.update(current.id, {
      ...payload,
      profile: { ...DEFAULT_SETTINGS.profile, ...(current.profile || {}), ...(payload.profile || {}) },
    });
  },

  async remove() {
    return { success: false, message: 'Settings cannot be removed' };
  },
};
