const grafana = require('./grafana-api');
const nginx = require('./nginx-conf');
const prometheus = require('./prometheus');

const DEFAULT_THRESHOLD = 1000;

exports.getJob = async () => {
    const threshold = await grafana.getAlertThreshold();
    const j = JSON.parse(JSON.stringify(job));

    if (threshold) {
        Object.assign(j, {
            threshold: threshold || DEFAULT_THRESHOLD
        });
    }

    return j;
};

exports.startJob = async ({ nodes, interval, threshold }) => {
    job.status = 'running';
    job.nodes = parseInt(nodes, 10);
    job.interval = parseInt(interval, 10);
    job.threshold = parseInt(threshold, 10);

    await grafana.setAlert(job.threshold);
    await grafana.addStatusAnnotation(job.status);
    rebalance();

    return exports;
};

exports.stopJob = async (isInitialReset = false) => {
    if (isInitialReset) {
        await nginx.restoreConfig();
        await grafana.deleteAlert();
        prometheus.setNginxUpstreamCount(nginx.getServersCount());

        return exports;
    }

    job.status = 'stopped';

    clearInterval(jobInterval);

    await nginx.restoreConfig();
    await grafana.deleteAlert();
    await grafana.addStatusAnnotation(job.status);
    prometheus.setNginxUpstreamCount(nginx.getServersCount());

    return exports;
};

const job = {
    status: 'stopped',
    nodes: 1,
    interval: 10,
    threshold: DEFAULT_THRESHOLD
};

let jobInterval = null;

async function rebalance() {
    const startCount = nginx.getServersCount();
    const minCount = 1;

    let curCount = startCount;

    async function execute() {
        curCount -= job.nodes;

        if (curCount >= minCount) {
            await nginx.writeConfig(curCount);
            prometheus.setNginxUpstreamCount(curCount);
        } else {
            console.info(`Minimum server count reached: ${minCount}`);
        }
    }

    await execute();

    jobInterval = setInterval(execute, job.interval * 1000);
}
