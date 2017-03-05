const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const blacklist = require('./serverconf/blacklist.json'); // For checking if joined server is blacklisted
var timestamp;

module.exports = { // Export event functions
	"ready": function ready(bot, chalk) { // Once the bot is ready (fully booted) ...
		var timestamp = moment().format('DD/MM/YYYY HH:mm:ss'); 
		console.log(`[${timestamp}]${chalk.green("[POWER]")} ${bot.user.username} ready!`); // ...console log a ready message...
		bot.user.setGame(`try '${config.commandPrefix} help' !`); // ...and set default game status.
	},
	"error": function error(bot, error, chalk) { // If a "serious connection error" occurs...
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss'); 
		console.log(`[${timestamp}]${chalk.red("[CONNECTION]")} ${bot.user.username} encountered a "serious connection error!\n${JSON.stringify(error)}`); // ...console log a notifcation.	
	},
	"disconnect": function disconnect(bot, error, chalk) { // If the bot gets disconnected...
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss'); 
		console.log(`[${timestamp}]${chalk.red("[CONNECTION]")} ${bot.user.username} was disconnected!\n${JSON.stringify(error)}`); // ...console log a notifcation.	
	},
	"reconnecting": function reconnecting(bot, chalk) { // When the bot reconnects...
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss'); 
		console.log(`[${timestamp}]${chalk.green("[CONNECTION]")} ${bot.user.username} is reconnecting!`); // ...console log a notifcation.
	},
	"join": function join(bot, guild, chalk) { // Once the bot joins a new server ...
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss'); 
		if(blacklist.indexOf(guild.id) !== -1) { return guild.leave(); }; // ...check if the server is blacklisted, if it is leave it without logging...
		console.log(`[${timestamp}]${chalk.yellow("[GUILDS]")} ${bot.user.username} has joined a new server! ("${guild.name}")`); // ...console log a notification...
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][GUILDS] ${bot.user.username} joined the '${guild.name}' server!`); 
		// ...and log which server was joined and when.
	},
	"leave": function leave(bot, guild, chalk) { // Once the bot leaves a server...
		timestamp = moment().format('DD/MM/YYYY HH:mm:ss'); 
		if(blacklist.indexOf(guild.id) !== -1) { return; }; // ...if the server was blacklisted, don't log it...
		console.log(`[${timestamp}]${chalk.yellow("[GUILDS]")} ${bot.user.username} has left a server! ("${guild.name}")`); // ...console log a notification...
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][GUILDS] ${bot.user.username} left the '${guild.name}' server!`); 
		// ...and log which server was left and when.
	}
};