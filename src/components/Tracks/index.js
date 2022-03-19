import React from 'react';
import Button from '../Button';

const tracks = [
  {
    title: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    entryFee: 0,
    ranking: [
      {
        name: 'First',
        win: 5
      },
      {
        name: 'Second',
        win: 2
      },
      {
        name: 'Third',
        win: 1
      }
    ],
    color: '#15a13a',
    icon: '...',
    button: (
      <Button name='Entry Free' icon='...' color='#15a13a' path='track/1' />
    )
  },
  {
    title: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    entryFee: 0,
    ranking: [
      {
        name: 'First',
        win: 10
      },
      {
        name: 'Second',
        win: 7
      },
      {
        name: 'Third',
        win: 5
      }
    ],
    color: '#bf9713',
    icon: '...',
    button: <Button name='Track #1' icon='...' color='#bf9713' path='track/2' />
  },
  {
    title: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    entryFee: 0,
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
    color: '#bf8013',
    icon: '...',
    button: <Button name='Track #2' icon='...' color='#bf8013' path='track/3' />
  },
  {
    title: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    entryFee: 0,
    ranking: [
      {
        name: 'First',
        win: 5
      },
      {
        name: 'Second',
        win: 2
      },
      {
        name: 'Third',
        win: 1
      }
    ],
    color: '#bf6913',
    icon: '...',
    button: <Button name='Track #3' icon='...' color='#bf6913' path='track/4' />
  },
  {
    title: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
    entryFee: 0,
    ranking: [
      {
        name: 'First',
        win: 5
      },
      {
        name: 'Second',
        win: 2
      },
      {
        name: 'Third',
        win: 1
      }
    ],
    color: '#bf3e13',
    icon: '...',
    button: <Button name='Track #4' icon='...' color='#bf3e13' path='track/5' />
  }
];

export default tracks;
