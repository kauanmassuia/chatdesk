import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import { getAnswers } from '../services/answerService';

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
        // Filter answers by flow.uid instead of flow.id
        const filtered = data.filter((answer: any) => String(answer.flow?.uid) === uid);
        setAnswers(filtered);
      } catch (error) {
        console.error('Error fetching answers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnswers();
  }, [uid]);

  return (
    <Box p={6}>
      <Heading mb={4}>Flow Results</Heading>
      {loading ? (
        <Spinner />
      ) : answers.length ? (
        answers.map((answer, index) => (
          <Box key={`${answer.answer_id}-${index}`} p={4} mb={2} border="1px solid #ccc">
            <Text>Answer ID: {answer.answer_id}</Text>
            <Text>Data: {JSON.stringify(answer.answer_data)}</Text>
          </Box>
        ))
      ) : (
        <Text>No answers found for this flow.</Text>
      )}
    </Box>
  );
};

export default Results;
