import React, { useState, useEffect, useRef, memo } from 'react';
import { Box, Image } from '@chakra-ui/react';
import '../styles/chat.css';
import logoImage from '../assets/logovendflow.png';
import fallbackFlowData from '../data/testChatReader.json';

// Import node renderers
import { renderTextNode } from '../components/nodes/TextNode';
import { renderImageNode } from '../components/nodes/ImageNode';
import { renderVideoNode } from '../components/nodes/VideoNode';
import { renderAudioNode } from '../components/nodes/AudioNode';
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

interface TestChatReaderProps {
  flowData: any;  // The flow content to test
  themeSettings?: {
    botProfileImg?: string;
    chatTitle?: string;
    fontSize?: string;
    fontFamily?: string;
    textColor?: string;
    headingFontSize?: string;
    backgroundColor?: string;
    backgroundType?: string;
    backgroundImage?: string;
    showVendFlowBrand?: boolean;
  };
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

// Check if flow data is sufficient (has more than just a start node)
const isFlowDataSufficient = (flowData: any): boolean => {
  if (!flowData || !flowData.nodes || !Array.isArray(flowData.nodes)) {
    return false;
  }

  // Check if there are at least two nodes and one of them is not a start node
  const nodesCount = flowData.nodes.length;
  const nonStartNodes = flowData.nodes.filter((node: { type: string }) => node.type !== 'start').length;

  return nodesCount >= 2 && nonStartNodes >= 1;
};

// Define interface for InputField props
interface InputFieldProps {
  nodeType: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputSubmit: () => void;
  isInvalid: boolean;
  currentNode: FlowNode;
  handleChoiceSelect: (choice: any) => void;
}

// Create an InputField component outside the main component
const InputField = memo(({
  nodeType,
  inputValue,
  setInputValue,
  handleKeyDown,
  handleInputSubmit,
  isInvalid,
  currentNode,
  handleChoiceSelect
}: InputFieldProps) => {
  // Common props for all input renderers
  const props = {
    node: currentNode,
    inputValue,
    setInputValue,
    handleKeyDown,
    handleInputSubmit,
    isInvalid,
    handleChoiceSelect
  };

  // Only render the input fields, not the prompt
  switch (nodeType) {
    case "input_text":
      return renderTextInputNode(props);
    case "input_date":
      return renderDateInputNode(props);
    case "input_email":
      return renderEmailInputNode(props);
    case "input_phone":
      return renderPhoneInputNode(props);
    case "input_number":
      return renderNumberInputNode(props);
    case "input_website":
      return renderWebsiteInputNode(props);
    case "input_buttons":
      return renderButtonsInputNode(props);
    case "input_pic_choice":
      return renderPicChoiceInputNode(props);
    case "input_payment":
      return renderPaymentInputNode(props);
    case "input_wait":
      return renderWaitInputNode(props);
    default:
      console.warn(`Unsupported input node type: ${nodeType}`);
      return null;
  }
});

const TestChatReader: React.FC<TestChatReaderProps> = ({ flowData, themeSettings }) => {
  const [chatFlow, setChatFlow] = useState<{ nodes: FlowNode[] } | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [chatTitle, setChatTitle] = useState(themeSettings?.chatTitle || "Assistente de Chat");
  const [botProfileImg, setBotProfileImg] = useState<string>(themeSettings?.botProfileImg || logoImage);
  const [showInputField, setShowInputField] = useState(false);
  const [showBrand, setShowBrand] = useState(themeSettings?.showVendFlowBrand !== false);

  // Apply theme settings from metadata
  const fontSize = themeSettings?.fontSize || '1rem';
  const fontFamily = themeSettings?.fontFamily || 'Inter, sans-serif';
  const textColor = themeSettings?.textColor || '#1A202C';
  const headingFontSize = themeSettings?.headingFontSize || '1.2rem';
  const backgroundColor = themeSettings?.backgroundColor || '#f9fafb'; // default bg-gray-50

  function getNodeById(flow: { nodes: FlowNode[] }, id: string | null): FlowNode | null {
    if (!id) return null;
    return flow.nodes.find((n) => n.id === id) || null;
  }

  useEffect(() => {
    // Check if we have valid flow data, otherwise use fallback
    if (isFlowDataSufficient(flowData)) {
      setChatFlow(flowData);
    } else {
      console.log('Using fallback flow data for chat preview');
      setChatFlow(fallbackFlowData);
    }
  }, [flowData]);

  useEffect(() => {
    if (!chatFlow) return;
    const startNode = getNodeById(chatFlow, "start");
    if (startNode) {
      // Skip rendering the start node, just move to its next node
      setCurrentNodeId(startNode.next ?? null);
    }
  }, [chatFlow]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversation]);

