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
  const [nft, setNft] = useState([]);
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
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-center text-white">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='row'>
        {nft != [] ? (
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
  }
};

export default Nfts;
