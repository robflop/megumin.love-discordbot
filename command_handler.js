const fs = require('fs');
const config = require('./config.json'); // import configuration
var normalizedPath = require("path").join(__dirname, config.commandPath); // fix the path to be used in condition checks
var commands = {}; // Object of existing commands

// Load all commands from the commandPath (below) -- command handler courtesy of RShadowhand on Github
fs.readdirSync(normalizedPath).forEach(function(file) { // Look at all the files in the specificed folder
	var ModuleName = file.slice(0, -3).toLowerCase();  // remove ".js" bit from the file names and convert to lowercase
	commands[ModuleName] = require("./"+config.commandPath+"/" + file); // Require the files as commands
});
exports.commands = commands;  // Export available commands object