'use strict';

const _ = require('lodash');
const assert = require('assert');

module.exports = options => {
  assert(options.name, 'Your bot must have a name!');
  assert(options.auth, 'Your bot must have authentication means!');
  assert(options.events, 'Your bot must have events!');

  const botOptions = {
    name: options.name,
    revive: options.revive,
  };

  _.keys(options.auth).forEach(key => {
    botOptions[key] = options.auth[key];
  });

  const bot = new require('./lib/Bot')(botOptions);

  _.keys(options.events).forEach(key => {
    bot.setEvent(key, options.events[key]);
  });

  bot.login();

  return bot;
};
