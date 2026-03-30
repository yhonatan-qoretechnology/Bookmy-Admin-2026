import { useEffect, useState } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import {
  ProfesionalesApiClient,
  type Profesional,
} from "../../api/clients/ProfesionalesApiClient";

const httpClient = new FetchHttpClient();
const profesionalesApiClient = new ProfesionalesApiClient(httpClient);

const uploadsBaseUrl = (() => {
  const env = (import.meta.env as { VITE_API_BASE_URL_IMG?: string })
    .VITE_API_BASE_URL_IMG;
  if (env) return env.replace(/\/$/, "");
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  const host = apiBase ? apiBase.replace(/\/api$/, "") : "";
  if (host.includes("localhost")) return host;
  return "https://bookmy.es";
})();

const Container = styled.section`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
`;

const BackButton = styled.button`
  background: white;
  color: ${({ theme }) => theme.text};
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const Cover = styled.div<{ $imageUrl: string | null }>`
  width: 100%;
  height: 140px;
  background-image: url(${({ $imageUrl }) => $imageUrl || "none"});
  background-size: cover;
  background-position: center;
  background-color: #e5e7eb;
  ${({ $imageUrl }) =>
    !$imageUrl &&
    `
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%239ca3af' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  `}
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.75rem;

  div {
    margin-bottom: 0.25rem;
  }
`;

const ServiciosCount = styled.span`
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.textLight};
  font-size: 1rem;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

interface Props {
  sedeId: number;
  sedeNombre: string;
  onBack: () => void;
}

export function SedeProfesionalesModule({ sedeId, sedeNombre, onBack }: Props) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const response =
          await profesionalesApiClient.getProfesionalesBySede(sedeId);
        setProfesionales(response.data ?? []);
      } catch (error) {
        console.error("Error fetching profesionales:", error);
        setProfesionales([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfesionales();
  }, [sedeId]);

  return (
    <Container>
      <Header>
        <TitleBlock>
          <Title>Profesionales</Title>
          <Subtitle>{sedeNombre}</Subtitle>
        </TitleBlock>
        <BackButton type="button" onClick={onBack}>
          Volver
        </BackButton>
      </Header>

      {isLoading ? (
        <LoadingText>Cargando profesionales...</LoadingText>
      ) : profesionales.length === 0 ? (
        <EmptyState>No hay profesionales en esta sede</EmptyState>
      ) : (
        <Grid>
          {profesionales.map((prof) => {
            const imageUrl = prof.imagen
              ? prof.imagen.startsWith("http")
                ? prof.imagen
                : `${uploadsBaseUrl}/${prof.imagen.replace(/^\//, "")}`
              : null;
            return (
              <Card key={prof.id}>
                <Cover $imageUrl={imageUrl} />
                <CardBody>
                  <CardTitle>{prof.nombre}</CardTitle>
                  <Meta>
                    <div>{prof.telefono}</div>
                    {prof.biografia && <div>{prof.biografia}</div>}
                  </Meta>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    <ServiciosCount>
                      {prof.servicios.length} servicio(s)
                    </ServiciosCount>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
