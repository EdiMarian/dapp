import React, { useEffect, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import CarouselComponent from 'components/Carousel';
import Rewards from 'components/Rewards';
import Cards from '../../components/Cards';
import Nfts from '../../components/Nfts';

const Dashboard = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);

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
      <div className="row mb-3">
        <div className="col-12 col-md-6 d-md-block mx-auto">
          <CarouselComponent />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Cards />
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-12 col-md-6 d-md-block mx-auto">
          <Rewards address={address} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h1 className="text-center text-light mb-4">My NFTs</h1>
          <Nfts withDetails={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
