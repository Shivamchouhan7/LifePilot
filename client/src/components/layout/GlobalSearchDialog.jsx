import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '../ui/dialog';
import { Search, CheckSquare, Briefcase, FolderGit2, FileText, ArrowRight } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useApplications } from '../../hooks/useApplications';
import { useProjects } from '../../hooks/useProjects';
import { useNotes } from '../../hooks/useNotes';

export function GlobalSearchDialog({ open, onOpenChange }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data: tasks = [] } = useTasks();
  const { data: applications = [] } = useApplications();
  const { data: projects = [] } = useProjects();
  const { data: notes = [] } = useNotes();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches = [];

    tasks.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
      ) {
        matches.push({
          id: `task_${t.id}`,
          title: t.title,
          subtitle: `${t.category} • Priority: ${t.priority}`,
          icon: CheckSquare,
          category: 'Tasks',
          path: '/tasks',
        });
      }
    });

    applications.forEach((app) => {
      if (
        app.company.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q) ||
        (app.skills && app.skills.some((s) => s.toLowerCase().includes(q)))
      ) {
        matches.push({
          id: `app_${app.id}`,
          title: `${app.company} — ${app.jobTitle}`,
          subtitle: `Status: ${app.status} • Location: ${app.location}`,
          icon: Briefcase,
          category: 'Applications',
          path: `/applications/${app.id}`,
        });
      }
    });

    projects.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      ) {
        matches.push({
          id: `proj_${p.id}`,
          title: p.name,
          subtitle: `${p.status} • ${(p.techStack || []).slice(0, 3).join(', ')}`,
          icon: FolderGit2,
          category: 'Projects',
          path: `/projects/${p.id}`,
        });
      }
    });

    notes.forEach((n) => {
      if (
        n.title.toLowerCase().includes(q) ||
        (n.body && n.body.toLowerCase().includes(q))
      ) {
        matches.push({
          id: `note_${n.id}`,
          title: n.title,
          subtitle: `Category: ${n.category}`,
          icon: FileText,
          category: 'Notes',
          path: '/notes',
        });
      }
    });

    return matches.slice(0, 10);
  }, [query, tasks, applications, projects, notes]);

  const handleSelect = (path) => {
    onOpenChange(false);
    setQuery('');
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xl overflow-hidden gap-0 border-border bg-card">
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, applications, projects, notes..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-muted-foreground hover:text-foreground px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Type keywords to search across your active workspace entities.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching results found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => {
                const Icon = res.icon;
                return (
                  <button
                    key={res.id}
                    onClick={() => handleSelect(res.path)}
                    className="w-full flex items-center justify-between rounded-lg p-2.5 text-left text-sm hover:bg-muted/70 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground truncate">
                          {res.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {res.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground bg-muted/20">
          <span>Search LifePilot Workspace</span>
          <div className="flex items-center gap-2">
            <span>Esc to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
