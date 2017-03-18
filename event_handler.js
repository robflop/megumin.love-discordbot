const config = require('./config.json');
const fs = require('fs');
const moment = require('moment');
const blacklist = require('./serverconf/blacklist.json');
var timestamp;

module.exports = {
	"ready": function ready(bot, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.green("[POWER]")} ${bot.user.username} ready!`);
		bot.user.setGame(`try '${config.commandPrefix} help' !`);
	},
	"error": function error(bot, error, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.red("[CONNECTION]")} ${bot.user.username} encountered a "serious connection error! | ${error.code}`);
	},
	"disconnect": function disconnect(bot, error, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.red("[CONNECTION]")} ${bot.user.username} was disconnected! | ${error.code}`);
		if(error.code == 1000) {
			console.log(`[${timestamp}]${chalk.green("[POWER]")} Automatically restarting...`);
			bot.destroy().then(() => bot.login(config.token));
			// Restart bot if disconnect code is 1000 (gracefully exited) because it won't reconnect automatically
		};
	},
	"reconnecting": function reconnecting(bot, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.green("[CONNECTION]")} ${bot.user.username} is reconnecting!`);
	},
	"join": function join(bot, guild, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		if(blacklist.indexOf(guild.id) !== -1) return guild.leave();
		// blacklist check
		console.log(`[${timestamp}]${chalk.yellow("[GUILDS]")} ${bot.user.username} has joined a new server! ("${guild.name}")`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][GUILDS] ${bot.user.username} joined the '${guild.name}' server!`);
	},
	"leave": function leave(bot, guild, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		if(blacklist.indexOf(guild.id) !== -1) return;
		// blacklist check
		console.log(`[${timestamp}]${chalk.yellow("[GUILDS]")} ${bot.user.username} has left a server! ("${guild.name}")`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][GUILDS] ${bot.user.username} left the '${guild.name}' server!`);
	}
};