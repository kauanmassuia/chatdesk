import { BsTelephone } from 'react-icons/bs'
import InputNode from './InputNode'

interface PhoneInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const PhoneInputNode = ({ data, selected }: PhoneInputNodeProps) => {
  return (
    <InputNode
      icon={BsTelephone}
      label="Phone Input"
      selected={selected}
      type="tel"
      placeholder="(00) 00000-0000"
      value={data.value}
      onChange={(value) => data.onChange('value', value)}
      validation={{
        pattern: '\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}',
        message: 'Por favor, digite um telefone no formato (00) 00000-0000'
      }}
    />
  )
}

export default PhoneInputNode 