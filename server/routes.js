const { Router } = require('express');
const bodyParser = require('body-parser');
const testRunnerController = require('./controllers/test-runner-controller');
const webhookController = require('./controllers/webhook-controller');

exports.getPublicRouter = () => {
    const router = Router();

    router.get('/', testRunnerController.get);
    router.post('/start', bodyParser.urlencoded(), testRunnerController.start);
    router.post('/stop', bodyParser.urlencoded(), testRunnerController.stop);
    router.post('/webhook/grafana', bodyParser.json(), webhookController.grafanaPost);

    return router;
};
