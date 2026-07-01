import { useState } from "react";
import styled from "styled-components";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";
import { TimeToggle } from "../common/TimeToggle";
import html2pdf from "html2pdf.js";
import { EmailApiClient } from "../../api/clients/EmailApiClient";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";

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
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  onStatusChange?: (id: number, status: string) => void;
}

const Container = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  overflow: auto;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HoyText = styled.span`
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #4b5563;
  }
`;

const DateTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthYearText = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  min-width: 200px;
  text-align: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.85rem;
  color: #4b5563;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;

  &:nth-child(7n) {
    border-right: none;
  }
`;

const DayCell = styled.div<{ $isOtherMonth?: boolean }>`
  min-height: 120px;
  padding: 0.5rem;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  background: ${({ $isOtherMonth }) =>
    $isOtherMonth
      ? `repeating-linear-gradient(
          -45deg,
          #ffffff,
          #ffffff 10px,
          #eef8f4 10px,
          #eef8f4 11px
        )`
      : "#ffffff"};

  &:nth-child(7n) {
    border-right: none;
  }

  &:nth-last-child(-n + 7) {
    border-bottom: none;
  }
`;

const DayNumber = styled.span<{ $isOtherMonth?: boolean }>`
  display: block;
  text-align: right;
  font-size: 1rem;
  color: ${({ $isOtherMonth }) => ($isOtherMonth ? "#9ca3af" : "#111827")};
  margin-bottom: 0.5rem;
  padding-right: 0.2rem;
`;

const EventBadge = styled.div<{ status?: string }>`
  background-color: ${({ status }) =>
    status === "CANCELLED"
      ? "#fee2e2"
      : status === "COMPLETED"
        ? "#dcfce7"
        : "#eef8f4"}; 
  border-left: 3px solid
    ${({ status }) =>
      status === "CANCELLED"
        ? "#ef4444"
        : status === "COMPLETED"
          ? "#22c55e"
          : "#70c1a6"}; 
  padding: 0.4rem 0.5rem;
  font-size: 0.7rem;
  color: #374151;
  margin-bottom: 4px;
  cursor: pointer;
  line-height: 1.3;
  display: flex;
  flex-direction: column;

  &:hover {
    opacity: 0.8;
  }

  strong {
    color: #111827;
  }
`;

// --- ESTILOS DE MODALES (Intactos de tu código) ---
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

const PdfModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PdfModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 60%;
  height: 85%;
  display: flex;
  flex-direction: column;
`;

const PdfModalHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PdfModalBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: 1rem;
`;

const PrintButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
  }
`;

const EditableStatusSelect = styled.select<{ status: string }>`
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  outline: none;
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

const ReceiptButton = styled.button<{ $secondary?: boolean }>`
  flex: 1;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ $secondary }) => ($secondary ? "#cbd5e1" : "#22c55e")};
  background-color: ${({ $secondary }) => ($secondary ? "white" : "#22c55e")};
  color: ${({ $secondary }) => ($secondary ? "#334155" : "white")};
  &:hover {
    opacity: 0.9;
  }
`;

const httpClient = new FetchHttpClient();
const emailApiClient = new EmailApiClient(httpClient);

const DAYS_HEADER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// --- FUNCIONES LOGICAS ---
function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();
  const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - i),
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
  }
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHour(dateString: string): string {
  const timePart = dateString.split("T")[1];
  if (!timePart) return "";
  const [hours, minutes] = timePart.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${minutes} ${ampm}`;
}

function translatePaymentMethod(method?: string): string {
  const normalized = (method || "").toString().toUpperCase();
  if (normalized === "CASH") return "Efectivo";
  if (normalized === "CARD") return "Tarjeta";
  if (normalized === "TRANSFER") return "Transferencia";
  return method
    ? method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
    : "Sin método";
}

function translatePaymentStatus(status?: string): string {
  const normalized = (status || "").toString().toUpperCase();
  if (normalized === "PAID") return "Pagado";
  if (normalized === "PENDING") return "Pendiente";
  return status || "Sin estado";
}

