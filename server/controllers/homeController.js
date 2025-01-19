const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

exports.renderHomePage = (req, res) => {
        console.log('renderHomePage called')
        
        isProduction ?
            res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'))
            :
            res.redirect('http://localhost:5173');
    };

exports.renderDashboardPage = (req, res) => {
        console.log('renderDashboardPage called')
        
        isProduction ?
            res.redirect('http://everything-friendly.onrender.com/dashboard')
            :
            res.redirect('http://localhost:5173/dashboard');
    };