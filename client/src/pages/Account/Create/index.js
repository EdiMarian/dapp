import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { useNavigate } from 'react-router-dom';
import { backend } from 'config';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';


const CreateAccount = () => {

  const [loading, setLoading] = useState(true);
  const [exist, setExist] = useState(true);

  const { address } = useGetAccountInfo();
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState(null);

  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);


  useEffect(() => {
    const s = io(backend);
    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, [])

  useEffect(() => {
    if(socket == null ) return;
    socket.emit('load-account', address);
  }, [socket])

  useEffect(() => {
    if(socket == null ) return;
    socket.on('get-account', (data) => {
      if(data.message === 'OK') {
        navigate('/account');
      } else {
        setExist(false);
      }
    });
  }, [socket])

  const createAccount = async () => {
    if(username === null) {
      setMessage('Please enter an username!')
    } else {
      await socket.emit('create-account', {address, username});
      await socket.on('create-account_response', message => {
        if(message === 'USER_EXIST') setMessage('This username is already in use!');
          else if(message === 'SUCCESS') {
            navigate('/account');
          }
      });
    }
  }

  if(exist) {
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
      <Form className="text-light mx-auto">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
        {message !== null ?
          message === 'Success!' ? (
            <Form.Text className="text-success">
              {message}
            </Form.Text>
          ) : (
            <Form.Text className="text-danger">
              {message}
            </Form.Text>
          )
          
         : (
          <Form.Text className="text-muted">
            Enter the desired username!
          </Form.Text>
        )}
      </Form.Group>
     <Button
       variant="primary"
       className="d-block mx-auto"
       onClick={createAccount}
     >
        Submit
      </Button>
    </Form>
    )
  }
}

export default CreateAccount;
