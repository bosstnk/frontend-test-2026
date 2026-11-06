import type { FlagType } from '../constants/flag-types'
import { createGroup } from '../rule-tree'
import type { GroupNode } from '../rule-tree'

interface Variation {
  id: string
  name: string
  value: string
}

interface Rule {
  id: string
  // ค่าจริงคือ GroupNode แต่ใน type ของฟอร์มต้องเป็น unknown:
  // tree ที่ซ้อนไม่จำกัดชั้นทำให้ TanStack Form ไล่ path ไม่จบ (TS2589) · อ่านกลับด้วย ruleRoot()
  root: unknown
  variationId: string
  percentage: string
}

export function createVariation(): Variation {
  return { id: crypto.randomUUID(), name: '', value: '' }
}

export function createRule(): Rule {
  return {
    id: crypto.randomUUID(),
    root: createGroup(),
    variationId: '',
    percentage: '100',
  }
}

// cast ของ root มีที่นี่ที่เดียว ปลอดภัยเพราะ root มาจาก createGroup() และแก้ได้ผ่านฟอร์มเท่านั้น
export function ruleRoot(rule: Rule): GroupNode {
  return rule.root as GroupNode
}

// path ของ group / condition ในฟอร์ม เช่น rules[0].root.children[1]
export type NodePath =
  | `rules[${number}].root`
  | `rules[${number}].root.${string}`

// ต้องระบุ string: crypto.randomUUID() คืน type แบบ template ซึ่งแคบเกินสำหรับช่องในฟอร์ม
const offId: string = crypto.randomUUID()

// ตรงกับ expected.json: variation on / off และ default เสิร์ฟ off
export const defaultValues = {
  flagName: 'my-new-feature',
  description: '',
  disable: false,
  trackEvents: true,
  type: 'boolean' as FlagType,
  version: '',
  variations: [
    { id: crypto.randomUUID(), name: 'on', value: 'true' },
    { id: offId, name: 'off', value: 'false' },
  ] as Variation[],
  rules: [] as Rule[],
  defaultVariationId: offId,
}

export type FlagFormValues = typeof defaultValues
