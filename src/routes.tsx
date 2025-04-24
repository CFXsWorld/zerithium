import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';
import Dashboard from '@/pages/lending/dashboard';
import Market from '@/pages/lending/market';
import MarketDetail from '@/pages/lending/market/MarketDetail';

const routes = [
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="lending" replace />,
      },
      {
        path: 'lending',
        children: [
          {
            path: '',
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'market',
            element: <Market />,
          },
          {
            path: 'market/:address',
            element: <MarketDetail />,
          },
        ],
      },
    ],
  },
];

export default routes;
