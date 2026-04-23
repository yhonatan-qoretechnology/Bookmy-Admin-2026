import styled from "styled-components";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Chatbot } from "../common/Chatbot";

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.cardBg};
  overflow: hidden;
`;

const MainContent = styled.div<{ $sidebarOpen?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? "250px" : "0")};
  transition: margin-left 0.3s ease-in-out;
`;

const PageContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;

  @media (min-width: 1025px) {
    display: none;
  }
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <LayoutContainer>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <SidebarOverlay
        $isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      />
      <MainContent $sidebarOpen={isSidebarOpen}>
        <Header
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          setActiveTab={setActiveTab}
        />
        <PageContent>{children}</PageContent>
      </MainContent>
      <Chatbot />
    </LayoutContainer>
  );
}
