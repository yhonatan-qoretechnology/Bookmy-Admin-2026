export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpHeaders = Record<string, string>;

export interface HttpRequest {
  method: HttpMethod;
  url: string;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  headers?: HttpHeaders;
}

export interface HttpResponse<T = unknown> {
  status: number;
  ok: boolean;
  data: T | null;
}

export interface HttpClient {
  get<T = unknown>(
    url: string,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>>;
  post<T = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>>;
  put<T = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>>;
  patch<T = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>>;
  delete<T = unknown>(
    url: string,
    options?: Omit<HttpRequest, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<T>>;
}
