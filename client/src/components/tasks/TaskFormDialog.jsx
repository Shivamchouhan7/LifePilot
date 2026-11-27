import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Modal } from '../common/Modal';
import { Button } from '../ui/button';
import { taskSchema } from '../../validation/taskSchema';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';
const EMPTY_TASK = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueAt: '',
  category: 'Work',
  tags: [],
  recurring: 'none',
  reminderMinutes: '',
};

function toFormValues(task) {
  if (!task) return EMPTY_TASK;
  return {
    ...EMPTY_TASK,
    ...task,
    dueAt: task.dueAt ? format(new Date(task.dueAt), "yyyy-MM-dd'T'HH:mm") : '',
    tags: task.tags || [],
    recurring: task.recurring || 'none',
    reminderMinutes: task.reminderMinutes ?? '',
  };
}

function FieldError({ error }) {
  return error ? <span className="mt-1 block text-xs text-danger">{error.message}</span> : null;
}

export function TaskFormDialog({ open, onOpenChange, task, onSave, isSaving }) {
  const [saveError, setSaveError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(taskSchema), defaultValues: EMPTY_TASK });

  useEffect(() => {
    if (open) {
      reset(toFormValues(task));
      setSaveError('');
    }
  }, [open, task, reset]);

  const save = async (values) => {
    setSaveError('');
    try {
      await onSave({
        ...values,
        dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : null,
        recurring: values.recurring === 'none' ? null : values.recurring,
        reminderMinutes: values.reminderMinutes ?? null,
      });
    } catch (error) {
      setSaveError(error.message || 'The task could not be saved.');
    }
  };

  const tags = watch('tags');
  const dueAtError = errors.dueAt;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={task ? 'Edit task' : 'New task'}
      description="Add details, set a due date, and choose a recurrence schedule."
      className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit(save)} noValidate>
        <label className="block text-sm font-medium">
          Title
          <input className={fieldClass} maxLength={120} autoFocus {...register('title')} />
          <FieldError error={errors.title} />
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea className={fieldClass} rows="3" maxLength={2000} {...register('description')} />
          <FieldError error={errors.description} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Priority
            <select className={fieldClass} {...register('priority')}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <FieldError error={errors.priority} />
          </label>
          <label className="block text-sm font-medium">
            Status
            <select className={fieldClass} {...register('status')}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <FieldError error={errors.status} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Due date and time
            <input className={fieldClass} type="datetime-local" {...register('dueAt')} />
            <FieldError error={dueAtError} />
          </label>
          <label className="block text-sm font-medium">
            Recurrence
            <select className={fieldClass} {...register('recurring')}>
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <FieldError error={errors.recurring} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Category
            <input className={fieldClass} {...register('category')} />
            <FieldError error={errors.category} />
          </label>
          <label className="block text-sm font-medium">
            Reminder (minutes before)
            <input className={fieldClass} type="number" min="0" {...register('reminderMinutes')} />
            <FieldError error={errors.reminderMinutes} />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Tags <span className="font-normal text-muted-foreground">(comma separated)</span>
          <input
            className={fieldClass}
            value={(tags || []).join(', ')}
            onChange={(event) => setValue(
              'tags',
              event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
              { shouldValidate: true }
            )}
          />
          <FieldError error={errors.tags} />
        </label>
        {saveError && <p className="text-sm text-danger" role="alert">{saveError}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : task ? 'Save changes' : 'Create task'}</Button>
        </div>
      </form>
    </Modal>
  );
}
