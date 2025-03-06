import React, { useState, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { chatService } from './services/api';
import type { Message } from './types/message';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const fetchedMessages = await chatService.getMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await chatService.sendMessage(content);
      await loadMessages(); // Reload to get bot response
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const handleEditMessage = async (id: number, content: string) => {
    try {
      await chatService.updateMessage(id, content);
      await loadMessages(); // Reload to get new bot response
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await chatService.deleteMessage(id);
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleRegenerate = async (id: number) => {
    try {
      await chatService.regenerateMessage(id);
      await loadMessages(); // Reload to get new bot response
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  return (
    <div className="h-screen p-8">
      <div className="flex flex-col max-w-xl h-full bg-white rounded-3xl m-auto p-4">
        {/* Header */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-12 h-12 flex-shrink-0">
            <img 
              src="/ava-avatar.png"
              alt="Ava"
              className="w-full h-full rounded-full"
            />
          </div>
          <p className="font-bold mt-3">Hey👋, I’m Ava</p>
          <p className="mt-1">Ask me anything or pick a place to start</p>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onEdit={handleEditMessage}
                  onRegenerate={handleRegenerate}
                  onDelete={handleDeleteMessage}
                />
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-chat-border p-4">
            <div className="max-w-3xl mx-auto">
              <form className="flex gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Your question"
                  className="flex-1 px-4 py-2 rounded-full border border-chat-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="chat-button"
                  disabled={isLoading || !inputMessage.trim()}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
