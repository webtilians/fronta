import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders hotel title and logo', () => {
    render(<App />);
    
    const title = screen.getByText(/Asistente Hotel "El Amanecer"/i);
    const subtitle = screen.getByText(/por AselvIA/i);
    const logo = screen.getByAltText(/Logo Aselvia/i);
    
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });

  test('renders chat component', () => {
    render(<App />);
    
    const chatContainer = screen.getByRole('main');
    expect(chatContainer).toBeInTheDocument();
  });

  test('displays welcome message when no messages', () => {
    render(<App />);
    
    const welcomeMessage = screen.getByText(/¡Hola! Soy AselvIA/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('renders message input and send button', () => {
    render(<App />);
    
    const input = screen.getByLabelText(/Escribir mensaje/i);
    const sendButton = screen.getByRole('button', { name: /enviar mensaje/i });
    
    expect(input).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  test('input has character counter', () => {
    render(<App />);
    
    const charCounter = screen.getByText(/0\/1000/);
    expect(charCounter).toBeInTheDocument();
  });

  test('updates character counter when typing', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByLabelText(/Escribir mensaje/i);
    await user.type(input, 'Hola');
    
    const charCounter = screen.getByText(/4\/1000/);
    expect(charCounter).toBeInTheDocument();
  });

  test('renders connection status', () => {
    render(<App />);
    
    const connectionStatus = screen.getByRole('status');
    expect(connectionStatus).toBeInTheDocument();
  });

  test('renders chat controls buttons', () => {
    render(<App />);
    
    const timestampButton = screen.getByLabelText(/Mostrar\/ocultar marcas de tiempo/i);
    const clearButton = screen.getByLabelText(/Limpiar chat/i);
    
    expect(timestampButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  test('send button is disabled when input is empty', () => {
    render(<App />);
    
    const sendButton = screen.getByRole('button', { name: /enviar mensaje/i });
    expect(sendButton).toBeDisabled();
  });

  test('send button is enabled when input has valid text', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByLabelText(/Escribir mensaje/i);
    const sendButton = screen.getByRole('button', { name: /enviar mensaje/i });
    
    await user.type(input, 'Test message');
    
    expect(sendButton).not.toBeDisabled();
  });
});
