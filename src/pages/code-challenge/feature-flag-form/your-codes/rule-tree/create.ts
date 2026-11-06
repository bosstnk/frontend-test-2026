import { OPERATORS } from '../constants/operators'
import type { Combinator, ConditionNode, GroupNode, RuleNode } from './types'

export function createCondition(
  field = '',
  // ต้องระบุ string: OPERATORS เป็น as const ถ้าให้ TypeScript เดา type จะแคบเหลือแค่ '=='
  operator: string = OPERATORS[0].value,
  value = '',
): ConditionNode {
  return { id: crypto.randomUUID(), type: 'condition', field, operator, value }
}

// group ใหม่มี condition ว่าง 1 ข้อ เหมือนกด "+ Group"
export function createGroup(
  combinator: Combinator = 'and',
  children: RuleNode[] = [createCondition()],
): GroupNode {
  return { id: crypto.randomUUID(), type: 'group', combinator, children }
}
