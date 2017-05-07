const config = require('../config.json');
const { RichEmbed } = require('discord.js');
const request = require('request');
const fs = require('fs');
const moment = require('moment');
const history = require('../counterHistory.json');

exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "counter";
	if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("I can't send messages to that channel!");
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	if(msgArray[1] == "history") {
	// history arg
		return msg.channel.send(`**__Here is an overview of the counter's saved progress history__**:\n\`\`\`${history.join("\n")}\`\`\``, {split: {prepend: "\`\`\`", append: "\`\`\`"}});
	};
	if(msgArray[1] == "append") {
	// append arg
		if(msg.author.id !== config.ownerID) return msg.channel.send("You are not authorized to modify the counter history!");
		let newCounter = "";
		// define placeholder
		return request.get('https://megumin.love/counter', function (error, response, body) {
			if(response == undefined) return msg.channel.send("Response undefined when getting the counter, command execution aborted.");
			if(error || response.statusCode !== 200) return msg.channel.send(`An error has occured or the response code was not "200 OK": \`\`\`${error}\`\`\`\nCommand execution aborted.`);
			newCounter = `${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} ${moment().format('HH:mm')} ${moment().format('DD/MM/YY')}`;
			// format counter to x.xxx.xxx
			history.push(newCounter);
			fs.writeFile("./counterHistory.json", JSON.stringify(history), "utf-8", (error, data) => {
				if(error) return msg.channel.send(`An error has occured: \`\`\`${error}\`\`\``);
				msg.channel.send(`New entry successfully added: \`\`${newCounter}\`\``);
			});
		});
	};
	if(msgArray[1] == "revert" ) {
	// revert arg
		if(msg.author.id !== config.ownerID) return msg.channel.send("You are not authorized to modify the counter history!");
		history.pop();
		return fs.writeFile("./counterHistory.json", JSON.stringify(history), "utf-8", (error, data) => {
			if(error) return msg.channel.send(`An error has occured: \`\`\`${error}\`\`\``);
			msg.channel.send("Latest history entry successfully removed.");
		});
	};
	if(msgArray[1] == "statistics") {
	// statistics arg
		return request.get('https://megumin.love/counter?statistics', function (error, response, body) {
			if(response == undefined) {
				console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} No response was emitted when GETting the counter -- Refer to request logs`);
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Undefined response | ${error}`);
				if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("Error contacting the website, response code is undefined. Please refer to request logs.");
				return msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
			};
			if(error || response.statusCode !== 200) {
				console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Unusual response code | ${response.statusCode}`);
				// ...log the unusual request responses/errors...
				if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("Error contacting the website, response code is not 200 (OK) or an error occurred. request logs.");
				msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
			};
			const statistics = JSON.parse(body);
			console.log(statistics);
			const embed = new RichEmbed();
			embed.setAuthor('megumin.love Counter Statistics', 'https://megumin.love/images/favicon.ico')
				.setURL('https://megumin.love/')
				.setColor((Math.random() * 10e4).toFixed(5))
				.addField('Alltime', statistics.alltime.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), true)
				.addField('Today', statistics.today.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), true)
				.addField('Past 7 days', statistics.week.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), true)
				.addField('Past 31 days', statistics.month.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), true)
				.addBlankField(true)
				.addField('Average/day', statistics.average.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), true)
			return msg.channel.send({embed: embed});
		});
	};
	request.get('https://megumin.love/counter', function (error, response, body) {
		if(response == undefined) {
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} No response was emitted when GETting the counter -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Undefined response | ${error}`);
			if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("Error contacting the website, response code is undefined. Please refer to request logs.");
			return msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
		};
		if(error || response.statusCode !== 200) {
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Unusual response code | ${response.statusCode}`);
			// ...log the unusual request responses/errors...
			if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("Error contacting the website, response code is not 200 (OK) or an error occurred. request logs.");
			msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
		};
		if(body % 1000000 == 0) return msg.channel.send(`Current https://megumin.love count is: 🎊🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉🎊`);
		else if(body % 100000 == 0) return msg.channel.send(`Current https://megumin.love count is: 🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉`);
		// special versions for 1mil and 100k marks
		else msg.channel.send(`Current https://megumin.love count is: **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}**`);
	});
};

exports.desc = "display the website's current counter";
exports.syntax = "<history/append/revert/statistics, all optional>";