import styled from "styled-components";

interface Appointment {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  service?: {
    nombre?: string;
  };
  profesional?: {
    nombre?: string;
  };
  user?: {
    nombre?: string;
  };
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.toggleBorder};
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  overflow: auto;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

const DateInfo = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.toggleBorder};
  border-radius: 8px;
  text-align: center;
`;

const AddButton = styled.button`
  width: 100%;
  background-color: #4379ee;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  padding-left: 1rem;
`;

const TimelineItem = styled.div<{ $status?: string }>`
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 1.5rem;
  border-left: 2px solid
    ${({ $status, theme }) =>
      $status === "CANCELLED"
        ? "#ef4444"
        : $status === "COMPLETED"
          ? "#22c55e"
          : theme.primary};

  &:last-child {
    border-left: 2px solid transparent;
  }

  &::before {
    content: "";
    position: absolute;
    left: -6px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ $status, theme }) =>
      $status === "CANCELLED"
        ? "#ef4444"
        : $status === "COMPLETED"
          ? "#22c55e"
          : theme.primary};
  }
`;

const ItemTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const ItemTime = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textLight};
  display: block;
  margin-bottom: 0.25rem;
`;

const ItemDetail = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textLight};
  display: block;
  margin-bottom: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
`;

interface DayReservationsProps {
  onAddReservation: () => void;
  appointments?: Appointment[];
  selectedDate?: Date;
}

function formatHour(dateString: string): string {
  const timePart = dateString.split("T")[1];
  if (!timePart) return "";
  const [hours, minutes] = timePart.split(":");

  // Add 2 hours to show Spanish time (UTC+2) instead of UTC
  let hour = parseInt(hours, 10) + 2;
  if (hour >= 24) hour -= 24;

  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

function formatDisplayDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Use local date parts to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const todayYear = today.getFullYear();
  const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
  const todayDay = String(today.getDate()).padStart(2, "0");
  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

  const tomorrowYear = tomorrow.getFullYear();
  const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const tomorrowDay = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowStr = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

  if (dateStr === todayStr) return "Hoy";
  if (dateStr === tomorrowStr) return "Mañana";

  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export function DayReservations({
  onAddReservation,
  appointments = [],
  selectedDate = new Date(),
}: DayReservationsProps) {
  // Get local date string in YYYY-MM-DD format to avoid timezone issues
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const dayAppointments = appointments
    .filter((apt) => apt.fecha.split("T")[0] === dateStr)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  return (
    <Container>
      <AddButton onClick={onAddReservation}>+ Agregar una reserva</AddButton>
      <Title>Reservas del día</Title>

      <DateInfo>{formatDisplayDate(selectedDate)}</DateInfo>

      {dayAppointments.length === 0 ? (
        <EmptyState>No hay reservas para este día</EmptyState>
      ) : (
        <TimelineContainer>
          {dayAppointments.map((apt) => (
            <TimelineItem key={apt.id} $status={apt.estado}>
              <ItemTitle title={apt.service?.nombre || ""}>
                {apt.service?.nombre || "Sin servicio"}
              </ItemTitle>
              <ItemTime>
                {formatHour(apt.horaInicio)} - {formatHour(apt.horaFin)}
              </ItemTime>
              <ItemDetail>
                Profesional: {apt.profesional?.nombre || "-"}
              </ItemDetail>
              <ItemDetail>Cliente: {apt.user?.nombre || "-"}</ItemDetail>
            </TimelineItem>
          ))}
        </TimelineContainer>
      )}
    </Container>
  );
}
