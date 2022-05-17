import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { io } from 'socket.io-client';
import styles from './styles.module.scss';
import { backend } from 'config';

const Nfts = (props) => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(true);
  const [nft, setNft] = useState(null);
  useEffect(() => {
   const s = io(backend);
   s.emit('get-status', address);
   function handler (data) {
      setNft(data);
      setLoading(false);
   }
   s.on('recive-status', handler);
   return () => {
      s.disconnect();
   }
  }, []);

  if(loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-center text-white">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className='row'>
          {nft !== null ? (
          nft.map(({ fileUri, name, stamina, inRace, race }) => (
            <div key={name} className="col-12 col-md-3">
              <div className={styles.boxNft}>
                <div className={styles.boxNftContent}>
                  <img src={fileUri} className={styles.img} />
                  <h4 className={styles.name}>{name}</h4>
                  <h3 className={styles.stamina}>Stamina: {stamina}</h3>
                  {inRace ? (
                    <Link to={`/race/${race}`}>
                      <button className={styles.btn}>View Race</button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>You don&apos;t have EquiStar Nfts.</p>
        )}
        </div>
      </div>
    );
  }
};

export default Nfts;
