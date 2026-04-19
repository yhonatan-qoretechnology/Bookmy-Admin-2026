import { useState } from "react";
import styled from "styled-components";

interface CalendarAppointment {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  service: {
    nombre: string;
  };
  profesional: {
    nombre: string;
  };
  user: {
    nombre: string;
    email: string;
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
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CalendarWidget({ appointments = [] }: CalendarWidgetProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

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
      const aptDate = new Date(apt.fecha).toISOString().split("T")[0];
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
        <button
          onClick={goToToday}
          style={{ fontSize: "0.85rem", color: "#666" }}
        >
          Hoy
        </button>
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
                >
                  {formatHour(apt.horaInicio)}{" "}
                  {apt.service.nombre.substring(0, 15)}
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
    </Container>
  );
}
