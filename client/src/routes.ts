import { ComponentType } from 'react';
import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';

import Home from './pages/Home';
import Race from './pages/Race';
import RaceView from './pages/Race/View';
import Stable from 'pages/Stable';
import Tournament from 'pages/Tournament';
import Leaderboard from 'pages/Leaderboard';
import RaceHistory from 'pages/RaceHistory';
import Route from 'pages/Category';
import Account from 'pages/Account';
import EditAccount from 'pages/Account/Edit';
import CreateAccount from 'pages/Account/Create';

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
  raceView: '/race/:id',
  raceHistory: '/raceHistory',
  route: '/category',
  stable: '/stable',
  tournament: '/tournament',
  leaderboard: '/leaderboard',
  account: '/account',
  createAccount: '/account/create',
  editAccount: '/account/edit',
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
    title: 'Race View',
    component: RaceView
  },
  {
    path: routeNames.raceHistory,
    title: 'Race History',
    component: RaceHistory
  },
  {
    path: routeNames.route,
    title: 'Category',
    component: Route
  },
  {
    path: routeNames.stable,
    title: 'Stable',
    component: Stable
  },
  {
    path: routeNames.tournament,
    title: 'Tournament',
    component: Tournament
  },
  {
    path: routeNames.leaderboard,
    title: 'Leaderboard',
    component: Leaderboard
  },
  {
    path: routeNames.account,
    title: 'Account',
    component: Account
  },
  {
    path: routeNames.createAccount,
    title: 'Create Account',
    component: CreateAccount
  },
  {
    path: routeNames.editAccount,
    title: 'Edit Account',
    component: EditAccount
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
