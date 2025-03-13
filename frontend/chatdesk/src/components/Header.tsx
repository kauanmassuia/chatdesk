import { HStack, Button, IconButton, useColorModeValue, Divider, Box, Container } from '@chakra-ui/react'
import { FiChevronLeft, FiLink, FiRefreshCw, FiHelpCircle } from 'react-icons/fi'
import { BsLightning } from 'react-icons/bs'
import { RiTestTubeLine } from 'react-icons/ri'

const Header = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')

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
          {/* Grupo de navegação - 1/4 do espaço */}
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

          {/* Nome do projeto - 1/4 do espaço */}
          <Box minW="240px">
            <Button size="sm" variant="ghost">
              ChatDesk
            </Button>
          </Box>

          {/* Menu principal - 1/4 do espaço */}
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
            <Button size="sm" variant="ghost">
              Share
            </Button>
            <Button size="sm" variant="ghost">
              Results
            </Button>
          </HStack>

          {/* Ações - 1/4 do espaço */}
          <HStack spacing={4} minW="240px" justify="flex-end">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<BsLightning />}
            >
              Share
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RiTestTubeLine />}
            >
              Test
            </Button>
            <Button
              size="sm"
              colorScheme="orange"
            >
              Publish
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}

export default Header 