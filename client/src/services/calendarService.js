import { createStorageService } from './storageService';
import { taskService } from './taskService';
import { applicationService } from './applicationService';
import { projectService } from './projectService';

const standaloneEventsService = createStorageService('events');

export const calendarService = {
  async getEvents(range = {}) {
    const { start, end } = range;
    const [tasks, applications, projects, standalone] = await Promise.all([
      taskService.getAll(),
      applicationService.getAll(),
      projectService.getAll(),
      standaloneEventsService.getAll(),
    ]);

    const events = [];

    // 1. Task due dates
    tasks.forEach((t) => {
      if (t.dueAt) {
        events.push({
          id: `task_${t.id}`,
          title: `Task: ${t.title}`,
          start: new Date(t.dueAt),
          end: new Date(t.dueAt),
          type: 'event-task',
          entityType: 'task',
          entityId: t.id,
          priority: t.priority,
          status: t.status,
        });
      }
    });

    // 2. Application dates (interviewAt, assessmentAt, followUpDate)
    applications.forEach((app) => {
      if (app.interviewAt) {
        events.push({
          id: `app_interview_${app.id}`,
          title: `Interview: ${app.company} (${app.jobTitle})`,
          start: new Date(app.interviewAt),
          end: new Date(app.interviewAt),
          type: 'event-interview',
          entityType: 'application',
          entityId: app.id,
        });
      }
      if (app.assessmentAt) {
        events.push({
          id: `app_assessment_${app.id}`,
          title: `Assessment: ${app.company}`,
          start: new Date(app.assessmentAt),
          end: new Date(app.assessmentAt),
          type: 'event-assessment',
          entityType: 'application',
          entityId: app.id,
        });
      }
      if (app.followUpDate) {
        events.push({
          id: `app_followup_${app.id}`,
          title: `Follow-up: ${app.company}`,
          start: new Date(app.followUpDate),
          end: new Date(app.followUpDate),
          type: 'event-followup',
          entityType: 'application',
          entityId: app.id,
        });
      }
    });

    // 3. Project deadlines and milestones
    projects.forEach((proj) => {
      if (proj.targetDate) {
        events.push({
          id: `proj_deadline_${proj.id}`,
          title: `Project Target: ${proj.name}`,
          start: new Date(proj.targetDate),
          end: new Date(proj.targetDate),
          type: 'event-deadline',
          entityType: 'project',
          entityId: proj.id,
        });
      }
      (proj.milestones || []).forEach((m) => {
        if (m.dueDate) {
          events.push({
            id: `proj_m_${m.id}`,
            title: `Milestone: ${proj.name} - ${m.title}`,
            start: new Date(m.dueDate),
            end: new Date(m.dueDate),
            type: 'event-deadline',
            entityType: 'project',
            entityId: proj.id,
          });
        }
      });
    });

    // 4. Standalone events
    standalone.forEach((evt) => {
      events.push({
        ...evt,
        start: new Date(evt.start),
        end: new Date(evt.end || evt.start),
        type: evt.type || 'event-task',
        isStandalone: true,
      });
    });

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return events.filter((e) => e.start >= startDate && e.start <= endDate);
    }

    return events;
  },

  async getAll(params) {
    return this.getEvents(params);
  },

  async getById(id) {
    return standaloneEventsService.getById(id);
  },

  async create(payload) {
    return standaloneEventsService.create(payload);
  },

  async update(id, payload) {
    return standaloneEventsService.update(id, payload);
  },

  async remove(id) {
    return standaloneEventsService.remove(id);
  },
};
