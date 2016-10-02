'use strict';

const _ = require('lodash');
const assert = require('assert');

const Bot = require('./Bot/');

/**
 * Initiates the bot with events, and sets its options.
 * @params {Object} options - The options to pass in to the bot.
 * @returns {Bot} The created bot.
 */
const init = options => {
  assert(options.name, 'Your bot must have a name!');
  assert(options.events, 'Your bot must have events!');

  const bot = new Bot(options);

  _.keys(options.events).forEach(key => {
    const eventFn = options.events[key];
    bot.setEvent(key, eventFn);
  });

  if (options.instantLogin === true) {
    bot.login();
  }

  return bot;
};

module.exports = init;