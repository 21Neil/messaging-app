import { Outlet, redirect } from 'react-router';
import authServices from '~/services/auth-services';
import { useEffect } from 'react';
import userServices from '~/services/user-services';
import type { Route } from './+types/auth-layout';

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const res = await authServices.me();
  const user = res?.user;
  const path = new URL(request.url).pathname;
  const isPublicUrl = path === '/login' || path === '/register';

  if (!user && !isPublicUrl) return redirect('/login');

  if (user && isPublicUrl) return redirect('/');

  return user;
};

const AuthLayout = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData;

  useEffect(() => {
    if (!user) return;

    const heartbeat = async () => {
      await userServices.heartbeat();
    };

    heartbeat();

    const intervalId = setInterval(heartbeat, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  return <Outlet context={{ user }} />;
};

export default AuthLayout;
