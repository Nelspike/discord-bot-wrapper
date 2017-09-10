const _ = require('lodash');
const assert = require('assert');

const Bot = require('./Bot/');

/**
 * Initiates the bot with events, and sets its options.
 * @params {Object} options - The options to pass in to the bot.
 * @returns {Bot} The created bot.
 */
function init(options) {
  assert(options.name, 'Your bot must have a name!');

  const bot = new Bot(options);

  _.keys(options.events).forEach(key => {
    const eventFn = options.events[key];
    bot.setEvent(key, eventFn);
  });

  return bot.signin(options.setName).then(() => bot);
};

module.exports = init;
