import type { AnyFieldMeta, AnyFieldMetaBase } from '@tanstack/react-form'
import type { FlagFormApi } from './use-flag-form'

// ย้าย / ลบแถวใน array ของฟอร์ม ใช้แทน field.moveValue / field.removeValue
// เพราะ TanStack Form (1.28.6–1.33.5) เลื่อนสถานะช่องโดยแก้เลข [n] ตัวแรกของ path
// (rules[0].root.children[2] ไปแก้เลข rule) และ error ของช่องที่เปลี่ยนชื่อจะหายจนกว่าจะพิมพ์ใหม่
// วิธีแก้: จำ touched / blurred / dirty ไว้ เขียนกลับที่ index ใหม่ แล้ว validate ทั้งฟอร์มอีกรอบ

type SavedMeta = Array<[string, AnyFieldMeta | undefined]>

// index ใหม่ของชิ้นที่เคยอยู่ old หลังย้ายจาก from ไป to
export function indexAfterMove(old: number, from: number, to: number): number {
  if (old === from) return to
  if (from < to && old > from && old <= to) return old - 1
  if (from > to && old >= to && old < from) return old + 1
  return old
}

function saveMeta(form: FlagFormApi, name: string): SavedMeta {
  const prefix = `${name}[`
  return Object.entries(form.state.fieldMeta).filter(([key]) =>
    key.startsWith(prefix),
  )
}

// newIndex คืน undefined = ไม่ต้องเขียนกลับ (แถวที่ถูกลบ)
function restoreMeta(
  form: FlagFormApi,
  name: string,
  saved: SavedMeta,
  newIndex: (old: number) => number | undefined,
) {
  const prefix = `${name}[`
  for (const [key, meta] of saved) {
    // 'rules[0].root.children[' + '2].value' → index 2 กับส่วนท้าย '.value'
    const match = /^(\d+)\](.*)$/.exec(key.slice(prefix.length))
    if (!match || !meta) continue
    const index = newIndex(Number(match[1]))
    if (index === undefined) continue
    // error ไม่ต้องย้าย เพราะ validate ด้านล่างคำนวณใหม่
    // ช่องที่ยังไม่มีสถานะ (เช่น แถวใน group ที่ย้ายมา) ใช้สถานะเดิมทั้งก้อน
    form.setFieldMeta(
      `${prefix}${index}]${match[2]}` as never,
      (prev: AnyFieldMetaBase | undefined) =>
        prev
          ? {
              ...prev,
              isTouched: meta.isTouched,
              isBlurred: meta.isBlurred,
              isDirty: meta.isDirty,
            }
          : meta,
    )
  }
  // รอ React วาดรอบนี้เสร็จก่อน (ช่องได้ชื่อใหม่ และ TanStack ล้าง error ของชื่อเดิมแล้ว)
  setTimeout(() => void form.validate('change'))
}

export function moveArrayItem(
  form: FlagFormApi,
  name: string,
  from: number,
  to: number,
) {
  const saved = saveMeta(form, name)
  form.moveFieldValues(name as never, from, to)
  restoreMeta(form, name, saved, (old) => indexAfterMove(old, from, to))
}

export function removeArrayItem(
  form: FlagFormApi,
  name: string,
  index: number,
) {
  const saved = saveMeta(form, name)
  // dontValidate: ถ้าให้ TanStack validate เอง ทุกแถวหลังแถวที่ลบจะถูกตั้งเป็น touched
  void form.removeFieldValue(name as never, index, { dontValidate: true })
  restoreMeta(form, name, saved, (old) => (old > index ? old - 1 : undefined))
}
