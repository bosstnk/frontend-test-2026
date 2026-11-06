import { FlagForm } from './components/flag-form'
import { ErrorSummary } from './components/preview/error-summary'
import { JsonPreview } from './components/preview/json-preview'
import { useFlagForm } from './form/use-flag-form'
import { toFlagConfig } from './output/to-flag-config'

function YourCode() {
  const form = useFlagForm()

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <FlagForm form={form} />
      </div>
      <div className="xl:sticky xl:top-4 xl:col-span-1">
        {/* ส่วนเดียวที่ subscribe ค่าทั้งฟอร์ม เพราะ preview ต้องเปลี่ยนตามทุกช่อง ส่วนอื่น subscribe แค่ช่องของตัวเอง */}
        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <div className="space-y-4">
              <ErrorSummary values={values} />
              <JsonPreview value={toFlagConfig(values)} />
            </div>
          )}
        </form.Subscribe>
      </div>
    </div>
  )
}

export default YourCode
