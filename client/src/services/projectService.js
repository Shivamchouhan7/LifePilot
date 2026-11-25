import { createStorageService } from './storageService';

const baseService = createStorageService('projects');

export const projectService = {
  async getAll(params) {
    return baseService.getAll(params);
  },

  async getById(id) {
    return baseService.getById(id);
  },

  async create(payload) {
    const project = {
      name: payload.name,
      description: payload.description || '',
      techStack: payload.techStack || [],
      repoUrl: payload.repoUrl || '',
      liveUrl: payload.liveUrl || '',
      status: payload.status || 'active',
      startDate: payload.startDate || new Date().toISOString(),
      targetDate: payload.targetDate || null,
      milestones: payload.milestones || [],
      notes: payload.notes || '',
    };
    return baseService.create(project);
  },

  async update(id, payload) {
    return baseService.update(id, payload);
  },

  async remove(id) {
    return baseService.remove(id);
  },
};
