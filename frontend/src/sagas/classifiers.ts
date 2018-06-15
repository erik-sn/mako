import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { IAction } from '../interfaces/redux';
import api from '../utils/api';
import types from './types';

function* fetchClassifierSaga() {
  try {
    const response: AxiosResponse = yield call(api.fetchClassifiers);
    yield put({ type: types.FETCH_CLASSIFIERS_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: types.FETCH_CLASSIFIERS_FAILURE, err });
  }
}

export function* handleFetchClassifiers() {
  yield takeLatest(types.FETCH_CLASSIFIERS, fetchClassifierSaga);
}

function* createClassifierSaga(action: IAction<any>) {
  try {
    const response: AxiosResponse = yield call(api.createClassifier, action.payload);
    yield put({ type: types.CREATE_CLASSIFIER_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: types.CREATE_CLASSIFIER_FAILURE, err });
  }
}

export function* handleCreateClassifier() {
  yield takeLatest(types.CREATE_CLASSIFIER, createClassifierSaga);
}

function* updateClassifierSaga(action: IAction<any>) {
  try {
    const { id, putData } = action.payload;
    const response: AxiosResponse = yield call(api.updateClassifier, id, putData);
    yield put({ type: types.UPDATE_CLASSIFIER_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: types.UPDATE_CLASSIFIER_FAILURE, err });
  }
}

export function* handleUpdateClassifier() {
  yield takeLatest(types.UPDATE_CLASSIFIER, updateClassifierSaga);
}

function* deleteClassifierSaga(action: IAction<any>) {
  try {
    yield call(api.deleteClassifier, action.payload);
    yield put({ type: types.DELETE_CLASSIFIER_SUCCESS, payload: action.payload });
  } catch (err) {
    yield put({ type: types.DELETE_CLASSIFIER_FAILURE, err });
  }
}

export function* handleDeleteClassifier() {
  yield takeLatest(types.DELETE_CLASSIFIER, deleteClassifierSaga);
}

export default [
  handleFetchClassifiers,
  handleCreateClassifier,
  handleUpdateClassifier,
  handleDeleteClassifier,
];
