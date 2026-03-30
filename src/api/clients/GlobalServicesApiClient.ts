import type { HttpClient } from "../http/HttpClient";

export interface ServiceTranslation {
  language: string;
  name: string;
  description: string;
}

export interface ServicePrice {
  amount: number;
  duration: number;
  currency: string;
}

export interface Service {
  id: number;
  categoryId: number;
  translations: ServiceTranslation[];
  prices: ServicePrice[];
  sedeIds?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  categoryId: number;
  translations: ServiceTranslation[];
  prices: ServicePrice[];
  sedeIds: number[];
}

export class GlobalServicesApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getServices(lang: string = "es") {
    return this.httpClient.get<Service[]>(`/services`, {
      queryParams: { language: lang },
    });
  }

  createService(body: CreateServiceRequest) {
    return this.httpClient.post<Service, CreateServiceRequest>(
      `/services`,
      body,
    );
  }
}
