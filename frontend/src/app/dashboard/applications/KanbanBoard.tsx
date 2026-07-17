"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Application, ApplicationStatus, updateApplicationStatus } from "@/actions/applications";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, DollarSign, Clock, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS: ApplicationStatus[] = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export default function KanbanBoard({ initialApplications }: { initialApplications: Application[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as ApplicationStatus;
    
    // Optimistic update
    const previousApps = [...applications];
    setApplications(apps => apps.map(app => 
      app.id === draggableId ? { ...app, status: newStatus } : app
    ));
    
    setPendingUpdates(prev => new Set(prev).add(draggableId));

    try {
      await updateApplicationStatus(draggableId, newStatus);
    } catch (error) {
      // Revert on error
      setApplications(previousApps);
    } finally {
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(draggableId);
        return newSet;
      });
    }
  };

  if (!isMounted) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">Loading board...</div>;
  }

  return (
    <div className="h-full overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-4 min-w-max px-1">
          {COLUMNS.map((columnId) => {
            const columnApps = applications.filter((app) => app.status === columnId);
            
            return (
              <div key={columnId} className="flex flex-col w-80 shrink-0 bg-muted/40 rounded-xl border border-border/50">
                <div className="p-4 flex items-center justify-between shrink-0">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{columnId}</h3>
                  <span className="bg-muted px-2 py-1 rounded-full text-xs font-medium text-foreground">
                    {columnApps.length}
                  </span>
                </div>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto px-3 pb-3 space-y-3 min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      }`}
                    >
                      {columnApps.map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`group ${snapshot.isDragging ? 'z-50 opacity-90' : ''} ${
                                pendingUpdates.has(app.id) ? 'opacity-50' : ''
                              }`}
                            >
                              <Card className="shadow-sm border-border bg-card hover:border-primary/30 transition-colors">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="font-semibold text-foreground line-clamp-1">{app.role}</div>
                                    <div 
                                      {...provided.dragHandleProps}
                                      className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 -mr-2 -mt-1 rounded-md"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                                    <Building className="h-3 w-3 mr-1.5 shrink-0" />
                                    <span className="truncate">{app.company}</span>
                                  </div>
                                  
                                  <div className="space-y-1.5 mt-3">
                                    {app.location && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3 mr-1.5 shrink-0" />
                                        <span className="truncate">{app.location}</span>
                                      </div>
                                    )}
                                    {app.salary && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <DollarSign className="h-3 w-3 mr-1.5 shrink-0" />
                                        <span className="truncate">{app.salary}</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
