import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { COMBINATORS } from '../../constants/combinators'
import { moveArrayItem, removeArrayItem } from '../../form/array-items'
import type { NodePath } from '../../form/flag-form-values'
import type { FlagFormApi } from '../../form/use-flag-form'
import { createCondition, createGroup } from '../../rule-tree'
import type { RuleNode } from '../../rule-tree'
import { RemoveButton } from '../common/circle-button'
import { FieldError } from '../common/field-error'
import { OptionSelect } from '../common/option-select'
import { SortableItem, SortableList } from '../common/sortable-list'
import { ConditionRow } from './condition-row'

interface ConditionGroupProps {
  form: FlagFormApi
  // เช่น rules[0].root หรือ rules[0].root.children[1]
  path: NodePath
  // ไม่ส่ง = root ของ rule ซึ่งลบไม่ได้
  onRemove?: () => void
}

// ลูกที่เป็น group วาด ConditionGroup ซ้ำ จึงซ้อนได้ไม่จำกัดชั้น
export function ConditionGroup({ form, path, onRemove }: ConditionGroupProps) {
  const childrenPath = `${path}.children` as const
  const combinatorName = `${path}.combinator` as const

  return (
    <form.Field name={childrenPath} mode="array">
      {(childList) => {
        // ค่าใต้ root เป็น unknown (ดู Rule ใน flag-form-values.ts) จึงต้องบอก type เอง
        // ?? []: หลังลบแถวก่อนหน้า Field ยังอ่าน path เก่าอยู่ 1 รอบแล้วได้ undefined
        const children = (childList.state.value ?? []) as RuleNode[]
        // pushValue เห็น type เป็น never เพราะ TypeScript ไม่รู้ว่าค่าเป็น array
        const add = (node: RuleNode) => childList.pushValue(node as never)

        return (
          <div className="space-y-2">
            <div className="flex flex-row items-center gap-2">
              <form.Field name={combinatorName}>
                {(field) => (
                  <OptionSelect
                    label="Combinator"
                    options={COMBINATORS}
                    value={field.state.value as string}
                    onValueChange={field.handleChange}
                    className="w-40"
                  />
                )}
              </form.Field>
              <Button
                type="button"
                onClick={() => add(createCondition())}
                className="hover:bg-primary/80 active:bg-primary/70"
              >
                <Plus />
                Rule
              </Button>
              <Button
                type="button"
                onClick={() => add(createGroup())}
                className="hover:bg-primary/80 active:bg-primary/70"
              >
                <Plus />
                Group
              </Button>
              {onRemove && (
                <RemoveButton
                  label="Remove group"
                  icon="x"
                  onClick={onRemove}
                />
              )}
            </div>
            <SortableList
              ids={children.map((child) => child.id)}
              onMove={(from, to) => moveArrayItem(form, childrenPath, from, to)}
              className="space-y-2"
            >
              {children.map((child, index) => {
                const childPath = `${childrenPath}[${index}]` as const
                const remove = () => removeArrayItem(form, childrenPath, index)
                return (
                  <SortableItem
                    key={child.id}
                    id={child.id}
                    label={`${child.type} ${index + 1}`}
                    align={child.type === 'condition' ? 'bottom' : 'center'}
                  >
                    {child.type === 'condition' ? (
                      <ConditionRow
                        form={form}
                        path={childPath}
                        onRemove={remove}
                      />
                    ) : (
                      <div className="border border-border p-4">
                        <ConditionGroup
                          form={form}
                          path={childPath}
                          onRemove={remove}
                        />
                      </div>
                    )}
                  </SortableItem>
                )
              })}
            </SortableList>
            <FieldError meta={childList.state.meta} />
          </div>
        )
      }}
    </form.Field>
  )
}
