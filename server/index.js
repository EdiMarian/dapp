const local = true;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Agenda = require('agenda');
const moment = require('moment');
const express = require('express');
const fs = require('fs');
const https = require('https');

const Race = require('./models/Race');
const Horse = require('./models/Horse');
const RaceHistory = require('./models/RaceHistory');
const Stable = require('./models/Stable');
const Tournament = require('./models/Tournament');
const Reward = require('./models/Reward');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION);

var io;

if(local) {
  io = require('socket.io')(process.env.PORT,{
    cors: {
      origin: '*',
      method: ['GET', 'POST', 'PATCH']
    }
  });
} else {
  const app = express();
  const https_server = https.createServer({
    key: fs.readFileSync('key.key'),
    cert: fs.readFileSync('cert.crt')
  }, app).listen(process.env.PORT);

  io = require('socket.io')({
    cors: {
      origin: 'https://equistar.estar.games',
      method: ['GET', 'POST', 'PATCH']
    }
  });

  io.listen(https_server);
}

// VAR

const Bonus = ['SPEED', 'ENDURANCE', 'AGILITY'];

const api = 'https://api.elrond.com';

const http = axios.create({
  baseURL: api,
  headers: { 'Content-Type': 'application/json' }
});

const collection = 'EQUISTAR-3f393f';
const token = 'ESTAR-afaaf0';

const stables = [
    {
      level: 1,
      price: 100000,
      staminaMax: 110,
      hash: 'ESDTTransfer@45535441522d616661616630@0186a0'
    },
    {
      level: 2,
      price: 500000,
      staminaMax: 130,
      hash: 'ESDTTransfer@45535441522d616661616630@07a120'
    },
    {
      level: 3,
      price: 1000000,
      staminaMax: 150,
      hash: 'ESDTTransfer@45535441522d616661616630@0f4240'
    },
    {
      level: 4,
      price: 2000000,
      staminaMax: 200,
      hash: 'ESDTTransfer@45535441522d616661616630@1e8480'
    },
    {
      level: 5,
      price: 5000000,
      staminaMax: 250,
      hash: 'ESDTTransfer@45535441522d616661616630@4c4b40'
    },
  ];

  // Stamina regeneration

  const agenda = new Agenda({ db: { address: process.env.DB_CONNECTION } });

  async function getHorsesToRegenerate() {
    let staminaMax = 0;
    let data = [];

    const stable = await Stable.find();
    for (let i = 0; i < stable.length; i++) {
      if(stable[i].level == 1) {
        staminaMax = 110;  
      } else if(stable[i].level == 2) {
        staminaMax = 130;  
      } else if(stable[i].level == 3) {
        staminaMax = 150;  
      } else if(stable[i].level == 4) {
        staminaMax = 200;  
      } else if(stable[i].level == 5) {
        staminaMax = 250;  
      }
      const horses = await getNfts(stable[i].address);
      for (let j = 0; j < horses.length; j++) {
        data.push({horse: horses[j].name, staminaMax: staminaMax});
      }
    }

    const horse_nS = await Horse.find({stamina: {$lt: 99}});

    for (let m = 0; m < horse_nS.length; m++) {
      if(!data.find(({horse}) => horse === horse_nS[m].name)) {
        data.push({horse: horse_nS[m].name, staminaMax: 100});
      }
    }

    return data;
  };

  agenda.define("regeneration", async (job) => {
    var staminaAd = 0;
    const horses = await getHorsesToRegenerate();
    for (let i = 0; i < horses.length; i++) {
      staminaAd = horses[i].staminaMax / 4;
      const horse = await Horse.findOne({name: horses[i].horse});
      if(horse.stamina < horses[i].staminaMax) {
        if(horse.stamina + staminaAd > horses[i].staminaMax) {
          await Horse.findOneAndUpdate({name: horses[i].horse}, {
            stamina: horses[i].staminaMax
          });
          console.log('Horse ' + horse.name + ' was regenerated.');
        } else {
          await Horse.findOneAndUpdate({name: horses[i].horse}, {
            stamina: horse.stamina + staminaAd
          });
          console.log('Horse ' + horse.name + ' was regenerated.');
        }
      }
    }
    console.log("Horse stamina has been regenerated.");
  });

  (async function () {
    await agenda.start();

    await agenda.every("6 hours", "regeneration");
  })();

function setDelay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  })
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

