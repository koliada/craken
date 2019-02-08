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
