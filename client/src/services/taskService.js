import { createStorageService } from './storageService';
import { storage } from '../utils/storage';
import { getNextDueDate } from '../utils/taskRecurrence';

const baseService = createStorageService('tasks');
const updateQueues = new Map();

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
    const status = payload.status || 'todo';
    const task = {
      title: payload.title,
      description: payload.description || '',
      priority: payload.priority || defaultPriority,
      status,
      dueAt: payload.dueAt || null,
      category: payload.category || 'Work',
      tags: payload.tags || [],
      recurring: payload.recurring || null,
      completedAt: status === 'completed' ? payload.completedAt || new Date().toISOString() : null,
      projectId: payload.projectId || null,
      reminderMinutes: payload.reminderMinutes ?? null,
    };
    return baseService.create(task);
  },

  async update(id, payload) {
    const previous = updateQueues.get(id) || Promise.resolve();
    const current = previous.catch(() => undefined).then(async () => {
      const existing = await baseService.getById(id);
      const status = payload.status ?? existing.status;
      const isCompletion = existing.status !== 'completed' && status === 'completed';
      const updatedPayload = {
        ...payload,
        status,
        completedAt: status === 'completed'
          ? isCompletion ? new Date().toISOString() : existing.completedAt || null
          : null,
      };
      const updated = await baseService.update(id, updatedPayload);

      const recurring = Object.prototype.hasOwnProperty.call(payload, 'recurring')
        ? payload.recurring
        : existing.recurring;
      const dueAt = payload.dueAt !== undefined ? payload.dueAt : existing.dueAt;
      const nextDueAt = isCompletion ? getNextDueDate(dueAt, recurring) : null;
      if (nextDueAt) {
        const fields = { ...updated };
        delete fields.id;
        delete fields.createdAt;
        delete fields.updatedAt;
        await baseService.create({
          ...fields,
          dueAt: nextDueAt,
          status: 'todo',
          completedAt: null,
        });
      }
      return updated;
    });

    updateQueues.set(id, current);
    try {
      return await current;
    } finally {
      if (updateQueues.get(id) === current) updateQueues.delete(id);
    }
  },

  async remove(id) {
    return baseService.remove(id);
  },
};
