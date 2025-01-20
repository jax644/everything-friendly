const path = require('path');
const { FRONTEND_BASE_URL } = require('../utils');

exports.renderHomePage = (req, res) => {
        console.log('renderHomePage called')
        const isProduction = process.env.NODE_ENV === 'production';

        isProduction ?
            res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'))
            :
            res.redirect(`${FRONTEND_BASE_URL}`);
    };