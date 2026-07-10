export interface IUserStatusTranslation {
  name: string;
}

export interface IUserStatus {
  id: number;
  code: string;
  UserStatusTranslation: IUserStatusTranslation[];
}

export interface IUserData {
  name: string;
  phone: string;
}

export interface IChatUser {
  id: number;
  email: string;
  role: string;
  fotoPerfil: string | null;
  UserStatus: IUserStatus;
  UserData?: IUserData;
}

export interface IChatContact {
  id: number;
  owner_user_id: number;
  contact_user_id: number;
  created_at: string;
  users_chat_contact_contact_user_idTousers: IChatUser;
}

export interface ISaveContactDto {
  ownerUserId: number;
  contactUserId: number;
}

export interface ISendMessageDto {
  senderId: number;
  receiverId: number;
  senderEmail: string;
  receiverEmail: string;
  messageType: 'TEXT' | 'FILE';
  message: string;
  fileUrl: string | null;
}

export interface IMarkMessageReadDto {
  chatId: number;
  userId: number;
}

// Socket payload interfaces
export interface IConnectUserPayload {
  userId: number;
  email: string;
}

export interface ISendMessagePayload {
  senderId: number;
  receiverId: number;
  senderEmail: string;
  receiverEmail: string;
  messageType: 'TEXT' | 'FILE';
  message: string;
  fileUrl: string | null;
}

export interface ITypingPayload {
  senderId: number;
  receiverId: number;
}

export interface IMessageReadPayload {
  chatId: number;
  userId: number;
}

export interface IUserConnectedResponse {
  success: boolean;
}

export interface IChatMessage {
  id: number;
  senderId?: number;
  receiverId?: number;
  senderEmail?: string;
  receiverEmail?: string;
  messageType?: 'TEXT' | 'FILE';
  message: string;
  fileUrl?: string | null;
  createdAt?: string;
  isRead?: boolean;
  readAt?: string;
  // Campos snake_case del backend
  sender_id?: number;
  receiver_id?: number;
  sender_email?: string;
  receiver_email?: string;
  created_at?: string;
}