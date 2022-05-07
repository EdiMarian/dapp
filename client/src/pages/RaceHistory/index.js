import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { io } from 'socket.io-client';
import { backend } from 'config';

import { Table } from 'react-bootstrap';

const RaceHistory = () => {
  const { address } = useGetAccountInfo();
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
      <div className="container">
        <div className="row my-5">
          <div className="col-12 text-center text-white">
            <h1>Race History</h1>
          </div>
        </div>
        <div className="row text-light">
          <div className="col-12">
            <Table striped bordered className="text-white">
              <thead>
                <tr className="text-center">
                  <th>Race id</th>
                  <th>Date</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {history.map((race) => (
                  <tr key={race.id} className="text-center">
                    <td>{race.id}</td>
                    <td>{race.date}</td>
                    <td className="text-center">
                      <Link
                        to={'/race/' + race.id}
                        className="text-warning"
                      >
                        View
                      </Link></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    )
  }
}

export default RaceHistory;
