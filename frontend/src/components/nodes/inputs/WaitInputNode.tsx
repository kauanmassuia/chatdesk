import { BsClock } from 'react-icons/bs'
import InputNode from './InputNode'

interface WaitInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const WaitInputNode = ({ data, selected }: WaitInputNodeProps) => {
  return (
    <InputNode
      icon={BsClock}
      label="Wait Time (seconds)"
      selected={selected}
      type="number"
      value={data.value}
      onChange={(value) => data.onChange('value', value)}
    />
  )
}

export default WaitInputNode
