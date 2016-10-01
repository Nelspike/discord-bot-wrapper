'use strict';

const _ = require('lodash');
const assert = require('assert');
const Discord = require('discord.js');

const allowedEvents = require('./allowedEvents');

class Bot {
  constructor(options) {
    assert(
      !!options.token || (!!options.email && !!options.password),
      'Your bot must contain either way a token, or credentials!'
    );

    this.name = options.name;
    this.token = options.token;
    this.email = options.email;
    this.password = options.password;

    this.bot = new Discord.Client({
      revive: !!options.revive,
    });
  }

  setEvent(event, fn) {
    if (_.indexOf(allowedEvents, event) === -1) {
      throw new Error(`You are not allowed to set an event ${event} to bot ${this.name}`);
    }

    this.bot.on(event, fn);
  }

  login() {
    if (this.token) {
      this.bot.login(this.token);
    } else {
      this.bot.login(this.email, this.password);
    }
  }
}

module.exports = Bot;
