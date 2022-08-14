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
    `<b>🆔 Position</b> : ${number}\n\n🇯🇴 Arabic Name : ${name}\n\n <b>🏴󠁧󠁢󠁥󠁮󠁧󠁿 English Name</b> : ${englishName}\n\n<b>🏴󠁧󠁢󠁥󠁮󠁧󠁿 English Translation</b> : ${englishNameTranslation}\n\n<b>Revelation</b>: ${
      revelationType === "Meccan" ? "Meccan 🕋" : "Meddina 🕌 "
    }\n\n<b>🔖Number of Ayahs </b>: ${numberOfAyahs}`,

    // console.log(
    //   Markup.inlineKeyboard([
    //     Markup.button.callback("Audio", `get_surah_audio-${id}`),
    //     Markup.button.callback("Ayyahs", `ayyahs-${id}`),
    //   ])
    // ),

    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("Audio 🎧", `get_surah_audio-${id}`),
          Markup.button.callback("Ayyahs 🔖", `ayyahs-${id}`),
        ],
        [Markup.button.callback(" 🔙 Back to all Suras 📖", `next_0`)],
      ]),
    }
  );
  await ctx.scene.leave();
}
bot.use(composer.middleware());
module.exports = {
  handleGetSurah,
};
