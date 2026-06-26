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
  flex-direction: column;
  height: 75vh;
  min-height: 600px;
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

const ChatMessages = styled.div`
  flex: 1;
  padding: 2rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #fafafa;
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
}

export function ComunicationModule({
  chatService,
  currentUserId,
}: ComunicationModuleProps) {
  // CONFIGURACIÓN AUTÓNOMA: Si no envían las props, se conecta solo.
  const API_URL = "http://localhost:3000/ChatMessage";
  const activeUserId = currentUserId || 2;

  const [contacts, setContacts] = useState<IChatContact[]>([]);
  const [activeChatContact, setActiveChatContact] =
    useState<IChatContact | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  // Estados de búsqueda
  const [inputValue, setInputValue] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState<IChatUser | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. CARGAR CONTACTOS
  const loadContacts = async () => {
    try {
      if (chatService) {
        const data = await chatService.getContacts(activeUserId);
        setContacts(data || []);
      } else {
        // Fallback de conexión directa (Fetch Nativo)
        const res = await fetch(`${API_URL}/contacts/${activeUserId}`);
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

  // 2. CARGAR MENSAJES (Polling)
  useEffect(() => {
    if (!activeChatContact) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const contactId =
        activeChatContact.users_chat_contact_contact_user_idTousers.id;
      try {
        if (chatService) {
          const data = await chatService.getMessages(activeUserId, contactId);
          setMessages(data || []);
        } else {
          // Fallback de conexión directa (Fetch Nativo)
          const res = await fetch(
            `${API_URL}/messages/${activeUserId}/${contactId}`,
          );
          if (res.ok) {
            const data = await res.json();
            setMessages(data || []);
          }
        }
      } catch (err) {
        console.error("Error obteniendo los mensajes:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [activeChatContact, chatService, activeUserId]);

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
          `${API_URL}/users?email=${encodeURIComponent(searchEmail.trim())}`,
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
        await fetch(`${API_URL}/contacts`, {
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

  // 5. ENVIAR MENSAJE
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || !activeChatContact) return;

    const payload = {
      senderId: activeUserId,
      receiverId:
        activeChatContact.users_chat_contact_contact_user_idTousers.id,
      message: inputValue.trim(),
    };

    try {
      let savedMsg;
      if (chatService) {
        savedMsg = await chatService.sendMessage(payload);
      } else {
        // Fallback de conexión directa (Fetch Nativo)
        const res = await fetch(`${API_URL}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          savedMsg = await res.json();
        }
      }

      if (savedMsg) {
        setMessages((prev) => [...prev, savedMsg]);
      }
      setInputValue("");
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // 6. DESCARGAR PDF
  const handleDownloadPDF = async (contactUserId: number, chatName: string) => {
    try {
      let chatHistory = [];
      if (chatService) {
        chatHistory =
          (await chatService.getMessages(activeUserId, contactUserId)) || [];
      } else {
        const res = await fetch(
          `${API_URL}/messages/${activeUserId}/${contactUserId}`,
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
      {!activeChatContact && (
        <>
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
        </>
      )}

      {/* TABLA O VENTANA DE CHAT */}
      <Card>
        {!activeChatContact ? (
          <Table>
            <thead>
              <tr>
                <Th>Sede</Th>
                <Th style={{ textAlign: "center" }}>Estado</Th>
                <Th style={{ textAlign: "right" }}>Comunícate</Th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const targetUser =
                  contact.users_chat_contact_contact_user_idTousers;
                const isOnline = targetUser.UserStatus?.code !== "DESCONECTADO";
                const displayName =
                  targetUser.UserData?.name || targetUser.email;

                return (
                  <Tr key={contact.id}>
                    <Td style={{ color: "#374151", fontWeight: 500 }}>
                      {displayName}
                    </Td>
                    <Td style={{ textAlign: "center" }}>
                      <StatusPill $status={isOnline}>
                        {isOnline ? "Disponible" : "No conectado"}
                      </StatusPill>
                    </Td>
                    <Td style={{ textAlign: "right" }}>
                      <ChatButton onClick={() => setActiveChatContact(contact)}>
                        Chat
                      </ChatButton>
                    </Td>
                  </Tr>
                );
              })}
              {contacts.length === 0 && (
                <Tr>
                  <Td
                    colSpan={3}
                    style={{ textAlign: "center", color: "#9CA3AF" }}
                  >
                    No tienes contactos agregados. Usa el buscador de arriba.
                  </Td>
                </Tr>
              )}
            </tbody>
          </Table>
        ) : (
          <ChatWrapper>
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
                <ChatStatus>
                  {activeChatContact.users_chat_contact_contact_user_idTousers
                    .UserStatus?.UserStatusTranslation?.[0]?.name || "Online"}
                </ChatStatus>
              </ChatInfo>
            </ChatHeader>

            <ChatMessages>
              {messages.map((msg) => {
                const isMine = msg.senderId === activeUserId;
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
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SendButton onClick={handleSendMessage}>
                <img src={sendIcon} alt="Enviar" />
              </SendButton>
            </ChatInputArea>
          </ChatWrapper>
        )}
      </Card>

      {/* BOTON DE REGRESO */}
      {activeChatContact && (
        <BottomActions>
          <BackButton onClick={() => setActiveChatContact(null)}>
            Cerrar y regresar
          </BackButton>
        </BottomActions>
      )}

      {/* HISTORIAL */}
      {!activeChatContact && (
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
      )}
    </ModuleContainer>
  );
}
