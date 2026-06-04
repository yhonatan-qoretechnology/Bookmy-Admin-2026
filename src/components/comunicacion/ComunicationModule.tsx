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

// --- ESTILOS DE TABLA ---
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
  vertical-align: middle;
`;

const StatusPill = styled.span<{ $status: "online" | "offline" }>`
  background-color: ${({ $status }) =>
    $status === "online" ? "#10B981" : "#EF4444"};
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ChatButton = styled.button<{ $disabled?: boolean }>`
  background-color: ${({ $disabled }) => ($disabled ? "#9CA3AF" : "#3B82F6")};
  color: white;
  border: none;
  padding: 0.4rem 1.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: opacity 0.2s;

  &:hover {
    opacity: ${({ $disabled }) => ($disabled ? "1" : "0.9")};
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
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
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

// --- ESTILOS DEL HISTORIAL Y FILTROS ---
const HistorySection = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
`;

const FilterSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};

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

const SEDES_DATA = [
  { id: "1", name: "Glow Experience Benalmadena", status: "online" },
  { id: "2", name: "Glow Experience Fuengirola", status: "offline" },
  { id: "3", name: "Glow Experience Marbella", status: "online" },
  { id: "4", name: "Glow Experience Lash by Glow", status: "online" },
  { id: "5", name: "Glow Experience Rituals", status: "online" },
];

const HISTORY_DATA = [
  {
    id: 1,
    chatName: "Sede Marbella - Sede Benalmadena",
    date: "14 sep 2026",
    time: "10:00 am",
  },
  {
    id: 2,
    chatName: "Sede Fuengirola - Sede Benalmadena",
    date: "20 sep 2026",
    time: "13:00 pm",
  },
];

const MOCK_CONVERSATIONS_FOR_PDF: Record<number, any[]> = {
  1: [
    {
      sender: "Sede Benalmadena",
      status: "Online",
      message:
        "Hola como estais, quisiera preguntar si teneis cupo para una clienta que quiere reservar para mañana en la sede de marbella",
    },
    {
      sender: "Sede Marbella",
      status: "Online",
      message:
        "Hola que tal, si tendriamos cupo entre las 11:00 am a 1:00 pm, puedes confirmarle?",
    },
    {
      sender: "Sede Benalmadena",
      status: "Online",
      message:
        "Si claro, me confirma, que podria a las 11:30 am para una depilacion de cejas",
    },
    {
      sender: "Sede Marbella",
      status: "Online",
      message: "Si tenemos espacio, confirmame los datos para agendar la cita",
    },
  ],
  2: [
    {
      sender: "Sede Fuengirola",
      status: "Online",
      message: "Hola, necesitamos insumos urgentemente.",
    },
    {
      sender: "Sede Benalmadena",
      status: "Online",
      message: "Claro, los enviaremos esta tarde.",
    },
  ],
};

export function ComunicationModule() {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hola, si claro cuentanos que necesitas", isMine: false },
    {
      id: 2,
      text: "Hola, me comunico desde la sede de Benalmadena",
      isMine: true,
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSede = SEDES_DATA.find((s) => s.id === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      isMine: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // --- FUNCIÓN PARA GENERAR EL PDF ---
  const handleDownloadPDF = (historyId: number, chatName: string) => {
    const doc = new jsPDF();

    let yPos = 20;
    const margin = 20;
    const pageHeight = doc.internal.pageSize.height;

    const conversation = MOCK_CONVERSATIONS_FOR_PDF[historyId] || [];

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Historial: ${chatName}`, margin, yPos);
    yPos += 15;

    conversation.forEach((msg) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20; 
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(msg.sender, margin, yPos);
      yPos += 6;

      doc.text(msg.status, margin, yPos);
      yPos += 6;

      doc.text("Mensaje:", margin, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      const splitMessage = doc.splitTextToSize(msg.message, 170); 
      doc.text(splitMessage, margin, yPos);

      yPos += splitMessage.length * 6 + 10;
    });

    const fileName = `Chat_${chatName.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
  };

  return (
    <ModuleContainer>
      <Card>
        {!activeChat ? (
          <Table>
            <thead>
              <tr>
                <Th>Sede</Th>
                <Th style={{ textAlign: "center" }}>Estado</Th>
                <Th style={{ textAlign: "right" }}>Comunícate</Th>
              </tr>
            </thead>
            <tbody>
              {SEDES_DATA.map((sede) => (
                <Tr key={sede.id}>
                  <Td style={{ color: "#374151", fontWeight: 500 }}>
                    {sede.name}
                  </Td>
                  <Td style={{ textAlign: "center" }}>
                    <StatusPill $status={sede.status as "online" | "offline"}>
                      {sede.status === "online" ? "Disponible" : "No conectado"}
                    </StatusPill>
                  </Td>
                  <Td style={{ textAlign: "right" }}>
                    <ChatButton
                      $disabled={sede.status === "offline"}
                      onClick={() => {
                        if (sede.status === "online") setActiveChat(sede.id);
                      }}
                    >
                      Chat
                    </ChatButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <ChatWrapper>
            <ChatHeader>
              <ChatAvatar src={sedeAvatar} alt={activeSede?.name} />
              <ChatInfo>
                <ChatName>
                  Sede {activeSede?.name.replace("Glow Experience ", "")}
                </ChatName>
                <ChatStatus>online</ChatStatus>
              </ChatInfo>
            </ChatHeader>

            <ChatMessages>
              {messages.map((msg) => (
                <MessageRow key={msg.id} $isMine={msg.isMine}>
                  {!msg.isMine && (
                    <>
                      <SmallAvatar src={sedeAvatar} alt="Sede" />
                      <Bubble $isMine={false}>{msg.text}</Bubble>
                      <MessageActions>
                        <img src={dotsIcon} alt="Opciones" width="16" />
                      </MessageActions>
                    </>
                  )}

                  {msg.isMine && (
                    <>
                      <MessageActions>
                        <img src={dotsIcon} alt="Opciones" width="16" />
                      </MessageActions>
                      <Bubble $isMine={true}>{msg.text}</Bubble>
                      <MessageActions>
                        <img src={checkIcon} alt="Leído" width="16" />
                      </MessageActions>
                    </>
                  )}
                </MessageRow>
              ))}
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

      {activeChat && (
        <BottomActions>
          <BackButton onClick={() => setActiveChat(null)}>
            Cerrar y regresar
          </BackButton>
        </BottomActions>
      )}

      {!activeChat && (
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
                  <Th>Chat</Th>
                  <Th>Fecha</Th>
                  <Th>Hora</Th>
                  <Th style={{ textAlign: "right", paddingRight: "2rem" }}>
                    Descargar
                  </Th>
                </tr>
              </thead>
              <tbody>
                {HISTORY_DATA.map((row) => (
                  <Tr key={row.id}>
                    <Td style={{ color: "#374151", fontWeight: 500 }}>
                      {row.chatName}
                    </Td>
                    <Td>{row.date}</Td>
                    <Td>{row.time}</Td>
                    <Td style={{ textAlign: "right", paddingRight: "1.5rem" }}>
                      <PdfButton
                        onClick={() => handleDownloadPDF(row.id, row.chatName)}
                      >
                        PDF
                      </PdfButton>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </HistorySection>
      )}
    </ModuleContainer>
  );
}
