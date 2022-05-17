import React, { useState, useEffect } from 'react'
import { backend } from 'config';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Form } from 'react-bootstrap';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';

const Edit = () => {
  const { address } = useGetAccountInfo();
  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState(null);
  const [wait, setWait] = useState(true);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

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
      if(data.message === 'NULL') {
        navigate('/account/create');
      } else if(data.message === 'OK') {
        setWait(false);
      }
    });
  }, [socket])

  const editAccount = async () => {
    if(username === null) {
      setMessage('Please enter an username!')
    } else {
      await socket.emit('edit-account', {address, username});
       socket.on('edit-account_response', message => {
        if(message === 'USER_EXIST') {
            setMessage('This username is already in use!');
          } else if(message === 'SUCCESS') {
            navigate('/account');
          };
      })
    }
  }

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
      <div className="row mt-5">
        <div className="col-6 d-block mx-auto">
          <Form className="text-light">
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
            Enter your new username!
          </Form.Text>
        )}
      </Form.Group>
     <Button
       variant="primary"
       className="d-block mx-auto"
       onClick={editAccount}
     >
        Save changes
      </Button>
    </Form>
        </div>
      </div>
    </div>
  )
  }
}

export default Edit;