async function NbNftsMint() {
  try {
    const { data } = await http.get('/nfts/count?collection=' + collection);
    return {
      data: data,
      success: true
    };
  } catch (error) {
    return {
      data: error.response.data,
      success: false
    };
  }
};

async function fetchEstarWallet(wallet) {
  try {
    const { data } = await http.get(
      '/accounts/' + wallet + '/tokens?identifier=' + token
    );
    return data;
  } catch (error) {
    return error;
  }
};

async function getNfts(address) {
  var nfts = [];
  const { data } = await http.get(
      '/accounts/' + address + '/nfts?size=10000&collection=' + collection
  );
  for(let i = 0; i < data.length; i++) {
    const hrs = await Horse.findOne({name: data[i].name});
    nfts.push(hrs);
  }
  return nfts;
}

async function getNftsAvailable(address, id) {
  const nfts = await getNfts(address);
  var available = false;
  for(let i = 0; i < nfts.length; i++) {
    const horse = await Horse.findOne({name: nfts[i].name});
    if(!Boolean(horse.inRace) && horse.stamina >= 25) {
      available = true;
    }
  }

  return available;
}

async function checkIfRaceExist(id) {
  const data = await Race.findOne({id: id});
  if(data != null) return true;
  return false;
};

async function checkWalletInRace(id, address) {
  const race = await Race.findOne({id: id});
  var authorized = true;
  var k = 0;
  if(race != null) {
   for (let i = 0; i < race.player.length; i++) {
      if(race.player[i].address == address) {
        authorized = false;
        k++;
      };
   }
  }
  return {
    authorized: authorized,
    numberOfIssues: k
  };
}

async function createRace(data) {
  const fs = await Horse.findOne({name: data.horse});
  if(data.raceId == 1) {
    if(fs.stamina >= 25) {
      await Horse.findOneAndUpdate({name: data.horse}, {stamina: fs.stamina - 25});
    }
  }
  const idI = await data.raceId + '#' + makeid(7)
  await Horse.findOneAndUpdate(
      {name: data.horse}, {inRace: true, race: idI}
    );
  const CreateRace = new Race({
    _id: idI,
    id: data.raceId,
    bonus: Bonus[Math.floor(Math.random() * Bonus.length)],
    entryFee: data.entryFee,
    with: data.with,
    player: [
      {
        address: data.address,
        horse: data.horse,
        horseUrl: fs.fileUri,
        feePaid: data.feePaid,
      }
    ],
    date: moment().format("DD/MM/YYYY HH:mm")
  });
  CreateRace.save();

  return idI;
}

async function getSlots(id) {
  const data = await Race.find({id: id});
  return data[0].player.length;
};

async function updatePlayers(data) {
  const race = await Race.findOne({id: data.raceId});
  await Horse.findOneAndUpdate(
     {name: data.horse}, {inRace: true , race: race._id}
   );
  if(data.raceId == 1) {
    const fs = await Horse.findOne({name: data.horse});
    if(fs.stamina >= 25) {
      await Horse.findOneAndUpdate({name: data.horse}, {stamina: fs.stamina - 25});
    }
  }   
  await Race.updateOne({id: data.raceId}, { $push: {player: data}});

  return race._id;
}

async function bonus(bonus, horse) {
  let score = 0;
  if(bonus == "SPEED"){
    score = horse.speed * 1 + horse.endurance * 1 + horse.agility * 1 + (horse.luck - 4 + (Math.random() * horse.luck));
  }
  if(bonus == "AGILITY"){
    score = horse.speed * 1.2 + horse.endurance * 0.9 + horse.agility * 1.4 + (horse.luck - 4 + (Math.random() * horse.luck));
  }
  if(bonus == "ENDURANCE"){
    score = horse.speed * 1.1 + horse.endurance * 1.3 + horse.agility * 0.9 + (horse.luck - 4 + (Math.random() * horse.luck));
  }
  return score;
}

async function calculateScore(data) {
  const result = [];
  for (let i = 0; i < data.player.length; i++) {
    const horse = await Horse.findOne({name: data.player[i].horse});
    let score = await bonus(data.bonus, horse);
    result.push({address: data.player[i].address, horse: horse.name, score: score});
  }
  return result;
}

