import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, ExternalLink, Pin, Plus, Search, Trash2 } from 'lucide-react';
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from '../hooks/useNotes';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatDate } from '../utils/formatters';
import './markdown.css';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';
const EMPTY_FORM = { title: '', body: '', category: '', tags: '', pinned: false, type: 'note', url: '' };
const NOTE_TYPES = [
  { value: 'note', label: 'Note' },
  { value: 'interview_prep', label: 'Interview prep' },
  { value: 'resource', label: 'Resource' },
];

export function NotesPage() {
  const { data: notes = [], isLoading, isError, error, refetch } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditingNote(null);
      setForm(EMPTY_FORM);
      setPreviewMode(false);
      setFormOpen(true);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('new');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const categories = useMemo(
    () => [...new Set(notes.map((note) => note.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [notes]
  );
  const filteredNotes = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...notes]
      .filter((note) => categoryFilter === 'all' || note.category === categoryFilter)
      .filter((note) => !search || [note.title, note.body, note.category, ...(note.tags || [])]
        .some((value) => String(value || '').toLowerCase().includes(search)))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }, [notes, query, categoryFilter]);

  const openNewNote = () => {
    setEditingNote(null);
    setForm(EMPTY_FORM);
    setPreviewMode(false);
    setFormOpen(true);
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setForm({
      title: note.title || '',
      body: note.body || '',
      category: note.category || '',
      tags: (note.tags || []).join(', '),
      pinned: Boolean(note.pinned),
      type: note.type || 'note',
      url: note.url || '',
    });
    setPreviewMode(false);
    setFormOpen(true);
  };

  const updateForm = (key) => (event) => {
    const value = key === 'pinned' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const saveNote = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      title: form.title.trim(),
      category: form.category.trim() || 'General',
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    const options = {
      onSuccess: () => {
        setFormOpen(false);
        setEditingNote(null);
      },
    };
    if (editingNote) {
      updateNote.mutate({ id: editingNote.id, payload }, options);
    } else {
      createNote.mutate(payload, options);
    }
  };

  const togglePinned = (note) => {
    updateNote.mutate({ id: note.id, payload: { ...note, pinned: !note.pinned } });
  };

  const removeNote = () => {
    deleteNote.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const mutationError = createNote.error || updateNote.error || deleteNote.error;
  const mutationPending = createNote.isPending || updateNote.isPending;

  return (
    <div>
      <PageHeader
        title="Notes & Resources"
        breadcrumbs={[{ label: 'Notes' }]}
        description="Keep interview prep, technical notes, and useful resources searchable in one place."
        actions={<Button onClick={openNewNote}><Plus className="mr-2 h-4 w-4" />New note</Button>}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            className={`${fieldClass} pl-9`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes, tags, or content…"
            aria-label="Search notes"
          />
        </label>
        <label className="sr-only" htmlFor="notes-category">Filter by category</label>
        <select id="notes-category" className={`${fieldClass} sm:w-56`} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Loading notes…</p> : null}
      {isError ? <ErrorState description={error?.message} onRetry={refetch} /> : null}
      {!isLoading && !isError && filteredNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={notes.length ? 'No matching notes' : 'Your notebook is empty'}
          description={notes.length ? 'Try another search or category.' : 'Create a note for an interview, study topic, or useful resource.'}
          actionLabel={notes.length ? undefined : 'Create a note'}
          onAction={notes.length ? undefined : openNewNote}
        />
      ) : null}

      {!isLoading && !isError && filteredNotes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <article key={note.id} className="flex min-h-56 flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <button className="min-w-0 flex-1 text-left" onClick={() => openEditNote(note)} aria-label={`Edit ${note.title}`}>
                  <h2 className="line-clamp-2 font-semibold">{note.title}</h2>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={note.pinned ? `Unpin ${note.title}` : `Pin ${note.title}`}
                  aria-pressed={Boolean(note.pinned)}
                  onClick={() => togglePinned(note)}
                >
                  <Pin className={`h-4 w-4 ${note.pinned ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Delete ${note.title}`} onClick={() => setDeleteTarget(note)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{note.category || 'General'}</Badge>
                <Badge variant="outline">{NOTE_TYPES.find((type) => type.value === note.type)?.label || 'Note'}</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(note.updatedAt || note.createdAt, 'MMM d')}</span>
              </div>
              <button className="mt-3 flex-1 text-left" onClick={() => openEditNote(note)} aria-label={`Open note ${note.title}`}>
                <p className="line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground">{note.body || 'No note content yet.'}</p>
              </button>
              {note.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {note.tags.slice(0, 5).map((tag) => <Badge key={tag} variant="outline">#{tag}</Badge>)}
                  {note.tags.length > 5 && <span className="self-center text-xs text-muted-foreground">+{note.tags.length - 5}</span>}
                </div>
              )}
              {note.url && (
                <a className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline" href={note.url} target="_blank" rel="noreferrer">
                  Open resource <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      {mutationError && <p role="alert" className="mt-4 text-sm text-danger">{mutationError.message}</p>}

      <Modal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingNote ? 'Edit note' : 'New note'}
        description="Write Markdown, organize it with tags, and preview the rendered note."
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
      >
        <form className="space-y-4" onSubmit={saveNote}>
          <label className="block text-sm font-medium">
            Title
            <input className={fieldClass} value={form.title} onChange={updateForm('title')} required maxLength={160} autoFocus />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Category
              <input className={fieldClass} value={form.category} onChange={updateForm('category')} maxLength={60} placeholder="Engineering" />
            </label>
            <label className="block text-sm font-medium">
              Type
              <select className={fieldClass} value={form.type} onChange={updateForm('type')}>
                {NOTE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium">
            Tags <span className="font-normal text-muted-foreground">(comma separated)</span>
            <input className={fieldClass} value={form.tags} onChange={updateForm('tags')} placeholder="interview, system-design" />
          </label>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Content</span>
              <div className="flex gap-1" role="group" aria-label="Note content mode">
                <Button type="button" size="sm" variant={!previewMode ? 'secondary' : 'ghost'} onClick={() => setPreviewMode(false)}>Write</Button>
                <Button type="button" size="sm" variant={previewMode ? 'secondary' : 'ghost'} onClick={() => setPreviewMode(true)}>Preview</Button>
              </div>
            </div>
            {previewMode ? (
              <div className="markdown-preview min-h-44 rounded-lg border border-border bg-background p-4">
                {form.body ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.body}</ReactMarkdown> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
              </div>
            ) : (
              <textarea
                className={`${fieldClass} font-mono`}
                rows="9"
                value={form.body}
                onChange={updateForm('body')}
                maxLength={30000}
                placeholder={'# Meeting notes\n\nWrite your notes in Markdown…'}
              />
            )}
          </div>
          <label className="block text-sm font-medium">
            Related URL
            <input className={fieldClass} type="url" value={form.url} onChange={updateForm('url')} placeholder="https://" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.pinned} onChange={updateForm('pinned')} className="h-4 w-4 accent-primary" />
            Pin this note to the top
          </label>
          {(createNote.isError || updateNote.isError) && (
            <p role="alert" className="text-sm text-danger">{(createNote.error || updateNote.error).message}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutationPending}>{mutationPending ? 'Saving…' : editingNote ? 'Save changes' : 'Create note'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete note?"
        description={`“${deleteTarget?.title || ''}” will be permanently removed.`}
        confirmText="Delete note"
        isLoading={deleteNote.isPending}
        onConfirm={removeNote}
      />
    </div>
  );
}
