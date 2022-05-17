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

import styles from './styles.module.scss';

const Stable = () => {
  const { address } = useGetAccountInfo();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(false);
  const [wait2, setWait2] = useState(true);
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
      setWait2(false);
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

  if(wait2) {
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
    if(currentLevel < 5) {
    return (
    <div className='container'>
      <div className="row">
        <div className={"col-12 " + styles.padding}>
          <div className={styles.stableBox}>
            <div className={styles.stableBoxContent}>
              <h1 className={styles.stableBoxContentTitle}>
                Stable level {
                  currentLevel !== 0 ? currentLevel : currentLevel + 1
                }
              </h1>
              <button className={styles.stableBoxContentSubTitle}>
                {
                  currentLevel !== 0 ? `Level ${currentLevel + 1} increases the stamina to ${nextLevelStaminaMax}` : 'Level locked'
                }
              </button>
              <div className={styles.stableBoxContentImage}>
                {
                  currentLevel !== 0 ? image : nextLevelImage
                }
              </div>
              <h4 className={styles.stableBoxContentBenefit}>
                Level #{currentLevel !== 0 ? currentLevel : currentLevel + 1} stable gives you the chance to have up to {staminaMax} stamina,  allowing you to participate in more races with your horses.
              </h4>
            </div>
          </div>
          <button
            onClick={() => sendTransaction()}
            className={styles.stableUnlockBtn}
          >
            {message}
          </button>
        </div>
      </div>
    </div>
  )
  } else {
    return (
    <div className='container'>
      <div className="row">
        <div className={"col-12 " + styles.padding}>
          <div className={styles.stableBox}>
            <div className={styles.stableBoxContent}>
              <h1 className={styles.stableBoxContentTitle}>
                Stable level {
                  currentLevel !== 0 ? currentLevel : currentLevel + 1
                }
              </h1>
              <button className={styles.stableBoxContentSubTitle}>Max level</button>
              <div className={styles.stableBoxContentImage}>
                {
                  currentLevel !== 0 ? image : nextLevelImage
                }
              </div>
              <h4 className={styles.stableBoxContentBenefit}>
                Level #{currentLevel !== 0 ? currentLevel : currentLevel + 1} stable gives you the chance to have up to {staminaMax} stamina,  allowing you to participate in more races with your horses.
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }
  }
}

export default Stable;
