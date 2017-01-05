const config = require('../config.json'); // import configuration
const request = require('request'); // for website interaction
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
const prism = require('prism-media'); // prism for smoother file playing of very short files

exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "randomsound"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution.
	if(!msg.member.voiceChannel) { // If the user that used the command is not in a voice channel on the server the command came from ...
		if(!permission.hasPermission('SEND_MESSAGES')) {  // 1) ...and the bot can't send to the channel...
			msg.author.sendMessage("Join a voice channel first!"); // ... PM the author of the msg...
			return; // ... and abort command execution.
		} 
		msg.reply("join a voice channel first!"); // 2) ...notify the usero to join a channel...
		return; // ... and abort command execution.
	}
	if(!msg.member.voiceChannel.joinable) { // If the bot can't connect to the voicechannel... 
		msg.author.sendMessage("I can't connect to that voice channel!"); // ... PM the author of the msg...
		return; // ... and abort command execution.
	}
	if(msg.guild.voiceConnection !== null) { // if the bot is already in a voice channel of the server the command came from...
		if(!permission.hasPermission('SEND_MESSAGES')) {  // ... 1) and if the bot can't send to the channel ...
			msg.author.sendMessage('please wait for the current sound to finish!'); // ... PM the author of the msg...
			return; // ... and abort command execution.
		}
		msg.reply('please wait for the current sound to finish!'); // ... 2) notify the user...
		return; // ... and abort command execution.
	}
	// If a voice connection does not exist on the server the command is being used, do the following
	request.get('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body) { // increment the counter on-site
		if(error || response.statusCode !== 200) { // Check for errors or response codes other than 200 (OK)
			console.log(`An unusual response code was emitted when GETting the counter increment script: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
			// Log any unusual request responses
			return; // abort command execution
		};
	}); 
	msg.member.voiceChannel.join().then(connection => { // check if message author is in a voice channel, if true join it
		var sounds = ["eugh1.mp3", "eugh2.mp3", "eugh3.mp3", "eugh4.mp3", "explosion.mp3", "itai.mp3", "n.mp3", "name.mp3", "plosion.mp3", "pull.mp3", "sion.mp3", "yamero.mp3"]; 
		// set available files
		var sound = sounds[Math.floor(Math.random()*sounds.length)]; // randomize which sound gets played 
		const player = connection.playFile(config.soundPath + sound); // play the file
		fs.appendFileSync(`${config.logPath}${config.soundLog}`, `\n[${moment().format('DD/MM/YYYY H:mm:ss')}][AUDIO] ${msg.author.username}#${msg.author.discriminator} used the '${msg.content.substr(config.commandPrefix.length + 1, command.length)}' command on the '${msg.guild}' server!`); // Log command use, which file was played when and by whom
		player.on('end', () => {
			msg.member.voiceChannel.leave(); // leave voice channel after file finishes playing
		});
	});
};
exports.desc = "have the bot join your voice channel and play a random sound from the website"; // export command description