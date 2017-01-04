const config = require('./config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing

module.exports = {
	"ready": function ready(bot) {
	console.log(`${bot.user.username} ready!`); // console log a ready message
	bot.user.setGame("try 'robbot, help' !"); // set default game status
	},
	"join": function join(bot) {
	console.log(`${bot.user.username} has joined a new server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has joined the '${guild.name}' server!`); 
	// Log which server was joined and when
	},
	"leave": function leave(bot) {
	console.log(`${bot.user.username} has left a server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has left the '${guild.name}' server!`); 
	// Log which server was left and when
	}
};