const server = require('./server');
const globalState = require('./global-state');
const gracefulShutdown = require('./graceful-shutdown');

process.on('unhandledRejection', err => {
    console.error('Unhandled rejection :(', err);
});

console.info('Service is starting');

if (process.env.ENV_ID !== 'live') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

(async () => {
    await server.init();
    await globalState.stopJob(true);
    gracefulShutdown.init();

    console.info('Service is completely set up');
})();