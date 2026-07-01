import React, { useState } from "react";
import styled from "styled-components";

import Ingresos from "../../assets/icons/ingresos.svg";
import Reservas from "../../assets/icons/reservas.svg";
import Clientes from "../../assets/icons/clientes.svg";
import ServicioTop from "../../assets/icons/servicio-top.svg";

import pdfIcon from "../../assets/icons/pdf-download.svg";
import viewIcon from "../../assets/icons/download.svg";
import imgIcon from "../../assets/icons/imgIcon.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContentCard = styled.div<{ $fullHeight?: boolean }>`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  min-height: ${({ $fullHeight }) => ($fullHeight ? "75vh" : "auto")};
  display: flex;
  flex-direction: column;
`;

const GridTop = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
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
  color: #111827;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardValue = styled.div`
  color: #6b7280;
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

const ProgressBarFill = styled.div<{ $width: string; $color: string }>`
  height: 100%;
  width: ${(props) => props.$width};
  background-color: ${(props) => props.$color};
  border-radius: 5px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  .btn-link {
    color: #70c1a6;
    background: none;
    border: none;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    padding: 0;
    &:hover { text-decoration: underline; }
  }

  .btn-agregar {
    color: #f59e0b;
    background: none;
    border: none;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    padding: 0;
    &:hover { opacity: 0.8; }
  }
`;

const TableWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow-x: auto;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem 1.5rem;
  color: #111827;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
`;

const Td = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
  color: #4b5563;
`;

const GastoTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  .gasto-main { font-weight: 600; color: #111827; }
  .gasto-sub { font-size: 0.8rem; color: #9ca3af; }
`;

const ActionIconsGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  img, svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 0.8;
    &:hover { transform: scale(1.15); opacity: 1; }
  }
`;

const FormTitle = styled.h3`
  color: #70c1a6;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .force-col-2, .force-col-3 { grid-column-start: 1 !important; }
  }
`;

const FormInput = styled.input`
  background-color: #f3f4f6;
  border: none;
  padding: 0.9rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  &::placeholder { color: #9ca3af; font-weight: 500; }
`;

const FormSelect = styled.select`
  background-color: #f3f4f6;
  border: none;
  padding: 0.9rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 500;
  width: 100%;
  outline: none;
  cursor: pointer;
`;

const FileUploadBox = styled.label`
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  grid-column-start: 2; 

  span { color: #9ca3af; font-weight: 500; font-size: 0.95rem; }
  input[type="file"] { display: none; }
`;

const SaveButton = styled.button`
  background-color: #70c1a6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  grid-column-start: 3; 
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#70C1A6" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const ReceiptIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const MOCK_EXPENSES = [
  { id: 1, main: "Manicura", sub: "Esmalte - limas", cat: "Insumos - Materiales", prov: "Chino, avenida azahara", date: "12/07/2026", total: "€25" },
  { id: 2, main: "Cafe", sub: "Sobres instantaneos", cat: "Alimentación", prov: "Mercadona", date: "12/07/2026", total: "€15" },
  { id: 3, main: "Insumos basicos", sub: "Servilletas, Vasos des.", cat: "Provisiones", prov: "Lider", date: "12/07/2026", total: "€23" },
  { id: 4, main: "Depilación", sub: "Kit de pestañas", cat: "Insumos - Materiales", prov: "Manicura Semipermanente SPA", date: "12/07/2026", total: "€25" },
];

export function GastosView() {
  const [viewMode, setViewMode] = useState<"resumen" | "todos" | "crear">("resumen");

  const [formData, setFormData] = useState({
    gasto: "", categoria: "Categoría", proveedor: "",
    fecha: "Fecha", estado: "", total: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Gasto registrado exitosamente!");
    setViewMode("resumen"); 
  };

  if (viewMode === "crear") {
    return (
      <ContentCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <FormTitle>Agregar nuevo gasto</FormTitle>
          
        </div>

        <form onSubmit={handleFormSubmit}>
          <FormGrid>
            <FormInput placeholder="Gasto" required value={formData.gasto} onChange={e => setFormData({...formData, gasto: e.target.value})} />
            <FormSelect value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
              <option disabled>Categoría</option>
              <option>Insumos - Materiales</option>
              <option>Alimentación</option>
              <option>Provisiones</option>
            </FormSelect>
            <FormInput placeholder="Proveedor" required value={formData.proveedor} onChange={e => setFormData({...formData, proveedor: e.target.value})} />

            <FormSelect value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})}>
              <option disabled>Fecha</option>
              <option>12/07/2026</option>
              <option>13/07/2026</option>
            </FormSelect>
            <FormInput placeholder="Estado" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})} />
            <FormInput placeholder="Total" required value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} />

            <FileUploadBox className="force-col-2">
              <span>Adjuntar imagen</span>
              <img src={imgIcon} alt="Imagen" />
              <input type="file" />
            </FileUploadBox>

            <SaveButton type="submit" className="force-col-3">Guardar</SaveButton>
          </FormGrid>
        </form>
      </ContentCard>
    );
  }


  if (viewMode === "todos") {
    return (
      <ContentCard $fullHeight>
        <TableHeader>
          <CardTitle>Todos los gastos registrados</CardTitle>
          <HeaderActions>
            <button className="btn-link" onClick={() => setViewMode("resumen")}>
              ← Volver al resumen
            </button>
            <button className="btn-agregar" onClick={() => setViewMode("crear")}>
              Agregar nuevo
            </button>
          </HeaderActions>
        </TableHeader>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Gasto</Th><Th>Categoria</Th><Th>Proveedor</Th><Th>Fecha</Th><Th>Estado</Th><Th>Total</Th><Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EXPENSES.concat(MOCK_EXPENSES).map((item, idx) => (
                <tr key={idx}>
                  <Td>
                    <GastoTextGroup>
                      <span className="gasto-main">{item.main}</span>
                      <span className="gasto-sub">{item.sub}</span>
                    </GastoTextGroup>
                  </Td>
                  <Td>{item.cat}</Td><Td>{item.prov}</Td><Td>{item.date}</Td>
                  <Td><span style={{ color: "#70c1a6", fontWeight: 500 }}>Pagado</span></Td>
                  <Td style={{ fontWeight: "600", color: "#111827" }}>{item.total}</Td>
                  <Td>
                    <ActionIconsGroup>
                      <img src={pdfIcon} alt="PDF" />
                      <img src={viewIcon} alt="Ver" />
                      <img src={imgIcon} alt="Imagen" />
                    </ActionIconsGroup>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </ContentCard>
    );
  }

 
  return (
    <Container>
      <GridTop>
        <SummaryCard>
          <CardHeader>€1.800 <img src={Ingresos} alt="Icono" width="24" /></CardHeader>
          <CardValue>Gastos totales</CardValue>
          <ProgressBarContainer><ProgressBarFill $width="67%" $color="#775DA6" /></ProgressBarContainer>
          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>67%</span>
        </SummaryCard>

        <SummaryCard>
          <CardHeader>€456 <img src={Reservas} alt="Icono" width="24" /></CardHeader>
          <CardValue>Gastos del último mes</CardValue>
          <ProgressBarContainer><ProgressBarFill $width="18%" $color="#F9837C" /></ProgressBarContainer>
          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>18%</span>
        </SummaryCard>

        <SummaryCard>
          <CardHeader>€23 <img src={Clientes} alt="Icono" width="24" /></CardHeader>
          <CardValue>Gasto promedio diario</CardValue>
          <ProgressBarContainer><ProgressBarFill $width="78%" $color="#70B6C1" /></ProgressBarContainer>
          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>78%</span>
        </SummaryCard>

        <SummaryCard>
          <CardHeader style={{ fontSize: "1.1rem", color: "#9CA3AF", fontWeight: 500 }}>
            Categoria Principal <img src={ServicioTop} alt="Icono" width="24" />
          </CardHeader>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Insumos manicura</div>
          <ProgressBarContainer><ProgressBarFill $width="80%" $color="#F3CC5C" /></ProgressBarContainer>
          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>80%</span>
        </SummaryCard>
      </GridTop>

      <ContentCard>
        <TableHeader>
          <CardTitle>Gastos recientes</CardTitle>
          <HeaderActions>
            <button className="btn-link" onClick={() => setViewMode("todos")}>
              Ver todos los gastos
            </button>
            <button className="btn-agregar" onClick={() => setViewMode("crear")}>
              Agregar nuevo
            </button>
          </HeaderActions>
        </TableHeader>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Gasto</Th><Th>Categoria</Th><Th>Proveedor</Th><Th>Fecha</Th><Th>Estado</Th><Th>Total</Th><Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EXPENSES.map((item) => (
                <tr key={item.id}>
                  <Td>
                    <GastoTextGroup>
                      <span className="gasto-main">{item.main}</span>
                      <span className="gasto-sub">{item.sub}</span>
                    </GastoTextGroup>
                  </Td>
                  <Td>{item.cat}</Td><Td>{item.prov}</Td><Td>{item.date}</Td>
                  <Td><span style={{ color: "#70c1a6", fontWeight: 500 }}>Pagado</span></Td>
                  <Td style={{ fontWeight: "600", color: "#111827" }}>{item.total}</Td>
                  <Td>
                    <ActionIconsGroup>
                      <img src={pdfIcon} alt="PDF" />
                      <img src={viewIcon} alt="Ver" />
                      <img src={imgIcon} alt="Imagen" />
                    </ActionIconsGroup>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </ContentCard>
    </Container>
  );
}