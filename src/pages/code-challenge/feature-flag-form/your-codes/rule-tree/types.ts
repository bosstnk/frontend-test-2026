export type Combinator = 'and' | 'or'

// เงื่อนไข 1 ข้อ เช่น country == 'TH' (ปุ่ม "+ Rule")
export interface ConditionNode {
  id: string
  type: 'condition'
  field: string
  operator: string
  value: string
}

// group ซ้อน condition หรือ group ได้ไม่จำกัดชั้น (ปุ่ม "+ Group")
export interface GroupNode {
  id: string
  type: 'group'
  combinator: Combinator
  children: RuleNode[]
}

export type RuleNode = ConditionNode | GroupNode
