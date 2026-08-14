import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('layouts/auth-layout.tsx', [
    index('routes/home.tsx'),
    route('register', 'routes/register.tsx'),
    route('login', 'routes/login.tsx'),
    route('chatroom/:id', 'routes/chatroom.tsx')
  ]),
] satisfies RouteConfig;
