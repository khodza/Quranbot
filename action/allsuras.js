const axios = require("axios");

const { Composer, Markup } = require("telegraf");

const bot = require("../core/bot");

const url = "http://api.alquran.cloud/v1/surah";

const composer = new Composer();

const { handleGetSurah } = require("../lib/get-sura");
const {
  handleGetAyahPhoto,
  handleGetSurahAudio,
  handleGetAyahs,
} = require("../lib/callBackHandlers");
const {
  handleNextButton,
  handlePreviousButton,
} = require("../lib/suras-pagination");

const perPage = 10;

composer.command("allsuras", async (ctx) => {
  await ctx.scene.leave();
  let keyboards = [];
  let data = await axios.get(url).then((res) => {
    return res.data.data;
  });

  for (let sura of data) {
    keyboards.push([
      Markup.button.callback(
        `${sura.englishName} | ${sura.name}| ${sura.number}`,
        `getsura-${sura.number}`
      ),
    ]);
  }
  ctx.replyWithHTML(
    "Choose sura from the list:",

    Markup.inlineKeyboard([
      ...keyboards.slice(0, perPage),
      [
        Markup.button.callback("⬅️ previous ", "previous_1"),
        Markup.button.callback("next ➡️", "next_1"),
      ],
    ])
  );
});

composer.on(`callback_query`, async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData.startsWith("getsura")) {
    await handleGetSurah(ctx);
  } else if (callbackData.startsWith("next")) {
    await handleNextButton(ctx);
  } else if (callbackData.startsWith("previous")) {
    await handlePreviousButton(ctx);
  } else if (callbackData.startsWith("ayyahs")) {
    await handleGetAyahs(ctx);
  } else if (callbackData.startsWith("photoAyah")) {
    await handleGetAyahPhoto(ctx);
  } else if (callbackData.startsWith("get_surah_audio")) {
    await handleGetSurahAudio(ctx);
  }
});

bot.use(composer.middleware());
