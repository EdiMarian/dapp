import { ComponentType } from 'react';
import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';

import Home from './pages/Home';
import Race from './pages/Race';
import RaceView from './pages/Race/View';

export interface RouteType {
  path: string;
  title: string;
  authenticatedRoute?: boolean;
  component: ComponentType;
}

export const routeNames = {
  home: '/',
  transaction: '/transaction',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  race: '/race',
  raceView: '/race/:id'
};

const routes: Array<RouteType> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.race,
    title: 'Race',
    component: Race
  },
  {
    path: routeNames.raceView,
    title: 'Race :id',
    component: RaceView
  }
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${dAppName} • ${route.title}`
    : `Elrond ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
