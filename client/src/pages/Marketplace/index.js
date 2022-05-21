import { backend } from 'config';
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import Marketplace_Item from './Components/Marketplace_Item';

import styles from './styles.module.scss';

const Marketplace = () => {

  const { address } = useGetAccountInfo();
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(true);
  const [items, setItems] = useState(null);

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
    if(socket == null) return;

    socket.emit('load-account', address);

    socket.on('get-account', (data) => {
      if(data.message === 'NULL') {
        navigate('/account/create');
      }
    });

    socket.emit('get-market-items');
    socket.on('recive-market-items', data => {
      setItems(data);
      setWait(false);
    });
  }, [socket]);

  if(wait) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mt-4">
            <div className="d-flex justify-content-center text-white">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
    <div className="container">
      <div className="row">
        <div className="col-12">
            <h1 className={styles.title}>Marketplace</h1>
        </div>
      </div>
      <div className="row">
        {items.map((item) => (
          <Marketplace_Item
            key={item._id}
            item={item}
            socket={socket}
            address={address}
          />
        ))}
      </div>
    </div>
  )
  }
}

export default Marketplace;
