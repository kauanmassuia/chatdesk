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

// Theme variables - easy to edit
const theme = {
  // Colors
  bubbleColor: '#2575fc',
  inputColor: '#ff9800',
  textColor: '#555',
  bgLight: 'white',
  bgDark: '#1A202C',
  borderLight: '#eaeaea',
  borderDark: '#2D3748',
  nodeBgLight: '#f5f5f5',
  nodeBgDark: '#2D3748',

  // Styling
  borderWidth: '1px',
  borderRadius: '6px',
  hoverScale: 1.03,
  buttonHeight: '36px',
  fontWeight: '600',

  // Typography
  fontSize: '12px',

  // Spacing
  sidebarWidth: '300px',
  padding: '8px',
  gap: '16px',
};

// Node types and their configurations
const nodeTypes = {
  bubbles: {
    title: 'Bubbles',
    color: theme.bubbleColor,
    items: [
      { icon: FiMessageSquare, label: 'Texto', type: 'text' },
      { icon: FiImage, label: 'Imagem', type: 'image' },
      { icon: FiVideo, label: 'Vídeo', type: 'video' },
      { icon: FiCode, label: 'Incorporar', type: 'embed' },
      { icon: FiHeadphones, label: 'Áudio', type: 'audio' },
    ],
  },
  inputs: {
    title: 'Inputs',
    color: theme.inputColor,
    items: [
      { icon: BsTextParagraph, label: 'Texto', type: 'input_text' },
      { icon: MdOutlineNumbers, label: 'Número', type: 'input_number' },
      { icon: MdOutlineEmail, label: 'E-mail', type: 'input_email' },
      { icon: TbWorldWww, label: 'Website', type: 'input_website' },
      { icon: BsCalendarDate, label: 'Data', type: 'input_date' },
      { icon: BsClock, label: 'Atraso', type: 'input_wait' },
      { icon: BsTelephone, label: 'Telefone', type: 'input_phone' },
      { icon: BsGrid, label: 'Botões', type: 'input_buttons' },
      { icon: HiOutlinePhotograph, label: 'Imagem', type: 'input_pic_choice' },
      { icon: MdPayment, label: 'Pagamento', type: 'input_payment' },
    ],
  },
};

const DraggableItem = ({ icon: Icon, label, type, borderColor }: {
  icon: any;
  label: string;
  type: string;
  borderColor: string;
}) => {
  const bgColor = useColorModeValue(theme.nodeBgLight, theme.nodeBgDark);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Button
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      variant="outline"
      leftIcon={<Icon size={14} color={borderColor} />}
      justifyContent="flex-start"
      w="full"
      bg={bgColor}
      borderWidth={theme.borderWidth}
      borderColor={borderColor}
      color={theme.textColor}
      _hover={{
        transform: `scale(${theme.hoverScale})`,
        borderColor: borderColor,
      }}
      _active={{
        transform: 'scale(1)',
      }}
      h={theme.buttonHeight}
      fontSize={theme.fontSize}
      borderRadius={theme.borderRadius}
      fontFamily="Poppins, sans-serif"
      transition="all 0.2s ease"
      boxShadow="none"
      fontWeight={theme.fontWeight}
    >
      {label}
    </Button>
  );
};

const NodeSection = ({ title, items, color }: {
  title: string;
  items: any[];
  color: string;
}) => (
  <Box>
    <Text
      fontWeight="bold"
      fontSize={theme.fontSize}
      mb={2}
      color={color}
      fontFamily="Poppins, sans-serif"
      letterSpacing="0.3px"
    >
      {title}
    </Text>
    <SimpleGrid columns={2} spacing={theme.gap}>
      {items.map((item) => (
        <DraggableItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          type={item.type}
          borderColor={color}
        />
      ))}
    </SimpleGrid>
  </Box>
);

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue(theme.bgLight, theme.bgDark);
  const borderColor = useColorModeValue(theme.borderLight, theme.borderDark);

  const filterItems = (items: any[]) => {
    return items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Box
      w={theme.sidebarWidth}
      h="calc(100vh - 56px)"
      bg={bgColor}
      borderRight={theme.borderWidth}
      borderColor={borderColor}
      p={theme.padding}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('#ddd', '#444'),
          borderRadius: '24px',
        },
      }}
    >
      <VStack align="stretch" spacing={4}>
        <Box position="relative">
          <Input
            placeholder="Buscar"
            size="sm"
            bg="transparent"
            borderColor={borderColor}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
            _focus={{
              borderColor: theme.bubbleColor,
              boxShadow: 'none',
            }}
            fontFamily="Poppins, sans-serif"
            fontSize={theme.fontSize}
            borderRadius={theme.borderRadius}
          />
          <IconButton
            aria-label="Ícone de Busca"
            icon={<FiSearch size={14} />}
            size="xs"
            position="absolute"
            top="50%"
            right="8px"
            transform="translateY(-50%)"
            bg="transparent"
            color={theme.textColor}
          />
        </Box>

        {Object.entries(nodeTypes).map(([key, section]) => (
          <NodeSection
            key={key}
            title={section.title}
            items={filterItems(section.items)}
            color={section.color}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
