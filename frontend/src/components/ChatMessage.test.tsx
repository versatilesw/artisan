import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatMessage } from './ChatMessage';
import { Message } from '../types/message';

describe('ChatMessage', () => {
  const mockOnEdit = jest.fn();
  const mockOnRegenerate = jest.fn();
  const mockOnDelete = jest.fn();
  
  const userMessage: Message = {
    id: 1,
    content: 'Hello, this is a test message',
    sender: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const botMessage: Message = {
    id: 2,
    content: 'Hello, I am the bot',
    sender: 'bot',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user message correctly', () => {
    render(
      <ChatMessage
        message={userMessage}
        onEdit={mockOnEdit}
        onRegenerate={mockOnRegenerate}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText(userMessage.content)).toBeInTheDocument();
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });

  it('renders bot message correctly', () => {
    render(
      <ChatMessage
        message={botMessage}
        onEdit={mockOnEdit}
        onRegenerate={mockOnRegenerate}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText(botMessage.content)).toBeInTheDocument();
    expect(screen.getByAltText('Ava')).toBeInTheDocument();
  });

  it('handles edit functionality', async () => {
    render(
      <ChatMessage
        message={userMessage}
        onEdit={mockOnEdit}
        onRegenerate={mockOnRegenerate}
        onDelete={mockOnDelete}
      />
    );

    // Click edit button
    const editButton = screen.getByTitle('Edit message');
    fireEvent.click(editButton);

    // Find textarea and modify content
    const textarea = screen.getByRole('textbox');
    const newContent = 'Updated message';
    await userEvent.clear(textarea);
    await userEvent.type(textarea, newContent);

    // Save changes
    const saveButton = screen.getByTitle('Save');
    fireEvent.click(saveButton);

    expect(mockOnEdit).toHaveBeenCalledWith(userMessage.id, newContent);
  });

  it('handles delete functionality', () => {
    render(
      <ChatMessage
        message={userMessage}
        onEdit={mockOnEdit}
        onRegenerate={mockOnRegenerate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(userMessage.id);
  });

  it('handles regenerate functionality for bot messages', () => {
    render(
      <ChatMessage
        message={botMessage}
        onEdit={mockOnEdit}
        onRegenerate={mockOnRegenerate}
        onDelete={mockOnDelete}
      />
    );

    const regenerateButton = screen.getByTitle('Regenerate response');
    fireEvent.click(regenerateButton);

    expect(mockOnRegenerate).toHaveBeenCalledWith(botMessage.id);
  });

  it('handles copy functionality for bot messages', async () => {
    const mockClipboard = {
      writeText: jest.fn()
    };
    Object.assign(navigator, {
      clipboard: mockClipboard
    });

    render(
      <ChatMessage
        message={botMessage}
        onEdit={mockOnEdit}
        onRegenerate={mockOnRegenerate}
        onDelete={mockOnDelete}
      />
    );

    const copyButton = screen.getByTitle('Copy message');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(botMessage.content);
  });

  it('handles enter key press to save edits', async () => {
    render(
      <ChatMessage
        message={userMessage}
        onEdit={mockOnEdit}
        onRegenerate={mockOnRegenerate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('Edit message');
    fireEvent.click(editButton);

    // Modify content and press enter
    const textarea = screen.getByRole('textbox');
    const newContent = 'Updated with enter';
    await userEvent.clear(textarea);
    await userEvent.type(textarea, newContent);
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(mockOnEdit).toHaveBeenCalledWith(userMessage.id, newContent);
  });
});
