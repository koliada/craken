const fs = require('fs');
const { getNginx } = require('./config');

exports.getServersCount = () => {
    const { servers } = getNginx();

    return servers.length;
};

exports.writeConfig = async (serversCount) => {
    try {
        const { servers } = getNginx();

        writeConfig(servers.slice(-serversCount));

        return true;
    } catch (err) {
        console.error(err);

        return false;
    }
};

exports.restoreConfig = async () => {
    try {
        const { servers } = getNginx();

        writeConfig(servers);

        return true;
    } catch (err) {
        console.error(err);

        return false;
    }
};

function writeConfig(servers) {
    const { configPath } = getNginx();
    const conf = builtConfig(servers);

    console.info(`Writing config with ${servers.length} servers`, servers);

    fs.writeFileSync(configPath, conf);
}

function builtConfig(servers) {
    return `
upstream myapp1 {
    ${servers.map(server => `server ${server};`).join('\n    ')}
}
server {
    listen 80;
    server_name  kraken;
    location / {
        proxy_pass http://myapp1;
    }
}
    `;
}
