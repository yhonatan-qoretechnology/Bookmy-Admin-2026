import styled from "styled-components";
import { Input } from "../common/Input";
import { getStoredUser } from "../../core/domain/auth/AuthUtils";

import menuIcon from "../../assets/icons/menu.svg";
import searchIcon from "../../assets/icons/search.svg";
import bellIcon from "../../assets/icons/bell.svg";
import chevronIcon from "../../assets/icons/chevron-down.svg";

const DEFAULT_AVATAR_URL = "/logo.png";

const Container = styled.header`
  height: 80px;
  background-color: ${({ theme }) => theme.cardBg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  flex-shrink: 0;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NotificationWrapper = styled.div`
  position: relative;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.danger};
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.cardBg};
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textLight};
`;

export function Header() {
  // Get user data from session storage
  const user = getStoredUser();

  const userName =
    user?.UserData?.name ||
    user?.AdminProfile?.firstName + " " + user?.AdminProfile?.lastName ||
    "Usuario";
  const userEmail = user?.email || "";

  // Always use bookmy.es as the image base URL
  const imageBaseUrl = "https://bookmy.es";

  // Extract just the path from fotoPerfil (remove any existing domain)
  const getImagePath = (fotoPerfil: string | undefined): string => {
    if (!fotoPerfil) return "";
    // If it's a full URL, extract just the path part (/uploads/...)
    if (fotoPerfil.startsWith("http")) {
      try {
        const url = new URL(fotoPerfil);
        return url.pathname.replace(/^\//, ""); // Remove leading slash
      } catch {
        return fotoPerfil;
      }
    }
    return fotoPerfil.replace(/^\//, ""); // Remove leading slash if present
  };

  const imagePath = getImagePath(user?.fotoPerfil);
  const avatarUrl = imagePath
    ? `${imageBaseUrl}/${imagePath}`
    : DEFAULT_AVATAR_URL;

  return (
    <Container>
      <LeftSection>
        <MenuButton>
          <img src={menuIcon} alt="Menu" />
        </MenuButton>

        <SearchContainer>
          <Input
            placeholder="Buscar"
            icon={<img src={searchIcon} alt="Buscar" style={{ width: 16 }} />}
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        <NotificationWrapper>
          <img src={bellIcon} alt="Notificaciones" />
          <NotificationBadge>6</NotificationBadge>
        </NotificationWrapper>

        <ProfileWrapper>
          <Avatar src={avatarUrl} alt="Perfil" />
          <UserInfo>
            <UserName>{userName}</UserName>
            <UserRole>{userEmail}</UserRole>
          </UserInfo>
          <img src={chevronIcon} alt="Ver más" style={{ width: 12 }} />
        </ProfileWrapper>
      </RightSection>
    </Container>
  );
}
