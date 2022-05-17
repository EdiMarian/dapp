import React, { useEffect, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, Link } from 'react-router-dom';
import CarouselComponent from 'components/Carousel';
import Rewards from 'components/Rewards';
import Cards from '../../components/Cards';
import Nfts from '../../components/Nfts';
import { Alert } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { backend } from 'config';
import GeneralStats from './Components/GeneralStats';
import GameplayOverview from './Components/GameplayOverview';

const Dashboard = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [haveAccount, setHaveAccount] = useState(true);
  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);

  useEffect(() => {
    const s = io(backend);
    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {
    if(socket == null ) return;
    socket.emit('load-account', address);
  }, [socket])

  useEffect(() => {
    if(socket == null ) return;
    socket.on('get-account', (data) => {
      if(data.message === 'NULL') {
        setHaveAccount(false);
      }
    });
  }, [socket])

  if (loading) {
    return (
      <div
        style={{ fontSize: '30px' }}
        className='d-flex align-items-center justify-content-center text-white flex-fill'
      >
        <FontAwesomeIcon
          icon={faSpinner}
          size='2x'
          spin={true}
          className='mr-3'
        />
        Loading...
      </div>
    );
  }

  return (
    <div className='container'>
      { !haveAccount ? (
        <Alert variant='primary'>
        You do not have an account created, <Link to='/account/create'>click here</Link>!
      </Alert>
      ) : (
        null
      ) }
      <div className="row">
        <div className="col-12 col-md-6 mb-3">
          <CarouselComponent />
        </div>
        <div className="col-12 col-md-6 mb-3">
          <GeneralStats />
        </div>
      </div>
      <GameplayOverview />
    </div>
  );
};

export default Dashboard;
