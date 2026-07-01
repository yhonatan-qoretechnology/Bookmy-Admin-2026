import React, { useState } from "react";
import styled from "styled-components";

import stockIcon from "../../assets/icons/box.svg";
import reservasIcon from "../../assets/icons/calendar-check.svg";
import calendarioIcon from "../../assets/icons/calendar.svg";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import buildingIcon from "../../assets/icons/building.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import clientesIcon from "../../assets/icons/users.svg";
import pagosIcon from "../../assets/icons/wallet.svg";
import comunicationIcon from "../../assets/icons/communication.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import facturacionIcon from "../../assets/icons/facturacion.svg";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Container = styled.aside<{ $isOpen?: boolean }>`
  width: 250px;
  background-color: ${({ theme }) => theme.dashboardBg};
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #00b69b;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #009e85;
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

const Arrow = styled.span<{ $isOpen: boolean }>`
  margin-left: auto;
  font-size: 0.7rem;
  transition: transform 0.2s ease;
  transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")});
`;

const SubMenuContainer = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "150px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1.25rem;
`;

const SubMenuItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  font-size: 0.9rem;
  background-color: transparent;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.primary : theme.textLight};
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "500")};

  &:hover {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

export function Sidebar({ activeTab, setActiveTab, isOpen }: SidebarProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const isCompanyAdmin = user.role === "COMPANY_ADMIN";
  const isBranchAdmin = user.role === "BRANCH_ADMIN";

  const [isFacturacionOpen, setIsFacturacionOpen] = useState(() =>
    ["Facturación", "Resumen", "Facturas", "Compras"].includes(activeTab),
  );

  const MENU_ITEMS = [
    { label: "Dashboard", icon: dashboardIcon },
    { label: "Reservas", icon: reservasIcon },
    ...(isSuperAdmin || isCompanyAdmin || isBranchAdmin
      ? [{ label: "Reservas por empleado", icon: calendarioIcon }]
      : []),
    { label: "Clientes", icon: clientesIcon },
    { label: "Reseñas", icon: settingsIcon },
    { label: "Pagos", icon: pagosIcon },
    { label: "Calendario", icon: calendarioIcon },
    { label: "Stock - insumos", icon: stockIcon },
    ...(isSuperAdmin || isCompanyAdmin
      ? [{ label: "Crear administradores", icon: stockIcon }]
      : []),
    ...(isSuperAdmin ? [{ label: "Empresas", icon: buildingIcon }] : []),
    ...(isSuperAdmin
      ? [{ label: "Servicios Globales", icon: settingsIcon }]
      : []),
    { label: "Facturación", icon: facturacionIcon },
  ];

  const MENU_ITEMS_BOTTOM = [
    { label: "Comunicación", icon: comunicationIcon },
    { label: "Configuración", icon: settingsIcon },
    { label: "Cerrar sesión", icon: logoutIcon },
  ];

  return (
    <Container $isOpen={isOpen}>
      <LogoContainer>
        <img src="/logo-bookmy.svg" alt="BookMy Logo" />
      </LogoContainer>

      <MenuList>
        {MENU_ITEMS.map((item) => {
          const isFacturacion = item.label === "Facturación";
          const isActive =
            activeTab === item.label ||
            (isFacturacion &&
              ["Resumen", "Facturas", "Compras"].includes(activeTab));

          return (
            <React.Fragment key={item.label}>
              <MenuItem
                $isActive={isActive}
                onClick={() => {
                  setActiveTab(item.label);
                  if (isFacturacion) {
                    setIsFacturacionOpen(!isFacturacionOpen);
                  }
                }}
              >
                <Icon src={item.icon} alt={item.label} $isActive={isActive} />
                <span>{item.label}</span>
                {isFacturacion && <Arrow $isOpen={isFacturacionOpen}>▼</Arrow>}
              </MenuItem>

              {isFacturacion && (
                <SubMenuContainer $isOpen={isFacturacionOpen}>
                  <SubMenuItem
                    $isActive={activeTab === "Resumen"}
                    onClick={() => setActiveTab("Resumen")}
                  >
                    • Resumen
                  </SubMenuItem>
                  <SubMenuItem
                    $isActive={activeTab === "Facturas"}
                    onClick={() => setActiveTab("Facturas")}
                  >
                    • Facturas de reservas
                  </SubMenuItem>
                  <SubMenuItem
                    $isActive={activeTab === "Compras"}
                    onClick={() => setActiveTab("Compras")}
                  >
                    • Compras / Gastos
                  </SubMenuItem>
                </SubMenuContainer>
              )}
            </React.Fragment>
          );
        })}
      </MenuList>

      <BottomSection>
        {MENU_ITEMS_BOTTOM.map((item) => {
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
      </BottomSection>
    </Container>
  );
}
