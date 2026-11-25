import { createStorageService } from './storageService';

const baseService = createStorageService('learning');

function computeProgress(lessons = []) {
  if (!lessons.length) return 0;
  const doneCount = lessons.filter((l) => l.done).length;
  return Math.round((doneCount / lessons.length) * 100);
}

export const learningService = {
  async getAll(params) {
    const items = await baseService.getAll(params);
    return items.map((item) => ({
      ...item,
      progress: computeProgress(item.lessons),
    }));
  },

  async getById(id) {
    const item = await baseService.getById(id);
    return {
      ...item,
      progress: computeProgress(item.lessons),
    };
  },

  async create(payload) {
    const cleanPayload = { ...payload };
    delete cleanPayload.progress;
    const goal = {
      skill: cleanPayload.skill,
      category: cleanPayload.category || 'Engineering',
      topics: cleanPayload.topics || [],
      lessons: cleanPayload.lessons || [],
      resources: cleanPayload.resources || [],
      nextRevisionDate: cleanPayload.nextRevisionDate || null,
    };
    const created = await baseService.create(goal);
    return { ...created, progress: computeProgress(created.lessons) };
  },

  async update(id, payload) {
    const cleanPayload = { ...payload };
    delete cleanPayload.progress;
    const updated = await baseService.update(id, cleanPayload);
    return { ...updated, progress: computeProgress(updated.lessons) };
  },

  async remove(id) {
    return baseService.remove(id);
  },
};
