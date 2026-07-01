import type { IChatContact, IChatUser, ISaveContactDto } from "../../components/chatMessage/interface/chat.interface";
import type { HttpClient } from "../http/HttpClient";



export class ChatApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Buscar usuario por email
   */
  findUser(email: string) {
    return this.httpClient.get<IChatUser>(
      `/ChatMessage/users?email=${encodeURIComponent(email)}`
    );
  }

  /**
   * Guardar contacto
   */
  saveContact(body: ISaveContactDto) {
    return this.httpClient.post<void, ISaveContactDto>(
      "/ChatMessage/contacts",
      body
    );
  }

  /**
   * Obtener contactos del usuario
   */
  getContacts(ownerUserId: number) {
    return this.httpClient.get<IChatContact[]>(
      `/ChatMessage/contacts/${ownerUserId}`
    );
  }
}