import styled from "styled-components";

export interface Specialist {
  id: string;
  name: string;
  role: string;
  image: string;
}

const Container = styled.div`
  margin-top: 3rem;
  width: 100%;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.primary};
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: left;
`;

const Grid = styled.div`
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 2rem;
  }
`;

const SpecialistCard = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  opacity: ${({ $isSelected }) => ($isSelected ? "1" : "0.7")};
  transform: ${({ $isSelected }) => ($isSelected ? "scale(1.05)" : "scale(1)")};
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const Avatar = styled.img<{ $isSelected: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid
    ${({ theme, $isSelected }) => ($isSelected ? theme.primary : "transparent")};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Name = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const Role = styled.span`
  color: ${({ theme }) => theme.textLight};
  font-size: 0.85rem;
`;

interface SpecialistSelectorProps {
  specialists: Specialist[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function SpecialistSelector({
  specialists,
  selectedId,
  onSelect,
}: SpecialistSelectorProps) {
  return (
    <Container>
      <Title>Especialistas</Title>
      <Grid>
        {specialists.map((spec) => (
          <SpecialistCard
            key={spec.id}
            onClick={() => onSelect(spec.id)}
            $isSelected={selectedId === spec.id}
          >
            <Avatar
              src={spec.image}
              alt={spec.name}
              $isSelected={selectedId === spec.id}
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== "/logo.png") {
                  img.src = "/logo.png";
                }
              }}
            />
            <Name>{spec.name}</Name>
            <Role>{spec.role}</Role>
          </SpecialistCard>
        ))}
      </Grid>
    </Container>
  );
}
