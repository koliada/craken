const grafana = require('../grafana-api');
const globalState = require('../global-state');

exports.get = async (req, res) => {
    const threshold = await grafana.getAlertThreshold();
    const job = globalState.getJob();

    if (threshold) {
        Object.assign(job, {
            threshold: threshold || globalState.DEFAULT_THRESHOLD
        });
    }

    return res.render('configurator', job);
};

exports.start = async (req, res) => {
    const { nodes, interval, threshold } = req.body;
    const job = globalState.startJob({ nodes, interval, threshold }).getJob();

    await grafana.setAlert(job.threshold);

    return res.redirect('/');
};

exports.stop = async (req, res) => {
    globalState.stopJob();
    await grafana.deleteAlert();

    return res.redirect('/');
};
