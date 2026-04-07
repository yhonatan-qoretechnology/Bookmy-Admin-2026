import { useState } from "react";
import styled from "styled-components";

import fabIcon from "../../assets/icons/chatbot-fab.png";
import avatarImg from "../../assets/icons/assistant-avatar.png";
import robotIcon from "../../assets/icons/robot-icon.svg";
import minimizeIcon from "../../assets/icons/minimize-icon.svg";

type ChatState = "CLOSED" | "TOOLTIP" | "OPEN";

const FAQ_DATA: Record<string, React.ReactNode> = {
  "¿Cómo se crea una nueva empresa?": (
    <>
      <p>
        📍 Desde el menú “Empresas” → “Crear empresa”. Luego haz clic en el
        botón “Crear empresa”; se desplegará un formulario.
      </p>
      <p>Completa los datos y presiona el botón “Crear empresa”.</p>
    </>
  ),
  "¿Cómo se crea una sede?": (
    <>
      <p>
        📍 Desde el menú “Empresas” → “Crear empresa”, haz clic en el botón
        “Detalle”.{" "}
      </p>
      <p>
        Allí se cargarán las sedes de la empresa. Luego selecciona “Nueva sede”,
        completa todos los datos y presiona “Crear sede”.
      </p>
    </>
  ),
  "¿Cómo se agrega un profesional a una sede?": (
    <>
      <p>
        📍 Desde el menú “Empresas” → “Crear empresa”, haz clic en “Detalle”. Se
        cargarán las sedes y encontrarás el botón “Ver profesionales”.
      </p>
      <p>
        Allí se listan todos los profesionales de esa sede. Haz clic en “Crear
        profesional”, completa el formulario en el modal y presiona “Guardar
        profesional”.
      </p>
    </>
  ),
  "¿Cómo crear una reserva?": (
    <>
      <p>📍 Ve al menú “Reservas” y haz clic en “Crear nueva reserva”.</p>
      <p>Busca o selecciona el cliente. Selecciona el profesional.</p>
      <p>
        Elige el servicio (se mostrarán los disponibles para ese profesional).
      </p>
      <p>
        Selecciona la fecha y luego la hora. Revisa los datos de la reserva.
      </p>
      <p>Marca como pagado si aplica.</p>
      <p>
        Haz clic en “Realizar reserva”. Se abrirá un modal con la información;
        confirma la reserva y aparecerá un mensaje de éxito.
      </p>
    </>
  ),
  "¿Cómo eliminar una reserva?": (
    <>
      <p>
        📍 En el menú “Reservas”, se mostrarán las reservas en una tabla. Haz
        clic en el botón rojo con una X, aparecerá un modal de confirmación.
      </p>
      <p>Presiona “Aceptar” para eliminarla.</p>
    </>
  ),
  "¿Cómo crear un cliente?": (
    <>
      <p>📍 Ve al menú “Clientes” y selecciona “Crear cliente”. </p>
      <p>Completa el formulario y haz clic en “Crear cliente”.</p>
    </>
  ),
  "¿Cómo aprobar una reseña?": (
    <>
      <p>
        📍 Desde el menú “Empresas” → “Crear empresa”, haz clic en “Detalle”.
        Luego selecciona “Ver reseñas”.
      </p>
      <p>Se abrirá un modal con las reseñas de la sede.</p>
      <p>En la columna de opciones puedes aprobar o rechazar cada reseña.</p>
    </>
  ),
  "¿Cómo crear una categoría?": (
    <>
      <p>📍 Ve al menú “Secciones globales” y selecciona “Categorías”.</p>
      <p>Completa el formulario y haz clic en “Guardar categoría”.</p>
    </>
  ),
  "¿Cómo crear un servicio?": (
    <>
      <p>📍Ve al menú “Secciones globales” y selecciona “Servicios”.</p>
      <p>Completa el formulario y haz clic en “Guardar servicio”.</p>
    </>
  ),
};

const OPTIONS = Object.keys(FAQ_DATA);

const ChatbotWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
`;

const FabButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1a1c1e;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
  img {
    width: 32px;
    height: 32px;
  }
`;

const TooltipCard = styled.div`
  position: relative;
  width: 280px;
  background: white;
  border-radius: 16px;
  padding: 1.5rem 1.5rem 1.5rem 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #f0f0f0;
`;

const TooltipAvatar = styled.img`
  position: absolute;
  left: -25px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

const TooltipClose = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  img {
    width: 18px;
    opacity: 0.5;
  }
  &:hover img {
    opacity: 1;
  }
`;

const TooltipTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 800;
`;

const TooltipText = styled.p`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.8rem;
  line-height: 1.4;
`;

const AssistButton = styled.button`
  width: 100%;
  background-color: #66cdaa;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const ChatWindow = styled.div`
  width: 350px;
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background-color: #66cdaa;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RobotIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const HeaderTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 800;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #10b981;
    border-radius: 50%;
  }
`;

const HeaderClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  img {
    width: 20px;
    filter: brightness(0) invert(1);
  }
`;

const ChatBody = styled.div`
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BotMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BotBubble = styled.div`
  background-color: #374151;
  color: white;
  padding: 1.25rem;
  border-radius: 12px;
  border-bottom-left-radius: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;

  p {
    margin: 0 0 1rem 0;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
`;

const BotAvatarSmall = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #66cdaa;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 20px;
  }
`;

const OptionsList = styled.ul`
  margin: 1rem 0 0 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionItem = styled.li`
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: white;
  }
`;

const AnswerTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: white;
`;

const BackButton = styled.button`
  background-color: #66cdaa;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ChatFooter = styled.div`
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

const QuickActionButton = styled.button`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;
  &:hover {
    background-color: #f3f4f6;
  }
`;

export function Chatbot() {
  const [chatState, setChatState] = useState<ChatState>("TOOLTIP");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const handleClose = () => {
    setChatState("CLOSED");
    setSelectedQuestion(null); // Resetea la pregunta al cerrar
  };

  return (
    <ChatbotWrapper>
      {chatState === "TOOLTIP" && (
        <TooltipCard>
          <TooltipAvatar src={avatarImg} alt="Asistente" />
          <TooltipClose onClick={handleClose}>
            <img src={minimizeIcon} alt="Cerrar" />
          </TooltipClose>
          <TooltipTitle>Hola, soy tu asistente Bookmy!</TooltipTitle>
          <TooltipText>
            Tienes dudas , necesitas ayuda, no te preocupes estoy aquí para
            ayudarte!
          </TooltipText>
          <AssistButton onClick={() => setChatState("OPEN")}>
            Solicitar asistencia Bookmy
          </AssistButton>
        </TooltipCard>
      )}

      {chatState === "OPEN" && (
        <ChatWindow>
          <ChatHeader>
            <HeaderInfo>
              <RobotIcon src={robotIcon} alt="Robot" />
              <HeaderTextContainer>
                <HeaderTitle>Bookmy Asistente</HeaderTitle>
                <StatusIndicator>Online</StatusIndicator>
              </HeaderTextContainer>
            </HeaderInfo>
            <HeaderClose onClick={handleClose}>
              <img src={minimizeIcon} alt="Minimizar" />
            </HeaderClose>
          </ChatHeader>

          <ChatBody>
            <BotMessageContainer>
              <BotBubble>
                {selectedQuestion ? (
                  <>
                    <AnswerTitle>{selectedQuestion}</AnswerTitle>
                    {FAQ_DATA[selectedQuestion]}
                    <BackButton onClick={() => setSelectedQuestion(null)}>
                      &lt; Regresar
                    </BackButton>
                  </>
                ) : (
                  <>
                    👋 ¡Bienvenido!
                    <br />
                    Te ayudo a entender cómo funciona el sistema de reservas.
                    <br />
                    <br />
                    ¿Qué quieres conocer?
                    <br />
                    <br />
                    Opciones:
                    <OptionsList>
                      {OPTIONS.map((opt, idx) => (
                        <OptionItem
                          key={idx}
                          onClick={() => setSelectedQuestion(opt)}
                        >
                          {opt}
                        </OptionItem>
                      ))}
                    </OptionsList>
                  </>
                )}
              </BotBubble>
              <BotAvatarSmall>
                <img src={robotIcon} alt="Bot" />
              </BotAvatarSmall>
            </BotMessageContainer>
          </ChatBody>

          <ChatFooter>
            <QuickActionButton>
              🤔 Necesitas comunicarte con bookmy?
            </QuickActionButton>
            <QuickActionButton>🙋 FAQs</QuickActionButton>
          </ChatFooter>
        </ChatWindow>
      )}

      {chatState !== "OPEN" && (
        <FabButton onClick={() => setChatState("OPEN")}>
          <img src={fabIcon} alt="Chat" />
        </FabButton>
      )}
    </ChatbotWrapper>
  );
}
