import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
  IConnectUserPayload,
  ISendMessagePayload,
  ITypingPayload,
  IMessageReadPayload,
} from '../interface/chat.interface';

interface UseChatSocketProps {
  userId: number;
  email: string;
  onMessageReceived: (msg: any) => void;
  onTyping?: (payload: ITypingPayload) => void;
  onStopTyping?: (payload: ITypingPayload) => void;
  onMessageRead?: (info: IMessageReadPayload) => void;
  onUserConnected?: (data: { success: boolean }) => void;
}

export const useChatSocket = ({
  userId,
  email,
  onMessageReceived,
  onTyping,
  onStopTyping,
  onMessageRead,
  onUserConnected,
}: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  // Usar refs para las funciones callback para evitar reconexiones
  const callbacksRef = useRef({
    onMessageReceived,
    onTyping,
    onStopTyping,
    onMessageRead,
    onUserConnected,
  });

  // Actualizar refs cuando las funciones cambian
  useEffect(() => {
    callbacksRef.current = {
      onMessageReceived,
      onTyping,
      onStopTyping,
      onMessageRead,
      onUserConnected,
    };
  }, [onMessageReceived, onTyping, onStopTyping, onMessageRead, onUserConnected]);

  const apiBase = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    console.log("Conectando WebSocket a:", apiBase);
    socketRef.current = io(apiBase, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log("WebSocket conectado:", socketRef.current?.id);
      const connectPayload: IConnectUserPayload = { userId, email };
      socketRef.current?.emit('connect_user', connectPayload);
      console.log("Emitiendo connect_user:", connectPayload);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error("Error de conexión WebSocket:", error);
    });

    socketRef.current.on('user_connected', (data) => {
      console.log("Usuario conectado:", data);
      callbacksRef.current.onUserConnected?.(data);
    });

    socketRef.current.on('receive_message', (message) => {
      console.log("Mensaje recibido:", message);
      callbacksRef.current.onMessageReceived(message);
    });

    socketRef.current.on('message_read', (info) => {
      console.log("Mensaje leído:", info);
      callbacksRef.current.onMessageRead?.(info);
    });

    socketRef.current.on('typing', (payload) => {
      console.log("Typing:", payload);
      callbacksRef.current.onTyping?.(payload);
    });

    socketRef.current.on('stop_typing', (payload) => {
      console.log("Stop typing:", payload);
      callbacksRef.current.onStopTyping?.(payload);
    });

    return () => {
      console.log("Desconectando WebSocket");
      socketRef.current?.disconnect();
    };
  }, [apiBase, userId, email]);

  const sendMessage = useCallback((payload: ISendMessagePayload) => {
    socketRef.current?.emit('send_message', payload);
  }, []);

  const markAsRead = useCallback((payload: IMessageReadPayload) => {
    socketRef.current?.emit('message_read', payload);
  }, []);

  const startTyping = useCallback((payload: ITypingPayload) => {
    socketRef.current?.emit('typing', payload);
  }, []);

  const stopTyping = useCallback((payload: ITypingPayload) => {
    socketRef.current?.emit('stop_typing', payload);
  }, []);

  return { sendMessage, markAsRead, startTyping, stopTyping };
};