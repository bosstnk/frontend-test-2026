import type { AnyFieldApi } from '@tanstack/react-form'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { cn } from '#/lib/utils'
import { FieldError, visibleError } from './field-error'

interface TextFieldProps {
  field: AnyFieldApi
  id: string
  label: string
  className?: string
}

export function TextField({ field, id, label, className }: TextFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <FieldError meta={field.state.meta} />
      </div>
      <Input
        id={id}
        type="text"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={visibleError(field.state.meta) !== undefined}
      />
    </div>
  )
}
