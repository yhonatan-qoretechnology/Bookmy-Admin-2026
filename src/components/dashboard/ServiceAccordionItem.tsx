import styled from "styled-components";
import chevronDown from "../../assets/icons/chevron-down.svg";

export interface ServiceOption {
  id: string;
  name: string;
  price: string;
}

interface ServiceAccordionItemProps {
  title: string;
  countText: string;
  services: ServiceOption[];
  onSelectService: (service: ServiceOption) => void;
  selectedServiceId?: string; // Para saber cuál está marcado
  isOpen: boolean;
  onToggle: () => void;
}

const Container = styled.div<{ $isOpen: boolean }>`
  background-color: ${({ $isOpen }) => ($isOpen ? "#F3F4F6" : "transparent")};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? "transparent" : "#E5E7EB")};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? "0 4px 12px rgba(0,0,0,0.05)" : "none"};
  height: fit-content;
  align-self: start;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
`;

const InfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CountText = styled.span`
  color: ${({ theme }) => theme.textLight};
  font-size: 0.85rem;
`;

const Chevron = styled.img<{ $isOpen: boolean }>`
  width: 12px;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  opacity: 0.6;
`;

const Content = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "300px" : "0")};
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  overflow-y: auto;
  transition: all 0.3s ease;
  background-color: #f3f4f6;
  padding: ${({ $isOpen }) => ($isOpen ? "0 0.5rem 0.5rem 0.5rem" : "0")};
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

const ServiceCard = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  margin-bottom: 2px;
  border-radius: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ServiceName = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const ServiceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectButton = styled.button<{ $isSelected: boolean }>`
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? "#10B981" : theme.primary};
  color: white;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Price = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  font-size: 1rem;
`;

export function ServiceAccordionItem({
  title,
  countText,
  services,
  onSelectService,
  selectedServiceId,
  isOpen,
  onToggle,
}: ServiceAccordionItemProps) {
  return (
    <Container $isOpen={isOpen}>
      <Header onClick={onToggle}>
        <TitleGroup>
          <Title>{title}</Title>
        </TitleGroup>
        <InfoGroup>
          <CountText>{countText}</CountText>
          <Chevron src={chevronDown} $isOpen={isOpen} alt="Toggle" />
        </InfoGroup>
      </Header>

      <Content $isOpen={isOpen}>
        {services.map((service) => (
          <ServiceCard key={service.id}>
            <ServiceName>{service.name}</ServiceName>
            <ServiceRow>
              <SelectButton
                $isSelected={selectedServiceId === service.id}
                onClick={() => onSelectService(service)}
              >
                {selectedServiceId === service.id
                  ? "Seleccionado"
                  : "Seleccionar"}
              </SelectButton>
              <Price>{service.price}</Price>
            </ServiceRow>
          </ServiceCard>
        ))}
      </Content>
    </Container>
  );
}
