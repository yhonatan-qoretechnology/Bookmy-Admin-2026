import React from "react";
import styled from "styled-components";

// Íconos globales del módulo
import pdfIcon from "../../assets/icons/pdf-download.svg";
import downloadIcon from "../../assets/icons/download.svg";
import Ingresos from "../../assets/icons/ingresos.svg";
import Reservas from "../../assets/icons/reservas.svg";
import Clientes from "../../assets/icons/clientes.svg";
import ServicioTop from "../../assets/icons/servicio-top.svg";
import filterIcon from "../../assets/icons/filter.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import chevronDownIcon from "../../assets/icons/chevron-down.svg";
import { Card } from "../common/Card";

interface FacturacionModuleProps {
  subTab: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContentCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
`;

const CardTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SubText = styled.p`
  color: #9ca3af;
  font-size: 0.85rem;
  margin-bottom: 2rem;
`;

const FilterBarContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  width: fit-content;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const FilterSegment = styled.div`
  display: flex;
  align-items: center;
  padding: 0.85rem 1.5rem;
  border-right: 1px solid #f3f4f6;
  gap: 0.75rem;

  &:last-child {
    border-right: none;
    margin-left: auto;
  }
`;

const FilterLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
`;

const FilterSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;

  span {
    color: #6b7280;
    font-weight: 400;
  }

  img {
    width: 12px;
    opacity: 0.7;
  }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0;

  img {
    width: 14px;
    filter: invert(36%) sepia(87%) saturate(1637%) hue-rotate(331deg) brightness(97%) contrast(98%);
  }
`;

const GridTop = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardHeader = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  height: 6px;
  background: #f3f4f6;
  border-radius: 10px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 20px;
  background: #f3f4f6;
  border-radius: 5px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $width: string; $color: string }>`
  height: 100%;
  width: ${(props) => props.$width};
  background-color: ${(props) => props.$color};
  border-radius: 5px;
`;

const GridMiddle = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: 1.5rem;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const DonutChart = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(#775DA6 0% 45%, #FFB1B7 45% 85%, #70B6C1 85% 100%);
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 140px;
    height: 140px;
    background: white;
    border-radius: 50%;
    position: absolute;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
`;

const Dot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

const TotalContainer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TotalLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textLight};
`;

const TotalAmount = styled.span`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const ServiceBarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ServiceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 500;
`;

// --- ESTILOS TABLAS GLOBALES ---
const TableWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.1rem 1.5rem;
  color: #111827;
  font-weight: 600;
  background-color: #fafafa;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
`;

const Td = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
  color: #4b5563;
`;

const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
`;

const Badge = styled.span<{ $type: string }>`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${(props) => {
    if (props.$type === "Pagado") return "#70C1A6";
    if (props.$type === "Pendiente") return "#FDC142";
    return "#FF0000";
  }};
`;

const ActionIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const PlaceholderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  color: #9ca3af;
`;

// --- DATOS INMUTABLES ---
const INVOICES = [
  { id: "1004206F001", client: "Amanda Rojas", service: "Manicura Semipermanente SPA", date: "12/07/2026", status: "Pagado", total: "€25" },
  { id: "1004206F002", client: "Carmenza Lopez", service: "Manicura Semipermanente SPA", date: "12/07/2026", status: "Pendiente", total: "€25" },
  { id: "1004206F003", client: "Emira Nuñez", service: "Manicura Semipermanente SPA", date: "12/07/2026", status: "Vencida", total: "€25" },
  { id: "1004206F004", client: "Camila Suarez", service: "Manicura Semipermanente SPA", date: "12/07/2026", status: "Pagado", total: "€25" },
];

export function FacturacionModule({ subTab }: FacturacionModuleProps) {
  
  // Vista 1: Resumen General / Vista por defecto
  if (subTab === "Resumen" || subTab === "Facturación") {
    return (
      <Container>
        <GridTop>
          <SummaryCard>
            <CardHeader>
              €22,880.50
              <span style={{ display: "flex", alignItems: "center" }}>
                <img src={Ingresos} alt="Ingresos" width="24" height="24" />
              </span>
            </CardHeader>
            <CardValue>Ingresos totales</CardValue>
            <ProgressBarContainer>
              <ProgressBarFill $width="67%" $color="#775DA6" />
            </ProgressBarContainer>
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>67%</span>
          </SummaryCard>

          <SummaryCard>
            <CardHeader>
              1,096
              <span style={{ display: "flex", alignItems: "center" }}>
                <img src={Reservas} alt="Reservas" width="24" height="24" />
              </span>
            </CardHeader>
            <CardValue>Reservas realizadas</CardValue>
            <ProgressBarContainer>
              <ProgressBarFill $width="18%" $color="#F9837C" />
            </ProgressBarContainer>
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>18%</span>
          </SummaryCard>

          <SummaryCard>
            <CardHeader>
              45
              <span style={{ display: "flex", alignItems: "center" }}>
                <img src={Clientes} alt="Clientes" width="24" height="24" />
              </span>
            </CardHeader>
            <CardValue>Clientes nuevos</CardValue>
            <ProgressBarContainer>
              <ProgressBarFill $width="78%" $color="#70B6C1" />
            </ProgressBarContainer>
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>78%</span>
          </SummaryCard>

          <SummaryCard>
            <CardHeader>
              Servicio top
              <span style={{ display: "flex", alignItems: "center" }}>
                <img src={ServicioTop} alt="Servicio Top" width="24" height="24" />
              </span>
            </CardHeader>
            <CardValue>Manicura SPA</CardValue>
            <ProgressBarContainer>
              <ProgressBarFill $width="80%" $color="#F3CC5C" />
            </ProgressBarContainer>
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>80%</span>
          </SummaryCard>
        </GridTop>

        <GridMiddle>
          <ContentCard>
            <CardTitle>Métodos de pago</CardTitle>
            <SubText>Agosto 2026</SubText>
            <DonutChart />
            <Legend>
              <LegendItem><Dot $color="#775DA6" /> Tarjeta VISA</LegendItem>
              <LegendItem><Dot $color="#FFB1B7" /> Establecimiento</LegendItem>
              <LegendItem><Dot $color="#70B6C1" /> Bizum</LegendItem>
            </Legend>
            <TotalContainer>
              <TotalLabel>Total:</TotalLabel>
              <TotalAmount>€2,576</TotalAmount>
            </TotalContainer>
          </ContentCard>

          <ContentCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <CardTitle style={{ margin: 0 }}>Servicios mas reservados</CardTitle>
              <div style={{ background: "#F3F4F6", padding: "0.3rem", borderRadius: "8px", fontSize: "0.8rem" }}>
                <button style={{ border: "none", background: "white", padding: "0.4rem 1rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Semanal</button>
                <button style={{ border: "none", background: "transparent", padding: "0.4rem 1rem", cursor: "pointer" }}>Mensual</button>
              </div>
            </div>

            {[
              { name: "Manicura Semipermanente SPA", val: 34, color: "#70C1A6", w: "80%" },
              { name: "Ruso con semipermanente", val: 20, color: "#9291A5", w: "55%" },
              { name: "Extensiones acrilicas", val: 12, color: "#9291A5", w: "35%" },
              { name: "Depilación con hilo", val: 8, color: "#9291A5", w: "20%" },
            ].map((s, i) => (
              <ServiceBarRow key={i}>
                <ServiceInfo>
                  <span>{s.name}</span>
                  <span style={{ color: s.color }}>{s.val}</span>
                </ServiceInfo>
                <ProgressBar style={{ marginTop: 0 }}>
                  <ProgressBarFill $width={s.w} $color={s.color} />
                </ProgressBar>
              </ServiceBarRow>
            ))}
          </ContentCard>
        </GridMiddle>

        <ContentCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <CardTitle>Facturas recientes</CardTitle>
            <a href="#" style={{ color: "#10B981", fontSize: "0.9rem", fontWeight: "600" }}>Ver todas las facturas</a>
          </div>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>ID Factura</Th>
                  <Th>Cliente</Th>
                  <Th>Servicio</Th>
                  <Th>Fecha</Th>
                  <Th>Estado</Th>
                  <Th>Total</Th>
                  <Th style={{ textAlign: "right" }}>Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, idx) => (
                  <Tr key={idx}>
                    <Td style={{ fontWeight: "600" }}>{inv.id}</Td>
                    <Td>{inv.client}</Td>
                    <Td>{inv.service}</Td>
                    <Td>{inv.date}</Td>
                    <Td><Badge $type={inv.status}>{inv.status}</Badge></Td>
                    <Td style={{ fontWeight: "600" }}>{inv.total}</Td>
                    <Td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end", alignItems: "center" }}>
                        <ActionIcon src={pdfIcon} alt="PDF" />
                        <ActionIcon src={downloadIcon} alt="Download" />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </ContentCard>
      </Container>
    );
  }

  // Vista 2: Facturas de Reservas (Pantalla extendida con filtros segmentados)
  if (subTab === "Facturas de reservas") {
    return (
      <Container>
        <FilterBarContainer>
          <FilterSegment>
            <img src={filterIcon} alt="Filtros" width="20" />
          </FilterSegment>
          <FilterSegment>
            <FilterLabel>Filtrar por</FilterLabel>
          </FilterSegment>
          <FilterSegment>
            <FilterSelect>
              ID Factura
              <img src={chevronDownIcon} alt="Desplegar" />
            </FilterSelect>
          </FilterSegment>
          <FilterSegment>
            <FilterSelect>
              Cliente
              <img src={chevronDownIcon} alt="Desplegar" />
            </FilterSelect>
          </FilterSegment>
          <FilterSegment>
            <FilterSelect>
              Fecha
              <img src={chevronDownIcon} alt="Desplegar" />
            </FilterSelect>
          </FilterSegment>
          <FilterSegment>
            <ResetButton>
              <img src={refreshIcon} alt="Reset" />
              Reset Filter
            </ResetButton>
          </FilterSegment>
        </FilterBarContainer>

        <Card style={{ padding: "1rem" }}>
          <TableWrapper style={{ marginTop: 0 }}>
            <Table>
              <thead>
                <tr>
                  <Th>ID Factura</Th>
                  <Th>Cliente</Th>
                  <Th>Servicio</Th>
                  <Th>Fecha</Th>
                  <Th>Estado</Th>
                  <Th>Total</Th>
                  <Th style={{ textAlign: "center" }}>Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, idx) => (
                  <Tr key={idx}>
                    <Td style={{ color: "#111827", fontWeight: "500" }}>{inv.id}</Td>
                    <Td>{inv.client}</Td>
                    <Td>{inv.service}</Td>
                    <Td>{inv.date}</Td>
                    <Td><Badge $type={inv.status}>{inv.status}</Badge></Td>
                    <Td style={{ color: "#111827", fontWeight: "500" }}>{inv.total}</Td>
                    <Td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
                        <ActionIcon src={pdfIcon} alt="PDF" />
                        <ActionIcon src={downloadIcon} alt="Visualizar" />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      </Container>
    );
  }

  // Vista 3: Compras / Gastos (Módulo a construir en el futuro)
  if (subTab === "Compras / Gastos") {
    return (
      <PlaceholderContainer>
        <ContentCard style={{ width: "100%", textAlign: "center" }}>
          <CardTitle>Módulo de Compras / Gastos</CardTitle>
          <SubText>Próximamente disponible en tu panel de administración.</SubText>
        </ContentCard>
      </PlaceholderContainer>
    );
  }

  return null;
}