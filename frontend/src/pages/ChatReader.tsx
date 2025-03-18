import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Input, Button, VStack, HStack } from '@chakra-ui/react';
import '../styles/chat.css';

/**
 * Use your exported JSON flow.
 */
const chatFlow = {
  "version": "1.0",
  "id": "exported_flow",
  "name": "Exported Flow",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "content": {},
      "next": "text-1742316018021"
    },
    {
      "id": "text-1742316018021",
      "type": "text",
      "content": {
        "text": "Oie"
      },
      "next": "video-1742316027855"
    },
    {
      "id": "video-1742316027855",
      "type": "video",
      "content": {
        "videoUrl": "https://www.youtube.com/watch?v=Vj2ICyclWO4&pp=0gcJCU8JAYcqIYzv",
        "mediaType": "youtube"
      },
      "next": "image-1742316068271"
    },
    {
      "id": "image-1742316068271",
      "type": "image",
      "content": {
        "imageUrl": "https://media.istockphoto.com/id/1443562748/pt/foto/cute-ginger-cat.jpg?s=612x612&w=0&k=20&c=OqlMF3bysUX6cVux5kKc1gqCGMghQpGc5ukyw1qG82s=",
        "alt": "Gato laranja"
      },
      "next": "input_text-1742316119673"
    },
    {
      "id": "input_text-1742316119673",
      "type": "text-input",
      "content": {
        "prompt": "Oq achou disso?"
      },
      "next": null
    }
  ]
};

/** Helper to find a node by ID */
function getNodeById(flow: typeof chatFlow, id: string | null) {
  return flow.nodes.find((n) => n.id === id) || null;
}

/** List of interactive node types */
const interactiveTypes = [
  "input",
  "text-input",
  "email-input",
  "phone-input",
  "website-input",
  "number-input",
  "date-input",
  "time-input",
  "payment-input",
  "buttons-input",
  "pic-choice-input",
  "choice",
  "wait-input",
];

/** Auto types: nodes that are automatically displayed (bot messages) */
const autoTypes = ["start", "message", "text", "base", "audio", "image", "video", "end"];

/** Mapping from node type to HTML input type */
const inputTypeMapping: Record<string, string> = {
  "text-input": "text",
  "email-input": "email",
  "phone-input": "tel",
  "website-input": "url",
  "number-input": "number",
  "date-input": "date",
  "time-input": "time",
  "payment-input": "number",
};

/** Helper: Determine if a bubble should be right-aligned (user responses) */
function isRightAligned(nodeType: string): boolean {
  return nodeType === "user";
}

/** Helper: Convert YouTube URL to embed URL */
function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

const ChatReader: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // 1. Initialize conversation with the start node.
  useEffect(() => {
    const startNode = getNodeById(chatFlow, "start");
    if (startNode) {
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

  // 3. Handle new node arrival.
  useEffect(() => {
    if (!currentNodeId) return;
    const node = getNodeById(chatFlow, currentNodeId);
    if (!node) return;

    // For wait-input nodes: delay without rendering prompt.
    if (node.type === "wait-input") {
      const seconds = parseInt(node.options?.secondsToWaitFor ?? "1", 10);
      const timer = setTimeout(() => {
        setCurrentNodeId(node.next ?? null);
      }, seconds * 1000);
      return () => clearTimeout(timer);
    }

    // For auto nodes: auto-append after a delay.
    if (autoTypes.includes(node.type)) {
      const timer = setTimeout(() => {
        setConversation((prev) => [...prev, node]);
        setCurrentNodeId(node.next ?? null);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // For interactive nodes: if not already appended, add the prompt.
    if (interactiveTypes.includes(node.type)) {
      const alreadyInHistory = conversation.some((c) => c.id === node.id);
      if (!alreadyInHistory) {
        setConversation((prev) => [...prev, node]);
      }
    }
  }, [currentNodeId, conversation]);

  // 4. Handle interactive input submission.
  function handleInputSubmit() {
    if (!inputValue.trim()) return;
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: inputValue },
    };
    // Append the user bubble on the right.
    setConversation((prev) => [...prev, userBubble]);
    setTimeout(() => {
      const node = getNodeById(chatFlow, currentNodeId);
      if (node) {
        setCurrentNodeId(node.next ?? null);
      }
    }, 500);
    setInputValue("");
  }

  // Submit on Enter.
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  }

  // 5. Handle choice selection.
  function handleChoiceSelect(choice: any) {
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: choice.text },
    };
    setConversation((prev) => [...prev, userBubble]);
    setTimeout(() => {
      setCurrentNodeId(choice.next ?? null);
    }, 500);
  }

  // 6. Render node content.
  function renderNode(node: any) {
    // a) Interactive input nodes (non-choice).
    if (interactiveTypes.includes(node.type) && node.type !== "choice" && node.type !== "wait-input") {
      const htmlInputType = inputTypeMapping[node.type] || "text";
      return (
        <VStack spacing={3} align="stretch" className={`bubble-${node.type}`}>
          <Box>
            <Text>{node.content.prompt}</Text>
          </Box>
          <HStack className="input-container">
            <Input
              type={htmlInputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className="flex-1"
            />
            <Button onClick={handleInputSubmit} colorScheme="blue">
              Send
            </Button>
          </HStack>
        </VStack>
      );
    }

    // b) Choice node.
    if (node.type === "choice") {
      return (
        <VStack spacing={3} align="stretch" className={`bubble-${node.type}`}>
          <Box>
            <Text>{node.content.text}</Text>
          </Box>
          <HStack className="choices-container">
            {node.content.choices.map((choice: any) => (
              <Button key={choice.id} onClick={() => handleChoiceSelect(choice)} colorScheme="teal">
                {choice.text}
              </Button>
            ))}
          </HStack>
        </VStack>
      );
    }

    // c) Wait-input: no UI.
    if (node.type === "wait-input") {
      return null;
    }

    // d) Video node.
    if (node.type === "video") {
      const { mediaType, videoUrl, url } = node.content;
      if (mediaType === "youtube") {
        const embedUrl = getYoutubeEmbedUrl(videoUrl || url);
        return (
          <Box className={`bubble-${node.type}`}>
            <iframe
              src={embedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-64 h-40"
            />
          </Box>
        );
      }
      // If it's a direct video URL:
      return (
        <Box className={`bubble-${node.type}`}>
          <video controls className="w-64">
            <source src={videoUrl || url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    }

    // e) Image node.
    if (node.type === "image") {
      return (
        <Box className={`bubble-${node.type}`}>
          <img src={node.content.imageUrl} alt={node.content.alt} className="w-64" />
        </Box>
      );
    }

    // f) All other auto nodes (start, message, text, etc.)
    return (
      <Box className={`bubble-${node.type}`}>
        <Text>{node.content?.text}</Text>
      </Box>
    );
  }

  // 7. Get the current node.
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
        {/* Render the current interactive prompt if not already in conversation */}
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
