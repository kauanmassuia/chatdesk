import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  IconButton,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Badge,
  useColorModeValue,
  useToast,
  Tooltip,
  Tag,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaTrash, FaDownload, FaLock, FaCrown, FaChartLine } from 'react-icons/fa';
import { getAnswers, AnswerData, AnswersResponse } from '../services/answerService';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const flowParam = searchParams.get('flow_id') || '';
  const uid = flowParam.split('/')[0];

  const [data, setData] = useState<AnswersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const lockedRowBg = useColorModeValue('gray.100', 'gray.800');
  const upgradeButtonBg = useColorModeValue('yellow.400', 'yellow.500');

  useEffect(() => {
    const fetchAnswers = async () => {
      setLoading(true);
      try {
        const apiData: AnswersResponse = await getAnswers();
        const filteredData = {
          ...apiData,
          answers: apiData.answers.filter(
            (answer: AnswerData) => String(answer.flow?.uid) === uid
          )
        };
        setData(filteredData);
      } catch (err) {
        console.error('Error fetching answers:', err);
        setError('Failed to load answers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [uid]);

  // Extract columns from answer_data with proper naming
  const columns = useMemo(() => {
    if (!data?.answers.length) return [];

    const allKeys = new Set<string>();
    const nodeNames = new Map<string, string>();

    // First pass: collect all possible keys and their corresponding node names
    data.answers.forEach(answer => {
      if (answer.answer_data && typeof answer.answer_data === 'object') {
        Object.entries(answer.answer_data).forEach(([key, value]) => {
          allKeys.add(key);

          // If this field has a 'name' property, store it for this key
          if (typeof value === 'object' && value !== null && 'name' in value) {
            nodeNames.set(key, value.name as string);
          }
        });
      }
    });

    // Generate columns with proper display names
    return Array.from(allKeys).map(key => ({
      id: key,
      name: nodeNames.get(key) || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      getValue: (row: AnswerData) => {
        const value = row.answer_data[key];
        if (typeof value === 'object' && value !== null) {
          // If the value is an object, use its main value property
          return value.value || value.text || JSON.stringify(value);
        }
        return value || '';
      }
    }));
  }, [data?.answers]);

  // Add created_at column
  const allColumns = useMemo(() => {
    return [
      {
        id: 'created_at',
        name: 'Submitted',
        getValue: (row: AnswerData) => {
          const date = new Date(row.created_at);
          return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
      },
      ...columns
    ];
  }, [columns]);

  const toggleSelectAll = () => {
    if (Object.keys(selectedRows).length === (data?.answers.length || 0)) {
      setSelectedRows({});
    } else {
      const newSelectedRows: Record<string, boolean> = {};
      data?.answers.forEach((answer, index) => {
        newSelectedRows[index] = true;
      });
      setSelectedRows(newSelectedRows);
    }
  };

  const toggleSelectRow = (index: number) => {
    setSelectedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const exportCSV = () => {
    if (selectedCount === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to export",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Get all column IDs
    const exportColumns = allColumns.map(col => ({
      id: col.id,
      name: col.name
    }));

    // Create CSV header
    let csvContent = 'data:text/csv;charset=utf-8,' +
      exportColumns.map(col => `"${col.name}"`).join(',') + '\n';

    // Add data rows
    data?.answers.forEach((row, index) => {
      if (selectedRows[index]) {
        const exportRow = exportColumns.map(col => {
          const column = allColumns.find(c => c.id === col.id);
          const value = column ? column.getValue(row) : '';
          // Escape quotes and wrap in quotes to handle commas in data
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += exportRow.join(',') + '\n';
      }
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flow_results_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `${selectedCount} rows exported to CSV`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = () => {
    if (selectedCount === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to delete",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onOpen();
  };

  const confirmDelete = () => {
    // This would connect to your backend delete API
    toast({
      title: "Deletion successful",
      description: `${selectedCount} rows have been deleted`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setSelectedRows({});
    onClose();
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading answers...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Box>
    );
  }

  if (!data?.answers.length) {
    return (
      <Box p={6}>
        <Heading mb={4}>Flow Results</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>No answers yet</AlertTitle>
          <AlertDescription>
            This flow hasn't received any submissions yet.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  const totalAnswers = data.total_answers;
  const answerLimit = data.answer_limit;
  const overLimitCount = data.over_limit_count;
  const isOverLimit = overLimitCount > 0;

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Flow Results</Heading>
        <HStack>
          <Tag colorScheme="blue" size="lg">
            <HStack spacing={1}>
              <FaChartLine />
              <Text>{data.answers.length} Answers</Text>
            </HStack>
          </Tag>
        </HStack>
      </Flex>

      {isOverLimit && (
        <Alert
          status="warning"
          variant="solid"
          mb={6}
          borderRadius="md"
          bg={upgradeButtonBg}
        >
          <Flex width="100%" justify="space-between" align="center">
            <Flex align="center">
              <AlertIcon color="yellow.800" />
              <Box>
                <AlertTitle color="yellow.900">
                  {overLimitCount} answers are locked
                </AlertTitle>
                <AlertDescription color="yellow.900">
                  You've reached your monthly limit of {answerLimit} answers. Upgrade your plan to unlock all {totalAnswers} answers.
                </AlertDescription>
              </Box>
            </Flex>
            <Button
              rightIcon={<FaCrown />}
              bg="white"
              color="yellow.800"
              _hover={{ bg: "gray.100" }}
              as={Link}
              to="/settings/subscription"
            >
              Upgrade Now
            </Button>
          </Flex>
        </Alert>
      )}

      {selectedCount > 0 && (
        <Flex
          align="center"
          justify="space-between"
          mb={4}
          p={3}
          bg={headerBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Text fontWeight="medium">
            {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
          </Text>
          <Flex gap={2}>
            <Tooltip label="Export selected rows to CSV">
              <IconButton
                aria-label="Download selected rows"
                icon={<FaDownload />}
                onClick={exportCSV}
                variant="outline"
              />
            </Tooltip>
            <Tooltip label="Delete selected rows">
              <IconButton
                aria-label="Delete selected rows"
                icon={<FaTrash />}
                onClick={handleDelete}
                colorScheme="red"
                variant="outline"
              />
            </Tooltip>
          </Flex>
        </Flex>
      )}

      <Box overflowX="auto" borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th width="40px">
                <Checkbox
                  isChecked={
                    Object.keys(selectedRows).length > 0 &&
                    Object.keys(selectedRows).length === data.answers.length
                  }
                  onChange={toggleSelectAll}
                />
              </Th>
              {allColumns.map(column => (
                <Th key={column.id}>{column.name}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.answers.map((row, rowIndex) => (
              <Tr
                key={row.id || rowIndex}
                _hover={{ bg: "gray.50" }}
                bg={rowIndex >= answerLimit ? lockedRowBg : undefined}
              >
                <Td>
                  <Checkbox
                    isChecked={!!selectedRows[rowIndex]}
                    onChange={() => toggleSelectRow(rowIndex)}
                    isDisabled={rowIndex >= answerLimit}
                  />
                </Td>
                {allColumns.map(column => (
                  <Td key={column.id}>
                    {rowIndex >= answerLimit ? (
                      <Flex align="center" opacity={0.5}>
                        <FaLock size="12px" style={{ marginRight: '8px' }} />
                        <Text as="span">Locked</Text>
                      </Flex>
                    ) : (
                      column.getValue(row)
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Delete confirmation modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete {selectedCount} selected row{selectedCount !== 1 ? 's' : ''}?
            This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Results;
