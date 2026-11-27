import React from 'react';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';

export function FieldError({ error }) {
  return error ? <span className="mt-1 block text-xs text-danger">{error.message}</span> : null;
}

export function ApplicationRecruiterFields({ register, errors }) {
  return (
    <>
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
    </>
  );
}
