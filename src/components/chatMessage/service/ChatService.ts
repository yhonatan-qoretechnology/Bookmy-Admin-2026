import type { ChatApiClient } from "../../../api/clients/ChatApiClient";
import type { IChatContact, IChatMessage, IChatUser, ISaveContactDto, ISendMessageDto, IMarkMessageReadDto } from "../interface/chat.interface";


export class ChatService {
  private readonly chatApiClient: ChatApiClient;

  constructor(chatApiClient: ChatApiClient) {
    this.chatApiClient = chatApiClient;
  }

  /**
   * Buscar usuario por email
   */
  async searchUser(email: string): Promise<IChatUser> {
    const response = await this.chatApiClient.findUser(email);
    return response.data!;
  }

  /**
   * Agregar contacto
   */
  async saveContact(body: ISaveContactDto): Promise<void> {
    await this.chatApiClient.saveContact(body);
  }

  /**
   * Obtener contactos del usuario
   */
  async getContacts(ownerUserId: number): Promise<IChatContact[]> {
    const response = await this.chatApiClient.getContacts(ownerUserId);
    return response.data!;
  }

  /**
   * Enviar mensaje
   */
  async sendMessage(body: ISendMessageDto): Promise<IChatMessage> {
    const response = await this.chatApiClient.sendMessage(body);
    return response.data!;
  }

  /**
   * Obtener conversación entre dos usuarios
   */
  async getMessages(userA: number, userB: number): Promise<IChatMessage[]> {
    const response = await this.chatApiClient.getMessages(userA, userB);
    return response.data!;
  }

  /**
   * Marcar mensaje como leído
   */
  async markMessageRead(body: IMarkMessageReadDto): Promise<void> {
    await this.chatApiClient.markMessageRead(body);
  }
}