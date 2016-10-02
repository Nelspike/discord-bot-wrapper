'use strict';

const expect = require('chai').expect;

const Bot = require('../../lib/Bot');

describe('Bot Class', () => {
  it('should initiate with the correct parameters', () => {
    new Bot({
      name: 'Test bot',
      auth: {
        token: 'Some token',
      },
    });
  });

  it('should not initiate a bot without authentication', () => {
    const withoutAnything = () => {
      new Bot({
        name: 'Test bot',
      });
    }

    const withoutPassword = () => {
      new Bot({
        name: 'Test bot',
        auth : {
          email: 'some@email.com',
        },
      });
    }

    const withoutEmail = () => {
      new Bot({
        name: 'Test bot',
        auth: {
          password: 'random-pw',
        },
      });
    }

    expect(withoutAnything).to.throw(Error);
    expect(withoutPassword).to.throw(Error);
    expect(withoutEmail).to.throw(Error);
  });

  it('should log the bot in', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      auth: {
        token: process.env.STAN_MARSH_TOKEN,
      },
    });

    bot.signin().then(success => {
      expect(success).to.equal(true);
      done();
    });
  });

  it('should apply the name to the bot', done => {
    const bot = new Bot({
      name: 'Not Cartman',
      auth: {
        token: process.env.STAN_MARSH_TOKEN,
      },
    });

    bot.signin(true).then(success => {
      expect(bot.getUser().username).to.equal('Not Cartman');
      done();
    });
  });

  it('should change the status of the bot', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      status: 'online',
      auth: {
        token: process.env.STAN_MARSH_TOKEN,
      },
    });

    bot.signin().then(success => {
      expect(bot.getUser().status).to.equal('online');
      done();
    });
  });

  it('should change the game of the bot', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      status: 'online',
      game: 'South Park',
      auth: {
        token: process.env.STAN_MARSH_TOKEN,
      },
    });

    bot.signin().then(success => {
      expect(bot.getUser().game).to.deep.equal({
        name: 'South Park',
      });
      done();
    });
  });

  it('should broadcast a message to all channels', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      auth: {
        token: process.env.STAN_MARSH_TOKEN,
      },
    });

    bot.signin().then(success => {
      bot.broadcastMessage('Ready to rock with Kyle!').then(success => {
        expect(success).to.equal(true);
        done();
      });
    });
  });
});
