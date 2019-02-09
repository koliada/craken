const prom = require('prom-client');

const gauge = new prom.Gauge({
    name: 'kraken_nginx_upstream_count',
    help: 'Number of upstream servers'
});

exports.setNginxUpstreamCount = (count) => {
    gauge.set(count);
}

exports.getMetrics = () => {
    return prom.register.metrics();
}