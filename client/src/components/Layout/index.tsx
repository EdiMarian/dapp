import React from 'react';
import { ReactNode } from 'react';

import {
  AuthenticatedRoutesWrapper,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import routes, { routeNames } from 'routes';
import NavbarComponent from './NavbarComponent';
import Footer from './Footer';

const Layout = ({ children }: { children: ReactNode }) => {
  const { search } = useLocation();
  const { address } = useGetAccountInfo();

  return (
    <div className='d-flex flex-column flex-fill wrapper'>
      {Boolean(address) && <NavbarComponent />}

      <main className='d-flex flex-column flex-grow-1'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${routeNames.unlock}${search}`}
        >
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
      {Boolean(address) && <Footer />}
    </div>
  );
};

export default Layout;
