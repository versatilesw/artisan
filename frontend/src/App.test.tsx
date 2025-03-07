import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { chatService } from './services/api';

// Mock the chat service
jest.mock('./services/api', () => ({
  chatService: {
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
    updateMessage: jest.fn(),
    deleteMessage: jest.fn(),
    regenerateMessage: jest.fn(),
  },
}));

describe('App', () => {
  const mockMessages = [
    {
      id: 1,
      content: 'Hello',
      sender: 'user',
      created_at: '2025-03-06T12:00:00Z',
      updated_at: '2025-03-06T12:00:00Z',
    },
    {
      id: 2,
      content: 'Hi there!',
      sender: 'bot',
      created_at: '2025-03-06T12:00:01Z',
      updated_at: '2025-03-06T12:00:01Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful message fetch
    (chatService.getMessages as jest.Mock).mockResolvedValue(mockMessages);
  });

  it('renders the header with Ava avatar and welcome message', () => {
    render(<App />);

    expect(screen.getByAltText('Ava')).toBeInTheDocument();
    expect(
      screen.getByText('Ask me anything or pick a place to start')
    ).toBeInTheDocument();
  });

  it('loads and displays messages on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(chatService.getMessages).toHaveBeenCalled();
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
  });

  it('handles sending a new message', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText('Your question');
    const sendButton = screen.getByText('Send');

    await userEvent.type(input, 'New message');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(chatService.sendMessage).toHaveBeenCalledWith('New message');
      expect(chatService.getMessages).toHaveBeenCalledTimes(2); // Initial load + after send
    });
  });

  it('disables input and shows loading state while sending', async () => {
    (chatService.sendMessage as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<App />);

    const input = screen.getByPlaceholderText('Your question');
    const sendButton = screen.getByText('Send');

    await userEvent.type(input, 'Test message');
    fireEvent.click(sendButton);

    expect(input).toBeDisabled();
    expect(screen.getByText('Sending...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Send')).toBeInTheDocument();
      expect(input).not.toBeDisabled();
    });
  });

  it('handles message deletion', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByTitle('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(chatService.deleteMessage).toHaveBeenCalledWith(1);
      expect(chatService.getMessages).toHaveBeenCalledTimes(2); // Initial load + after delete
    });
  });

  it('handles message regeneration', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    const regenerateButton = screen.getByTitle('Regenerate response');
    fireEvent.click(regenerateButton);

    await waitFor(() => {
      expect(chatService.regenerateMessage).toHaveBeenCalledWith(2);
      expect(chatService.getMessages).toHaveBeenCalledTimes(2); // Initial load + after regenerate
    });
  });

  it('prevents sending empty messages', async () => {
    render(<App />);

    const sendButton = screen.getByText('Send');
    expect(sendButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Your question');
    await userEvent.type(input, '   ');

    expect(sendButton).toBeDisabled();

    await userEvent.type(input, 'Valid message');
    expect(sendButton).not.toBeDisabled();
  });
});
