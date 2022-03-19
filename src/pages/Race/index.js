import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import styles from './styles.module.scss';
import tracks from '../../components/Tracks';

const Race = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);
  return (
    <div>
      {tracks.map((track) => (
        <div key={track.name} className={styles.card}>
          <h2>{track.title}</h2>
          <p>{track.description}</p>
          <div>
            <span>
              Ranking prize:
              {track.ranking.map((rank) => (
                <p key={rank.name}>
                  {rank.name} {rank.win} ESTAR
                </p>
              ))}
            </span>
            <span>Entry fee: {track.entryFee}</span>
          </div>
          <div>{track.button}</div>
        </div>
      ))}
    </div>
  );
};

export default Race;
