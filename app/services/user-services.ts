import z from 'zod';
import { nameSchema } from './common-schema';
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

const userServices = {
  changeName: (id: number, body: ChangeNameFormValues) => apiPatch(`/users/${id}/name`, body),
  changeAvatar: (id: number, body: FormData) => apiPatchFormdata(`/users/${id}/avatars`, body),
};

export default userServices;
