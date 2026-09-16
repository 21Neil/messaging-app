import { Avatar, Button, FileInput, Text } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useRef, useState } from 'react';
import { useSubmit } from 'react-router';
import {
  changeAvatarSchema,
  type ChangeAvatarFormValues,
} from '~/services/user-services';
import { compressImg } from '~/utils/compressImg';
import styles from '../user.module.css';

interface AvatarFormProps {
  getUser: () => void;
  avatarUrl: string;
}

const AvatarForm = ({ getUser, avatarUrl }: AvatarFormProps) => {
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
  const submit = useSubmit();
  const compressedAvatar = useRef<File | null>(null);
  const form = useForm<ChangeAvatarFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      avatar: null,
      oldAvatarUrl: '',
    },
    validate: schemaResolver(changeAvatarSchema),
  });

  const handleChangeAvatar = async (value: File | null) => {
    form.setFieldValue('avatar', value);
    if (!value) setAvatarPreviewUrl('');
    if (value) {
      compressedAvatar.current = await compressImg(value);
      setAvatarPreviewUrl(URL.createObjectURL(compressedAvatar.current));
    }
  };

  const handleCancel = () => {
    form.reset();
    setAvatarPreviewUrl('');
  };

  const handleSubmit = async (values: ChangeAvatarFormValues) => {
    const formdata = new FormData();

    if (values.avatar) {
      const compressedImg = await compressImg(values.avatar);

      formdata.append('avatar', compressedImg);
      formdata.append('oldAvatarUrl', avatarUrl);
    }

    formdata.append('intent', 'changeAvatar');
    await submit(formdata, { method: 'patch', encType: 'multipart/form-data' });
    getUser();
    form.reset();
  };

  useEffect(() => {
    setAvatarPreviewUrl('');
  }, [avatarUrl])

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Text fz={14} fw={700}>
        頭像
      </Text>
      <label className={styles.avatarLabel}>
        <FileInput
          key={form.key('avatar')}
          {...form.getInputProps('avatar')}
          accept='image'
          onChange={handleChangeAvatar}
          className={styles.avatarInput}
        />
      </label>
      <Avatar w={100} h={100} mb={8} src={avatarPreviewUrl || avatarUrl} />
      <Button
        px={8}
        disabled={!form.isDirty() || form.submitting}
        type='button'
        color='gray'
        mr={4}
        onClick={handleCancel}
      >
        取消
      </Button>
      <Button
        px={8}
        disabled={!form.isDirty() || form.submitting}
        type='submit'
      >
        修改
      </Button>
    </form>
  );
};

export default AvatarForm;
