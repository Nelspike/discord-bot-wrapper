const { expect } = require('chai');

const Bot = require('../../lib/Bot');

describe('Bot Class', () => {
  it('should initiate with the correct parameters', () => {
    new Bot({
      name: 'Test bot',
      token: 'Some token',
    });
  });

  it('should not initiate a bot without authentication', () => {
    const withoutAnything = () => {
      new Bot({
        name: 'Test bot',
      });
    }

    expect(withoutAnything).to.throw(Error);
  });

  it('should log the bot in', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      token: process.env.STAN_MARSH_TOKEN,
    });

    bot.signin().then(success => {
      expect(success).to.equal(true);
      done();
    });
  });

  it('should apply the name to the bot', done => {
    const bot = new Bot({
      name: 'Not Cartman',
      token: process.env.STAN_MARSH_TOKEN,
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
      token: process.env.STAN_MARSH_TOKEN,
    });

    bot.signin().then(success => {
      expect(bot.getStatus()).to.equal('online');
      done();
    });
  });

  it('should change the game of the bot', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      status: 'online',
      game: 'South Park',
      token: process.env.STAN_MARSH_TOKEN,
    });

    bot.signin().then(success => {
      const game = bot.getGame();
      expect(game.name).to.equal('South Park');
      done();
    });
  });

  it('should send a message to a channel', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      token: process.env.STAN_MARSH_TOKEN,
    });

    bot.signin().then(success => {
      bot.sendMessageToChannel(
        '231897815301750785',
        'Just testing the direct channel message!'
      ).then(success => {
        expect(success).to.equal(true);
        done();
      });
    });
  });

  it('should send a message to a user', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      token: process.env.STAN_MARSH_TOKEN,
    });

    bot.signin().then(success => {
      bot.sendMessageToUser(
        '168447562376806401',
        'Just testing the direct user message!'
      ).then(success => {
        expect(success).to.equal(true);
        done();
      });
    });
  });

  it('should broadcast a message to all channels', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      token: process.env.STAN_MARSH_TOKEN,
    });

    bot.signin().then(success => {
      bot.broadcastMessage('Ready to rock with Kyle!').then(success => {
        expect(success).to.equal(true);
        done();
      });
    });
  });

  it('should receive all arguments to an event', done => {
    const bot = new Bot({
      name: 'Stan Marsh',
      token: process.env.STAN_MARSH_TOKEN,
    });

    bot.setEvent('warn', (bot, arg1, arg2) => {
      expect(arg1).to.be.ok;
      expect(arg2).to.be.ok;

      expect(arg1).to.equal('Argument 1');
      expect(arg2).to.equal('Argument 2');
      done();
    });

    bot.signin().then(success => {
      bot.emit('warn', 'Argument 1', 'Argument 2');
    });
  });
});
