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
  Switch,
  Input,
  EditableInput,
  Editable,
  EditablePreview,
  EditableTextarea,
  EditableInputProps,
  EditableProps,
} from '@chakra-ui/react';
import { FaEyeSlash, FaEye, FaDownload, FaLock, FaCrown, FaChartLine, FaEdit } from 'react-icons/fa';
import { getAnswers, AnswerData, AnswersResponse } from '../services/answerService';
import { getFlow, updateFlow } from '../services/flowService';
import Header from '../components/Header';

interface Column {
  id: string;
  name: string;
  originalName?: string;
  nodeId?: string;
  nodeType?: string;
  getValue: (row: AnswerData) => string | number | boolean;
}

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const flowParam = searchParams.get('flow_id') || '';
  const uid = flowParam.split('/')[0];

  const [data, setData] = useState<AnswersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [hiddenRows, setHiddenRows] = useState<Record<string, boolean>>({});
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [flow, setFlow] = useState<any>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const toast = useToast();

  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const headerBg = useColorModeValue('white', 'gray.800');
  const lockedRowBg = useColorModeValue('gray.50', 'gray.800');
  const hiddenRowBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Fetch flow and answers data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch flow data
        const flowData = await getFlow(uid);
        setFlow(flowData);

        // Fetch answers
        const apiData: AnswersResponse = await getAnswers();
        const filteredData = {
          ...apiData,
          answers: apiData.answers.filter(
            (answer: AnswerData) => String(answer.flow?.uid) === uid
          )
        };
        setData(filteredData);

        // Initialize hidden rows from localStorage if available
        const savedHiddenRows = localStorage.getItem(`hidden_rows_${uid}`);
        if (savedHiddenRows) {
          setHiddenRows(JSON.parse(savedHiddenRows));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  // Helper function to find a node by ID in flow content
  const findNodeById = (nodeId: string) => {
    if (!flow || !flow.content || !flow.content.nodes) return null;

    return flow.content.nodes.find((node: any) => node.id === nodeId);
  };

  // Extract columns from answer_data with proper naming using flow data
  const columns = useMemo(() => {
    if (!data?.answers.length || !flow?.content?.nodes) return [];

    const allKeys = new Set<string>();
    const nodeInfo = new Map<string, { name: string, nodeId: string, type: string }>();

    // First pass: collect all possible keys from answers
    data.answers.forEach(answer => {
      if (answer.answer_data && typeof answer.answer_data === 'object') {
        Object.keys(answer.answer_data).forEach(key => {
          allKeys.add(key);
        });
      }
    });

    // Map node IDs to names using flow data
    flow.content.nodes.forEach((node: any) => {
      if (node.id && allKeys.has(node.id)) {
        const nodeName = node.content?.name || node.id;
        nodeInfo.set(node.id, {
          name: nodeName,
          nodeId: node.id,
          type: node.type || 'unknown'
        });
      }
    });

    // Generate columns with proper display names
    return Array.from(allKeys).map(key => {
      const nodeData = nodeInfo.get(key);
      return {
        id: key,
        name: nodeData?.name || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        originalName: nodeData?.name,
        nodeId: key,
        nodeType: nodeData?.type,
        getValue: (row: AnswerData) => {
          const value = row.answer_data[key];

          // Handle different value types
          if (value === null || value === undefined) {
            return '';
          }

          if (typeof value === 'object') {
            // First try to get value or text property if available
            if ('value' in value) return value.value;
            if ('text' in value) return value.text;

            // Handle arrays specially (e.g., for multiple choice answers)
            if (Array.isArray(value)) {
              return value.join(', ');
            }

            // Fall back to JSON string representation
            return JSON.stringify(value);
          }

          // For simple values, return as is
          return value;
        }
      };
    });
  }, [data?.answers, flow]);

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
    if (Object.keys(selectedRows).length === visibleAnswers.length) {
      setSelectedRows({});
    } else {
      const newSelectedRows: Record<string, boolean> = {};
      visibleAnswers.forEach((answer, index) => {
        if (!isRowLocked(index)) {
          newSelectedRows[index] = true;
        }
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

  const toggleHideRow = (index: number) => {
    const indexKey = index.toString();
    const newHiddenRows = {
      ...hiddenRows,
      [indexKey]: !hiddenRows[indexKey]
    };

    setHiddenRows(newHiddenRows);

    // Save to localStorage
    localStorage.setItem(`hidden_rows_${uid}`, JSON.stringify(newHiddenRows));

    // Clear selection for this row
    if (selectedRows[index]) {
      const newSelectedRows = { ...selectedRows };
      delete newSelectedRows[index];
      setSelectedRows(newSelectedRows);
    }

    toast({
      title: newHiddenRows[indexKey] ? "Answer hidden" : "Answer unhidden",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const isRowHidden = (index: number): boolean => !!hiddenRows[index.toString()];
  const isRowLocked = (index: number): boolean => !!(data && index >= (data.answer_limit || 0));

  const visibleAnswers = useMemo(() => {
    if (!data?.answers) return [];

    // Filter answers based on hidden status if not showing hidden
    const filtered = data.answers.filter((_, index) =>
      showHidden || !isRowHidden(index)
    );

    // Sort to put hidden answers at the end
    return [...filtered].sort((a, b) => {
      const indexA = data.answers.indexOf(a);
      const indexB = data.answers.indexOf(b);

      if (isRowHidden(indexA) && !isRowHidden(indexB)) return 1;
      if (!isRowHidden(indexA) && isRowHidden(indexB)) return -1;
      return 0;
    });
  }, [data?.answers, hiddenRows, showHidden]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  // Handle column name edit
  const handleColumnNameEdit = async (columnId: string, newName: string) => {
    if (!flow || !columnId || columnId === 'created_at') return;

    // Don't update if the name hasn't changed
    const column = allColumns.find(col => col.id === columnId);
    if (column?.name === newName) return;

    try {
      // Make a deep copy of the flow content to avoid direct state mutation
      const updatedContent = JSON.parse(JSON.stringify(flow.content));
      const nodeIndex = updatedContent.nodes.findIndex((node: any) => node.id === columnId);

      if (nodeIndex >= 0) {
        // Update the node name in content
        if (!updatedContent.nodes[nodeIndex].content) {
          updatedContent.nodes[nodeIndex].content = {};
        }
        updatedContent.nodes[nodeIndex].content.name = newName;

        // Update flow with new content and set updatePublished to true
        await updateFlow(uid, updatedContent, true);

        // Update local flow state
        setFlow({
          ...flow,
          content: updatedContent
        });

        // Update columns without fetching again
        const updatedColumns = [...columns];
        const columnIndex = updatedColumns.findIndex(col => col.id === columnId);
        if (columnIndex >= 0) {
          updatedColumns[columnIndex] = {
            ...updatedColumns[columnIndex],
            name: newName
          };
        }

        toast({
          title: "Column name updated",
          description: "The column name has been updated successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating column name:', error);
      toast({
        title: "Failed to update column name",
        description: "There was an error updating the column name. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

    // Add data rows - only export non-hidden, non-locked rows
    data?.answers.forEach((row, index) => {
      if (selectedRows[index] && !isRowHidden(index) && !isRowLocked(index)) {
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

  if (loading) {
    return (
      <Flex direction="column" h="100vh">
        <Header flowId={uid} />
        <Box p={5} textAlign="center" mt="56px">
          <Spinner size="xl" />
          <Text mt={3}>Loading answers...</Text>
        </Box>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" h="100vh">
        <Header flowId={uid} />
        <Box p={5} mt="56px">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Box>
      </Flex>
    );
  }

  if (!data?.answers.length) {
    return (
      <Flex direction="column" h="100vh">
        <Header flowId={uid} />
        <Box p={5} mt="56px">
          <Heading mb={4} size="md">Flow Results</Heading>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>No answers yet</AlertTitle>
            <AlertDescription>
              This flow hasn't received any submissions yet.
            </AlertDescription>
          </Alert>
        </Box>
      </Flex>
    );
  }

  const totalAnswers = data.total_answers;
  const answerLimit = data.answer_limit;
  const overLimitCount = data.over_limit_count;
  const isOverLimit = overLimitCount > 0;

  // Count hidden answers
  const hiddenAnswersCount = Object.values(hiddenRows).filter(Boolean).length;

  return (
    <Flex direction="column" h="100vh">
      <Header flowId={uid} />
      <Box p={5} mt="56px">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Flow Results</Heading>
          <HStack>
            <Tag colorScheme="blue" size="md">
              <HStack spacing={1}>
                <FaChartLine />
                <Text>{data.answers.length} Answers</Text>
              </HStack>
            </Tag>
          </HStack>
        </Flex>

        {isOverLimit && (
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            p={3}
            borderRadius="md"
            bg="blue.50"
            color="blue.800"
            borderWidth="1px"
            borderColor="blue.100"
          >
            <Text fontSize="sm">
              <FaLock size="12px" style={{ display: 'inline', marginRight: '8px' }} />
              You've reached your plan limit. {overLimitCount} answers are locked.
            </Text>
            <Button
              size="sm"
              rightIcon={<FaCrown />}
              colorScheme="blue"
              variant="outline"
              as={Link}
              to="/settings/subscription"
            >
              Upgrade
            </Button>
          </Flex>
        )}

        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          {selectedCount > 0 && (
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="medium">
                {selectedCount} selected
              </Text>
              <Tooltip label="Export selected rows to CSV">
                <IconButton
                  size="sm"
                  aria-label="Export selected rows"
                  icon={<FaDownload />}
                  onClick={exportCSV}
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
          )}

          {/* Pushed to the right side */}
          <HStack ml="auto" spacing={2}>
            <Text fontSize="sm">{hiddenAnswersCount > 0 ? `${hiddenAnswersCount} hidden` : ''}</Text>
            <Flex alignItems="center">
              <Text fontSize="sm" mr={2}>Show hidden</Text>
              <Switch
                size="sm"
                isChecked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
              />
            </Flex>
          </HStack>
        </Flex>

        <Box
          overflowX="auto"
          borderWidth="1px"
          borderRadius="md"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Table variant="simple" size="sm">
            <Thead bg={headerBg}>
              <Tr>
                <Th width="40px" px={2}>
                  <Checkbox
                    isChecked={
                      Object.keys(selectedRows).length > 0 &&
                      Object.keys(selectedRows).length === visibleAnswers.filter((_, i) => {
                        const index = data.answers.indexOf(_);
                        return !isRowLocked(index);
                      }).length
                    }
                    onChange={toggleSelectAll}
                    size="sm"
                  />
                </Th>
                {allColumns.map(column => (
                  <Th key={column.id} fontSize="xs" py={3} px={3}>
                    <Flex alignItems="center">
                      {column.id === 'created_at' ? (
                        column.name
                      ) : (
                        <Editable
                          defaultValue={column.name}
                          onSubmit={(nextValue) => handleColumnNameEdit(column.id, nextValue)}
                          display="flex"
                          alignItems="center"
                          width="100%"
                        >
                          <EditablePreview />
                          <EditableInput minW="100px" />
                          <Tooltip label="Edit column name">
                            <IconButton
                              aria-label="Edit column name"
                              icon={<FaEdit />}
                              size="xs"
                              variant="ghost"
                              ml={1}
                              onClick={() => setEditingColumnId(column.id)}
                            />
                          </Tooltip>
                        </Editable>
                      )}
                    </Flex>
                  </Th>
                ))}
                <Th width="50px" px={2}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.answers.map((row, rowIndex) => {
                const isHidden = isRowHidden(rowIndex);
                const isLocked = isRowLocked(rowIndex);

                // Skip if hidden and not showing hidden
                if (isHidden && !showHidden) return null;

                return (
                  <Tr
                    key={row.id || rowIndex}
                    _hover={{ bg: hoverBg }}
                    bg={isHidden ? hiddenRowBg : isLocked ? lockedRowBg : undefined}
                    opacity={isHidden ? 0.7 : 1}
                  >
                    <Td px={2}>
                      <Checkbox
                        isChecked={!!selectedRows[rowIndex]}
                        onChange={() => toggleSelectRow(rowIndex)}
                        isDisabled={isLocked || isHidden}
                        size="sm"
                      />
                    </Td>
                    {allColumns.map(column => (
                      <Td key={column.id} py={2} px={3} fontSize="sm">
                        {isLocked ? (
                          <Flex align="center" opacity={0.5}>
                            <FaLock size="10px" style={{ marginRight: '6px' }} />
                            <Text as="span" fontSize="xs">Locked</Text>
                          </Flex>
                        ) : (
                          <Box maxW="250px" overflow="hidden" textOverflow="ellipsis">
                            {column.getValue(row)}
                          </Box>
                        )}
                      </Td>
                    ))}
                    <Td px={2}>
                      <IconButton
                        aria-label={isHidden ? "Unhide row" : "Hide row"}
                        icon={isHidden ? <FaEye size="14px" /> : <FaEyeSlash size="14px" />}
                        onClick={() => toggleHideRow(rowIndex)}
                        variant="ghost"
                        size="xs"
                        isDisabled={isLocked}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
};

export default Results;
