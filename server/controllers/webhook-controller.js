const globalState = require('../global-state');

const SECRET = '8ebaa3c6eb80111d63cc14889d76f3083c29b83c';

exports.grafanaPost = async (req, res) => {
    const { secret } = req.query;

    if (secret !== SECRET) {
        return res.status(401).end('Unauthorized');
    }

    try {
        const { state } = req.body;

        if (state === 'alerting') {
            console.info('Stopping from the webhook');
            await globalState.stopJob();
        }

        return res.status(200).end('All gud. Uskumatu.');
    } catch (err) {
        return res.status(500).end('Me sorry :(');
    }
};