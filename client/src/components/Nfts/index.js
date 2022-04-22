import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { io } from 'socket.io-client';
import styles from './styles.module.scss';

const Nfts = (props) => {
  const { address } = useGetAccountInfo();
  const [nft, setNft] = useState([]);
  useEffect(() => {
   const s = io('http://176.223.121.41:4000');
   s.emit('get-nfts', address);
   function handler (data) {
      setNft(data);
   }
   s.on('recive-nfts', handler);
   return () => {
      s.disconnect();
   }
  }, []);

  return (
    <div className='row'>
      {nft ? (
        nft.map(({ fileUri, name, stamina, inRace, race }) => (
          <div key={name} className='col-12 col-md-3 text-center'>
            <img src={fileUri} className='rounded d-block mx-auto' height='250px' />
            <p
              style={props.color ? { color: props.color } : { color: 'white' }}
            >
              {name}
            </p>
              {props.withDetails ? <p className='text-white'>Stamina: {stamina}</p> : ''}
              {inRace
                ?
                  <Link to={`/race/${race}`}>
                    <button className='btn btn-primary'>Race</button>
                  </Link>
                : ''
              }
          </div>
        ))
      ) : (
        <p>You don&apos;t have EquiStar Nfts.</p>
      )}
    </div>
  );
};

export default Nfts;
