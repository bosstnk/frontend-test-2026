import type { FlagFormApi } from '../form/use-flag-form'
import { DefaultRuleSection } from './default-rule/default-rule-section'
import { FlagDetailsSection } from './details/flag-details-section'
import { TargetingSection } from './targeting/targeting-section'
import { VariationsSection } from './variations/variations-section'

interface FlagFormProps {
  form: FlagFormApi
}

export function FlagForm({ form }: FlagFormProps) {
  return (
    <section className="space-y-8 bg-card p-6">
      <FlagDetailsSection form={form} />
      <VariationsSection form={form} />
      <TargetingSection form={form} />
      <DefaultRuleSection form={form} />
    </section>
  )
}
