'use strict';

const Bot = require('../../lib/Bot/');
const init = require('../../lib/init');

describe('init', () => {
  it('should initiate the bot accordingly', done => {
    const bot = init({
      name: 'Stan Marsh',
      instantLogin: true,
      auth: {
        token: process.env.STAN_MARSH_TOKEN,
      },
      events: {
        ready(bot) {
          bot.broadcastMessage('I just logged in, \'sup lads!');
        },
      }
    }).then(() => {
      done();
    });
  });
});
