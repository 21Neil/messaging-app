import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('layouts/auth-layout.tsx', [
    index('routes/home/home.tsx'),
    route('register', 'routes/register/register.tsx'),
    route('login', 'routes/login/login.tsx'),
    route('chatroom/:id', 'routes/chatroom/chatroom.tsx'),
  ]),
] satisfies RouteConfig;
