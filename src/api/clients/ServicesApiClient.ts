import type { HttpClient } from "../http/HttpClient";

export interface Category {
  id: number;
  createdAt: string;
  updatedAt: string;
  image: string;
  translations: Array<{
    id: number;
    name: string;
    description: string;
    language: string;
    categoryId: number;
  }>;
}

export class ServicesApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getCategories() {
    return this.httpClient.get<Category[]>("/categories?language=es");
  }
}
