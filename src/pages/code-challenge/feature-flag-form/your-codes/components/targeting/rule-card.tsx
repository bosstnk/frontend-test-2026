import { Input } from '#/components/ui/input'
import type { FlagFormApi } from '../../form/use-flag-form'
import { RemoveButton } from '../common/circle-button'
import { FieldError, visibleError } from '../common/field-error'
import { VariationSelect } from '../variations/variation-select'
import { ConditionGroup } from './condition-group'

interface RuleCardProps {
  form: FlagFormApi
  ruleIndex: number
  onRemove: () => void
}

export function RuleCard({ form, ruleIndex, onRemove }: RuleCardProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="space-y-2 border border-border p-4">
        <ConditionGroup form={form} path={`rules[${ruleIndex}].root`} />
        <div className="flex items-start gap-4">
          <p className="flex h-8 items-center text-sm">Serve</p>
          <form.Field name={`rules[${ruleIndex}].variationId`}>
            {(field) => (
              <div className="space-y-1">
                <VariationSelect
                  form={form}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="w-60"
                />
                <FieldError meta={field.state.meta} />
              </div>
            )}
          </form.Field>
          <form.Field name={`rules[${ruleIndex}].percentage`}>
            {(field) => (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    aria-label="Percentage"
                    className="w-20"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={visibleError(field.state.meta) !== undefined}
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <FieldError meta={field.state.meta} />
              </div>
            )}
          </form.Field>
        </div>
      </div>
      <RemoveButton
        label="Remove rule"
        icon="x"
        onClick={onRemove}
        className="mb-1"
      />
    </div>
  )
}
