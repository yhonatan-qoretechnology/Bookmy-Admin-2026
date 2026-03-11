import styled from "styled-components";

export type StatusType =
  | "Pendiente"
  | "Atendida"
  | "Cancelado"
  | "Activo"
  | "Desactivo";

const Badge = styled.span<{ $type: StatusType }>`
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  display: inline-block;
  min-width: 100px;
  text-align: center;

  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case "Pendiente":
        return theme.warning;
      case "Atendida":
        return theme.success;
      case "Cancelado":
        return theme.danger;
      case "Activo":
        return theme.success;
      case "Desactivo":
        return theme.danger;
      default:
        return theme.textLight;
    }
  }};
`;

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const translatedStatus =
    status === "enabled"
      ? "Activo"
      : status === "disabled"
        ? "Desactivo"
        : status;
  const validStatus = translatedStatus as StatusType;

  return <Badge $type={validStatus}>{translatedStatus}</Badge>;
}
