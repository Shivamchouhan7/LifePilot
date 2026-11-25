import { createStorageService } from './storageService';

const baseService = createStorageService('applications');

export const applicationService = {
  async getAll(params) {
    return baseService.getAll(params);
  },

  async getById(id) {
    return baseService.getById(id);
  },

  async create(payload) {
    const now = new Date().toISOString();
    const initialStatus = payload.status || 'interested';
    const statusHistory = payload.statusHistory || [
      { status: initialStatus, at: now, note: 'Initial application entry' },
    ];

    const application = {
      company: payload.company,
      jobTitle: payload.jobTitle,
      jobType: payload.jobType || 'full_time',
      source: payload.source || 'LinkedIn',
      url: payload.url || '',
      appliedDate: payload.appliedDate || now,
      status: initialStatus,
      recruiterName: payload.recruiterName || '',
      recruiterEmail: payload.recruiterEmail || '',
      description: payload.description || '',
      skills: payload.skills || [],
      salary: payload.salary || '',
      location: payload.location || '',
      followUpDate: payload.followUpDate || null,
      interviewAt: payload.interviewAt || null,
      assessmentAt: payload.assessmentAt || null,
      notes: payload.notes || '',
      statusHistory,
    };
    return baseService.create(application);
  },

  async update(id, payload) {
    const existing = await baseService.getById(id);
    const updatedPayload = { ...payload };

    if (payload.status && payload.status !== existing.status) {
      const historyEntry = {
        status: payload.status,
        at: new Date().toISOString(),
        note: payload.statusNote || `Status updated to ${payload.status}`,
      };
      updatedPayload.statusHistory = [
        ...(existing.statusHistory || []),
        historyEntry,
      ];
    }

    return baseService.update(id, updatedPayload);
  },

  async remove(id) {
    return baseService.remove(id);
  },
};
