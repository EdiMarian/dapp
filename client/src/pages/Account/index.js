import { backend } from 'config';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import io from 'socket.io-client';
import AccountInfo from './Components/AccountInfo';
import Nfts from 'components/Nfts';

import styles from './styles.module.scss';
import ClaimRewards from './Components/ClaimRewards';

const Account = () => {
 
  const { address } = useGetAccountInfo();
  const [exist, setExist] = useState(false);
  const [account, setAccount] = useState();
  const [socket, setSocket] = useState(null);

  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(true);
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
      if(data.message === 'OK') {
        setAccount(data.account);
        setExist(true);
      } else if(data.message === 'NULL') {
        setExist(false);
      }
      setWait(false);
    });
  }, [socket])

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
    if(exist) {
      return (
        <>
          <AccountInfo account={account} socket={socket} />
          <ClaimRewards />
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className={styles.nftsTitle}>My NFTs</h2>
              </div>
            </div>
          </div>
          <Nfts withDetails={true} />
        </>
      )
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12 text-center text-light">
              <h1>You don't have account!</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-12 mt-4">
              <button
                className="btn btn-primary d-block mx-auto"
               onClick={() => navigate('/account/create')}
              >
                Create account!
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Account;
