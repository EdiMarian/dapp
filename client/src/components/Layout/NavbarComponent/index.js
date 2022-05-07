import * as React from 'react';
import { useState, useEffect } from 'react';

import { Navbar, Container, Nav } from 'react-bootstrap';

import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import {
  faWallet,
  faPowerOff,
  faHorse,
  faBook,
  faUser,
  faList
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'assets/Logo';

import modifiable from 'helpers/modifiable';
import styles from './styles.module.scss';
import axios from 'axios';

const NavbarComponent = () => {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  const { address } = useGetAccountInfo();
  const [heroTag, setHeroTag] = useState('');
  const fetchHeroTag = `https://api.elrond.com/accounts/${address}`;
  const getHeroTag = () => {
    axios.get(fetchHeroTag).then((res) => setHeroTag(res.data.username));
  };
  useEffect(() => getHeroTag(), []);
  const buttons = [
    {
      icon: <FontAwesomeIcon icon={faWallet} />,
      label: heroTag ? `@${heroTag.replace('.elrond', '')}` : address.substr(0, 8) + '...' + address.substr(address.length - 8),
      onClick: () => navigator.clipboard.writeText(address)
    },
    {
      icon: <FontAwesomeIcon icon={faHorse} />,
      label: 'Race',
      onClick: () => routeChange('/race')
    },
    {
      icon: <FontAwesomeIcon icon={faBook} />,
      label: 'History',
      onClick: () => routeChange('/raceHistory')
    },
    {
      icon: <FontAwesomeIcon icon={faList} />,
      label: 'Category',
      onClick: () => routeChange('/category')
    },
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      label: 'Account',
      onClick: () => routeChange('/account')
    },
    {
      icon: <FontAwesomeIcon icon={faPowerOff} />,
      label: 'Disconnect',
      onClick: () => logout('/unlock')
    }
  ];

  return (
    <Navbar className={styles.nav} expand="md">
      <Container fluid>
      <Navbar.Brand>
        <Link to='/' className={styles.heading}>
          <Logo width={50} height={50} />
          <span className={styles.title + ' ml-3'}>Estar</span>
      </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" className='bg-white' />
      <Navbar.Collapse id="navbarScroll" className="justify-content-end">

      <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '100px' }}
        navbarScroll
      >
      <div className={styles.buttons}>
        {buttons.map((button) => (
          <div
            key={button.label}
            className={modifiable(
              'button',
              [button.onClick && 'clickable'],
              styles
            )}
            onClick={button.onClick}
          >
            <div className={styles.icon}>{button.icon}</div>
            <span>{button.label}</span>
          </div>
        ))}
      </div>
    </Nav>
    </Navbar.Collapse>
    </Container>
    </Navbar>
  );
};

export default NavbarComponent;
