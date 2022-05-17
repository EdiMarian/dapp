import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import races from '../../components/Races';
import Button from '../../components/Button';
import { tokenName } from 'config';
import Slots from './Components/Slots';

import styles from './styles.module.scss';

const Race = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);
  return (
    <div className='container'>
      <div className='row mt-4'>
        {races.map((race) => (
          <div key={race.id} className='col-12 col-md-6 col-lg-4 mb-4 px-lg-4'>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.raceName}>
                  {race.name} #{race.id}
                </h3>
                <h5 className={styles.raceDescription}>
                  {race.description}
                </h5>
                <Slots race={race} address={address} />
                <h3 className={styles.racePrize}>Race prize</h3>
                {race.ranking.map((prize) => (
                  <div key={prize.win} className={styles.racePrizeContent}>
                    <h6 className={styles.racePrizeItem}>{prize.name}</h6>
                    <h6 className={styles.racePrizeItem}>
                      { race.withEgld ? `${prize.win} $EGLD` : `${prize.win} $${tokenName}`}
                    </h6>
                  </div>
                ))}
                <Button race={race} />
              </div>
            </div>
          </div>
        ))};
      </div>
    </div>
  );
};

export default Race;
