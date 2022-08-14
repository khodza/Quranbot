const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKEN);
bot.launch();
module.exports = bot;
