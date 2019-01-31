import React from "react";
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";
import rootReducer from "./store/reducers";
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { createBrowserHistory } from 'history';


import App from "./components/App";

import './index.css'

const defaultState = {};

const store = createStore(rootReducer, defaultState, applyMiddleware(reduxThunk));

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(rootReducer, defaultState, composeEnhancers(
//     applyMiddleware(reduxThunk)
// ));

const history = syncHistoryWithStore(createBrowserHistory(), store);
//const history = createBrowserHistory()
//const store = createStore(connectRouter(history)(rootReducer), {}, applyMiddleware(reduxThunk));

store.subscribe(() => console.log('Look ma, Redux!!'))

render(
  <Provider store={store}>
   	<App/>
  </Provider>,
  document.getElementById("root")
);
