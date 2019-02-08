const express = require('express');
const config = require('./config');
const routes = require('./routes');
const { viewsDir, port, publicRoute, staticDir } = config.getServer();
const app = express();

let appServer = null;

app.disable('x-powered-by');

app.use('/static', express.static(staticDir));
app.use(publicRoute, routes.getPublicRouter());

app.set('views', viewsDir);
app.set('view engine', 'ejs');

exports.init = () => {
    return new Promise((resolve, reject) => {
        appServer = app.listen(port, '0.0.0.0', err => (err ? reject(err) : resolve()));
    });
};

exports.shutdown = async () => {
    if (appServer) {
        return await Promise.promisify(appServer.close.bind(appServer))();
    }
};
