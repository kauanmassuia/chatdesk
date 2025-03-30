import { VStack, Box, Input, Text, SimpleGrid, Button, useColorModeValue } from '@chakra-ui/react'
import { FiMessageSquare, FiImage, FiVideo, FiCode, FiHeadphones } from 'react-icons/fi'
import { BsTextParagraph, BsCalendarDate, BsClock, BsTelephone, BsGrid } from 'react-icons/bs'
import { MdOutlineNumbers, MdOutlineEmail, MdPayment } from 'react-icons/md'
import { TbWorldWww } from 'react-icons/tb'
import { HiOutlinePhotograph } from 'react-icons/hi'

const DraggableItem = ({ icon: Icon, label, type }: { icon: any, label: string, type: string }) => {
  const bgColor = useColorModeValue('white', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Button
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      variant="outline"
      leftIcon={<Icon size={16} />}
      justifyContent="flex-start"
      w="full"
      bg={bgColor}
      _hover={{ bg: hoverBg }}
      size="sm"
      h="36px"
    >
      {label}
    </Button>
  )
}

const Sidebar = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      w="300px"
      h="calc(100vh - 56px)"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      px={4}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('gray.300', 'gray.600'),
          borderRadius: '24px',
        },
      }}
    >
      <VStack align="stretch" spacing={8}>
        <Box>
          <Input
            placeholder="Buscar"
            size="md"
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={borderColor}
            _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
          />
        </Box>

        <Box>
          <Text
            fontWeight="medium"
            fontSize="sm"
            mb={4}
            color={useColorModeValue('gray.600', 'gray.400')}
            px={1}
          >
            Bubbles
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            <DraggableItem icon={FiMessageSquare} label="Text" type="text" />
            <DraggableItem icon={FiImage} label="Image" type="image" />
            <DraggableItem icon={FiVideo} label="Video" type="video" />
            <DraggableItem icon={FiCode} label="Embed" type="embed" />
            <DraggableItem icon={FiHeadphones} label="Audio" type="audio" />
          </SimpleGrid>
        </Box>

        <Box>
          <Text
            fontWeight="medium"
            fontSize="sm"
            mb={4}
            color={useColorModeValue('gray.600', 'gray.400')}
            px={1}
          >
            Inputs
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            <DraggableItem icon={BsTextParagraph} label="Text" type="input_text" />
            <DraggableItem icon={MdOutlineNumbers} label="Number" type="input_number" />
            <DraggableItem icon={MdOutlineEmail} label="Email" type="input_email" />
            <DraggableItem icon={TbWorldWww} label="Website" type="input_website" />
            <DraggableItem icon={BsCalendarDate} label="Date" type="input_date" />
            <DraggableItem icon={BsClock} label="Wait" type="input_wait" />
            <DraggableItem icon={BsTelephone} label="Phone" type="input_phone" />
            <DraggableItem icon={BsGrid} label="Buttons" type="input_buttons" />
            <DraggableItem icon={HiOutlinePhotograph} label="Pic choice" type="input_pic_choice" />
            <DraggableItem icon={MdPayment} label="Payment" type="input_payment" />
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
