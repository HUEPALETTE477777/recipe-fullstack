// HOLDS THE BROWSER ROUTER FROM ROUTER.tsx
// ROUTER.tsx WILL HOLD LAYOUT + ROUTES
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router.tsx'

export default function App() {
  return <RouterProvider router={router} />;
}
