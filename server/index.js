const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Agenda = require('agenda');
const moment = require('moment');

const Race = require('./models/Race');
const Horse = require('./models/Horse');
const RaceHistory = require('./models/RaceHistory');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION);

// Stamina regeneration

const agenda = new Agenda({ db: { address: process.env.DB_CONNECTION } });

agenda.define("regeneration", async (job) => {
  const data = await Horse.find({stamina: {$in: [0,25,50,75]}});
  for (let i = 0; i < data.length; i++) {
    if(data[i].stamina <= 75) {
      await Horse.findOneAndUpdate({name: data[i].name}, {stamina: data[i].stamina + 25});
    }
  }
  console.log("Horse stamina has been regenerated.");
});

(async function () {
  await agenda.start();

  await agenda.every("6 hours", "regeneration");
})();


// FrontEnd-to-Backend comunication

const io = require('socket.io')(process.env.PORT, {
  cors: {
    origin: ['https://176.223.121.41', 'http://176.223.121.41'],
    method: ['GET', 'POST', 'PATCH']
  }
});

// VAR

const Bonus = ['SPEED', 'ENDURANCE', 'AGILITY'];

const api = 'https://api.elrond.com';

const http = axios.create({
  baseURL: api,
  headers: { 'Content-Type': 'application/json' }
});

const collection = 'EQUISTAR-3f393f';

//

function setDelay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  })
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

async function getNfts(address) {
  var nfts = [];
  const { data } = await http.get(
      '/accounts/' + address + '/nfts?collection=' + collection
  );
  for(let i = 0; i < data.length; i++) {
    const hrs = await Horse.findOne({name: data[i].name});
    nfts.push(hrs);
  }
  return nfts;
}

async function checkExist(id) {
  const data = await Race.find({id: id});
  if(data.length > 0) return true;
  return false;
};

async function checkWalletInRace(id, address) {
  const race = await Race.findOne({id: id});
  var check = true;
  if(race != null) {
   for (let i = 0; i < race.player.length; i++) {
      if(race.player[i].address == address) check = false;
   }
  }
  return check;
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

async function startGame(id) {
  const data = await Race.findOne({id: id});
  const result = await calculateScore(data);
  const winners = await getWinners(result, data);
  await setDelay(120000);
  const raceHS = new RaceHistory({
    _id: data._id,
    raceId: id,
    bonus: data.bonus,
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
  socket.on('get-nfts', async address => {
    const data = await getNfts(address);
    socket.emit('recive-nfts', data);
  });
  socket.on('get-available', async av => {
    const authorized = await checkWalletInRace(av.id, av.address)
    var isAvailable = false;
    if(authorized) {
      const data = await Race.find({id: av.id});
      if(data.length != 0) {
        if(data[0].player.length > 0 && data[0].player.length < 8) {
          isAvailable = true;
        } else {
          isAvailable = false;
        }
      } else if(data.length == 0) {
        isAvailable = true;
      }
    };
    const avOB = await {
      isAvailable: isAvailable,
      authorized: authorized
    }
    socket.emit('recive-available', avOB);
  });
  socket.on('enter-race', async data => {
    var message = '';
    const exist = await checkExist(data.raceId);
    if(!exist) {
      await createRace(data);
      message = `You entered the race with ${data.horse}`;
    } else {
      const slots = await getSlots(data.raceId);
      if(slots == 7) {
          message = `You entered the race with ${data.horse}, and the game began.`;
          await updatePlayers(data);
          startGame(data.raceId);
      } else if(slots != 7 && slots < 8) {
          await updatePlayers(data);
          message = `You entered the race with ${data.horse}`;
      } else {
        message = 'All slots are occupied.';
      }
    }
    const response = await {
        message: message,
        showb: false,
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
  })

});


