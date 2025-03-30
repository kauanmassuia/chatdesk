import {
  HStack,
  Button,
  IconButton,
  useColorModeValue,
  Box,
  Container,
  useDisclosure
} from '@chakra-ui/react';
import { FiChevronLeft, FiLink, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';
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
        <HStack h="100%" spacing={6} align="center">
          {/* Navigation Group */}
          <HStack spacing={3} minW="240px">
            <IconButton
              aria-label="Voltar"
              icon={<FiChevronLeft />}
              variant="ghost"
              size="sm"
            />
            <IconButton
              aria-label="Link"
              icon={<FiLink />}
              variant="ghost"
              size="sm"
            />
            <IconButton
              aria-label="Atualizar"
              icon={<FiRefreshCw />}
              variant="ghost"
              size="sm"
            />
            <IconButton
              aria-label="Ajuda"
              icon={<FiHelpCircle />}
              variant="ghost"
              size="sm"
            />
          </HStack>

          {/* Project Name */}
          <Box minW="240px">
            <Button size="sm" variant="ghost">
              ChatDesk
            </Button>
          </Box>

          {/* Main Menu */}
          <HStack spacing={6} flex={1} justify="center">
            <Button size="sm" variant="ghost" colorScheme="blue">
              Flow
            </Button>
            <Button size="sm" variant="ghost">
              Theme
            </Button>
            <Button size="sm" variant="ghost">
              Settings
            </Button>
            <Button size="sm" variant="ghost" onClick={handleExport}>
              Export
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RiUploadCloudLine />}
              onClick={onOpen}
            >
              Import
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => flowId && navigate(`/editor?flow_id=${flowId}/results`)}
            >
              Results
            </Button>
          </HStack>

          {/* Actions */}
          <HStack spacing={4} minW="240px" justify="flex-end">
            <Button size="sm" variant="ghost" leftIcon={<BsLightning />}>
              Share
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<RiTestTubeLine />}>
              Test
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
