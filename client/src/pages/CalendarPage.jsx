import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { addMinutes, format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { useCalendarEvents, useCreateCalendarEvent, useUpdateCalendarEvent, useDeleteCalendarEvent } from '../hooks/useCalendarEvents';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import './calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

const EVENT_TYPES = [
  { value: 'event-task', label: 'Task' },
  { value: 'event-interview', label: 'Interview' },
  { value: 'event-assessment', label: 'Assessment' },
  { value: 'event-followup', label: 'Follow-up' },
  { value: 'event-deadline', label: 'Project deadline' },
];

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';

function toLocalDateTimeInput(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function startTime(date) {
  const start = new Date(date);
  if (start.getHours() === 0 && start.getMinutes() === 0) start.setHours(9);
  return start;
}

function eventLabel(type) {
  return EVENT_TYPES.find((option) => option.value === type)?.label || 'Calendar event';
}

export function CalendarPage() {
  const { data: events = [], isLoading, isError, error, refetch } = useCalendarEvents();
  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [form, setForm] = useState(() => {
    const start = startTime(new Date());
    return {
      title: '',
      type: 'event-task',
      start: toLocalDateTimeInput(start),
      end: toLocalDateTimeInput(addMinutes(start, 30)),
    };
  });

  const openNewEvent = (slotDate = new Date()) => {
    const start = startTime(slotDate);
    setSelectedEvent(null);
    setValidationError('');
    setForm({
      title: '',
      type: 'event-task',
      start: toLocalDateTimeInput(start),
      end: toLocalDateTimeInput(addMinutes(start, 30)),
    });
    setFormOpen(true);
  };

  const updateForm = (key) => (event) => {
    setValidationError('');
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const saveEvent = (event) => {
    event.preventDefault();
    const start = new Date(form.start);
    const end = new Date(form.end);
    if (end <= start) {
      setValidationError('The end time must be later than the start time.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      start: start.toISOString(),
      end: end.toISOString(),
    };
    const options = {
      onSuccess: () => {
        setFormOpen(false);
        setSelectedEvent(null);
      },
    };
    if (selectedEvent?.isStandalone) {
      updateEvent.mutate({ id: selectedEvent.id, payload }, options);
    } else {
      createEvent.mutate(payload, options);
    }
  };

  const editSelectedEvent = () => {
    if (!selectedEvent?.isStandalone) return;
    setForm({
      title: selectedEvent.title,
      type: selectedEvent.type || 'event-task',
      start: toLocalDateTimeInput(new Date(selectedEvent.start)),
      end: toLocalDateTimeInput(new Date(selectedEvent.end || selectedEvent.start)),
    });
    setValidationError('');
    setFormOpen(true);
  };

  const removeSelectedEvent = () => {
    deleteEvent.mutate(selectedEvent.id, {
      onSuccess: () => {
        setSelectedEvent(null);
        setDeleteConfirmOpen(false);
      },
    });
  };

  const eventPropGetter = (event) => ({
    className: event.type || 'event-task',
  });

  const saving = createEvent.isPending || updateEvent.isPending;
  const mutationError = createEvent.error || updateEvent.error || deleteEvent.error;

  return (
    <div>
      <PageHeader
        title="Calendar"
        breadcrumbs={[{ label: 'Calendar' }]}
        description="See task deadlines, interviews, assessments, follow-ups, project milestones, and personal events."
        actions={<Button onClick={() => openNewEvent()}><Plus className="mr-2 h-4 w-4" />New event</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-2" aria-label="Calendar event legend">
        {EVENT_TYPES.map((eventType) => (
          <Badge key={eventType.value} variant="outline" className={`calendar-legend ${eventType.value}`}>
            <span className="mr-2 h-2 w-2 rounded-full bg-current" />
            {eventType.label}
          </Badge>
        ))}
      </div>

      {isError ? (
        <ErrorState description={error?.message} onRetry={refetch} />
      ) : (
        <section className="calendar-shell rounded-xl border border-border bg-card p-3 shadow-sm sm:p-5" aria-label="Schedule calendar">
          {isLoading ? (
            <div className="flex min-h-[520px] items-center justify-center text-sm text-muted-foreground">Loading your calendar…</div>
          ) : (
            <BigCalendar
              localizer={localizer}
              events={events}
              date={date}
              view={view}
              onNavigate={setDate}
              onView={setView}
              views={['month', 'week', 'day', 'agenda']}
              selectable
              onSelectSlot={(slot) => openNewEvent(slot.start)}
              onSelectEvent={setSelectedEvent}
              eventPropGetter={eventPropGetter}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              tooltipAccessor="title"
              popup
              style={{ height: 'min(72vh, 760px)', minHeight: 520 }}
              messages={{ noEventsInRange: 'No events in this date range.' }}
            />
          )}
        </section>
      )}

      {mutationError && <p role="alert" className="mt-4 text-sm text-danger">{mutationError.message}</p>}

      <Modal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedEvent?.isStandalone ? 'Edit event' : 'New event'}
        description="Personal events appear alongside your tasks, applications, and project dates."
      >
        <form className="space-y-4" onSubmit={saveEvent}>
          <label className="block text-sm font-medium">
            Event title
            <input className={fieldClass} value={form.title} onChange={updateForm('title')} required maxLength={120} autoFocus />
          </label>
          <label className="block text-sm font-medium">
            Event type
            <select className={fieldClass} value={form.type} onChange={updateForm('type')}>
              {EVENT_TYPES.map((eventType) => <option key={eventType.value} value={eventType.value}>{eventType.label}</option>)}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Starts
              <input className={fieldClass} type="datetime-local" value={form.start} onChange={updateForm('start')} required />
            </label>
            <label className="block text-sm font-medium">
              Ends
              <input className={fieldClass} type="datetime-local" value={form.end} onChange={updateForm('end')} required min={form.start} />
            </label>
          </div>
          {validationError && <p role="alert" className="text-sm text-danger">{validationError}</p>}
          {(createEvent.isError || updateEvent.isError) && (
            <p role="alert" className="text-sm text-danger">{(createEvent.error || updateEvent.error).message}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : selectedEvent?.isStandalone ? 'Save changes' : 'Create event'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!selectedEvent && !formOpen && !deleteConfirmOpen}
        onOpenChange={(open) => { if (!open) setSelectedEvent(null); }}
        title={selectedEvent?.title || 'Calendar event'}
        description={selectedEvent ? `${format(new Date(selectedEvent.start), 'EEEE, MMMM d, yyyy · h:mm a')}${selectedEvent.end ? ` – ${format(new Date(selectedEvent.end), 'h:mm a')}` : ''}` : ''}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{eventLabel(selectedEvent.type)}</span>
              {!selectedEvent.isStandalone && <span>· Linked to {selectedEvent.entityType}</span>}
            </div>
            {selectedEvent.isStandalone ? (
              <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                <Button onClick={editSelectedEvent}>Edit event</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">This date is synced from your {selectedEvent.entityType} workspace.</p>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete calendar event?"
        description={`“${selectedEvent?.title || ''}” will be removed from your calendar.`}
        confirmText="Delete event"
        isLoading={deleteEvent.isPending}
        onConfirm={removeSelectedEvent}
      />
    </div>
  );
}
