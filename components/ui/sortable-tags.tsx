"use client";

import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  defaultAnimateLayoutChanges,
  rectSwappingStrategy,
  useSortable,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type SortableItem = { key: string; node: ReactNode };

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function SortableTag({
  item,
  anyDragging,
}: {
  item: SortableItem;
  anyDragging: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.key, animateLayoutChanges });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none select-none active:cursor-grabbing"
    >
      {/* Lock pointer events on visual content during any drag so sibling
          TextFlip/group-hover don't fire as the overlay passes over them. */}
      <div className={anyDragging ? "pointer-events-none" : ""}>
        {item.node}
      </div>
    </div>
  );
}

export function SortableTags({
  items,
  className,
}: {
  items: SortableItem[];
  className?: string;
}) {
  const [order, setOrder] = useState<SortableItem[]>(items);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIndex = prev.findIndex((i) => i.key === active.id);
      const newIndex = prev.findIndex((i) => i.key === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const activeItem = activeId
    ? order.find((i) => i.key === activeId) ?? null
    : null;

  // Render a static list on server + initial client render so hydration
  // matches. dnd-kit uses useId internally and allocates IDs differently
  // across SSR/CSR when multiple DndContexts exist on the page.
  if (!mounted) {
    return (
      <div className={className}>
        {order.map((item) => (
          <div key={item.key}>{item.node}</div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext
        items={order.map((i) => i.key)}
        strategy={rectSwappingStrategy}
      >
        <div className={className}>
          {order.map((item) => (
            <SortableTag
              key={item.key}
              item={item}
              anyDragging={activeId !== null}
            />
          ))}
        </div>
      </SortableContext>
      {createPortal(
        <DragOverlay
          dropAnimation={{
            duration: 220,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {activeItem ? (
            <div className="pointer-events-none cursor-grabbing select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] [transform:scale(1.08)]">
              {activeItem.node}
            </div>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
