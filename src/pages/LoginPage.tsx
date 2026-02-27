import { useState, useEffect } from "react";
import styled from "styled-components";

import { AuthLayout } from "../components/layout/AuthLayout";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { Checkbox } from "../components/common/Checkbox"; 

import eyeIcon from "../assets/icons/eye.svg";
import eyeOffIcon from "../assets/icons/eye-off.svg";
import { getStoredToken } from "../core/domain/auth/AuthUtils";
import { useLogin } from "../presentation/hooks/useLogin";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Logo = styled.img`
  display: block;
  width: 100px;
  margin: 0 auto 1rem;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.text};
  @media (max-width: 480px) {
    font-size: 1.1rem;
    font-weight: bold;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.textLight};
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: -0.75rem;
`;

const LinkExterno = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const VersionText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  margin-top: -0.5rem;
  font-size: 0.765rem;
  padding-top: 1rem;
  margin-bottom: -1.2rem;
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textLight};
  margin-top: 1.5rem;
`;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loading, error } = useLogin();

  // Si ya hay token, redirigir al dashboard
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login({ email, password });

    if (result) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <AuthLayout>
      <Card>
        <Logo src="/logo.png" alt="BookMy Logo" />
        <Title>Inicio de sesión</Title>
        <Subtitle>Por favor ingresa tus credenciales de acceso</Subtitle>

        <Form onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: "red", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
              {error}
            </p>
          )}
          <Label>Usuario o correo:</Label>
          <Input
            type="email"
            placeholder="admin@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
          <Label>Contraseña:</Label>
          <LinkExterno href="#">Olvidó su contraseña?</LinkExterno>
          </div>
          
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="•••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={
              <img 
                src={showPassword ? eyeOffIcon : eyeIcon} 
                alt="toggle password" 
                style={{ width: 20, height: 20 }} 
              />
            }
            onIconClick={() => setShowPassword(!showPassword)}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox checked={rememberMe} onChange={setRememberMe}>
               Recordar contraseña
            </Checkbox>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </Form>

        <FooterText>
          No tienes una cuenta? <LinkExterno href="#">Contactanos</LinkExterno>
        </FooterText>

        <VersionText>Versión 1.0.0</VersionText>
        
      </Card>
    </AuthLayout>
  );
}