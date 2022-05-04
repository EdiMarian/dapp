import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { backend } from '../../config';
import { io } from 'socket.io-client';

import Card from './Components/Card';

const Tournament = () => {
  const { address } = useGetAccountInfo();
  const navigate = useNavigate();
  const [socket, setSocket] = useState();
  const soon = true;
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [tournament, setTournament] = useState(null);

  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);

  useEffect(() => {
    const s = io(backend);
    setSocket(s);
    s.emit('get-tournament');

    async function handler(data) {
      if(data != null) {
        setTournament(data);
        setIsActive(true)
      }
    }

    s.on('recive-tournament', handler);

    return () => {
      s.disconnect();
    }
  }, [])

  if(soon) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mt-5">
            <h1 className="text-light text-center">Coming soon!</h1>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Card
              active={isActive}
              tournament={tournament}
              address={address}
              socket={socket}
            />
          </div>
        </div>
      </div>
    )
  }

}

export default Tournament;
