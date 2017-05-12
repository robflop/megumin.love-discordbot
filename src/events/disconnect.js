async function disconnect(client, event) {
	if (event.code === 1000) {
		client.config.pm2 ? process.exit(0) : client.destroy().then(() => client.login(client.config.token));
		// Restart if disconnect code is 1000 (gracefully exited) because it won't reconnect automatically
		return client.logger.info(`Automatically restarting due to WS error code ${event.code}...`);
	}
	else {
		return client.logger.warn(`robbot was disconnected with WS error code ${event.code}!`);
	}
}

module.exports = disconnect;