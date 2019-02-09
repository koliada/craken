const path = require('path');

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
