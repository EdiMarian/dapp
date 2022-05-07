import React from 'react'
import { Link } from 'react-router-dom';
import Leaderboard from 'assets/Pages/Leaderboard';
import Stable from 'assets/Pages/Stable'
import Tournament from 'assets/Pages/Tournament';

const Route = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12"></div>
      </div>
      <div className="row">
        <div className="col-6 text-center">
          <Link to={'/stable'}>
            <Stable  width="250px" height="250px" />
          </Link>
        </div>
        <div className="col-6 text-center">
          <Link to={'/leaderboard'}>
            <Leaderboard width="250px" height="250px" />
          </Link>
        </div>
        <div className="col-12 text-center">
          <Link to={'/tournament'}>
            <Tournament width="250px" height="250px" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Route;
