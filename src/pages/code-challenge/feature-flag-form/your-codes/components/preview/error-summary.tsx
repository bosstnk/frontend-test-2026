import { CircleAlert, CircleCheck } from 'lucide-react'
import { ruleRoot } from '../../form/flag-form-values'
import type { FlagFormValues } from '../../form/flag-form-values'
import { listConditions } from '../../rule-tree'
import { flagFormSchema } from '../../schemas/flag-form.schema'

// ลำดับ key บนจอ (บนลงล่าง) ใช้เรียง error ให้ตรงกับหน้าจอ
const SCREEN_ORDER = [
  'flagName',
  'variations',
  'name',
  'rules',
  'root',
  'children',
  'field',
  'operator',
  'value',
  'variationId',
  'percentage',
  'defaultVariationId',
]

// เทียบ path ทีละช่อง: เลขแถวเทียบตรง ๆ ชื่อ key เทียบตาม SCREEN_ORDER
function byScreenOrder(a: PropertyKey[], b: PropertyKey[]): number {
  const rank = (segment: PropertyKey) =>
    typeof segment === 'number'
      ? segment
      : SCREEN_ORDER.indexOf(String(segment))
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const diff = rank(a[i]) - rank(b[i])
    if (diff !== 0) return diff
  }
  return a.length - b.length
}

const CONDITION_FIELD_LABELS: Record<string, string> = {
  field: 'Field',
  operator: 'Operator',
  value: 'Value',
}

// path ของ error → ตำแหน่งที่คนอ่านเข้าใจ เช่น Rule 1 › Condition 2 › Value
function where(path: PropertyKey[], values: FlagFormValues): string {
  const [section, index, key] = path

  if (section === 'flagName') return 'Flag Name'
  if (section === 'defaultVariationId') return 'Default › Serve'

  if (section === 'variations') {
    if (typeof index !== 'number') return 'Variation'
    return `Variation ${index + 1} › ${key === 'value' ? 'Flag-Value' : 'Name'}`
  }

  if (section === 'rules' && typeof index === 'number') {
    const rule = `Rule ${index + 1}`
    if (key === 'variationId') return `${rule} › Serve`
    if (key === 'percentage') return `${rule} › Percentage`
    if (key === 'root') {
      // นับว่าเป็น condition ลำดับที่เท่าไรบนจอ จาก path ระหว่าง root กับชื่อช่อง
      const target = path.slice(3, -1).map(String).join('.')
      const number =
        listConditions(ruleRoot(values.rules[index])).findIndex(
          (item) => item.path.join('.') === target,
        ) + 1
      const last = path.at(-1)
      if (number > 0) {
        return `${rule} › Condition ${number} › ${CONDITION_FIELD_LABELS[String(last)] ?? 'Value'}`
      }
    }
    return rule
  }

  return String(section)
}

interface ErrorSummaryProps {
  values: FlagFormValues
}

export function ErrorSummary({ values }: ErrorSummaryProps) {
  const result = flagFormSchema.safeParse(values)

  if (result.success) {
    return (
      <p className="flex items-center gap-2 text-sm text-success">
        <CircleCheck className="size-4" />
        No problems. The config is ready to use.
      </p>
    )
  }

  const issues = [...result.error.issues].sort((a, b) =>
    byScreenOrder(a.path, b.path),
  )
  return (
    <section
      aria-live="polite"
      className="space-y-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4"
    >
      <h2 className="flex items-center gap-2 text-sm font-medium text-destructive">
        <CircleAlert className="size-4" />
        {issues.length} {issues.length === 1 ? 'thing' : 'things'} to check
      </h2>
      <ul className="space-y-1 text-sm">
        {issues.map((issue) => (
          <li key={`${issue.path.join('.')}-${issue.message}`}>
            <span className="font-medium">{where(issue.path, values)}:</span>{' '}
            {issue.message}
          </li>
        ))}
      </ul>
    </section>
  )
}
