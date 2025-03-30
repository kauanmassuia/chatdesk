import {
  HStack,
  Button,
  IconButton,
  useColorModeValue,
  Box,
  Container,
  Image,
  Spacer,
  Tooltip,
  Text,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { FiArrowLeft, FiHelpCircle } from 'react-icons/fi';
import { BsLightning } from 'react-icons/bs';
import { RiFlaskLine, RiTestTubeLine, RiUploadCloudLine } from 'react-icons/ri';
import { useFlowStore } from '../store/flowStore';
import { exportFlowAsJson } from '../utils/exportFlowAsJson';
import ImportFlowModal from './modal/ImportFlowModal';
import Publish from './buttons/Publish';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  flowId: string | null;
}

const Header: React.FC<HeaderProps> = ({ flowId }) => {
  const navigate = useNavigate();
  const { nodes, edges } = useFlowStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Custom colors
  const borderColor = useColorModeValue('#ff9800', '#2575fc'); // Orange in light mode, blue in dark mode
  const bgColor = useColorModeValue('white', '#1a202c'); // White in light mode, dark gray in dark mode
  const buttonHoverColor = useColorModeValue('#2575fc', '#ff9800'); // Blue in light mode, orange in dark mode

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
          {/* Navigation Group */}
          <HStack spacing={4} minW="200px">
            <IconButton
              aria-label="Back"
              icon={<FiArrowLeft />}
              variant="ghost"
              size="md"
              _hover={{ color: buttonHoverColor }}
              onClick={() => navigate('/dashboard')}
            />

            {/* Help Button with Tooltip */}
            <HStack spacing={2} position="relative">
              <Tooltip label="Need help?" placement="top" hasArrow>
                <IconButton
                  aria-label="Help"
                  icon={<FiHelpCircle />}
                  variant="ghost"
                  size="md"
                  _hover={{ color: buttonHoverColor }}
                  onClick={() => navigate('/ajuda-docs')}
                />
              </Tooltip>

              {/* Help Message */}
              <Text
                display="none"
                position="absolute"
                left="100%"
                ml={2}
                fontSize="sm"
                color="gray.600"
                whiteSpace="nowrap"
                className="help-message"
              >
                Need help?
              </Text>
            </HStack>
          </HStack>

          {/* Project Logo */}
          <Box position="absolute" left="220px">
            <Image
              src="/src/assets/logovendflow.png"
              alt="Project Logo"
              width="150px"
              height="auto"
            />
          </Box>

          {/* Spacer */}
          <Spacer />

          {/* Main Menu */}
          <HStack spacing={6} flex={1} justify="center">
            <Button size="sm" variant="ghost" colorScheme="blue">
              Flow
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
            <Button size="sm" variant="ghost">
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
            <Button
              size="sm"
              bg="#ff9800"
              color="white"
              _hover={{ bg: '#e68a00' }}
            >
              Publish
            </Button>
            <Publish flowId={flowId} />
          </HStack>
        </HStack>
      </Container>
      {/* Import Modal */}
      <ImportFlowModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Header;
