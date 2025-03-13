import { MdOutlineEmail } from 'react-icons/md'
import InputNode from './InputNode'

interface EmailInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const EmailInputNode = ({ data, selected }: EmailInputNodeProps) => {
  return (
    <InputNode
      icon={MdOutlineEmail}
      label="Email Input"
      selected={selected}
      type="email"
      placeholder="Digite seu email..."
      value={data.value}
      onChange={(value) => data.onChange('value', value)}
      validation={{
        pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
        message: 'Por favor, digite um email válido'
      }}
    />
  )
}

export default EmailInputNode 