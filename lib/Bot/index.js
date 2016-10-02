'use strict';

const _ = require('lodash');
const assert = require('assert');

/**
 * The Client class from Discord.js.
 * @external Client
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/master/class/Client}
 */
const Client = require('discord.js').Client;

const allowedEvents = require('./allowedEvents');

/**
 * Represents the Bot, which is basically an extension of Discord.js's Client class.
 * @extends external:Client
 */
class Bot extends Client {
  /**
   * Represents the authentication means for a Bot.
   * @typedef {Object} Bot~BotAuth
   * @property {string} token - The OAuth2 token for your bot.
   * @property {string} email - The e-mail of your bot.
   * @property {string} password - The password of your bot.
   */

  /**
   * Represents data on the options to send in to a Bot. The BotOptions typedef can also receive any of the options passed in to create a Client instance.
   * @typedef {Object} Bot~BotOptions
   * @property {string} name - The name/username of the Bot.
   * @property {...Bot~BotAuth} auth - The authentication means for your bot.
   */

  /**
   * Create a Bot.
   * @param {...Bot~BotOptions} options - The options to set on the Bot.
   */
  constructor(options) {
    super(options);

    this._validateAuth(options.auth);

    this.name = options.name;
    this.auth = options.auth;
  }

  /**
   * Sets an event for this bot.
   * @param {string} event - The name of the event to set.
   * @param {Function} fn - The function to trigger upon emition of said event.
   */
  setEvent(event, fn) {
    if (_.indexOf(allowedEvents, event) === -1) {
      throw new Error(`You are not allowed to set an event ${event} to bot ${this.name}`);
    }

    this.on(event, fn);
  }

  /**
   * Logs the bot in Discord.
   */
  login() {
    const loginArgs = [];

    if (!!this.auth.token) {
      loginArgs.push(this.auth.token);
    } else {
      loginArgs.push(this.auth.email);
      loginArgs.push(this.auth.password);
    }

    this.login.apply(this, loginArgs);
  }

  /**
   * Validates the authentication object.
   * @param {...Bot~BotAuth} auth - The authentication object to validated.
   * @private
   */
  _validateAuth(auth) {
    assert(
      !!auth.token || (!!auth.email && !!auth.password),
      'Your bot\'s authentication means must contain either way a token, or credentials!'
    );
  }
}

module.exports = Bot;
