import { useState, useEffect } from "react";
import styled from "styled-components";
import { StatusBadge } from "../common/StatusBadge";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import { AdminApiClient } from "../../api/clients/AdminApiClient";
import type { Admin } from "../../core/domain/admin/AdminTypes";

const httpClient = new FetchHttpClient();
const adminApiClient = new AdminApiClient(httpClient);

const SectionContainer = styled.section`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f5f6fa;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  font-size: 0.9rem;
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 1.5rem 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
  vertical-align: middle;
`;

const ClientName = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const EditButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    opacity: 0.9;
  }
`;

interface AdminListProps {
  onEdit?: (admin: Admin) => void;
}

export function AdminList({ onEdit }: AdminListProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await adminApiClient.getAdmins();
        setAdmins(response.data as Admin[]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdmins();
  }, []);

  const filteredAdmins =
    user.role === "COMPANY_ADMIN"
      ? admins.filter((admin) => admin.role === "BRANCH_ADMIN")
      : admins;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Administradores</SectionTitle>
      </SectionHeader>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <Tr key={admin.id}>
                  <Td>{admin.id}</Td>
                  <Td>
                    <ClientName>
                      {admin.AdminProfile.firstName}{" "}
                      {admin.AdminProfile.lastName}
                    </ClientName>
                  </Td>
                  <Td>{admin.email}</Td>
                  <Td>{admin.role}</Td>
                  <Td>
                    <StatusBadge status={admin.state} />
                  </Td>
                  <Td>
                    {onEdit && (
                      <EditButton onClick={() => onEdit(admin)}>
                        Editar
                      </EditButton>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td
                  colSpan={6}
                  style={{ textAlign: "center", color: "#6b7280" }}
                >
                  No hay administradores registrados aún
                </Td>
              </Tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </SectionContainer>
  );
}
