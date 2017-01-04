var fs = require('fs');

var pluginpath = "plugins"
var normalizedPath = require("path").join(__dirname, pluginpath);

var pluginList = []; // To check if the file is changed, or added/removed/renamed.
var plugins = {};

// Load all plugins from the dir
fs.readdirSync(normalizedPath).forEach(function(file) {
	var ModuleName = file.slice(0, -3);
	plugins[ModuleName] = require("./"+pluginpath+"/" + file);
	pluginList.push(file);
});
exports.plugins = plugins;

// Reload plugins automatically on add/remove/change
fs.watch('./'+pluginpath+'/', function (event, filename) {
    if (filename) {
    	// console.log(event, filename);
       	var ModuleName = filename.slice(0, -3);
        if (pluginList.indexOf(filename) > -1) {
        	var removed = pluginList.splice(pluginList.indexOf(filename), 1);
        	delete plugins[ModuleName];
        	require.uncache("./"+pluginpath+"/" +filename);
        }
        else {
        	pluginList.push(filename);
        	plugins[ModuleName] = require("./"+pluginpath+"/" + filename);
        }
        // console.log(pluginList);
        exports.plugins = plugins;
    }
});

// Don't fuck with the functions below, because it's magic!
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

