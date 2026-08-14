import { Outlet, redirect, useMatch, useNavigate } from 'react-router';
import type { Route } from './+types/auth-layout';
import authServices from '~/services/auth-services';
import customNotifications from '~/utils/customNotifications';
import { useEffect, useState } from 'react';

export const loader = async ({ request, pattern }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie');

  if (!cookieHeader) return false;

  return true;
};

const AuthLayout = ({ loaderData }: Route.ComponentProps) => {
  const hasToken = loaderData;
  const [user, setUser] = useState(null);
  const loginMatch = useMatch('login');
  const registerMatch = useMatch('register');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await authServices.me();

        setUser(user);
      } catch (err: any) {
        customNotifications.showError(err.message || '獲取使用者失敗');
      }
    };

    if (hasToken && (loginMatch || registerMatch))
      navigate('/');

    if (hasToken && !user) getUser();
  }, [hasToken]);

  return <Outlet context={user} />;
};

export default AuthLayout;
