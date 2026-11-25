import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Plus, CheckSquare, Briefcase, GraduationCap, FolderGit2, FileText, Lock } from 'lucide-react';

export function QuickAddMenu() {
  const actions = [
    { label: 'New Task', icon: CheckSquare, phase: 'Phase 2' },
    { label: 'New Application', icon: Briefcase, phase: 'Phase 3' },
    { label: 'New Learning Goal', icon: GraduationCap, phase: 'Phase 4' },
    { label: 'New Project', icon: FolderGit2, phase: 'Phase 4' },
    { label: 'New Note', icon: FileText, phase: 'Phase 5' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="gap-1.5 h-9 rounded-lg px-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          aria-label="Quick add new item"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </div>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <DropdownMenuItem
              key={act.label}
              disabled
              className="flex items-center justify-between text-xs py-2 opacity-60 cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{act.label}</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                <Lock className="h-2.5 w-2.5" />
                {act.phase}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
