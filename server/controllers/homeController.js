const path = require('path');

exports.renderHomePage = (req, res) => {
        console.log('renderHomePage called')
        const isProduction = process.env.NODE_ENV === 'production';

        isProduction ?
            res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'))
            :
            res.redirect('http://localhost:5173');
    };