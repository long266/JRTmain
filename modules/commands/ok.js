module.exports.config = {
  name: "cá",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Đ-Pon",
  description: "try it",
  commandCategory: "nsfw",
  usages: "",
    cooldowns: 5,
    dependencies: {"fs-extra": "","axios": ""}
};

module.exports.run = async function ({ event, api }) {
    const axios = require("axios")
    const fs = require("fs-extra");
    var getlink = (await axios.get(`https://mermaid.mermaidd.repl.co/GetLink1`)).data;
    var url = getlink.url
    var stt = getlink.stt
    var length = getlink.length
    var getimg = (await axios.get(url, {responseType: "arraybuffer"})).data;
    fs.writeFileSync(__dirname + `/cache/${event.senderID}-${event.threadID}.png`, Buffer.from(getimg, "utf-8")); 
    api.sendMessage({body: `ỏ ỏ :3`,attachment: fs.createReadStream(__dirname + `/cache/${event.senderID}-${event.threadID}.png`)}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}-${event.threadID}.png`), event.messageID);

    console.log(getlink)
      }