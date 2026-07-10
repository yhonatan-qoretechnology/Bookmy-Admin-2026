import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";

import sedeAvatar from "../../assets/images/sede-avatar.png";
import sendIcon from "../../assets/icons/send-blue.svg";
import dotsIcon from "../../assets/icons/dots-horizontal.svg";
import checkIcon from "../../assets/icons/check-double.svg";
import filterIcon from "../../assets/icons/filter.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import chevronDownIcon from "../../assets/icons/chevron-down.svg";

import type {
  IChatContact,
  IChatMessage,
  IChatUser,
} from "../chatMessage/interface/chat.interface";
import { useChatSocket } from "../chatMessage/hooks/useChatSocket";

// --- ESTILOS PRINCIPALES ---
const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
`;

const BackButton = styled.button`
  background-color: #8c8c8c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  font-size: 0.95rem;

  &:hover {
    opacity: 0.9;
  }
`;

const BottomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f0f0;
  overflow: hidden;
`;

// --- SECCIÓN DE BÚSQUEDA ---
const SearchBarContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  &:focus {
    border-color: #3b82f6;
  }
`;

const SearchButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const SearchResultCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-top: -0.5rem;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 500;
`;

// --- ESTILOS DE TABLA ---
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem;
  color: ${({ theme }) => theme.text || "#374151"};
  font-weight: 700;
  font-size: 0.95rem;
  border-bottom: 1px solid #f0f0f0;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 1.2rem;
  color: ${({ theme }) => theme.textLight || "#6B7280"};
  font-size: 0.9rem;
  vertical-align: middle;
`;

const StatusPill = styled.span<{ $status: boolean }>`
  background-color: ${({ $status }) => ($status ? "#10B981" : "#EF4444")};
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ChatButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.4rem 1.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

// --- ESTILOS DEL CHAT ---
const ChatWrapper = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
  height: 75vh;
  min-height: 600px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
`;

const ContactsPanel = styled.div`
  width: 350px;
  min-width: 350px;
  max-width: 350px;
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  background: white;
`;

const ContactsHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  background: white;
`;

const ContactsTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
`;

const ContactsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div<{ $active: boolean }>`
  padding: 1rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
  background: ${({ $active }) => ($active ? "#e0f2fe" : "transparent")};
  
  &:hover {
    background: ${({ $active }) => ($active ? "#e0f2fe" : "#f3f4f6")};
  }
`;

const ContactAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
`;

const ContactStatus = styled.div<{ $online: boolean }>`
  font-size: 0.8rem;
  color: ${({ $online }) => ($online ? "#10b981" : "#9ca3af")};
  margin-top: 0.25rem;
`;

const ChatPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #e0f2fe;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  
  img {
    width: 100px;
    height: 100px;
    opacity: 0.3;
    margin-bottom: 1rem;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ChatAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #fce7f3;
`;

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatName = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text || "#374151"};
  font-size: 1.1rem;
  font-weight: 700;
`;

const ChatStatus = styled.span`
  color: #3b82f6;
  font-size: 0.85rem;
  font-weight: 600;
`;

const TypingIndicator = styled.span`
  color: #3b82f6;
  font-size: 0.85rem;
  font-weight: 600;
  font-style: italic;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 2rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: transparent;
`;

const MessageRow = styled.div<{ $isMine: boolean }>`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  align-self: ${({ $isMine }) => ($isMine ? "flex-end" : "flex-start")};
  max-width: 80%;
`;

const SmallAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const Bubble = styled.div<{ $isMine: boolean }>`
  background-color: ${({ $isMine }) => ($isMine ? "white" : "#3B82F6")};
  color: ${({ $isMine }) => ($isMine ? "#374151" : "white")};
  padding: 1rem 1.25rem;
  border-radius: 16px;
  border-bottom-left-radius: ${({ $isMine }) => ($isMine ? "16px" : "4px")};
  border-bottom-right-radius: ${({ $isMine }) => ($isMine ? "4px" : "16px")};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  line-height: 1.4;
  border: ${({ $isMine }) => ($isMine ? "1px solid #E5E7EB" : "none")};
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.4;
  padding-bottom: 0.5rem;
`;

const ChatInputArea = styled.div`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: white;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.text || "#374151"};
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  background-color: #3b82f6;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
    transform: translateX(-1px);
  }
`;

const HistorySection = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text || "#374151"};
  margin: 0;
`;

const FilterBarContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  width: fit-content;
  flex-wrap: wrap;
`;

const FilterSegment = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-right: 1px solid #f0f0f0;
  gap: 0.75rem;

  &:last-child {
    border-right: none;
  }
