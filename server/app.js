'use strict';

import path from 'path';
import { Server } from 'http';
import httpProxy from 'http-proxy';
import Express from 'express';
import serverRender from './middlers/serverRender';


// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, '../dist')));

const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8000'
});
app.use('/api', (req, res)=> {
  proxy.web(req, res, {target: 'http://localhost:8000'})
});


app.get('/favicon.ico', (req, res) => {
  res.send({
    success: true
  });
})


// universal routing and rendering
app.get('*', serverRender);

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';

server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
