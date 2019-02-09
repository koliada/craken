const globalState = require('../global-state');

exports.get = async (req, res) => {
    const job = await globalState.getJob();

    return res.render('configurator', job);
};

exports.start = async (req, res) => {
    const { nodes, interval, threshold } = req.body;

    await globalState.startJob({ nodes, interval, threshold });

    return res.redirect('/');
};

exports.stop = async (req, res) => {
    await globalState.stopJob();

    return res.redirect('/');
};
