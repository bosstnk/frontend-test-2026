import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

export interface SelectOption {
  label: string
  value: string
}

interface OptionSelectProps {
  // หัวข้อที่แสดงบนสุดของรายการตัวเลือก
  label: string
  options: readonly SelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  // class ของปุ่มเปิดรายการ เช่น ความกว้าง
  className?: string
}

export function OptionSelect({
  label,
  options,
  value,
  onValueChange,
  placeholder,
  className,
}: OptionSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={1}>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
