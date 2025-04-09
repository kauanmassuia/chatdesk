import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Image } from '@chakra-ui/react';
import '../styles/chat.css';
import { useParams } from 'react-router-dom';
import { fetchPublishedFlow } from '../services/flowService';
import { saveAnswer } from '../services/answerService';
import logoImage from '../assets/logovendflow.png';

// Import node renderers
import { renderTextNode } from '../components/nodes/TextNode';
import { renderImageNode } from '../components/nodes/ImageNode';
import { renderVideoNode } from '../components/nodes/VideoNode';
import { renderAudioNode } from '../components/nodes/AudioNode';
import { renderMessageNode } from '../components/nodes/MessageNode';

// Import input node renderers
import { renderTextInputNode } from '../components/nodes/inputs/TextInputNode';
import { renderDateInputNode, formatDateBrazilian, parseToIsoDate } from '../components/nodes/inputs/DateInputNode';
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

// Define interface for InputField props
interface InputFieldProps {
  type?: string;
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
const InputField = React.memo(({
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

const ChatReader: React.FC = () => {
  const { custom_url } = useParams<{ custom_url: string }>();
  const [chatFlow, setChatFlow] = useState<{ nodes: FlowNode[] } | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [chatTitle, setChatTitle] = useState("Chat Assistant");
  const [botProfileImg, setBotProfileImg] = useState<string>(logoImage);
  const [showInputField, setShowInputField] = useState(false);
  const [showBrand, setShowBrand] = useState(true);
  const [themeSettings, setThemeSettings] = useState<{
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
  }>({});

  // Apply theme settings
  const fontSize = themeSettings?.fontSize || '1rem';
  const fontFamily = themeSettings?.fontFamily || 'Inter, sans-serif';
  const textColor = themeSettings?.textColor || '#1A202C';
  const headingFontSize = themeSettings?.headingFontSize || '1.2rem';
  const backgroundColor = themeSettings?.backgroundColor || '#f9fafb'; // default bg-gray-50
  const backgroundType = themeSettings?.backgroundType || 'color';
  const backgroundImage = themeSettings?.backgroundImage || '';

  // Create a style object for background
  const pageBackgroundStyle = useMemo(() => {
    // If there's a background image and the type is set to image, prioritize it
    if (backgroundImage && backgroundType === 'image') {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    // Otherwise use background color
    return {
      backgroundColor
    };
  }, [backgroundImage, backgroundColor, backgroundType]);

  // Add a semi-transparent overlay for text readability on image backgrounds
  const messageContainerStyle = useMemo(() => {
    const baseStyle = {
      paddingBottom: '60px',
      backgroundColor: 'transparent'
    };

    // If using a background image, add a subtle transparency to messages container for readability
    if (backgroundImage && backgroundType === 'image') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      };
    }

    return baseStyle;
  }, [backgroundImage, backgroundType]);

  function getNodeById(flow: { nodes: FlowNode[] }, id: string | null): FlowNode | null {
    if (!id) return null;
    return flow.nodes.find((n) => n.id === id) || null;
  }

  useEffect(() => {
    if (!custom_url) return;
    fetchPublishedFlow(custom_url).then((data) => {
      console.log('ChatReader: Fetched data:', data);

      if (data && data.published_content) {
        setChatFlow(data.published_content);

        // Set chat title if available from the published flow
        if (data.title) {
          setChatTitle(data.title);
        }

        // Set bot profile image if available
        if (data.bot_image) {
          setBotProfileImg(data.bot_image);
        }

        // First check for theme in metadata
        if (data.metadata && data.metadata.theme) {
          console.log('ChatReader: Using theme from metadata:', data.metadata.theme);
          setThemeSettings(data.metadata.theme);

          // Apply specific theme settings from metadata
          const metadataTheme = data.metadata.theme;

          if (metadataTheme.chatTitle) {
            setChatTitle(metadataTheme.chatTitle);
          }

          if (metadataTheme.botProfileImg) {
            setBotProfileImg(metadataTheme.botProfileImg);
          }

          if (metadataTheme.showVendFlowBrand !== undefined) {
            setShowBrand(metadataTheme.showVendFlowBrand);
          }
        }
        // Only check published_content.metadata as fallback if top-level metadata is missing
        else if (data.published_content?.metadata?.theme) {
          console.log('ChatReader: Using theme from published_content.metadata:',
            data.published_content.metadata.theme);
          setThemeSettings(data.published_content.metadata.theme);

          // Apply specific theme settings from published_content.metadata
          const contentTheme = data.published_content.metadata.theme;

          if (contentTheme.chatTitle) {
            setChatTitle(contentTheme.chatTitle);
          }

          if (contentTheme.botProfileImg) {
            setBotProfileImg(contentTheme.botProfileImg);
          }

          if (contentTheme.showVendFlowBrand !== undefined) {
            setShowBrand(contentTheme.showVendFlowBrand);
          }
        }
        // Finally check top-level theme_settings as last fallback
        else if (data.theme_settings) {
          console.log('ChatReader: Using theme_settings:', data.theme_settings);
          setThemeSettings(data.theme_settings);

          // Override with specific theme settings
          if (data.theme_settings.chatTitle) {
            setChatTitle(data.theme_settings.chatTitle);
          }

          if (data.theme_settings.botProfileImg) {
            setBotProfileImg(data.theme_settings.botProfileImg);
          }

          if (data.theme_settings.showVendFlowBrand !== undefined) {
            setShowBrand(data.theme_settings.showVendFlowBrand);
          }
        }
      }
    });
  }, [custom_url]);

  // Add a log to see what theme settings are being used
  useEffect(() => {
    console.log('ChatReader: Current themeSettings:', themeSettings);
  }, [themeSettings]);

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

  // Add this new useEffect for smooth scrolling to the latest message
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTo({
          top: chatHistoryRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Initial scroll
    scrollToBottom();

    // Also scroll when the window is resized, which can change the content height
    window.addEventListener('resize', scrollToBottom);

    // Set up a small delay to ensure content has been rendered
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => {
      window.removeEventListener('resize', scrollToBottom);
      clearTimeout(timeoutId);
    };
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
      // Adicionar o nó de input ao histórico de conversa para manter o prompt visível
      const alreadyInHistory = conversation.some((c) => c.id === node.id);
      if (!alreadyInHistory) {
        const timer = setTimeout(() => {
          setConversation((prev) => [...prev, node]);
        }, 1000);
        return () => clearTimeout(timer);
      }

      // Mostrar o campo de input após um pequeno delay para coincidir com o prompt
      setShowInputField(false);
      const inputTimer = setTimeout(() => {
        setShowInputField(true);
      }, 1500); // Um pouco mais de delay que o prompt para parecer uma sequência natural

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

  // Add this function for handling already answered nodes
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
    if (!inputValue?.trim() || !isInputValid) return;

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
    if (e.key === "Enter" && isInputValid && inputValue?.trim()) {
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

  // Node renderer mapping function - used for rendering in the conversation history
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

  return (
    <div className="flex flex-col h-screen" style={{
      fontSize,
      fontFamily,
      color: textColor,
      ...pageBackgroundStyle // Apply background to entire page
    }}>
      {/* Header with bot profile pic and title */}
      <div className="p-3 bg-white shadow-sm flex items-center border-b">
        <div className="flex items-center max-w-3xl mx-auto w-full">
          <img src={botProfileImg} alt="Bot" className="h-9 w-9 rounded-full object-cover mr-3" />
          <h1 className="font-medium" style={{ fontSize: headingFontSize }}>{chatTitle}</h1>
        </div>
      </div>

      {/* Chat container com área de rolagem */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full relative overflow-hidden">
        {/* Messages area com rolagem - no background here, it should be transparent */}
        <div
          ref={chatHistoryRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={messageContainerStyle}
        >
          {/* Center Watermark - Only show if showBrand is true */}
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
            // Skip rendering start nodes
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
                    " rounded-2xl p-3 max-w-[80%] shadow-md bubble-" +
                    node.type
                  }
                  style={{ fontFamily }}
                >
                  {renderNode(node)}
                </div>
              </div>
            );
          })}

          {/* Display current interactive input node - only if it's active (not answered) */}
          {currentNode && interactiveTypes.includes(currentNode.type) &&
           !currentNode.content?.answered && showInputField && (
            <>
              {/* User input field on the right */}
              {currentNode.type !== "input_wait" && (
                <div className="flex justify-end mt-2 mb-10">
                  <div
                    className="bg-white rounded-2xl p-2 max-w-[80%] shadow-md bubble-animate bubble-appear"
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

        {/* Fixed watermark at the bottom - Only show if showBrand is true */}
        {showBrand && (
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-white bg-opacity-90 border-t border-gray-200 text-center z-10 max-w-3xl mx-auto w-full backdrop-blur-sm">
            <div className="flex justify-center items-center">
              <img src={logoImage} alt="VendFlow" className="h-4 mr-1" />
              <span className="text-xs font-medium text-gray-600">Powered by VendFlow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatReader;
