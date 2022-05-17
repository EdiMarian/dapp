const races = [
  {
    id: 1,
    name: 'The Equistar Running',
    description: 'Get your Equistar horse, equip yourself and get ready to prove your riding skills in the race for 1st place. The other horses came in, what are you waiting for?',
    isActive: true,
    withEstar: false,
    withEgld: false,
    payFee: false,
    maxEntryPerWallet: 8,
    entryFee: 0,
    ranking: [
      {
        name: 'First',
        win: 6.9
      },
      {
        name: 'Second',
        win: 5.025
      },
      {
        name: 'Third',
        win: 3.075
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
    payFee: true,
    maxEntryPerWallet: 8,
    entryFee: 100,
    ranking: [
      {
        name: 'First',
        win: 349.6
      },
      {
        name: 'Second',
        win: 254.6
      },
      {
        name: 'Third',
        win: 155.8
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
    payFee: true,
    maxEntryPerWallet: 7,
    entryFee: 0.05,
    ranking: [
      {
        name: 'First',
        win: 0.1748
      },
      {
        name: 'Second',
        win: 0.1273
      },
      {
        name: 'Third',
        win: 0.0779
      }
    ],
    color: '#bf8013'
  }
];

export default races;
