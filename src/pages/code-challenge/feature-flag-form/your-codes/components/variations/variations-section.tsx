import { removeArrayItem } from '../../form/array-items'
import { createVariation } from '../../form/flag-form-values'
import type { FlagFormApi } from '../../form/use-flag-form'
import { AddButton } from '../common/circle-button'
import { FieldError } from '../common/field-error'
import { VariationRow } from './variation-row'

interface VariationsSectionProps {
  form: FlagFormApi
}

export function VariationsSection({ form }: VariationsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg">Variation</h2>
      <form.Field name="variations" mode="array">
        {(field) => (
          <>
            {field.state.value.map((variation, index) => (
              <VariationRow
                key={variation.id}
                form={form}
                index={index}
                onRemove={() => removeArrayItem(form, 'variations', index)}
              />
            ))}
            <FieldError meta={field.state.meta} />
            <AddButton
              label="Add variation"
              onClick={() => field.pushValue(createVariation())}
            />
          </>
        )}
      </form.Field>
    </div>
  )
}
