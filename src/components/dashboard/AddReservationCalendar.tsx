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
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827; /* Negro oscuro */
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textLight};
  font-size: 0.95rem;
  margin-bottom: 3rem;
`;

const MonthNavigator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  img {
    width: 20px;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  &:hover img {
    opacity: 1;
  }
`;

const MonthList = styled.div`
  display: flex;
  gap: 4rem;
  align-items: center;
`;

const MonthName = styled.span<{ $isActive?: boolean }>`
  font-size: ${({ $isActive }) => ($isActive ? "1.2rem" : "1rem")};
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "500")};
  color: ${({ $isActive, theme }) => ($isActive ? "#111827" : theme.textLight)};
  cursor: pointer;
  transition: all 0.2s;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const WeekDay = styled.div`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: 1rem;
  letter-spacing: 1px;
`;

const DayBox = styled.div<{
  $isSelected?: boolean;
  $isEmpty?: boolean;
  $isPast?: boolean;
}>`
  height: 80px;
  border: 1px solid
    ${({ $isSelected, theme }) => ($isSelected ? theme.primary : "#E5E7EB")};
  background-color: ${({ $isSelected, $isPast }) =>
    $isPast ? "#F9FAFB" : $isSelected ? "#F0FDF9" : "white"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "500")};
  color: ${({ $isSelected, $isPast, theme }) =>
    $isPast ? "#D1D5DB" : $isSelected ? theme.primary : theme.text};
  cursor: ${({ $isEmpty, $isPast }) =>
    $isEmpty || $isPast ? "default" : "pointer"};
  transition: all 0.2s ease;
  pointer-events: ${({ $isEmpty, $isPast }) =>
    $isEmpty || $isPast ? "none" : "auto"};
  opacity: ${({ $isPast }) => ($isPast ? 0.6 : 1)};

  &:hover {
    ${({ $isPast, theme }) =>
      !$isPast &&
      `
      border-color: ${theme.primary};
      background-color: #f9fafb;
    `}
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  flex-wrap: wrap;
`;

const HelperText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;

  strong {
    color: #111827;
    font-weight: 600;
  }
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
  background-color: #9ca3af; /* Gris */
  color: white;
  border: none;
`;

const NextButton = styled(ButtonBase)`
  background-color: ${({ theme }) => theme.primary}; /* Verde */
  color: white;
  border: none;
`;

const DAYS_HEADER = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const MONTHS = [
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

interface AddReservationCalendarProps {
  onBack: () => void;
  onNext: (date: Date) => void;
  selectedUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
  onClearUser?: () => void;
}

export function AddReservationCalendar({
  onBack,
  onNext,
  selectedUser,
  onClearUser,
}: AddReservationCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(viewDate.setMonth(viewDate.getMonth() + offset));
    setViewDate(new Date(newDate));
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Cálculos para el renderizado
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const totalDays = getDaysInMonth(year, month);
  const startDayIndex = getFirstDayOfMonth(year, month);

  // Obtener nombres de meses para la navegación (Anterior - Actual - Siguiente)
  const prevMonthName = MONTHS[(month - 1 + 12) % 12];
  const currentMonthName = MONTHS[month];
  const nextMonthName = MONTHS[(month + 1) % 12];

  // Generar array de la cuadrícula
  const gridCells = [];
  // Celdas vacías antes del primer día
  for (let i = 0; i < startDayIndex; i++) {
    gridCells.push(null);
  }
  // Días reales
  for (let i = 1; i <= totalDays; i++) {
    gridCells.push(i);
  }

  return (
    <Container>
      {/* Client info - displayed above calendar when selected */}
      {selectedUser && (
        <div
          style={{
            backgroundColor: "#D1FAE5",
            border: "1px solid #10B981",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <span
              style={{ fontSize: "0.8rem", color: "#065F46", fontWeight: 600 }}
            >
              Cliente seleccionado
            </span>
            <div
              style={{ fontSize: "0.95rem", color: "#065F46", fontWeight: 500 }}
            >
              {selectedUser.name} - {selectedUser.email}
            </div>
          </div>
          <button
            type="button"
            onClick={onClearUser}
            style={{
              background: "none",
              border: "none",
              color: "#065F46",
              cursor: "pointer",
              fontSize: "1.2rem",
              fontWeight: "bold",
              padding: "0 8px",
              lineHeight: 1,
            }}
            title="Buscar otro cliente"
          >
            ×
          </button>
        </div>
      )}

      <Title>Selecciona la fecha</Title>
      <Subtitle>
        Selecciona la fecha del calendario donde se agendará la nueva reserva
      </Subtitle>

      <MonthNavigator>
        <NavButton onClick={() => handleMonthChange(-1)}>
          <img src={chevronLeft} alt="Anterior" />
        </NavButton>

        <MonthList>
          <MonthName>{prevMonthName}</MonthName>
          <MonthName $isActive>{currentMonthName}</MonthName>
          <MonthName>{nextMonthName}</MonthName>
        </MonthList>

        <NavButton onClick={() => handleMonthChange(1)}>
          <img src={chevronRight} alt="Siguiente" />
        </NavButton>
      </MonthNavigator>

      <CalendarGrid>
        {DAYS_HEADER.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}

        {gridCells.map((day, index) => {
          if (!day) return <DayBox key={`empty-${index}`} $isEmpty />;

          const cellDate = new Date(year, month, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const isPast = cellDate < today;

          const isSelected =
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === month &&
            selectedDate?.getFullYear() === year;

          return (
            <DayBox
              key={day}
              $isSelected={isSelected}
              $isPast={isPast}
              onClick={() => !isPast && handleDaySelect(day)}
            >
              {day}
            </DayBox>
          );
        })}
      </CalendarGrid>

      <Footer>
        <BackButton onClick={onBack}>Regresar</BackButton>
        <NextButton onClick={() => selectedDate && onNext(selectedDate)}>
          Siguiente
        </NextButton>
      </Footer>
    </Container>
  );
}
