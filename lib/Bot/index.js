const _ = require('lodash');
const assert = require('assert');

/**
 * The Client class from Discord.js.
 * @external Client
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/master/class/Client}
 */
const { Client } = require('discord.js');

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

    assert(
      !!options.token,
      'Your bot must have a token in order to log in'
    );

    this.botToken = options.token;

    this.name = options.name;
    this.game = options.game;
    this.botStatus = options.status || 'online';
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

    const eventFunction = function() {
      const args = _.flatten([
        this,
        ...arguments,
      ]);

      fn.apply(this, args);
    };

    this.on(event, eventFunction);
  }

  /**
   * Logs the bot in Discord.
   * @return {Promise<boolean>} A promise that resolves into a boolean saying if the bot has been logged in or not.
   */
  signin(setName) {
    return this.login(this.botToken).then(() => {
      const promises = [
        this._applyStatus(),
      ];

      if (setName === true) {
        promises.push(this._applyName());
      }

      return Promise.all(promises).then(results => _.every(results, Boolean));
    }).catch(error => {
      console.log(`An error occurred while logging ${this.name} in`);
      console.log(error);

      return false;
    });
  }

  /**
   * Sends a message to a certain channel.
   * @param {string} channelId - The channel ID to send the message to.
   * @param {string} message - The message to send.
   * @returns {Promise<boolean>} Whether all messages have been sent to all channels.
   */
  sendMessageToUser(userId, message) {
    const user = this._getOtherUser(userId);

    if (!user) {
      return Promise.resolve(false);
    }

    return this._sendMessage(user, message);
  }

  /**
   * Sends a message to a certain channel.
   * @param {string} channelId - The channel ID to send the message to.
   * @param {string} message - The message to send.
   * @returns {Promise<boolean>} Whether all messages have been sent to all channels.
   */
  sendMessageToChannel(channelId, message) {
    const channel = this._getChannel(channelId);

    if (!channel) {
      return Promise.resolve(false);
    }

    return this._sendMessage(channel, message);
  }

  /**
   * Replies to a given message with the also given content.
   *
   * @param {Message} message - The message issued to the bot.
   * @param {string} content - The content to used on the reply.
   *
   * @return {Promise<boolean>} Whether the message was successfully delivered or not.
   */
  replyToMessage(message, content) {
    return message.reply(content)
      .then(result => true)
      .catch(() => false);
  }

  /**
   * Broadcasts a message to all text channels this Bot is in.
   * @param {string} message - The message to send.
   * @returns {Promise<boolean>} Whether all messages have been sent to all channels.
   */
  broadcastMessage(message) {
    const channels = this.getOwnChannels();

    const promises = channels.map(channel => {
      return this._sendMessage(channel, message);
    });

    return Promise.all(promises)
      .then(results => results.length === channels.length);
  }

  /**
   * Private Methods zone
   */

  /**
   * Applies the current name to the bot.
   * @returns {Promise<boolean>} A promise that resolves into a boolean saying if the name was set or not.
   * @private
   */
  _applyName() {
    const user = this.getUser();

    return user.setUsername(this.name)
      .then(user => user.username === this.name)
      .catch(error => {
        console.log(`An error occurred while setting the name ${this.name} to the Bot`);
        console.log(error);

        return false;
      });
  }

  /**
   * Applies the current status to the bot.
   * @returns {Promise<boolean>} A promise that resolves into a boolean saying if the status was set or not.
   * @private
   */
  _applyStatus() {
    const user = this.getUser();

    const promises = [
      user.setStatus(this.botStatus),
    ];

    if (!_.isUndefined(this.game)) {
      promises.push(user.setGame(this.game));
    }

    return Promise.all(promises)
      .then(([user]) => user.presence.status === this.botStatus)
      .catch(error => {
        console.log(`An error occurred while setting the status ${this.status} to the Bot`);
        console.log(error);

        return false;
      });
  }

  /**
   * Sends the given message to a certain object.
   */
  _sendMessage(object, message) {
    return object.send(message)
      .then(() => true)
      .catch(error => {
        console.log(`An error occurred while sending the message to object ${object.id}`);
        console.log(error);

        return false;
      });
  }

  /**
   * Gets the user object for a certain user.
   * @returns {external:User} The user for the given ID.
   */
  _getOtherUser(id) {
    return this.users.get(id) || null;
  }

  /**
   * Gets the channel for a certain ID.
   * @returns {external:Channel} The channel for the given ID.
   */
  _getChannel(id) {
    return _.find(this.getChannels(), ['id', id]);
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
    return this._applyName();
  }

  /**
   * Sets the status of the Bot.
   * @param {string} status - The status of the bot.
   * @returns {Promise<boolean>} A promise that resolves into a boolean saying if the name was set or not.
   */
  setStatus(status) {
    this.botStatus = status;
    return this._applyStatus();
  }

  /**
   * Sets the game of the Bot.
   * @param {string|Object} status - The status of the bot.
   * @returns {Promise<boolean>} A promise that resolves into a boolean saying if the name was set or not.
   */
  setGame(game) {
    this.game = game;
    return this._applyStatus();
  }

  /**
   * Gets the user of the current bot.
   * @returns {external:User} The user of the bot.
   */
  getUser() {
    return this.user;
  }

  /**
   * Gets the game of the current bot.
   * @returns {external:Game} The name of the game of the bot.
   */
  getGame() {
    const user = this.getUser();
    const { game } = user.presence;

    return game;
  }

  /**
   * Gets the status of the current bot.
   * @returns {string} The name of the game of the bot.
   */
  getStatus() {
    const user = this.getUser();
    const { status } = user.presence;

    return status;
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
    return _.filter(this.getChannels(), channel => {
      const members = (channel.members || []).array();

      const id = this.getUser().id;
      return _.some(members, ['id', id]);
    });
  }

  /**
   * Gets an array of text channels this bot is in.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getTextChannels() {
    return _.filter(this.getChannels(), ['type', 'text']);
  }

  /**
   * Gets an array of guild channels this client knows.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getGuildChannels() {
    return _.filter(this.getChannels(), ['type', 'group']);
  }

  /**
   * Gets an array of voice channels this client knows.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getVoiceChannels() {
    return _.filter(this.getChannels(), ['type', 'voice']);
  }

  /**
   * Gets an array of direct message channels this client knows.
   * @returns {Array<external:Channel>} The array of channels.
   */
  getDMChannels() {
    return _.filter(this.getChannels(), ['type', 'dm']);
  }
}

module.exports = Bot;
