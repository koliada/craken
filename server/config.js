const path = require('path');
const isProduction = process.env.NODE_ENV;

exports.getServer = () => {
    return {
        port: 3000,
        staticDir: path.resolve(__dirname, '../static'),
        viewsDir: path.resolve(__dirname, '../views'),
        privateRoute: '/api/v1',
        publicRoute: '/',
    };
};

exports.getGrafana = () => {
    return {
        host: '35.228.161.242',
        port: '3000',
        username: 'admin',
        password: 'admin'
    };
};

exports.getNginx = () => {
    return {
        configPath: isProduction ? '/etc/nginx/sites-enabled/kraken' : path.resolve(__dirname, '../nginx.conf.dev'),
        servers: Array.from([
            '35.228.10.5:8080',
            '35.228.124.170:8080',
            '35.228.149.17:8080',
            '35.228.221.40:8080',
            '35.228.255.2:8080'
        ])
    };
};
