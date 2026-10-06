import imageCompression from 'browser-image-compression';

export const compressAvatar = async (img: File) => {
  return await imageCompression(img, {
    maxSizeMB: 1,
    maxWidthOrHeight: 500,
    initialQuality: 0.9,
    useWebWorker: true,
  });
};

export const compressImg = async (img: File) => {
  return await imageCompression(img, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1980,
    initialQuality: 0.9,
    useWebWorker: true,
  });
};
