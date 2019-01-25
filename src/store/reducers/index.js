import { combineReducers } from "redux";
import { routerReducer } from 'react-router-redux'

import userData from "./userReducer";

const reducers = combineReducers({
  userData,
  routing: routerReducer
});

export default reducers