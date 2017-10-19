import fs from 'mz/fs';
import path from 'path';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import routes from '../../app/router';
import reducers from '../../app/reducer/index';

const store = createStore(reducers, applyMiddleware(thunk));

export default function serverRender(req, res, next){
    match({routes, location: req.url}, (err, redirectLocation, renderProps)=> {
        if(err){
            res.status(500).send(err.message);
        }
        if(redirectLocation){
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }
        if(renderProps){
            let {query, params, components} = renderProps;
            let comp = components[components.length-1].WrappedComponent;
            let promise = comp && comp.fetchData ? 
                comp.fetchData({query, params, store, history: {}}):
                Promise.resolve();
            promise.then(data=> {
                let scripts = [];
                let pattern = /src="([\w\?\.]+)">/g;
                fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf-8').replace(pattern, (match, pathname)=> {
                    scripts.push(pathname);
                });
                let markup = renderToString(<Provider store={store}><RouterContext {...renderProps}/></Provider>);
                res.send(renderFullPage(markup, store.getState(), scripts));
            })
        }else {
            res.status(404).send('Not Found Page!');
        }
    });
}

function renderFullPage(markup, preloadedState, scripts){
    let scriptStr = scripts.map(script=> `<script type="text/javascript" src="/${script}"></script>`).join('');
    return `
      <!doctype html>
      <html>
        <head>
          <title>Blog Server Render</title>
        </head>
        <body>
          <div id="root">${markup}</div>
          <script>
            window.__initialState__ = ${JSON.stringify(preloadedState)}
          </script>
          ${scriptStr}
        </body>
      </html>
      `
}