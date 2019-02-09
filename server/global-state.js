exports.DEFAULT_THRESHOLD = 1000;

exports.getJob = () => {
    return JSON.parse(JSON.stringify(job));
};

exports.startJob = ({ nodes, interval, threshold }) => {
    job.status = 'running';
    job.nodes = parseInt(nodes, 10);
    job.interval = parseInt(interval, 10);
    job.threshold = parseInt(threshold, 10);

    return exports;
};

exports.stopJob = () => {
    job.status = 'stopped';

    return exports;
};

const job = {
    status: 'stopped',
    nodes: 2,
    interval: 30,
    threshold: exports.DEFAULT_THRESHOLD
};
