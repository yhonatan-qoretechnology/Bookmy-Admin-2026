import { useState, type ChangeEvent } from "react";
import styled from "styled-components";

enum PaymentMethod {
  CARD = "CARD",
  CASH = "CASH",
}

interface BookingData {
  date: Date | null;
  time: string | null;
  serviceId?: string;
  serviceName?: string;
  price?: string;
  duration?: number;
  specialistId?: string;
  specialistName?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
}

interface CustomerData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

interface AddReservationConfirmProps {
  bookingData: BookingData;
  onBack: () => void;
  onConfirm: (customerData: CustomerData) => void;
  user?: User | null;
}

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  text-align: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 2rem;
`;

// --- FORMULARIO CLIENTE ---
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  row-gap: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textLight};
`;

const StyledInput = styled.input`
  padding: 0.8rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    background-color: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ReserveButton = styled.button`
  background-color: #66cdaa;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  height: 46px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

// --- SECCIÓN CONFIRMACIÓN ---
const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 3rem 0;
`;

const ConfirmationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  row-gap: 1.5rem;
  text-align: left;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReadOnlyInput = styled(StyledInput)`
  background-color: white;
  border: 1px solid #e5e7eb;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const PriceInput = styled(ReadOnlyInput)`
  font-weight: 800;
`;

// --- FOOTER ---
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 4rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 2rem;
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
  background-color: #66cdaa;
  color: white;
  border: none;
`;

const PaymentSection = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const CardDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  background: white;
  width: min(520px, 92vw);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
`;

const ModalText = styled.p`
  margin: 0.75rem 0 0 0;
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

interface ReservationDetails {
  cliente: string;
  servicio: string;
  duracion: string;
  precio: string;
  fecha: string;
  hora: string;
}

