import { BsClock } from 'react-icons/bs'
import InputNode from './InputNode'

interface TimeInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const TimeInputNode = ({ data, selected }: TimeInputNodeProps) => {
  return (
    <InputNode
      icon={BsClock}
      label="Time Input"
      selected={selected}
      type="time"
      value={data.value}
      onChange={(value) => data.onChange('value', value)}
    />
  )
}

export default TimeInputNode 