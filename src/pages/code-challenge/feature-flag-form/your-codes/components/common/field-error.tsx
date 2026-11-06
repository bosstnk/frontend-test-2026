function errorMessage(error: unknown): string | undefined {
  if (typeof error === 'string') return error
  if (Array.isArray(error)) return error.map(errorMessage).find(Boolean)
  if (error && typeof error === 'object' && 'message' in error) {
    return typeof error.message === 'string' ? error.message : undefined
  }
  return undefined
}

interface FieldMeta {
  errors: unknown[]
  isDirty: boolean
  isBlurred: boolean
}

// โชว์ error หลังผู้ใช้แก้ค่า (isDirty) หรือออกจากช่อง (isBlurred)
// ไม่ใช้ isTouched เพราะ TanStack ตั้งให้เองตอนลบแถว แถวที่ยังไม่ได้แตะเลยแดงขึ้นมา
export function visibleError(meta: FieldMeta): string | undefined {
  if (!meta.isDirty && !meta.isBlurred) return undefined
  return meta.errors.map(errorMessage).find(Boolean)
}

interface FieldErrorProps {
  meta: FieldMeta
}

export function FieldError({ meta }: FieldErrorProps) {
  const message = visibleError(meta)
  if (message === undefined) return null
  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  )
}
