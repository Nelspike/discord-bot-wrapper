/**
 * Exports for the discord-bot-wrapper.
 * @returns {Object} An object that includes the `init` function, as well as the `Bot` class.
 */
module.exports = {
  init: require('./lib/init'),
  Bot: require('./lib/Bot'),
};
