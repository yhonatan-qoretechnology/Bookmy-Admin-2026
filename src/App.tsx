import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Nuestros archivos de tema
import { GlobalStyle } from './theme/GlobalStyle';
import { lightTheme, darkTheme } from './theme/theme';

// Nuestras nuevas páginas
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './presentation/components/ProtectedRoute';

// Importa las páginas de ejemplo anteriores si aún las quieres
// import { HomePage } from './pages/HomePage';
// import { SettingsPage } from './pages/SettingsPage';

function App() {
  // Mantenemos el estado del tema
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      {/* El botón de Toggle se puede añadir de nuevo luego.
        Por ahora, lo quitamos para enfocarnos en el login. 
      */}
      <Routes>
        {/* La ruta raíz '/' ahora redirige al login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Nuestras nuevas rutas */}
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas antiguas (opcional) */}
        {/* <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;