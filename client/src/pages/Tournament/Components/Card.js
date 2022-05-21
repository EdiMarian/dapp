import React, { useEffect, useState } from 'react'
import TournamentModel from './TournamentModel';

const Card = ({ active, tournament, address, socket }) => {
  const [loading, setLoading] = useState(true);

  // Tournament stats
  const [fee, setFee] = useState(0);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [endDate, setEndDate] = useState('');

  // Tournament status

  useEffect(() => {
    if(tournament != null) {
      setFee(tournament.fee);
      setMaxPlayers(tournament.maxPlayers)
      setNumberOfPlayers(tournament.players.length);
      setEndDate(tournament.end);
      setLoading(false);
    };
  }, [tournament])

  if(loading) {
    return (
      <div className="d-flex justify-content-center text-white">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  } else {
    if(active) {
      return (
        <div className="card text-center">
          <div className="card-header">
            Tournament
          </div>
          <div className="card-body">
            <h5 className="card-title">
              <strong>The special tournament is ready!</strong>
            </h5>
            <p className="card-text">Fee: {fee}</p>
            <p className="card-text">Players: {numberOfPlayers}</p>
            <p className="card-text">Max players: {maxPlayers}</p>
            <TournamentModel
              tournamentFee={tournament.fee}
              address={address}
              socket={socket}
            />
          </div>
          <div className="card-footer text-muted">
            End date: {endDate}
          </div>
        </div>
      )
    } else {
      return (
        <div className="card text-center">
          <div className="card-header">
            Tournament
          </div>
          <div className="card-body">
            <h5 className="card-title">
              <strong>There are no active tournaments!</strong>
            </h5>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
          </div>
          <div className="card-footer text-muted">
            Soon
          </div>
        </div>
      )
    }
  }
}

export default Card;
