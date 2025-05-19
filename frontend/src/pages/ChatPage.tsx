import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Send, User, Bot, Vote, CheckSquare, BarChart4, Award } from "lucide-react";

// Define the message type
interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Background pattern voting symbols
const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 opacity-[0.03]">
        {/* Grid of voting-related symbols */}
        <div className="flex flex-wrap w-full h-full">
          {Array.from({ length: 150 }).map((_, i) => {
            const icons = [
              <Vote key={`vote-${i}`} size={24} />,
              <CheckSquare key={`check-${i}`} size={24} />,
              <BarChart4 key={`chart-${i}`} size={24} />,
              <Award key={`award-${i}`} size={24} />,
            ];
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            const randomRotation = `rotate-${[0, 45, 90, 135, 180, 225, 270, 315][Math.floor(Math.random() * 8)]}`;
            const randomOpacity = ["opacity-10", "opacity-20", "opacity-30"][Math.floor(Math.random() * 3)];
            
            return (
              <div 
                key={i} 
                className={`p-10 ${randomRotation} ${randomOpacity} text-gray-800`}
                style={{ transform: `rotate(${Math.random() * 360}deg)` }}
              >
                {randomIcon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  // State for managing messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm VotaAI. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  
  // State for the current message input
  const [inputMessage, setInputMessage] = useState("");
  
  // Ref for auto-scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);      // Handler for sending a new message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    try {
      // Add a "thinking" message
      const thinkingMessage: Message = {
        id: messages.length + 2,
        content: "Thinking...",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, thinkingMessage]);

      // Send user message to backend API
      const response = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: inputMessage,
          topK: 5
        }),
      });
      
      const data = await response.json();
      console.log("Backend response:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Remove the thinking message and add the real response
      setMessages((prev) => {
        const filteredMessages = prev.filter(msg => msg.id !== thinkingMessage.id);
        const botMessage: Message = {
          id: messages.length + 3,
          content: data.response || "Sorry, I didn't understand that.",
          sender: "bot",
          timestamp: new Date(),
        };
        
        // Add information about whether context was used
        if (data.contextsUsed === false) {
          botMessage.content += "\n\n(Note: No context was used for this response. Using only the model's general knowledge.)"
        }
        
        return [...filteredMessages, botMessage];
      });
    } catch (error) {
      // Remove the thinking message and add the error message
      setMessages((prev) => {
        const filteredMessages = prev.filter(msg => msg.content === "Thinking...");
        const errorMessage: Message = {
          id: messages.length + 3,
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          sender: "bot",
          timestamp: new Date(),
        };
        return [...filteredMessages, errorMessage];
      });
    }
  };
  
  // Handler for pressing Enter to send a message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      <BackgroundPattern />
      
      <main className="flex-grow flex flex-col px-4 md:px-12 pt-24 pb-4">
        <div className="max-w-4xl w-full mx-auto flex flex-col h-[75vh] border-2 border-gray-200 rounded-lg shadow-md bg-white">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 bg-green-800 text-white rounded-t-lg">
            <h1 className="text-xl md:text-2xl font-bold">VotaAI Chat</h1>
            <p className="text-sm opacity-80">Ask anything and get intelligent responses</p>
          </div>
          
          {/* Messages container */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[75%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`flex items-start ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
                    <div className={`rounded-full p-2 ${
                      message.sender === "user" 
                        ? "bg-green-800 text-white" 
                        : "bg-gray-200 text-green-800"
                    }`}>
                      {message.sender === "user" ? 
                        <User size={20} /> : 
                        <Bot size={20} />
                      }
                    </div>
                  </div>
                  
                  {/* Message bubble */}
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-green-800 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className={`text-xs mt-1 block ${
                      message.sender === "user" ? "text-gray-200" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-stretch h-12">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-grow p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-l-none rounded-r-lg bg-green-800 hover:bg-green-900 h-full px-6"
                disabled={inputMessage.trim() === ""}
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;