async function getWinners(data) {
  var values = [];
  for(var i = 0; i < data.length; i++) {
    values.push(data[i].score)
  }
  var first = await Math.max(...values);
  var second = 0;
  var third = 0;
  var winners = [];
  for(let i = 0; i < values.length; i++) {
    if(values[i] > second && values[i] < first) {
      second = values[i];
    }
  }
  for(let i = 0; i < values.length; i++) {
     if(values[i] > third && values[i] < second) {
      third = values[i];
    }   
  }
  for(let i = 0; i < data.length; i++) {
    const horse = await Horse.findOne({name: data[i].horse});
    if(data[i].score == first && data[i].horse == horse.name) {
      winners[0] ={
        position: 1,
        address: data[i].address,
        horse: data[i].horse,
        horseUrl: horse.fileUri,
        score: first
      }
    } else if(data[i].score == second) {
      winners[1] = {
        position: 2,
        address: data[i].address,
        horse: data[i].horse,
        horseUrl: horse.fileUri,
        score: second
      };
    } else if(data[i].score == third) {
      winners[2] = {
        position: 3,
        address: data[i].address,
        horse: data[i].horse,
        horseUrl: horse.fileUri,
        score: third
      }
    }
  }
   return winners;
}

function calculateReward(fee, percent) {
  if(fee == 0) return (15 * percent) / 100;
    else return ((((fee * 8) * 95) / 100) * percent) / 100;
}

async function updatePlayersReward(winners, positions, exist, payWith) {
  console.log(positions);
  if(exist) {
    const reward = await Reward.findOne({address: winners.address});
    if(payWith == 'ESTAR') {
      switch (winners.position) {
        case 1:
          await Reward.findOneAndUpdate(
            {address: winners.address}, {estar:
              reward.estar !== undefined ? reward.estar + positions.first :
              0 + positions.first
            }
          )
          break;
        case 2:
          await Reward.findOneAndUpdate(
            {address: winners.address}, {estar:
              reward.estar !== undefined ? reward.estar + positions.second :
              0 + positions.second
            }
          )
          break;
        case 3:
          await Reward.findOneAndUpdate(
            {address: winners.address}, {estar:
              reward.estar !== undefined ? reward.estar + positions.second :
              0 + positions.second
            }
          )
      break;
      }
    } else {
      switch (winners.position) {
        case 1:
          await Reward.findOneAndUpdate(
            {address: winners.address}, {egld:
              reward.egld !== undefined ? reward.egld + positions.first :
              0 + positions.first
            }
          )
          break;
        case 2:
          await Reward.findOneAndUpdate(
            {address: winners.address}, {egld:
              reward.egld !== undefined ? reward.egld + positions.second :
              0 + positions.second
            }
          )
          break;
        case 3:
          await Reward.findOneAndUpdate(
            {address: winners.address}, {egld:
              reward.egld !== undefined ? reward.egld + positions.third :
              0 + positions.third
            }
          )
        break;
      }
    }
  } else {
    if(payWith == 'ESTAR') {
      switch (winners.position) {
        case 1:
          const new_Item = new Reward({
            address: winners.address,
            estar: positions.first
          });
          new_Item.save();
          break;
        case 2:
          const new_Item2 = new Reward({
            address: winners.address,
            estar: positions.second
          });
          new_Item2.save();
          break;
        case 3:
          const new_Item3 = new Reward({
            address: winners.address,
            estar: positions.third
          });
          new_Item3.save();
        break;
      }
    } else {
      switch (winners.position) {
        case 1:
          const new_Item = new Reward({
            address: winners.address,
            egld: positions.first
          });
          new_Item.save();
          break;
        case 2:
          const new_Item2 = new Reward({
            address: winners.address,
            egld: positions.second
          });
          new_Item2.save();
          break;
        case 3:
          const new_Item3 = new Reward({
            address: winners.address,
            egld: positions.third
          });
          new_Item3.save();
        break;
      }
    }
  }
}

async function sendToWinnerReward(winners, entryFee, payWith) {
  const positions = {
    first: await calculateReward(entryFee, 46),
    second: await calculateReward(entryFee, 33.5),
    third: await calculateReward(entryFee, 20.5)
  }

  if(winners != null) {
    for(let i = 0; i < winners.length; i++) {
      const reward = await Reward.findOne({address: winners[i].address});
      if(reward != null) {
        await updatePlayersReward(winners[i], positions, true, payWith);
      } else {
        await updatePlayersReward(winners[i], positions, false, payWith);
      }
    }
  }
}

