import z from "zod";
import { apiPost } from "./services";

export const addFriendSchema = z.object({
  username: z.string().min(1, '請輸入使用者名稱')
});

export type AddFriendFormValues = z.infer<typeof addFriendSchema>;

const friendServices = {
  addFriend: (body: AddFriendFormValues) => apiPost('/friends', body)
}

export default friendServices;
