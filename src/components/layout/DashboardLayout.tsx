import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.cardBg};
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PageContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  return (
    <LayoutContainer>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContent>
        <Header />
        <PageContent>
          {children}
        </PageContent>
      </MainContent>
    </LayoutContainer>
  );
}