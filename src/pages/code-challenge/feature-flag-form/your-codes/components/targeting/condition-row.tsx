import { useId } from 'react'
import { getBy, useStore } from '@tanstack/react-form'
import { OPERATORS } from '../../constants/operators'
import type { NodePath } from '../../form/flag-form-values'
import type { FlagFormApi } from '../../form/use-flag-form'
import { RemoveButton } from '../common/circle-button'
import { OptionSelect } from '../common/option-select'
import { TextField } from '../common/text-field'

interface ConditionRowProps {
  form: FlagFormApi
  // เช่น rules[0].root.children[1].children[0]
  path: NodePath
  onRemove: () => void
}

export function ConditionRow({ form, path, onRemove }: ConditionRowProps) {
  const id = useId()
  const fieldName = `${path}.field` as const
  const operatorName = `${path}.operator` as const
  const valueName = `${path}.value` as const

  // pr (is present) ไม่มี value จึงซ่อนช่อง
  // ใช้ selector ให้แถวนี้ re-render เฉพาะตอนเลือก / เลิกเลือก pr ไม่ใช่ทุกครั้งที่พิมพ์ในฟอร์ม
  const needsValue = useStore(
    form.store,
    (state) => getBy(state.values, operatorName) !== 'pr',
  )

  return (
    <div className="grid grid-cols-12 items-end gap-x-4 gap-y-5 py-1">
      <form.Field name={fieldName}>
        {(field) => (
          <TextField
            field={field}
            id={`${id}-field`}
            label="Field"
            className="col-span-12 md:col-span-4"
          />
        )}
      </form.Field>
      <form.Field name={operatorName}>
        {(field) => (
          <div className="col-span-12 md:col-span-3">
            <OptionSelect
              label="Operator"
              options={OPERATORS}
              // ค่าใต้ root เป็น unknown ใน type ของฟอร์ม
              value={field.state.value as string}
              onValueChange={field.handleChange}
              className="w-full"
            />
          </div>
        )}
      </form.Field>
      {needsValue ? (
        <form.Field name={valueName}>
          {(field) => (
            <TextField
              field={field}
              id={`${id}-value`}
              label="Value"
              className="col-span-11 md:col-span-4"
            />
          )}
        </form.Field>
      ) : (
        // เว้นที่ไว้ ปุ่มลบจึงอยู่ตำแหน่งเดียวกับแถวอื่น
        <div aria-hidden className="col-span-11 md:col-span-4" />
      )}
      <RemoveButton
        label="Remove condition"
        onClick={onRemove}
        className="col-span-1 mb-1"
      />
    </div>
  )
}
