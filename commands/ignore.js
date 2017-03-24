const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');
const ignoreLists = require('../ignoreHandler.js');
/*
INFO: The ignore command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(client, msg, msgArray, checks, chalk) {
	var command = "ignore";
	if(msg.author.id !== config.ownerID && (!checks.userPerm.hasPermission("KICK_MEMBERS") || !checks.userPerm.hasPermission("BAN_MEMBERS"))) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	if(msg.mentions.users.size==0) return msg.reply("mention a user to ignore!");
	var mentioned = msg.mentions.users.first(), userID = mentioned.id, member = msg.guild.member(userID);
	if(fs.existsSync(`${config.ignorePath}ignore_${msg.guild.id}.json`)) {
		var index = ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].indexOf(userID);
		// search for the mentioned user on the list
		if(userID !== config.ownerID) {
			if(index == -1) {
				ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].push(userID);
				fs.writeFileSync(`${config.ignorePath}ignore_${msg.guild.id}.json`, JSON.stringify(ignoreLists.ignoreLists[`ignore_${msg.guild.id}`]));
				fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${timestamp}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully added a user to the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list of the '${msg.guild}' server!`);
				msg.reply(`i am now ignoring ${member.displayName}!`);
			}
			else {
				ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].splice(index, 1);
				fs.writeFileSync(`${config.ignorePath}ignore_${msg.guild.id}.json`, JSON.stringify(ignoreLists.ignoreLists[`ignore_${msg.guild.id}`]));
				fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${timestamp}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully removed a user from the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list of the '${msg.guild}' server!`);
				msg.reply(`i am no longer ignoring ${member.displayName}!`);
			};
		};
	}
	else {
		if(userID !== config.ownerID) {
			ignoreLists.ignoreLists[`ignore_${msg.guild.id}`] = [];
			// define as empty to avoid crashes
			ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].push(userID);
			fs.writeFileSync(`${config.ignorePath}ignore_${msg.guild.id}.json`, JSON.stringify(ignoreLists.ignoreLists[`ignore_${msg.guild.id}`]));
			fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${timestamp}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully added a user to the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list of the '${msg.guild}' server!`);
			msg.reply(`i am now ignoring ${member.displayName}!`);
		};
	};
};

exports.desc = "make the bot ignore a user server-wide, use a 2nd time to revert [Bot owner or Kick/Ban Permission required]";
exports.syntax = "<mention a user to ignore>";