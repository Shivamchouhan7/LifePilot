import { storage } from '../utils/storage';

const delay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 150) + 150));

export function createStorageService(entityKey) {
  return {
    async getAll(filterFn) {
      await delay();
      const list = storage.get(entityKey, []);
      if (typeof filterFn === 'function') {
        return list.filter(filterFn);
      }
      return [...list];
    },

    async getById(id) {
      await delay();
      const list = storage.get(entityKey, []);
      const item = list.find((it) => it.id === id);
      if (!item) {
        throw new Error(`${entityKey} item not found: ${id}`);
      }
      return { ...item };
    },

    async create(payload) {
      await delay();
      const list = storage.get(entityKey, []);
      const now = new Date().toISOString();
      const newItem = {
        ...payload,
        id: payload.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
        createdAt: payload.createdAt || now,
        updatedAt: now,
      };
      const updated = [newItem, ...list];
      storage.set(entityKey, updated);
      return { ...newItem };
    },

    async update(id, payload) {
      await delay();
      const list = storage.get(entityKey, []);
      const index = list.findIndex((it) => it.id === id);
      if (index === -1) {
        throw new Error(`${entityKey} item not found: ${id}`);
      }
      const existing = list[index];
      const now = new Date().toISOString();
      const updatedItem = {
        ...existing,
        ...payload,
        id,
        createdAt: existing.createdAt,
        updatedAt: now,
      };
      list[index] = updatedItem;
      storage.set(entityKey, list);
      return { ...updatedItem };
    },

    async remove(id) {
      await delay();
      const list = storage.get(entityKey, []);
      const filtered = list.filter((it) => it.id !== id);
      storage.set(entityKey, filtered);
      return { success: true, id };
    },
  };
}
