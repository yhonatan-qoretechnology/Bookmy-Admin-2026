import styled from "styled-components";

import stockIcon from "../../assets/icons/box.svg";
import reservasIcon from "../../assets/icons/calendar-check.svg";
import calendarioIcon from "../../assets/icons/calendar.svg";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import clientesIcon from "../../assets/icons/users.svg";
import pagosIcon from "../../assets/icons/wallet.svg";
import { useLogout } from "../../presentation/hooks/useLogout";

const Container = styled.aside`
  width: 250px;
  background-color: ${({ theme }) => theme.cardBg};
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;

  img {
    width: 120px;
    height: auto;
  }
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const MenuItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;

  width: 100%;
  text-align: left;
  border: none;
  outline: none;

  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.primary : "transparent"};

  color: ${({ theme, $isActive }) => ($isActive ? "#FFFFFF" : theme.textLight)};

  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "500")};

  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.primary : theme.body};
    color: ${({ theme, $isActive }) => ($isActive ? "#FFFFFF" : theme.text)};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Icon = styled.img<{ $isActive: boolean }>`
  width: 20px;
  height: 20px;
  filter: ${({ $isActive }) =>
    $isActive ? "brightness(0) invert(1)" : "none"};
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout, loading } = useLogout();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    console.log("Logout clicked");
    const success = await logout();
    console.log("Logout success:", success);
    if (success) {
      console.log("Redirecting to login");
      window.location.href = "/login";
    } else {
      console.log("Logout failed");
    }
  };

  const MENU_ITEMS = [
    { label: "Dashboard", icon: dashboardIcon },
    { label: "Reservas", icon: reservasIcon },
    { label: "Clientes", icon: clientesIcon },
    { label: "Pagos", icon: pagosIcon },
    { label: "Calendario", icon: calendarioIcon },
    { label: "Stock - insumos", icon: stockIcon },
    ...(user.role !== "BRANCH_ADMIN"
      ? [
          { label: "Crear administradores", icon: stockIcon },
          { label: "Administradores", icon: clientesIcon },
        ]
      : []),
  ];

  return (
    <Container>
      <LogoContainer>
        <img src="/logo.png" alt="BookMy Logo" />
      </LogoContainer>

      <MenuList>
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.label;

          return (
            <MenuItem
              key={item.label}
              $isActive={isActive}
              onClick={() => setActiveTab(item.label)}
            >
              <Icon src={item.icon} alt={item.label} $isActive={isActive} />
              <span>{item.label}</span>
            </MenuItem>
          );
        })}
      </MenuList>

      <BottomSection>
        <MenuItem
          $isActive={activeTab === "Configuración"}
          onClick={() => setActiveTab("Configuración")}
        >
          <Icon
            src={settingsIcon}
            alt="Configuración"
            $isActive={activeTab === "Configuración"}
          />
          <span>Configuración</span>
        </MenuItem>

        <MenuItem
          $isActive={false}
          onClick={() => handleLogout()}
          disabled={loading}
        >
          <Icon src={logoutIcon} alt="Logout" $isActive={false} />
          <span>{loading ? "Cerrando sesión..." : "Logout"}</span>
        </MenuItem>
      </BottomSection>
    </Container>
  );
}
