import z from "zod";
import { apiGet, apiPatch, apiPost } from "./services";
import type { Member } from './chatroom-services';

export interface FriendRequest {
  id: number;
  sender: Member;
}

type GetFriendRequestsRes = FriendRequest[];

export const addFriendSchema = z.object({
  username: z.string().min(1, '請輸入使用者名稱')
});

export type AddFriendFormValues = z.infer<typeof addFriendSchema>;

const friendServices = {
  addFriend: (body: AddFriendFormValues) => apiPost('/friends', body),
  getFriendRequests: () => apiGet<GetFriendRequestsRes>('/friends'),
  acceptFriend: (id: number) => apiPatch('/friends', { id }),
}

export default friendServices;
