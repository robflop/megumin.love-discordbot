const config = require('./config.json');
const fs = require('fs');
const normalizedPath = require("path").join(__dirname, config.serverConfPath);
const serverConfig = {};

// Server config handler adapted from command handler courtesy of RShadowhand on Github
fs.readdirSync(normalizedPath).forEach(function(file) {
	if(file.substr(-5, 5) == ".json") {
		const ServerID = file.slice(0, -5).toLowerCase();
		serverConfig[ServerID] = require("./"+config.serverConfPath+"/" + file);
	};
});

exports.serverConfig = serverConfig;