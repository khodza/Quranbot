const axios = require("axios");

const {
  Markup,
  Scenes: { BaseScene },
  session,
} = require("telegraf");

const url = "http://api.alquran.cloud/v1/surah";

const ayahScene = new BaseScene("getayah");

let data, id;
ayahScene.enter(async (ctx) => {
  if (ctx.callbackQuery) {
    let callbackData = ctx.callbackQuery.data;
    const reg = /\d+/g;

    id = callbackData.match(reg)[0];

    data = await axios.get(`${url}/${id}?offset=0&limit=1`).then((res) => {
      return res.data.data;
    });

    await ctx.reply(
      `Send me the number of Ayah 🔖 of Sura 📜 <b>${data.englishName}</b>\nFrom 1 to ${data.numberOfAyahs}`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("🔙 Back to Surah 📜", `getsura-${id}`)],
          [Markup.button.callback(" 🔙 Back to all Surahs 📖", `next_0`)],
        ]),
      }
    );
    ctx.answerCbQuery();
  } else {
    id = ctx.session.id;
  }
});

ayahScene.on("text", async (ctx) => {
  const ayahNumber = Number(ctx.message.text);
  if (ayahNumber && ayahNumber > 0 && ayahNumber <= data.numberOfAyahs) {
    const arabicData = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${id}:${ayahNumber}/ar.alafasy`
    );

    const englishData = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${id}:${ayahNumber}/en.asad`
    );

    await ctx.replyWithAudio(`${arabicData.data.data.audio}`);
    await ctx.replyWithHTML(
      `<i>🇯🇴 Arabic (original)</i>:\n${arabicData.data.data.text}\n\n<i>🏴󠁧󠁢󠁥󠁮󠁧󠁿 English translation</i>:\n<b>${englishData.data.data.text}</b>`,
      {
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback("Choose other ayah 🔖", `ayyahs-${id}`),
            Markup.button.callback(
              "Get photo 🌃",
              `photoAyah-${id}-${ayahNumber}`
            ),
          ],

          [Markup.button.callback("🔙 Back to Surah 📜", `getsura-${id}`)],
          [Markup.button.callback(" 🔙 Back to all Surahs 📖", `next_0`)],
        ]),
      }
    );

    await ctx.scene.leave();
  } else {
    await ctx.replyWithHTML(
      `❌ This is not valid number.Please send again 🔁`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback("Choose other ayah 🔖", `ayyahs-${id}`)],
          [Markup.button.callback("🔙 Back to Surah 📜", `getsura-${id}`)],
          [Markup.button.callback(" 🔙 Back to all Surahs 📖", `next_0`)],
        ]),
      }
    );

    ctx.session.id = `${id}`;
    return ctx.scene.enter("getayah", ctx);
  }
});

module.exports = { ayahScene };
