const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For reading the server config files
var normalizedPath = require("path").join(__dirname, config.serverConfPath); // Fix the path to be used in condition checks
var serverConfig = {}; // Object of server configs.

// Load all server configs from the serverConfPath (below) -- handler adapted from command handler courtesy of RShadowhand on Github
fs.readdirSync(normalizedPath).forEach(function(file) { 
	// Look at all the files in the specificed folder
	if(file.substr(-5, 5) == ".json") {
	// If the file is a .json file...
		var ServerID = file.slice(0, -5).toLowerCase();  
		// ...remove ".json" bit from the file names, convert it to lowercase...
		serverConfig[ServerID] = require("./"+config.serverConfPath+"/" + file); 
		// ...and then require the files as server config.
	};
});
exports.serverConfig = serverConfig;  // Export available serverConfig object