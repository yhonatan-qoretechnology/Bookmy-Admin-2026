import { API_BASE_URL, DEFAULT_TIMEOUT_MS } from './ApiConfig';
import type { HttpClient, HttpRequest, HttpResponse } from './HttpClient';

function buildUrl(
  path: string,
  queryParams?: HttpRequest['queryParams'],
): string {
  const url = new URL(path, API_BASE_URL);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function doRequest<T>(request: HttpRequest): Promise<HttpResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const url = buildUrl(request.url, request.queryParams);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
      ...(request.headers ?? {}),
    };

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      signal: controller.signal,
    };

    if (request.body !== undefined && request.body !== null) {
      fetchOptions.body = JSON.stringify(request.body);
    }

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type') ?? '';
    let data: unknown = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    }

    // Si el token expiró (401), limpiarlo y forzar logout
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return {
      status: response.status,
      ok: response.ok,
      data: data as T,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: 0,
        ok: false,
        data: null as T,
      };
    }

    return {
      status: 0,
      ok: false,
      data: null as T,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export class FetchHttpClient implements HttpClient {
  get<T>(
    url: string,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>> {
    return doRequest<T>({ method: 'GET', url, ...options });
  }

  post<T, B>(
    url: string,
    body?: B,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>> {
    return doRequest<T>({ method: 'POST', url, body, ...options });
  }

  put<T, B>(
    url: string,
    body?: B,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>> {
    return doRequest<T>({ method: 'PUT', url, body, ...options });
  }

  patch<T, B>(
    url: string,
    body?: B,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>> {
    return doRequest<T>({ method: 'PATCH', url, body, ...options });
  }

  delete<T>(
    url: string,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>> {
    return doRequest<T>({ method: 'DELETE', url, ...options });
  }
}
