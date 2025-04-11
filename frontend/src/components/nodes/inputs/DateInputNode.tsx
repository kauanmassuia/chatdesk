import { BsCalendarDate } from 'react-icons/bs'
import InputNode from './InputNode'
import { Box, Text, Input, Button, VStack, HStack, FormControl } from '@chakra-ui/react';
import { exportBaseInputNodeData } from './InputNode';

interface DateInputNodeProps {
  data: {
    prompt: string // prompt text for what the user sees in the chat UI
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
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
      name={data.name}
      onChange={(value) => data.onChange('prompt', value)}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
      type="text" // Use text input in the editor so you can type the prompt.
    />
  )
}

export function exportDateInputNode(node: any) {
  // When exporting, we want the chat UI to know that this is a date input.
  return {
    type: 'input_date',
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.prompt || '',
      validation: {
        pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$",
        message: "Por favor, digite uma data válida no formato DD/MM/AAAA"
      }
    },
  }
}

export function renderDateInputNode({ node, inputValue, setInputValue, handleKeyDown, handleInputSubmit, isInvalid }: any) {
  // When rendering in the conversation, only show the prompt
  if (node?.content?.answered) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // Get validation from node or use default
  const validationPattern = node?.content?.validation?.pattern || "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$";
  const validationMessage = node?.content?.validation?.message || "Por favor, digite uma data válida no formato DD/MM/AAAA";

  // Custom validation for dates
  let isDateInvalid = false;
  if (inputValue && inputValue.length === 10) {
    if (!new RegExp(validationPattern).test(inputValue)) {
      isDateInvalid = true;
    } else {
      // Additional validation to check if it's a real date
      try {
        const [day, month, year] = inputValue.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const isValidDate = date.getDate() === parseInt(day) &&
                          date.getMonth() === parseInt(month) - 1 &&
                          date.getFullYear() === parseInt(year);
        isDateInvalid = !isValidDate;
      } catch (e) {
        isDateInvalid = true;
      }
    }
  }

  // For input field rendering (right side of the chat)
  return (
    <div className="p-1">
      <div className="relative">
        <input
          type="text"
          value={inputValue || ''}
          onChange={(e) => {
            // Accept only digits and slashes for date input
            const value = e.target.value.replace(/[^\d/]/g, '');

            // Format as user types: add slashes automatically
            let formattedValue = value;
            if (value.length === 2 && !value.includes('/')) {
              formattedValue = value + '/';
            } else if (value.length === 5 && value.indexOf('/') === 2 && !value.includes('/', 3)) {
              formattedValue = value + '/';
            }

            setInputValue(formattedValue);
          }}
          onKeyDown={handleKeyDown}
          placeholder="DD/MM/AAAA"
          className={`w-full px-3 py-2 border ${isDateInvalid && inputValue?.length === 10 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          maxLength={10}
          autoFocus
        />
        {isDateInvalid && inputValue?.length === 10 && (
          <div className="text-red-500 text-sm mt-1">
            {validationMessage}
          </div>
        )}
      </div>
      <button
        onClick={handleInputSubmit}
        disabled={(isDateInvalid && !!(inputValue || '')) || (inputValue ? inputValue.length < 10 : false)}
        className={`mt-2 px-4 py-2 rounded-md w-full ${(isDateInvalid && inputValue) || inputValue?.length < 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        Enviar
      </button>
    </div>
  );
}

// Helper to convert between ISO date format and Brazilian format (dd/mm/yyyy)
export function formatDateBrazilian(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return isoDate;
  }
}

export function parseToIsoDate(brDate: string): string {
  if (!brDate) return '';
  try {
    const [day, month, year] = brDate.split('/');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return brDate;
  }
}

DateInputNode.displayName = 'DateInputNode'

export default DateInputNode
