import { Outlet, useMatch, useNavigate } from 'react-router';
import type { Route } from './+types/auth-layout';
import authServices from '~/services/auth-services';
import customNotifications from '~/utils/customNotifications';
import { useEffect, useState } from 'react';
import userServices from '~/services/user-services';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie');

  console.log(cookieHeader)

  if (!cookieHeader) return false;

  return true;
};

const AuthLayout = ({ loaderData }: Route.ComponentProps) => {
  const hasToken = loaderData;
  const [user, setUser] = useState(null);
  const loginMatch = useMatch('login');
  const registerMatch = useMatch('register');
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const user = await authServices.me();

      setUser(user.user);
    } catch (err: any) {
      customNotifications.showError(err.message || '獲取使用者失敗');
    }
  };

  useEffect(() => {
    console.log(hasToken)
    if (hasToken && (loginMatch || registerMatch)) navigate('/');
    if (hasToken && !user) getUser();
    if (!hasToken) navigate('login');
  }, [hasToken]);

  useEffect(() => {
    if (!hasToken) return;

    const heartbeat = async () => {
      await userServices.heartbeat();
    };

    heartbeat();

    const intervalId = setInterval(heartbeat, 30000);

    return () => clearInterval(intervalId);
  }, [hasToken]);

  return <Outlet context={{ user, getUser }} />;
};

export default AuthLayout;
