import { Outlet, redirect } from 'react-router';
import type { Route } from './+types/auth-layout';

export const loader = async ({ request, pattern }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  console.log(cookieHeader);

  if (!cookieHeader && pattern !== 'login' && pattern !== 'register')
    throw redirect('/login');
  if (cookieHeader && (pattern === 'login' || pattern === 'register'))
    throw redirect('/');
};

const AuthLayout = () => <Outlet />;

export default AuthLayout;
