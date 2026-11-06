import { z } from 'zod'
import { FLAG_TYPES } from '../constants/flag-types'
import type { FlagType } from '../constants/flag-types'
import { OPERATORS } from '../constants/operators'
import { listConditions } from '../rule-tree'
import type { GroupNode } from '../rule-tree'

// ตัวช่วยตรวจค่า: ผิดคืนข้อความ error ถูกคืน undefined

function conditionValueError(
  operator: string,
  value: string,
): string | undefined {
  if (operator === 'pr') return undefined
  if (operator === 'in') {
    const hasItem = value.split(',').some((part) => part.trim() !== '')
    return hasItem
      ? undefined
      : 'List at least one value, separated by commas, e.g. TH, JP'
  }
  return value.trim() === '' ? 'Value is required, e.g. beta' : undefined
}

function variationValueError(text: string, type: FlagType): string | undefined {
  if (type === 'boolean' && text !== 'true' && text !== 'false') {
    return 'Must be true or false for a boolean flag'
  }
  if (
    type === 'number' &&
    (text.trim() === '' || !Number.isFinite(Number(text)))
  ) {
    return 'Must be a number for a number flag, e.g. 42'
  }
  if (type === 'json') {
    try {
      JSON.parse(text)
    } catch {
      return 'Must be valid JSON for a json flag, e.g. {"color": "red"}'
    }
  }
  return undefined
}

// rule / default ต้องเลือก variation แล้ว และ variation นั้นยังไม่ถูกลบ
function serveError(
  id: string,
  variationIds: string[],
  emptyMessage: string,
): string | undefined {
  if (id === '') return emptyMessage
  if (!variationIds.includes(id)) {
    return 'The chosen variation was removed. Choose another one'
  }
  return undefined
}

// ต้องเช็กว่างเอง เพราะ Number('') ได้ 0
function isPercentage(text: string): boolean {
  const percentage = Number(text)
  return text.trim() !== '' && percentage >= 0 && percentage <= 100
}

// path ของ group ย่อยที่ว่าง ไม่นับ root เพราะ root ว่างมี error ของ rule อยู่แล้ว
function emptyGroupPaths(
  group: GroupNode,
  path: (string | number)[] = [],
): (string | number)[][] {
  return group.children.flatMap((child, i) => {
    if (child.type !== 'group') return []
    const childPath = [...path, 'children', i]
    return child.children.length === 0
      ? [[...childPath, 'children']]
      : emptyGroupPaths(child, childPath)
  })
}

const conditionSchema = z
  .object({
    id: z.string(),
    type: z.literal('condition'),
    field: z.string().trim().min(1, 'Field is required, e.g. group'),
    operator: z.enum(
      OPERATORS.map((operator) => operator.value),
      'Choose an operator from the list',
    ),
    value: z.string(),
  })
  .superRefine((condition, ctx) => {
    const message = conditionValueError(condition.operator, condition.value)
    if (message) ctx.addIssue({ code: 'custom', path: ['value'], message })
  })

// ซ้อนได้ไม่จำกัดชั้น: getter ให้ Zod อ่าน groupSchema ตอนตรวจ
// ต้องเขียน type ของ getter เอง เพราะ TypeScript เดา type ที่อ้างถึงตัวเองไม่ได้
const groupSchema = z.object({
  id: z.string(),
  type: z.literal('group'),
  combinator: z.enum(['and', 'or']),
  get children(): z.ZodArray<
    z.ZodDiscriminatedUnion<
      [typeof conditionSchema, typeof groupSchema],
      'type'
    >
  > {
    return z.array(z.discriminatedUnion('type', [conditionSchema, groupSchema]))
  },
})

const ruleSchema = z
  .object({
    id: z.string(),
    // satisfies: schema กับ GroupNode ใน rule-tree ต้องตรงกัน ไม่ตรง TypeScript จะแจ้ง
    root: groupSchema satisfies z.ZodType<GroupNode>,
    variationId: z.string(),
    percentage: z
      .string()
      .refine(isPercentage, 'Percentage must be a number from 0 to 100'),
  })
  .refine((rule) => listConditions(rule.root).length > 0, {
    path: ['root', 'children'],
    error: 'Add at least one condition with + Rule',
  })
  // query ข้าม group ว่างไป จึงต้องแจ้ง ไม่งั้น group หายจาก output เงียบ ๆ
  .superRefine((rule, ctx) => {
    for (const path of emptyGroupPaths(rule.root)) {
      ctx.addIssue({
        code: 'custom',
        path: ['root', ...path],
        message:
          'This group is empty. Add a condition with + Rule, or remove the group',
      })
    }
  })

const variationSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Give this variation a name, e.g. on'),
  value: z.string(),
})

export const flagFormSchema = z
  .object({
    flagName: z
      .string()
      .trim()
      .min(1, 'Flag name is required, e.g. my-new-feature')
      // ใช้ * เพราะ min(1) ดูเรื่องว่างแล้ว ช่องว่างจะได้ error ข้อเดียว
      .regex(
        /^[\w.-]*$/,
        'Use only letters, numbers, "-", "_" or "." (no spaces), e.g. my-new-feature',
      ),
    description: z.string(),
    disable: z.boolean(),
    trackEvents: z.boolean(),
    type: z.enum(FLAG_TYPES),
    version: z.string(),
    variations: z
      .array(variationSchema)
      .min(1, 'Add at least one variation with the + button'),
    rules: z.array(ruleSchema),
    defaultVariationId: z.string(),
  })
  // กฎที่ต้องดูหลายช่องพร้อมกัน
  .superRefine((form, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: 'custom', path, message })

    const names = form.variations.map((variation) => variation.name.trim())
    const variationIds = form.variations.map((variation) => variation.id)

    form.variations.forEach((variation, i) => {
      if (names[i] !== '' && names.indexOf(names[i]) < i) {
        issue(
          ['variations', i, 'name'],
          `"${names[i]}" is already used by another variation. Pick a different name`,
        )
      }
      const valueError = variationValueError(variation.value, form.type)
      if (valueError) issue(['variations', i, 'value'], valueError)
    })

    form.rules.forEach((rule, r) => {
      const message = serveError(
        rule.variationId,
        variationIds,
        'Choose the variation this rule serves',
      )
      if (message) issue(['rules', r, 'variationId'], message)
    })

    const message = serveError(
      form.defaultVariationId,
      variationIds,
      'Choose the variation served by default',
    )
    if (message) issue(['defaultVariationId'], message)
  })
