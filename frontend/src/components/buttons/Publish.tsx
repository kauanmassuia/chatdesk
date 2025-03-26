import { useState } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { useFlowStore } from '../../store/flowStore';
import { publishFlow } from '../../services/flowService';

interface PublishProps {
  flowId: string | null;
}

const Publish: React.FC<PublishProps> = ({ flowId }) => {
  const { nodes, edges } = useFlowStore();
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  return (
    <Tooltip
      label={publishedAt ? getPublicationTooltip(publishedAt) : ''}
      placement="bottom"
      hasArrow>
      <Button
        size="sm"
        colorScheme="orange"
        onClick={handlePublish}
      >
        Publish
      </Button>
    </Tooltip>
  );
};

export default Publish;
