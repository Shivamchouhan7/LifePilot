import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isValid } from 'date-fns';
import { X } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../constants/status';
import { applicationSchema } from '../../validation/applicationSchema';
import { ApplicationSkillsField } from './ApplicationSkillsField';
import { Modal } from '../common/Modal';
import { Button } from '../ui/button';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';

function formattedValue(value, pattern) {
  if (!value) return '';
  const date = new Date(value);
  return isValid(date) ? format(date, pattern) : '';
}

function defaultValues(application) {
  return {
    company: application?.company || '',
    jobTitle: application?.jobTitle || '',
    jobType: 'full_time',
    source: application?.source || 'LinkedIn',
    url: application?.url || '',
    appliedDate: formattedValue(application?.appliedDate, 'yyyy-MM-dd') || format(new Date(), 'yyyy-MM-dd'),
    status: application?.status || 'interested',
    recruiterName: application?.recruiterName || '',
    recruiterEmail: application?.recruiterEmail || '',
    description: application?.description || '',
    skills: application?.skills || [],
    salary: application?.salary || '',
    location: application?.location || '',
    followUpDate: formattedValue(application?.followUpDate, 'yyyy-MM-dd'),
    interviewAt: formattedValue(application?.interviewAt, "yyyy-MM-dd'T'HH:mm"),
    assessmentAt: formattedValue(application?.assessmentAt, "yyyy-MM-dd'T'HH:mm"),
    notes: application?.notes || '',
  };
}

function FieldError({ error }) {
  return error ? <span className="mt-1 block text-xs text-danger">{error.message}</span> : null;
}

function toPayload(values) {
  return {
    ...values,
    appliedDate: new Date(values.appliedDate).toISOString(),
    followUpDate: values.followUpDate ? new Date(values.followUpDate).toISOString() : null,
    interviewAt: values.interviewAt ? new Date(values.interviewAt).toISOString() : null,
    assessmentAt: values.assessmentAt ? new Date(values.assessmentAt).toISOString() : null,
    skills: values.skills.map((skill) => skill.trim()).filter(Boolean),
  };
}

