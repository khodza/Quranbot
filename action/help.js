const bot = require("../core/bot");
const { Composer } = require("telegraf");
const composer = new Composer();
const messages = require("../lib/messages");

composer.help((ctx) => {
  ctx.replyWithHTML(
    `<b>${messages.help}:</b> \n\nTo start tab to 👉🏼 /allsurahs  `
  );
});
bot.use(composer.middleware());
