const axios = require('axios');
const { getGrafana } = require('./config');
const alertPartial = require('./partials/alert.json');

const DASHBOARD_UID = 'PGImyFuik';
const DASHBOARD_ID = 8;
const PANEL_ID = 4;

exports.getAlertThreshold = async () => {
    try {
        const dashboard = await getDashboard(DASHBOARD_UID);
        const panel = dashboard.panels.find(({ id }) => id === PANEL_ID);

        return panel.alert ? (panel.alert.conditions[0].evaluator.params[0] * 1000) : 0;
    } catch (err) {
        console.error(err);

        return 0;
    }
};

exports.setAlert = async (ms) => {
    try {
        const dashboard = await getDashboard(DASHBOARD_UID);
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
        const dashboard = await getDashboard(DASHBOARD_UID);
        const panel = dashboard.panels.find(({ id }) => id === PANEL_ID);

        delete panel.alert;

        await updateDashboard(dashboard);

        return true;
    } catch (err) {
        console.error(err);

        return false;
    }
};

exports.addStatusAnnotation = async (status) => {
    try {
        const text = status === 'running' ? '[Craken] Test started' : '[Craken] Test finished';

        await createAnnotation(DASHBOARD_ID, text);

        return true;
    } catch (err) {
        console.error(err);

        return false;
    }
};

exports.addRescaleAnnotation = async (serversCount) => {
    try {
        const text = `[Craken] Downscaled to ${serversCount}`;

        await createAnnotation(DASHBOARD_ID, text);

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

async function createAnnotation(dashboardId, text) {
    const { host, port, username, password } = getGrafana();

    await axios({
        method: 'post',
        url: `http://${host}:${port}/api/annotations`,
        auth: {
            username: username,
            password: password
        },
        data: {
            dashboardId: dashboardId,
            time: new Date().getTime(),
            isRegion: true,
            tags: ['craken'],
            text: text
        }
    });
}