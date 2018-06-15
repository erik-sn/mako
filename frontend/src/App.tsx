/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { hot } from 'react-hot-loader';

import './assets/sass/app.scss';
import Application from './components/Application';
import rootReducer from './reducers/root';
import sagas from './sagas';
import authMiddleware from './middleware/auth-middleware';

const sagaMiddleware: any = createSagaMiddleware();
const createStoreWithMiddleware = applyMiddleware(sagaMiddleware, authMiddleware)(createStore);

declare var window: any;
const store = createStoreWithMiddleware(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

sagaMiddleware.run(sagas);

const App = () => (
  <Provider store={store}>
    <Router>
      <Application />
    </Router>
  </Provider>
);

export default hot(module)(App);
// export default App;
