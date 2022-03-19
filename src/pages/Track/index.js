import React from 'react';
import { useState, useEffect } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import styles from './styles.module.scss';

function Track() {
  const loc = useLocation().pathname.replace('/race/track/', '');
  const { address } = useGetAccountInfo();
  const nftFetchUrl = `https://api.elrond.com/accounts/${address}/nfts?collection=EQUISTAR-3f393f`;
  const nftWalletFetch = () => fetch(nftFetchUrl).then((res) => res.json());
  const [nft, setNft] = useState([]);
  const [slots, setSlots] = useState(0);
  const [clasa, setClasa] = useState('');
  useEffect(() => {
    getSlotsAvailable();
    nftWalletFetch().then((data) => setNft(data));
  }, []);

  useEffect(() => {
    getSlotsAvailable();
    getClass();
  }, [slots]);

  const getSlotsAvailable = () => {
    axios
      .get(`http://localhost:4000/race/track/${loc}`)
      .then((res) => setSlots(res.data.length));
  };

  const getClass = () => {
    if (slots < 7) {
      setClasa('A');
    } else if (slots > 7 && slots < 15) {
      setClasa('B');
    } else if (slots > 15 && slots < 23) {
      setClasa('C');
    } else if (slots > 23 && slots < 31) {
      setClasa('D');
    }
  };

  function createRace(e) {
    getSlotsAvailable();
    if (slots != null) {
      console.log(slots);
      getClass();
      if (clasa) {
        console.log(clasa);
        axios.post('http://localhost:4000/race/enter', {
          address: address,
          horse: e.name,
          track: {
            name: loc,
            class: clasa
          },
          fee: {
            paid: true,
            pwith: 'EGLD'
          }
        });
      }
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Select your horse!</h1>
      <div className={styles.nftGrid}>
        {nft ? (
          nft.map((item) => (
            <div
              key={item.identifier}
              className={styles.nftContent}
              onClick={() => createRace(item)}
            >
              <img src={item.url} className={styles.img} />
            </div>
          ))
        ) : (
          <p>You don&apos;t have EquiStar Nfts.</p>
        )}
      </div>
    </div>
  );
}

export default Track;
