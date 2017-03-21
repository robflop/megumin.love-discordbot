const config = require('./config.json');
const fs = require('fs');
const moment = require('moment');
const blacklist = require('./serverconf/blacklist.json');
var timestamp;

module.exports = {
	"ready": function ready(client, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.green("[POWER]")} ${client.user.username} ready!`);
		client.user.setGame(`try '${config.commandPrefix} help' !`);
	},
	"error": function error(client, error, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.red("[CONNECTION]")} ${client.user.username} encountered a "serious connection error! | ${error.code}`);
	},
	"disconnect": function disconnect(client, error, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.red("[CONNECTION]")} ${client.user.username} was disconnected! | ${error.code}`);
		if(error.code == 1000) {
			console.log(`[${timestamp}]${chalk.green("[POWER]")} Automatically restarting...`);
			client.destroy().then(() => client.login(config.token));
			// Restart bot if disconnect code is 1000 (gracefully exited) because it won't reconnect automatically
		};
	},
	"reconnecting": function reconnecting(client, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		console.log(`[${timestamp}]${chalk.green("[CONNECTION]")} ${client.user.username} is reconnecting!`);
	},
	"join": function join(client, guild, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		if(blacklist.indexOf(guild.id) !== -1) return guild.leave();
		// blacklist check
		console.log(`[${timestamp}]${chalk.yellow("[GUILDS]")} ${client.user.username} has joined a new server! ("${guild.name}")`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][GUILDS] ${client.user.username} joined the '${guild.name}' server!`);
	},
	"leave": function leave(client, guild, chalk) {
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		if(blacklist.indexOf(guild.id) !== -1) return;
		// blacklist check
		console.log(`[${timestamp}]${chalk.yellow("[GUILDS]")} ${client.user.username} has left a server! ("${guild.name}")`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][GUILDS] ${client.user.username} left the '${guild.name}' server!`);
	}
};