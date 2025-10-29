import { useState } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import useChat from "./chat";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [unreadCount] = useState(0);

  const { chat, uniqId, sendMessage } = useChat();

  const handleSendMessage = (message) => {
    sendMessage(message);
    setMessage("");
  };

  return (
    <>
      {/* Chat Button - Fixed Bottom Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-110 z-50 group"
        >
          <MessageCircle className="w-6 h-6" />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </div>
          )}

          {/* Pulse Effect */}
          <div
            className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20"
            id=""
          ></div>
        </button>
      )}

      {/* Chat Box - Fixed Bottom Right */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-teal-500" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-teal-500"></div>
              </div>
              <div>
                <h3 className="font-semibold text-white">ViewSync Chat</h3>
                <p className="text-xs text-teal-100">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-teal-600 p-1.5 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-teal-600 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50 flex flex-col-reverse">
            {chat.length === 0 ? (
              <div className="flex justify-center items-center flex-1 text-gray-400 italic">
                No messages yet
              </div>
            ) : (
              [...chat].reverse().map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === uniqId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`font-sans p-3 text-white rounded-xl max-w-[80%] break-words ${
                      msg.sender === uniqId
                        ? "bg-teal-600 rounded-br-sm"
                        : "bg-slate-700 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-800 border-t border-slate-700 rounded-b-2xl">
            <div className="flex gap-2 items-end">
              <div className="flex-1 bg-slate-700 rounded-xl border border-slate-600 focus-within:border-teal-500 transition-colors">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(message);
                    }
                  }}
                  placeholder="Type a message..."
                  rows="2"
                  className="w-full bg-transparent text-white px-4 py-3 outline-none resize-none placeholder-gray-400 text-sm"
                />
              </div>
              <button
                onClick={() => handleSendMessage(message)}
                disabled={!message?.trim()}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Press Enter to send</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
