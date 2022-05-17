import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss';
import { io } from 'socket.io-client';
import { backend } from 'config';

const GeneralStats = () => {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState({
    races_played: 0,
    races_ongoing: 0,
    estar_rewards: 0,
    egld_rewards: 0,
    nfts_minted: 0,
    total_nfts: 10010
  });
  
  useEffect(() => {
    const s = io(backend);
    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, [])

  useEffect(() => {
    if(socket == null) return;
    socket.emit('get-general-stats');
    socket.on('recive-general-stats', data => setData(data));
  }, [socket])
  return (
    <>
      <h2 className={styles.generalStatsTitle}>General STATS</h2>
      <div className={styles.generalStats}>
        <div className={styles.generalStatsData}>
          <h4 className={styles.statsDataEl}>
            <strong>RACES PLAYED</strong>
            <p className={styles.statsDataElParagraf}>{data.races_played}</p>
          </h4>
          <h4 className={styles.statsDataEl}>
            <strong>RACES ONGOING</strong>
            <p className={styles.statsDataElParagraf}>{data.races_ongoing}</p>
          </h4>
          <h4 className={styles.statsDataEl}>
            <strong>estar rewards</strong>
            <p className={styles.statsDataElParagraf}>{data.estar_rewards}</p>
          </h4>
          <h4 className={styles.statsDataEl}>
            <strong>egld rewards</strong>
            <p className={styles.statsDataElParagraf}>{data.egld_rewards}</p>
          </h4>
          <h4 className={styles.statsDataEl}>
            <strong>NFTS MINTED</strong>
            <p className={styles.statsDataElParagraf}>{data.nfts_minted}</p>
          </h4>
          <h4 className={styles.statsDataEl}>
            <strong>TOTAL NFTS</strong>
            <p className={styles.statsDataElParagraf}>{data.total_nfts}</p>
          </h4>
        </div>
      </div>
      <div className={styles.generalDistributionSp}>
        <h4
        className={styles.generalDistribution}
      >
        <strong>Daily distribution</strong>
      </h4>
      <h4
        className={styles.generalDistribution}
      >
        50.000 ESTAR
      </h4>
      </div>  
    </>
  );
}

export default GeneralStats;
