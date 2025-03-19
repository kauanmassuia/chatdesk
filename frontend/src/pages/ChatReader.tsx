import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Input, Button, VStack, HStack } from '@chakra-ui/react';
import '../styles/chat.css';
import { getYoutubeEmbedUrl } from '../utils/getYoutubeEmbedUrl.ts'; // assume you have a helper for YouTube URLs

// Import the exported flow JSON – replace this with your actual JSON import or assignment.
import chatFlowData from '../data/ultimateflowtest.json';

// Type for a node in the exported flow.
interface FlowNode {
  id: string;
  type: string;
  content: any;
  next: string | null;
}

// Our exported flow:
const chatFlow: { nodes: FlowNode[] } = chatFlowData;

// --- Helper functions ---
function getNodeById(flow: { nodes: FlowNode[] }, id: string | null): FlowNode | null {
  if (!id) return null;
  return flow.nodes.find((n) => n.id === id) || null;
}

// Updated interactive and auto node type lists to match exported JSON.
const interactiveTypes: string[] = [
  "text-input",
  "input_date",
  "input_buttons",
  "input_website",
  "input_phone",
  "input_email",
  "input_wait",
  "input_pic_choice"
];
const autoTypes: string[] = ["start", "text", "image", "video", "audio"];

// Mapping from interactive node type to HTML input type.
const inputTypeMapping: Record<string, string> = {
  "text-input": "text",
  "input_date": "date",
  "input_website": "url",
  "input_phone": "tel",
  "input_email": "email",
  // for numeric inputs if any:
  "input_number": "number",
  // others default to text.
};

// Helper: Determine if a bubble is right-aligned (user responses).
function isRightAligned(nodeType: string): boolean {
  return nodeType === "user";
}

// --- ChatReader Component ---
const ChatReader: React.FC = () => {
  // currentNodeId: id of the next node to be processed.
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  // conversation: array of nodes (and user responses) that have been rendered.
  const [conversation, setConversation] = useState<any[]>([]);
  // inputValue: for interactive text inputs.
  const [inputValue, setInputValue] = useState("");
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // 1. Initialize conversation with the start node.
  useEffect(() => {
    const startNode = getNodeById(chatFlow, "start");
    if (startNode) {
      // For auto nodes, add them immediately.
      if (autoTypes.includes(startNode.type)) {
        setConversation([startNode]);
      }
      setCurrentNodeId(startNode.next ?? null);
    }
  }, []);

  // 2. Auto-scroll chat history.
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversation]);

  // 3. Process new node arrival.
  useEffect(() => {
    if (!currentNodeId) return;
    const node = getNodeById(chatFlow, currentNodeId);
    if (!node) return;

    if (node.type === "input_wait") {
      // For wait nodes, delay according to waitTime.
      const seconds = node.content?.waitTime || 1;
      const timer = setTimeout(() => {
        // Append the wait node (optional) and move on.
        setConversation((prev) => [...prev, node]);
        setCurrentNodeId(node.next ?? null);
      }, seconds * 1000);
      return () => clearTimeout(timer);
    }

    if (autoTypes.includes(node.type)) {
      // Auto nodes: append after a short delay.
      const timer = setTimeout(() => {
        setConversation((prev) => [...prev, node]);
        setCurrentNodeId(node.next ?? null);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Interactive nodes: if not already in conversation, append them.
    if (interactiveTypes.includes(node.type)) {
      const alreadyInHistory = conversation.some((c) => c.id === node.id);
      if (!alreadyInHistory) {
        setConversation((prev) => [...prev, node]);
      }
    }
  }, [currentNodeId, conversation]);

  // 4. Handle interactive input submission (for text-input, input_date, etc.).
  function handleInputSubmit() {
    if (!inputValue.trim()) return;
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: inputValue },
    };
    setConversation((prev) => [...prev, userBubble]);
    // After submission, auto-advance to next node.
    setTimeout(() => {
      const node = getNodeById(chatFlow, currentNodeId);
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

  // 5. Handle choice selection for buttons and picture choices.
  function handleChoiceSelect(choice: any) {
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: choice.label }, // use the label as the user's choice
    };
    setConversation((prev) => [...prev, userBubble]);
    setTimeout(() => {
      setCurrentNodeId(choice.next ?? null);
    }, 500);
  }

  // 6. Render node content based on type.
  function renderNode(node: FlowNode) {
    // --- Interactive Nodes (excluding wait) ---
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
    // --- Choice Nodes ---
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
    // --- Wait Node ---
    if (node.type === "input_wait") {
      // Wait nodes do not display any UI.
      return null;
    }
    // --- Auto Nodes ---
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
        return null; // Start node might not render anything.
      }
    }
    // --- Fallback ---
    return <Box><Text>{node.content?.text || ""}</Text></Box>;
  }

  // --- Main Render ---
  // Get the current node (if exists).
  const currentNode = getNodeById(chatFlow, currentNodeId);

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
        {/* Render current interactive prompt if not already in conversation */}
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
