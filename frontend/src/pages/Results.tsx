import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { getAnswers } from '../services/answerService';
import { useTable, useRowSelect } from 'react-table';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const flowParam = searchParams.get('flow_id') || '';
  const uid = flowParam.split('/')[0];

  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const data = await getAnswers();
        const filtered = data.filter(
          (answer: any) => String(answer.flow?.uid) === uid
        );
        setAnswers(filtered);
      } catch (error) {
        console.error('Error fetching answers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnswers();
  }, [uid]);

  // Memoize the unique data columns from your answers
  const dataColumnsMemo = React.useMemo(() => {
    return Array.from(
      answers.reduce((cols, answer) => {
        if (answer.answer_data && typeof answer.answer_data === 'object') {
          Object.keys(answer.answer_data).forEach((key) => cols.add(key));
        }
        return cols;
      }, new Set<string>())
    );
  }, [answers]);

  // Define your columns for react-table (without the selection column)
  const columns = React.useMemo(
    () =>
      dataColumnsMemo.map((col) => ({
        Header: col.charAt(0).toUpperCase() + col.slice(1),
        accessor: (row: any) => row.answer_data?.[col] || '',
      })),
    [dataColumnsMemo]
  );

  // Initialize the table instance and add a selection column via hooks
  const tableInstance = useTable(
    {
      columns,
      data: answers,
      initialState: { selectedRowIds: {} },
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }: any) => (
            <Checkbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = tableInstance;
  const selectedRowIds = (state as any).selectedRowIds;

  // CSV export using the selected rows from react-table
  const exportCSV = () => {
    const selectedRows = rows.filter((row) => selectedRowIds[row.id]);
    const header = dataColumnsMemo;
    let csvContent = 'data:text/csv;charset=utf-8,' + header.join(',') + '\n';
    selectedRows.forEach((row) => {
      const answer = row.original;
      const rowData = dataColumnsMemo.map(
        (col) => answer.answer_data?.[col] || ''
      );
      csvContent += rowData.join(',') + '\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'selected_rows.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    // Placeholder: implement deletion logic here
    alert('Delete selected answers placeholder');
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Flow Results</Heading>
      {loading ? (
        <Spinner />
      ) : answers.length ? (
        <>
          {Object.keys(selectedRowIds).length > 0 && (
            <Flex
              align="center"
              justify="space-between"
              mb={4}
              p={2}
              bg="gray.50"
              borderRadius="md"
            >
              <Text fontWeight="bold">
                {Object.keys(selectedRowIds).length} line
                {Object.keys(selectedRowIds).length > 1 && 's'} selected
              </Text>
              <Flex gap={2}>
                <IconButton
                  aria-label="Download selected rows"
                  icon={<FaDownload />}
                  onClick={exportCSV}
                  variant="outline"
                />
                <IconButton
                  aria-label="Delete selected rows"
                  icon={<FaTrash />}
                  onClick={handleDelete}
                  bg="red.100"
                  _hover={{ bg: 'red.200' }}
                />
              </Flex>
            </Flex>
          )}

          <Table variant="simple" {...getTableProps()}>
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th key={column.id} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <Tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td key={cell.column.id} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </>
      ) : (
        <Text>No answers found for this flow.</Text>
      )}
    </Box>
  );
};

export default Results;
