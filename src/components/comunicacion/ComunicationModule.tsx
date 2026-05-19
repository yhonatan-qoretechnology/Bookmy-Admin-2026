import { useState } from "react";
import styled from "styled-components";

import sedeAvatar from "../../assets/images/sede-avatar.png";
import sendIcon from "../../assets/icons/send-blue.svg";
import dotsIcon from "../../assets/icons/dots-horizontal.svg";
import checkIcon from "../../assets/icons/check-double.svg";

const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MainTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const SubTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.textLight};
  margin: 0;
`;

const BackButton = styled.button`
  background-color: #8c8c8c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f0f0;
  overflow: hidden;
`;

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

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 65vh;
  min-height: 500px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ChatAvatar = styled.img`
  width: 45px;
  height: 45px;
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
  font-size: 1rem;
  font-weight: 700;
`;

const ChatStatus = styled.span`
  color: #3b82f6;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1.5rem;
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
  flex-direction: ${({ $isMine }) => ($isMine ? "row-reverse" : "row")};
  max-width: 70%;
`;

const SmallAvatar = styled.img`
  width: 28px;
  height: 28px;
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
  font-size: 0.95rem;
  line-height: 1.4;
  border: ${({ $isMine }) => ($isMine ? "1px solid #F3F4F6" : "none")};
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
`;

const ChatInputArea = styled.div`
  padding: 1rem 1.5rem;
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
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  background-color: #3b82f6;
  width: 40px;
  height: 40px;
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
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
    transform: translateX(-1px);
  }
`;

const SEDES_DATA = [
  { id: "1", name: "Glow Experience Benalmadena", status: "online" },
  { id: "2", name: "Glow Experience Fuengirola", status: "offline" },
  { id: "3", name: "Glow Experience Marbella", status: "online" },
  { id: "4", name: "Glow Experience Lash by Glow", status: "online" },
  { id: "5", name: "Glow Experience Rituals", status: "online" },
];

export function ComunicationModule() {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const activeSede = SEDES_DATA.find((s) => s.id === activeChat);

  return (
    <ModuleContainer>
      <HeaderActions>
        <TitleBlock>
          <MainTitle>Glow Experiencie</MainTitle>
          <SubTitle>Comunicacion sedes</SubTitle>
        </TitleBlock>

        {activeChat && (
          <BackButton onClick={() => setActiveChat(null)}>
            Cerrar y regresar
          </BackButton>
        )}
      </HeaderActions>

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
              <MessageRow $isMine={false}>
                <SmallAvatar src={sedeAvatar} alt="Sede" />
                <Bubble $isMine={false}>
                  Hola, si claro cuentanos que necesitas
                </Bubble>
                <MessageActions>
                  <img src={dotsIcon} alt="Opciones" width="16" />
                </MessageActions>
              </MessageRow>

              <MessageRow $isMine={true}>
                <Bubble $isMine={true}>
                  Hola, me comunico desde la sede de Benalmadena
                </Bubble>
                <MessageActions>
                  <img src={dotsIcon} alt="Opciones" width="16" />
                  <img src={checkIcon} alt="Leído" width="16" />
                </MessageActions>
              </MessageRow>
            </ChatMessages>

            <ChatInputArea>
              <Input type="text" placeholder="Escribir Mensaje" />
              <SendButton>
                <img src={sendIcon} alt="Enviar" />
              </SendButton>
            </ChatInputArea>
          </ChatWrapper>
        )}
      </Card>
    </ModuleContainer>
  );
}
