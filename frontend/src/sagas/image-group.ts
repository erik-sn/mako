import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { IAction } from '../interfaces/redux';
import api from '../utils/api';
import types from './types';

function* createSaga(action: IAction<any>) {
  try {
    const response: AxiosResponse = yield call(api.createImageGroup, action.payload);
    yield put({ type: types.imageGroups.createSuccess, payload: response.data });
  } catch (err) {
    yield put({ type: types.imageGroups.createFailure, payload: err.response.data });
  }
}

export function* handleCreate() {
  yield takeLatest(types.imageGroups.create, createSaga);
}

export default [
  handleCreate,
];
