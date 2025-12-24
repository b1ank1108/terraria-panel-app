import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { ConfigPage } from '../pages/ConfigPage';
import { ConsolePage } from '../pages/ConsolePage';
import { BackupPage } from '../pages/BackupPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'config', element: <ConfigPage /> },
      { path: 'console', element: <ConsolePage /> },
      { path: 'backups', element: <BackupPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
