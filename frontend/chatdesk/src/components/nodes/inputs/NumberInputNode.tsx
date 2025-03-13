import { MdOutlineNumbers } from 'react-icons/md'
import InputNode from './InputNode'

interface NumberInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const NumberInputNode = ({ data, selected }: NumberInputNodeProps) => {
  return (
    <InputNode
      icon={MdOutlineNumbers}
      label="Number Input"
      selected={selected}
      type="number"
      placeholder="Digite um número..."
      value={data.value}
      onChange={(value) => data.onChange('value', value)}
      validation={{
        pattern: '[0-9]*',
        message: 'Por favor, digite apenas números'
      }}
    />
  )
}

export default NumberInputNode 