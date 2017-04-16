const config = require('../config.json');
const request = require('request');
const fs = require('fs');
const moment = require('moment');

exports.main = function(client, msg, msgArray, checks, chalk) {
	var command = "randomSound";
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	if(!msg.member.voiceChannel) {
		if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("Join a voice channel first!");
		return msg.reply("join a voice channel first!");
	};
	if(!msg.member.voiceChannel.joinable) return msg.author.send("I can't connect to that voice channel!");
	if(msg.guild.voiceConnection !== null) {
	// connection already exists
		if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send('Please wait for the current sound to finish!');
		return msg.reply('please wait for the current sound to finish!');
	};
	request.get('https://megumin.love/counter?inc=1', function (error, response, body) {
		if(response == undefined) {
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} No response was emitted when incrementing the counter -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Undefined response | ${error}`);
			if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send(`Error contacting the website, response code is undefined. Please refer to '${config.logPath}${config.requestLog}'.`);
			return msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
		};
		if(error || response.statusCode !== 200) {
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Unusual response code | ${response.statusCode}`);
			if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
			return msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
		};
	});
	var sounds = ["eugh1", "eugh2", "eugh3", "eugh4", "explosion", "itai", "n", "realname", "name", "plosion", "pull", "sion", "yamero", "magic-item", "parents", "hyoizaburo", "star", "oi", "igiari", "hmph", "zuryah", "whatsthis", "who", "yes", "yoroshii", "tropes", "truepower", "waah", "wellthanks", "oh", "shouganai", "sigh", "splat", "itscold", "ladiesfirst", "mywin", "nani", "dontwanna", "doushimashou", "friends", "hau", "isee", "bighug", "chomusuke", "comeatme", "dododo", "are", "aughh", "chomusukefaint", "ripchomusuke", "explosion2", "losion", "sion2", "n2", "hua", "thinking", "lalala", "chunchunmaru"];
	var sound = sounds[Math.floor(Math.random()*sounds.length)];
	const voiceChannel = msg.member.voiceChannel;
	// Define voiceChannel as the command caller's voiceChannel
	voiceChannel.join().then(connection => {
		const player = connection.playFile(`${config.soundPath + sound}.mp3`);
		connection.on('error', () => msg.reply('an error related to the voiceChannel connection itself occurred, sorry! (Try again, maybe?)').then(msg => voiceChannel.leave()));
		player.on('end', () => voiceChannel.leave());
		player.on('error', () => msg.reply('an error occurred playing the sound file, sorry! (Try again, maybe?)'));
		// Since 'error' emits an 'end' event, this will result in the voiceconnection being terminated
	}).catch(error => msg.reply('an error occurred while connecting to the voiceChannel, sorry! (Try again, maybe?)').then(msg => voiceChannel.leave()));
};

exports.desc = "have the bot join your voice channel and play a random sound from the megumin.love website";
exports.syntax = "";
