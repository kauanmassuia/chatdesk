import {
  HStack,
  Button,
  IconButton,
  useColorModeValue,
  Box,
  Container,
  useDisclosure,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiChevronLeft, FiHelpCircle, FiMoreHorizontal } from 'react-icons/fi';
import { BsLightning } from 'react-icons/bs';
import { RiTestTubeLine, RiUploadCloudLine } from 'react-icons/ri';
import { useFlowStore } from '../store/flowStore';
import { exportFlowAsJson } from '../utils/exportFlowAsJson';
import ImportFlowModal from './modal/ImportFlowModal';
import Publish from './buttons/Publish'; // imported new Publish component
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  flowId: string | null;
}

const Header: React.FC<HeaderProps> = ({ flowId }) => {
  const { nodes, edges } = useFlowStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

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

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');

  const menuVariant = useBreakpointValue({ base: 'solid', md: 'ghost' });

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      h="56px"
      borderBottom="1px"
      borderColor={borderColor}
      bg={bgColor}
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW="1440px" h="100%" px={6}>
        <HStack h="100%" spacing={6} align="center" justify="space-between">
          {/* Navigation Group */}
          <HStack spacing={3} minW="240px">
            <IconButton
              aria-label="Voltar"
              icon={<FiChevronLeft />}
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')} // Redirecionando para /dashboard
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave e texto cinza
              _active={{ bg: '#ff9800', color: 'white' }} // Fundo laranja quando ativo
              transition="all 0.3s ease"
            />
            
            {/* Funnel Name (Hypothetical) */}
            <Text fontSize="sm" fontWeight="semibold" color="gray.600">
              Funil de Vendas {/* Placeholder name */}
            </Text>

            <IconButton
              aria-label="Ajuda"
              icon={<FiHelpCircle />}
              variant="ghost"
              size="sm"
              onClick={() => navigate('/docs')} // Redirecionando para /docs
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave e texto cinza
              _active={{ bg: '#ff9800', color: 'white' }} // Fundo laranja quando ativo
              transition="all 0.3s ease"
            />
          </HStack>

          {/* Main Menu (Centralizado) */}
          <HStack spacing={6} flex={1} justify="center" display={{ base: 'none', md: 'flex' }}>
            <Button
              size="sm"
              variant="outline" // Botão com fundo transparente
              color="#6c757d" // Texto cinza
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800' // Borda laranja quando selecionado
              }} // Seleção com fundo branco e borda laranja
              transition="all 0.3s ease"
            >
              Flow
            </Button>
            <Button
              size="sm"
              variant="outline" // Botão com fundo transparente
              color="#6c757d" // Texto cinza
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800' // Borda laranja quando selecionado
              }} // Seleção com fundo branco e borda laranja
              transition="all 0.3s ease"
            >
              Tema
            </Button>
            <Button
              size="sm"
              variant="outline" // Botão com fundo transparente
              color="#6c757d" // Texto cinza
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800' // Borda laranja quando selecionado
              }} // Seleção com fundo branco e borda laranja
              transition="all 0.3s ease"
            >
              Configurações
            </Button>
            <Button
              size="sm"
              variant="outline" // Botão com fundo transparente
              color="#6c757d" // Texto cinza
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800' // Borda laranja quando selecionado
              }} // Seleção com fundo branco e borda laranja
              onClick={() => flowId && navigate(`/editor?flow_id=${flowId}/results`)}
              transition="all 0.3s ease"
            >
              Resultados
            </Button>
          </HStack>

          {/* More Options (Import and Export) */}
          <HStack spacing={4} minW="240px" justify="flex-end">
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreHorizontal />}
                variant="ghost"
                aria-label="Mais opções"
                size="sm"
                _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave e texto cinza
                _active={{ bg: '#ff9800', color: 'white' }} // Fundo laranja quando ativo
                transition="all 0.3s ease"
              />
              <MenuList>
                <MenuItem
                  onClick={handleExport}
                  _hover={{ bg: '#ff9800', color: 'white' }}
                >
                  <RiUploadCloudLine style={{ marginRight: '8px' }} />
                  Exportar Flow
                </MenuItem>
                <MenuItem
                  onClick={onOpen}
                  _hover={{ bg: '#ff9800', color: 'white' }}
                >
                  <RiUploadCloudLine style={{ marginRight: '8px' }} />
                  Importar Flow
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              size="sm"
              variant="outline" // Botão com fundo transparente
              color="#6c757d" // Texto cinza
              leftIcon={<BsLightning />}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800' // Borda laranja quando selecionado
              }} // Seleção com fundo branco e borda laranja
              transition="all 0.3s ease"
            >
              Compartilhar
            </Button>
            <Button
              size="sm"
              variant="outline" // Botão com fundo transparente
              color="#6c757d" // Texto cinza
              leftIcon={<RiTestTubeLine />}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }} // Hover com fundo mais suave
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800' // Borda laranja quando selecionado
              }} // Seleção com fundo branco e borda laranja
              transition="all 0.3s ease"
            >
              Testar
            </Button>
            <Publish flowId={flowId} /> {/* new Publish component */}
          </HStack>
        </HStack>
      </Container>
      {/* Import Modal */}
      <ImportFlowModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Header;
