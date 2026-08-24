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
        console.log('GET CONVERSATIONS RES:', res.data);
        const convId = res.data.conversationId || res.data.conversation?._id || (res.data.conversations && res.data.conversations[0]?._id);
        
        if (convId) {
          setConversationId(convId);
          const msgRes = await chatAPI.getMessages(convId);
          console.log('GET MESSAGES RES:', msgRes.data);
          setMessages(msgRes.data.messages || msgRes.data || []);
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

    const handleNewMessage = (message) => {
      console.log('SOCKET NEW MESSAGE:', message);
      if (message.conversationId === conversationId || !message.conversationId) {
        setMessages((prev) => {
          if (!prev.some((m) => m._id === message._id)) {
            return [...prev, message];
          }
          return prev;
        });
        const currentUserId = user?._id || user?.id;
        const senderId = message.senderId?._id || message.senderId || message.sender;
        if (senderId !== currentUserId) {
          socket.emit('message_read', { messageId: message._id, conversationId });
        }
      }
    };

    const handleTypingStart = ({ userName }) => {
      setTypingUser(userName || 'Support');
    };

    const handleTypingStop = () => {
      setTypingUser(null);
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map(m => m._id === messageId ? { ...m, text: 'This message was deleted', deletedAt: new Date() } : m)
      );
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
      socket.emit('leave_conversation', { conversationId });
    };
  }, [socket, conversationId, user]);

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
      console.log('SENDING VIA SOCKET:', { conversationId, text: textToSend });
      socket.emit('send_message', { conversationId, text: textToSend });
      socket.emit('typing_stop', { conversationId });
    } else if (conversationId) {
      try {
        const res = await chatAPI.sendMessage(conversationId, { text: textToSend });
        console.log('SENDING VIA REST:', res.data);
        const newMsg = res.data.message || res.data;
        if (newMsg) {
          setMessages((prev) => {
            if (!prev.some((m) => m._id === newMsg._id)) {
              return [...prev, newMsg];
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
        setMessages((prev) => prev.map(m => m._id === messageId ? { ...m, text: 'This message was deleted', deletedAt: new Date() } : m));
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
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-[#0b141a] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 text-gray-100 font-sans">
          {/* Header */}
          <div className="bg-[#1e293b] px-4 py-3 flex items-center justify-between cursor-move border-b border-gray-800"
               onMouseDown={handleMouseDown}
               ref={dragRef}
          >
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 opacity-70 text-gray-400" />
              <div>
                <h3 className="font-semibold text-sm text-white">MrHaile Support Chat</h3>
                <div className="flex items-center space-x-1.5 text-xs opacity-90">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                  <span className="text-gray-400">{isConnected ? 'Online' : 'Reconnecting...'}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-[#0b141a]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-sm p-6">
                <MessageSquare className="w-10 h-10 mb-2 opacity-40 text-blue-500" />
                <p>Welcome! How can we help you today with your courses or services?</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const currentUserId = user?._id || user?.id;
                const senderId = msg.senderId?._id || msg.senderId || msg.sender;
                const isMe = senderId === currentUserId || msg.senderRole === 'student' || msg.senderRole === 'superadmin' || msg.senderRole === 'admin' || msg.isAdmin === false;
                const isDeleted = Boolean(msg.deletedAt);

                return (
                  <div key={msg._id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`group relative max-w-[85%] px-3.5 py-2 rounded-2xl text-sm shadow ${
                      isMe 
                        ? 'bg-[#2b5278] text-white rounded-br-none' 
                        : 'bg-[#182533] text-gray-100 border border-gray-800 rounded-bl-none'
                    }`}>
                      <p className={`break-words ${isDeleted ? 'italic text-gray-400' : ''}`}>{msg.text}</p>
                      
                      {/* Delete button on hover */}
                      {isMe && !isDeleted && (
                        <button 
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity p-1"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="flex items-center justify-end space-x-1 text-[10px] text-gray-300 mt-1 select-none">
                        <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && (
                          <span className={`${msg.isRead ? 'text-blue-300 font-bold' : 'text-gray-400'}`}>
                            {msg.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {typingUser && (
              <div className="text-xs text-blue-400 italic px-3 py-1 rounded-full bg-[#1e293b]/80 w-fit animate-pulse">
                {typingUser} is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-[#1e293b] border-t border-gray-800 flex items-center space-x-2">
            <input 
              type="text"
              value={inputText}
              onChange={handleTyping}
              placeholder="Write a message..."
              className="flex-1 bg-[#0f172a] text-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-500 border border-gray-700"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-lg transition-colors shadow flex items-center justify-center"
            >
              <Send className="w-5 h-5 transform rotate-90" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={handleMouseDown}
        className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer relative group"
        title="Open Support Chat (Drag to move)"
      >
        <MessageSquare className="w-6 h-6" />
        {isConnected && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0b141a] rounded-full"></span>
        )}
      </button>
    </div>
  );
};
