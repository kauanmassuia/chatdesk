import { BsClock } from 'react-icons/bs'
import InputNode from './InputNode'

interface WaitInputNodeProps {
  data: {
    value: string  // The wait time in seconds
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
      type="number"  // Type number since we're specifying a time in seconds
      value={data.value}
      onChange={(value) => data.onChange('value', value)}  // Update the value (seconds)
    />
  )
}

// Export function for the chat UI.
export function exportWaitInputNode(node: any) {
  return {
    type: 'input_wait',  // Type for wait node
    content: {
      waitTime: parseInt(node.data?.value || '0', 10),  // Convert to integer (seconds)
    },
  }
}

WaitInputNode.displayName = 'WaitInputNode'

export default WaitInputNode