export function ApplicationFormDialog({ open, onOpenChange, application, onSave, isSaving }) {
  const [saveError, setSaveError] = useState('');
  const [skillDraft, setSkillDraft] = useState('');
  const [skillMessage, setSkillMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(applicationSchema), defaultValues: defaultValues(null) });
  const skills = watch('skills');
  const appliedDate = watch('appliedDate');

  useEffect(() => {
    if (open) {
      reset(defaultValues(application));
      setSaveError('');
      setSkillDraft('');
      setSkillMessage('');
    }
  }, [open, application, reset]);

  const addSkills = (values) => {
    const nextSkills = [...skills];
    let message = '';

    values.forEach((value) => {
      const skill = value.trim();
      if (!skill) return;

      if (nextSkills.some((existing) => existing.toLocaleLowerCase() === skill.toLocaleLowerCase())) {
        message = `${skill} is already added.`;
        return;
      }

      if (nextSkills.length >= 20) {
        message = 'You can add up to 20 skills. Remove one before adding another.';
        return;
      }

      nextSkills.push(skill);
    });

    if (nextSkills.length !== skills.length) {
      setValue('skills', nextSkills, { shouldDirty: true, shouldValidate: true });
    }
    setSkillMessage(message);
  };

  const addSkill = (value) => {
    addSkills([value]);
    setSkillDraft('');
  };

  const updateSkillDraft = (value) => {
    const parts = value.split(',');
    const remainder = parts.pop();
    if (parts.length) addSkills(parts);
    setSkillDraft(remainder);
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addSkill(skillDraft);
    } else if (event.key === 'Backspace' && !skillDraft && skills.length) {
      setValue('skills', skills.slice(0, -1), { shouldDirty: true, shouldValidate: true });
      setSkillMessage('');
    }
  };

  const save = async (values) => {
    setSaveError('');
    try {
      await onSave(toPayload(values));
    } catch (error) {
      setSaveError(error.message || 'The application could not be saved.');
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={application ? 'Edit application' : 'New application'}
      description="Track the role, recruiter, dates, and notes for this opportunity."
      className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit(save)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Company
            <input className={fieldClass} maxLength={150} autoFocus {...register('company')} />
            <FieldError error={errors.company} />
          </label>
          <label className="block text-sm font-medium">
            Job title
            <input className={fieldClass} maxLength={150} {...register('jobTitle')} />
            <FieldError error={errors.jobTitle} />
          </label>
          <label className="block text-sm font-medium">
            Job type
            <select className={fieldClass} {...register('jobType')}>
              <option value="full_time">Full-time</option>
            </select>
            <FieldError error={errors.jobType} />
          </label>
          <label className="block text-sm font-medium">
            Source
            <input className={fieldClass} maxLength={100} {...register('source')} />
            <FieldError error={errors.source} />
          </label>
          <label className="block text-sm font-medium">
            Job posting URL
            <input className={fieldClass} type="url" maxLength={2000} {...register('url')} />
            <FieldError error={errors.url} />
          </label>
          <label className="block text-sm font-medium">
            Applied date
            <input className={fieldClass} type="date" {...register('appliedDate')} />
            <FieldError error={errors.appliedDate} />
          </label>
          <label className="block text-sm font-medium">
            Status
            <select className={fieldClass} {...register('status')}>
              {Object.entries(APPLICATION_STATUSES).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>
            <FieldError error={errors.status} />
          </label>
          <label className="block text-sm font-medium">
            Location
            <input className={fieldClass} maxLength={150} {...register('location')} />
            <FieldError error={errors.location} />
          </label>
          <label className="block text-sm font-medium">
            Salary / stipend
            <input className={fieldClass} maxLength={150} {...register('salary')} />
            <FieldError error={errors.salary} />
          </label>
          <label className="block text-sm font-medium">
            Follow-up date
            <input className={fieldClass} type="date" {...register('followUpDate')} />
            <FieldError error={errors.followUpDate} />
          </label>
          <label className="block text-sm font-medium">
            Interview date and time
            <input className={fieldClass} type="datetime-local" min={appliedDate ? `${appliedDate}T00:00` : undefined} {...register('interviewAt')} />
            <FieldError error={errors.interviewAt} />
          </label>
          <label className="block text-sm font-medium">
            Assessment date and time
            <input className={fieldClass} type="datetime-local" min={appliedDate ? `${appliedDate}T00:00` : undefined} {...register('assessmentAt')} />
            <FieldError error={errors.assessmentAt} />
          </label>
          <label className="block text-sm font-medium">
            Recruiter name
            <input className={fieldClass} maxLength={100} {...register('recruiterName')} />
            <FieldError error={errors.recruiterName} />
          </label>
          <label className="block text-sm font-medium">
            Recruiter email
            <input className={fieldClass} type="email" maxLength={254} {...register('recruiterEmail')} />
            <FieldError error={errors.recruiterEmail} />
          </label>
        </div>
        <ApplicationSkillsField
          skills={skills}
          draft={skillDraft}
          message={skillMessage}
          error={errors.skills?.message}
          onDraftChange={updateSkillDraft}
          onKeyDown={handleSkillKeyDown}
          onRemove={(skill) => {
            setValue('skills', skills.filter((item) => item !== skill), { shouldDirty: true, shouldValidate: true });
            setSkillMessage('');
          }}
        />
        <label className="block text-sm font-medium">
          Job description
          <textarea className={fieldClass} rows="3" maxLength={5000} {...register('description')} />
          <FieldError error={errors.description} />
        </label>
        <label className="block text-sm font-medium">
          Notes
          <textarea className={fieldClass} rows="3" maxLength={5000} {...register('notes')} />
          <FieldError error={errors.notes} />
        </label>
        {saveError && <p className="text-sm text-danger" role="alert">{saveError}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : application ? 'Save changes' : 'Create application'}</Button>
        </div>
      </form>
    </Modal>
  );
}
