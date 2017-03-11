const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For reading the ignore files
var normalizedPath = require("path").join(__dirname, config.ignorePath); // Fix the path to be used in condition checks
var ignoreLists = {}; // Object of ignore lists

// Load all ignore lists from the ignorePath (below) -- handler adapted from command handler courtesy of RShadowhand on Github
fs.readdirSync(normalizedPath).forEach(function(file) {
	// Look at all the files in the specificed folder
	if(file.substr(-5, 5) == ".json") {
	// If the file is a .json file...
		var ServerID = file.slice(0, -5).toLowerCase();
		// ...remove ".json" bit from the file names, convert it to lowercase...
		ignoreLists[ServerID] = require("./"+config.ignorePath+"/" + file);
		// ...and then require the files as ignore lists.
	};
});
exports.ignoreLists = ignoreLists;  // Export available ignoreLists object