export function CalendarWidget({
  appointments = [],
  onDateSelect,
  onStatusChange,
}: CalendarWidgetProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedAppointment, setSelectedAppointment] =
    useState<CalendarAppointment | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfHtml, setPdfHtml] = useState("");

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
    return appointments.filter((apt) => apt.fecha.split("T")[0] === dateStr);
  };

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <Container>
      <Header>
        <HoyText onClick={goToToday}>Hoy</HoyText>

        <DateTitle>
          <IconButton onClick={goToPrevMonth}>
            <img src={chevronLeft} alt="Anterior" />
          </IconButton>
          <MonthYearText>
            {monthNames[month]} {year}
          </MonthYearText>
          <IconButton onClick={goToNextMonth}>
            <img src={chevronRight} alt="Siguiente" />
          </IconButton>
        </DateTitle>

        <TimeToggle
          onChange={(valor) => console.log("El usuario eligió:", valor)}
        />
      </Header>

      <CalendarGrid>
        {DAYS_HEADER.map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {days.map((data, index) => {
          const dayAppointments = getAppointmentsForDay(data.date);
          const isOtherMonth = !data.isCurrentMonth;

          return (
            <DayCell
              key={index}
              $isOtherMonth={isOtherMonth}
              onClick={() => onDateSelect?.(data.date)}
              style={{ cursor: onDateSelect ? "pointer" : "default" }}
            >
              <DayNumber $isOtherMonth={isOtherMonth}>{data.day}</DayNumber>

              {dayAppointments.slice(0, 3).map((apt) => (
                <EventBadge
                  key={apt.id}
                  status={apt.estado}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAppointment(apt);
                  }}
                >
                  <strong>Reserva</strong>
                  <span>{apt.service.nombre}</span>
                  <span>{formatHour(apt.horaInicio)}</span>
                  <span>{apt.user.nombre || apt.user.email || "Cliente"}</span>
                </EventBadge>
              ))}

              {dayAppointments.length > 3 && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#6b7280",
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  +{dayAppointments.length - 3} más
                </div>
              )}
            </DayCell>
          );
        })}
      </CalendarGrid>

      {/* --- MODAL DE DETALLE DE CITA --- */}
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
              <EditableStatusSelect
                status={selectedAppointment.estado}
                value={selectedAppointment.estado}
                onChange={(e) => {
                  const nextStatus = e.target.value;
                  setSelectedAppointment({
                    ...selectedAppointment,
                    estado: nextStatus,
                  });
                  if (onStatusChange)
                    onStatusChange(selectedAppointment.id, nextStatus);
                }}
              >
                <option value="PENDING">Pendiente</option>
                <option value="COMPLETED">Finalizado</option>
                <option value="CANCELLED">Cancelado</option>
              </EditableStatusSelect>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Fecha</DetailLabel>
              <DetailValue>
                {new Date(selectedAppointment.fecha).toLocaleDateString(
                  "es-ES",
                  { day: "2-digit", month: "2-digit", year: "numeric" },
                )}
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
              <DetailValue>
                {selectedAppointment.user.nombre || "No disponible"}
              </DetailValue>
            </DetailRow>

            {selectedAppointment.payment && (
              <>
                <DetailRow>
                  <DetailLabel>Total</DetailLabel>
                  <DetailValue>
                    {selectedAppointment.payment.totalAmount} EUR
                  </DetailValue>
                </DetailRow>
                <DetailRow
                  style={{
                    flexDirection: "column",
                    gap: "0.5rem",
                    borderBottom: "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <ReceiptButton
                      onClick={() => {
                        // Lógica para generar recibo y abrir WhatsApp
                        const mensaje = encodeURIComponent(
                          `¡Hola! Aquí tienes el recibo de tu cita de ${selectedAppointment.service.nombre} el día ${new Date(selectedAppointment.fecha).toLocaleDateString()} a las ${formatHour(selectedAppointment.horaInicio)}. Total: ${selectedAppointment.payment?.totalAmount || 0} EUR.`,
                        );
                        const telefono =
                          selectedAppointment.user.telefono || "";
                        window.open(
                          `https://wa.me/${telefono}?text=${mensaje}`,
                          "_blank",
                        );
                      }}
                    >
                      📄 Enviar WhatsApp
                    </ReceiptButton>
                    <ReceiptButton
                      $secondary
                      onClick={() => {
                        // Lógica para enviar por correo (puedes vincularlo a tu API)
                        alert(
                          `Enviando recibo al correo: ${selectedAppointment.user.email}`,
                        );
                        // Si tienes una función en las props: onSendEmail?.(selectedAppointment.id);
                      }}
                    >
                      ✉️ Enviar Correo
                    </ReceiptButton>

                    <ReceiptButton
                      onClick={async () => {
                        if (!selectedAppointment) return;

                        try {
                          const response = await fetch(
                            "/src/components/layout/sendPdf/invoiceTemplate.html",
                          );
                          const invoiceTemplate = await response.text();

                          const clientName = selectedAppointment.user.nombre;
                          const sede =
                            selectedAppointment.sede?.nombre || "N/A";
                          const invoiceNumber = `INV-${selectedAppointment.id}`;
                          const date = new Date(
                            selectedAppointment.fecha,
                          ).toLocaleDateString("es-ES");
                          const total =
                            selectedAppointment.payment?.totalAmount || 0;
                          const subtotal = total;

                          const serviceHtml = `
                            <div class='table-row'>
                              <div>${selectedAppointment.service.nombre}</div>
                              <div>1</div>
                              <div>€${total.toFixed(2)}</div>
                              <div>€${total.toFixed(2)}</div>
                            </div>
                          `;

                          let html = invoiceTemplate
                            .replace("{{clientName}}", clientName)
                            .replace("{{sede}}", sede)
                            .replace("{{invoiceNumber}}", invoiceNumber)
                            .replace("{{date}}", date)
                            .replace("{{services}}", serviceHtml)
                            .replace("{{subtotal}}", subtotal.toFixed(2))
                            .replace("{{total}}", total.toFixed(2));

                          setPdfHtml(html);
                          setShowPdfModal(true);
                        } catch (error) {
                          console.error("Error cargando template:", error);
                          alert("Error al generar PDF");
                        }
                      }}
                    >
                      📄 PDF
                    </ReceiptButton>
                  </div>
                </DetailRow>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
