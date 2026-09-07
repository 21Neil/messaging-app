import z from 'zod';
import { nameSchema } from './common-schema';
import { apiPatch, apiPost } from './services';

export const changeNameSchema = z.object({
  name: nameSchema
});

export type changeNameFormValues = z.infer<typeof changeNameSchema>;

const userServices = {
  changeName: (id: number, body: changeNameFormValues) => apiPatch(`/users/${id}/name`, body)
}

export default userServices
