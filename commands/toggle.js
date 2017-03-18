const config = require('../config.json');
const fs = require('fs');
const serverConfig = require('../serverconfig_handler.js');
var Commands = require('../command_handler.js');
/*
INFO: The toggle command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "toggle";
	if (cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.author.id !== config.ownerID && (!userPerm.hasPermission("KICK_MEMBERS") || !userPerm.hasPermission("BAN_MEMBERS"))) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2).toLowerCase();
	if(arg == "toggle" || arg == "help" || Object.keys(Commands.commands).indexOf(arg) == -1) return;
	if(fs.existsSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`)) {
		var index = serverConfig.serverConfig[`serverconf_${msg.guild.id}`].indexOf(arg);
		if(index == -1) {
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`].push(arg);
			fs.writeFileSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
			return msg.reply(`command '${arg}' has been disabled!`);
		};
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`].splice(index, 1);
		fs.writeFileSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
		return msg.reply(`command '${arg}' has been enabled!`);
	}
	else {
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`] = [];
		// define as empty to avoid crashes
		var index = serverConfig.serverConfig[`serverconf_${msg.guild.id}`].indexOf(arg);
		if(index == -1) {
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`].push(arg);
			fs.writeFileSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
			return msg.reply(`command '${arg}' has been disabled!`);
		};
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`].splice(index, 1);
		fs.writeFileSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
		return msg.reply(`command '${arg}' has been enabled!`);
	}
};

exports.desc = "toggle a command server-wide (on/off) [Bot owner or Kick/Ban Permission required]";
exports.syntax = "<command to toggle>";