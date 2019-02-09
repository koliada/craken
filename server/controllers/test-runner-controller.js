const grafana = require('../grafana');

const DEFAULT_THRESHOLD = 1000;

const job = {
    status: 'stopped',
    nodes: 2,
    interval: 30,
    threshold: DEFAULT_THRESHOLD
};

exports.get = async (req, res) => {
    const threshold = await grafana.getAlertThreshold();

    return res.render('configurator', Object.assign(job, {
        threshold: threshold || DEFAULT_THRESHOLD
    }));
};

exports.start = async (req, res) => {
    const { nodes, interval, threshold } = req.body;

    job.status = 'running';
    job.nodes = parseInt(nodes, 10);
    job.interval = parseInt(interval, 10);
    job.threshold = parseInt(threshold, 10);

    await grafana.setAlert(job.threshold);

    return res.redirect('/');
};

exports.stop = async (req, res) => {
    job.status = 'stopped';

    await grafana.deleteAlert();

    return res.redirect('/');
};
