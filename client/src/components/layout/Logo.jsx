import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ collapsed = false, className = '' }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 outline-none select-none ${className}`}
      aria-label="LifePilot Home"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md shadow-primary/20 shrink-0">
        <Compass className="h-5 w-5 stroke-[2]" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-lg text-foreground leading-none">
            LifePilot
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
            OS
          </span>
        </div>
      )}
    </Link>
  );
}
