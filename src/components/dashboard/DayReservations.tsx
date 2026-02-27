import styled from "styled-components";

const Container = styled.div`
  background-color: ${({ theme }) => theme.toggleBorder};
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
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
  margin-bottom: 2rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  padding-left: 1rem;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 2rem;
  border-left: 2px solid ${({ theme }) => theme.primary};

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
    background-color: ${({ theme }) => theme.primary};
  }
`;

const ItemTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text};
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
`;

interface DayReservationsProps {
  onAddReservation: () => void;
}

export function DayReservations({ onAddReservation }: DayReservationsProps) {
  return (
    <Container>
      <AddButton onClick={onAddReservation}>+ Agregar una reserva</AddButton>
      <Title>Reservas del día</Title>

      <TimelineContainer>
        <TimelineItem>
          <ItemTitle>Manicura semipermanente</ItemTitle>
          <ItemTime>Hoy 11:00 AM</ItemTime>
          <ItemDetail>Sede Benalmadena</ItemDetail>
          <ItemDetail>Especialista: Nayomi</ItemDetail>
          <ItemDetail>Andrea Reyes</ItemDetail>
        </TimelineItem>

        <TimelineItem>
          <ItemTitle>Depilación hilo mentón</ItemTitle>
          <ItemTime>Hoy 02:00 PM</ItemTime>
          <ItemDetail>Sede Benalmadena</ItemDetail>
          <ItemDetail>Especialista: Sara</ItemDetail>
          <ItemDetail>Amanda Rodriguez</ItemDetail>
        </TimelineItem>
      </TimelineContainer>
    </Container>
  );
}
