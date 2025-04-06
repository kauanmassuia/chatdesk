import { useState } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { useFlowStore } from '../../store/flowStore';
import { publishFlow } from '../../services/flowService';
import { useNavigate } from 'react-router-dom';

interface PublishProps {
  flowId: string | null;
}

const Publish: React.FC<PublishProps> = ({ flowId }) => {
  const { nodes, edges } = useFlowStore();
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const navigate = useNavigate();

  const getPublicationTooltip = (publishedAt: string): string => {
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffMs = now.getTime() - publishedDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) return `Publicado a ${diffMinutes}m atrás`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Publicado a ${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `Publicado a ${diffDays} dias atrás`;
  };

  const handlePublish = async () => {
    if (!flowId) {
      console.error('No flow id provided for publishing');
      return;
    }
    const flowData = { nodes, edges };
    try {
      const result = await publishFlow(flowId, flowData);
      console.log('Publish success:', result);
      setPublishedAt(new Date().toISOString());
      // Redirect to /editor?flow_id=[uid]/published. Assuming flowId is the uid.
      navigate(`/editor?flow_id=${flowId}/published`);
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  return (
    <Tooltip
      label={publishedAt ? getPublicationTooltip(publishedAt) : 'Publicar flow'}
      placement="bottom"
      hasArrow
    >
      <Button
        size="sm"
        colorScheme="orange"
        onClick={handlePublish}
        bgColor="#ff9800"
        color="white"
        data-testid="publish-button"
        _hover={{ bg: '#f57c00' }}
        _active={{ bg: '#e65100' }}
        transition="all 0.3s ease"
      >
        Publicar
      </Button>
    </Tooltip>
  );
};

export default Publish;
