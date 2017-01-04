var fs = require('fs');

var pluginpath = "plugins"; // folder to load commands from
var normalizedPath = require("path").join(__dirname, pluginpath); // fix the path to be used in condition checks

var pluginList = []; // To check if the file is changed, or added/removed/renamed.
var plugins = {}; // Actual command list

// Load all plugins from the dir
fs.readdirSync(normalizedPath).forEach(function(file) {                             // Look at all the files in the specificed folder
	var ModuleName = file.slice(0, -3).toLowerCase();                               // remove ".js" bit from the file names, and make it lowercase
	plugins[ModuleName] = require("./"+pluginpath+"/" + file);                      // Require the files
	pluginList.push(file);                                                          // Also keep track of all the files we loaded for some checks below.
});
exports.plugins = plugins;                                                          // Let the app.js know of our available commands

// Reload plugins automatically on add/remove/change
fs.watch('./'+pluginpath+'/', function (event, filename) {                          // Watch the directory
    if (filename) {                                                                 // if changes occur
       	var ModuleName = filename.slice(0, -3).toLowerCase();                       // Remove ".js" bit from the file names, and make it lowercase
        if (pluginList.indexOf(filename) > -1) {                                    // If the changed file exists in our loaded files list
           	var removed = pluginList.splice(pluginList.indexOf(filename), 1);       // Remove it from the list for now
        	delete plugins[ModuleName];                                             // Free memory and cache
        	require.uncache("./"+pluginpath+"/" +filename);                         // Remove the file from the node.js cache, so that re-requiring gives us the new code
        }
        else {                                                                      // If changed file doesn't exist
        	pluginList.push(filename);                                              // Add it to our list of loaded files
        	plugins[ModuleName] = require("./"+pluginpath+"/" + filename);          // And add it to our command list
        }
        exports.plugins = plugins;                                                  // Update our list of commands in app.js
    }
});
/*
    While watching the directory, edited/renamed files trigger the events twice:
    Once with the old name, and once with the new name.
    Therefore, a changed file is safe to remove from loaded files list, since it'll be re-added in the next trigger.

    However, added/removed files trigger it once, solving a problem rather nicely on its own.
*/

// Don't fuck with the functions below, because it's magic.
require.uncache = function (moduleName) {
    require.searchCache(moduleName, function (mod) {
    	console.log("deleting the cache for: "+moduleName);
        delete require.cache[mod.id];
    });
};

require.searchCache = function (moduleName, callback) {
    var mod = require.resolve(moduleName);
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        (function run(mod) {
            mod.children.forEach(function (child) {
                run(child);
            });

            callback(mod);
        })(mod);
    }
};

