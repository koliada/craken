const prom = require('../prom');

exports.get = (req, res) => {
    res.end(prom.getMetrics());
}