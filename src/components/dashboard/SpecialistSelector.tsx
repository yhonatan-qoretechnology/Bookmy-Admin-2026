import { useRef } from "react";
import styled from "styled-components";

export interface Specialist {
  id: string;
  name: string;
  role: string;
  image: string;
}

// Skeleton loader components
const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
  padding: 1.25rem 1rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
`;

const SkeletonAvatar = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 1.25rem;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const SkeletonName = styled.div`
  width: 80px;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.4rem;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const SkeletonRole = styled.div`
  width: 100px;
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

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

const CarouselRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.4rem;
  font-weight: 300;
  line-height: 1;
  flex: 0 0 auto;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }
`;

const Scroller = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0.5rem 1.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SpecialistCard = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  opacity: ${({ $isSelected }) => ($isSelected ? "1" : "0.85")};
  transform: ${({ $isSelected }) => ($isSelected ? "scale(1.05)" : "scale(1)")};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.25rem 1rem;
  border-radius: 20px;
  background: white;
  box-shadow: ${({ $isSelected }) =>
    $isSelected
      ? "0 12px 35px rgba(102, 126, 234, 0.25), 0 0 0 3px rgba(102, 126, 234, 0.1)"
      : "0 4px 20px rgba(0, 0, 0, 0.06)"};
  position: relative;

  &:hover {
    opacity: 1;
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.18);
  }
`;

const Avatar = styled.img<{ $isSelected: boolean }>`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.25rem;
  border: ${({ $isSelected }) =>
    $isSelected ? "4px solid transparent" : "3px solid #f0f0f0"};
  background:
    linear-gradient(white, white) padding-box,
    ${({ $isSelected }) =>
      $isSelected
        ? "linear-gradient(135deg, #667eea, #764ba2) border-box"
        : "transparent border-box"};
  background-origin: border-box;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const Name = styled.span`
  color: #1a202c;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
  text-align: center;
`;

const Role = styled.span`
  color: #718096;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.4;
`;

interface SpecialistSelectorProps {
  specialists: Specialist[];
  selectedId?: string;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export function SpecialistSelector({
  specialists,
  selectedId,
  onSelect,
  loading = false,
}: SpecialistSelectorProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollerRef.current;
    if (!container) return;
    const cardWidth = 240;
    const gap = 32;
    const scrollAmount = cardWidth + gap;
    const currentScroll = container.scrollLeft;
    const targetScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array.from({ length: 4 }, (_, i) => (
      <SkeletonCard key={`skeleton-${i}`}>
        <SkeletonAvatar />
        <SkeletonName />
        <SkeletonRole />
      </SkeletonCard>
    ));
  };

  return (
    <Container>
      <Title>Especialistas</Title>
      <CarouselRow>
        <NavButton onClick={() => scroll("left")}>‹</NavButton>
        <Scroller ref={scrollerRef}>
          {loading
            ? renderSkeletons()
            : specialists.map((spec) => (
                <SpecialistCard
                  key={spec.id}
                  data-specialist-card="true"
                  onClick={() => onSelect(spec.id)}
                  $isSelected={selectedId === spec.id}
                >
                  <Avatar
                    src={spec.image}
                    alt={spec.name}
                    $isSelected={selectedId === spec.id}
                    onError={(e) => {
                      const img = e.currentTarget;
                      console.warn("Specialist image failed to load:", {
                        name: spec.name,
                        attemptedSrc: img.src,
                        providedSrc: spec.image,
                      });
                      if (img.src !== "/logo.png") {
                        img.src = "/logo.png";
                      }
                    }}
                  />
                  <Name>{spec.name}</Name>
                  <Role>{spec.role}</Role>
                </SpecialistCard>
              ))}
        </Scroller>
        <NavButton onClick={() => scroll("right")}>›</NavButton>
      </CarouselRow>
    </Container>
  );
}
