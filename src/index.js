import React from "react";
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import rootReducer from "./store/reducers";
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { createBrowserHistory } from 'history';

import App from "./components/App";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"

import './index.css'

const defaultState = {};

const store = createStore(rootReducer, defaultState, applyMiddleware(reduxThunk));

const history = syncHistoryWithStore(createBrowserHistory(), store);
//const history = createBrowserHistory()
//const store = createStore(connectRouter(history)(rootReducer), {}, applyMiddleware(reduxThunk));

store.subscribe(() => console.log('Look ma, Redux!!'))

render(
  <Provider store={store}>
    <BrowserRouter>
	      <Switch>
			  <Route exact path="/" component={App}></Route>
		      <Route path="/login" component={Login}></Route>
		      <Route path="/register" component={Register}></Route>
	          <Route path="/dashboard" component={Dashboard}></Route>
	      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
