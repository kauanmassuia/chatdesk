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
      label={publishedAt ? getPublicationTooltip(publishedAt) : ''}
      placement="bottom"
      hasArrow>
      <Button
        size="sm"
        variant="outline" // Borda visível e transparente por padrão
        color="white" // Cor do texto laranja
        border="1px solid #ff9800" // Borda laranja
        bg={'#ff9800'}
        _hover={{
          bg: 'transparent', // Fundo transparente no hover
          color: '#ff9800', // Cor do texto laranja
          border: '1px solid #ff9800', // Borda laranja no hover
        }}
        _active={{
          bg: '#ff9800', // Fundo laranja quando ativo
          color: 'white', // Texto branco quando ativo
          border: '1px solid #ff9800', // Borda laranja quando ativo
        }}
        transition="all 0.3s ease" // Transição suave
        onClick={handlePublish}
      >
        Publicar
      </Button>
    </Tooltip>
  );
};

export default Publish;
