import { Button } from '@mantine/core';
import { MdOutlineInsertPhoto } from 'react-icons/md';
import { useSubmit } from 'react-router';
import { compressImg } from '~/utils/compressImg';
import styles from '../chatroom.module.css';

const ImageInput = () => {
  const submit = useSubmit();

  const handleFileOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      const formdata = new FormData();
      const compressedImg = await compressImg(file);

      formdata.append('image', compressedImg);
      formdata.append('intent', 'send-image');

      await submit(formdata, { method: 'post', encType: 'multipart/form-data' });
    }
  }
  
  return (
    <form>
      <Button type='button' variant='transparent' p={6} fz={16}>
        <MdOutlineInsertPhoto />
        <label className={styles.imageLabel}>
          <input
            type='file'
            className={styles.imageInput}
            accept='image'
            onChange={handleFileOnChange}
          />
        </label>
      </Button>
    </form>
  );
};

export default ImageInput;
