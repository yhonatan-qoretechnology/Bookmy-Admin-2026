import type { HttpClient } from "../http/HttpClient";

export interface Review {
  id: number;
  cliente: string;
  comentario: string;
  rating: number;
  aprobado: boolean;
  sedeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReviewStatusRequest {
  aprobado: boolean;
}

export class ReviewsApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getReseñasPorSede(sedeId: number) {
    return this.httpClient.get<Review[]>(`/resenas/sede/${sedeId}`);
  }

  updateReviewStatus(reviewId: number, body: UpdateReviewStatusRequest) {
    // Ajusta el método/endpoint según tu backend (PATCH o PUT)
    return this.httpClient.patch<Review, UpdateReviewStatusRequest>(
      `/resenas/${reviewId}`,
      body
    );
  }
}
