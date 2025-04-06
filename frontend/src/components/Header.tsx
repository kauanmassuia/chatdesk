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
import NotPublishedModal from './modal/NotPublishedModal';
import Publish from './buttons/Publish';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFlow } from '../services/flowService';

interface HeaderProps {
  flowId: string | null;
}

const Header: React.FC<HeaderProps> = ({ flowId }) => {
  const { nodes, edges } = useFlowStore();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
  const { isOpen: isNotPublishedOpen, onOpen: onNotPublishedOpen, onClose: onNotPublishedClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFlowPublished, setIsFlowPublished] = useState<boolean>(false);

  // Determine current page
  const isResults = location.search.includes('/results');
  const isPublished = location.search.includes('/published');
  const isEditor = !isResults && !isPublished;

  useEffect(() => {
    // Check if flow is published when flowId changes
    const checkPublishedStatus = async () => {
      if (flowId) {
        try {
          const flowData = await getFlow(flowId);
          setIsFlowPublished(flowData.published || false);
        } catch (error) {
          console.error('Error checking flow published status:', error);
        }
      }
    };

    checkPublishedStatus();
  }, [flowId]);

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

  const handleShare = () => {
    if (!flowId) return;

    if (isFlowPublished) {
      navigateToPage('published');
    } else {
      onNotPublishedOpen();
    }
  };

  const navigateToPage = (page: 'editor' | 'results' | 'published') => {
    if (!flowId) return;

    switch (page) {
      case 'editor':
        navigate(`/editor?flow_id=${flowId}`);
        break;
      case 'results':
        navigate(`/editor?flow_id=${flowId}/results`);
        break;
      case 'published':
        navigate(`/editor?flow_id=${flowId}/published`);
        break;
    }
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
              onClick={() => navigate('/dashboard')}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{ bg: '#ff9800', color: 'white' }}
              transition="all 0.3s ease"
            />

            <Text fontSize="sm" fontWeight="semibold" color="gray.600">
              Funil de Vendas
            </Text>

            <IconButton
              aria-label="Ajuda"
              icon={<FiHelpCircle />}
              variant="ghost"
              size="sm"
              onClick={() => navigate('/docs')}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{ bg: '#ff9800', color: 'white' }}
              transition="all 0.3s ease"
            />
          </HStack>

          {/* Main Menu (Centralizado) */}
          <HStack spacing={6} flex={1} justify="center" display={{ base: 'none', md: 'flex' }}>
            <Button
              size="sm"
              variant="outline"
              color="#6c757d"
              isActive={isEditor}
              onClick={() => navigateToPage('editor')}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800'
              }}
              transition="all 0.3s ease"
            >
              Flow
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="#6c757d"
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800'
              }}
              transition="all 0.3s ease"
            >
              Tema
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="#6c757d"
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800'
              }}
              transition="all 0.3s ease"
            >
              Configurações
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="#6c757d"
              isActive={isResults}
              onClick={() => navigateToPage('results')}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800'
              }}
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
                _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
                _active={{ bg: '#ff9800', color: 'white' }}
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
                  onClick={onImportOpen}
                  _hover={{ bg: '#ff9800', color: 'white' }}
                >
                  <RiUploadCloudLine style={{ marginRight: '8px' }} />
                  Importar Flow
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              size="sm"
              variant="outline"
              color="#6c757d"
              leftIcon={<BsLightning />}
              onClick={handleShare}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800'
              }}
              transition="all 0.3s ease"
            >
              Compartilhar
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="#6c757d"
              leftIcon={<RiTestTubeLine />}
              _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
              _active={{
                bg: 'white',
                color: '#ff9800',
                border: '1px solid #ff9800'
              }}
              transition="all 0.3s ease"
            >
              Testar
            </Button>
            <Publish flowId={flowId} />
          </HStack>
        </HStack>
      </Container>
      <ImportFlowModal isOpen={isImportOpen} onClose={onImportClose} />
      <NotPublishedModal
        isOpen={isNotPublishedOpen}
        onClose={onNotPublishedClose}
        onPublish={() => {
          onNotPublishedClose();
          // Find the Publish component and trigger its click programmatically
          const publishElement = document.querySelector('[data-testid="publish-button"]');
          if (publishElement) {
            (publishElement as HTMLElement).click();
          }
        }}
      />
    </Box>
  );
};

export default Header;
