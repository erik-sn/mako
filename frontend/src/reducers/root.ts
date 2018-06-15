import { combineReducers, Reducer } from 'redux';

import { IStore } from '../interfaces/redux';
import ClassifierReducer from './classifier';
import DisplayReducer from './display';
import ErrorReducer from './error';
import GlobalReducer from './global';
import GoogleReducer from './google';
import LoaderReducer from './loaders';
import AuthReducer from './auth';

const rootReducer: Reducer<IStore> = combineReducers({
  classifiers: ClassifierReducer,
  display: DisplayReducer,
  global: GlobalReducer,
  google: GoogleReducer,
  loaders: LoaderReducer,
  errors: ErrorReducer,
  auth: AuthReducer,
});

export default rootReducer;
