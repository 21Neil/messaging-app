import z from 'zod';
import { apiGet, apiPost } from './services';

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

const chatroomServices = {
  getChatrooms: () => apiGet('/chatrooms'),
  createChatroom: (body: createChatroomFormValues) => apiPost('/chatrooms', body),
};

export default chatroomServices;
