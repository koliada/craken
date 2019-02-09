const axios = require('axios');
const { getGrafana } = require('./config');
const alertPartial = require('./partials/alert.json');

const DASHBOARD_ID = 'PGImyFuik';
const PANEL_ID = 4;

exports.getAlertThreshold = async () => {
    try {
        const dashboard = await getDashboard(DASHBOARD_ID);
        const panel = dashboard.panels.find(({ id }) => id === PANEL_ID);

        return panel.alert ? (panel.alert.conditions[0].evaluator.params[0] * 1000) : 0;
    } catch (err) {
        console.error(err);

        return 0;
    }
};

exports.setAlert = async (ms) => {
    try {
        const dashboard = await getDashboard(DASHBOARD_ID);
        const panel = dashboard.panels.find(({ id }) => id === PANEL_ID);

        panel.alert = JSON.parse(JSON.stringify(alertPartial));
        panel.alert.conditions[0].evaluator.params = [ms / 1000];

        delete dashboard.version;

        await updateDashboard(dashboard);

        return true;
    } catch (err) {
        console.error(err);

        return false;
    }
};

exports.deleteAlert = async () => {
    try {
        const dashboard = await getDashboard(DASHBOARD_ID);
        const panel = dashboard.panels.find(({ id }) => id === PANEL_ID);

        delete panel.alert;

        await updateDashboard(dashboard);

        return true;
    } catch (err) {
        console.error(err);

        return false;
    }
};

async function getDashboard(dashboardId) {
    const { host, port, username, password } = getGrafana();

    const { data: { dashboard } } = await axios({
        method: 'get',
        url: `http://${host}:${port}/api/dashboards/uid/${dashboardId}`,
        auth: {
            username: username,
            password: password
        },
    });

    return dashboard;
}

async function updateDashboard(dashboard) {
    const { host, port, username, password } = getGrafana();

    await axios({
        method: 'post',
        url: `http://${host}:${port}/api/dashboards/db`,
        auth: {
            username: username,
            password: password
        },
        data: { dashboard, overwrite: true }
    });
}