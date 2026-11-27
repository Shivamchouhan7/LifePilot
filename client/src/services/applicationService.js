import { createStorageService } from './storageService';

const baseService = createStorageService('applications');
const updateQueues = new Map();

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

    return baseService.create({
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
    });
  },

  async update(id, payload) {
    const previous = updateQueues.get(id) || Promise.resolve();
    const operation = previous.catch(() => undefined).then(async () => {
      const existing = await baseService.getById(id);
      const { statusNote, ...applicationPayload } = payload;
      delete applicationPayload.statusHistory;
      const updatedPayload = { ...applicationPayload };

      if (payload.status && payload.status !== existing.status) {
        updatedPayload.statusHistory = [
          ...(existing.statusHistory || []),
          {
            status: payload.status,
            at: new Date().toISOString(),
            note: statusNote || `Status updated to ${payload.status}`,
          },
        ];
      }

      return baseService.update(id, updatedPayload);
    });
    updateQueues.set(id, operation);

    try {
      return await operation;
    } finally {
      if (updateQueues.get(id) === operation) updateQueues.delete(id);
    }
  },

  async remove(id) {
    return baseService.remove(id);
  },
};
