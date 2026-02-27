import { useState } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import { ClientApiClient } from "../../api/clients/ClientApiClient";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
}

interface AddReservationUserSearchProps {
  onBack: () => void;
  onUserFound: (user: User) => void;
  onCreateUser: (searchValue: string, searchType: "email" | "document") => void;
}

const httpClient = new FetchHttpClient();
const clientApiClient = new ClientApiClient(httpClient);

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SearchTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchTypeButton = styled.button<{ active: boolean }>`
  padding: 0.8rem 1.5rem;
  border: 2px solid ${(props) => (props.active ? "#66CDAA" : "#E5E7EB")};
  background: ${(props) => (props.active ? "#66CDAA" : "white")};
  color: ${(props) => (props.active ? "white" : "#6B7280")};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #66cdaa;
    background: ${(props) => (props.active ? "#66CDAA" : "#F0F9FF")};
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
    border-color: #66cdaa;
    background-color: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  background-color: #66cdaa;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  align-self: center;
  width: 200px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const UserCard = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const UserField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FieldLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
`;

const FieldValue = styled.span`
  font-size: 0.9rem;
  color: #111827;
`;

const SelectButton = styled.button`
  background-color: #66cdaa;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: #6b7280;
  padding: 2rem;
`;

const CreateUserButton = styled.button`
  background-color: #f59e0b;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 1rem;

  &:hover {
    opacity: 0.9;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 2rem;
`;

const BackButton = styled.button`
  background-color: #9ca3af;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export function AddReservationUserSearch({
  onBack,
  onUserFound,
  onCreateUser,
}: AddReservationUserSearchProps) {
  const [searchType, setSearchType] = useState<"email" | "document">("email");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundUsers, setFoundUsers] = useState<User[]>([]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsSearching(true);

    try {
      const response = await clientApiClient.searchClients(
        searchValue.trim(),
        searchType,
      );
      const foundClients = response.data || [];

      // Transform Client[] to User[] format expected by the component
      const transformedUsers: User[] = foundClients.map((client) => ({
        id: client.id.toString(),
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
      }));

      setFoundUsers(transformedUsers);
    } catch (error) {
      console.error("Error searching clients:", error);
      setFoundUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateUser = () => {
    onCreateUser(searchValue, searchType);
  };

  return (
    <Container>
      <SectionTitle>Buscar Cliente</SectionTitle>

      <SearchContainer>
        <SearchTypeSelector>
          <SearchTypeButton
            active={searchType === "email"}
            onClick={() => setSearchType("email")}
          >
            Buscar por Email
          </SearchTypeButton>
          <SearchTypeButton
            active={searchType === "document"}
            onClick={() => setSearchType("document")}
          >
            Buscar por Documento
          </SearchTypeButton>
        </SearchTypeSelector>

        <InputGroup>
          <Label>
            {searchType === "email"
              ? "Email del cliente"
              : "Número de documento"}
          </Label>
          <StyledInput
            type={searchType === "email" ? "email" : "text"}
            placeholder={
              searchType === "email" ? "cliente@email.com" : "12345678A"
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </InputGroup>

        <SearchButton
          onClick={handleSearch}
          disabled={!searchValue.trim() || isSearching}
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </SearchButton>
      </SearchContainer>

      {foundUsers.length > 0 && (
        <ResultsContainer>
          <h3 style={{ marginBottom: "1rem", color: "#111827" }}>
            Clientes encontrados ({foundUsers.length})
          </h3>
          {foundUsers.map((user) => (
            <UserCard key={user.id}>
              <UserInfo>
                <UserField>
                  <FieldLabel>Nombre</FieldLabel>
                  <FieldValue>{user.name}</FieldValue>
                </UserField>
                <UserField>
                  <FieldLabel>Email</FieldLabel>
                  <FieldValue>{user.email}</FieldValue>
                </UserField>
                <UserField>
                  <FieldLabel>Teléfono</FieldLabel>
                  <FieldValue>{user.phone || "No registrado"}</FieldValue>
                </UserField>
                <UserField>
                  <FieldLabel>Documento</FieldLabel>
                  <FieldValue>{user.document || "No registrado"}</FieldValue>
                </UserField>
              </UserInfo>
              <SelectButton onClick={() => onUserFound(user)}>
                Seleccionar este cliente
              </SelectButton>
            </UserCard>
          ))}
        </ResultsContainer>
      )}

      {foundUsers.length === 0 && searchValue && !isSearching && (
        <ResultsContainer>
          <NoResults>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
              No se encontraron clientes
            </h3>
            <p>
              No encontramos ningún cliente con{" "}
              {searchType === "email" ? "ese email" : "ese documento"}.
            </p>
            <CreateUserButton onClick={handleCreateUser}>
              Crear nuevo cliente
            </CreateUserButton>
          </NoResults>
        </ResultsContainer>
      )}

      <Footer>
        <BackButton onClick={onBack}>Regresar</BackButton>
      </Footer>
    </Container>
  );
}
