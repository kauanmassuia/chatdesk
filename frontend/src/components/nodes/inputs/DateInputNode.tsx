import { BsCalendarDate } from 'react-icons/bs'
import InputNode from './InputNode'

interface DateInputNodeProps {
  data: {
    prompt: string // prompt text for what the user sees in the chat UI
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const DateInputNode = ({ data, selected }: DateInputNodeProps) => {
  // In the editor, use a simple text input to let the user define the prompt.
  return (
    <InputNode
      icon={BsCalendarDate}
      label="Date Input"
      selected={selected}
      placeholder="Digite a pergunta para data..."
      value={data.prompt}
      onChange={(value) => data.onChange('prompt', value)}
      type="text" // Use text input in the editor so you can type the prompt.
    />
  )
}

export function exportDateInputNode(node: any) {
  // When exporting, we want the chat UI to know that this is a date input.
  return {
    type: 'input_date',
    content: {
      prompt: node.data?.prompt || '',
    },
  }
}

DateInputNode.displayName = 'DateInputNode'

export default DateInputNode
