'use strict';

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Home from './components/Home';
import IndexPage from './components/IndexPage';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/">
    <IndexRoute component={IndexPage}/>
    <Route path="user/:id" component={Home}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;