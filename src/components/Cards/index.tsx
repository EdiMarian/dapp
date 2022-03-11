import * as React from 'react';
import { useEffect, ReactNode, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import Logo from 'assets/Logo';
import { faAnchor, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios';
import { useLocation } from 'react-router-dom';

import modifiable from 'helpers/modifiable';
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

  const mintedUrl =
    'https://api.elrond.com/nfts/count?collection=EQUISTAR-3f393f';
  const estarWalletUrl = `https://api.elrond.com/accounts/${address}/tokens/ESTAR-afaaf0`;
  const [estarWallet, setEstarWallet] = useState(0);
  const fetchEstarWallet = () => {
    axios.get(estarWalletUrl).then((res) => {
      setEstarWallet(res.data.balance);
    });
  };
  const estarWalletDec = estarWallet / 100;
  const walletNftsUrl = `https://api.elrond.com/accounts/${address}/nfts?collection=EQUISTAR-3f393f`;
  const [minted, setMinted] = useState();
  const [nftWallet, setNftWallet] = useState();

  const getNftsMinted = () => {
    axios.get(mintedUrl).then((res) => {
      setMinted(res.data);
    });
  };

  const getNftsWallet = () => {
    axios.get(walletNftsUrl).then((res) => {
      setNftWallet(res.data.length);
    });
  };

  const cards: Array<CardType> = [
    {
      label: 'Nfts minted',
      data: {
        value: minted
      },
      colors: ['#2044F5', '#1B37C0'],
      icon: <FontAwesomeIcon icon={faAnchor} />
    },
    {
      label: 'Balance',
      colors: ['#33cc33', '#2eb82e'],
      icon: <Logo />,
      data: {
        value: `${estarWalletDec} ESTAR`
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
  useEffect(getNftsMinted, []);
  useEffect(getNftsWallet, []);
  useEffect(fetchEstarWallet, []);
  return (
    <div className={styles.cards}>
      {cards.map((card) => {
        const [alpha, beta] = card.colors;
        const background = `linear-gradient(180deg, ${alpha} 0%, ${beta} 100%)`;
        const interactive = card.modal && location.pathname === '/admin';

        return (
          <div key={card.label} className={styles.card} style={{ background }}>
            <div className={styles.heading}>
              <span style={{ fontSize: 20, fontWeight: 400 }}>
                {card.label}
              </span>
              <div
                style={{ fill: 'white' }}
                className={modifiable('icon', [interactive && 'fill'], styles)}
              >
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
