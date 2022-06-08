import React, { useState, useEffect } from 'react'
import { transactionServices, refreshAccount } from '@elrondnetwork/dapp-core';

import Modal from 'react-bootstrap/Modal';

import styles from '../styles.module.scss';
import { reciveAddress } from 'config';


const Buy = ({ item, socket, address }) => {

  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [disable, setDisable] = useState(false);
  var price = null;
  const [message, setMessage] = useState(null);
  const [transactionSessionId, setTransactionSessionId] = useState(null);
  const { sendTransactions } = transactionServices;
  const txSuccess = transactionServices.useGetSuccessfulTransactions();

  var data = {
    address: address,
    itemId: item._id,
    name: item.name,
    paid: false,
    maxHolders: item.maxHolders,
    available: item.available
  }

  useEffect(() => {
    for(let i = 0; i < txSuccess.successfulTransactionsArray.length; i++) {
      if(txSuccess.successfulTransactionsArray[i][0] === transactionSessionId) {
        buyItem(false)
      }
    }
  }, [txSuccess.successfulTransactionsArray.length])

  const sendTransaction = async () => {
    const transaction = {
      value: 0,
      gasLimit: '500000',
      data: btoa('ESDTTransfer@45535441522d616661616630@' + price),
      receiver: reciveAddress
    };
    await refreshAccount();

    const { sessionId } = await sendTransactions({
      transactions: transaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing transaction',
        errorMessage: 'An error has occured during',
        successMessage: 'Transaction successful'
      },
      redirectAfterSign: true
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  async function buyItem(check) {
    if(check) {
      if(!disable) {
        var readyForBuy = false;

      socket.emit('try-to-buy-marketplace-item', data);
      await new Promise(resolve => {
        socket.on('recive-response-from-marketplace', (response, priceHash) => {
          price = priceHash;
          if(response === 'MAX_HOLDERS') {
            setError(true);
            setMessage('Number of holders has been reached.');
            setShow(true);
          } else if(response === 'EXIST') {
            setError(true);
            setMessage('You already have this item.');
            setShow(true);
          } else if(response === 'NO_EXIST') {
            setDisable(true);
            readyForBuy = true;
          } else if(response === 'ERROR') {
            setError(true);
            setMessage('418');
            setShow(true);
          }
          resolve(response);
        });
      })
      if(Boolean(readyForBuy)) {
        sendTransaction();
      }
      }
    } else {
      data.paid = true;
      socket.emit('try-to-buy-marketplace-item', data);
      window.location.reload(false);
    }
  }

  return <>
    <button
      className={styles.buyBtn}
      onClick={() => buyItem(true)}
    >
      {item.price} $ESTAR
    </button>
    <Modal
      show={show}
      backdrop='static'
      keyboard={false}
      size='md-down'
      onHide={() => setShow(false)}
      aria-labelledby='contained-modal-title-vcenter'
      centered
      >
        <Modal.Header className='bg-white' closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            {error ? '❌ Error ❌' : '🎉 Congratulations! 🎉'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-white px-3'>
            <h4>{message}</h4>
        </Modal.Body>
        <Modal.Footer className='bg-white'>
            {error ? (
              <button
              className='btn btn-danger'
              onClick={() => setShow(false)}
            >
              Close
            </button>
            ) : (
              <button
                className='btn btn-primary'
                onClick={() => setShow(false)}
              >
                Close
              </button>
            )}
        </Modal.Footer>
      </Modal>
  </>
}

export default Buy;
