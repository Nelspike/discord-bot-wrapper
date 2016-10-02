# Discord.js Bot Wrapper

[![Build Status](https://travis-ci.org/Nelspike/discord-bot-wrapper.svg?branch=master)](https://travis-ci.org/Nelspike/discord-bot-wrapper)

Welcome to Discord.js Bot wrapper! This tiny library is just basically a wrapper for Discord.js's Client, more specifically used for bots. If you want to learn how to set your Bot up, head out to [this page](https://discordapp.com/developers/docs/intro).

## Installation

As any other npm package, this one is easily added to your project:

```bash
npm install --save discord-bot-wrapper
```

## Usage

It is also simple to use! Just initialise your bot as such:

```javascript
const bot = require('discord-bot-wrapper')({
  name: 'My bot',
  auth: {
    token: 'mytoken',
  },
  events: {
    message(message) {
      // My logic goes here
    }
  }
});
```
