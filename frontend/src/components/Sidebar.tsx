import React, { useState } from 'react';
import {
  VStack,
  Box,
  Input,
  Text,
  SimpleGrid,
  Button,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiMessageSquare,
  FiImage,
  FiVideo,
  FiCode,
  FiHeadphones,
} from 'react-icons/fi';
import {
  BsTextParagraph,
  BsCalendarDate,
  BsClock,
  BsTelephone,
  BsGrid,
} from 'react-icons/bs';
import {
  MdOutlineNumbers,
  MdOutlineEmail,
  MdPayment,
} from 'react-icons/md';
import { TbWorldWww } from 'react-icons/tb';
import { HiOutlinePhotograph } from 'react-icons/hi';

const DraggableItem = ({
  icon: Icon,
  label,
  type,
  colorScheme = 'gray',
}: {
  icon: any;
  label: string;
  type: string;
  colorScheme?: string;
}) => {
  const bgColor = useColorModeValue('white', '#2D3748');
  const hoverBg = useColorModeValue('#f5f5f5', '#4A5568');

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Button
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      variant="outline"
      leftIcon={<Icon size={16} />}
      justifyContent="flex-start"
      w="full"
      bg={bgColor}
      borderColor={colorScheme === 'orange' ? '#ff9800' : colorScheme === 'blue' ? '#2575fc' : 'gray.200'}
      color={colorScheme === 'orange' ? '#ff9800' : colorScheme === 'blue' ? '#2575fc' : undefined}
      _hover={{
        bg: hoverBg,
        borderColor: colorScheme === 'orange' ? '#e68a00' : colorScheme === 'blue' ? '#1a63d8' : 'gray.300',
        color: colorScheme === 'orange' ? '#e68a00' : colorScheme === 'blue' ? '#1a63d8' : undefined,
        transform: 'scale(1.05)',
      }}
      _active={{
        transform: 'scale(1)',
      }}
      size="sm"
      h="40px"
      borderRadius="md"
      transition="transform 0.3s ease"
      fontFamily="Poppins, sans-serif"
    >
      {label}
    </Button>
  );
};

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue('white', '#1A202C');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Dados de Bubbles e Inputs
  const bubbles = [
    { icon: FiMessageSquare, label: 'Texto', type: 'text', colorScheme: 'blue' },
    { icon: FiImage, label: 'Imagem', type: 'image', colorScheme: 'blue' },
    { icon: FiVideo, label: 'Vídeo', type: 'video', colorScheme: 'blue' },
    { icon: FiCode, label: 'Incorporar', type: 'embed', colorScheme: 'blue' },
    { icon: FiHeadphones, label: 'Áudio', type: 'audio', colorScheme: 'blue' },
  ];

  const inputs = [
    { icon: BsTextParagraph, label: 'Texto', type: 'input_text', colorScheme: 'orange' },
    { icon: MdOutlineNumbers, label: 'Número', type: 'input_number', colorScheme: 'orange' },
    { icon: MdOutlineEmail, label: 'E-mail', type: 'input_email', colorScheme: 'orange' },
    { icon: TbWorldWww, label: 'Website', type: 'input_website', colorScheme: 'orange' },
    { icon: BsCalendarDate, label: 'Data', type: 'input_date', colorScheme: 'orange' },
    { icon: BsClock, label: 'Atraso', type: 'input_wait', colorScheme: 'orange' },
    { icon: BsTelephone, label: 'Telefone', type: 'input_phone', colorScheme: 'orange' },
    { icon: BsGrid, label: 'Botões', type: 'input_buttons', colorScheme: 'orange' },
    { icon: HiOutlinePhotograph, label: 'Imagem', type: 'input_pic_choice', colorScheme: 'orange' },
    { icon: MdPayment, label: 'Pagamento', type: 'input_payment', colorScheme: 'orange' },
  ];

  // Função para filtrar itens conforme a pesquisa
  const filterItems = (items: { label: string }[]) => {
    return items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  return (
    <Box
      w="300px"
      h="calc(100vh - 56px)"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      py={6}
      px={4}
      overflowY="auto"
      boxShadow="lg"
      css={{
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: useColorModeValue('#EDF2F7', '#2D3748'),
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('#A0AEC0', '#4A5568'),
          borderRadius: '24px',
        },
      }}
    >
      <VStack align="stretch" spacing={6}>
        {/* Campo de busca com ícone */}
        <Box position="relative">
          <Input
            placeholder="Buscar"
            size="md"
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={borderColor}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
            _focus={{
              borderColor: useColorModeValue('#2575fc', '#ff9800'),
              boxShadow: '0px 0px 4px rgba(37,117,252,0.5)',
            }}
            fontFamily="Outfit, sans-serif"
          />
          <IconButton
            aria-label="Ícone de Busca"
            icon={<FiSearch />}
            size="sm"
            position="absolute"
            top="50%"
            right="10px"
            transform="translateY(-50%)"
            bg="transparent"
          />
        </Box>

        {/* Seção de Bubbles */}
        <Box>
          <Text
            fontWeight="bold"
            fontSize="sm"
            mb={3}
            color="#2575fc"
            fontFamily="Poppins, sans-serif"
          >
            Bubbles
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            {filterItems(bubbles).map((item) => (
              <DraggableItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                type={item.type}
                colorScheme="blue"
              />
            ))}
          </SimpleGrid>
        </Box>

        {/* Seção de Inputs */}
        <Box>
          <Text
            fontWeight="bold"
            fontSize="sm"
            mb={3}
            color="#ff9800"
            fontFamily="Poppins, sans-serif"
          >
            Inputs
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            {filterItems(inputs).map((item) => (
              <DraggableItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                type={item.type}
                colorScheme="orange"
              />
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
