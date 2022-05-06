import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import races from '../../components/Races';
import Button from '../../components/Button';
import { tokenName } from 'config';

const Race = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);
  return (
    <div className='container'>
      <div className='row'>
        {races.map((race) => (
          <div key={race.id} className='col-12 col-md-4 mb-4'>
            <div className='card bg-light'>
              <div className='card-header'>
                <h3 className='text-center'>{race.name} #{race.id}</h3>
              </div>
              <div className="card-body">
                <h5>{race.description}</h5>
                <div className='text-center'>
                  <span>
                    Ranking prize:
                    {race.ranking.map((rank) => (
                      <p key={rank.name}>
                        {rank.name} {rank.win} {race.id == 1 ? tokenName : race.withEstar ? tokenName : 'EGLD'}
                      </p>
                    ))}
                  </span>
                  {race.entryFee == 0 ? (
                    <span>Entry fee: 25 stamina</span>
                  ) : (
                    <span>Entry fee: {race.entryFee} {
                      race.withEstar ? 'eStar' : 'EGLD'
                    }</span>
                  )}
                </div>
              </div>
              <div className='card-footer'>
                <Button
                  race={race}
                />
              </div>
            </div>
          </div>
        ))};
      </div>
    </div>
  );
};

export default Race;
