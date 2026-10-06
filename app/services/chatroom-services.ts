import z from 'zod';
import { apiDelete, apiGet, apiPatch, apiPost, apiPostFormdata } from './services';
import Chatroom from '~/routes/chatroom/chatroom';

interface GetChatroomsRes {
  chatroom: Chatroom[];
}

interface GetChatroomRes {
  chatroom: Chatroom;
}

interface Chatroom {
  id: number;
  name: string;
  members: Member[];
  messages?: Message[];
}

export interface Member {
  id: number;
  avatar: string;
  name: string;
  username: string;
}

export interface Message {
  id: number;
  content: string;
  createAt: string;
  chatroomId: number;
  senderId: number;
  sender: Sender;
  type: 'text' | 'image';
}

interface Sender {
  id: number;
  name: string;
  avatar: string;
}

export const messageSchema = z.object({
  content: z.string().min(1),
});

export type MessageFromValue = z.infer<typeof messageSchema>;

export const createChatroomSchema = z
  .object({
    name: z.string().optional(),
    members: z.array(z.string()).min(1, { message: '最少邀請一個成員' }),
  })
  .refine(data => !(data.members.length > 1 && !data.name), {
    error: '請輸入聊天室名稱',
    path: ['name'],
  });

export type CreateChatroomFormValues = z.infer<typeof createChatroomSchema>;

export const changeChatroomNameSchema = (members: Member[]) =>
  z
    .object({
      name: z.string().optional(),
    })
    .refine(data => !(members.length > 2 && !data.name), {
      error: '請輸入聊天室名稱',
      path: ['name'],
    });

export type ChangeChatroomNameFormValues = z.infer<ReturnType<typeof changeChatroomNameSchema>>;

export const joinChatroomFormSchema = (hasRoomName: boolean) => z
  .object({
    usernames: z.array(z.string()).min(1, { message: '最少邀請一個成員'})
  })
  .refine(() => hasRoomName, {
    error: '請先變更聊天室名稱',
    path: ['usernames']
  });

export type JoinChatroomFormValues = z.infer<ReturnType<typeof joinChatroomFormSchema>>;

export const createImageSchema = z.object({
  image: z.file().nullable(),
});

export type CreateImageFromValues = z.infer<typeof createImageSchema>;

const chatroomServices = {
  getChatrooms: () => apiGet<GetChatroomsRes>('/chatrooms'),
  createChatroom: (body: CreateChatroomFormValues) =>  apiPost('/chatrooms', body),
  getChatroom: (id: number) => apiGet<GetChatroomRes>(`/chatrooms/${id}`),
  createMessage: (id: number, body: MessageFromValue) => apiPost(`/chatrooms/${id}/messages`, body),
  changeChatroomName: (id: number, body: ChangeChatroomNameFormValues) => apiPatch(`/chatrooms/${id}`, body),
  deleteChatroom: (id: number) => apiDelete(`/chatrooms/${id}`),
  leaveChatroom: (id: number) => apiDelete(`/chatrooms/${id}/members`),
  joinChatroom: (id: number, body: JoinChatroomFormValues) => apiPost(`/chatrooms/${id}/members`, body),
  createImage: (id: number, body: FormData) => apiPostFormdata(`/chatrooms/${id}/messages/images`, body),
};

export default chatroomServices;
