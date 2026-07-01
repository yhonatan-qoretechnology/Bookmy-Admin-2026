import React, { useState } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";

import pdfIcon from "../../assets/icons/pdf-download.svg";
import viewIcon from "../../assets/icons/download.svg"; // Placeholder para el ojo de previsualizar
import filterIcon from "../../assets/icons/filter.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import chevronDownIcon from "../../assets/icons/chevron-down.svg";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ViewTitle = styled.h2`
  color: #55c59f;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
`;

const HorizontalLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
`;

const FilterBarContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const FilterSegment = styled.div<{ $isLast?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.85rem 1.5rem;
  border-right: ${({ $isLast }) => ($isLast ? "none" : "1px solid #f3f4f6")};
  gap: 0.75rem;
  margin-left: ${({ $isLast }) => ($isLast ? "auto" : "0")};
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
    filter: invert(36%) sepia(87%) saturate(1637%) hue-rotate(331deg)
      brightness(97%) contrast(98%);
  }
`;

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
`;

const TableWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem 1.5rem;
  color: #111827;
  font-weight: 700;
  background-color: white;
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

const StatusBadge = styled.span<{ $status: string }>`
  font-weight: 500;
  font-size: 0.95rem;
  color: ${(props) => {
    if (props.$status === "Pagado") return "#70C1A6";
    if (props.$status === "Pendiente") return "#FDC142";
    return "#EF4444"; 
  }};
`;

const ActionIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  opacity: 0.8;

  &:hover {
    transform: scale(1.15);
    opacity: 1;
  }
`;

const RESERVATION_INVOICES = [
  {
    id: "1004206F001",
    client: "Amanda Rojas",
    service: "Manicura Semipermanente SPA",
    date: "12/07/2026",
    status: "Pagado",
    total: "€25",
  },
  {
    id: "1004206F002",
    client: "Carmenza Lopez",
    service: "Manicura Semipermanente SPA",
    date: "12/07/2026",
    status: "Pendiente",
    total: "€25",
  },
  {
    id: "1004206F003",
    client: "Emira Nuñez",
    service: "Manicura Semipermanente SPA",
    date: "12/07/2026",
    status: "Vencida",
    total: "€25",
  },
  {
    id: "1004206F004",
    client: "Camila Suarez",
    service: "Manicura Semipermanente SPA",
    date: "12/07/2026",
    status: "Pagado",
    total: "€25",
  },
];

export function FacturasReservasView() {
  const handleDownloadInvoicePDF = (
    invoice: (typeof RESERVATION_INVOICES)[0],
  ) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("BOOKMY - FACTURA DE RESERVA", 20, 25);

    doc.setFontSize(12);
    doc.text(`Factura No: ${invoice.id}`, 20, 40);

    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${invoice.client}`, 20, 50);
    doc.text(`Servicio: ${invoice.service}`, 20, 60);
    doc.text(`Fecha de emisión: ${invoice.date}`, 20, 70);
    doc.text(`Estado actual: `, 20, 80);

    doc.setFont("helvetica", "bold");
    doc.text(`${invoice.status.toUpperCase()}`, 50, 80);

    doc.line(20, 90, 190, 90);

    doc.setFontSize(14);
    doc.text(`Total abonado:`, 130, 105);
    doc.text(`${invoice.total}`, 165, 105);

    doc.save(`Factura_Reserva_${invoice.id}.pdf`);
  };

  return (
    <div>
      <HeaderContainer>
        <ViewTitle>Facturas de reservas realizadas</ViewTitle>
        <HorizontalLine />
      </HeaderContainer>

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
        <FilterSegment $isLast>
          <ResetButton onClick={() => alert("Filtros reiniciados")}>
            <img src={refreshIcon} alt="Reset" />
            Reset Filter
          </ResetButton>
        </FilterSegment>
      </FilterBarContainer>

      <CardContainer>
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
                <Th style={{ textAlign: "center" }}>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {RESERVATION_INVOICES.map((inv) => (
                <Tr key={inv.id}>
                  <Td style={{ fontWeight: "600", color: "#111827" }}>
                    {inv.id}
                  </Td>
                  <Td>{inv.client}</Td>
                  <Td>{inv.service}</Td>
                  <Td>{inv.date}</Td>
                  <Td>
                    <StatusBadge $status={inv.status}>{inv.status}</StatusBadge>
                  </Td>
                  <Td style={{ fontWeight: "600", color: "#111827" }}>
                    {inv.total}
                  </Td>
                  <Td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "1.2rem",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ActionIcon
                        src={pdfIcon}
                        alt="Descargar PDF"
                        title="Descargar factura en PDF"
                        onClick={() => handleDownloadInvoicePDF(inv)}
                      />
                      <ActionIcon
                        src={viewIcon}
                        alt="Ver detalle"
                        title="Previsualizar factura"
                        onClick={() =>
                          alert(
                            `Previsualizando factura ${inv.id} de ${inv.client}`,
                          )
                        }
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </CardContainer>
    </div>
  );
}
