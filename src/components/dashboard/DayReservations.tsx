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
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  overflow: auto;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
`;

const AddButton = styled.button`
  width: 100%;
  background-color: #4880ff; 
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #111827;
`;

const DateInfo = styled.div`
  display: none; 
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReservationCard = styled.div<{ $status?: string }>`
  position: relative;
  padding-left: 1.25rem;
  padding-bottom: 1.2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.15rem;
    bottom: 1.5rem; 
    width: 4px;
    border-radius: 4px;
    background-color: ${({ $status, theme }) =>
      $status === "CANCELLED"
        ? "#ef4444"
        : $status === "COMPLETED"
          ? "#22c55e"
          : "#70C1A6"}; 
  }

  &:last-child::before {
    bottom: 0.2rem;
  }
`;

const ItemTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemText = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.35rem;
  line-height: 1.4;
`;

const ClientName = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #9ca3af;
  display: block;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 1rem;
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

  let hour = parseInt(hours, 10) + 2; 
  if (hour >= 24) hour -= 24;

  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${minutes} ${ampm}`;
}

function getDayLabel(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  if (format(date) === format(today)) return "Hoy";
  if (format(date) === format(tomorrow)) return "Mañana";

  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function DayReservations({
  onAddReservation,
  appointments = [],
  selectedDate = new Date(),
}: DayReservationsProps) {
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const dayAppointments = appointments
    .filter((apt) => apt.fecha.split("T")[0] === dateStr)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const dayLabel = getDayLabel(selectedDate);

  return (
    <Container>
      <AddButton onClick={onAddReservation}>+ Agregar una reserva</AddButton>
      <Title>Reservas del día</Title>

      <DateInfo>{dayLabel}</DateInfo>

      {dayAppointments.length === 0 ? (
        <EmptyState>No hay reservas para este día</EmptyState>
      ) : (
        <ListContainer>
          {dayAppointments.map((apt) => (
            <ReservationCard key={apt.id} $status={apt.estado}>
              <ItemTitle title={apt.service?.nombre || ""}>
                {apt.service?.nombre || "Sin servicio"}
              </ItemTitle>
              <ItemText>
                {dayLabel} {formatHour(apt.horaInicio)}
              </ItemText>
              <ItemText>Sede Benalmadena</ItemText>
              <ItemText>
                Especialista: {apt.profesional?.nombre || "-"}
              </ItemText>
              <ClientName>{apt.user?.nombre || "-"}</ClientName>
            </ReservationCard>
          ))}
        </ListContainer>
      )}
    </Container>
  );
}
