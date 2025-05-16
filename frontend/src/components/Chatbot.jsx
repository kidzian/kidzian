import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, MessageCircle, X } from "lucide-react";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  useEffect(() => {
    if (isOpen && isFirstOpen) {
      setMessages([
        {
          text: "Heyy! I'm your chatbot KidzAI. I'll help you know anything and everything about this website!",
          sender: "bot",
        },
      ]);
      setIsFirstOpen(false);
    }
  }, [isOpen, isFirstOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    const lowerInput = input.toLowerCase();
    const timingKeywords = [
      "timing",
      "time",
      "schedule",
      "when",
      "hours",
      "open",
      "opening",
      "closing",
    ];

    if (timingKeywords.some((word) => lowerInput.includes(word))) {
      const timingReply = `🕒 Our Kidzian platform operates from **10 AM to 7 PM, Monday to Saturday**.\n\n📞 For more details, feel free to contact us:\n📱 Phone: +91-9910413549\n📧 Email: support@kidzians.com`;

      setMessages([...newMessages, { text: timingReply, sender: "bot" }]);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chatbot`,
        {
          message: input,
        }
      );

      const formattedReply = res.data.reply.replace(/\*/g, "\n* ");

      setMessages([...newMessages, { text: formattedReply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorReply =
        "⚠️ Sorry, I couldn't fetch a response at the moment. Please try again later!";
      setMessages([...newMessages, { text: errorReply, sender: "bot" }]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end z-40">
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="w-42 h-10 bg-blue-500 p-2 text-white rounded-md flex items-center justify-center shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={28} />
          <h1 className="ml-1"> Need help? Ask us!</h1>
        </motion.button>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-[90vw] md:w-[40vw] md:h-[90vh] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-teal-700 mt-5 text-white font-bold  text-center  p-4 flex justify-between items-center">
            <span className="font-bold mt-3">KidzAI</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="mt-3" size={24} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[70vh] overflow-y-auto p-3 space-y-2 flex flex-col text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <img
                    src="https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle-thumbnail.png"
                    alt="Chatbot"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`p-2 rounded-md max-w-[75%] break-words whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-200 self-end text-right"
                      : "bg-gray-200 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center p-2 border-t">
            <textarea
              className="flex-1 p-3 border rounded-xl resize-none overflow-hidden max-h-12 text-sm"
              placeholder="Ask me about courses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
            />
            <button onClick={sendMessage} className="p-2">
              <Send size={20} color="#3b82f6" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
