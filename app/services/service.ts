const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(BASE_URL + endpoint, options);

    if (!res.ok) throw new Error('連線失敗: ' + res.status);

    return await res.json();
  } catch (err) {
    console.error('Fetch error: ' + err);
  }
};

export const apiGet = async (endpoint: string) =>
  customFetch(endpoint, {
    credentials: 'include',
  });

export const apiPost = async (endpoint: string, body: unknown) =>
  customFetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

export const apiDelete = async (endpoint: string) =>
  customFetch(endpoint, {
    method: 'DELETE',
    credentials: 'include',
  });
