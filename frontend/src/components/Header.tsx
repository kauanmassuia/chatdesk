import {
  HStack,
  Button,
  IconButton,
  useColorModeValue,
  Box,
  Container,
  Image,
} from '@chakra-ui/react';
import { FiArrowLeft, FiLink, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';
import { RiFlaskLine } from 'react-icons/ri';
import { useFlowStore } from '../store/flowStore';
import { exportFlowAsJson } from '../utils/exportFlowAsJson'; // Função de exportação central

const Header: React.FC = () => {
  const { nodes, edges } = useFlowStore();

  const handleExport = () => {
    const flowJson = exportFlowAsJson(nodes, edges);
    const blob = new Blob([JSON.stringify(flowJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Cores customizadas
  const borderColor = useColorModeValue('#ff9800', '#2575fc'); // Laranja no modo claro, azul no escuro
  const bgColor = useColorModeValue('white', '#1a202c'); // Branco no modo claro, cinza escuro no modo escuro
  const buttonHoverColor = useColorModeValue('#2575fc', '#ff9800'); // Azul no claro, laranja no escuro

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      h="64px"
      borderBottom="2px solid"
      borderColor={borderColor}
      bg={bgColor}
      zIndex={1000}
      boxShadow="lg"
    >
      <Container maxW="1440px" h="100%" px={6}>
        <HStack h="100%" spacing={6} align="center">
          {/* Grupo de navegação - Ícones à esquerda */}
          <HStack spacing={4} minW="200px">
            <IconButton
              aria-label="Voltar"
              icon={<FiArrowLeft />}
              variant="ghost"
              size="md"
              _hover={{ color: buttonHoverColor }}
            />
            <IconButton
              aria-label="Link"
              icon={<FiLink />}
              variant="ghost"
              size="md"
              _hover={{ color: buttonHoverColor }}
            />
            <IconButton
              aria-label="Atualizar"
              icon={<FiRefreshCw />}
              variant="ghost"
              size="md"
              _hover={{ color: buttonHoverColor }}
            />
            <IconButton
              aria-label="Ajuda"
              icon={<FiHelpCircle />}
              variant="ghost"
              size="md"
              _hover={{ color: buttonHoverColor }}
            />
          </HStack>

          {/* Logo do Projeto */}
          <Box flex={1} textAlign="center">
            <Image
              src="/src/assets/logovendflow.png" // Substitua pelo caminho da sua logo
              alt="Logo do Projeto"
              width="150px" // Largura desejada
              height="auto" // Mantém a proporção da altura
              mx="auto" // Centraliza horizontalmente
            />
          </Box>

          {/* Menu principal */}
          <HStack spacing={4} justifyContent="flex-end">
            <Button size="sm" colorScheme="blue" variant="solid">
              Flow
            </Button>
            <Button size="sm" colorScheme="blue" variant="outline">
              Tema
            </Button>
            <Button size="sm" colorScheme="blue" variant="ghost">
              Configurações
            </Button>
            <Button size="sm" colorScheme="blue" onClick={handleExport}>
              Exportar
            </Button>
          </HStack>

          {/* Ações à direita */}
          <HStack spacing={4} minW="200px">
            <Button
              size="sm"
              colorScheme="orange"
              leftIcon={<RiFlaskLine />}
            >
              Testar
            </Button>
            <Button
              size="sm"
              bg="#ff9800"
              color={'white'}
              _hover={{ bg: '#e68a00' }} // Hover mais escuro para o botão laranja
            >
              Publicar
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default Header;
