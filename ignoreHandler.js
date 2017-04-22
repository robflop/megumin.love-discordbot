const config = require('./config.json');
const fs = require('fs');
const normalizedPath = require("path").join(__dirname, config.ignorePath);
const ignoreLists = {};

// Ignore handler adapted from command handler courtesy of RShadowhand on Github
fs.readdirSync(normalizedPath).forEach(function(file) {
	if(file.substr(-5, 5) == ".json") {
		const ServerID = file.slice(0, -5).toLowerCase();
		ignoreLists[ServerID] = require("./"+config.ignorePath+"/" + file);
	};
});

exports.ignoreLists = ignoreLists;