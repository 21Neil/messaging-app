import z from 'zod';
import { nameSchema, passwordSchema } from './common-schema';
import { apiPatch, apiPatchFormdata } from './services';

export const changeNameSchema = z.object({
  name: nameSchema,
});

export type ChangeNameFormValues = z.infer<typeof changeNameSchema>;

export const changeAvatarSchema = z.object({
  avatar: z.file().nullable(),
  oldAvatarUrl: z.string(),
});

export type ChangeAvatarFormValues = z.infer<typeof changeAvatarSchema>;

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    error: '新密碼不一致',
    path: ['confirmPassword'],
  })
  .refine(data => data.password !== data.newPassword, {
    error: '新密碼不得與舊密碼相同',
    path: ['newPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
type ChangePasswordReq = Omit<ChangePasswordFormValues, 'confirmPassword'>;

const userServices = {
  changeName: (body: ChangeNameFormValues) => apiPatch('/users/name', body),
  changeAvatar: (body: FormData) => apiPatchFormdata('/users/avatars', body),
  changePassword: (body: ChangePasswordReq) =>
    apiPatch('/users/password', body),
};

export default userServices;
