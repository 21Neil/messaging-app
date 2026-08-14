import createError from '~/utils/createError';
import authServices from './auth-services';
import { redirect } from 'react-router';
import customNotifications from '~/utils/customNotifications';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(BASE_URL + endpoint, options);
    const body = await res.json();

    if (!res.ok)
      throw createError(
        res.status,
        body.message || `連線失敗: ${res.status}`,
        body?.code,
      );

    return body;
  } catch (err: any) {
    console.log(err.statusCode, err.code)
    if (err.statusCode === 401 && err.code !== 'INVALID_CREDENTIALS') {
      authServices.logout();
      throw redirect('/login');
    }
    customNotifications.showError(err.message || '連線失敗');
  }
};

export const apiGet = <T = any>(endpoint: string): Promise<T> =>
  customFetch(endpoint, {
    credentials: 'include',
  });

export const apiPost = <T = any>(endpoint: string, body: unknown): Promise<T> =>
  customFetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

export const apiDelete = <T = any>(endpoint: string): Promise<T> =>
  customFetch(endpoint, {
    method: 'DELETE',
    credentials: 'include',
  });
