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

export interface IChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
  isRead?: boolean;
}