import { useState } from "react";
import styled from "styled-components";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";

const PopupContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 320px;
  z-index: 100;
  border: 1px solid #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  text-transform: capitalize;
`;

const NavButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #e5e7eb;
  }
  img {
    width: 16px;
  }
`;

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
`;

const WeekDay = styled.span`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textLight};
  font-weight: 500;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 0.5rem;
`;

const DayCell = styled.button<{ $isSelected?: boolean; $isToday?: boolean }>`
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.primary : "transparent"};
  color: ${({ $isSelected, theme }) => ($isSelected ? "white" : theme.text)};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%; /* Círculo perfecto según tu diseño */
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "normal")};

  &:hover {
    background: ${({ $isSelected, theme }) =>
      $isSelected ? theme.primary : "#F3F4F6"};
  }

  ${({ $isToday, $isSelected, theme }) =>
    $isToday &&
    !$isSelected &&
    `
    border: 1px solid ${theme.primary};
    color: ${theme.primary};
    font-weight: bold;
  `}
`;

const Footer = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
  text-align: center;
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: 1rem;
`;

const SelectButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
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

interface DatePickerProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export function DatePicker({
  selectedDate,
  onSelect,
  onClose,
}: DatePickerProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const [tempSelectedDate, setTempSelectedDate] = useState(
    new Date(selectedDate),
  );

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.setMonth(viewDate.getMonth() + offset));
    setViewDate(new Date(newDate));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setTempSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onSelect(tempSelectedDate);
    onClose();
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  return (
    <PopupContainer onClick={(e) => e.stopPropagation()}>
      <Header>
        <MonthTitle>
          {MONTH_NAMES[month]} {year}
        </MonthTitle>
        <div style={{ display: "flex", gap: "8px" }}>
          <NavButton onClick={() => changeMonth(-1)}>
            <img src={chevronLeft} alt="Anterior" />
          </NavButton>
          <NavButton onClick={() => changeMonth(1)}>
            <img src={chevronRight} alt="Siguiente" />
          </NavButton>
        </div>
      </Header>

      <WeekDaysGrid>
        {DAYS_OF_WEEK.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekDaysGrid>

      <DaysGrid>
        {daysArray.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;

          const isSelected =
            tempSelectedDate.getDate() === day &&
            tempSelectedDate.getMonth() === month &&
            tempSelectedDate.getFullYear() === year;

          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <DayCell
              key={day}
              $isSelected={isSelected}
              $isToday={isToday}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </DayCell>
          );
        })}
      </DaysGrid>

      <Footer>
        <HelperText>*Selecciona solamente una fecha</HelperText>
        <SelectButton onClick={handleConfirm}>Seleccionar</SelectButton>
      </Footer>
    </PopupContainer>
  );
}
