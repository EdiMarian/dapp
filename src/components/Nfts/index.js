import React from 'react';
import { useState, useEffect } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import styles from './styles.module.scss';

const Nfts = () => {
  const { address } = useGetAccountInfo();
  const nftFetchUrl = `https://api.elrond.com/accounts/${address}/nfts?collection=EQUISTAR-3f393f`;
  const nftWalletFetch = () => fetch(nftFetchUrl).then((res) => res.json());
  const [nft, setNft] = useState([]);
  useEffect(() => {
    nftWalletFetch().then((data) => setNft(data));
  }, []);

  return (
    <div className={styles.nftGrid}>
      {nft ? (
        nft.map((item) => (
          <div key={item.identifier} className={styles.nftContent}>
            <img src={item.url} className={styles.img} />
            <p>{item.name}</p>
          </div>
        ))
      ) : (
        <p>You don&apos;t have EquiStar Nfts.</p>
      )}
    </div>
  );
};

export default Nfts;
