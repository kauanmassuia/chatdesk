import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiPlus, FiSettings, FiChevronDown, FiFolderPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom' // Updated import

export default function Dashboard() {
  const navigate = useNavigate() // Changed hook
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleCreateBot = () => {
    navigate('/editor') // Updated navigation
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box
        w="full"
        py={4}
        px={6}
        borderBottom="1px"
        borderColor={borderColor}
        bg={cardBg}
      >
        <Container maxW="1440px">
          <Flex justify="space-between" align="center">
            <Box>
              {/* Logo placeholder */}
              <Icon boxSize={8} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </Icon>
            </Box>
            <HStack spacing={4}>
              <Button leftIcon={<FiSettings />} variant="ghost" size="sm">
                Settings & Members
              </Button>
              <Text>Kauan Massuia&apos;s workspace</Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost" size="sm">
                  Free
                </MenuButton>
                <MenuList>
                  <MenuItem>Upgrade Plan</MenuItem>
                  <MenuItem>Billing</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1440px" py={8}>
        <HStack mb={8} spacing={4}>
          <Button leftIcon={<FiFolderPlus />} variant="outline" size="sm">
            Create a folder
          </Button>
        </HStack>

        <Flex gap={6} wrap="wrap">
          {/* Create Bot Card */}
          <Box
            as="button"
            onClick={handleCreateBot}
            w="300px"
            h="200px"
            bg="orange.500"
            color="white"
            borderRadius="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            transition="transform 0.2s"
            _hover={{
              transform: 'scale(1.02)',
            }}
            _active={{
              transform: 'scale(0.98)',
            }}
          >
            <Icon as={FiPlus} boxSize={8} mb={4} />
            <Heading size="md">Create a typebot</Heading>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

