import React, { useState, useEffect, useRef } from 'react';
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

const TestChatReader: React.FC<TestChatReaderProps> = ({ flowData, themeSettings }) => {
  const [chatFlow, setChatFlow] = useState<{ nodes: FlowNode[] } | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [chatTitle, setChatTitle] = useState(themeSettings?.chatTitle || "Chat Assistant");
  const [botProfileImg, setBotProfileImg] = useState<string>(themeSettings?.botProfileImg || logoImage);
  const [showInputField, setShowInputField] = useState(false);

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
        ...node.content,
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
    if (node.type === "start") {
      return null;
    }

    // If node is an answered input node, only show the prompt
    if (node.content?.answered && interactiveTypes.includes(node.type)) {
      return <Box>{node.content.prompt}</Box>;
    }

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
      case "message":
        return renderMessageNode(node);
      case "user":
        return renderTextNode(node); // User messages are rendered as text

      // Input types
      case "input_text":
        return renderTextInputNode(props);
      case "input_date":
        return (
          <div className="p-1">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  // Accept only digits and slashes for date input
                  const value = e.target.value.replace(/[^\d/]/g, '');

                  // Format as user types: add slashes automatically
                  let formattedValue = value;
                  if (value.length === 2 && !value.includes('/')) {
                    formattedValue = value + '/';
                  } else if (value.length === 5 && value.indexOf('/') === 2 && !value.includes('/', 3)) {
                    formattedValue = value + '/';
                  }

                  setInputValue(formattedValue);
                }}
                onKeyDown={handleKeyDown}
                placeholder="DD/MM/AAAA"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                maxLength={10}
                key="input-date"
                autoFocus
              />
            </div>
            <button
              onClick={handleInputSubmit}
              disabled={(!isInputValid && !!inputValue) || inputValue.length < 10}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
            >
              Enviar
            </button>
          </div>
        );
      case "input_website":
        return renderWebsiteInputNode(props);
      case "input_phone":
        return renderPhoneInputNode(props);
      case "input_email":
        return renderEmailInputNode(props);
      case "input_number":
        return renderNumberInputNode(props);
      case "input_buttons":
        return <Box>{node.content.prompt}</Box>;
      case "input_pic_choice":
        return <Box>{node.content.prompt}</Box>;
      case "input_wait":
        return renderWaitInputNode(props);
      case "input_payment":
        return renderPaymentInputNode(props);

      default:
        if (node) {
          return renderNode(node);
        }
        return null;
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
    // Note: we don't need to update other theme variables as they're used directly from themeSettings
  }, [themeSettings]);

  return (
    <div className="flex flex-col h-screen" style={{
      fontSize,
      fontFamily,
      color: textColor,
      backgroundColor
    }}>
      {/* Header with bot profile pic and title */}
      <div className="p-3 bg-white shadow-sm flex items-center border-b">
        <div className="flex items-center max-w-3xl mx-auto w-full">
          <img src={botProfileImg} alt="Bot" className="h-9 w-9 rounded-full object-cover mr-3" />
          <h1 className="font-medium" style={{ fontSize: headingFontSize }}>{chatTitle}</h1>
        </div>
      </div>

      {/* Chat container with scroll area */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full relative overflow-hidden">
        {/* Messages area with scroll */}
        <div
          ref={chatHistoryRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ paddingBottom: '60px', backgroundColor }}
        >
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

          {/* Display current interactive input node - only if it's active (not answered) */}
          {currentNode && interactiveTypes.includes(currentNode.type) &&
           !currentNode.content?.answered && showInputField && (
            <>
              {/* User input field on the right */}
              {currentNode.type !== "input_wait" && (
                <div className="flex justify-end mt-2 mb-10">
                  <div
                    className="bg-white rounded-2xl p-2 max-w-[80%] shadow-sm bubble-animate bubble-appear"
                    style={{ fontFamily }}
                  >
                    {React.createElement(() => {
                      const props = {
                        node: currentNode,
                        inputValue,
                        setInputValue,
                        handleKeyDown,
                        handleInputSubmit,
                        isInvalid: !isInputValid
                      };

                      // Only render the input fields, not the prompt
                      switch (currentNode.type) {
                        case "input_text":
                          return (
                            <div className="p-1">
                              <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua resposta..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                key="input-text"
                                autoFocus
                              />
                              <button
                                onClick={handleInputSubmit}
                                disabled={!isInputValid && !!inputValue}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
                              >
                                Enviar
                              </button>
                            </div>
                          );
                        case "input_date":
                          return (
                            <div className="p-1">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={inputValue}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d/]/g, '');
                                    let formattedValue = value;
                                    if (value.length === 2 && !value.includes('/')) {
                                      formattedValue = value + '/';
                                    } else if (value.length === 5 && value.indexOf('/') === 2 && !value.includes('/', 3)) {
                                      formattedValue = value + '/';
                                    }
                                    setInputValue(formattedValue);
                                  }}
                                  onKeyDown={handleKeyDown}
                                  placeholder="DD/MM/AAAA"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  maxLength={10}
                                  key="input-date"
                                  autoFocus
                                />
                              </div>
                              <button
                                onClick={handleInputSubmit}
                                disabled={(!isInputValid && !!inputValue) || inputValue.length < 10}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
                              >
                                Enviar
                              </button>
                            </div>
                          );
                        case "input_email":
                          return (
                            <div className="p-1">
                              <input
                                type="email"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite seu email..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                key="input-email"
                                autoFocus
                              />
                              <button
                                onClick={handleInputSubmit}
                                disabled={!isInputValid && !!inputValue}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
                              >
                                Enviar
                              </button>
                            </div>
                          );
                        case "input_phone":
                          return (
                            <div className="p-1">
                              <input
                                type="tel"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite seu telefone..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                key="input-phone"
                                autoFocus
                              />
                              <button
                                onClick={handleInputSubmit}
                                disabled={!isInputValid && !!inputValue}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
                              >
                                Enviar
                              </button>
                            </div>
                          );
                        case "input_number":
                          return (
                            <div className="p-1">
                              <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite um número..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                key="input-number"
                                autoFocus
                              />
                              <button
                                onClick={handleInputSubmit}
                                disabled={!isInputValid && !!inputValue}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
                              >
                                Enviar
                              </button>
                            </div>
                          );
                        case "input_website":
                          return (
                            <div className="p-1">
                              <input
                                type="url"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite uma URL..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                key="input-website"
                                autoFocus
                              />
                              <button
                                onClick={handleInputSubmit}
                                disabled={!isInputValid && !!inputValue}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
                              >
                                Enviar
                              </button>
                            </div>
                          );
                        case "input_buttons":
                          const choices = currentNode.content.choices || [];
                          const layout = currentNode.content.layout || 'vertical';

                          return (
                            <div className="p-1">
                              <div className={`flex ${layout === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} gap-2`}>
                                {choices.map((choice: any, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleChoiceSelect(choice)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all shadow-sm"
                                  >
                                    {choice.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        case "input_pic_choice":
                          return renderPicChoiceInputNode({
                            ...props,
                            handleChoiceSelect
                          });
                        default:
                          return renderNode({...currentNode, content: {...currentNode.content, hidePrompt: true}});
                      }
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Fixed watermark at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white bg-opacity-90 border-t border-gray-200 text-center z-10 max-w-3xl mx-auto w-full">
          <div className="flex justify-center items-center">
            <img src={logoImage} alt="VendFlow" className="h-4 mr-1" />
            <span className="text-xs font-medium text-gray-600">Powered by VendFlow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChatReader;
