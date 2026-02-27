import { useState } from "react";
import styled from "styled-components";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  text-align: center;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textLight};
  font-size: 0.95rem;
  margin-bottom: 2rem;
`;

const DateScroller = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  img {
    width: 20px;
    opacity: 0.6;
  }
  &:hover img {
    opacity: 1;
  }
`;

const DayBox = styled.div<{ $isActive?: boolean }>`
  width: 60px;
  height: 50px;
  border: 1px solid
    ${({ $isActive, theme }) => ($isActive ? theme.primary : "#E5E7EB")};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ $isActive, theme }) => ($isActive ? theme.primary : theme.text)};
  cursor: pointer;
  background-color: white;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TimeGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto 3rem auto;
`;

const TimeSlot = styled.div<{ $isSelected?: boolean }>`
  border: 1px solid
    ${({ $isSelected, theme }) => ($isSelected ? theme.primary : "#E5E7EB")};
  border-radius: 10px;
  padding: ${({ $isSelected }) => ($isSelected ? "1rem 1.5rem" : "1.2rem")};
  cursor: pointer;
  background-color: white;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  justify-content: ${({ $isSelected }) =>
    $isSelected ? "space-between" : "center"};

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TimeText = styled.span<{ $isSelected?: boolean }>`
  font-size: 0.95rem;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.primary : theme.textLight};
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "500")};
`;

const SelectedCardContent = styled.div`
  text-align: left;
`;

const ServiceName = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.primary};
  font-size: 1rem;
  font-weight: bold;
`;

const ClientName = styled.p`
  margin: 4px 0 0 0;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.85rem;
`;

const PriceTag = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  font-size: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
`;

const ButtonBase = styled.button`
  padding: 0.8rem 2.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const BackButton = styled(ButtonBase)`
  background-color: #9ca3af;
  color: white;
  border: none;
`;

const NextButton = styled(ButtonBase)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
`;

interface AddReservationTimeProps {
  selectedDate: Date;
  onBack: () => void;
  onNext: (time: string) => void;
  serviceName?: string;
  clientName?: string;
  price?: string;
}

export function AddReservationTime({
  selectedDate,
  onBack,
  onNext,
  serviceName = "Servicio no seleccionado",
  clientName = "Cliente no seleccionado",
  price = "0.00€",
}: AddReservationTimeProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const currentDay = viewDate.getDate();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const TIME_SLOTS = [
    "08:00am",
    "08:30am",
    "09:00am",
    "09:30am",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
    "01:00pm",
    "01:30pm",
    "02:00pm",
    "02:30pm",
    "03:00pm",
    "03:30pm",
    "04:00pm",
    "04:30pm",
    "05:00pm",
    "05:30pm",
    "06:00pm",
  ];

  const handleDateChange = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(viewDate.getDate() + offset);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) return;

    setViewDate(newDate);
  };

  const generateDays = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(viewDate);
      d.setDate(currentDay + i);
      days.push(d);
    }
    return days;
  };

  return (
    <Container>
      <Title>Selecciona la hora</Title>
      <Subtitle>Selecciona la hora de la nueva reserva</Subtitle>

      <DateScroller>
        <NavButton onClick={() => handleDateChange(-1)}>
          <img src={chevronLeft} alt="Anterior" />
        </NavButton>

        {generateDays().map((date) => {
          const dayNum = date.getDate();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = date < today;
          const isActive =
            date.getDate() === viewDate.getDate() &&
            date.getMonth() === viewDate.getMonth() &&
            date.getFullYear() === viewDate.getFullYear();

          return (
            <DayBox
              key={date.getTime()}
              $isActive={isActive}
              style={{
                opacity: isPast ? 0.4 : 1,
                cursor: isPast ? "default" : "pointer",
                pointerEvents: isPast ? "none" : "auto",
              }}
              onClick={() => !isPast && setViewDate(new Date(date))}
            >
              {dayNum}
            </DayBox>
          );
        })}

        <NavButton onClick={() => handleDateChange(1)}>
          <img src={chevronRight} alt="Siguiente" />
        </NavButton>
      </DateScroller>

      <TimeGrid>
        {TIME_SLOTS.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <TimeSlot
              key={time}
              $isSelected={isSelected}
              onClick={() => setSelectedTime(time)}
            >
              {isSelected ? (
                <>
                  <SelectedCardContent>
                    <ServiceName>{serviceName}</ServiceName>
                    <ClientName>Cliente: {clientName}</ClientName>
                  </SelectedCardContent>
                  <PriceTag>{price}</PriceTag>
                </>
              ) : (
                <TimeText>{time}</TimeText>
              )}
            </TimeSlot>
          );
        })}
      </TimeGrid>

      <Footer>
        <BackButton onClick={onBack}>Regresar</BackButton>
        <NextButton onClick={() => selectedTime && onNext(selectedTime)}>
          Siguiente
        </NextButton>
      </Footer>
    </Container>
  );
}
