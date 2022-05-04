import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  faArrowCircleLeft
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Enter = ({ address, socket }) => {
  const [loading, setLoading] = useState(true);
  const [nft, setNft] = useState(null);
  const [message, setMessage] = useState('');

  // Loading

  function setDelay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    })
  }

  async function makeLoading(ms) {
    await setDelay(ms);
    setLoading(false);
  }

  useEffect(() => {
    const handler = (nfts) => {
      setNft(nfts);
      makeLoading(500);
    };

    socket.emit('get-status', address);
    socket.on('recive-status', handler);
  }, [])

  async function enter(horse) {
    const handler = (message) => {
      setMessage(message);
    }

    await socket.emit('enter-tournament', address, horse);
    await socket.on('recive-tournament-response', handler);
  }

  if(loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  } else {
    if(nft == null) {
      return <h3>You don't have nfts.</h3>;
    } else {
        return (
          <div className="row">
            {
              message == '' ? 
              nft.map(({ fileUri, name }) => {
                return (
                  <div
                    key={name}
                    className='col-12 col-md-4 text-center'
                    onClick={() => {
                      enter(name);
                    }}
                  >
                    <img src={fileUri} className='d-block mx-auto' height='250px' />
                    <p style={{ color: 'black' }}>{name}</p>
                  </div>
                );
              }) : (
                <div className="col-12 text-center">
                  <h4 className='p-3'>{message}</h4>
                    <Link
                      to={'/tournament'} 
                      onClick={() => window.location.reload()} 
                      className='text-white' 
                    >
                      <button className='btn btn-primary mb-2'>
                        <FontAwesomeIcon
                          icon={faArrowCircleLeft}
                        />
                        <span className='px-2'>Go back!</span>
                      </button>
                    </Link>
                </div>
              )
            
            }
          </div>
        );
    }
  }
}

export default Enter;
