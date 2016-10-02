'use strict';

const _ = require('lodash');
const assert = require('assert');
const Promise = require('bluebird');

/**
 * The Client class from Discord.js.
 * @external Client
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/master/class/Client}
 */
const Client = require('discord.js').Client;

/**
 * The User class from Discord.js.
 * @external User
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/master/class/User}
 */

/**
 * The Channel class from Discord.js.
 * @external Channel
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/master/class/Channel}
 */

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

    this.on(event, fn.bind(null, this));
  }

  /**
   * Logs the bot in Discord.
   * @return {Promise<boolean>} A promise that resolves into a boolean saying if the bot has been logged in or not.
   */
  signin(setName) {
    const loginArgs = [];

    if (!!this.auth.token) {
      loginArgs.push(this.auth.token);
    } else {
      loginArgs.push(this.auth.email);
      loginArgs.push(this.auth.password);
    }

    return this.login.apply(this, loginArgs).then(() => {
      if (setName) {
        return this._applyName().then(() => {
          return true;
        }).catch(() => {});
      }

      return true;
    }).catch(error => {
      console.log(`An error occurred while logging ${this.name} in`);
      console.log(error);

      return Promise.reject(false);
    });
  }

  /**
   * Broadcasts a message to all text channels this Bot is in.
   * @param {string} message - The message to send.
   * @returns {Promise<boolean>} Whether all messages have been sent to all channels.
   */
  broadcastMessage(message) {
    const channels = this.getOwnChannels();

    return Promise.all(channels.map(channel => {
      return channel.sendMessage(message).then(() => {
        return true;
      }).catch(error => {
        console.log(`An error occurred while sending the message to channel ${channel.id}`);
        console.log(error);

        return Promise.reject(false);
      });
    })).then(successArray => {
      return successArray.some(success => {
        return success;
      });
    });
  }

  /**
   * Private Methods zone
   */

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

  /**
   * Applies the current name to the bot.
   * @returns {Promise<boolean>}  A promise that resolves into a boolean saying if the name was set or not.
   * @private
   */
  _applyName() {
    const user = this.getUser();

    return user.setUsername(this.name).then(user => {
      return user.username === this.name;
    }).catch(error => {
      console.log(`An error occurred while setting the name ${this.name} to the Bot`);
      console.log(error);

      return Promise.reject(false);
    });
  }

  /**
   * Getter and Setter zone
   */

  /**
   * Gets the name of the bot.
   * @returns {string} The name of the bot.
   */
  getName() {
    return this.name;
  }

  /**
   * Sets the name of the Bot.
   * @param {string} name - The name to set on the bot.
   */
  setName(name) {
    this.name = name;
    this._applyName();
  }

  /**
   * Gets the user of the current bot.
   * @returns {external:User} The user of the bot.
   */
  getUser() {
    return this.user;
  }

  /**
   * Gets an array of channels this client knows.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getChannels() {
    return this.channels.array();
  }

  /**
   * Gets the channels this bot belongs to.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getOwnChannels() {
    return this.getChannels().filter(channel => {
      const members = (channel.members || []).array();

      return members.some(member => {
        return member.id === this.getUser().id;
      });
    });
  }

  /**
   * Gets an array of text channels this bot is in.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getTextChannels() {
    return this.getChannels().filter(channel => {
      return channel.type === 'text';
    });
  }

  /**
   * Gets an array of guild channels this client knows.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getGuildChannels() {
    return this.getChannels().filter(channel => {
      return channel.type === 'group';
    });
  }

  /**
   * Gets an array of voice channels this client knows.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getVoiceChannels() {
    return this.getChannels().filter(channel => {
      return channel.type === 'voice';
    });
  }

  /**
   * Gets an array of direct message channels this client knows.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getDMChannels() {
    return this.getChannels().filter(channel => {
      return channel.type === 'dm';
    });
  }
}

module.exports = Bot;
