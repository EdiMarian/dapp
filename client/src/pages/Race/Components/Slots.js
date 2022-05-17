import React, { useState, useEffect } from 'react';
import { backend } from '../../../config';
import { io } from 'socket.io-client';

import styles from '../styles.module.scss';

const Slots = ({race, address}) => {

  const [players, setPlayers] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(backend);
    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {
    if(socket == null) return;
    socket.emit('get-players', race.id, address);
    socket.on('recive-players', players => setPlayers(players));
  }, [socket, players])

  return (
    <>
      <h3 className={styles.racePlayers}>Players</h3>
      <h5 className={styles.racePlayersNB}>
          {players}<span className={styles.racePlayersNBSlash}>/</span>8
      </h5>
    </>
  )
}

export default Slots;
