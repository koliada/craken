const job = {
    status: 'stopped',
    nodes: 2,
    interval: 0
};

exports.get = async (req, res) => {
    return res.render('configurator', job);
};

exports.start = async (req, res) => {
    job.status = 'running';

    return res.redirect('/');
};

exports.stop = async (req, res) => {
    job.status = 'stopped';

    return res.redirect('/');
};
