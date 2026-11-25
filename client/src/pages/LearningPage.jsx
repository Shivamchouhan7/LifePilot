import React, { useState } from 'react';
import { BookOpen, Check, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useLearningGoals, useCreateLearningGoal, useUpdateLearningGoal, useDeleteLearningGoal } from '../hooks/useLearningGoals';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatDate } from '../utils/formatters';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';

export function LearningPage() {
  const { data: goals = [], isLoading, isError, error, refetch } = useLearningGoals();
  const createGoal = useCreateLearningGoal();
  const updateGoal = useUpdateLearningGoal();
  const deleteGoal = useDeleteLearningGoal();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [skill, setSkill] = useState('');
  const [category, setCategory] = useState('');
  const [revisionDate, setRevisionDate] = useState('');
  const [lessonText, setLessonText] = useState('');

  const resetForm = () => {
    setSkill('');
    setCategory('');
    setRevisionDate('');
    setLessonText('');
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const lessons = lessonText.split('\n').map((title) => title.trim()).filter(Boolean)
      .map((title) => ({
        id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `lesson_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        title,
        done: false,
      }));
    createGoal.mutate({
      skill: skill.trim(),
      category: category.trim() || 'General',
      nextRevisionDate: revisionDate ? new Date(`${revisionDate}T12:00:00`).toISOString() : null,
      topics: [],
      lessons,
      resources: [],
    }, {
      onSuccess: () => {
        resetForm();
        setFormOpen(false);
      },
    });
  };

  const toggleLesson = (goal, lessonId) => {
    const lessons = goal.lessons.map((lesson) => (
      lesson.id === lessonId ? { ...lesson, done: !lesson.done } : lesson
    ));
    updateGoal.mutate({ id: goal.id, payload: { ...goal, lessons } });
  };

  const handleDelete = () => {
    deleteGoal.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div>
      <PageHeader
        title="Learning & Skills"
        breadcrumbs={[{ label: 'Learning' }]}
        description="Build study roadmaps, track lesson progress, and plan your next review."
        actions={<Button onClick={() => setFormOpen(true)}><Plus className="mr-2 h-4 w-4" />New learning goal</Button>}
      />

      {isLoading ? <p className="text-sm text-muted-foreground">Loading learning goals…</p> : null}
      {isError ? <ErrorState description={error?.message} onRetry={refetch} /> : null}
      {!isLoading && !isError && goals.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Start a learning roadmap"
          description="Add a skill and its lessons to track your progress and revision schedule."
          actionLabel="Create learning goal"
          onAction={() => setFormOpen(true)}
        />
      ) : null}

      {!isLoading && !isError && goals.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-2">
          {goals.map((goal) => {
            const lessons = goal.lessons || [];
            const completed = lessons.filter((lesson) => lesson.done).length;
            return (
              <section key={goal.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{goal.skill}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{goal.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Review {goal.nextRevisionDate ? formatDate(goal.nextRevisionDate) : 'not scheduled'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${goal.skill}`}
                    onClick={() => setDeleteTarget(goal)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Lesson progress</span>
                    <span className="font-medium">{goal.progress}% · {completed}/{lessons.length}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={goal.progress} aria-valuemin="0" aria-valuemax="100" aria-label={`${goal.skill} progress`}>
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {lessons.length ? lessons.map((lesson) => (
                    <label key={lesson.id} className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted/60">
                      <input
                        type="checkbox"
                        checked={lesson.done}
                        onChange={() => toggleLesson(goal, lesson.id)}
                        className="mt-0.5 h-4 w-4 accent-primary"
                      />
                      <span className={lesson.done ? 'text-muted-foreground line-through' : ''}>{lesson.title}</span>
                      {lesson.done && <Check className="ml-auto h-4 w-4 shrink-0 text-success" aria-hidden="true" />}
                    </label>
                  )) : (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" /> No lessons added yet.
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Modal open={formOpen} onOpenChange={setFormOpen} title="New learning goal" description="Create a roadmap and optionally add lessons to track.">
        <form className="space-y-4" onSubmit={handleCreate}>
          <label className="block text-sm font-medium">
            Skill or roadmap
            <input className={fieldClass} value={skill} onChange={(event) => setSkill(event.target.value)} required maxLength={100} autoFocus />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Category
              <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} maxLength={50} placeholder="Engineering" />
            </label>
            <label className="block text-sm font-medium">
              Next review
              <input className={fieldClass} type="date" value={revisionDate} onChange={(event) => setRevisionDate(event.target.value)} />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Lessons
            <textarea className={fieldClass} rows="4" value={lessonText} onChange={(event) => setLessonText(event.target.value)} placeholder="One lesson per line" />
          </label>
          {createGoal.isError && <p role="alert" className="text-sm text-danger">{createGoal.error.message}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createGoal.isPending}>{createGoal.isPending ? 'Saving…' : 'Create goal'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete learning goal?"
        description={`“${deleteTarget?.skill || ''}” and its lesson progress will be removed.`}
        confirmText="Delete goal"
        isLoading={deleteGoal.isPending}
        onConfirm={handleDelete}
      />
      {updateGoal.isError && <p role="alert" className="mt-4 text-sm text-danger">{updateGoal.error.message}</p>}
      {deleteGoal.isError && <p role="alert" className="mt-4 text-sm text-danger">{deleteGoal.error.message}</p>}
    </div>
  );
}
