import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { io } from 'socket.io-client';
import { backend } from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { Table } from 'react-bootstrap';
import styles from './styles.module.scss';

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
    s.emit('get-all_history', address);

    const handler = async races => {
      setHistory(races);
      makeLoading(500);
    }
    s.on('recive-all_history', handler);

    return () => {
      s.disconnect();
    }
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
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className={styles.title}>Races History</h1>
          </div>
        </div>
        <div className="row text-light">
          <div className="col-12">
            <Table striped bordered className="text-white">
              <thead>
                <tr className="text-center">
                  <th>Race id</th>
                  <th>Created On</th>
                  <th>Ended On</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {history.map((race) => (
                  <tr key={race.id} className="text-center">
                    <td className="text-light">{race.id}</td>
                    <td className="text-light">{race.startDate}</td>
                    <td className="text-light">{race.endDate}</td>
                    <td className="text-center">
                      <Link
                        to={'/race/' + race.id}
                        className={styles.eye}
                      >
                        <FontAwesomeIcon icon={faEye} />
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
