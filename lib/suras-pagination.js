const { Markup } = require("telegraf");

const axios = require("axios");

const url = "http://api.alquran.cloud/v1/surah";
const perPage = 10;

async function handleNextButton(ctx) {
  let data = ctx.callbackQuery.data;

  let page = data.split("_")[1];

  let suras = await axios.get(url).then((res) => {
    return res.data.data;
  });

  page++;

  let offset = (page - 1) * perPage;

  let iter = 0;
  let keyboards = [];
  for (let i = offset; i < suras.length; i++) {
    if (iter >= perPage) {
      break;
    }
    iter++;

    let sura = suras[i];
    keyboards.push([
      Markup.button.callback(
        `${sura.englishName} | ${sura.name} | ${sura.number}`,
        `getsura-${sura.number}`
      ),
    ]);
  }

  if (keyboards.length > 0) {
    ctx.editMessageText(
      "Choose Surah 📜 from the list:",

      Markup.inlineKeyboard([
        ...keyboards,
        [
          Markup.button.callback("⬅️ previous ", "previous_" + page),
          Markup.button.callback("next ➡️", "next_" + page),
        ],
      ])
    );
  } else {
    ctx.answerCbQuery("This is the last page. Use ⬅️ previous to move back", {
      show_alert: true,
    });
  }
  await ctx.scene.leave();
}

async function handlePreviousButton(ctx) {
  let data = ctx.callbackQuery.data;

  let page = data.split("_")[1];
  let suras = await axios.get(url).then((res) => {
    return res.data.data;
  });

  page--;

  let offset = (page + 1) * perPage - 11;

  let iter = 0;

  let keyboards = [];

  for (let i = offset; i >= 0; i--) {
    if (iter >= perPage) {
      break;
    }

    iter++;

    let sura = suras[i];
    keyboards.push([
      Markup.button.callback(
        `${sura.englishName} | ${sura.name} | ${sura.number}`,
        `getsura-${sura.number}`
      ),
    ]);
  }

  keyboards.reverse();

  if (keyboards.length > 0) {
    ctx.editMessageText(
      "Choose Surah 📜 from the list:",

      Markup.inlineKeyboard([
        ...keyboards,
        [
          Markup.button.callback("⬅️ previous ", "previous_" + page),
          Markup.button.callback("next ➡️", "next_" + page),
        ],
      ])
    );
  } else {
    ctx.answerCbQuery("This is the first page. Use next ➡️ button to move", {
      show_alert: true,
    });
  }
}

module.exports = {
  handleNextButton,
  handlePreviousButton,
};
