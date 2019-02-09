const prometheus = require('prom-client');
const { getPrometheus } = require('./config');
const { gauge } = getPrometheus();
const countGauge = new prometheus.Gauge(gauge);

exports.setNginxUpstreamCount = (count) => {
    return countGauge.set(count);
};

exports.getMetrics = () => {
    return prometheus.register.metrics();
};
