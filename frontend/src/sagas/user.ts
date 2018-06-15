import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { IAction } from '../interfaces/redux';
import api from '../utils/api';
import types from './types';

function* getAuthTokenSaga(action: IAction<any>) {
  try {
    const { username, password } = action.payload;
    const response: AxiosResponse = yield call(api.getAuthToken, username, password);
    yield put({ type: types.GET_AUTH_TOKEN_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: types.GET_AUTH_TOKEN_FAILURE, payload: err.response.data });
  }
}

export function* handleCreate() {
  yield takeLatest(types.GET_AUTH_TOKEN, getAuthTokenSaga);
}

function* refreshAuthTokenSaga(action: IAction<any>) {
  try {
    const response: AxiosResponse = yield call(api.refreshAuthToken, action.payload);
    yield put({ type: types.REFRESH_AUTH_TOKEN_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: types.REFRESH_AUTH_TOKEN_FAILURE, payload: err.response.data });
  }
}

export function* handleRefresh() {
  yield takeLatest(types.REFRESH_AUTH_TOKEN, refreshAuthTokenSaga);
}

export default [handleCreate, handleRefresh];
