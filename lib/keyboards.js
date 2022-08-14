const { Markup } = require("telegraf");

const keyboards = {
  start: Markup.inlineKeyboard([
    Markup.button.callback("Show more commands", "help"),
  ]),
};
module.exports = keyboards;
