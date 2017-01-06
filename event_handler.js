const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

module.exports = { // Export event functions
	"ready": function ready(bot) { // Once the bot is ready (fully booted) ...
	console.log(`${bot.user.username} ready!`); // ...console log a ready message...
	bot.user.setGame(`try '${config.commandPrefix} help' !`); // ...and set default game status.
	},
	"join": function join(bot, guild) { // Once the bot joins a new server ...
	console.log(`${bot.user.username} has joined a new server! ("${guild.name}")`); // ...console log a notification...
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has joined the '${guild.name}' server!`); 
	// ...and log which server was joined and when.
	},
	"leave": function leave(bot, guild) { // Once the bot leaves a server...
	console.log(`${bot.user.username} has left a server! ("${guild.name}")`); // ...console log a notification...
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has left the '${guild.name}' server!`); 
	// ...and log which server was left and when.
	}
};