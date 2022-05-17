import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { io } from 'socket.io-client';
import { backend } from '../../../config';

import styles from '../styles.module.scss';

const RaceView = () => {
  const { address } = useGetAccountInfo();
  const { pathname, hash } = useLocation();
  const path = pathname.replace('/race/', '');
  const id = path + hash;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(true);
  const [exist, setExist] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [race, setRace] = useState([]);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(() => {
    const s = io(backend);
    s.emit('get-race', {id, address});
    const handler = ({race, status, authorized}) => {
      if(race != null) {
        setRace(race);
        setStatus(status);
        setExist(true);
        setAuthorized(authorized);
      }
    }
    s.emit('get-players', path);

    const handle = (players) => {
      setPlayers(players);
    }

    s.on('recive-players', handle);
    s.on('recive-race', handler);
    return () => {
      s.disconnect();
    }
  }, []);
  useEffect(handleRedirect, [address]);
  return (
      <div className='container'>
        {exist
          ? (
            <>
              {authorized
                ? (
                  <>
                    {status
                      ? (
                        <>
                          <div className='row'>
                            <div className='col-12'>
                              <h1 className={styles.raceViewTitle}>Race #{race.id}</h1>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <h4 className={styles.raceViewPlayers}>Players: {players}/8</h4>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-12'>
                              <h3 className={styles.raceViewParticipants}>
                                <span>[</span>Race participants<span>]</span>
                              </h3>
                            </div>
                          </div>
                          <div className='row'>
                            {race.player.map((player) => (
                              <div
                                key={player.horse}
                                className='col-12 col-md-4'
                              >
                                <div className={styles.raceViewCard}>
                                  <div className={styles.raceViewCardContent}>
                                    <img
                                      className={styles.raceViewCardContentImg}
                                      src={player.horseUrl}
                                    />
                                    <h4 className={styles.raceViewCardContentHorseName}>
                                      {player.horse}
                                    </h4>
                                    <h5
                                      className={styles.raceViewCardContentAddress}
                                    >
                                      Address: <small>{player.address.substr(0, 8) + ' ... ' + player.address.substr(player.address.length - 8)}</small>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )
                : (
                  <>
                    <div className='row'>
                      <div className='col-12 text-white text-center'>
                        <h1 className={styles.raceViewTitle}>Race #{race.raceId} is over!</h1>
                      </div>
                    </div>
                    <div className='row mt-3'>
                      <div className='col-12 col-md-4'>
                        <div className={styles.raceViewCard + ' mt-3'}>
                          <div className={styles.raceViewCardContent}>
                            <img
                              className={styles.raceViewCardContentImg}
                              src={race.winners[1].horseUrl}
                            />
                            <h4 className={styles.raceViewCardContentHorseName}>
                                      {race.winners[1].horse}
                                    </h4>
                            <h5 className={styles.raceViewCardContentAddress}>Address: <small>{race.winners[1].address.substr(0, 8) + ' ... ' + race.winners[1].address.substr(race.winners[1].address.length - 8)}</small></h5>
                            <h4 className={styles.raceViewCardContentAddress}>Score: {race.winners[1].score}</h4>
                          </div>
                        </div>
                      </div>
                      <div className='col-12 col-md-4'>
                        <div className={styles.raceViewCard}>
                          <div className={styles.raceViewCardContent}>
                            <img
                              className={styles.raceViewCardContentImg}
                              src={race.winners[0].horseUrl}
                            />
                            <h4 className={styles.raceViewCardContentHorseName}>
                                      {race.winners[0].horse}
                                    </h4>
                            <h5 className={styles.raceViewCardContentAddress}>Address: <small>{race.winners[0].address.substr(0, 8) + ' ... ' + race.winners[0].address.substr(race.winners[0].address.length - 8)}</small></h5>
                            <h4 className={styles.raceViewCardContentAddress}>Score: {race.winners[0].score}</h4>
                          </div>
                        </div>
                      </div>
                      <div className='col-12 col-md-4'>
                        <div className={styles.raceViewCard + ' mt-4'}>
                          <div className={styles.raceViewCardContent}>
                            <img
                              className={styles.raceViewCardContentImg}
                              src={race.winners[2].horseUrl}
                            />
                            <h4 className={styles.raceViewCardContentHorseName}>
                                      {race.winners[2].horse}
                                    </h4>
                            <h5 className={styles.raceViewCardContentAddress}>Address: <small>{race.winners[2].address.substr(0, 8) + ' ... ' + race.winners[2].address.substr(race.winners[2].address.length - 8)}</small></h5>
                            <h4 className={styles.raceViewCardContentAddress}>Score: {race.winners[2].score}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                            <div className='col-12'>
                              <h3 className={styles.raceViewParticipants}>
                                <span>[</span>Race participants<span>]</span>
                              </h3>
                            </div>
                          </div>
                          <div className='row'>
                            {race.player.map((player) => (
                              <div
                                key={player.horse}
                                className='col-12 col-md-4'
                              >
                                <div className={styles.raceViewCard}>
                                  <div className={styles.raceViewCardContent}>
                                    <h4 className={styles.raceViewCardContentHorseName}>
                                      {player.horse}
                                    </h4>
                                    <h5
                                      className={styles.raceViewCardContentAddress}
                                    >
                                      Address: <small>{player.address.substr(0, 8) + ' ... ' + player.address.substr(player.address.length - 8)}</small>
                                    </h5>
                                    <h5
                                      className={styles.raceViewCardContentAddress}
                                    >
                                      Score: <small>{player.score}</small>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                  </>
                )
              }
                  </>
                ) : (
                  <div className='row'>
                    <div className='col-12'>
                      <h1 className='text-white text-center'>This race has not started yet!</h1>
                    </div>
                  </div> 
                )}
            </>
          )
          : (
            <div className='row'>
              <div className='col-12'>
                <h1 className='text-white text-center'>This race doesn't exist!</h1>
              </div>
            </div> 
          )
        }
      </div>
      )
}

export default RaceView;
