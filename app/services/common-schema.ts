import z from 'zod'

export const passwordSchema = z
  .string()
  .min(8, { message: '密碼需多於8字元' })
  .max(100, { message: '密碼需少於100個字元' });

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: '請輸入暱稱' })
  .max(50, { message: '暱稱最多50個字元' });
