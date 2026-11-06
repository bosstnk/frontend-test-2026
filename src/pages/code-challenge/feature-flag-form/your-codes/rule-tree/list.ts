import type { ConditionNode, GroupNode } from './types'

export interface ConditionAt {
  condition: ConditionNode
  path: (string | number)[]
}

// condition ทุกตัวใน tree เรียงตามลำดับบนจอ พร้อม path ที่ต่อจาก path ที่ส่งมา
// เช่น ส่ง ['rules', 0, 'root'] ได้ ['rules', 0, 'root', 'children', 1]
export function listConditions(
  group: GroupNode,
  path: (string | number)[] = [],
): ConditionAt[] {
  return group.children.flatMap((child, i) => {
    const childPath = [...path, 'children', i]
    return child.type === 'condition'
      ? [{ condition: child, path: childPath }]
      : listConditions(child, childPath)
  })
}
