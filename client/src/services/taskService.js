import { createStorageService } from './storageService';
import { storage } from '../utils/storage';

const baseService = createStorageService('tasks');

export const taskService = {
  async getAll(params) {
    return baseService.getAll(params);
  },

  async getById(id) {
    return baseService.getById(id);
  },

  async create(payload) {
    const savedSettings = storage.get('settings', [])[0];
    const configuredPriority = savedSettings?.defaultTaskPriority;
    const defaultPriority = ['high', 'medium', 'low'].includes(configuredPriority)
      ? configuredPriority
      : 'medium';
    const task = {
      title: payload.title,
      description: payload.description || '',
      priority: payload.priority || defaultPriority,
      status: payload.status || 'todo',
      dueAt: payload.dueAt || null,
      category: payload.category || 'Work',
      tags: payload.tags || [],
      recurring: payload.recurring || null,
      completedAt: payload.completedAt || null,
      projectId: payload.projectId || null,
      reminderMinutes: payload.reminderMinutes || null,
    };
    return baseService.create(task);
  },

  async update(id, payload) {
    return baseService.update(id, payload);
  },

  async remove(id) {
    return baseService.remove(id);
  },
};
