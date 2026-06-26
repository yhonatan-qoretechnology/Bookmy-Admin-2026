import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useChatSocket = (userId: number, onMessageReceived: (msg: any) => void) => {
  const socketRef = useRef<Socket | null>(null);

  // 1. Usar process.env o import.meta.env de forma más limpia
  const apiBase = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    // 2. Conexión configurada (evita re-conectar innecesariamente)
    socketRef.current = io(apiBase, {
      transports: ['websocket'], // Fuerza uso de websocket para evitar problemas de polling
      reconnectionAttempts: 5,   // Mejora la resiliencia
    });

    socketRef.current.on('connect', () => {
      // 3. Avisar al backend al conectar
      socketRef.current?.emit('register_user', userId);
    });

    socketRef.current.on('receive_message', (message) => {
      onMessageReceived(message);
    });

    return () => {
      // 4. Limpieza correcta
      socketRef.current?.disconnect();
    };
  }, [apiBase, userId, onMessageReceived]); // 5. Agregamos dependencias necesarias

  // 6. useCallback para evitar re-renderizados innecesarios en componentes
  const sendMessage = useCallback((payload: any) => {
    socketRef.current?.emit('send_message', payload);
  }, []);

  return { sendMessage };
};