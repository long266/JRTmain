module.exports.config = {
    name: "thongbao",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "D-Jukie mod by JRT",
    description: "Thời gian",
    commandCategory: "Hệ thống admin-bot",
    cooldowns: 5
}
module.exports.handleEvent = async function({ api, event, args, Users,Threads }) {
  const chalk = require('chalk');
  const moment = require("moment-timezone");
  var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
 var allThread = global.data.allThreadID || []; 
 console.log(chalk.bold.hex("#00CDCD")(`Bây giờ là: ${timeNow}`))
  var seconds = moment.tz("Asia/Ho_Chi_Minh").format("ss");
  var timeRestart_1 = `15:00:${seconds}`
  var timeRestart_2 = `18:00:${seconds}`
  var timeRestart_3 = `21:00:${seconds}`
  var timeRestart_4 = `00:00:${seconds}`
  var timeRestart_5 = `03:00:${seconds}`
  var timeRestart_6 = `06:00:${seconds}`
  var timeRestart_7 = `09:00:${seconds}`
  //console.log(timeNowRestart)
  if ((timeNow == timeRestart_1 || timeNow == timeRestart_2 || timeNow == timeRestart_3|| timeNow == timeRestart_4|| timeNow == timeRestart_5|| timeNow == timeRestart_6 || timeNow == timeRestart_7) && seconds < 6 ) {
    for (const idThread of allThread) {
      api.sendMessage(`[⚜️] Xin chài tất cả mọi người chúc một ngày mới tốt lành yêu mọi người lắm ó Bot Minh Quân`,idThread, (error, info) => {
				if (error) cantSend.push(idThread);
			});
    }
    }
}
module. exports. run = async  ({ api, event, args }) => {
      const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
      const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
     if (thu == 'Sunday') thu = 'Chủ Nhật'
  if (thu == 'Monday') thu = 'Thứ Hai'
  if (thu == 'Tuesday') thu = 'Thứ Ba'
  if (thu == 'Wednesday') thu = 'Thứ Tư'
  if (thu == "Thursday") thu = 'Thứ Năm'
  if (thu == 'Friday') thu = 'Thứ Sáu'
  if (thu == 'Saturday') thu = 'Thứ Bảy'
	let today = new Date();
  const res = await axios.get("https://api.j-jrt-official.repl.co/gai.php");
//lấy data trên web api
const data = res.data.data;
//tải ảnh xuống
let download = (await axios.get(data, {
			responseType: "stream"
		})).data;
						return api.sendMessage({ body: `[⚜️]Hôm này là: ${thu} || ${gio}`, attachment: download }, event.threadID, event.messageID);

	}