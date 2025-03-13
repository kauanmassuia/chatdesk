import { TbWorldWww } from 'react-icons/tb'
import InputNode from './InputNode'

interface WebsiteInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const WebsiteInputNode = ({ data, selected }: WebsiteInputNodeProps) => {
  return (
    <InputNode
      icon={TbWorldWww}
      label="Website Input"
      selected={selected}
      type="url"
      placeholder="Digite a URL do site..."
      value={data.value}
      onChange={(value) => data.onChange('value', value)}
      validation={{
        pattern: 'https?://.+',
        message: 'Por favor, digite uma URL válida começando com http:// ou https://'
      }}
    />
  )
}

export default WebsiteInputNode 