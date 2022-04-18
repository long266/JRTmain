module.exports.config = {
name: "taoanhdep",
version: "1.0.0",
hasPermssion: 0,
credits: "Shiron",
description: "Tạo avatar theo phong cách anime",
commandCategory: "bìa",
usages: "Tạo avatar theo phong cách anime",
cooldowns: 0,
dependencies: {
        "fs-extra": "",
        "request": "",
        "axios": "",
    }
};
module.exports.run = async function ({ api, args, event, permssion }) {
    const request = require('request');
  const fs = require("fs-extra")
  const axios = require("axios")
  const { threadID, messageID, senderID, body } = event;
  if(!args[0]) return api.sendMessage('Vui lòng nhập ID nhân vật:\nCác tag khác: list, color', threadID, messageID)
  if (args[0] == "color") {
    var callback = () => api.sendMessage({body:`Bảng Màu Tiếng Anh.`,attachment: fs.createReadStream(__dirname + "/cache/taoanhdep.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/taoanhdep.png"),event.messageID); 
    return request(encodeURI(`https://i.imgur.com/3VLL6Mi.gif`)).pipe(fs.createWriteStream(__dirname+'/cache/taoanhdep.png')).on('close',() => callback());    
  } 
  var avtAnimee = (await axios.get(`https://api.mincute.repl.co/taoanhdep/data`)).data
  if(args[0] == 'list') {
    var lengthID = [];
    var i =1
    var msg = []
    var msgg = []
    for (let id of avtAnimee) { 
        lengthID.push(id.imgAnime)
        const text3 = id.imgAnime.split("s0/").pop()
        const text1 = text3.substr(0, text3.indexOf('.')); 
        msgg.push(text1.toUpperCase())
    }           
    var page = 1;
        page = parseInt(args[1]) || 1;
        page < -1 ? page = 1 : "";
    var limit = 30;
    var msg = "==== DANH SÁCH NHÂN VẬT ===\n\n";
    var numPage = Math.ceil(msgg.length / limit);
      for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
        if (i >= msgg.length) break;
          let name = msgg[i];                  
          msg += `ID: ${i+1} » ${name}\n`;             
      }
    msg += `\n» Trang ${page}/${numPage}\n`
    msg += `» Hiện tại có ${(lengthID.length)} nhân vật\n`
    return api.sendMessage(msg, threadID)
  }
  var id = parseInt(args[0]);
  if(id < 1 || id > 540 ) {
  return api.sendMessage(`Không tìm thấy nhân vật`,threadID, messageID)}
  else return api.sendMessage(`🔍 Đã tìm thấy ID nhân vật : ${id}\n\n(Reply tin nhắn này và chọn chữ nền cho hình ảnh của bạn)\nLưu ý: Viết không dấu và dưới 16 kí tự`,event.threadID, (err, info) => {
     return global.client.handleReply.push({
        type: "signature",
        name: this.config.name,
        author: senderID,
        id: id-1,
        messageID: info.messageID
      });
  },event.messageID);
}
module.exports.handleReply = async function ({ event, api, handleReply }) {
  if (handleReply.author != event.senderID) return;
  const { threadID, messageID, senderID, body } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = require("fs-extra")
  const axios = require("axios")
  let pathImg = __dirname + `/cache/${senderID+20}.png`;
  let pathAva = __dirname + `/cache/${senderID+30}.png`;
  let pathLine = __dirname + `/cache/${senderID+40}.png`;
  const path = require("path")
  const Canvas = require("canvas")
  const __root = path.resolve(__dirname, "cache");
  var avtAnimee = (await axios.get(`https://api.mincute.repl.co/taoanhdep/data`)).data
  var id = handleReply.id;
  switch (handleReply.type) {
    case "signature": {
      var id = handleReply.id;
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage(`🔍 Bạn đã chọn chữ nền là ${event.body}\n\n(Reply tin nhắn này nhập vào chữ ký của bạn)`,event.threadID, (err, info) => {
        return global.client.handleReply.push({
          type: "color",
          name: this.config.name,
          author: senderID,
          id: id,
          nen: event.body,
          messageID: info.messageID
        });
      },messageID)
    }
    case "color": {
      var nen = handleReply.nen;
      var id = handleReply.id;
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage(`🔍 Bạn đã chọn chữ ký : ${event.body}\n\nNhập màu của bạn (lưu ý: nhập tên tiếng anh của màu - Nếu không muốn nhập màu thì nhập "no")(Reply tin nhắn này)`,event.threadID, (err, info) => {
        return global.client.handleReply.push({
          type: "create",
          name: this.config.name,
          author: senderID,
          id: id,
          nen: nen,
          ky: event.body,
          messageID: info.messageID
        });
      },messageID) 
    }
    case "create": {
      var nen = handleReply.nen;
      var id = handleReply.id;
      var ky = handleReply.ky;
      var colorr = event.body;
      var color2 = ``;
      api.unsendMessage(handleReply.messageID);
      if (colorr.toLowerCase() == "no") var colorr = avtAnimee[id].colorBg
      api.sendMessage(`⏳ Đang khởi tạo chương trình tạo ảnh!`,threadID,messageID);
      let avtAnime = (
        await axios.get(encodeURI(`${avtAnimee[id].imgAnime}`), { responseType: "arraybuffer" })).data;
        let line = ( await axios.get(encodeURI(
            `https://i.imgur.com/fJ2m9uh.png`),
            { responseType: "arraybuffer" })).data;
        let background = ( await axios.get(encodeURI(`https://i.imgur.com/j8FVO1W.jpg`), { responseType: "arraybuffer"})).data;
        fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
        fs.writeFileSync(pathLine, Buffer.from(line, "utf-8"));
        fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

      /*-----------------download----------------------*/
    if(!fs.existsSync(__dirname+`/cache/MTD William Letter.otf`)) { 
          let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=1HsVzLw3LOsKfIeuCm9VlTuN_9zqucOni&export=download`, { responseType: "arraybuffer" })).data;
           fs.writeFileSync(__dirname+`/cache/MTD William Letter.otf`, Buffer.from(getfont, "utf-8"));
        };
    if(!fs.existsSync(__dirname+`/cache/SteelfishRg-Regular.otf`)) { 
          let getfont2 = (await axios.get(`https://drive.google.com/u/0/uc?id=1SZD5VXMnXQTBYzHG834pHnfyt7B2tfRF&export=download`, { responseType: "arraybuffer" })).data;
           fs.writeFileSync(__dirname+`/cache/SteelfishRg-Regular.otf`, Buffer.from(getfont2, "utf-8"));
        };

       
      let baseImage = await loadImage(pathImg);
      let baseAva = await loadImage(pathAva);
      let baseLine = await loadImage(pathLine);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");
      let color = colorr
      let chuki = ky
      let textBg = nen.toUpperCase()
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      Canvas.registerFont(__dirname+`/cache/SteelfishRg-Regular.otf`, {
            family: "SteelfishRg-Regular"
        });
      ctx.font = `430px SteelfishRg-Regular`;
      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(255 255 255 / 70%)"
      ctx.globalAlpha = 0.7
      ctx.fillText(textBg, canvas.width / 2, 1350)
      ctx.globalAlpha = 1
      ctx.strokeStyle = "white"
      ctx.lineWidth = 7
      ctx.textAlign = "center"
      ctx.strokeText(textBg, canvas.width / 2, 900)
      ctx.strokeText(textBg, canvas.width / 2, 1800)
      ctx.drawImage(baseAva, 0, 0, 2000, 2000);
      ctx.drawImage(baseLine, 0, 0, canvas.width, canvas.height)
      Canvas.registerFont(__dirname+`/cache/MTD William Letter.otf`, {
            family: "MTD William Letter"
        });
      ctx.font = `300px MTD William Letter`;
      ctx.fillStyle = `#FFFFFF`
      ctx.textAlign = "center";
      ctx.fillText(chuki, canvas.width / 2, 350);
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage(
        { attachment: fs.createReadStream(pathImg) },
        threadID,messageID
      );
    }
  }
}