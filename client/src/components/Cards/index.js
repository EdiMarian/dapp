import * as React from 'react';
import { useEffect, ReactNode, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import Logo from '../../assets/Logo';
import { faAnchor, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { io } from 'socket.io-client';

import { useLocation } from 'react-router-dom';

import styles from './styles.module.scss';
import { backend, tokenName } from 'config';

const Cards = () => {
  const location = useLocation();
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(true);
  const [minted, setMinted] = useState();
  const [estarWallet, setEstarWallet] = useState(0);
  const [nftWallet, setNftWallet] = useState();

  useEffect(() => {
    const s = io(backend);

    const handler = (data, mints, estar) => {
      setMinted(mints);
      setEstarWallet(estar);
      setNftWallet(data.length);
      setLoading(false);
    };

    s.emit('get-status', address);
    s.on('recive-status', handler);

    return () => {
      s.disconnect();
    }
  }, []);

  const cards = [
    {
      label: 'Nfts minted',
      data: {
        value: minted || '0'
      },
      colors: ['#2044F5', '#1B37C0'],
      icon: <FontAwesomeIcon icon={faAnchor} />
    },
    {
      label: tokenName,
      colors: ['#33cc33', '#2eb82e'],
      icon: <Logo width={25} height={25} />,
      data: {
        value: estarWallet || '0'
      }
    },
    {
      label: 'Your NFTs',
      colors: ['#6CADEF', '#5B96D2'],
      icon: <FontAwesomeIcon icon={faFile} />,
      data: {
        value: nftWallet || '0'
      }
    }
  ];

  return (
    <div className={styles.cards + ' row'}>
      {cards.map((card) => {
        const [alpha, beta] = card.colors;
        const background = `linear-gradient(180deg, ${alpha} 0%, ${beta} 100%)`;

        return (
          <div
            key={card.label}
            className={styles.card}
            style={{ background }}
          >
            <div className={styles.heading}>
              <span style={{ fontSize: 20, fontWeight: 400 }}>
                {card.label}
              </span>
              <div style={{ fill: 'white' }}>
                <span>{card.icon}</span>
              </div>
            </div>
            <div className={styles.value}>
              {loading ? (
                <div className="d-flex justify-content-center text-white">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                card.data.value
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
