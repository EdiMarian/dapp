import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionServices, refreshAccount } from '@elrondnetwork/dapp-core';
import { backend, reciveAddress, tokenName } from '../../config';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Modal } from 'react-bootstrap';
import { io } from 'socket.io-client';

const Button = ({ race }) => {
  const navigate = useNavigate();
  const { address } = useGetAccountInfo();
  const [transactionSessionId, setTransactionSessionId] = useState('');
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
  const [clickable, setClickable] = useState(true);
  const [raceId, setRaceId] = useState('');
  const txSuccess = transactionServices.useGetSuccessfulTransactions();

  useEffect(() => {
    // Connect socket.io
    const s = io(backend);
    s.emit('get-status', address);
    function handler (data) {
      setNft(data);
    }
    s.on('recive-status', handler);
    setSocket(s);

    // Fee
    setEstar(race.entryFee);
    setEgld(race.entryFee);
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
      id: race.id,
      address: address,
    };
    await socket.emit('get-available', av);
    await socket.on('recive-available', handler);
    setShow(true);
  };
  
  useEffect(() => {
    for(let i = 0; i < txSuccess.successfulTransactionsArray.length; i++) {
      if(txSuccess.successfulTransactionsArray[i][0] == transactionSessionId) {
        setPaid(true);
      }
    }
  }, [txSuccess.successfulTransactionsArray.length])

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

  const sendEgldTransaction = async () => {
    const egldTransaction = {
      value: egld ? egld * 1000000000000000000 : 0,
      gasLimit: '70000',
      data: 'QG9r',
      receiver: reciveAddress
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
    }
  };

  function setDelay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  })
}

  const enter = async (horse, url) => {
    await setDelay(2000);
    const data = await {
        address: address,
        horse: horse,
        horseUrl: url,
        feePaid: true,
        entryFee: race.withEstar ? estar : egld,
        with: race.withEstar ? 'ESTAR' : 'EGLD',
        raceId: race.id,
      };
    socket.emit('enter-race', data);
    const handle = (response) => {
        setSuccess(true);
        setShowSelect(response.showb);
        setMessage(response.message);
        setRaceId(response.id);
      }

      socket.on('recive-response', handle);
  };

  return (
    <div className='container'>
      <button
        className='d-block mx-auto btn text-white'
        style={{ backgroundColor: race.color }}
        onClick={available}
      >
        Enter
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
            <Modal.Title>Pay</Modal.Title>
          ) : (
            <Modal.Title>Slots</Modal.Title>
          )}
        </Modal.Header>

        <Modal.Body className='bg-white w-100'>
          {raceIsAv ? (
            <>
              {race.entryFee != 0 ? (
                race.withEstar ? (
                <button
                  className='d-block mx-auto btn btn-primary'
                  onClick={() => {
                    setShow(false);
                    sendEstarTransaction();
                  }}
                >
                  {estar} {tokenName}
               </button>
              ) : (
                <button
                  className='d-block mx-auto btn btn-primary'
                  onClick={() => {
                    setShow(false);
                    sendEgldTransaction();
                  }}
                >
                  {egld} EGLD
                </button>
              )
              ) : (
                <button
                  className='d-block mx-auto btn btn-primary'
                  onClick={() => {
                    setShow(false);
                    sendEgldTransaction();
                  }}
                >
                  Pay
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
        size={clickable ? 'xl' : 'sm'}
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
                clickable ? (
                    nft.map(({ fileUri, name, stamina, inRace }) => {
                      if(race.id != 1) {
                        if(!inRace) {
                          return (
                          <div
                            key={name}
                            className='col-12 col-md-4 text-center'
                            onClick={() => {
                              setClickable(false);
                             enter(name, fileUri);
                            }}
                          >
                            <img src={fileUri} className='d-block mx-auto' height='250px' />
                            <p style={{ color: 'black' }}>{name}</p>
                          </div>
                        );
                        }
                      } else {
                        return (
                          <div
                            key={name}
                            className='col-12 col-md-4 text-center'
                            onClick={() => {
                              setClickable(false);
                             enter(name, fileUri);
                            }}
                          >
                            <img src={fileUri} className='d-block mx-auto' height='250px' />
                            <p style={{ color: 'black' }}>{name}</p>
                            {race.id > 1 ? '' : stamina == 25 && <p className='text-danger'>Stamina: {stamina}</p> ||
                              stamina == 50 && <p className='text-warning'>Stamina: {stamina}</p> ||
                              stamina > 50 && <p className='text-primary'>Stamina: {stamina}</p>
                            }
                          </div>
                        );
                      }
                    })
                 ) : (
                    <div className='col-12 col-md-4'>
                      <h1 className='py-2 px-5'>Loading...</h1>
                    </div>
                 )
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
              onClick={() => navigate(`/race/${raceId}`)}
            >
              Close
            </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Button;
