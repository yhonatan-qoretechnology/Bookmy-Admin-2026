import type { ChatApiClient } from "../../../../api/clients/ChatApiClient";
import type { IChatContact, IChatUser, ISaveContactDto } from "../chat.interface";


export class ChatService {
  private readonly chatApiClient: ChatApiClient;

  constructor(chatApiClient: ChatApiClient) {
    this.chatApiClient = chatApiClient;
  }

  /**
   * Buscar usuario por email
   */
  searchUser(email: string): Promise<IChatUser> {
    return this.chatApiClient.findUser(email);
  }

  /**
   * Agregar contacto
   */
  saveContact(body: ISaveContactDto): Promise<void> {
    return this.chatApiClient.saveContact(body);
  }

  /**
   * Obtener contactos del usuario
   */
  getContacts(ownerUserId: number): Promise<IChatContact[]> {
    return this.chatApiClient.getContacts(ownerUserId);
  }
}