`;

const FilterLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text || "#374151"};
`;

const FilterSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text || "#374151"};

  img {
    width: 12px;
    opacity: 0.6;
  }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;

  img {
    width: 14px;
    filter: invert(36%) sepia(87%) saturate(1637%) hue-rotate(331deg)
      brightness(97%) contrast(98%);
  }
`;

const PdfButton = styled.button`
  background-color: #00b69b;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

interface ComunicationModuleProps {
  chatService?: any;
  currentUserId?: number;
  currentUserEmail?: string;
}

export function ComunicationModule({
  chatService,
  currentUserId,
  currentUserEmail,
}: ComunicationModuleProps) {
  // CONFIGURACIÓN AUTÓNOMA: Si no envían las props, se conecta solo.
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const activeUserId = currentUserId || 2;
  const activeUserEmail = currentUserEmail || "user1@example.com";

  const [contacts, setContacts] = useState<IChatContact[]>([]);
  const [activeChatContact, setActiveChatContact] =
    useState<IChatContact | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<number, IChatMessage[]>>({});

  // Estados de búsqueda
  const [inputValue, setInputValue] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState<IChatUser | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Estado de escritura
  const [isTyping, setIsTyping] = useState(false);
  const [receiverTyping, setReceiverTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 0. CONFIGURACIÓN WEBSOCKET
  const { sendMessage, markAsRead, startTyping, stopTyping } = useChatSocket({
    userId: activeUserId,
    email: activeUserEmail,
    onMessageReceived: (message) => {
      // Normalizar campos snake_case a camelCase
      const normalizedMessage = {
        ...message,
        senderId: message.senderId || message.sender_id,
        receiverId: message.receiverId || message.receiver_id,
        senderEmail: message.senderEmail || message.sender_email,
        receiverEmail: message.receiverEmail || message.receiver_email,
        createdAt: message.createdAt || message.created_at,
      };
      
      // Determinar el ID del otro usuario en la conversación
      const otherUserId = normalizedMessage.senderId === activeUserId ? normalizedMessage.receiverId : normalizedMessage.senderId;
      
      // Actualizar el mapa de mensajes, reemplazando temporal si existe
      setMessagesMap((prev) => {
        const existingMessages = prev[otherUserId] || [];
        // Buscar si existe un mensaje temporal con el mismo contenido
        const tempIndex = existingMessages.findIndex(
          (msg) => msg.message === normalizedMessage.message && msg.id > 1000000000000 // ID temporal (timestamp)
        );
        
        if (tempIndex !== -1) {
          // Reemplazar el temporal con el real
          const updated = [...existingMessages];
          updated[tempIndex] = normalizedMessage;
          return { ...prev, [otherUserId]: updated };
        }
        
        // Si no es temporal, agregar normalmente
        return { ...prev, [otherUserId]: [...existingMessages, normalizedMessage] };
      });
      
      // Si es el chat activo, actualizar también la vista actual
      if (activeChatContact) {
        const contactId = activeChatContact.users_chat_contact_contact_user_idTousers.id;
        if (normalizedMessage.senderId === contactId || normalizedMessage.receiverId === contactId) {
          setMessages((prev) => {
            const tempIndex = prev.findIndex(
              (msg) => msg.message === normalizedMessage.message && msg.id > 1000000000000
            );
            
            if (tempIndex !== -1) {
              const updated = [...prev];
              updated[tempIndex] = normalizedMessage;
              return updated;
            }
            
            return [...prev, normalizedMessage];
          });
        }
      }
    },
    onTyping: (payload) => {
      console.log("Typing recibido:", payload);
      if (activeChatContact) {
        const contactId = activeChatContact.users_chat_contact_contact_user_idTousers.id;
        const senderId = payload.senderId || payload.sender_id;
        console.log("Contact ID actual:", contactId, "Payload senderId:", senderId);
        if (senderId === contactId) {
          console.log("Activando indicador de escritura");
          setReceiverTyping(true);
        }
      }
    },
    onStopTyping: (payload) => {
      console.log("Stop typing recibido:", payload);
      if (activeChatContact) {
        const contactId = activeChatContact.users_chat_contact_contact_user_idTousers.id;
        const senderId = payload.senderId || payload.sender_id;
        if (senderId === contactId) {
          console.log("Desactivando indicador de escritura");
          setReceiverTyping(false);
        }
      }
    },
    onMessageRead: (info) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === info.chatId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
        )
      );
    },
  });

  // 1. CARGAR CONTACTOS
  const loadContacts = async () => {
    try {
      if (chatService) {
        const data = await chatService.getContacts(activeUserId);
        setContacts(data || []);
      } else {
        // Fallback de conexión directa (Fetch Nativo)
        const res = await fetch(`${API_URL}/ChatMessage/contacts/${activeUserId}`);
        if (res.ok) {
          const data = await res.json();
          setContacts(data || []);
        }
      }
    } catch (err) {
      console.error("Error cargando contactos:", err);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [chatService, activeUserId]);

  // 2. CARGAR MENSAJES (Solo al abrir chat, WebSocket maneja actualizaciones)
  useEffect(() => {
    if (!activeChatContact) {
      setMessages([]);
      return;
    }

    const contactId =
      activeChatContact.users_chat_contact_contact_user_idTousers.id;
    
    // Si ya tenemos mensajes en caché, usarlos
    if (messagesMap[contactId]) {
      setMessages(messagesMap[contactId]);
      return;
    }

    const fetchMessages = async () => {
      try {
        let data;
        if (chatService) {
          const response = await chatService.getMessages(activeUserId, contactId);
          data = response || [];
        } else {
          // Fallback de conexión directa (Fetch Nativo)
          const res = await fetch(
            `${API_URL}/ChatMessage/messages/${activeUserId}/${contactId}`,
          );
          if (res.ok) {
            data = await res.json();
          }
        }
        
        // Normalizar campos snake_case a camelCase
        const msgs = (data || []).map((msg: any) => ({
          ...msg,
          senderId: msg.senderId || msg.sender_id,
          receiverId: msg.receiverId || msg.receiver_id,
          senderEmail: msg.senderEmail || msg.sender_email,
          receiverEmail: msg.receiverEmail || msg.receiver_email,
          createdAt: msg.createdAt || msg.created_at,
        }));
        
        setMessages(msgs);
        setMessagesMap((prev) => ({ ...prev, [contactId]: msgs }));
      } catch (err) {
        console.error("Error obteniendo los mensajes:", err);
      }
    };

    fetchMessages();
  }, [activeChatContact, chatService, activeUserId, messagesMap]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatContact]);

  // 3. BUSCAR USUARIO POR CORREO
  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    setSearchError(null);
    setSearchedUser(null);

    try {
      let user;

      if (chatService) {
        user = await chatService.searchUser(searchEmail.trim());
      } else {
        // Fallback de conexión directa (Fetch Nativo)
        const res = await fetch(
          `${API_URL}/ChatMessage/users?email=${encodeURIComponent(searchEmail.trim())}`,
        );
        if (res.ok) {
          user = await res.json();
        }
      }

      if (user && user.id) {
        setSearchedUser(user);
      } else {
        setSearchError("Usuario no encontrado.");
      }
    } catch (err) {
      setSearchError("Ocurrió un error o el usuario no existe.");
      console.error(err);
    }
  };

  // 4. GUARDAR CONTACTO NUEVO
  const handleSaveContact = async () => {
    if (!searchedUser) return;

    try {
      const payload = {
        ownerUserId: activeUserId,
        contactUserId: searchedUser.id,
      };

      if (chatService) {
        await chatService.saveContact(payload);
      } else {
        // Fallback de conexión directa (Fetch Nativo)
        await fetch(`${API_URL}/ChatMessage/contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setSearchEmail("");
      setSearchedUser(null);
      loadContacts();
    } catch (err) {
      console.error("Error al guardar el contacto:", err);
    }
  };

  // 5. ENVIAR MENSAJE (WebSocket)
  const handleSendMessage = () => {
    if (inputValue.trim() === "" || !activeChatContact) return;

    const contactId = activeChatContact.users_chat_contact_contact_user_idTousers.id;
    const contactEmail = activeChatContact.users_chat_contact_contact_user_idTousers.email;

    const payload = {
      senderId: activeUserId,
      receiverId: contactId,
      senderEmail: activeUserEmail,
      receiverEmail: contactEmail,
      messageType: "TEXT" as const,
      message: inputValue.trim(),
      fileUrl: null,
    };

    console.log("Enviando mensaje:", payload);

    // Enviar por WebSocket
    sendMessage(payload);
    
    // Agregar mensaje localmente para feedback inmediato
    const tempMessage: IChatMessage = {
      id: Date.now(), // ID temporal
      ...payload,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setMessagesMap((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), tempMessage],
    }));
    
    setInputValue("");
    
    // Dejar de indicar escritura
    stopTyping({ senderId: activeUserId, receiverId: contactId });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Manejar indicador de escritura
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    if (!activeChatContact) return;
    
    const contactId = activeChatContact.users_chat_contact_contact_user_idTousers.id;
    
    if (!isTyping) {
      setIsTyping(true);
      startTyping({ senderId: activeUserId, receiverId: contactId });
    }
    
    // Resetear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping({ senderId: activeUserId, receiverId: contactId });
    }, 1000);
  };

  // Marcar mensajes como leídos al abrir chat
  useEffect(() => {
    if (!activeChatContact || messages.length === 0) return;
    
    const contactId = activeChatContact.users_chat_contact_contact_user_idTousers.id;
    
    messages.forEach((msg) => {
      if (msg.receiverId === activeUserId && !msg.isRead) {
        markAsRead({ chatId: msg.id, userId: activeUserId });
      }
    });
  }, [activeChatContact, messages, activeUserId, markAsRead]);

  // 6. DESCARGAR PDF
  const handleDownloadPDF = async (contactUserId: number, chatName: string) => {
    try {
      let chatHistory = [];
      if (chatService) {
        chatHistory =
          (await chatService.getMessages(activeUserId, contactUserId)) || [];
      } else {
        const res = await fetch(
          `${API_URL}/ChatMessage/messages/${activeUserId}/${contactUserId}`,
        );
        if (res.ok) chatHistory = await res.json();
      }

      const doc = new jsPDF();
      let yPos = 20;
      const margin = 20;
      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Historial de comunicación: ${chatName}`, margin, yPos);
      yPos += 15;

      chatHistory.forEach((msg: any) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        const isMine = msg.senderId === activeUserId;
        const senderLabel = isMine ? "Mi Sede (Tú)" : chatName;

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(senderLabel, margin, yPos);
        yPos += 6;

        doc.setFont("helvetica", "normal");
        const splitMessage = doc.splitTextToSize(msg.message, 170);
        doc.text(splitMessage, margin, yPos);
        yPos += splitMessage.length * 6 + 10;
      });

      doc.save(`Chat_${chatName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  return (
    <ModuleContainer>
      {/* BARRA DE BÚSQUEDA */}
      <SearchBarContainer>
        <SearchInput
          type="email"
          placeholder="Buscar nueva sede por correo electrónico (ej: admin@qoretechnology.com)"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <SearchButton onClick={handleSearchUser}>Buscar</SearchButton>
      </SearchBarContainer>

      {searchError && <ErrorText>{searchError}</ErrorText>}

      {searchedUser && (
        <SearchResultCard>
          <div>
            <strong style={{ color: "#374151" }}>
              {searchedUser.UserData?.name || searchedUser.email}
            </strong>{" "}
            <span style={{ color: "#6B7280", fontSize: "0.85rem" }}>
              ({searchedUser.role})
            </span>
          </div>
          <ChatButton onClick={handleSaveContact}>
            Guardar Contacto
          </ChatButton>
        </SearchResultCard>
      )}

      {/* VISTA DIVIDIDA: CONTACTOS IZQUIERDA - CHAT DERECHA */}
      <ChatWrapper>
        {/* PANEL DE CONTACTOS */}
        <ContactsPanel>
          <ContactsHeader>
            <ContactsTitle>Mis Contactos</ContactsTitle>
          </ContactsHeader>
          <ContactsList>
            {contacts.map((contact) => {
              const targetUser =
                contact.users_chat_contact_contact_user_idTousers;
              const isOnline = targetUser.UserStatus?.code !== "DESCONECTADO";
              const displayName =
                targetUser.UserData?.name || targetUser.email;
              const isActive = activeChatContact?.id === contact.id;

              return (
                <ContactItem
                  key={contact.id}
                  $active={isActive}
                  onClick={() => setActiveChatContact(contact)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ContactAvatar
                      src={targetUser.fotoPerfil || sedeAvatar}
                      alt={displayName}
                    />
                    <ContactInfo>
                      <ContactName>{displayName}</ContactName>
                      <ContactStatus $online={isOnline}>
                        {isOnline ? "En línea" : "Desconectado"}
                      </ContactStatus>
                    </ContactInfo>
                  </div>
                </ContactItem>
              );
            })}
            {contacts.length === 0 && (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                No tienes contactos agregados.
              </div>
            )}
          </ContactsList>
        </ContactsPanel>

        {/* PANEL DE CHAT */}
        <ChatPanel>
          {!activeChatContact ? (
            <EmptyState>
              <img src={sedeAvatar} alt="No chat seleccionado" />
              <p>Selecciona un contacto para comenzar a chatear</p>
            </EmptyState>
          ) : (
            <>
              <ChatHeader>
                <ChatAvatar
                  src={
                    activeChatContact.users_chat_contact_contact_user_idTousers
                      .fotoPerfil || sedeAvatar
                  }
                  alt="Avatar"
                />
                <ChatInfo>
                  <ChatName>
                    {activeChatContact.users_chat_contact_contact_user_idTousers
                      .UserData?.name ||
                      activeChatContact.users_chat_contact_contact_user_idTousers
                        .email}
                  </ChatName>
                  {receiverTyping ? (
                    <TypingIndicator>Escribiendo...</TypingIndicator>
                  ) : (
                    <ChatStatus>
                      {activeChatContact.users_chat_contact_contact_user_idTousers
                        .UserStatus?.UserStatusTranslation?.[0]?.name || "Online"}
                    </ChatStatus>
                  )}
                </ChatInfo>
              </ChatHeader>

              <ChatMessages>
                {receiverTyping && (
                  <div style={{ 
                    padding: "0.5rem 1rem", 
                    color: "#3b82f6", 
                    fontSize: "0.85rem", 
                    fontStyle: "italic",
                    fontWeight: "600",
                    animation: "pulse 1.5s infinite"
                  }}>
                    {activeChatContact.users_chat_contact_contact_user_idTousers
                      .UserData?.name || 
                      activeChatContact.users_chat_contact_contact_user_idTousers.email} está escribiendo...
                  </div>
                )}
                {messages.map((msg) => {
                  const isMine = (msg.senderId || msg.sender_id) === activeUserId;
                  return (
                    <MessageRow key={msg.id} $isMine={isMine}>
                      {!isMine && (
                        <>
                          <SmallAvatar
                            src={
                              activeChatContact
                                .users_chat_contact_contact_user_idTousers
                                .fotoPerfil || sedeAvatar
                            }
                            alt="Sede"
                          />
                          <Bubble $isMine={false}>{msg.message}</Bubble>
                          <MessageActions>
                            <img src={dotsIcon} alt="Opciones" width="16" />
                          </MessageActions>
                        </>
                      )}

                      {isMine && (
                        <>
                          <MessageActions>
                            <img src={dotsIcon} alt="Opciones" width="16" />
                          </MessageActions>
                          <Bubble $isMine={true}>{msg.message}</Bubble>
                          <MessageActions>
                            <img src={checkIcon} alt="Leído" width="16" />
                          </MessageActions>
                        </>
                      )}
                    </MessageRow>
                  );
                })}
                <div ref={messagesEndRef} />
              </ChatMessages>

              <ChatInputArea>
                <Input
                  type="text"
                  placeholder="Escribir Mensaje"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <SendButton onClick={handleSendMessage}>
                  <img src={sendIcon} alt="Enviar" />
                </SendButton>
              </ChatInputArea>
            </>
          )}
        </ChatPanel>
      </ChatWrapper>

      {/* HISTORIAL */}
      <HistorySection>
        <HistoryTitle>Historial comunicación sedes</HistoryTitle>

        <FilterBarContainer>
          <FilterSegment>
            <img src={filterIcon} alt="Filtro" width={20} />
          </FilterSegment>
          <FilterSegment>
            <FilterLabel>Filtrar por</FilterLabel>
          </FilterSegment>
          <FilterSegment>
            <FilterSelect>
              14 Agos 2025
              <img src={chevronDownIcon} alt="Desplegar" />
            </FilterSelect>
          </FilterSegment>
          <FilterSegment>
            <FilterSelect>
              Servicio
              <img src={chevronDownIcon} alt="Desplegar" />
            </FilterSelect>
          </FilterSegment>
          <FilterSegment>
            <FilterSelect>
              Sede
              <img src={chevronDownIcon} alt="Desplegar" />
            </FilterSelect>
          </FilterSegment>
          <FilterSegment style={{ backgroundColor: "#F9FAFB" }}>
            <ResetButton>
              <img src={refreshIcon} alt="Reset" />
              Reset
            </ResetButton>
          </FilterSegment>
        </FilterBarContainer>

        <Card>
          <Table>
            <thead>
              <tr>
                <Th>Chat con</Th>
                <Th style={{ textAlign: "right", paddingRight: "2rem" }}>
                  Descargar Historial
                </Th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const targetUser =
                  contact.users_chat_contact_contact_user_idTousers;
                const displayName =
                  targetUser.UserData?.name || targetUser.email;
                return (
                  <Tr key={contact.id}>
                    <Td style={{ color: "#374151", fontWeight: 500 }}>
                      {displayName}
                    </Td>
                    <Td
                      style={{ textAlign: "right", paddingRight: "1.5rem" }}
                    >
                      <PdfButton
                        onClick={() =>
                          handleDownloadPDF(targetUser.id, displayName)
                        }
                      >
                        PDF
                      </PdfButton>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </HistorySection>
    </ModuleContainer>
  );
}
