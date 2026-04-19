import { useState } from "react";
import styled from "styled-components";

interface CalendarAppointment {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  duracion: number;
  notas: string;
  service: {
    nombre: string;
    descripcion?: string;
  };
  profesional: {
    nombre: string;
    telefono?: string;
  };
  user: {
    nombre: string;
    email: string;
    telefono?: string;
  };
  sede?: {
    nombre: string;
    direccion?: string;
  };
  payment?: {
    method: string;
    totalAmount: number;
    paidAmount: number;
    status: string;
  };
}

interface CalendarWidgetProps {
  appointments?: CalendarAppointment[];
  sedeId?: number;
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.toggleBorder};
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  overflow: auto;
`;

const TodayButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DateTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textLight};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  padding: 0.75rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text};
  background-color: #f9fafb;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;

  &:nth-child(7n) {
    border-right: none;
  }
`;

const DayCell = styled.div<{ isToday?: boolean; isOtherMonth?: boolean }>`
  min-height: 80px;
  padding: 0.5rem;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  background-color: ${({ isToday }) => (isToday ? "#f0f9ff" : "white")};

  &:nth-child(7n) {
    border-right: none;
  }

  span {
    display: block;
    text-align: right;
    font-size: 0.85rem;
    color: ${({ theme, isOtherMonth }) =>
      isOtherMonth ? "#ccc" : theme.textLight};
    margin-bottom: 0.25rem;
  }
`;

const EventBadge = styled.div<{ status?: string }>`
  background-color: ${({ status }) =>
    status === "CANCELLED"
      ? "#fee2e2"
      : status === "COMPLETED"
        ? "#dcfce7"
        : "#e0f2fe"};
  border-left: 3px solid
    ${({ status }) =>
      status === "CANCELLED"
        ? "#ef4444"
        : status === "COMPLETED"
          ? "#22c55e"
          : "#0ea5e9"};
  padding: 3px 5px;
  font-size: 0.6rem;
  border-radius: 2px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #333;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #666;
  font-size: 0.85rem;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-size: 0.85rem;
  text-align: right;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ status }) =>
    status === "CANCELLED"
      ? "#fee2e2"
      : status === "COMPLETED"
        ? "#dcfce7"
        : "#e0f2fe"};
  color: ${({ status }) =>
    status === "CANCELLED"
      ? "#ef4444"
      : status === "COMPLETED"
        ? "#22c55e"
        : "#0ea5e9"};
`;

const DAYS_HEADER = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();

  const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - i),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }

  // Next month days to fill the grid
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  return days;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatHour(dateString: string): string {
  // Extract time directly from ISO string to avoid timezone conversion
  const timePart = dateString.split("T")[1];
  if (!timePart) return "";
  const [hours, minutes] = timePart.split(":");
  return `${hours}:${minutes}`;
}

export function CalendarWidget({ appointments = [] }: CalendarWidgetProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedAppointment, setSelectedAppointment] =
    useState<CalendarAppointment | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const days = getMonthData(year, month);

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = formatDate(date);
    return appointments.filter((apt) => {
      // Extract date directly from ISO string to avoid timezone issues
      const aptDate = apt.fecha.split("T")[0];
      return aptDate === dateStr;
    });
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    return formatDate(date) === formatDate(today);
  };

  return (
    <Container>
      <Header>
        <TodayButton onClick={goToToday}>Hoy</TodayButton>
        <DateTitle>
          <button onClick={goToPrevMonth}>«</button>
          <span>
            {monthNames[month]} {year}
          </span>
          <button onClick={goToNextMonth}>»</button>
        </DateTitle>
      </Header>

      <CalendarGrid>
        {DAYS_HEADER.map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {days.map((data, index) => {
          const dayAppointments = getAppointmentsForDay(data.date);
          return (
            <DayCell
              key={index}
              isToday={isToday(data.date)}
              isOtherMonth={!data.isCurrentMonth}
            >
              <span>{data.day}</span>
              {dayAppointments.slice(0, 3).map((apt) => (
                <EventBadge
                  key={apt.id}
                  status={apt.estado}
                  title={`${apt.service.nombre} - ${apt.user.nombre} (${formatHour(apt.horaInicio)})`}
                  onClick={() => setSelectedAppointment(apt)}
                >
                  {formatHour(apt.horaInicio)}{" "}
                  {apt.profesional.nombre.substring(0, 8)}/
                  {apt.user.nombre.split(" ")[0]}
                </EventBadge>
              ))}
              {dayAppointments.length > 3 && (
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "#666",
                    textAlign: "right",
                  }}
                >
                  +{dayAppointments.length - 3} más
                </div>
              )}
            </DayCell>
          );
        })}
      </CalendarGrid>

      {selectedAppointment && (
        <ModalOverlay onClick={() => setSelectedAppointment(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Detalles de la Cita</ModalTitle>
              <CloseButton onClick={() => setSelectedAppointment(null)}>
                ×
              </CloseButton>
            </ModalHeader>

            <DetailRow>
              <DetailLabel>Estado</DetailLabel>
              <StatusBadge status={selectedAppointment.estado}>
                {selectedAppointment.estado}
              </StatusBadge>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Fecha</DetailLabel>
              <DetailValue>
                {selectedAppointment.fecha.split("T")[0]}
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Hora</DetailLabel>
              <DetailValue>
                {formatHour(selectedAppointment.horaInicio)} -{" "}
                {formatHour(selectedAppointment.horaFin)}
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Duración</DetailLabel>
              <DetailValue>{selectedAppointment.duracion} minutos</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Servicio</DetailLabel>
              <DetailValue>{selectedAppointment.service.nombre}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Profesional</DetailLabel>
              <DetailValue>
                {selectedAppointment.profesional.nombre}
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Cliente</DetailLabel>
              <DetailValue>{selectedAppointment.user.nombre}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Email Cliente</DetailLabel>
              <DetailValue>{selectedAppointment.user.email}</DetailValue>
            </DetailRow>

            {selectedAppointment.user.telefono && (
              <DetailRow>
                <DetailLabel>Teléfono Cliente</DetailLabel>
                <DetailValue>{selectedAppointment.user.telefono}</DetailValue>
              </DetailRow>
            )}

            {selectedAppointment.sede && (
              <DetailRow>
                <DetailLabel>Sede</DetailLabel>
                <DetailValue>{selectedAppointment.sede.nombre}</DetailValue>
              </DetailRow>
            )}

            {selectedAppointment.notas && (
              <DetailRow>
                <DetailLabel>Notas</DetailLabel>
                <DetailValue>{selectedAppointment.notas}</DetailValue>
              </DetailRow>
            )}

            {selectedAppointment.payment && (
              <>
                <DetailRow>
                  <DetailLabel>Método de Pago</DetailLabel>
                  <DetailValue>
                    {selectedAppointment.payment.method}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Total</DetailLabel>
                  <DetailValue>
                    {selectedAppointment.payment.totalAmount} EUR
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Pagado</DetailLabel>
                  <DetailValue>
                    {selectedAppointment.payment.paidAmount} EUR
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Estado Pago</DetailLabel>
                  <DetailValue>
                    {selectedAppointment.payment.status}
                  </DetailValue>
                </DetailRow>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
