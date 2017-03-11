const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command function
	var command = "playSound"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg)) return;
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	// Define timestamp
	if(!msg.member.voiceChannel) {
	// If the user that used the command is not in a voice channel on the server the command came from...
		if(!botPerm.hasPermission('SEND_MESSAGES')) {
		// ... 1) and the bot can't send to the channel...
			return msg.author.sendMessage("Join a voice channel first!");
			// ...PM the author of the msg and abort command execution.
		}
		// ... 2) and the bot can send to the channel...
		return msg.reply("join a voice channel first!");
		// ...notify the user to join a channel and abort command execution.
	}
	if(!msg.member.voiceChannel.joinable) {
	// If the bot can't connect to the voicechannel...
		return msg.author.sendMessage("I can't connect to that voice channel!");
		// ...PM the author of the msg and abort command execution.
	}
	if(msg.guild.voiceConnection !== null) {
	// If the bot is already in a voice channel of the server the command came from...
		if(!botPerm.hasPermission('SEND_MESSAGES')) {
		// ... 1) and the bot can't send to the channel...
			return msg.author.sendMessage('Please wait for the current sound to finish!');
			// ...PM the user and abort command execution.
		}
		// ... 2) and the bot can send to the channel...
		return msg.reply('please wait for the current sound to finish!');
		// ...notify the user and abort command execution.
	}
	// If a voice connection does not exist on the server the command is being used on...
	request.get('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body) {
	// ...then increment the counter on megumin.love...
		if(response == undefined) {
		// ...and if 1) the response is undefined...
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} No response was emitted when incrementing the counter -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Undefined response | ${error}`);
			// ...log it and the error...
			if(!botPerm.hasPermission('SEND_MESSAGES')) {
			// ... a) and if the bot can't send to the channel...
				return msg.author.sendMessage(`Error contacting the website, response code is undefined. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			return msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
			// ...notify the user and abort command execution.
		};
		if(error || response.statusCode !== 200) {
		// ...and if 2) There is an error or response code other than 200 (OK)...
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Unusual response code | ${response.statusCode}`);
			// ...log the unusual request responses/errors...
			if(!botPerm.hasPermission('SEND_MESSAGES')) {
			// ... a) and if the bot can't send to the channel...
				return msg.author.sendMessage(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			return msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
			// ...notify the user and abort command execution.
		};
		// If there is no error, proceed with the command.
	});
    var sounds = ["eugh1", "eugh2", "eugh3", "eugh4", "explosion", "itai", "n", "realname", "name", "plosion", "pull", "sion", "yamero", "magic-item", "parents", "hyoizaburo", "star", "oi", "igiari", "hmph", "zuryah", "whatsthis", "who", "yes", "yoroshii", "tropes", "truepower", "waah", "wellthanks", "oh", "shouganai", "sigh", "splat", "itscold", "ladiesfirst", "mywin", "nani", "dontwanna", "doushimashou", "friends", "hau", "isee", "bighug", "chomusuke", "comeatme", "dododo", "are", "aughh", "chomusukefaint", "ripchomusuke", "explosion2", "losion", "sion2", "n2", "hua", "thinking", "lalala"];
	// Set available files,...
	var sound = msg.content.substr(config.commandPrefix.length + command.length + 2).toLowerCase();
	// ...then set sound var to chosen sound argument.
	if(sounds.indexOf(sound) == -1) {
	// If chosen sound file is not available...
		return msg.author.sendMessage(`Sound unavailable! Available sounds are: \`\`\`${sounds.join("\n")}\`\`\``, {split: {prepend: "\`\`\`", append: "\`\`\`"}});
		// ...notify the user and abort command execution.
	};
	const voiceChannel = msg.member.voiceChannel;
	// Define voiceChannel as the command caller's voiceChannel
	voiceChannel.join().then(connection => {
	// Join the command caller's voice channel...
		const player = connection.playFile(`${config.soundPath + sound}.mp3`);
		// ...and play the file.
		connection.on('error', () => {
			msg.reply('an error related to the voiceChannel connection itself occurred, sorry! (Try again, maybe?)');
			// Message user if an error occurrs related to the connection itself
			return voiceChannel.leave();
			// Leave the voiceChannel and abort command execution
		});
		player.on('end', () => {
			voiceChannel.leave();
			// Leave voiceChannel once file finishes playing (or an error is emitted)
		});
		player.on('error', () => {
			msg.reply('an error occurred playing the sound file, sorry! (Try again, maybe?)');
			// Message user if an error occurs playing the file
			// Since 'error' emits an 'end' event, this will result in the voiceconnection being terminated
		});
	}).catch(error => {msg.reply('an error occurred while connecting to the voiceChannel, sorry! (Try again, maybe?)'); return voiceChannel.leave();});
};
exports.desc = "have the bot join your voice channel and play a chosen sound from the megumin.love website"; // Export command description
exports.syntax = "<soundName>" // Export command syntax