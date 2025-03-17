import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Input, Button, VStack, HStack } from '@chakra-ui/react';
import '../styles/chat.css';

/**
 * Example JSON with a variety of node types.
 * In production, you'll load this via an API.
 */
const chatFlow = {
  version: "1.0",
  id: "test_flow_all_nodes",
  name: "Test Flow - All Nodes",
  nodes: [
    {
      id: "start_1",
      type: "start",
      content: { text: "Hello! Welcome to our chatbot." },
      next: "choice_1",
    },
    {
      id: "choice_1",
      type: "choice",
      content: {
        text: "What would you like to do?",
        choices: [
          { id: "c1", text: "Learn more", next: "email_input_1" },
          { id: "c2", text: "Exit", next: "end_1" },
        ],
      },
    },
    {
      id: "email_input_1",
      type: "email-input",
      content: { prompt: "Please enter your email:" },
      next: "wait_input_1",
    },
    {
      id: "wait_input_1",
      type: "wait-input",
      options: { secondsToWaitFor: "3" },
      next: "media_1",
    },
    {
      id: "media_1",
      type: "media",
      content: {
        mediaType: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      next: "end_1",
    },
    {
      id: "end_1",
      type: "end",
      content: { text: "Thank you for chatting!" },
    },
  ],
};

/** Find a node by ID */
function getNodeById(flow: typeof chatFlow, id: string | null) {
  return flow.nodes.find((n) => n.id === id) || null;
}

/** Node types that require user interaction (prompts) */
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

/** Node types that are purely bot messages (automatically displayed) */
const autoTypes = ["start", "message", "media", "end", "text", "base", "audio", "image", "video"];

/**
 * Decide if a node bubble is rendered on the left or right.
 * - "user" bubbles always on right
 * - "choice", "input" prompts on left
 * - "wait-input" doesn't usually show a bubble, but if it does, also on left
 */
function isRightAligned(nodeType: string): boolean {
  return nodeType === "user";
}

/** Mapping from node.type to HTML <input> type */
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

const ChatReader: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // --- 1) On mount, go to start node (if any).
  useEffect(() => {
    const startNode = getNodeById(chatFlow, "start_1"); // or find((n) => n.type === 'start')
    if (startNode) {
      // Add to conversation if it's an auto-type node
      if (autoTypes.includes(startNode.type)) {
        setConversation([startNode]);
      }
      setCurrentNodeId(startNode.next ?? null);
    }
  }, []);

  // --- 2) Autoscroll on conversation update.
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversation]);

  // --- 3) On currentNodeId change, handle logic for the new node.
  useEffect(() => {
    if (!currentNodeId) return;
    const node = getNodeById(chatFlow, currentNodeId);
    if (!node) return;

    // a) WAIT-INPUT node => no bubble, just delay
    if (node.type === "wait-input") {
      const seconds = parseInt(node.options?.secondsToWaitFor ?? "1", 10);
      const timer = setTimeout(() => {
        // We don't display anything for wait nodes in conversation
        // Just move on
        setCurrentNodeId(node.next ?? null);
      }, seconds * 1000);
      return () => clearTimeout(timer);
    }

    // b) If node is auto-type => append to conversation automatically
    if (autoTypes.includes(node.type)) {
      // Delay 1 second for a more natural feel
      const timer = setTimeout(() => {
        setConversation((prev) => [...prev, node]);
        setCurrentNodeId(node.next ?? null);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // c) If node is interactive => show it once in conversation on the left
    //    (But do not re-append if it's already there)
    if (interactiveTypes.includes(node.type)) {
      // If it's not in conversation yet, append it
      const alreadyInHistory = conversation.some((c) => c.id === node.id);
      if (!alreadyInHistory) {
        setConversation((prev) => [...prev, node]);
      }
    }
  }, [currentNodeId]);

  // --- 4) Handle user input submission
  function handleInputSubmit() {
    if (!inputValue.trim()) return;
    // Append user bubble on the right
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: inputValue },
    };
    setConversation((prev) => [...prev, userBubble]);

    // Move on to next node
    setTimeout(() => {
      const node = getNodeById(chatFlow, currentNodeId);
      if (node) {
        setCurrentNodeId(node.next ?? null);
      }
    }, 500);
    setInputValue("");
  }

  // Submit on Enter
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  }

  // --- 5) Handle choice selection
  function handleChoiceSelect(choice: any) {
    // Add user bubble on right
    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: choice.text },
    };
    setConversation((prev) => [...prev, userBubble]);

    // Move on
    setTimeout(() => {
      setCurrentNodeId(choice.next ?? null);
    }, 500);
  }

  // --- 6) Render node content
  function renderNode(node: any) {
    // a) Interactive input nodes
    if (interactiveTypes.includes(node.type) && node.type !== "choice" && node.type !== "wait-input") {
      const inputType = inputTypeMapping[node.type] ?? "text";
      return (
        <VStack spacing={3} align="stretch" className={`bubble-${node.type}`}>
          <Box>
            <Text>{node.content.prompt}</Text>
          </Box>
          <HStack className="input-container">
            <Input
              type={inputType}
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

    // b) Choice node
    if (node.type === "choice") {
      return (
        <VStack spacing={3} align="stretch" className={`bubble-${node.type}`}>
          <Box>
            <Text>{node.content.text}</Text>
          </Box>
          <HStack className="choices-container">
            {node.content.choices.map((choice: any) => (
              <Button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice)}
                colorScheme="teal"
              >
                {choice.text}
              </Button>
            ))}
          </HStack>
        </VStack>
      );
    }

    // c) Wait-input => typically we don't render anything
    if (node.type === "wait-input") {
      return null;
    }

    // d) Media node
    if (node.type === "media") {
      const { mediaType, url } = node.content;
      if (mediaType === "video") {
        return (
          <Box className={`bubble-${node.type}`}>
            <video controls className="w-64">
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      }
      if (mediaType === "audio") {
        return (
          <Box className={`bubble-${node.type}`}>
            <audio controls>
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        );
      }
      if (mediaType === "image") {
        return (
          <Box className={`bubble-${node.type}`}>
            <img src={url} alt="media" className="w-64" />
          </Box>
        );
      }
    }

    // e) All other auto-types (start, message, end, etc.)
    return (
      <Box className={`bubble-${node.type}`}>
        <Text>{node.content?.text}</Text>
      </Box>
    );
  }

  // --- 7) Current node if it’s interactive but not appended yet
  const currentNode = getNodeById(chatFlow, currentNodeId);

  return (
    <div className="flex flex-col h-screen">
      <div ref={chatHistoryRef} className="flex flex-col flex-1 overflow-y-auto p-4 space-y-2">
        {/* Conversation so far */}
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

        {/* If the current node is interactive & not in conversation, show it on left. */}
        {currentNode &&
          interactiveTypes.includes(currentNode.type) &&
          !conversation.some((c) => c.id === currentNode.id) && (
            <div
              className={
                "self-start bg-bot-bubble text-bot-bubble rounded-xl p-2 max-w-[80%] bubble-" +
                currentNode.type
              }
            >
              {renderNode(currentNode)}
            </div>
          )}
      </div>
    </div>
  );
};

export default ChatReader;
