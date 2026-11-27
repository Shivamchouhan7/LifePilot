import React from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { APPLICATION_STATUSES } from '../../constants/status';
import { ApplicationCard } from './ApplicationCard';

const columns = Object.entries(APPLICATION_STATUSES);

export function ApplicationKanban({ applications, onStatusChange, isUpdating }) {
  const handleDragEnd = ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId || isUpdating) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-w-0 overflow-x-auto pb-3" aria-label="Application kanban board">
        <div className="flex w-max min-w-full items-start gap-3">
          {columns.map(([status, config]) => {
            const columnApplications = applications.filter((application) => application.status === status);
            return (
              <section key={status} className="w-[290px] max-w-[85vw] shrink-0 rounded-xl border border-border bg-muted/30 p-3">
                <div className="mb-3 flex items-center justify-between gap-2 px-1">
                  <h2 className="text-sm font-semibold">{config.label}</h2>
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">{columnApplications.length}</span>
                </div>
                <Droppable droppableId={status} isDropDisabled={isUpdating}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-36 space-y-2 rounded-lg p-1 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                    >
                      {columnApplications.map((application, index) => (
                        <Draggable key={application.id} draggableId={String(application.id)} index={index} isDragDisabled={isUpdating}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={dragSnapshot.isDragging ? 'rounded-xl shadow-lg' : ''}
                            >
                              <ApplicationCard
                                application={application}
                                dragHandleProps={dragProvided.dragHandleProps}
                                isDragging={dragSnapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {!columnApplications.length && <p className="px-2 py-6 text-center text-xs text-muted-foreground">Drop applications here</p>}
                    </div>
                  )}
                </Droppable>
              </section>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}
