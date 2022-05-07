import React, { useState, useEffect } from 'react';
import { backend } from '../../../config';
import { io } from 'socket.io-client';

const Slots = ({race, address}) => {

  const [players, setPlayers] = useState();

  useEffect(() => {
    const s = io(backend);
    s.emit('get-players', race.id, address);
   
    const handler = (players) => {
      setPlayers(players);
    }

    s.on('recive-players', handler);
  })

  return (
    <h3>Players: {players}/8</h3>
  )
}

export default Slots;
