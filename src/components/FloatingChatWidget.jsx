import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Trash2, GripVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { chatAPI } from '../services/api';

export const FloatingChatWidget = () => {
  const { token, user } = useAuth();
  const { socket, isConnected } = useSocket(token);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [typingUser, setTypingUser] = useState(null);

  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const fetchConversation = async () => {
      try {
        const res = await chatAPI.getConversations();
        const conv = res.data.conversation || (res.data.conversations && res.data.conversations[0]);
        if (conv && conv._id) {
          setConversationId(conv._id);
          const msgRes = await chatAPI.getMessages(conv._id);
          setMessages(msgRes.data.messages || []);
        }
      } catch (err) {
        console.error('Failed to load chat conversation', err);
      }
    };
    fetchConversation();
  }, [token, isOpen]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('join_conversation', { conversationId });

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (!prev.some((m) => m._id === msg._id)) {
          return [...prev, msg];
        }
        return prev;
      });
    };

    const handleTypingStart = ({ userName }) => {
      setTypingUser(userName || 'Support');
    };

    const handleTypingStop = () => {
      setTypingUser(null);
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);
    socket.on('message_deleted', handleMessageDeleted);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
      socket.off('message_deleted', handleMessageDeleted);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 70, e.clientX - offsetRef.current.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, e.clientY - offsetRef.current.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    if (socket && conversationId && isConnected) {
      socket.emit('send_message', { conversationId, text: textToSend });
      socket.emit('typing_stop', { conversationId });
    } else if (conversationId) {
      try {
        const res = await chatAPI.sendMessage(conversationId, { text: textToSend });
        if (res.data.message) {
          setMessages((prev) => {
            if (!prev.some((m) => m._id === res.data.message._id)) {
              return [...prev, res.data.message];
            }
            return prev;
          });
        }
      } catch (err) {
        console.error('Failed to send message via REST fallback', err);
      }
    }
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    if (socket && conversationId) {
      socket.emit('typing_start', { conversationId });
      clearTimeout(window.typingTimer);
      window.typingTimer = setTimeout(() => {
        socket.emit('typing_stop', { conversationId });
      }, 2000);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (socket && conversationId) {
      socket.emit('delete_message', { messageId, conversationId, deleteType: 'everyone' });
    } else {
      try {
        await chatAPI.deleteMessage(messageId, { deleteType: 'everyone' });
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      } catch (err) {
        console.error('Failed to delete message', err);
      }
    }
  };

  if (!token) return null;

  return (
    <div 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-50 flex flex-col items-end select-none"
    >
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between cursor-move"
               onMouseDown={handleMouseDown}
               ref={dragRef}
          >
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 opacity-70" />
              <div>
                <h3 className="font-semibold text-sm">MrHaile Support Chat</h3>
                <div className="flex items-center space-x-1.5 text-xs opacity-90">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                  <span>{isConnected ? 'Online' : 'Reconnecting...'}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-950/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-sm p-6">
                <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                <p>Welcome! How can we help you today with your courses or services?</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const senderId = msg.sender?._id || msg.sender;
                const userId = user?._id || user?.id;
                const isMe = senderId === userId || msg.isAdmin === false;
                return (
                  <div key={msg._id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`group relative max-w-[80%] px-3.5 py-2 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                    }`}>
                      <p className="break-words">{msg.text}</p>
                      
                      {isMe && (
                        <button 
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            {typingUser && (
              <div className="text-xs text-gray-400 italic px-2 animate-pulse">
                {typingUser} is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-2">
            <input 
              type="text"
              value={inputText}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors shadow-md flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={handleMouseDown}
        className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer relative group"
        title="Open Support Chat (Drag to move)"
      >
        <MessageSquare className="w-6 h-6" />
        {isConnected && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
        )}
      </button>
    </div>
  );
};
