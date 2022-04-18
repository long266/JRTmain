module.exports.config = {
	name: "help",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "DuyVuongUwU",
	description: "Hướng dẫn cho người mới",
	commandCategory: "system",
  usages: "[Tên module]",
	cooldowns: 1
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const args = parseInt(event.body.split(' ')[0] - 1);
  const { data, code } = handleReply;
  const { messageID, threadID } = event;
  var msg = "", dem = 0, objectCommand = [];
  if (isNaN(args)) return api.sendMessage('Vui Lòng Chỉ Nhập Số!', threadID, messageID);
  api.unsendMessage(handleReply.messageID);
  switch(parseInt(code)) {
    case 1: {
      if (!data[args]) {
        return api.sendMessage('Chỉ nhập từ 1 -> ' + data.length + ' thôi nhé.', threadID, messageID);
      }
      msg += '「 ' + global.config.BOTNAME.toUpperCase() + ' 」\n';
      msg += '「 ' + data[args].nameGroup.toUpperCase() + ' 」\n\n';
      for (var item of data[args].commands) {
        dem++;
        msg += dem + '. ' + global.config.PREFIX + item.config.name + '\n'
        objectCommand.push(item);
      }
      msg += '\nReply(Phản hồi) tin nhắn này kèm số thứ tự để xem thông tin lệnh đó!';
      return api.sendMessage(msg, threadID, (error, info) => {
        return global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          data: objectCommand,
          code: 2
        });
      }, messageID);
      break;
    }
    case 2: {
      return api.sendMessage(`「 ${data[args].config.name.toUpperCase()} 」\n${data[args].config.description}\n\n❯ Cách sử dụng: ${global.config.PREFIX}${data[args].config.name} ${data[args].config.usages ? data[args].config.usages : ""}\n❯ Thuộc nhóm: ${data[args].config.commandCategory}\n❯ Thời gian chờ: ${data[args].config.cooldowns || 0} giây\n❯ Quyền hạn: ${(data[args].config.hasPermssion == 0) ? 'Người dùng' : (data[args].config.hasPermssion == 1) ? 'Quản trị viên nhóm' : 'Quản trị viên bot'}\n\n» Module code by ${data[args].config.credits} «`, threadID, messageID);
    }
  }
}
module.exports.run = async function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  if (!command) {
    if (args[0] != 'all') {
    const command = commands.values();
    var objectGroup = [], msg = "", dem = 0;
    msg += '「 ' + global.config.BOTNAME.toUpperCase() + ' 」\n\n';
    for (var item of command) {
      if (!objectGroup.some(i => i.nameGroup == item.config.commandCategory)) {
        objectGroup.push({ nameGroup: item.config.commandCategory, commands: [] });
    }
      objectGroup[objectGroup.findIndex(i => i.nameGroup == item.config.commandCategory)].commands.push(item);
      }
    for (var item of objectGroup) {
      dem++;
      msg += dem + '. 「' + item.nameGroup.toUpperCase() + '」\n';
    }
    msg += '\nReply(Phản hồi) tin nhắn này kèm số tương ứng để xem danh sách lệnh!';
    return api.sendMessage(msg, threadID, (error, info) => {
      return global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        data: objectGroup,
        code: 1
      })
    } , messageID);
  }
    else {
      const command = commands.values();
		var group = [], msg = "";
		for (const commandConfig of command) {
			if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase())) group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
			else group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
		}
		group.forEach(commandGroup => msg += `「 ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} 」\n${commandGroup.cmds.join(', ')}\n\n`);
		return api.sendMessage(msg + '[ Hiện tại đang có ' + commands.size + ' lệnh có thể sử dụng trên bot này, Sử dụng: "' + global.config.PREFIX + 'help nameCommand" để xem chi tiết cách sử dụng! ]', threadID, messageID);
    }
  }
  return api.sendMessage(`「 ${command.config.name.toUpperCase()} 」\n${command.config.description}\n\n❯ Cách sử dụng: ${global.config.PREFIX}${command.config.name} ${command.config.usages ? command.config.usages : ""}\n❯ Thuộc nhóm: ${command.config.commandCategory}\n❯ Thời gian chờ: ${command.config.cooldowns || 0} giây\n❯ Quyền hạn: ${(command.config.hasPermssion == 0) ? 'Người dùng' : (command.config.hasPermssion == 1) ? 'Quản trị viên nhóm' : 'Quản trị viên bot'}\n\n» Module code by ${command.config.credits} «`, threadID, messageID);
}