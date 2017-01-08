const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "playsound"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	if(!msg.member.voiceChannel) { 
		// If the user that used the command is not in a voice channel on the server the command came from...
		if(!botPerm.hasPermission('SEND_MESSAGES')) {  
			// ... 1) and the bot can't send to the channel...
			msg.author.sendMessage("Join a voice channel first!"); 
			// ...PM the author of the msg...
			return; // ...and abort command execution.
		}  
		// ... 2) and the bot can send to the channel...
		msg.reply("join a voice channel first!"); 
		// ...notify the user to join a channel...
		return; // ...and abort command execution.
	}
	if(!msg.member.voiceChannel.joinable) { 
		// If the bot can't connect to the voicechannel... 
		msg.author.sendMessage("I can't connect to that voice channel!"); 
		// ...PM the author of the msg...
		return; // ...and abort command execution.
	}
	if(msg.guild.voiceConnection !== null) { 
		// If the bot is already in a voice channel of the server the command came from...
		if(!botPerm.hasPermission('SEND_MESSAGES')) {  
			// ... 1) and the bot can't send to the channel...
			msg.author.sendMessage('please wait for the current sound to finish!'); 
			// ...PM the user...
			return; // ...and abort command execution.
		}
		// ... 2) and the bot can send to the channel...
		msg.reply('please wait for the current sound to finish!'); 
		// ...notify the user...
		return; // ...and abort command execution.
	}
	// If a voice connection does not exist on the server the command is being used,...
	request.get('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body) { 
		// ...then increment the counter on megumin.love...
		if(response == undefined) {
		// If 1) the response is undefined...
			console.log(`No response was emitted when incrementing the counter -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) Undefined response | ${error}`); 
			// ...log it and the error...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				msg.author.sendMessage(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user...
				return; // ...and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
			// ...notify the user...
			return; // ...and abort command execution.
		};
		if(error || response.statusCode !== 200) { 
		// If 2) There is an error or response code other than 200 (OK)...
			console.log(`An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
			// ...log the unusual request responses/errors...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				msg.author.sendMessage(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user...
				return; // ...and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
			// ...notify the user...
			return; // ...and abort command execution.
		};
		// If there is no error, proceed with the command.
	});
	var sounds = ["eugh1", "eugh2", "eugh3", "eugh4", "explosion", "plosion", "sion", "n", "itai", "name", "pull", "yamero"]; 
	// Set available files,...
	var sound = msg.content.substr(config.commandPrefix.length + command.length);
	// ...then set sound var to chosen sound file.
	if(sounds.indexOf(sound) == -1) {
	// If chosen sound file is not available...
		msg.reply(`sound unavailable! Available sounds are: ${sounds.join(", ")}`);
		// ...notify the user...
		return; // ...and abort command execution.
	}
	msg.member.voiceChannel.join().then(connection => {
		// Check if message author is in a voice channel, if true join it,...
		const player = connection.playFile(`${config.soundPath + sound}.mp3`); 
		// ...and play the file.
		player.on('end', () => {
			msg.member.voiceChannel.leave(); 
			// Leave voice channel once file finishes playing
		});
	});
};
exports.desc = "have the bot join your voice channel and play a chosen sound from the website"; // Export command description