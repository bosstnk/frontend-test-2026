// รูปแบบ JSON ที่ preview แสดง (ตาม expected.json) แยกจาก type ของฟอร์ม

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface TargetingRule {
  query: string
  percentage?: number
  variation?: string
}

export interface DefaultRule {
  variation: string
}

export interface FlagDefinition {
  variations: Record<string, JsonValue>
  targeting?: TargetingRule[]
  defaultRule?: DefaultRule
  disable?: boolean
  trackEvents?: boolean
  version?: string
  metadata?: { description?: string }
}

export interface FlagConfig {
  flags: Record<string, FlagDefinition>
}
