import React, { useState } from 'react';
import { Message } from '../types/message';

interface ChatMessageProps {
  message: Message;
  onEdit: (id: number, content: string) => void;
  onRegenerate: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onEdit, 
  onRegenerate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const isBot = message.sender === 'bot';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
  };

  return (
      <div className={`flex ${isBot ? 'flex-row' : 'flex-row-reverse'} gap-3 mb-6`}>
        <div className="w-8 h-8 flex-shrink-0">
          <img 
            src={isBot ? "/ava-avatar.png" : "/user-avatar.png"} 
            alt={isBot ? "Ava" : "User"} 
            className="w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col max-w-[75%]">
          <div className={`${isBot ? 'bg-gray-100' : 'bg-purple-600 text-white'} rounded-2xl px-4 py-3`}>
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none focus:outline-none resize-none text-inherit"
                rows={3}
                autoFocus
              />
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
            {/* {message.actions && (
              <div className="mt-3 space-y-2">
                {message.actions.map((action: string, index: number) => (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-2 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )} */}
          </div>
          {isBot ? (
            <div className="flex gap-2 mt-2">
              <button 
                onClick={handleCopy} 
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy message"
              >
                <img src="/copy.svg" alt="Copy" className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onRegenerate(message.id)} 
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Regenerate response"
              >
                <img src="/refresh.svg" alt="Refresh" className="w-4 h-4" />
              </button>
            </div>
          ) :
          (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={handleEdit} 
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={isEditing ? "Save" : "Edit message"}
            >
              <img src={!isEditing ? "/edit.svg" : "/save.svg"} alt="Edit" className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(message.id)} 
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Delete"
            >
              <img src="/delete.svg" alt="Delete" className="w-4 h-4" />
            </button>
          </div>
        )}
        </div>
    </div>
  );
};