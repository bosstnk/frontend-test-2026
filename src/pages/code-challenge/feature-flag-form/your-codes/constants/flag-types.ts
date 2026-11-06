export const FLAG_TYPES = ['boolean', 'string', 'number', 'json'] as const

export type FlagType = (typeof FLAG_TYPES)[number]
