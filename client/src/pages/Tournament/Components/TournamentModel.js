import React, { useState, useEffect } from 'react'
import {
  faDoorOpen
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { transactionServices ,sendTransactions, refreshAccount } from '@elrondnetwork/dapp-core';
import Enter from './Enter';
import { reciveAddress } from '../../../config';

const TournamentModel = ({ address, socket, tournamentFee }) => {
  const [show, setShow] = useState(false);
  const [transactionSessionId, setTransactionSessionId] = useState('');
  const [message, setMessage] = useState(null);
  const txSuccess = transactionServices.useGetSuccessfulTransactions();
  const txFail = transactionServices.useGetFailedTransactions();

  useEffect(() => {
    for(let i = 0; i < txSuccess.successfulTransactionsArray.length; i++) {
      if(txSuccess.successfulTransactionsArray[i][0] == transactionSessionId) {
        setShow(true);
      }
    }
  }, [txSuccess.successfulTransactionsArray.length]);

  useEffect(() => {
    for(let i = 0; i < txFail.failedTransactionsArray.length; i++) {
      if(txFail.failedTransactionsArray[i][0] == transactionSessionId) {
        setShow(false);
      }
    }
  }, [txFail.failedTransactionsArray.length])

  function numHex(s) {
    var a = s.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return a;
  }

  async function check() {

    const handle = async (slots) => {
      if(slots == 0) {
        setMessage('No more slots available');
        setShow(true)
      }
    }

    if(message == null) sendTransaction();

    socket.emit('get-tournament-slots');
    socket.on('recive-tournament-slots', handle);
  }

  const sendTransaction = async () => {
    const estarTransaction = {
      value: 0,
      gasLimit: '500000',
      data: btoa(
        'ESDTTransfer@45535441522d616661616630@' + numHex(tournamentFee * 100)
      ),
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


  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => check()}
      >
        Join <FontAwesomeIcon icon={faDoorOpen} />
      </button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        size="lg"
        keyboard={false}
      >
        {
          message != null ? (
            <>
              <Modal.Header closeButton>
               <Modal.Title>Ops</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>{message}</h4>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShow(false)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </>
          ) : (
            <>
              <Modal.Header>
               <Modal.Title>Select your horse</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Enter socket={socket} address={address} />
              </Modal.Body>
            </>
          )
        }
      </Modal>
    </>
  )
}

export default TournamentModel;
