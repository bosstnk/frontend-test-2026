import type { FlagFormApi } from '../../form/use-flag-form'
import { FieldError } from '../common/field-error'
import { VariationSelect } from '../variations/variation-select'

interface DefaultRuleSectionProps {
  form: FlagFormApi
}

export function DefaultRuleSection({ form }: DefaultRuleSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg">Default</h2>
      <div className="flex items-start gap-4">
        <p className="flex h-8 items-center text-sm">Serve</p>
        <form.Field name="defaultVariationId">
          {(field) => (
            <div className="flex-1 space-y-1">
              <VariationSelect
                form={form}
                value={field.state.value}
                onValueChange={field.handleChange}
                className="w-full"
              />
              <FieldError meta={field.state.meta} />
            </div>
          )}
        </form.Field>
      </div>
    </div>
  )
}
