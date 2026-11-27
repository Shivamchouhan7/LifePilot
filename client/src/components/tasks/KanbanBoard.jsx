import React from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { TASK_STATUSES } from '../../constants/status';
import { TaskCard } from './TaskCard';

const columns = Object.entries(TASK_STATUSES);

export function KanbanBoard({ tasks, onStatusChange, onEdit, onDelete, onToggleComplete, isUpdating }) {
  const handleDragEnd = ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
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
                            className={dragSnapshot.isDragging ? 'rounded-xl shadow-lg ring-1 ring-primary/40' : ''}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onToggleComplete={onToggleComplete}
                              isUpdating={isUpdating}
                            />
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
  );
}