async function startGame(id) {
  const data = await Race.findOne({id: id});
  const result = await calculateScore(data);
  const winners = await getWinners(result, data);
  await setDelay(120000);
  var rewardIn = '';
  if(id == 1) rewardIn = 'ESTAR';
    else rewardIn = data.with;

  await sendToWinnerReward(winners, data.entryFee, rewardIn);
  const raceHS = new RaceHistory({
    _id: data._id,
    raceId: id,
    bonus: data.bonus,
    entryFee: data.entryFee,
    with: data.with,
    winners: winners,
    player: result,
    date: data.date
  });
  raceHS.save();
  for (let i = 0; i < data.player.length; i++) {
    await Horse.findOneAndUpdate(
      {name: data.player[i].horse}, {inRace: false, race: ''}
    );
  }
  Race.findOneAndDelete({id: id}, (err) => {
    if(err) {
      throw err;
    }
    console.log('Race deleted');
  });
}

io.on('connection', socket => {
  socket.on('get-status', async address => {
    const mints = await NbNftsMint();
    const estar = await fetchEstarWallet(address);
    let balance = 0;
    if(estar[0] != undefined) {
      balance = await Number(estar[0].balance) / 100;
    }
    const nfts = await getNfts(address);
    socket.emit('recive-status', nfts, mints.data, balance);
  });

  socket.on('get-players', async id => {
    const race = await Race.findOne({id: id});
    var players = 0;
    if(race != null) {
      players = race.player.length;
    }
    socket.emit('recive-players', players)
  })

  socket.on('get-available', async (race, address) => {

    var message = 'OK';

    const exist = await checkIfRaceExist(race.id);
    if(exist) {
      const raceDB = await Race.findOne({id: race.id});
      if(raceDB.player.length < 8) {
        const { numberOfIssues } = await checkWalletInRace(race.id, address);
        const nftsAvailable = await getNftsAvailable(address, race.id);
        if(race.maxEntryPerWallet <= numberOfIssues) {
          message = 'You have reached the maximum number of entries in this race!';
        } else if(Boolean(nftsAvailable) != true) {
          message = 'You no longer have horses available.';
        }
      } else {
        message = 'No more slots available.';
      }
    }
    socket.emit('recive-available', message);
  });
  socket.on('enter-race', async data => {
    var message = '';
    var raceCr = '';
    const exist = await checkIfRaceExist(data.raceId);
    if(!exist) {
      raceCr = await createRace(data);
      message = `You entered the race with ${data.horse}`;
    } else {
      const slots = await getSlots(data.raceId);
      if(slots == 7) {
          message = `You entered the race with ${data.horse}, and the game began.`;
          raceCr = await updatePlayers(data);
          startGame(data.raceId);
      } else if(slots != 7 && slots < 8) {
         raceCr = await updatePlayers(data);
          message = `You entered the race with ${data.horse}`;
      } else {
        message = 'All slots are occupied.';
      }
    }
    const response = await {
        message: message,
        showb: false,
        id: raceCr
      };
    await socket.emit('recive-response', response);
    console.log(message);
});

  // Race view

  socket.on('get-race', async ({id, address}) => {
    var race = await Race.findById(id);
    var status = false;
    var authorized = false;
    if(race != null) {
      for(let i = 0; i < race.player.length; i++) {
        if(race.player[i].address == address) {
          authorized = true;
        }
      }
      status = true;
      socket.emit('recive-race', {race, status, authorized})
    } else {
      race = await RaceHistory.findById(id);
      status = false;
      authorized = true;
      socket.emit('recive-race', {race, status, authorized})
    }
  });

  // Race History

  async function getRaceHistory(address) {
    var races = [];
    const history = await RaceHistory.find({"player.address": address}).sort({date: -1});
    for(let i = 0; i < history.length; i++) {
      races.push({id: history[i]._id, date: history[i].date});
    }
    return races;
  }

  socket.on('get-history', async address => {
    const races = await getRaceHistory(address)
    socket.emit('recive-history', races);
  });

  // Stable

  async function getInfo(address, up) {
    var data = {
      curLevel: 0,
      staminaMax: stables[0].staminaMax,
      nextLevel: 1,
      nextLevelPrice: stables[0].price,
      nextLevelStaminaMax: stables[0].staminaMax,
      nextLevelPriceHash: stables[0].hash,
      message: `Unlock level #1 for ${stables[0].price / 100} eStar`
    };
    const stable = await Stable.findOne({address: address});

    if(stable != null) {
        for (var i = 0; i < stables.length; i++) {
          if(stables[i].level == stable.level && stable.level < 5) {
            data.curLevel = stable.level;
            data.staminaMax = stables[i].staminaMax;
            data.nextLevelStaminaMax = stables[i+1].staminaMax;
            data.nextLevel = stables[i+1].level;
            data.nextLevelPrice = stables[i+1].price;
            data.nextLevelPriceHash = stables[i+1].hash;
            data.message = `Upgrade to level #${stables[i+1].level} for ${stables[i+1].price / 100} eStar`;
          }
        }
        if(stable.level == 5) {
          data.curLevel = stable.level;
          data.staminaMax = 250;
          data.nextLevelStaminaMax = 0;
          data.nextLevel = 5;
          data.nextLevelPrice = 0;
          data.nextLevelPriceHash = 0;
          data.message = `Max level`;
        }
      } else if(up) {
        data.curLevel = 1;
        data.staminaMax = 110;
        data.nextLevelStaminaMax = stables[1].staminaMax;
        data.nextLevel = 2;
        data.nextLevelPrice = stables[1].price;
        data.nextLevelPriceHash = stables[1].hash;
        data.message = `Upgrade to level #${stables[1].level} for ${stables[1].price / 100} eStar`;
      }

    return data;
  }

  socket.on('get-stable', async address => {
    const data = await getInfo(address);
    socket.emit('recive-stable', data);
  })

  socket.on('upgrade-stable', async address => {
    const stable = await Stable.findOne({address: address});
    if(stable == null) {
      const createStable = new Stable({
        address: address,
        level: 1,
        history: {
          level: 1,
          date: moment().format("DD/MM/YYYY HH:mm")
        },
        date: moment().format("DD/MM/YYYY HH:mm")
      });
      createStable.save();
    } else if(stable.level < 5) {
      const stableHistory = stable.history;
      stableHistory.push({
        level: stable.level + 1,
        date: moment().format("DD/MM/YYYY HH:mm")
      });
      await Stable.findOneAndUpdate({address: address}, {
        level: stable.level + 1,
        history: stableHistory,
      })
    }
    const data = await getInfo(address, true);
    socket.emit('up-recive-stable', data);
  });

  // Tournament

  async function getTournament() {
    const tournament = await Tournament.findOne({isActive: true});

    return tournament;
  }

  async function checkHorseInTournament(id, horse) {
    const tournament = await Tournament.findOne({_id: id});
    var authorized = true;
    if(tournament != null) {
      for (let i = 0; i < tournament.players.length; i++) {
        if(tournament.players[i].horse == horse) authorized = false;
      }
    }
    return authorized;
  }

  async function updatePlayersInTournament(id, horse, address, numberOfPlayers, maxPlayers) {
    const player = {
      address: address,
      horse: horse,
      date: moment().format("DD/MM/YYYY HH:mm")
    };
    if(numberOfPlayers < maxPlayers) {
      await Tournament.findOneAndUpdate({_id: id}, {
        $push: {players: player}
      });
      return true;
    } else return false;
  }

  socket.on('get-tournament', async () => {
    const tournament = await getTournament();
    socket.emit('recive-tournament', tournament);
  });

  socket.on('get-tournament-slots', async () => {
    const tournament = await getTournament();
    if(tournament != null) {
      const slots = tournament.maxPlayers - tournament.players.length;
      socket.emit('recive-tournament-slots', slots);
    }
  });

  socket.on('enter-tournament', async (address, horse) => {
    var message = '';
    const tournament = await getTournament();
    const authorized = await checkHorseInTournament(tournament._id, horse);
    if(tournament != null) {
      if(authorized) {
        const ok = await updatePlayersInTournament(
          tournament._id, horse, address,
          tournament.players.length,
          tournament.maxPlayers
        );
        if(ok) message = 'Success';
        else message = 'Tournament full!';
      } else {
        message = 'This horse is already in the tournament!';
      }
      socket.emit('recive-tournament-response', message);
    }
  });

  // Rewards
  
  socket.on('get-rewards', async address => {
    const reward = await Reward.findOne({address: address});
    if(reward != null) {
      if(reward.estar != undefined && reward.egld != undefined) {
        socket.emit('recive-rewards', reward.estar.toFixed(1), reward.egld.toFixed(3));
      } else if(reward.estar != undefined && reward.egld == undefined) {
        socket.emit('recive-rewards', reward.estar.toFixed(1), 0);
      } else if(reward.egld != undefined && reward.estar == undefined) {
        socket.emit('recive-rewards', 0, reward.egld.toFixed(3));
      }
    } else {
      socket.emit('recive-rewards', 0, 0);
    }
  })

  // Pana aici e versiunea Alpha 0.1.2 :))

});
