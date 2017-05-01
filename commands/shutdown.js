const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');
/*
INFO: The shutdown command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "shutdown";
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	msg.reply(`${client.user.username} shutting down! Bye!`);
	console.log(`[${timestamp}]${chalk.green("[POWER]")} ${client.user.username} shutting down! (${msg.author.tag} on '${msg.guild}')`);
	if(config.pm2) {
		setTimeout(() => {
			console.log(`[${timestamp}]${chalk.green("[POWER]")} ${client.user.username} signed out! (PM2 process killed)`);
			require('child_process').exec('pm2 stop robbot', (err, stdout, stderr) => {});
		}, 2000);
	}
	else {
		setTimeout(() => {
			console.log(`[${timestamp}]${chalk.green("[POWER]")} ${client.user.username} signed out!`);
			process.exit(0);
		}, 2000);
	};
};

exports.desc = "shut down the bot remotely [Bot owner only]";
exports.syntax = "";