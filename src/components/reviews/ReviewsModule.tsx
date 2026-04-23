import { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import {
  ReviewsApiClient,
  type Review,
} from "../../api/clients/ReviewsApiClient";
import { SedesApiClient, type Sede } from "../../api/clients/SedesApiClient";
import { TableSearchFilter } from "../common/TableSearchFilter";

const httpClient = new FetchHttpClient();
const reviewsApi = new ReviewsApiClient(httpClient);
const sedesApi = new SedesApiClient(httpClient);

const Container = styled.div`
  padding: 1.5rem;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  vertical-align: top;

  &:last-child {
    min-width: 140px;
    white-space: nowrap;
  }
`;

const Button = styled.button<{ $variant?: "approve" | "reject" }>`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $variant, theme }) =>
    $variant === "approve"
      ? "#10b981"
      : $variant === "reject"
        ? "#ef4444"
        : theme.primary};
  color: white;
  margin-right: 0.5rem;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  @media (max-width: 640px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
`;

const StatusBadge = styled.span<{ $approved: boolean }>`
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: ${({ $approved }) => ($approved ? "#10b981" : "#f59e0b")};
  white-space: nowrap;
`;

interface Props {
  // Si quieres filtrar por sede, pasa el id; si no, carga todas (o ajusta el API client)
  sedeId?: number;
}

export function ReviewsModule({ sedeId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = useMemo(() => {
    if (!searchTerm) return reviews;
    const lower = searchTerm.toLowerCase();
    return reviews.filter(
      (r) =>
        r.comentario?.toLowerCase().includes(lower) ||
        r.usuario?.nombre?.toLowerCase().includes(lower) ||
        r.usuario?.email?.toLowerCase().includes(lower) ||
        r.servicio?.nombre?.toLowerCase().includes(lower),
    );
  }, [reviews, searchTerm]);
  const [sede, setSede] = useState<Sede | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!sedeId) return;
    setLoading(true);
    try {
      const response = await reviewsApi.getReseñasPorSede(sedeId);
      if (response.ok) {
        const raw = response.data ?? [];
        (raw as unknown[]).forEach((r) => {
          const obj = r as Record<string, unknown>;
          if (
            !Object.prototype.hasOwnProperty.call(obj, "rating") &&
            !Object.prototype.hasOwnProperty.call(obj, "calificacion") &&
            !Object.prototype.hasOwnProperty.call(obj, "score") &&
            !Object.prototype.hasOwnProperty.call(obj, "ratingValue")
          ) {
            console.warn("Reseña sin campo de rating/calificación:", obj);
          }
        });
        setReviews(raw);
      } else {
        console.error(
          "Error fetching reviews:",
          response.status,
          response.data,
        );
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [sedeId]);

  const fetchSede = useCallback(async () => {
    if (!sedeId) return;
    try {
      const response = await sedesApi.getSedeById(sedeId);
      if (response.ok) {
        setSede(response.data);
      }
    } catch (error) {
      console.error("Error fetching sede:", error);
    }
  }, [sedeId]);

  useEffect(() => {
    fetchReviews();
    fetchSede();
  }, [fetchReviews, fetchSede]);

  const handleUpdateStatus = async (reviewId: number, aprobado: boolean) => {
    setUpdating((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const response = await reviewsApi.updateReviewStatus(reviewId, {
        aprobado,
      });
      if (response.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, aprobado } : r)),
        );
      } else {
        console.error(
          "Error updating review status:",
          response.status,
          response.data,
        );
      }
    } catch (error) {
      console.error("Error updating review status:", error);
    } finally {
      setUpdating((prev) => {
        const next = { ...prev };
        delete next[reviewId];
        return next;
      });
    }
  };

  if (!sedeId) {
    return (
      <Container>
        <ContentCard>
          <p>Selecciona una sede para ver las reseñas.</p>
        </ContentCard>
      </Container>
    );
  }

  return (
    <Container>
      <ContentCard>
        <h2>Reseñas de la Sede {sede?.nombre ?? "Cargando..."}</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <TableSearchFilter
              searchPlaceholder="Buscar reseñas..."
              onSearch={setSearchTerm}
            />
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Cliente</Th>
                    <Th>Comentario</Th>
                    <Th>Rating</Th>
                    <Th>Estado</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr>
                      <Td
                        colSpan={6}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        No hay reseñas para esta sede.
                      </Td>
                    </tr>
                  ) : (
                    filteredReviews.map((review) => {
                      // console.log("review object:", review);
                      const ratingValue =
                        (review as any).rating ??
                        (review as any).calificacion ??
                        (review as any).score ??
                        (review as any).ratingValue ??
                        "-";
                      const clienteValueRaw =
                        (review as any).cliente ??
                        (review as any).nombre ??
                        (review as any).usuario ??
                        (review as any).usuarioNombre ??
                        (review as any).userName ??
                        "Sin nombre";
                      let clienteValue = "Sin nombre";
                      if (typeof clienteValueRaw === "string") {
                        clienteValue = clienteValueRaw;
                      } else if (
                        clienteValueRaw &&
                        typeof clienteValueRaw === "object"
                      ) {
                        const obj = clienteValueRaw as Record<string, unknown>;
                        clienteValue =
                          (obj.nombre as string) ??
                          (obj.email as string) ??
                          (obj.name as string) ??
                          (obj.userName as string) ??
                          `Usuario ID ${(obj.id as number) ?? "?"}`;
                      }
                      return (
                        <tr key={review.id}>
                          <Td>{review.id}</Td>
                          <Td>{clienteValue}</Td>
                          <Td>{review.comentario}</Td>
                          <Td>{ratingValue}</Td>
                          <Td>
                            <StatusBadge $approved={review.aprobado}>
                              {review.aprobado ? "Aprobada" : "Pendiente"}
                            </StatusBadge>
                          </Td>
                          <Td>
                            <Button
                              $variant="approve"
                              disabled={updating[review.id]}
                              onClick={() =>
                                handleUpdateStatus(review.id, true)
                              }
                            >
                              Aprobar
                            </Button>
                            <Button
                              $variant="reject"
                              disabled={updating[review.id]}
                              onClick={() =>
                                handleUpdateStatus(review.id, false)
                              }
                            >
                              Rechazar
                            </Button>
                          </Td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </>
        )}
      </ContentCard>
    </Container>
  );
}
