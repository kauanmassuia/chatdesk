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
  const bgColor = useColorModeValue('white', '#2D3748'); // Branco no modo claro, cinza escuro no modo escuro
  const hoverBg = useColorModeValue('#f5f5f5', '#4A5568'); // Cinza claro no modo claro, cinza médio no escuro

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
        color: colorScheme === 'orange' ? '#e68a00' : colorScheme === 'blue' ? '#1a63d8' : undefined, // Hover mais escuro
      }}
      size="sm"
      h="40px"
      borderRadius="md" // Bordas arredondadas
    >
      {label}
    </Button>
  );
};

const Sidebar = () => {
  const bgColor = useColorModeValue('white', '#1A202C'); // Fundo branco no modo claro, cinza escuro no modo escuro
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
      boxShadow="lg" // Sombra na sidebar
      css={{
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: useColorModeValue('#EDF2F7', '#2D3748'), // Fundo do scroll
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('#A0AEC0', '#4A5568'), // Cor do scroll
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
            _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
            _focus={{
              borderColor: useColorModeValue('#2575fc', '#ff9800'), // Azul ou laranja ao focar
              boxShadow: '0px 0px 4px rgba(37,117,252,0.5)', // Sombra ao focar
            }}
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
            color="#2575fc" // Azul para título da seção Bubbles
          >
            Bubbles
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            <DraggableItem icon={FiMessageSquare} label="Texto" type="text" colorScheme="blue" />
            <DraggableItem icon={FiImage} label="Imagem" type="image" colorScheme="blue" />
            <DraggableItem icon={FiVideo} label="Vídeo" type="video" colorScheme="blue" />
            <DraggableItem icon={FiCode} label="Incorporar" type="embed" colorScheme="blue" />
            <DraggableItem icon={FiHeadphones} label="Áudio" type="audio" colorScheme="blue" />
          </SimpleGrid>
        </Box>

        {/* Seção de Inputs */}
        <Box>
          <Text
            fontWeight="bold"
            fontSize="sm"
            mb={3}
            color="#ff9800" // Laranja para título da seção Inputs
          >
            Inputs
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            <DraggableItem icon={BsTextParagraph} label="Texto" type="input_text" colorScheme="orange" />
            <DraggableItem icon={MdOutlineNumbers} label="Número" type="input_number" colorScheme="orange" />
            <DraggableItem icon={MdOutlineEmail} label="E-mail" type="input_email" colorScheme="orange" />
            <DraggableItem icon={TbWorldWww} label="Website" type="input_website" colorScheme="orange" />
            <DraggableItem icon={BsCalendarDate} label="Data" type="input_date" colorScheme="orange" />
            <DraggableItem icon={BsClock} label="Delay" type="input_wait" colorScheme="orange" />
            <DraggableItem icon={BsTelephone} label="Telefone" type="input_phone" colorScheme="orange" />
            <DraggableItem icon={BsGrid} label="Botões" type="input_buttons" colorScheme="orange" />
            <DraggableItem icon={HiOutlinePhotograph} label="Imagem" type="input_pic_choice" colorScheme="orange" />
            <DraggableItem icon={MdPayment} label="Pagamento" type="input_payment" colorScheme="orange" />
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