  // Update scroll effect to be more robust
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatHistoryRef.current) {
        const scrollHeight = chatHistoryRef.current.scrollHeight;
        const height = chatHistoryRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        chatHistoryRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      }
    };

    scrollToBottom();
    // Add a small delay to ensure content has rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [conversation, currentNodeId, showInputField]);

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
      // Add the input node to the conversation history to keep the prompt visible
      const alreadyInHistory = conversation.some((c) => c.id === node.id);
      if (!alreadyInHistory) {
        const timer = setTimeout(() => {
          setConversation((prev) => [...prev, node]);
        }, 1000);
        return () => clearTimeout(timer);
      }

      // Show the input field after a small delay to coincide with the prompt
      setShowInputField(false);
      const inputTimer = setTimeout(() => {
        setShowInputField(true);
      }, 1500);

      // Reset input value and validation when showing a new input node
      setInputValue("");
      setIsInputValid(true);

      return () => clearTimeout(inputTimer);
    }
  }, [currentNodeId, chatFlow, conversation]);

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

  // Mark node as answered
  function markNodeAsAnswered(node: FlowNode): FlowNode {
    if (!node) return node;
    return {
      ...node,
      content: {
        ...(node.content || {}),
        answered: true
      }
    };
  }

  function handleInputSubmit() {
    if (!inputValue.trim() || !isInputValid) return;

    const userBubble = {
      id: `user_${Date.now()}`,
      type: "user",
      content: { text: inputValue },
    };

    setConversation((prev) => {
      // Mark the current node as answered before adding user's response
      return prev.map(n =>
        n.id === currentNodeId ? markNodeAsAnswered(n) : n
      ).concat(userBubble);
    });

    // No answer saving in test mode

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

    setConversation((prev) => {
      // Mark the current node as answered before adding user's response
      return prev.map(n =>
        n.id === currentNodeId ? markNodeAsAnswered(n) : n
      ).concat(userBubble);
    });

    // No answer saving in test mode

    setTimeout(() => {
      setCurrentNodeId(choice.next ?? null);
    }, 500);
  }

  // Node renderer mapping function
  function renderNode(node: FlowNode) {
    // Skip rendering start nodes
    if (!node || node.type === "start") {
      return null;
    }

    // If node is an answered input node, only show the prompt
    if (node.content?.answered && interactiveTypes.includes(node.type)) {
      // For answered input nodes, pass the node to its renderer
      const { type } = node;
      switch(type) {
        case "input_text":
          return renderTextInputNode({ node });
        case "input_date":
          return renderDateInputNode({ node });
        case "input_website":
          return renderWebsiteInputNode({ node });
        case "input_phone":
          return renderPhoneInputNode({ node });
        case "input_email":
          return renderEmailInputNode({ node });
        case "input_number":
          return renderNumberInputNode({ node });
        case "input_buttons":
          return renderButtonsInputNode({ node });
        case "input_pic_choice":
          return renderPicChoiceInputNode({ node });
        case "input_wait":
          return renderWaitInputNode({ node });
        case "input_payment":
          return renderPaymentInputNode({ node });
        default:
          return <Box>{node.content?.prompt || ''}</Box>;
      }
    }

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
      case "message":
        return renderMessageNode(node);
      case "user":
        return renderTextNode(node); // User messages are rendered as text

      // All input types - properly delegate to their respective render functions
      case "input_text":
        return renderTextInputNode({ node });
      case "input_date":
        return renderDateInputNode({ node });
      case "input_website":
        return renderWebsiteInputNode({ node });
      case "input_phone":
        return renderPhoneInputNode({ node });
      case "input_email":
        return renderEmailInputNode({ node });
      case "input_number":
        return renderNumberInputNode({ node });
      case "input_buttons":
        return renderButtonsInputNode({ node });
      case "input_pic_choice":
        return renderPicChoiceInputNode({ node });
      case "input_wait":
        return renderWaitInputNode({ node });
      case "input_payment":
        return renderPaymentInputNode({ node });

      default:
        console.warn(`Unsupported node type: ${node.type}`);
        return <Box>Unsupported node type: {node.type}</Box>;
    }
  }

  const currentNode = chatFlow ? getNodeById(chatFlow, currentNodeId) : null;

  useEffect(() => {
    // Update chat title and bot profile image when theme settings change
    if (themeSettings?.chatTitle) {
      setChatTitle(themeSettings.chatTitle);
    }
    if (themeSettings?.botProfileImg) {
      setBotProfileImg(themeSettings.botProfileImg);
    }
    if (themeSettings?.showVendFlowBrand !== undefined) {
      setShowBrand(themeSettings.showVendFlowBrand);
    }
    // Note: we don't need to update other theme variables as they're used directly from themeSettings
  }, [themeSettings]);

  return (
    <div className="flex flex-col h-full overflow-hidden relative" style={{
      fontSize,
      fontFamily,
      color: textColor
    }}>
      {/* Header with bot profile pic and title */}
      <div className="p-3 bg-white shadow-sm flex items-center border-b">
        <div className="flex items-center w-full">
          <img src={botProfileImg} alt="Bot" className="h-9 w-9 rounded-full object-cover mr-3" />
          <h1 className="font-medium" style={{ fontSize: headingFontSize }}>{chatTitle}</h1>
        </div>
      </div>

      {/* Chat messages with scroll */}
      <div
        ref={chatHistoryRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 relative"
        style={{
          backgroundColor,
          height: 'calc(100% - 114px)', // Account for header (59px) and footer (55px)
          position: 'relative'
        }}
      >
        {/* Center Watermark - Fixed relative to chat container */}
        {showBrand && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              height: '80%'
            }}
            className="watermark-container"
            aria-hidden="true"
          >
            <img
              src={logoImage}
              alt="VendFlow Watermark"
              style={{
                width: '160px',
                opacity: 0.25,
                maxWidth: '100%'
              }}
            />
          </div>
        )}

        {conversation.map((node, idx) => {
          if (node.type === "start") return null;
          const alignRight = isRightAligned(node.type);
          return (
            <div
              key={node.id || idx}
              className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}
            >
              {!alignRight && (
                <img
                  src={botProfileImg}
                  alt="Bot"
                  className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                />
              )}
              <div
                className={
                  (alignRight
                    ? "bg-user-bubble text-user-bubble"
                    : "bg-bot-bubble text-bot-bubble") +
                  " rounded-2xl p-3 max-w-[80%] shadow-sm bubble-" +
                  node.type
                }
                style={{ fontFamily }}
              >
                {renderNode(node)}
              </div>
            </div>
          );
        })}

        {/* Current interactive input */}
        {currentNode && interactiveTypes.includes(currentNode.type) &&
         !currentNode.content?.answered && showInputField && (
          <>
            {currentNode.type !== "input_wait" && (
              <div className="flex justify-end mt-2">
                <div
                  className="bg-white rounded-2xl p-2 max-w-[80%] shadow-sm bubble-animate bubble-appear"
                  style={{ fontFamily }}
                >
                  <InputField
                    nodeType={currentNode.type}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleKeyDown={handleKeyDown}
                    handleInputSubmit={handleInputSubmit}
                    isInvalid={!isInputValid}
                    currentNode={currentNode}
                    handleChoiceSelect={handleChoiceSelect}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Watermark footer */}
      {showBrand && (
        <div className="p-3 bg-white bg-opacity-90 border-t border-gray-200 text-center w-full">
          <div className="flex justify-center items-center">
            <img src={logoImage} alt="VendFlow" className="h-4 mr-1" />
            <span className="text-xs font-medium text-gray-600">Desenvolvido por VendFlow</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestChatReader;
