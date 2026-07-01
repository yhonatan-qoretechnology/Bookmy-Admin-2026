import type { HttpClient } from "../http/HttpClient";

export interface SendInvoiceItemRequest {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface SendInvoiceRequest {
  email: string;
  clientName: string;
  sede: string;
  services: SendInvoiceItemRequest[];
  subtotal: number;
  total: number;
}

export interface SendInvoiceResponse {
  message: string;
}

export class EmailApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Send invoice by email.
   */
  sendInvoice(data: SendInvoiceRequest) {
    return this.httpClient.post<
      SendInvoiceResponse,
      SendInvoiceRequest
    >("/email/send-invoice", data);
  }
}