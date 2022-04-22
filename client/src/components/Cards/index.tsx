import * as React from 'react';
import { useEffect, ReactNode, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import Logo from '../../assets/Logo';
import { faAnchor, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLocation } from 'react-router-dom';
import { NbNftsMint, fetchEstarWallet, getNfts } from '../../apiRequests';

import styles from './styles.module.scss';

interface CardType {
  label: string;
  colors: Array<string>;
  data: {
    value?: string | null;
  };
  title?: string;
  description?: string;
  modal?: ReactNode;
  icon: ReactNode;
}

const Cards: React.FC = () => {
  const location = useLocation();
  const { address } = useGetAccountInfo();
  const [minted, setMinted] = useState();
  const [estarWallet, setEstarWallet] = useState(0);
  const [nftWallet, setNftWallet] = useState();

  useEffect(() => {
    const fetch = async () => {
      const mints = await NbNftsMint().then((result) => result.data);
      setMinted(mints);
      const estar = await fetchEstarWallet(address).then(
        (result) => {
            if(result.data[0] != undefined) {
              return result.data[0].balance;
            } else {
              return 0;
            }
        }
      );
      setEstarWallet(estar / 100);
      const nfts = await getNfts(address).then((result) => result.data);
      setNftWallet(nfts.length);
    };
    fetch();
  }, []);

  const cards: Array<CardType> = [
    {
      label: 'Nfts minted',
      data: {
        value: minted || '0'
      },
      colors: ['#2044F5', '#1B37C0'],
      icon: <FontAwesomeIcon icon={faAnchor} />
    },
    {
      label: 'Balance',
      colors: ['#33cc33', '#2eb82e'],
      icon: <Logo />,
      data: {
        value: String(estarWallet)
      }
    },
    {
      label: 'Your NFTs',
      colors: ['#6CADEF', '#5B96D2'],
      icon: <FontAwesomeIcon icon={faFile} />,
      data: {
        value: nftWallet
      }
    }
  ];

  return (
    <div className={styles.cards}>
      {cards.map((card) => {
        const [alpha, beta] = card.colors;
        const background = `linear-gradient(180deg, ${alpha} 0%, ${beta} 100%)`;

        return (
          <div key={card.label} className={styles.card} style={{ background }}>
            <div className={styles.heading}>
              <span style={{ fontSize: 20, fontWeight: 400 }}>
                {card.label}
              </span>
              <div style={{ fill: 'white' }}>
                <span>{card.icon}</span>
              </div>
            </div>
            <div className={styles.value}>{card.data.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
