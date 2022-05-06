import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { backend } from 'config';

const RaceHistory = ({ address }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState();

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
    s.emit('get-history', address);

    const handler = async races => {
      setHistory(races);
      makeLoading(500);
    }
    s.on('recive-history', handler);

    return () => {
      s.disconnect();
    }
  }, [])
  console.log(history);
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
      history.map((race) => (
          <div key={race.id} className='d-flex justify-content-between align-center mb-2'>
            <h3>Race id: {race.id}</h3>
            <Link to={'/race/' + race.id}>
              <button className="btn btn-primary">View</button>
            </Link>
          </div>
        ))
    )
  }
}

export default RaceHistory;
