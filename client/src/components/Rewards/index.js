import React, { useState, useEffect } from 'react';
import { backend } from 'config';
import { io } from 'socket.io-client'

const Rewards = ({ address }) => {
  const [loading, setLoading] = useState(true);
  const [estar, setEstar] = useState(null);
  const [egld, setEgld] = useState(null);

  function setDelay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    })
  }

  async function makeLoading(ms) {
    await setDelay(ms);
    setLoading(false);
  }

  useEffect(() => {
    const s = io(backend);
    s.emit('get-rewards', address);

    const handler = (estar, egld) => {
      setEstar(estar);
      setEgld(egld);
      makeLoading(500);
    };
    s.on('recive-rewards', handler);
  }, [])
  if(loading) {
    return (
      <div className="d-flex justify-content-center text-white">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card">
        <div className="card-header text-center">
          <h1>Rewards</h1>
        </div>
        <div className="card-body text-center">
          <h4>{estar} eStar</h4>
          <h4>{egld} EGLD</h4>
        </div>
        <div className="card-footer">
          <button
            disabled
            className="btn btn-primary d-block mx-auto"
          >
            Claim: Coming soon
          </button>
        </div>
      </div>
    )
  }
}

export default Rewards;
