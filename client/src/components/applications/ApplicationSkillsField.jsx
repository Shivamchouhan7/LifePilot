import React from 'react';
import { X } from 'lucide-react';

export function ApplicationSkillsField({ skills, draft, message, error, onDraftChange, onKeyDown, onRemove }) {
  return (
    <div className="block text-sm font-medium">
      Skills <span className="font-normal text-muted-foreground">(comma separated)</span>
      <input
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
        aria-label="Add a skill"
        aria-describedby="application-skills-help"
        placeholder="Type a skill and press Enter or comma"
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill.toLocaleLowerCase()} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            {skill}
            <button
              type="button"
              aria-label={`Remove ${skill}`}
              className="rounded-full hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onRemove(skill)}
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <p id="application-skills-help" className="mt-1 text-xs text-muted-foreground">
        Press Enter or comma to add a skill. Backspace removes the last skill when the field is empty. Maximum 20.
      </p>
      {message && <p className="mt-1 text-xs text-danger" role="status">{message}</p>}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </div>
  );
}
