import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { IAction } from '../interfaces/redux';
import api from '../utils/api';
import types from './types';
import { IMap } from '@/interfaces/general';

function* fetchSaga() {
  try {
    const response: AxiosResponse = yield call(api.fetchGoogleSearches);
    yield put({ type: types.googleSearch.fetchSuccess, payload: response.data });
  } catch (err) {
    yield put({ type: types.googleSearch.fetchFailure, payload: err });
  }
}

export function* handleFetch() {
  yield takeLatest(types.googleSearch.fetch, fetchSaga);
}

function* retrieveSaga(action: IAction<number>) {
  try {
    const response: AxiosResponse = yield call(api.retrieveGoogleSearch, action.payload);
    yield put({ type: types.googleSearch.retrieveSuccess, payload: response.data });
  } catch (err) {
    yield put({ type: types.googleSearch.retrieveFailure, payload: err });
  }
}

export function* handleRetrieve() {
  yield takeLatest(types.googleSearch.retrieve, retrieveSaga);
}

function* updateSaga(action: IAction<any>) {
  try {
    const { id, putData } = action.payload;
    const response: AxiosResponse = yield call(api.updateGoogleSearch, id, putData);
    yield put({ type: types.googleSearch.updateSuccess, payload: response.data });
  } catch (err) {
    yield put({ type: types.googleSearch.updateFailure, payload: err });
  }
}

export function* handleUpdate() {
  yield takeLatest(types.googleSearch.update, updateSaga);
}

function* deleteSaga(action: IAction<any>) {
  try {
    yield call(api.deleteGoogleSearch, action.payload);
    yield put({ type: types.googleSearch.deleteSuccess, payload: action.payload });
  } catch (err) {
    yield put({ type: types.googleSearch.deleteFailure, payload: err });
  }
}

export function* handleDelete() {
  yield takeLatest(types.googleSearch.delete, deleteSaga);
}

function* toggleImageSaga(action: IAction<any>) {
  try {
    const response: AxiosResponse = yield call(
      api.toggleImageIncluded,
      action.payload.formattedName,
    );
    const payload = { data: response.data, searchId: action.payload.searchId };
    yield put({ type: types.TOGGLE_IMAGE_INCLUDED_SUCCESS, payload });
  } catch (err) {
    yield put({ type: types.TOGGLE_IMAGE_INCLUDED_FAILURE, payload: err });
  }
}

export function* handleToggleImage() {
  yield takeLatest(types.TOGGLE_IMAGE_INCLUDED, toggleImageSaga);
}

function* mergeSaga(action: IAction<any>) {
  try {
    const response: AxiosResponse = yield call(api.mergeSearches, action.payload);
    yield put({ type: types.MERGE_GOOGLE_SEARCHES_SUCCESS, payload: action.payload });
  } catch (err) {
    yield put({
      type: types.MERGE_GOOGLE_SEARCHES_FAILURE,
      payload: api.parseErrorFromResponse(err.response),
    });
  }
}

export function* handleMerge() {
  yield takeLatest(types.MERGE_GOOGLE_SEARCHES, mergeSaga);
}

export default [handleFetch, handleUpdate, handleDelete, handleToggleImage, handleMerge];
