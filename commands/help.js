module.exports = function help(bot, msg, timeout, permission) {
	var command = "help"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	msg.author.sendMessage("__**Available commands are:**__ \n\n 'help' -- displays this message \n 'about' -- get general bot info \n 'counter' -- display the website's current counter \n 'submit' -- get info on submitting sounds for the website/bot \n 'randomsound' -- Have the bot join the voice channel you are in and it'll play a random sound from the website \n 'setGame' -- sets the bot's playing status [Bot owner only] \n 'clearGame' -- clears the bot's playing status [Bot owner only] \n 'stats' -- display various bot stats [Bot owner only] \n 'setAvatar' -- changes the bot's avatar [Bot owner only] \n 'setName' -- changes the bot's username [Bot owner only] \n 'ignore' -- Make the bot ignore a user, use a 2nd time to revert [Bot owner only] \n 'POST' -- update the server count on the Discord Bots website (enable the command in the config) [Bot owner only] \n 'showLog' -- easily display one of the configured log files [Bot owner only] \n 'shutdown' -- shuts down the bot [Bot owner only]");
};
