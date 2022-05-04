import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { transactionServices ,sendTransactions, refreshAccount, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import Stable1 from '../../assets/Stable/1';
import Stable2 from '../../assets/Stable/2';
import Stable3 from '../../assets/Stable/3';
import Stable4 from '../../assets/Stable/4';
import Stable5 from '../../assets/Stable/5';
import { backend } from 'config';
import { reciveAddress } from '../../config';

const Stable = () => {
  const { address } = useGetAccountInfo();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(false);
  const [paid, setPaid] = useState(false);
  const [socket, setSocket] = useState();
  const [currentLevel, setCurrentLevel] = useState();
  const [staminaMax, setStaminaMax] = useState();
  const [nextLevelStaminaMax, setNextLevelStaminaMax] = useState();
  const [image, setImage] = useState();
  const [nextLevelImage, setNextLevelImage] = useState();
  const [nextLevelPriceHash, setNextLevelPriceHash] = useState('');
  const [message, setMessage] = useState('');
  const [transactionSessionId, setTransactionSessionId] = useState('');
  const txSuccess = transactionServices.useGetSuccessfulTransactions();
  const txFail = transactionServices.useGetFailedTransactions();

  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);

  useEffect(() => {
    const s = io(backend);

    function handler (data) {
      if(data.curLevel == 0) {
        setNextLevelImage(<Stable1 />)
      } else if(data.curLevel == 1) {
        setImage(<Stable1 />)
        setNextLevelImage(<Stable2 />)
      } else if(data.curLevel == 2) {
        setImage(<Stable2 />)
        setNextLevelImage(<Stable3 />)
      } else if(data.curLevel == 3) {
        setImage(<Stable3 />)
        setNextLevelImage(<Stable4 />)
      } else if(data.curLevel == 4) {
        setImage(<Stable4 />)
        setNextLevelImage(<Stable5 />)
      } else if(data.curLevel == 5) {
        setImage(<Stable5 />)
      }

      setCurrentLevel(data.curLevel);
      setStaminaMax(data.staminaMax);
      setNextLevelStaminaMax(data.nextLevelStaminaMax);
      setNextLevelPriceHash(data.nextLevelPriceHash);
      setMessage(data.message);
    }

    s.emit('get-stable', address);
    s.on('recive-stable', handler);
    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, [])

  useEffect(() => {
    for(let i = 0; i < txSuccess.successfulTransactionsArray.length; i++) {
      if(txSuccess.successfulTransactionsArray[i][0] == transactionSessionId) {
        setPaid(true);
      }
    }
  }, [txSuccess.successfulTransactionsArray.length])

  useEffect(() => {
    for(let i = 0; i < txFail.failedTransactionsArray.length; i++) {
      if(txFail.failedTransactionsArray[i][0] == transactionSessionId) {
        setWait(false);
        setMessage('Transaction failed')
      }
    }
  }, [txFail.failedTransactionsArray.length])

  useEffect(() => {
    if(paid) upgradeStable(address);
  }, [paid])

  const sendTransaction = async () => {
    const estarTransaction = {
      value: 0,
      gasLimit: '500000',
      data: btoa(nextLevelPriceHash),
      receiver: reciveAddress
    };
    await refreshAccount();

    const { sessionId } = await sendTransactions({
      transactions: estarTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing transaction',
        errorMessage: 'An error has occured during',
        successMessage: 'Transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  function setDelay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    })
  };

  async function upgradeStable(address) {
    function handle (data) {
      if(data.curLevel == 0) {
        setNextLevelImage(<Stable1 />)
      } else if(data.curLevel == 1) {
        setImage(<Stable1 />)
        setNextLevelImage(<Stable2 />)
      } else if(data.curLevel == 2) {
        setImage(<Stable2 />)
        setNextLevelImage(<Stable3 />)
      } else if(data.curLevel == 3) {
        setImage(<Stable3 />)
        setNextLevelImage(<Stable4 />)
      } else if(data.curLevel == 4) {
        setImage(<Stable4 />)
        setNextLevelImage(<Stable5 />)
      } else if(data.curLevel == 5) {
        setImage(<Stable5 />)
      }

      setCurrentLevel(data.curLevel);
      setStaminaMax(data.staminaMax);
      setNextLevelStaminaMax(data.nextLevelStaminaMax);
      setNextLevelPriceHash(data.nextLevelPriceHash);
      setMessage(data.message);
      setPaid(false);
    }

    socket.emit('upgrade-stable', address);
    socket.on('up-recive-stable', handle);
    await setDelay(2000);
    setWait(false);
  }

  return (
    <div className='container'>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">
              <h1>Stable</h1>
            </div>
            <div className="card-body h-4 text-center">
              {currentLevel > 0 && currentLevel < 5 ? (
                <div className="row py-2 px-2">
                  <div className="col-md-6 col-12 bg-secondary rounded p-3">
                    <h1>Level #{currentLevel}</h1>
                    {image}
                    <p>Level #{currentLevel} stable gives you the chance to have up to {staminaMax} stamina, allowing you to participate in more races with your horses.</p>
                  </div>
                  <div className="col-md-6 col-12 rounded p-3">
                    <h1>Next level #{currentLevel + 1}</h1>
                    {nextLevelImage}
                    <p>Level #{currentLevel + 1} stable gives you the chance to have up to {nextLevelStaminaMax} stamina, allowing you to participate in more races with your horses.</p>
                  </div>
                </div>
              ) : currentLevel == 0 ? (
                <div className="row">
                  <div className="col-12">
                    <h1>Unlock level #1</h1>
                    {nextLevelImage}
                    <p>Level #{currentLevel + 1} stable gives you the chance to have up to {nextLevelStaminaMax} stamina, allowing you to participate in more races with your horses.</p>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-12">
                    <h1>Level #{currentLevel}</h1>
                    {image}
                    <p>Level #{currentLevel} stable gives you the chance to have up to {staminaMax} stamina, allowing you to participate in more races with your horses.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer">
              {wait ? (
                <button
                  className='btn btn-warning d-block mx-auto'
                >
                  Loading...
                </button>
              ) : message != 'Max level' ? (
                <button
                  className='btn btn-primary d-block mx-auto'
                  onClick={() => {
                    sendTransaction();
                    setWait(true);
                  }}
                >
                  {message}
                </button>
              ) : (
                <button disabled className='btn btn-danger d-block mx-auto'>
                  <strong>{message}</strong>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stable;
