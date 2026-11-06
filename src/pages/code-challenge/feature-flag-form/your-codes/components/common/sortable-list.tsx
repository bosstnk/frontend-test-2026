import { useId } from 'react'
import type { ReactNode } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '#/lib/utils'

interface SortableListProps {
  // เรียงตามลำดับบนจอ
  ids: string[]
  onMove: (from: number, to: number) => void
  className?: string
  children: ReactNode
}

// 1 list = 1 DndContext ของใน group จึงลากสลับได้เฉพาะใน group เดียวกัน
export function SortableList({
  ids,
  onMove,
  className,
  children,
}: SortableListProps) {
  // id ตรงกันทั้ง server และ browser กัน hydration mismatch
  const dndId = useId()
  const sensors = useSensors(
    // ต้องลากเกิน 6px ถึงนับว่าลาก คลิกปุ่มจับเฉย ๆ จึงยังเป็นคลิก
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol className={cn('empty:hidden', className)}>{children}</ol>
      </SortableContext>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string
  // ชื่อที่ screen reader อ่าน เช่น "rule 1"
  label: string
  // bottom = ปุ่มจับอยู่ระดับเดียวกับช่อง input (แถว condition)
  align?: 'bottom' | 'center'
  children: ReactNode
}

// ลากได้จากปุ่มจับ (⋮⋮) เท่านั้น พิมพ์หรือเปิด select ในแถวจึงไม่ทำให้แถวขยับ
export function SortableItem({
  id,
  label,
  align = 'center',
  children,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <li
      ref={setNodeRef}
      // Translate: เลื่อนอย่างเดียวไม่ยืดหด เพราะแต่ละแถวสูงไม่เท่ากัน
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'flex gap-2',
        align === 'bottom' ? 'items-end' : 'items-center',
        isDragging && 'relative z-10 bg-background shadow-lg',
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${label}`}
        className={cn(
          'cursor-grab touch-none rounded-sm p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing',
          align === 'bottom' && 'mb-2',
        )}
      >
        <GripVertical aria-hidden className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  )
}
