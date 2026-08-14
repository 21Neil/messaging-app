import { apiDelete, apiGet, apiPost } from './services';
import z from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, { message: '使用者名稱過短' }).trim(),
  password: z.string().min(1, { message: '請輸入密碼' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const authServices = {
  login: (body: LoginFormValues) => apiPost('/auth/login', body),
  logout: () => apiDelete('/auth/logout'),
  me: () => apiGet('/auth/me'),
};

export default authServices;
