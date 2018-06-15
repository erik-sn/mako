import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { IAction } from '../interfaces/redux';
import api from '../utils/api';
import types from './types';
import { IMap } from '@/interfaces/general';

function* mergeSaga(action: IAction<any>) {
  try {
    const response: AxiosResponse = yield call(api.mergeUploads, action.payload);
    yield put({ type: types.MERGE_UPLOAD_EVENTS_SUCCESS, payload: action.payload });
  } catch (err) {
    yield put({
      type: types.MERGE_UPLOAD_EVENTS_FAILURE,
      payload: api.parseErrorFromResponse(err.response),
    });
  }
}

export function* handleMerge() {
  yield takeLatest(types.MERGE_UPLOAD_EVENTS, mergeSaga);
}

export default [handleMerge];
