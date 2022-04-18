module.exports.config = {
    name: "hoingu",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Henry",// convert by ProCoderCyrus
    description: "Nhận câu hỏi và trả lời",
    commandCategory: "Game",
    usages: "[get/send/info]",
    cooldowns: 5,
	  dependencies: {
    "axios": ""
    }
};
module.exports.onLoad = () => {
const chalk = require('chalk');
console.log(chalk.bold.hex("#00c300").bold("--SUCCESFULLY LOADED THE HOINGU COMMAND--"));
  }
module.exports.handleReply = async function({ api, event, Users, handleReply }) {
    var { threadID, messageID, senderID, body } = event;
    const axios = require('axios');
    var { author, type } = handleReply;
    if (senderID != author) return;
    switch (type) {
        case "answer":
            var { data, timeOut } = handleReply;
            var { name } = await Users.getData(senderID);
            if (body.toLowerCase().toString() == data.questionData.answer.toLowerCase().toString()) return api.sendMessage(`Chúc mừng ${name}, bạn rất thông minh khi trả lời đúng câu hỏi này.`, threadID, () => {
                api.unsendMessage(handleReply.messageID);
                clearTimeout(timeOut)
            }, messageID);
            else return api.sendMessage(`${name} bạn rất ngu khi trả lời sai câu hỏi của ${data.name}.\nĐáp án đúng là: ${data.questionData.answer}\n\nBạn đã có mặt trong danh sách ${data.questionData.luotngu + 1} người ngu của câu hỏi này.`, threadID, async() => {
                api.unsendMessage(handleReply.messageID);
                await axios.post(`https://impartial-mercury-gum.glitch.me/api/hoingu/${data.ID}&${questionData.questionID}`, { playerID: senderID, name: name });
                clearTimeout(timeOut);
            });
        case "send":
            if (!body) return api.sendMessage(`Bạn phải nhập câu hỏi.`, threadID, messageID);
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`Câu trả lời đúng của câu hỏi này là gì?\n\nVui lòng reply tin nhắn này câu trả lời đúng với câu hỏi mà bạn vừa đặt ra.`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    question: body,
                    type: 'ans',
                    author: senderID
                })
            })
        case "ans":
            if (!body) return api.sendMessage(`Bạn phải nhập câu trả lời cho câu hỏi mà bạn đã đặt ra.`, threadID, messageID);
            api.unsendMessage(handleReply.messageID);
            var { question, author } = handleReply;
            var { name } = await Users.getData(senderID);
            var { data } = await axios.post(`https://impartial-mercury-gum.glitch.me/api/hoingu`, { ID: senderID, question: question, name: name, answer: body, type: 'newQuestion' });
            console.log(data)
            if (data.status == true) return api.sendMessage(`Câu hỏi của bạn đã được gửi thành công, bạn có thể xem thông tin bằng cách gửi 'hoingu info'.`, threadID, messageID);
            else return api.sendMessage(`Đã có lỗi xảy ra khi gửi câu hỏi của bạn, vui lòng thử lại sau.`, threadID, messageID);
        default:
            break;
    }
}

module.exports.run = async function({ api, args, event, Users }) {
    var axios = require('axios');
    var { threadID, messageID, senderID } = event;
    if (args[0]) {
        switch (args[0]) {
            case "send":
                return api.sendMessage(`Vui lòng reply tin nhắn này với câu hỏi bạn muốn gửi lên sever.`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        type: "send",
                        author: senderID
                    })
                }, messageID);
            case "info":
                var { data } = await axios.post('https://impartial-mercury-gum.glitch.me/api/hoingu', { type: 'info', ID: senderID });
                if (data.status == false) return api.sendMessage(`Đã có lỗi xảy ra khi lấy thông tin của bạn, vui lòng thử lại sau.`, threadID, messageID);
                var ngu = 0;
                if (data.question.length > 0) for (var i of data.question) ngu = i.luotngu + ngu;
                return api.sendMessage(`Mirai Game - Hỏi Ngu\n\nTên người dùng: ${data.name}\nSố câu hỏi: ${data.question.length} câu.\nSố người ngu vì bạn: ${ngu} người.\nBạn đã ngu: ${data.luotngu} lần.`, threadID);
            default:
                global.utils.throwError(this.config.name, threadID, messageID);
                break;
        }
    }
    var { data } = await axios.get('https://impartial-mercury-gum.glitch.me/api/hoingu');
    if (!data || data.status && data.status == false) return api.sendMessage(`Đã có lỗi xảy ra khi thực hiện lấy câu hỏi từ sever về cho bạn.`, threadID, messageID);
    var { questionData, name } = data;
    return api.sendMessage(`Bạn nhận được một câu hỏi từ ${name}:\n\n${questionData.question}\n\nSố lượt ngu: ${questionData.luotngu} lượt.\n\nTrả lời câu hỏi này bằng cách reply tin nhắn này kèm câu trả lời.\nNếu không trả lời sau 1 phút, bạn sẽ bị ngu :>`, threadID, (error, info) => {
        var timeOut = setTimeout(async() => {
            api.unsendMessage(info.messageID);
            var { name: playerName } = await Users.getData(senderID);
            api.sendMessage(`${playerName} bạn rất ngu khi không trả lời được câu hỏi này của ${data.name}`, threadID);
            await axios.post(`https://impartial-mercury-gum.glitch.me/api/hoingu/${data.ID}&${questionData.questionID}`, { playerID: senderID, name: playerName });
        }, 60000)
        global.client.handleReply.push({
            author: senderID,
            name: this.config.name,
            messageID: info.messageID,
            data: data,
            type: "answer",
            timeOut: timeOut
        });
    });
}