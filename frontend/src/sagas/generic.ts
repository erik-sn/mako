import { call, put, take, takeLatest } from 'redux-saga/effects';

import { websocketInitChannel, ITypes } from '../utils/websockets';
import api from '../utils/api';
import types from './types';

function* checkApiStatusSaga() {
  try {
    const response = yield call(api.status);
    yield put({ type: types.CHECK_STATUS_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: types.CHECK_STATUS_FAILURE, payload: err });
  }
}

export function* handleCheckApiStatus() {
  yield takeLatest(types.CHECK_STATUS, checkApiStatusSaga);
}

const asyncWebsocketTypes: ITypes = {
  success: types.WEBSOCKET_ASYNC_INITIALIZE_SUCCESS,
  failure: types.WEBSOCKET_ASYNC_INITIALIZE_FAILURE,
  error: types.WEBSOCKET_ASYNC_GENERIC_ERROR,
  closed: types.WEBSOCKET_ASYNC_CLOSED,
};

function* initializeAsyncWebsocketSaga() {
  try {
    const asyncWebsocketUrl = 'ws://localhost:8000/socket/v1/async/';
    const channel = yield call(websocketInitChannel, asyncWebsocketUrl, asyncWebsocketTypes);
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } catch (err) {
    yield put({ type: types.WEBSOCKET_ASYNC_INITIALIZE_FAILURE, err });
  }
}

export function* handleAsyncInitializeWebsocket() {
  yield takeLatest(types.WEBSOCKET_ASYNC_INITIALIZE, initializeAsyncWebsocketSaga);
}

const websocketTypes: ITypes = {
  success: types.WEBSOCKET_INITIALIZE_SUCCESS,
  failure: types.WEBSOCKET_INITIALIZE_FAILURE,
  error: types.WEBSOCKET_GENERIC_ERROR,
  closed: types.WEBSOCKET_CLOSED,
};

function* initializeWebsocketSaga() {
  try {
    const websocketUrl = 'ws://localhost:8000/socket/v1/';
    const channel = yield call(websocketInitChannel, websocketUrl, websocketTypes);
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } catch (err) {
    yield put({ type: types.WEBSOCKET_INITIALIZE_FAILURE, payload: err });
  }
}

export function* handleInitializeWebsocket() {
  yield takeLatest(types.WEBSOCKET_INITIALIZE, initializeWebsocketSaga);
}

export default [
  handleCheckApiStatus,
  // handleInitializeWebsocket,
  handleAsyncInitializeWebsocket,
];
