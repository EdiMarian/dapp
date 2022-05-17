import * as React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';

import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'assets/Logo';

import styles from './styles.module.scss';
import user from '../../../assets/img/user.png';

const NavbarComponent = () => {
  let navigate = useNavigate();
  const { address } = useGetAccountInfo();
  
  const buttons = [
    {
      label: 'Race',
      link: '/race'
    },
    {
      label: 'History',
      link: '/raceHistory'
    },
    {
      label: 'Stable',
      link: '/stable'
    },
    {
      label: 'Tournament',
      link: '/tournament'
    },
    {
      label: 'Leaderboard',
      link: '/leaderboard'
    }
  ];

  return (
    <Navbar expand="md" variant='dark'>
      <Container fluid className="d-flex">
      <Navbar.Brand>
        <Link to='/' className='text-light text-decoration-none d-flex align-items-center'>
          <Logo width={50} height={50} />
          <span className={styles.title}>Equistar</span>
      </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll" className="justify-content-end">

      <Nav
        className="align-items-center"
        style={{ maxHeight: '100px' }}
        navbarScroll
      >
      <NavDropdown style={{ marginRight: "15px" }} title={
        <Image src={user} height='40px' roundedCircle/>
      }>
        <NavDropdown.Item onClick={() => navigate('/account')}>
          Account
        </NavDropdown.Item>
        <NavDropdown.Item>
          <span onClick={() => logout()}>Log out</span>
        </NavDropdown.Item>
      </NavDropdown>
      {buttons.map((button) => (
          <Link
            key={button.label}
            to={button.link}
            className='mr-3 text-light text-decoration-none'
            style={{ fontSize: '16.5px', marginRight: '15px' }}
          >
            {button.label}
          </Link>
        ))}
    </Nav>
    </Navbar.Collapse>
    </Container>
    </Navbar>
  );
};

export default NavbarComponent;
