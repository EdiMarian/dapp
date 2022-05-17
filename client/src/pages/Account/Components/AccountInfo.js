import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../styles.module.scss';

import user from '../../../assets/img/user (1).png';

const AccountInfo = ({ account, socket }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [data, setData] = useState({
    race_played: 0,
    winrate: 0,
    race_won: 0,
    nfts: 0,
    stable_level: 0,
    estar: 0,
    tournament_played: 0,
    tournament_won: 0
  });

  useEffect(() => {
    if(socket == null ) return;
    socket.emit('load-account', account.address);
  }, [socket])

  useEffect(() => {
    if(socket == null) return;
    socket.on('get-account', data => {
      setUsername(data.account.username);
      setData(data.accountStatistics);
    });
  }, [socket]);
  return (
      <div className="container">
        <div className="row mt-4">
          <div className="col-12">
            <div className="col-12">
              <h1 className={styles.helloTitle}>Hello,&nbsp;
                <span className={styles.helloUsername}>
                {username}!
                </span>
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col-12 col-md-4 m-auto">
              <div className={styles.img}>
                <img src={user} />
              </div>
              <button
                onClick={() => navigate('/account/edit')}
                className={styles.editButton}
              >
                Edit profile
              </button>
            </div>
            <div className="col-12 col-md-8">
              <h1 className={styles.statisticsTitle}>Statistics</h1>
              <div className={styles.statisticsData}>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>race played</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.race_played}</p>
                </div>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>winrate</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.winrate}%</p>
                </div>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>race won</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.race_won}</p>
                </div>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>your nfts</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.nfts}</p>
                </div>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>stable level</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.stable_level}</p>
                </div>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>estar</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.estar}</p>
                </div>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>tournament played</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.tournament_played}</p>
                </div>
                <div className={styles.statisticsDataContent}>
                  <h1 className={styles.statisticsDataContentEl}>tournament won</h1>
                  <p className={styles.statisticsDataContentParagraf}>{data.tournament_won}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
  );
}

export default AccountInfo;
