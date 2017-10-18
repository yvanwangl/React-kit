'use strict';

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../app/router';
import reducers from '../app/reducer/index';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import NotFoundPage from '../app/components/NotFoundPage';

const store = createStore(reducers, applyMiddleware(thunk));

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, '../dist')));
app.get('user/:id', (req, res)=>{
    return res.send({
        blogs: [1,2,3,4]
    });
});

// universal routing and rendering
app.get('*', (req, res) => {
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }

      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        function getReduxPromise () {
          let { query, params } = renderProps;
          let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
          let promise = comp.fetchData ?
            comp.fetchData({ query, params, store, history:{} }) :
            Promise.resolve();
          
          return promise;
        }
        getReduxPromise();
        markup = renderToString(<Provider store={store}><RouterContext {...renderProps}/></Provider>);
        return res.send(renderFullPage(markup, store.getState()));
        
      } else {
        // otherwise we can render a 404 page
        markup = renderToString(<NotFoundPage/>);
        res.status(404);
      }

      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

function renderFullPage(html, preloadedState) {
    return `
      <!doctype html>
      <html>
        <head>
          <title>Redux Universal Example</title>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>
            window.__initialState__ = ${JSON.stringify(preloadedState)}
          </script>
          <script type="text/javascript" src="../../dll.vendor.js?7a153e1cad1d9581cb30"></script>
          <script type="text/javascript" src="../../runtime.0ad7565a3479d87bbd99.js"></script>
          <script type="text/javascript" src="../../vendor.bc025094f61ca33902b6.js"></script>
          <script type="text/javascript" src="../../main.d1aeeab44d18d569fec8.js"></script>
        </body>
      </html>
      `
  }

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';

server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
