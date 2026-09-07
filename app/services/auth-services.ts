import { nameSchema, passwordSchema } from './common-schema';
import { apiDelete, apiGet, apiPost } from './services';
import z from 'zod';

const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: '使用者名稱需多於3字元' })
  .max(30, { message: '使用者名稱需少於30字元' })
  .regex(/^[A-Za-z0-9_]+$/, {
    message: '使用者名稱只能有字母，數字還有底線',
  });


export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: nameSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => !(data.password !== data.confirmPassword), {
    error: '密碼不一致',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterReq = Omit<RegisterFormValues, 'confirmPassword'>;

const authServices = {
  login: (body: LoginFormValues) => apiPost('/auth/login', body),
  logout: () => apiDelete('/auth/logout'),
  me: () => apiGet('/auth/me'),
  register: (body: RegisterReq) => apiPost('/auth/register', body),
};

export default authServices;
