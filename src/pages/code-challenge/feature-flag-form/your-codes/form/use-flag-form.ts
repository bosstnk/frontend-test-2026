import { useForm } from '@tanstack/react-form'
import type { StandardSchemaV1 } from '@tanstack/react-form'
import { flagFormSchema } from '../schemas/flag-form.schema'
import { defaultValues } from './flag-form-values'
import type { FlagFormValues } from './flag-form-values'

// ส่งให้ TanStack แค่ส่วน ~standard ของ schema (ฟังก์ชัน validate ตัวเดียวกัน) เพราะ
// 1. type ของ schema ทั้งก้อนมี tree ซ้อนไม่จำกัดชั้น → TS2589 แบบเดียวกับ root
// 2. devtools ของ TanStack ใช้ JSON.stringify กับ options ของฟอร์ม schema ที่อ้างถึงตัวเองทำให้ dev server ล่ม
const formSchema: StandardSchemaV1<FlagFormValues> = {
  '~standard': flagFormSchema['~standard'],
}

export function useFlagForm() {
  return useForm({
    defaultValues,
    validators: { onChange: formSchema },
  })
}

export type FlagFormApi = ReturnType<typeof useFlagForm>
