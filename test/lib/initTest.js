'use strict';

const Bot = require('../../lib/Bot/');
const init = require('../../lib/init');

describe('init', () => {
  it('should initiate the bot accordingly', done => {
    const bot = init({
      name: 'Stan Marsh',
      token: process.env.STAN_MARSH_TOKEN,
      events: {
        ready(bot) {
          bot.sendMessageToChannel('231897815301750785', 'I just logged in, \'sup lads!');
        }
      }
    }).then(() => {
      done();
    });
  });
});
