import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

const Leaderboard = () => {
  const { address } = useGetAccountInfo();
  const navigate = useNavigate();
  const soon = true;
  const [loading, setLoading] = useState(true);

  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);

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
            <h1 className="text-light">eSTAR</h1>
          </div>
        </div>
      </div>
    )
  }

}

export default Leaderboard;
