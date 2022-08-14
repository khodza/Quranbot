const {
  Scenes: { Stage },
  session,
  Markup,
} = require("telegraf");

const bot = require("../core/bot");

const { ayahScene } = require("../lib/Scenes");

const stage = new Stage([ayahScene]);

async function handleGetAyahs(ctx) {
  await ctx.scene.enter("getayah");
}

async function handleGetAyahPhoto(ctx) {
  let callbackData = ctx.callbackQuery.data;
  let id = callbackData.split("-")[1];
  let ayahNumber = callbackData.split("-")[2];
  ctx.replyWithPhoto(
    `http://cdn.islamic.network/quran/images/${id}_${ayahNumber}.png`
  );
  ctx.answerCbQuery();
  await ctx.scene.leave();
}

async function handleGetSurahAudio(ctx) {
  ctx.deleteMessage();
  let callbackData = ctx.callbackQuery.data;
  let id = callbackData.split("-")[1];
  await ctx.replyWithHTML(
    `You can either listen or download the <b>Audio</b> of chosen <i>Sura</i> via this link:\n\nhttps://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${id}.mp3`,

    {
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🔙 Back to Sura 📜", `getsura-${id}`)],
        [Markup.button.callback(" 🔙 Back to all Suras 📖", `next_0`)],
      ]),
    }
  );
  ctx.answerCbQuery();
}
bot.use(session(), stage.middleware());
module.exports = { handleGetAyahPhoto, handleGetSurahAudio, handleGetAyahs };
