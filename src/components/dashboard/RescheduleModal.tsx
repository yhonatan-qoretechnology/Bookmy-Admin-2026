import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import {
  AppointmentsApiClient,
  type Appointment,
} from "../../api/clients/AppointmentsApiClient";
import { CalendarWidget } from "./CalendarWidget";

const httpClient = new FetchHttpClient();
const appointmentsApiClient = new AppointmentsApiClient(httpClient);

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 95%;
  max-width: 800px;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ServiceInfo = styled.p`
  font-size: 1rem;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const CalendarContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthTitle = styled.span`
  font-weight: 600;
  color: #111827;
`;

const NavButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e5e7eb;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  padding: 0.5rem;
`;

const DayCell = styled.button<{
  $isSelected: boolean;
  $isAvailable: boolean;
  $isToday: boolean;
}>`
  padding: 0.75rem;
  border: ${(props) =>
    props.$isSelected ? "2px solid #6366f1" : "1px solid #e5e7eb"};
  border-radius: 8px;
  background: ${(props) =>
    props.$isSelected ? "#eef2ff" : props.$isAvailable ? "white" : "#f9fafb"};
  color: ${(props) => (!props.$isAvailable ? "#d1d5db" : "#111827")};
  cursor: ${(props) => (props.$isAvailable ? "pointer" : "not-allowed")};
  opacity: ${(props) => (props.$isAvailable ? 1 : 0.5)};

  &:hover {
    background: ${(props) => (props.$isAvailable ? "#f3f4f6" : undefined)};
  }
`;

const TimeSlotsContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TimeSlotsLabel = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const TimeSlot = styled.button`
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const MotivoInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: #6366f1;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

interface RescheduleModalProps {
  appointment: Appointment;
  onClose: () => void;
  onRescheduled: (
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    motivo: string,
  ) => void;
  isRescheduling: boolean;
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
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

export function RescheduleModal({
  appointment,
  onClose,
  onRescheduled,
  isRescheduling,
}: RescheduleModalProps) {
  console.log(
    "RescheduleModal opened for appointment:",
    appointment.id,
    "sedeId:",
    appointment.sedeId,
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarAppointments, setCalendarAppointments] = useState<
    Appointment[]
  >([]);

  // Load calendar appointments for the current month
  useEffect(() => {
    const loadCalendarAppointments = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startDate = new Date(year, month, 1).toISOString().split("T")[0];
        const endDate = new Date(year, month + 1, 0)
          .toISOString()
          .split("T")[0];

        const response = await appointmentsApiClient.getCalendarAppointments(
          appointment.sedeId,
          startDate,
          endDate,
        );
        setCalendarAppointments(response.data || []);
      } catch (error) {
        console.error("Error loading calendar appointments:", error);
      }
    };

    loadCalendarAppointments();
  }, [currentDate, appointment.sedeId]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const loadBlockedSlots = useCallback(
    async (date: Date) => {
      setLoadingSlots(true);
      setBlockedSlots([]);
      try {
        const dateStr = date.toISOString().split("T")[0];
        console.log(
          "Loading slots for sedeId:",
          appointment.sedeId,
          "date:",
          dateStr,
        );

        const response = await appointmentsApiClient.getFilteredAppointments({
          sedeId: appointment.sedeId,
          date: dateStr,
        });

        console.log("API Response:", response);

        const slots =
          response.data?.items
            ?.map((apt) => {
              // Get time from API as-is
              const time = apt.horaInicio.split("T")[1]?.substring(0, 5);
              return time || "";
            })
            .filter(Boolean) || [];

        console.log("Loaded blocked slots:", slots);
        setBlockedSlots(slots);
      } catch (error) {
        console.error("Error loading blocked slots:", error);
        setBlockedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [appointment.sedeId],
  );

  useEffect(() => {
    if (selectedDate) {
      loadBlockedSlots(selectedDate);
    }
  }, [selectedDate, loadBlockedSlots]);

  const isDateAvailable = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const isTimeAvailable = (time: string) => {
    return !blockedSlots.includes(time);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (day: number) => {
    if (isDateAvailable(day)) {
      setSelectedDate(new Date(year, month, day));
      setSelectedTime(null);
    }
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    // Use local date format (YYYY-MM-DD)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const duration = appointment.duracion || 60;

    // Use the selected time as-is (local time)
    const [hours, minutes] = selectedTime.split(":").map(Number);

    const endHours = hours + Math.floor(duration / 60);
    const endMinutes = minutes + (duration % 60);
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}:00`;

    console.log(
      "Sending to API - date:",
      dateStr,
      "startTime:",
      selectedTime,
      "endTime:",
      endTime,
    );

    // Send time as selected (the API should handle timezone)
    onRescheduled(dateStr, `${selectedTime}:00`, endTime, motivo);
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const now = new Date();

    // Generate slots based on local time (browser timezone)
    for (let hour = 8; hour < 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Create a date in local timezone
        const date = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hour,
          minute,
        );
        const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>Reagendar Cita</Title>
        <ServiceInfo>
          Servicio #{appointment.serviceId} - Profesional:{" "}
          {appointment.profesional?.nombre || "N/A"}
        </ServiceInfo>
        <InfoText>Selecciona una nueva fecha y hora para la reserva</InfoText>

        <CalendarContainer>
          <CalendarWidget
            appointments={calendarAppointments}
            onDateSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            initialDate={currentDate}
          />
        </CalendarContainer>

        {selectedDate && (
          <TimeSlotsContainer>
            <TimeSlotsLabel>
              Horarios disponibles para{" "}
              {selectedDate.toLocaleDateString("es-ES")}
              {blockedSlots.length > 0 && (
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "0.8rem",
                    color: "#6b7280",
                    marginLeft: "0.5rem",
                  }}
                >
                  ({timeSlots.length - blockedSlots.length} disponibles de{" "}
                  {timeSlots.length})
                </span>
              )}
            </TimeSlotsLabel>
            {loadingSlots ? (
              <p>Cargando horarios...</p>
            ) : (
              <TimeSlotsGrid>
                {timeSlots.map((time) => {
                  const available = isTimeAvailable(time);
                  return (
                    <TimeSlot
                      key={time}
                      onClick={() => available && setSelectedTime(time)}
                      disabled={!available}
                      style={{
                        backgroundColor: available ? "#d1fae5" : "#f3f4f6",
                        color: available ? "#065f46" : "#9ca3af",
                        border:
                          selectedTime === time
                            ? "2px solid #059669"
                            : "1px solid #e5e7eb",
                        cursor: available ? "pointer" : "not-allowed",
                      }}
                    >
                      {time}
                    </TimeSlot>
                  );
                })}
              </TimeSlotsGrid>
            )}
          </TimeSlotsContainer>
        )}

        <MotivoInput
          placeholder="Motivo del reagendado (opcional)"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <ButtonContainer>
          <CancelButton onClick={onClose} disabled={isRescheduling}>
            Cancelar
          </CancelButton>
          <ConfirmButton
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime || isRescheduling}
          >
            {isRescheduling ? "Reagendando..." : "Confirmar"}
          </ConfirmButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
}
