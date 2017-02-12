const config = require('../config.json'); // Import configuration

exports.main = function(bot, msg, cooldown, botPerm, userPerm) { // Export command's function
    var command = "eval";
    if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
    if(msg.author.id !== config.ownerID) {
		// If the user is not authorized...
		msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
		// ...notify the user...
		return; // ...and abort command execution.
	};
    if(!config.eval) {msg.channel.sendMessage('Eval has been disabled in the config.').then(msg => msg.delete(2000))};
    // If eval disabled in config, notify user and then set auto-delete to 2s.
    var input = msg.content.substring(msg.content.indexOf('"')+1, msg.content.lastIndexOf('"'));
    // Define eval input out of the message content
    if(input == '' || input == '"' || input == '""') {msg.channel.sendMessage("No input given.").then(msg => msg.delete(2000)); return;};
    // If input is empty or none was given, notify user and set auto-delete to 2s.
    try {
    // Try evaluating the input
        var output = eval(input);
        // Define output as the evaluated input
        if(typeof output !== "string") {
        // If the output isn't a string (object, array, etc)...
            output = require('util').inspect(output);
            // ...inspect it and turn it into a string.
        };
        if(typeof output == "string" && output.indexOf(config.token) > -1) {
        // If the output is a string and contains the bot token...
            function escapeRegExp(str) {return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");};
            // ...define function to escape the token's special characters...
            var escapedToken = escapeRegExp(config.token);
            // ...define the escaped token under usage of the escape regex function...
            var regex = new RegExp(escapedToken, "g");
            // ...define the regex object to check for the bot token from the escaped token...
            output = output.replace(regex, "<token>");
            // ...and finally replace all occurences of the user token with "<token>".
        };
        msg.channel.sendMessage(`INPUT:\`\`\`js\n${input}\n\`\`\`\n\nOUTPUT: \`\`\`js\n${output}\n\`\`\``, {split: {prepend: "\`\`\`js\n", append: "\`\`\`\n"}});
        // Send the message with the eval output
    }
    catch(error) {
    // If there is an error evaluating the input...
        msg.channel.sendMessage(`INPUT:\`\`\`\n${input}\n\`\`\`\n\nERROR: \`\`\`\n${error}\n\`\`\``, {split: {prepend: "\`\`\`\n", append: "\`\`\`\n"}});
        // ...notify the user.
    };
};

exports.desc = "Evaluate user javascript input -- USE WITH CAUTION. [Bot owner only]"; // Export command description
exports.syntax = "<input to evaluate enclosed by \"quotes\">"; // Export command syntax 