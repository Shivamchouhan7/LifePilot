import { createStorageService } from './storageService';

const baseService = createStorageService('notes');

export const noteService = {
  async getAll(params) {
    return baseService.getAll(params);
  },

  async getById(id) {
    return baseService.getById(id);
  },

  async create(payload) {
    const note = {
      title: payload.title,
      body: payload.body || '',
      category: payload.category || 'General',
      tags: payload.tags || [],
      pinned: !!payload.pinned,
      type: payload.type || 'note',
      url: payload.url || '',
    };
    return baseService.create(note);
  },

  async update(id, payload) {
    return baseService.update(id, payload);
  },

  async remove(id) {
    return baseService.remove(id);
  },
};
