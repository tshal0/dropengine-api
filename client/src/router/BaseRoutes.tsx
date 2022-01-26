import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import React from 'react';
import { SuspenseLoader } from 'components/SuspenseLoader';

const Loader = (Component: any) => (props: any) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Status

const Status404 = Loader(
  lazy(() => import('content/pages/Status/Status404/Status404Page'))
);
const Status500 = Loader(
  lazy(() => import('content/pages/Status/Status500/Status500Page'))
);
const StatusComingSoon = Loader(
  lazy(() => import('content/pages/Status/ComingSoon/ComingSoonPage'))
);
const StatusMaintenance = Loader(
  lazy(() => import('content/pages/Status/Maintenance/MaintenancePage'))
);

const baseRoutes = [
  {
    path: 'status',
    children: [

      {
        path: '500',
        element: <Status500 />
      },
      {
        path: 'maintenance',
        element: <StatusMaintenance />
      },
      {
        path: 'coming-soon',
        element: <StatusComingSoon />
      },
      {
        path: '*',
        element: <Status404 />
      },
    ]
  },
  {
    path: '*',
    element: <Status404 />
  }
];

export default baseRoutes;
