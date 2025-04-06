import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import '../styles/chat.css';
import { useParams } from 'react-router-dom';
import { fetchPublishedFlow } from '../services/flowService';
import { saveAnswer } from '../services/answerService';

// Import node renderers
import { renderTextNode } from '../components/nodes/TextNode';
import { renderImageNode } from '../components/nodes/ImageNode';
import { renderVideoNode } from '../components/nodes/VideoNode';
import { renderAudioNode } from '../components/nodes/AudioNode';
import { renderStartNode } from '../components/nodes/StartNode';
import { renderMessageNode } from '../components/nodes/MessageNode';

// Import input node renderers
import { renderTextInputNode } from '../components/nodes/inputs/TextInputNode';
import { renderDateInputNode } from '../components/nodes/inputs/DateInputNode';
import { renderWebsiteInputNode } from '../components/nodes/inputs/WebsiteInputNode';
import { renderPhoneInputNode } from '../components/nodes/inputs/PhoneInputNode';
import { renderEmailInputNode } from '../components/nodes/inputs/EmailInputNode';
import { renderNumberInputNode } from '../components/nodes/inputs/NumberInputNode';
import { renderButtonsInputNode } from '../components/nodes/inputs/ButtonsInputNode';
import { renderPicChoiceInputNode } from '../components/nodes/inputs/PicChoiceInputNode';
import { renderWaitInputNode } from '../components/nodes/inputs/WaitInputNode';
import { renderPaymentInputNode } from '../components/nodes/inputs/PaymentInputNode';

interface FlowNode {
  id: string;
  type: string;
  content: any;
  next: string | null;
}

const interactiveTypes: string[] = [
  "input_text",
  "input_date",
  "input_website",
  "input_phone",
  "input_email",
  "input_wait",
  "input_buttons",
  "input_pic_choice",
  "input_number",
  "input_payment",
];

const autoTypes: string[] = ["start", "text", "image", "video", "audio", "message"];

function isRightAligned(nodeType: string): boolean {
  return nodeType === "user";
}

const ChatReader: React.FC = () => {
  const { custom_url } = useParams<{ custom_url: string }>();
  const [chatFlow, setChatFlow] = useState<{ nodes: FlowNode[] } | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
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

  // Validate input based on current node type and validation rules
  const validateInput = (value: string, node: FlowNode): boolean => {
    if (!node || !node.content || !node.content.validation) return true;

    const { pattern } = node.content.validation;
    if (!pattern || !value) return true;

    try {
      const regex = new RegExp(pattern);
      return regex.test(value);
    } catch (e) {
      console.error("Invalid regex pattern:", pattern);
      return true; // If pattern is invalid, don't block submission
    }
  };

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

      // Reset input value and validation when showing a new input node
      setInputValue("");
      setIsInputValid(true);
    }
  }, [currentNodeId, conversation, chatFlow]);

  // Update validation status whenever input changes
  useEffect(() => {
    if (!chatFlow || !currentNodeId) return;
    const node = getNodeById(chatFlow, currentNodeId);
    if (!node) return;

    // Only validate if there's input and the node type requires validation
    if (inputValue && interactiveTypes.includes(node.type)) {
      setIsInputValid(validateInput(inputValue, node));
    } else {
      setIsInputValid(true);
    }
  }, [inputValue, currentNodeId, chatFlow]);

  function handleInputSubmit() {
    if (!inputValue.trim() || !isInputValid) return;

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
    if (e.key === "Enter" && isInputValid && inputValue.trim()) {
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

    // Save choice answer
    if (custom_url && currentNodeId) {
      const choiceValue = choice.value || choice.label;
      saveAnswer(custom_url, { [currentNodeId]: choiceValue })
        .catch((error) => console.error("Error saving choice:", error));
    }

    setTimeout(() => {
      setCurrentNodeId(choice.next ?? null);
    }, 500);
  }

  // Node renderer mapping function
  function renderNode(node: FlowNode) {
    const props = {
      node,
      inputValue,
      setInputValue,
      handleKeyDown,
      handleInputSubmit,
      handleChoiceSelect,
      isInvalid: !isInputValid
    };

    // Map node types to their respective renderer functions
    switch (node.type) {
      // Auto types
      case "text":
        return renderTextNode(node);
      case "image":
        return renderImageNode(node);
      case "video":
        return renderVideoNode(node);
      case "audio":
        return renderAudioNode(node);
      case "start":
        return renderStartNode(node);
      case "message":
        return renderMessageNode(node);
      case "user":
        return renderTextNode(node); // User messages are rendered as text

      // Input types
      case "input_text":
        return renderTextInputNode(props);
      case "input_date":
        return renderDateInputNode(props);
      case "input_website":
        return renderWebsiteInputNode(props);
      case "input_phone":
        return renderPhoneInputNode(props);
      case "input_email":
        return renderEmailInputNode(props);
      case "input_number":
        return renderNumberInputNode(props);
      case "input_buttons":
        return renderButtonsInputNode(props);
      case "input_pic_choice":
        return renderPicChoiceInputNode(props);
      case "input_wait":
        return renderWaitInputNode(props);
      case "input_payment":
        return renderPaymentInputNode(props);

      default:
        // Fallback for unknown node types
        return <Box>{node.content?.text || ""}</Box>;
    }
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
