import type { IChatContact, IChatMessage, IChatUser, ISaveContactDto, ISendMessageDto, IMarkMessageReadDto } from "../../components/chatMessage/interface/chat.interface";
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

  /**
   * Enviar mensaje
   */
  sendMessage(body: ISendMessageDto) {
    return this.httpClient.post<IChatMessage, ISendMessageDto>(
      "/ChatMessage/messages",
      body
    );
  }

  /**
   * Obtener conversación entre dos usuarios
   */
  getMessages(userA: number, userB: number) {
    return this.httpClient.get<IChatMessage[]>(
      `/ChatMessage/messages/${userA}/${userB}`
    );
  }

  /**
   * Marcar mensaje como leído
   */
  markMessageRead(body: IMarkMessageReadDto) {
    return this.httpClient.post<void, IMarkMessageReadDto>(
      "/ChatMessage/messages/read",
      body
    );
  }
}