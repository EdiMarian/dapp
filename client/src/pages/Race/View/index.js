import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { io } from 'socket.io-client';

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
  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(() => {
    const s = io('http://176.223.121.41:4000');
    s.emit('get-race', {id, address});
    const handler = ({race, status, authorized}) => {
      if(race != null) {
        setRace(race);
        setStatus(status);
        setExist(true);
        setAuthorized(authorized);
      }
    }
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
                            <div className='col-12 text-white text-center'>
                              <h1>Race #{race.id}</h1>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-12 text-white text-center'>
                              <h3>The participants of this race are</h3>
                            </div>
                          </div>
                          <div className='row'>
                            {race.player.map((player) => (
                              <div
                                key={player.address}
                                className='col-12 col-md-4'
                              >
                                <div className='card'>
                                  <div className='card-body'>
                                    <img
                                      className='d-block mx-auto'
                                      src={player.horseUrl}
                                      height='250px'
                                    />
                                    <h4 className='text-center'>
                                      {player.horse}
                                    </h4>
                                    <h1>{player.address}</h1>
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
                        <h1>Race #{race.raceId} is over!</h1>
                      </div>
                    </div>
                    <div className='row mt-3'>
                      <div className='col-12 col-md-4'>
                        <div className='card mt-md-2'>
                          <div className="card-body">
                            <img
                              className='d-block mx-auto'
                              src={race.winners[1].horseUrl}
                              height='250px'
                            />
                            <h1>{race.winners[1].address}</h1>
                            <h4>Score: {race.winners[1].score}</h4>
                          </div>
                        </div>
                      </div>
                      <div className='col-12 col-md-4'>
                        <div className='card'>
                          <div className="card-body">
                            <img
                              className='d-block mx-auto'
                              src={race.winners[0].horseUrl}
                              height='250px'
                            />
                            <h1>{race.winners[0].address}</h1>
                            <h4>Score: {race.winners[0].score}</h4>
                          </div>
                        </div>
                      </div>
                      <div className='col-12 col-md-4'>
                        <div className='card mt-md-2'>
                          <div className="card-body">
                            <img
                              className='d-block mx-auto'
                              src={race.winners[2].horseUrl}
                              height='250px'
                            />
                            <h1>{race.winners[2].address}</h1>
                            <h4>Score: {race.winners[2].score}</h4>
                          </div>
                        </div>
                      </div>
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
