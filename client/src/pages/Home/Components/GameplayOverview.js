import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { io } from 'socket.io-client';
import { backend } from 'config';

const GameplayOverview = () => {
  const [socket, setSocket] = useState(null);
  const [races, setRaces] = useState(null);
  const [airDrop, setAirDrop] = useState(null);

  useEffect(() => {
    const s = io(backend);
    setSocket(s); 

    return () => {
      s.disconnect();
    }
  }, [])

  useEffect(() => {
    if(socket === null) return;

    socket.emit('get-daily');
    socket.on('recive-daily', (dailyRaces, dailyAirDrop) => {
      setRaces(dailyRaces);
      setAirDrop(dailyAirDrop);
    });

  }, [socket])

  const racesData = {
    labels: races !== null ? races.map((data) => data.day) : 'xx/xx/xxxx',
    datasets: [{
      label: 'Daily Races',
      data: races !== null ? races.map((data) => data.k) : 'xx/xx/xxxx',
      fill: true,
      backgroundColor: '#339cff',
      borderColor: 'white',
      tension: 0.1,
      bodyColor: 'red'
    }]
  };

  const distributionData = {
    labels: airDrop !== null ? airDrop.map((data) => data.day) : 'xx/xx/xxxx',
    datasets: [{
      label: 'Air Drop',
      data: airDrop !== null ? airDrop.map((data) => data.k) : 'xx/xx/xxxx',
      fill: true,
      backgroundColor: '#ffc300',
      borderColor: 'white',
      tension: 0.1,
    }]
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h2 className={styles.gameplayOverviewTitle}>EquiStar Gameplay Overview</h2>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-md-6 col-12">
        <h3 className={styles.gameplayOverviewSubTitle}>Daily Races</h3>
        <div className={styles.gameplayGraph}>
          {races !== null ? <Line data={racesData} options={{ responsive:true }} />
            : <h3>There is no data.</h3>
          }
        </div>
      </div>
      <div className="col-md-6 col-12">
        <h3 className={styles.gameplayOverviewSubTitle}>Distribution of ESTAR for 10 days</h3>
        <div className={styles.gameplayGraph}>
          {races !== null ? <Line data={distributionData} options={{ responsive:true }} />
            : <h3>There is no data.</h3>
          }
        </div>
      </div>
      </div>
    </>
  )
}

export default GameplayOverview;
