import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionServices, refreshAccount } from '@elrondnetwork/dapp-core';
import styles from './styles.module.scss';
import TxTracking from '../Layout/TxTracking';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Modal } from 'react-bootstrap';
import { io } from 'socket.io-client';

const Button = (props) => {
  const navigate = useNavigate();
  const { address } = useGetAccountInfo();
  const { successfulTransactionsArray } = TxTracking();
  const [, setTransactionSessionId] = useState('');
  const [session, setSession] = useState('');
  const [paid, setPaid] = useState(false);
  const { sendTransactions } = transactionServices;
  const [estar, setEstar] = useState(0);
  const [egld, setEgld] = useState(0);
  const [nft, setNft] = useState([]);
  const [socket, setSocket] = useState();
  const [show, setShow] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [raceIsAv, setRaceIsAv] = useState(false);

  useEffect(() => {
    // Connect socket.io
    const s = io('http://176.223.121.41/server');
    s.emit('get-nfts', address);
    function handler (data) {
      setNft(data);
    }
    s.on('recive-nfts', handler);
    setSocket(s);

    // Fee
    if (props.fee > 0) {
      setEstar(props.fee * 100);
      setEgld(props.fee / 200);
    }
    // Disconnect socket.io
    return () => {
      s.disconnect();
    };
  }, []);

  async function available () {
    const handler = (avOB) => {
      if(avOB.authorized) {
        setRaceIsAv(avOB.isAvailable);
        setMessage('There are no more places available in this race!')
      } else {
        setMessage('You can only enter this race once!');
      }
    };
    const av = await {
      id: props.id,
      address: address,
    };
    await socket.emit('get-available', av);
    await socket.on('recive-available', handler);
    setShow(true);
  };

  useEffect(() => {
    for (let i = 0; i < successfulTransactionsArray.length; i++) {
      if (successfulTransactionsArray[i][0] == session) {
        setPaid(true);
      }
    }
  }, [successfulTransactionsArray]);

  useEffect(() => {
    if(paid) setShowSelect(true);
  }, [paid])

  const encrypt = () => {
    return (estar * 100).toString(16);
  };

  const sendEstarTransaction = async () => {
    const estarTransaction = {
      value: 0,
      gasLimit: '500000',
      data:
        estar >= 50 && estar <= 656
          ? btoa('ESDTTransfer@45535441522d616661616630@' + encrypt())
          : btoa('ESDTTransfer@45535441522d616661616630@0' + encrypt()),
      receiver: 'erd1q07w9xm8avd7kwj3cgn3xrnhzg5da7e3vg7dv6gs3npyql0jpq9ss35a20'
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
      setSession(sessionId);
    }
  };

  const sendEgldTransaction = async () => {
    const egldTransaction = {
      value: egld ? egld * 1000000000000000000 : 0,
      gasLimit: '70000',
      data: 'QG9r',
      receiver: 'erd1q07w9xm8avd7kwj3cgn3xrnhzg5da7e3vg7dv6gs3npyql0jpq9ss35a20'
    };
    await refreshAccount();

    const { sessionId } = await sendTransactions({
      transactions: egldTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing transaction',
        errorMessage: 'An error has occured during',
        successMessage: 'Transaction successful'
      },
      redirectAfterSign: true
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
      setSession(sessionId);
    }
  };

  const enter = async (horse, url) => {
    const data = await {
        address: address,
        horse: horse,
        horseUrl: url,
        feePaid: true,
        raceId: props.id,
      };
    socket.emit('enter-race', data);
    const test = (response) => {
        setSuccess(true);
        setShowSelect(response.showb);
        setMessage(response.message);
      }

      socket.on('recive-response', test);
  };

  return (
    <div className='container'>
      <button
        className={props.className ? props.className + ' ' + styles.btn : styles.btn}
        style={{ backgroundColor: props.color }}
        onClick={available}
      >
        {props.name}
      </button>
      {/* Enter race modal */}
      <Modal
        dialogClassName='custom-dialog'
        show={show}
        onHide={() => setShow(!show)}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton className='bg-white'>
          {raceIsAv ? (
            <Modal.Title>Pay with</Modal.Title>
          ) : (
            <Modal.Title>Slots</Modal.Title>
          )}
        </Modal.Header>

        <Modal.Body className='bg-white w-100'>
          {raceIsAv ? (
            <>
              {props.id != 1 ? (
                <div className='d-flex'>
              <button
                className='d-block mx-auto btn btn-primary'
                onClick={() => {
                  setShow(false);
                  sendEstarTransaction();
                }}
              >
                {estar} eStar
              </button>
              <button
                className='d-block mx-auto btn btn-primary ml-2'
                onClick={() => {
                  sendEgldTransaction();
                  setShow(false);
                }}
              >
                {egld} eGld
              </button>
            </div>
              ) : (
              <button
                className='d-block mx-auto btn btn-primary ml-2'
                onClick={() => {
                  sendEgldTransaction();
                  setShow(false);
                }}
              >
                Pay a fee
              </button>
              )}
            </>
          ) : (
            <h5>{message}</h5>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showSelect}
        size='xl'
        backdrop='static'
        keyboard={false}
        onHide={() => setShowSelect(false)}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header className='bg-white'>
          <Modal.Title id='contained-modal-title-vcenter'>
            Select Horse
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-white px-0'>
            <div className='row'>
              {nft ? (
                nft.map(({ fileUri, name, stamina }) => {
                  if(stamina >= 25) {
                    return (
                      <div
                        key={name}
                        className='col-12 col-md-4 text-center'
                        onClick={() => enter(name, fileUri)}
                      >
                        <img src={fileUri} className='d-block mx-auto' height='250px' />
                        <p style={{ color: 'black' }}>{name}</p>
                        {props.id > 1 ? '' : stamina == 25 && <p className='text-danger'>Stamina: {stamina}</p> ||
                          stamina == 50 && <p className='text-warning'>Stamina: {stamina}</p> ||
                          stamina > 50 && <p className='text-primary'>Stamina: {stamina}</p>
                        }
                      </div>
                    );
                  }
                })
              ) : (
                <p>You don&apos;t have EquiStar Nfts.</p>
              )}
            </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={success}
        backdrop='static'
        keyboard={false}
        size='md-down'
        onHide={() => setSuccess(false)}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header className='bg-white'>
          <Modal.Title id='contained-modal-title-vcenter'>
            🎉 Congratulations!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-white px-3'>
            <h4>{message}</h4>
        </Modal.Body>
        <Modal.Footer className='bg-white'>
            <button
              className='btn btn-primary d-block mx-auto'
              onClick={() => navigate('/')}
            >
              Close
            </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Button;
