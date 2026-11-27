import React, { useEffect, useMemo, useState } from 'react';
import { LayoutList, Layers, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '../../hooks/useTasks';
import { PageHeader } from '../common/PageHeader';
import { CardSkeleton } from '../common/CardSkeleton';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Button } from '../ui/button';
import { ListView } from './ListView';
import { KanbanBoard } from './KanbanBoard';
import { TaskFilters } from './TaskFilters';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskSections } from './TaskSections';
import { getTaskListState } from '../../utils/taskFilters';

export function TasksDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { data: tasks = [], isLoading, isError, error, refetch } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const listState = useMemo(
    () => getTaskListState(tasks, new URLSearchParams(searchParams)),
    [tasks, searchParams]
  );
  const view = searchParams.get('view') === 'kanban' ? 'kanban' : 'list';

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditingTask(null);
      setFormOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const clearNewParam = () => {
    if (!searchParams.has('new')) return;
    const next = new URLSearchParams(searchParams);
    next.delete('new');
    setSearchParams(next, { replace: true });
  };

  const closeForm = (open) => {
    setFormOpen(open);
    if (!open) {
      setEditingTask(null);
      clearNewParam();
    }
  };

  const openNewTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const saveTask = async (payload) => {
    if (editingTask) await updateTask.mutateAsync({ id: editingTask.id, payload });
    else await createTask.mutateAsync(payload);
    closeForm(false);
    clearNewParam();
  };

  const changeView = (nextView) => {
    const next = new URLSearchParams(searchParams);
    next.set('view', nextView);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    ['q', 'priority', 'status', 'category', 'tag', 'section', 'sort', 'direction'].forEach((key) => next.delete(key));
    setSearchParams(next, { replace: true });
  };
  const showAllTasks = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('section');
    setSearchParams(next, { replace: true });
  };

  const toggleComplete = (task) => updateTask.mutate({
    id: task.id,
    payload: { status: task.status === 'completed' ? 'todo' : 'completed' },
  });
  const changeStatus = (id, status) => updateTask.mutate({ id, payload: { status } });
  const confirmDelete = () => deleteTask.mutate(deleteTarget.id, {
    onSuccess: () => setDeleteTarget(null),
  });

  if (isLoading) return <div className="p-4"><CardSkeleton count={4} /></div>;
  if (isError) return <ErrorState description={error?.message} onRetry={refetch} />;

  const noTasks = tasks.length === 0;
  const noFilterResults = !noTasks && listState.counts.all === 0;
  const noSectionResults = !noTasks && !noFilterResults && listState.tasks.length === 0;
  const isSaving = createTask.isPending || updateTask.isPending;

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Tasks"
        breadcrumbs={[{ label: 'Tasks' }]}
        description="Plan, prioritize, and complete the work that moves you forward."
        actions={<Button onClick={openNewTask}><Plus className="mr-2 h-4 w-4" />Add task</Button>}
      />
      <TaskFilters tasks={tasks} />
      <TaskSections counts={listState.counts} />
      <div className="flex gap-2" role="group" aria-label="Task view">
        <Button variant={view === 'list' ? 'default' : 'outline'} aria-pressed={view === 'list'} onClick={() => changeView('list')}>
          <LayoutList className="mr-1 h-4 w-4" />List
        </Button>
        <Button variant={view === 'kanban' ? 'default' : 'outline'} aria-pressed={view === 'kanban'} onClick={() => changeView('kanban')}>
          <Layers className="mr-1 h-4 w-4" />Kanban
        </Button>
      </div>

      {noTasks && (
        <EmptyState
          title="No tasks yet"
          description="Add your first task to start organizing your work."
          actionLabel="Add your first task"
          onAction={openNewTask}
        />
      )}
      {noFilterResults && (
        <EmptyState
          title="No matching tasks"
          description="No tasks match the current search and filters."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      )}
      {noSectionResults && (
        <EmptyState
          title="No tasks in this section"
          description="Try another task section or show all tasks."
          actionLabel="Show all tasks"
          onAction={showAllTasks}
        />
      )}
      {!noTasks && !noFilterResults && !noSectionResults && (
        view === 'list' ? (
          <ListView
            tasks={listState.tasks}
            onEdit={(task) => { setEditingTask(task); setFormOpen(true); }}
            onDelete={setDeleteTarget}
            onToggleComplete={toggleComplete}
            isUpdating={updateTask.isPending}
          />
        ) : (
          <KanbanBoard
            tasks={listState.tasks}
            onStatusChange={changeStatus}
            onEdit={(task) => { setEditingTask(task); setFormOpen(true); }}
            onDelete={setDeleteTarget}
            onToggleComplete={toggleComplete}
            isUpdating={updateTask.isPending}
          />
        )
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={closeForm}
        task={editingTask}
        onSave={saveTask}
        isSaving={isSaving}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete task?"
        description={`“${deleteTarget?.title || ''}” will be permanently removed.`}
        confirmText="Delete task"
        isLoading={deleteTask.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
