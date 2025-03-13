import { BsCalendarDate } from 'react-icons/bs'
import InputNode from './InputNode'

interface DateInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const DateInputNode = ({ data, selected }: DateInputNodeProps) => {
  return (
    <InputNode
      icon={BsCalendarDate}
      label="Date Input"
      selected={selected}
      type="date"
      value={data.value}
      onChange={(value) => data.onChange('value', value)}
    />
  )
}

export default DateInputNode 