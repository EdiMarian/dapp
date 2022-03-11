import * as React from 'react';
import { useState, useEffect } from 'react';

import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { faWallet, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Logo from 'assets/Logo';

import modifiable from 'helpers/modifiable';
import styles from './styles.module.scss';
import axios from 'axios';

const Navbar = () => {
  const { address } = useGetAccountInfo();
  const [heroTag, setHeroTag] = useState('');
  const fetchHeroTag = `https://api.elrond.com/accounts/${address}`;
  const getHeroTag = () => {
    axios.get(fetchHeroTag).then((res) => setHeroTag(res.data.username));
  };
  useEffect(() => getHeroTag(), []);
  const buttons = [
    {
      icon: <FontAwesomeIcon icon={faWallet} size='lg' />,
      label: heroTag ? `@${heroTag.replace('.elrond', '')}` : address,
      onClick: () => navigator.clipboard.writeText(address)
    },
    {
      icon: <FontAwesomeIcon icon={faPowerOff} />,
      label: 'Disconnect',
      onClick: () => logout(`${location.origin}/unlock`)
    }
  ];

  return (
    <nav className={styles.nav}>
      <Link to='/dashboard' className={styles.heading}>
        <span className={styles.logo}>
          <Logo />
        </span>

        <span className={styles.title}>Estar</span>
      </Link>

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
    </nav>
  );
};

export default Navbar;
