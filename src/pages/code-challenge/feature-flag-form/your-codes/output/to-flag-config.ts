import type { FlagType } from '../constants/flag-types'
import { ruleRoot } from '../form/flag-form-values'
import type { FlagFormValues } from '../form/flag-form-values'
import { toGroupQuery } from '../rule-tree'
import type {
  FlagConfig,
  FlagDefinition,
  JsonValue,
  TargetingRule,
} from './flag-config'

// แปลงไม่ได้ → คืนข้อความเดิม ให้ preview แสดงสิ่งที่พิมพ์ (schema แจ้ง error ให้แล้ว)
function toVariationValue(text: string, type: FlagType): JsonValue {
  switch (type) {
    case 'boolean':
      if (text === 'true') return true
      if (text === 'false') return false
      return text
    case 'number': {
      const number = Number(text)
      return text.trim() !== '' && Number.isFinite(number) ? number : text
    }
    case 'json':
      try {
        return JSON.parse(text) as JsonValue
      } catch {
        return text
      }
    case 'string':
      return text
  }
}

// ค่าในฟอร์ม → JSON ตาม expected.json
// - ฟอร์มอ้าง variation ด้วย id แล้วแปลงเป็นชื่อที่นี่ เปลี่ยนชื่อ variation แล้ว rule จึงไม่หลุด
// - field ที่ expected.json ไม่มี ใส่เฉพาะตอนไม่ใช่ค่า default ของ GO Feature Flag
export function toFlagConfig(values: FlagFormValues): FlagConfig {
  const variationName = (id: string) =>
    values.variations.find((variation) => variation.id === id)?.name

  const flag: FlagDefinition = {
    variations: Object.fromEntries(
      values.variations.map((variation) => [
        variation.name,
        toVariationValue(variation.value, values.type),
      ]),
    ),
  }

  if (values.rules.length > 0) {
    flag.targeting = values.rules.map((rule) => {
      const target: TargetingRule = {
        query: toGroupQuery(ruleRoot(rule)),
      }
      const percentage = Number(rule.percentage)
      if (rule.percentage.trim() !== '' && Number.isFinite(percentage)) {
        target.percentage = percentage
      }
      const variation = variationName(rule.variationId)
      if (variation !== undefined) target.variation = variation
      return target
    })
  }

  const defaultVariation = variationName(values.defaultVariationId)
  if (defaultVariation !== undefined) {
    flag.defaultRule = { variation: defaultVariation }
  }

  if (values.disable) flag.disable = true
  if (!values.trackEvents) flag.trackEvents = false
  if (values.version.trim() !== '') flag.version = values.version
  if (values.description.trim() !== '') {
    flag.metadata = { description: values.description }
  }

  return { flags: { [values.flagName]: flag } }
}
