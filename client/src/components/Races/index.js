const races = [
  {
    id: 1,
    name: 'The Equistar Running',
    description: 'Get your Equistar horse, equip yourself and get ready to prove your riding skills in the race for 1st place. The other horses came in, what are you waiting for?',
    isActive: true,
    withEstar: false,
    withEgld: true,
    entryFee: 0,
    ranking: [
      {
        name: 'First',
        win: 7
      },
      {
        name: 'Second',
        win: 5
      },
      {
        name: 'Third',
        win: 3
      }
    ],
    color: '#15a13a'
  },
  {
    id: 2,
    name: 'The Equistar Running',
    description: 'Get your Equistar horse, equip yourself and get ready to prove your riding skills in the race for 1st place. The other horses came in, what are you waiting for?',
    withEstar: true,
    withEgld: false,
    isActive: true,
    entryFee: 100,
    ranking: [
      {
        name: 'First',
        win: 360
      },
      {
        name: 'Second',
        win: 260
      },
      {
        name: 'Third',
        win: 140
      }
    ],
    color: '#bf9713'
  },
  {
    id: 3,
    name: 'The Equistar Running',
    description: 'Get your Equistar horse, equip yourself and get ready to prove your riding skills in the race for 1st place. The other horses came in, what are you waiting for?',
    withEstar: false,
    withEgld: true,
    isActive: true,
    entryFee: 0.05,
    ranking: [
      {
        name: 'First',
        win: 15
      },
      {
        name: 'Second',
        win: 10
      },
      {
        name: 'Third',
        win: 7
      }
    ],
    color: '#bf8013'
  }
];

export default races;
