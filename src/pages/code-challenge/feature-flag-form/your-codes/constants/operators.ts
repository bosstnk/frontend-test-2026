// as const: schema สร้าง z.enum จาก list นี้ได้ dropdown กับ schema จึงใช้ list เดียวกัน
export const OPERATORS = [
  { label: 'equals (==)', value: '==' },
  { label: 'not equals (!=)', value: '!=' },
  { label: 'greater than (>)', value: '>' },
  { label: 'greater or equal (>=)', value: '>=' },
  { label: 'less than (<)', value: '<' },
  { label: 'less or equal (<=)', value: '<=' },
  { label: 'contains (co)', value: 'co' },
  { label: 'starts with (sw)', value: 'sw' },
  { label: 'ends with (ew)', value: 'ew' },
  { label: 'in list (in)', value: 'in' },
  { label: 'is present (pr)', value: 'pr' },
] as const
