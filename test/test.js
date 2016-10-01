'use strict';

const expect = require('chai').expect;

const Bot = require('../lib/Bot');

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

    const withoutPassword = () => {
      new Bot({
        name: 'Test bot',
        email: 'some@email.com',
      });
    }

    const withoutEmail = () => {
      new Bot({
        name: 'Test bot',
        password: 'random-pw',
      });
    }

    expect(withoutAnything).to.throw(Error);
    expect(withoutPassword).to.throw(Error);
    expect(withoutEmail).to.throw(Error);
  });
});
