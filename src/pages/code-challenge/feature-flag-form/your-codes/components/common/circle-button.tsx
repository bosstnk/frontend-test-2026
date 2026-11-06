import { Minus, Plus, X } from 'lucide-react'
import { cn } from '#/lib/utils'

const BASE =
  'group inline-flex size-6 cursor-pointer items-center justify-center rounded-full transition hover:shadow-md motion-safe:hover:scale-110 motion-safe:active:scale-95'

interface CircleButtonProps {
  // ชื่อที่ screen reader อ่าน เพราะปุ่มมีแต่ไอคอน
  label: string
  onClick: () => void
  className?: string
}

export function AddButton({ label, onClick, className }: CircleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        BASE,
        'bg-success-button text-success-foreground hover:bg-success-hover active:bg-success-active',
        className,
      )}
    >
      <Plus className="size-4" />
    </button>
  )
}

interface RemoveButtonProps extends CircleButtonProps {
  // minus = ลบแถว · x = ลบทั้งกล่อง (rule / group)
  icon?: 'minus' | 'x'
}

export function RemoveButton({
  label,
  onClick,
  icon = 'minus',
  className,
}: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        BASE,
        'bg-destructive-button text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active',
        className,
      )}
    >
      {icon === 'x' ? (
        <X className="size-4 transition-transform motion-safe:group-hover:rotate-90" />
      ) : (
        <Minus className="size-4" />
      )}
    </button>
  )
}
