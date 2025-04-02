import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Input, Button, VStack, HStack } from '@chakra-ui/react';
import '../styles/chat.css';
import { getYoutubeEmbedUrl } from '../utils/getYoutubeEmbedUrl.ts';
import { fetchPublishedFlow } from '../services/flowService';
import { saveAnswer } from '../services/answerService';
import { useParams } from 'react-router-dom';

interface FlowNode {
  id: string;
  type: string;
  content: any;
  next: string | null;
}

const interactiveTypes: string[] = [
  "input-text",
  "input_date",
  "input_buttons",
  "input_website",
  "input_phone",
  "input_email",
  "input_wait",
  "input_pic_choice"
];
const autoTypes: string[] = ["start", "text", "image", "video", "audio"];

const inputTypeMapping: Record<string, string> = {
  "input-text": "text",
  "input_date": "date",
  "input_website": "url",
  "input_phone": "tel",
  "input_email": "email",
  "input_number": "number",
};

function isRightAligned(nodeType: string): boolean {
  return nodeType === "user";
}

const ChatReader: React.FC = () => {
  const { custom_url } = useParams<{ custom_url: string }>();
  const [chatFlow, setChatFlow] = useState<{ nodes: FlowNode[] } | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  function getNodeById(flow: { nodes: FlowNode[] }, id: string | null): FlowNode | null {
    if (!id) return null;
    return flow.nodes.find((n) => n.id === id) || null;
  }

  useEffect(() => {
    if (!custom_url) return;
    fetchPublishedFlow(custom_url).then((data) => {
      if (data && data.published_content) {
        setChatFlow(data.published_content);
      }
    });
  }, [custom_url]);

  useEffect(() => {
    if (!chatFlow) return;
    const startNode = getNodeById(chatFlow, "start");
    if (startNode) {
      if (autoTypes.includes(startNode.type)) {
        setConversation([startNode]);
      }
      setCurrentNodeId(startNode.next ?? null);
    }
  }, [chatFlow]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    if (!chatFlow || !currentNodeId) return;
    const node = getNodeById(chatFlow, currentNodeId);
    if (!node) return;

    if (node.type === "input_wait") {
      const seconds = node.content?.waitTime || 1;
      const timer = setTimeout(() => {
        setConversation((prev) => [...prev, node]);
        setCurrentNodeId(node.next ?? null);
      }, seconds * 1000);
      return () => clearTimeout(timer);
    }

    if (autoTypes.includes(node.type)) {
      const timer = setTimeout(() => {
        setConversation((prev) => [...prev, node]);
        setCurrentNodeId(node.next ?? null);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (interactiveTypes.includes(node.type)) {
      const alreadyInHistory = conversation.some((c) => c.id === node.id);
      if (!alreadyInHistory) {
        setConversation((prev) => [...prev, node]);
      }
    }
  }, [currentNodeId, conversation, chatFlow]);

  function handleInputSubmit() {
    if (!inputValue.trim()) return;
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: inputValue },
    };
    setConversation((prev) => [...prev, userBubble]);

    // Save answer via saveAnswer
    if (custom_url && currentNodeId) {
      saveAnswer(custom_url, { [currentNodeId]: inputValue })
        .catch((error) => console.error("Error saving answer:", error));
    }

    setTimeout(() => {
      const node = chatFlow ? getNodeById(chatFlow, currentNodeId) : null;
      if (node) {
        setCurrentNodeId(node.next ?? null);
      }
    }, 500);
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  }

  function handleChoiceSelect(choice: any) {
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: choice.label },
    };
    setConversation((prev) => [...prev, userBubble]);
    setTimeout(() => {
      setCurrentNodeId(choice.next ?? null);
    }, 500);
  }

  function renderNode(node: FlowNode) {
    if (interactiveTypes.includes(node.type) && node.type !== "input_buttons" && node.type !== "input_pic_choice" && node.type !== "input_wait") {
      const htmlInputType = inputTypeMapping[node.type] || "text";
      return (
        <VStack spacing={3} align="stretch">
          <Box>
            <Text>{node.content.prompt}</Text>
          </Box>
          <HStack>
            <Input
              type={htmlInputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              flex="1"
            />
            <Button onClick={handleInputSubmit} colorScheme="blue">
              Send
            </Button>
          </HStack>
        </VStack>
      );
    }
    if (node.type === "input_buttons") {
      return (
        <VStack spacing={3} align="stretch">
          <Box>
            <Text>{node.content.prompt}</Text>
          </Box>
          <HStack spacing={3}>
            {node.content.choices.map((choice: any, idx: number) => (
              <Button key={idx} onClick={() => handleChoiceSelect(choice)} colorScheme="teal">
                {choice.label}
              </Button>
            ))}
          </HStack>
        </VStack>
      );
    }
    if (node.type === "input_pic_choice") {
      return (
        <VStack spacing={3} align="stretch">
          <Box>
            <Text>{node.content.prompt}</Text>
          </Box>
          <HStack spacing={4}>
            {node.content.choices.map((choice: any, idx: number) => (
              <Button key={idx} onClick={() => handleChoiceSelect(choice)} variant="outline">
                <img
                  src={choice.imageUrl}
                  alt={choice.label}
                  style={{ maxHeight: "50px", marginRight: "8px" }}
                />
                <span>{choice.label}</span>
              </Button>
            ))}
          </HStack>
        </VStack>
      );
    }
    if (node.type === "input_wait") {
      return null;
    }
    if (autoTypes.includes(node.type)) {
      if (node.type === "text") {
        return <Box><Text>{node.content.text}</Text></Box>;
      }
      if (node.type === "image") {
        return (
          <Box>
            <img src={node.content.imageUrl} alt={node.content.alt} style={{ maxWidth: "250px" }} />
          </Box>
        );
      }
      if (node.type === "video") {
        const embedUrl = getYoutubeEmbedUrl(node.content.videoUrl || node.content.url);
        return (
          <Box>
            <iframe
              src={embedUrl}
              title="video"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "300px", height: "200px" }}
            />
          </Box>
        );
      }
      if (node.type === "audio") {
        return (
          <Box>
            <audio controls style={{ width: "300px" }}>
              <source src={node.content.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        );
      }
      if (node.type === "start") {
        return null;
      }
    }
    return <Box><Text>{node.content?.text || ""}</Text></Box>;
  }

  const currentNode = chatFlow ? getNodeById(chatFlow, currentNodeId) : null;

  return (
    <div className="flex flex-col h-screen">
      <div ref={chatHistoryRef} className="flex flex-col flex-1 overflow-y-auto p-4 space-y-2">
        {conversation.map((node, idx) => {
          const alignRight = isRightAligned(node.type);
          return (
            <div
              key={idx}
              className={
                (alignRight
                  ? "self-end bg-user-bubble text-user-bubble"
                  : "self-start bg-bot-bubble text-bot-bubble") +
                " rounded-xl p-2 max-w-[80%] bubble-" +
                node.type
              }
            >
              {renderNode(node)}
            </div>
          );
        })}
        {currentNode &&
          interactiveTypes.includes(currentNode.type) &&
          !conversation.some((c) => c.id === currentNode.id) && (
            <div className={"self-start bg-bot-bubble text-bot-bubble rounded-xl p-2 max-w-[80%] bubble-" + currentNode.type}>
              {renderNode(currentNode)}
            </div>
          )}
      </div>
    </div>
  );
};

export default ChatReader;
