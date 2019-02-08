const server = require('./server');
let isShuttingDown = false;

function exit(code) {
	setTimeout(() => {
		process.exit(code);
	}, 3000);
}

async function shutdown() {
	try {
		await server.shutdown();

		console.info('Graceful shutdown successful. Exiting');
		exit(0);
	} catch (err) {
		console.error('Graceful shutdown failed', {
			reason: err.message,
			stack: err.stack,
		});
		exit(1);
	}
}

exports.init = () => {
	process.on('SIGTERM', () => {
		console.info('SIGTERM signal received. Performing graceful shutdown');
		isShuttingDown = true;

		setTimeout(shutdown, 10000);
	});
};

exports.isShuttingDown = () => isShuttingDown;
