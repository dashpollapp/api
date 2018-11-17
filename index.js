#!/usr/bin/env node

import http from 'http';
import * as db from './lib/db';
import * as socket from './lib/socket';
import * as mongo from './lib/mongo';

import app from './app';

const server = http.createServer(app);
const port = 3000;
app.set('port', port);

mongo.connect();
db.connect((err) => {
    if (err) {
        console.error('[MongoDB] Unable to connect to Mongo.');
        process.exit(1);
    }

    server.listen(port);
    socket.listen(server);
});