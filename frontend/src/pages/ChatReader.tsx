import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';

// --- Static JSON Flow (prototype) ---
const chatFlow = {
  version: "1.0",
  id: "unique_chat_id",
  name: "Chatbot Name",
  nodes: [
    {
      id: "start_1",
      type: "start",
      position: { x: 0, y: 0 },
      next: "msg_1"
    },
    {
      id: "msg_1",
      type: "message",
      position: { x: 100, y: 200 },
      content: {
        text: "Hello! Welcome to our chatbot."
      },
      next: "choice_1"
    },
    {
      id: "choice_1",
      type: "choice",
      position: { x: 300, y: 400 },
      content: {
        text: "What would you like to do?",
        choices: [
          { id: "c1", text: "Learn more", next: "input_1" },
          { id: "c2", text: "Exit", next: "end_1" }
        ]
      }
    },
    {
      id: "input_1",
      type: "input",
      position: { x: 500, y: 600 },
      content: {
        prompt: "Please enter your email:",
        inputType: "email",
        variable: "user_email"
      },
      next: "media_1"
    },
    {
      id: "media_1",
      type: "media",
      position: { x: 700, y: 800 },
      content: {
        mediaType: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      next: "end_1"
    },
    {
      id: "end_1",
      type: "end",
      position: { x: 900, y: 1000 }
    }
  ],
  variables: [
    {
      id: "user_email",
      name: "User Email",
      type: "string",
      isSessionVariable: true
    }
  ]
};

// --- Helper: find node by id ---
const getNodeById = (flow: typeof chatFlow, id: string) => {
  return flow.nodes.find((n) => n.id === id);
};

const ChatReader: React.FC = () => {
  // State for current node id and conversation history
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with start node on mount
  useEffect(() => {
    const startNode = chatFlow.nodes.find((n) => n.type === 'start');
    if (startNode) {
      // Optionally add a welcome banner from the start node (if it had content)
      setConversation((prev) => [...prev, startNode]);
      // Only update current node if startNode.next exists
      setCurrentNodeId(startNode.next ? startNode.next : null);
    }
  }, []);

  // Auto-scroll chat history to bottom when conversation updates
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversation]);

  // Auto-transition for non-interactive nodes (start, message, media, end)
  useEffect(() => {
    if (currentNodeId) {
      const node = getNodeById(chatFlow, currentNodeId);
      if (node && (node.type === "start" || node.type === "message" || node.type === "media" || node.type === "end")) {
        // Delay 1 second before auto-transition
        const timer = setTimeout(() => {
          // Append the node to conversation history
          setConversation((prev) => [...prev, node]);
          if (node.next) {
            setCurrentNodeId(node.next);
          } else {
            setCurrentNodeId(null);
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentNodeId]);

  // Handle input submission for input nodes
  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    const userBubble = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: { text: inputValue }
    };
    setConversation((prev) => [...prev, userBubble]);
    // After 1 second, append the input node itself and auto-move on
    setTimeout(() => {
      const node = getNodeById(chatFlow, currentNodeId!);
      if (node) {
        setConversation((prev) => [...prev, node]);
        if (node.next) {
          setCurrentNodeId(node.next);
        } else {
          setCurrentNodeId(null);
        }
      }
    }, 1000);
    setInputValue('');
  };

  // Handle choice selection for choice nodes
  const handleChoiceSelect = (choice: any) => {
    const userBubble = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: { text: choice.text }
    };
    setConversation((prev) => [...prev, userBubble]);
    // Append the current choice node to history, then after a delay update current node
    const currentNode = getNodeById(chatFlow, currentNodeId!);
    setConversation((prev) => [...prev, currentNode]);
    setTimeout(() => {
      setCurrentNodeId(choice.next);
    }, 1000);
  };

  // Render a node according to its type
  const renderNode = (node: any) => {
    switch (node.type) {
      case "start":
      case "message":
        return <div>{node.content?.text}</div>;
      case "input":
        return (
          <div>
            <div>{node.content.prompt}</div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type={node.content.inputType || "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                className="border border-gray-300 rounded px-3 py-2 flex-1"
              />
              <button
                onClick={handleInputSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        );
      case "choice":
        return (
          <div>
            <div>{node.content.text}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {node.content.choices.map((choice: any) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  className="bg-teal-500 text-white px-3 py-2 rounded"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        );
      case "media":
        if (node.content.mediaType === "video") {
          return (
            <div>
              <video controls className="w-64">
                <source src={node.content.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
        return null;
      case "end":
        return <div>Thank you for chatting!</div>;
      default:
        return null;
    }
  };

  // Get current node from flow
  const currentNode = currentNodeId ? getNodeById(chatFlow, currentNodeId) : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Chat History */}
      <div ref={chatHistoryRef} className="flex flex-col flex-1 overflow-y-auto p-4 space-y-2">
        {conversation.map((node, index) => (
          <div
            key={index}
            className={node.type === "user" ? "self-end bg-user-bubble text-user-bubble rounded-xl p-2 max-w-[80%]" : "self-start bg-bot-bubble text-bot-bubble rounded-xl p-2 max-w-[80%]"}
          >
            {node.content?.text}
          </div>
        ))}
      </div>
      {/* Current Node (if interactive) */}
      {currentNode && (currentNode.type === "input" || currentNode.type === "choice") && (
        <div className="p-4 border-t border-gray-300">
          {renderNode(currentNode)}
        </div>
      )}
    </div>
  );
};

export default ChatReader;
