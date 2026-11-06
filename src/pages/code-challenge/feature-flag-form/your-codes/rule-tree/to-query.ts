import type { ConditionNode, GroupNode } from './types'

// ตัวเลขกับ true / false ไม่ใส่ quote อย่างอื่นใส่ quote เดี่ยวตาม expected.json เช่น group == 'beta'
function toQueryValue(text: string): string {
  const value = text.trim()
  if (value === 'true' || value === 'false') return value
  if (value !== '' && Number.isFinite(Number(value))) return value
  return `'${value.replaceAll("'", "\\'")}'`
}

export function toConditionQuery(condition: ConditionNode): string {
  const field = condition.field.trim()
  if (condition.operator === 'pr') return `${field} pr`
  if (condition.operator === 'in') {
    const list = condition.value.split(',').map(toQueryValue).join(', ')
    return `${field} in [${list}]`
  }
  return `${field} ${condition.operator} ${toQueryValue(condition.value)}`
}

// ข้าม condition ที่ยังไม่กรอก Field และ group ว่าง (schema แจ้ง error ให้แล้ว) group ย่อยครอบวงเล็บ
export function toGroupQuery(group: GroupNode): string {
  return group.children
    .map((child) => {
      if (child.type === 'condition') {
        return child.field.trim() === '' ? '' : toConditionQuery(child)
      }
      const inner = toGroupQuery(child)
      return inner === '' ? '' : `(${inner})`
    })
    .filter((part) => part !== '')
    .join(` ${group.combinator} `)
}
