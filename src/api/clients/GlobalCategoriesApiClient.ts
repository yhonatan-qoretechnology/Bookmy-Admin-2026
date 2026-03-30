import type { HttpClient } from "../http/HttpClient";

export interface CategoryTranslation {
  language: string;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  image: string | null;
  translations: CategoryTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  image: string | null;
  translations: CategoryTranslation[];
}

export class GlobalCategoriesApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getCategories(lang: string = "es") {
    return this.httpClient.get<Category[]>(`/categories`, {
      queryParams: { language: lang },
    });
  }

  createCategory(body: CreateCategoryRequest) {
    return this.httpClient.post<Category, CreateCategoryRequest>(
      `/categories`,
      body,
    );
  }
}
