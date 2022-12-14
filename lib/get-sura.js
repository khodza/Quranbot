const axios = require("axios");

const { Composer, Markup } = require("telegraf");

const url = "http://api.alquran.cloud/v1/surah";

const bot = require("../core/bot");

const composer = new Composer();

async function handleGetSurah(ctx) {
  let callbackData = ctx.callbackQuery.data;

  const reg = /\d+/g;

  let id = callbackData.match(reg)[0];

  let {
    number,
    name,
    englishName,
    englishNameTranslation,
    revelationType,
    numberOfAyahs,
  } = await axios.get(`${url}/${id}?offset=0&limit=1`).then((res) => {
    return res.data.data;
  });

  ctx.deleteMessage();
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `<b>๐ Position</b>: ${number}\n\n๐ฏ๐ด Arabic Name: ${name}\n\n<b>๐ด๓ ง๓ ข๓ ฅ๓ ฎ๓ ง๓ ฟ English Name</b>: ${englishName}\n\n<b>๐ด๓ ง๓ ข๓ ฅ๓ ฎ๓ ง๓ ฟ English Translation</b>: ${englishNameTranslation}\n\n<b>๐ Revelation</b>: ${
      revelationType === "Meccan" ? "Meccan ๐" : "Meddina ๐ "
    }\n\n<b>๐Number of Ayahs</b>: ${numberOfAyahs}`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("Audio ๐ง", `get_surah_audio-${id}`),
          Markup.button.callback("Ayyahs ๐", `ayyahs-${id}`),
        ],
        [Markup.button.callback(" ๐ Back to all Surahs ๐", `next_0`)],
      ]),
    }
  );
  await ctx.scene.leave();
}
bot.use(composer.middleware());
module.exports = {
  handleGetSurah,
};
