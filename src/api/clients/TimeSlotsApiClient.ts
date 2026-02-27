import type { HttpClient } from "../http/HttpClient";

const FIXED_TIME_SLOTS: string[] = [
  "7:00 am - 8:00 am",
  "8:00 am - 9:00 am",
  "9:00 am - 10:00 am",
  "10:00 am - 11:00 am",
  "11:00 am - 12:00 pm",
  "12:00 pm - 1:00 pm",
  "1:00 pm - 2:00 pm",
  "2:00 pm - 3:00 pm",
  "3:00 pm - 4:00 pm",
  "4:00 pm - 5:00 pm",
  "5:00 pm - 6:00 pm",
];

export class TimeSlotsApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  // Por ahora devuelve rangos fijos del día (7:00 am a 6:00 pm)
  // TODO: reemplazar con endpoint real según horario de la sede
  getTimeSlots() {
    return Promise.resolve({
      data: FIXED_TIME_SLOTS,
    });
  }
}
