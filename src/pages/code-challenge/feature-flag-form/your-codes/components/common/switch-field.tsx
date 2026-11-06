import type { AnyFieldApi } from '@tanstack/react-form'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { cn } from '#/lib/utils'

// ต้องมี dark: ด้วย ไม่งั้นสีตอนปิดของ Switch ใน dark mode จะทับสีนี้
const TRACK_COLORS =
  'data-checked:bg-success data-unchecked:bg-destructive dark:data-unchecked:bg-destructive'

interface SwitchFieldProps {
  field: AnyFieldApi
  id: string
  label: string
  className?: string
}

export function SwitchField({ field, id, label, className }: SwitchFieldProps) {
  return (
    <div className={cn('flex h-8 items-center gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Switch
        id={id}
        className={TRACK_COLORS}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
      />
    </div>
  )
}
