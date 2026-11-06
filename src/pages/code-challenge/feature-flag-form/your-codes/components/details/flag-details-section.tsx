import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { FLAG_TYPES } from '../../constants/flag-types'
import type { FlagType } from '../../constants/flag-types'
import type { FlagFormApi } from '../../form/use-flag-form'
import { OptionSelect } from '../common/option-select'
import { SwitchField } from '../common/switch-field'
import { TextField } from '../common/text-field'

const FLAG_TYPE_OPTIONS = FLAG_TYPES.map((type) => ({
  label: type,
  value: type,
}))

interface FlagDetailsSectionProps {
  form: FlagFormApi
}

export function FlagDetailsSection({ form }: FlagDetailsSectionProps) {
  return (
    <div className="grid grid-cols-12 items-end gap-x-4 gap-y-5">
      <form.Field name="flagName">
        {(field) => (
          <TextField
            field={field}
            id="flag-name"
            label="Flag Name"
            className="col-span-12 md:col-span-6"
          />
        )}
      </form.Field>
      <form.Field name="disable">
        {(field) => (
          <SwitchField
            field={field}
            id="disable"
            label="Disable"
            className="col-span-6 md:col-span-3"
          />
        )}
      </form.Field>
      <form.Field name="trackEvents">
        {(field) => (
          <SwitchField
            field={field}
            id="track-event"
            label="Track event"
            className="col-span-6 md:col-span-3"
          />
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <div className="col-span-12 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="type">
        {(field) => (
          <div className="col-span-12 md:col-span-3">
            <OptionSelect
              label="Flag Type"
              options={FLAG_TYPE_OPTIONS}
              value={field.state.value}
              // ตัวเลือกทุกตัวมาจาก FLAG_TYPES จึง cast ได้
              onValueChange={(value) => field.handleChange(value as FlagType)}
              className="w-full"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="version">
        {(field) => (
          <TextField
            field={field}
            id="version"
            label="Version"
            className="col-span-12 md:col-span-3"
          />
        )}
      </form.Field>
    </div>
  )
}
