import { moveArrayItem, removeArrayItem } from '../../form/array-items'
import { createRule } from '../../form/flag-form-values'
import type { FlagFormApi } from '../../form/use-flag-form'
import { AddButton } from '../common/circle-button'
import { SortableItem, SortableList } from '../common/sortable-list'
import { RuleCard } from './rule-card'

interface TargetingSectionProps {
  form: FlagFormApi
}

export function TargetingSection({ form }: TargetingSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg">Target specific users</h2>
      <form.Field name="rules" mode="array">
        {(field) => (
          <>
            <SortableList
              ids={field.state.value.map((rule) => rule.id)}
              onMove={(from, to) => moveArrayItem(form, 'rules', from, to)}
              className="space-y-4"
            >
              {field.state.value.map((rule, index) => (
                <SortableItem
                  key={rule.id}
                  id={rule.id}
                  label={`rule ${index + 1}`}
                >
                  <RuleCard
                    form={form}
                    ruleIndex={index}
                    onRemove={() => removeArrayItem(form, 'rules', index)}
                  />
                </SortableItem>
              ))}
            </SortableList>
            <div className="flex items-center gap-2">
              {field.state.value.length === 0 && (
                <p className="text-sm">Add Rule</p>
              )}
              <AddButton
                label="Add rule"
                onClick={() => field.pushValue(createRule())}
              />
            </div>
          </>
        )}
      </form.Field>
    </div>
  )
}
