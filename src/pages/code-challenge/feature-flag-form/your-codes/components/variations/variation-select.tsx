import type { FlagFormApi } from '../../form/use-flag-form'
import { OptionSelect } from '../common/option-select'

interface VariationSelectProps {
  form: FlagFormApi
  value: string
  onValueChange: (value: string) => void
  className?: string
}

// เก็บ id ของ variation ไม่ใช่ชื่อ เปลี่ยนชื่อ variation แล้วตัวที่เลือกไว้จึงไม่หลุด
export function VariationSelect({
  form,
  value,
  onValueChange,
  className,
}: VariationSelectProps) {
  return (
    <form.Subscribe selector={(state) => state.values.variations}>
      {(variations) => (
        <OptionSelect
          label="Variation"
          options={variations.map((variation) => ({
            label: variation.name || '(no name)',
            value: variation.id,
          }))}
          value={value}
          onValueChange={onValueChange}
          placeholder="Select a variation"
          className={className}
        />
      )}
    </form.Subscribe>
  )
}
