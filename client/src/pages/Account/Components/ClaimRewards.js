import React, { useEffect, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import styles from '../styles.module.scss';
import { io } from 'socket.io-client';
import { backend } from 'config';

const ClaimRewards = () => {
  const { address } = useGetAccountInfo();
  const [socket, setSocket] = useState(null);
  const [estar, setEstar] = useState(null);
  const [egld, setEgld] = useState(null);
  useEffect(() => {
    const s = io(backend);
    setSocket(s);
    
    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {
    if(socket == null) return;
    socket.emit('get-rewards', address);
    socket.on('recive-rewards', (estar, egld) => {
      setEstar(estar);
      setEgld(egld);
    })
  }, [socket])

 return (
   <div className="container my-5">
     <div className="row">
      <div className="col-12 col-lg-5 mx-auto">
        <h1 className={styles.claimTitle}>races rewards</h1>
        <div className={styles.claimData}>
          <div className={styles.claimDataContent}>
            <h2 className={styles.claimDataContentEl}>your&nbsp;
              <span className={styles.claimDataContentToken}>$EGLD</span>
            </h2>
            <h1 className={styles.claimDataContentReward}>{egld}</h1>
          </div>
          <div className={styles.claimDataContent}>
            <h2 className={styles.claimDataContentEl}>your&nbsp;
              <span className={styles.claimDataContentToken}>$estar</span>
            </h2>
            <h1 className={styles.claimDataContentReward}>{estar}</h1>
          </div>
          <button disabled className={styles.claimBtn}>claim now!</button>
        </div>
      </div>
     </div>
   </div>
 )
}

export default ClaimRewards;
