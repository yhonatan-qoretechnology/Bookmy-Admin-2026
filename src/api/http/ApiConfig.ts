const getApiBaseUrl = () => {
  // Vite expone las variables con VITE_ al proceso del cliente
  const env = import.meta.env.VITE_API_BASE_URL;
  if (!env) {
    throw new Error('VITE_API_BASE_URL no está definida en el entorno');
  }
  return env;
};

export const API_BASE_URL = getApiBaseUrl();

export const DEFAULT_TIMEOUT_MS = 15000;
