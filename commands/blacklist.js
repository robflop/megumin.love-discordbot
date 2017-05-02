const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');
const blacklist = require('../serverconf/blacklist.json');

exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "blacklist";
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
	if(msgArray.length<2) return msg.reply("specify IDs to blacklist!");
	msgArray.splice(0, 1); // remove cmd name
	const args = msgArray;
	let toFind, index;
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	if(msgArray[0] == "find") {
		toFind = msgArray[1];
		if(!toFind) return msg.reply("specify a guild ID to search for!");
		index = blacklist.indexOf(toFind);
		if(index == -1) return msg.reply(`Guild ID '${toFind}' was not found on the blacklist!`);
		return msg.reply(`Guild ID '${toFind}' was found at position ${index} of the blacklist!`);
	};
	const added = [], removed = [];
	for(let i=0; i<args.length; i++) {
		index = blacklist.indexOf(args[i]);
		if(!blacklist.includes(args[i])) {
			blacklist.push(args[i]);
			fs.writeFileSync(`./serverconf/blacklist.json`, JSON.stringify(blacklist));
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][BLACKLIST] ${msg.author.tag} successfully added a server to the blacklist.`);
			added.push(args[i]);
		}
		else {
			blacklist.splice(index, 1);
			fs.writeFileSync(`./serverconf/blacklist.json`, JSON.stringify(blacklist));
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][BLACKLIST] ${msg.author.tag} successfully removed a server from the blacklist.`);
			removed.push(args[i]);
		};
	};
	let result = "";
	if(added.length>0) {
		result += `added ${added.join(", ")} to the list`;
	}
	if(removed.length>0) {
		result += `${result.includes("added")?" & ":""}removed ${removed.join(", ")} from the list`;
	}
	return msg.reply(`successfully ` + result + "!");
};

exports.desc = "Blacklist a server, making the bot automatically leave it upon joining [Bot owner only]";
exports.syntax = "<guildID to blacklist or 'find' argument> <guildID to search for if using 'find' arg>";