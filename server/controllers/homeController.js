import { join } from 'path';
import { FRONTEND_BASE_URL } from '../utils.js';

export function renderHomePage(req, res) {
        console.log('renderHomePage called')
        const isProduction = process.env.NODE_ENV === 'production';

        isProduction ?
            res.sendFile(join(__dirname, '../../client/dist', 'index.html'))
            :
            res.redirect(`${FRONTEND_BASE_URL}`);
    }