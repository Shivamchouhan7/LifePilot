import React from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useUpdateTask } from '../../hooks/useTasks';
import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/status';
import { formatDate } from '../../utils/formatters';

const columns = Object.entries(TASK_STATUSES);

export function KanbanBoard({ tasks = [] }) {
  const updateTask = useUpdateTask();

  const handleDragEnd = ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    updateTask.mutate({
      id: draggableId,
      payload: { status: destination.droppableId },
    });
  };

  return (
    <div>
      {updateTask.isError && <p role="alert" className="mb-3 text-sm text-danger">{updateTask.error.message}</p>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map(([status, config]) => {
            const columnTasks = tasks.filter((task) => task.status === status);
            return (
              <section key={status} className="min-w-0 rounded-xl border border-border bg-muted/30 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold">{config.label}</h2>
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">{columnTasks.length}</span>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-36 space-y-2 rounded-lg p-1 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <article
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`rounded-lg border border-border bg-card p-3 shadow-sm ${dragSnapshot.isDragging ? 'shadow-lg ring-1 ring-primary/40' : 'hover:border-primary/40'}`}
                            >
                              <h3 className="text-sm font-medium">{task.title}</h3>
                              {task.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>}
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {task.priority && (
                                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${TASK_PRIORITIES[task.priority]?.color || 'border-border bg-muted text-muted-foreground'}`}>
                                    {TASK_PRIORITIES[task.priority]?.label || task.priority}
                                  </span>
                                )}
                                {task.dueAt && <span className="text-[11px] text-muted-foreground">{formatDate(task.dueAt)}</span>}
                              </div>
                            </article>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {!columnTasks.length && <p className="px-2 py-6 text-center text-xs text-muted-foreground">Drop tasks here</p>}
                    </div>
                  )}
                </Droppable>
              </section>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