export function AddReservationConfirm({
  bookingData,
  onBack,
  onConfirm,
  user,
}: AddReservationConfirmProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCreatedReservation, setLastCreatedReservation] =
    useState<ReservationDetails | null>(null);
  const [lastPayload, setLastPayload] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const [formData, setFormData] = useState({
    nombre: user ? user.name.split(" ")[0] || "" : "",
    apellido: user ? user.name.split(" ").slice(1).join(" ") || "" : "",
    email: user ? user.email : "",
    telefono: user ? user.phone || "" : "",
  });

  const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Formatear fecha para mostrar
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const submitReservation = async () => {
    if (!formData.nombre || !formData.email) {
      alert("Por favor completa la información del cliente");
      return;
    }

    if (
      paymentMethod === PaymentMethod.CARD &&
      (!cardData.number || !cardData.expiry || !cardData.cvv)
    ) {
      alert("Por favor completa los datos de la tarjeta");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Preparar fechas para el backend
      const baseDate = bookingData.date || new Date();
      const timeStr = bookingData.time || "09:00am";
      const durationMinutes =
        typeof bookingData.duration === "number" && bookingData.duration > 0
          ? bookingData.duration
          : 30;

      const appointmentDate = new Date(baseDate);
      appointmentDate.setHours(0, 0, 0, 0);

      // Convertir "08:30am" a horas y minutos
      const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
      let hours = 9;
      let minutes = 0;
      if (match) {
        hours = parseInt(match[1]);
        minutes = parseInt(match[2]);
        const ampm = match[3].toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
      }

      const horaInicio = new Date(baseDate);
      horaInicio.setHours(hours, minutes, 0, 0);

      const horaFin = new Date(horaInicio);
      horaFin.setMinutes(horaFin.getMinutes() + durationMinutes);

      // 2. Obtener sedeId de localStorage si no viene en bookingData
      let finalSedeId = 1;
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          finalSedeId = parsed.AdminProfile?.sedeId || 1;
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }

      // 3. Limpiar precio (remover €)
      const numericPrice = parseFloat(
        bookingData.price?.replace(/[^0-9.]/g, "") || "0",
      );

      const defaultNotes = "Reserva creada desde el panel de administración";

      const payload: Record<string, unknown> = {
        fecha: appointmentDate.toISOString(),
        horaInicio: horaInicio.toISOString(),
        horaFin: horaFin.toISOString(),
        duracion: durationMinutes,
        estado: "PENDING",
        notas: defaultNotes,
        sedeId: finalSedeId,
        serviceId: parseInt(bookingData.serviceId || "0"),
        profesionalId: parseInt(bookingData.specialistId || "0"),
        userId: parseInt(user?.id || "0"),
        paymentMethod: paymentMethod,
        paymentAmount: numericPrice,
        cardNumber:
          paymentMethod === PaymentMethod.CARD ? cardData.number : undefined,
        expiryDate:
          paymentMethod === PaymentMethod.CARD ? cardData.expiry : undefined,
        cvv: paymentMethod === PaymentMethod.CARD ? cardData.cvv : undefined,
      };

      setLastPayload(payload);

      console.log("Enviando reserva:", payload);

      const response = await fetch(
        "https://web-3o8dd5nhjvbs.up-de-fra1-k8s-1.apps.run-on-seenode.com/appointments",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message =
          typeof errorData?.message === "string"
            ? errorData.message
            : "Error al crear la reserva";
        throw new Error(message);
      }

      console.log("bookingData al crear reserva:", bookingData);
      const reservationData = {
        cliente:
          `${formData.nombre || ""} ${formData.apellido || ""}`.trim() ||
          "No especificado",
        servicio: bookingData.serviceName || "No especificado",
        duracion: bookingData.duration
          ? `${bookingData.duration} min`
          : "No especificada",
        precio: bookingData.price || "No especificado",
        fecha: bookingData.date
          ? bookingData.date.toLocaleDateString("es-ES")
          : "No especificada",
        hora: bookingData.time || "No especificada",
      };

      console.log("Datos de la reserva para el modal:", reservationData);
      setLastCreatedReservation(reservationData);

      setShowSuccessModal(true);
      onConfirm(formData);
    } catch (error: Error | unknown) {
      console.error("Error en handleFinalConfirm:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      const debugResumen = {
        fecha: bookingData.date ? bookingData.date.toISOString() : null,
        hora: bookingData.time,
        duracion: bookingData.duration,
        serviceId: bookingData.serviceId,
        serviceName: bookingData.serviceName,
        specialistId: bookingData.specialistId,
        specialistName: bookingData.specialistName,
        userId: user?.id,
        userEmail: user?.email,
        sedeId: (lastPayload as unknown as { sedeId?: number })?.sedeId,
        payload: lastPayload,
      };

      alert(
        `Error: ${errorMessage}\n\nDetalle de la reserva:\n${JSON.stringify(debugResumen, null, 2)}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenConfirmModal = () => {
    if (!formData.nombre || !formData.email) {
      alert("Por favor completa la información del cliente");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmModalAccept = async () => {
    setIsConfirmModalOpen(false);
    await submitReservation();
  };

  return (
    <>
      <Container>
        {isConfirmModalOpen && (
          <ModalOverlay
            onClick={() => {
              if (!isSubmitting) setIsConfirmModalOpen(false);
            }}
          >
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Confirmar reserva</ModalTitle>
              <ModalText>
                <strong>Detalles de la reserva:</strong>
                <br />
                Cliente: {formData.nombre} {formData.apellido}
                <br />
                Servicio: {bookingData.serviceName || "No especificado"}
                <br />
                Duración:{" "}
                {bookingData.duration
                  ? `${bookingData.duration} min`
                  : "No especificada"}
                <br />
                Precio: {bookingData.price || "No especificado"}
                <br />
                Fecha:{" "}
                {bookingData.date
                  ? bookingData.date.toLocaleDateString("es-ES")
                  : "No especificada"}
                <br />
                Hora: {bookingData.time || "No especificada"}
              </ModalText>
              <ModalActions>
                <BackButton
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </BackButton>
                <NextButton
                  type="button"
                  onClick={handleConfirmModalAccept}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : "Confirmar"}
                </NextButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}

        <SectionTitle>Información cliente</SectionTitle>

        <FormGrid>
          <InputGroup>
            <Label>Nombre</Label>
            <StyledInput
              name="nombre"
              placeholder="Nombre cliente"
              value={formData.nombre}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Apellido</Label>
            <StyledInput
              name="apellido"
              placeholder="Apellido del cliente"
              value={formData.apellido}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Email</Label>
            <StyledInput
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Teléfono</Label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <StyledInput
                name="telefono"
                placeholder="+34"
                value={formData.telefono}
                onChange={handleChange}
              />
              <ReserveButton
                type="button"
                onClick={handleOpenConfirmModal}
                disabled={isSubmitting}
              >
                Realizar reserva
              </ReserveButton>
            </div>
          </InputGroup>
        </FormGrid>

        <Divider />

        <div style={{ display: "none" }}>
          <SectionTitle>Método de Pago</SectionTitle>
          <PaymentSection>
            <PaymentOptions>
              <RadioLabel>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.CASH}
                  checked={paymentMethod === PaymentMethod.CASH}
                  onChange={() => setPaymentMethod(PaymentMethod.CASH)}
                />
                Efectivo
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.CARD}
                  checked={paymentMethod === PaymentMethod.CARD}
                  onChange={() => setPaymentMethod(PaymentMethod.CARD)}
                />
                Tarjeta
              </RadioLabel>
            </PaymentOptions>

            {paymentMethod === PaymentMethod.CARD && (
              <CardDetailsGrid>
                <InputGroup>
                  <Label>Número de tarjeta</Label>
                  <StyledInput
                    name="number"
                    placeholder="4242 4242 4242 4242"
                    value={cardData.number}
                    onChange={handleCardChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Expira (MM/YY)</Label>
                  <StyledInput
                    name="expiry"
                    placeholder="12/26"
                    value={cardData.expiry}
                    onChange={handleCardChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>CVV</Label>
                  <StyledInput
                    name="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                  />
                </InputGroup>
              </CardDetailsGrid>
            )}
          </PaymentSection>
        </div>

        <Divider />

        <SectionTitle>Confirmar información</SectionTitle>

        <ConfirmationGrid>
          <StyledInput
            readOnly
            value={`Fecha: ${formatDate(bookingData.date)}`}
          />
          <StyledInput
            readOnly
            value={`Cliente: ${formData.nombre} ${formData.apellido}`}
            placeholder="Cliente: Ana Rosa"
          />

          <StyledInput readOnly value={`Hora: ${bookingData.time}`} />
          <StyledInput
            readOnly
            value={`Teléfono: ${formData.telefono}`}
            placeholder="Teléfono: +34 4555454"
          />

          <StyledInput
            readOnly
            value={`Servicio: ${bookingData.serviceName || "Manicura semipermanente SPA"}`}
          />
          <StyledInput
            readOnly
            value={`Email: ${formData.email}`}
            placeholder="Email: correo@gmail.com"
          />

          <PriceInput
            readOnly
            value={`Precio: ${bookingData.price || "21.00€"}`}
          />
        </ConfirmationGrid>

        <Footer>
          <BackButton onClick={onBack} disabled={isSubmitting}>
            Regresar
          </BackButton>
          <NextButton onClick={handleOpenConfirmModal} disabled={isSubmitting}>
            {isSubmitting ? "Procesando..." : "Realizar reserva"}
          </NextButton>
        </Footer>
      </Container>

      {showSuccessModal && lastCreatedReservation && (
        <ModalOverlay onClick={() => setShowSuccessModal(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Reserva creada con éxito</ModalTitle>
            <ModalText>
              <strong>Detalles de la reserva:</strong>
            </ModalText>
            <ModalText>
              <br />
              <strong>Cliente:</strong> {lastCreatedReservation.cliente}
              <br />
              <strong>Servicio:</strong> {lastCreatedReservation.servicio}
              <br />
              <strong>Duración:</strong> {lastCreatedReservation.duracion}
              <br />
              <strong>Precio:</strong> {lastCreatedReservation.precio}
              <br />
              <strong>Fecha:</strong> {lastCreatedReservation.fecha}
              <br />
              <strong>Hora:</strong> {lastCreatedReservation.hora}
            </ModalText>
            <ModalActions>
              <NextButton onClick={() => setShowSuccessModal(false)}>
                Aceptar
              </NextButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </>
  );
}
