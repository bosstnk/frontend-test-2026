import { useId } from 'react'
import type { FlagFormApi } from '../../form/use-flag-form'
import { RemoveButton } from '../common/circle-button'
import { TextField } from '../common/text-field'

interface VariationRowProps {
  form: FlagFormApi
  index: number
  onRemove: () => void
}

export function VariationRow({ form, index, onRemove }: VariationRowProps) {
  const id = useId()

  return (
    <div className="grid grid-cols-12 items-end gap-x-4 gap-y-5">
      <form.Field name={`variations[${index}].name`}>
        {(field) => (
          <TextField
            field={field}
            id={`${id}-name`}
            label="Name"
            className="col-span-12 md:col-span-6"
          />
        )}
      </form.Field>
      <form.Field name={`variations[${index}].value`}>
        {(field) => (
          <TextField
            field={field}
            id={`${id}-value`}
            label="Flag-Value"
            className="col-span-11 md:col-span-5"
          />
        )}
      </form.Field>
      <RemoveButton
        label="Remove variation"
        onClick={onRemove}
        className="col-span-1 mb-1"
      />
    </div>
  )
}
