import z from 'zod';
import { apiDelete, apiGet, apiPatch, apiPost } from './services';
import Chatroom from '~/routes/chatroom/chatroom';

interface getChatroomsRes {
  chatroom: Chatroom[];
}

interface getChatroomRes {
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
}

export interface Message {
  id: number;
  content: string;
  createAt: string;
  chatroomId: number;
  senderId: number;
  sender: Sender;
}

interface Sender {
  id: number;
  name: string;
  avatar: string;
}

const messageSchema = z.object({
  content: z.string().min(1),
});

export type messageFromValue = z.infer<typeof messageSchema>;

export const createChatroomSchema = z
  .object({
    name: z.string().optional(),
    members: z.array(z.string()).min(1, { message: '最少邀請一個成員' }),
  })
  .refine(data => !(data.members.length > 1 && !data.name), {
    error: '請輸入聊天室名稱',
    path: ['name'],
  });

export type createChatroomFormValues = z.infer<typeof createChatroomSchema>;

export const changeChatroomNameSchema = (members: Member[]) =>
  z
    .object({
      name: z.string().optional(),
    })
    .refine(data => !(members.length > 2 && !data.name), {
      error: '請輸入聊天室名稱',
      path: ['name'],
    });

export type changeChatroomNameFormValues = z.infer<ReturnType<typeof changeChatroomNameSchema>>;

const chatroomServices = {
  getChatrooms: () => apiGet<getChatroomsRes>('/chatrooms'),
  createChatroom: (body: createChatroomFormValues) =>  apiPost('/chatrooms', body),
  getChatroom: (id: number) => apiGet<getChatroomRes>(`/chatrooms/${id}`),
  createMessage: (id: number, body: messageFromValue) => apiPost(`/chatrooms/${id}/messages`, body),
  changeChatroomName: (id: number, body: changeChatroomNameFormValues) => apiPatch(`/chatrooms/${id}`, body),
  deleteChatroom: (id: number) => apiDelete(`/chatrooms/${id}`),
};

export default chatroomServices;
