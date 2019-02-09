const prom = require('../prometheus');

exports.get = (req, res) => {
    return res.end(prom.getMetrics());
};
