const { Composer } = require("telegraf");
const composer = new Composer();

const bot = require("../core/bot");
const messages = require("../lib/messages");
const keyboards = require("../lib/keyboards");

composer.start((ctx) => {
  console.log(ctx.message);
  ctx.replyWithHTML(
    `
  Assalamu alaykum ${ctx.message.from.first_name} \nWelcome to <b>Quran</b> bot,\n
  The bot created by @Khodza_I \n
  `,
    keyboards.start
  );
});
composer.action("help", (ctx) => {
  ctx.editMessageText(messages.start_help, {
    parse_mode: "HTML",
  });
});

bot.use(composer.middleware());
