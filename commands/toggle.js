const config = require('../config.json');
const fs = require('fs');
const serverConfig = require('../serverconfigHandler.js');
const Commands = require('../commandHandler.js');
/*
INFO: The toggle command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "toggle";
	if(msg.author.id !== config.ownerID && (!checks.userPerm.hasPermission("KICK_MEMBERS") || !checks.userPerm.hasPermission("BAN_MEMBERS"))) return msg.reply("you are not authorized to use this command!");
	if(msg.content.length == config.commandPrefix.length + 1 + command.length) return msg.reply("specify a command to toggle!");
	const arg = msgArray[1].toLowerCase();
	if(arg == "toggle" || arg == "help" || !Object.keys(Commands.commands).includes(arg)) return;
	const index = serverConfig.serverConfig[`serverconf_${msg.guild.id}`].indexOf(arg);
	if(fs.existsSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`)) {
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