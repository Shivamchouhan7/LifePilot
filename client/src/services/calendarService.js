import { createStorageService } from './storageService';
import { taskService } from './taskService';
import { applicationService } from './applicationService';
import { projectService } from './projectService';
import { addMinutes } from 'date-fns';

const standaloneEventsService = createStorageService('events');

function timedEvent(event, date) {
  const start = new Date(date);
  return {
    ...event,
    start,
    end: addMinutes(start, 30),
  };
}

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
        events.push(timedEvent({
          id: `task_${t.id}`,
          title: `Task: ${t.title}`,
          type: 'event-task',
          entityType: 'task',
          entityId: t.id,
          priority: t.priority,
          status: t.status,
        }, t.dueAt));
      }
    });

    // 2. Application dates (interviewAt, assessmentAt, followUpDate)
    applications.forEach((app) => {
      if (app.interviewAt) {
        events.push(timedEvent({
          id: `app_interview_${app.id}`,
          title: `Interview: ${app.company} (${app.jobTitle})`,
          type: 'event-interview',
          entityType: 'application',
          entityId: app.id,
        }, app.interviewAt));
      }
      if (app.assessmentAt) {
        events.push(timedEvent({
          id: `app_assessment_${app.id}`,
          title: `Assessment: ${app.company}`,
          type: 'event-assessment',
          entityType: 'application',
          entityId: app.id,
        }, app.assessmentAt));
      }
      if (app.followUpDate) {
        events.push(timedEvent({
          id: `app_followup_${app.id}`,
          title: `Follow-up: ${app.company}`,
          type: 'event-followup',
          entityType: 'application',
          entityId: app.id,
        }, app.followUpDate));
      }
    });

    // 3. Project deadlines and milestones
    projects.forEach((proj) => {
      if (proj.targetDate) {
        events.push(timedEvent({
          id: `proj_deadline_${proj.id}`,
          title: `Project Target: ${proj.name}`,
          type: 'event-deadline',
          entityType: 'project',
          entityId: proj.id,
        }, proj.targetDate));
      }
      (proj.milestones || []).forEach((m) => {
        if (m.dueDate) {
          events.push(timedEvent({
            id: `proj_m_${m.id}`,
            title: `Milestone: ${proj.name} - ${m.title}`,
            type: 'event-deadline',
            entityType: 'project',
            entityId: proj.id,
          }, m.dueDate));
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
