import { all, fork } from 'redux-saga/effects';

import genericSagas from './generic';
import classifierSagas from './classifiers';
import googleSearchSagas from './googlesearches';
import uploadEventSagas from './upload-events';
import imageGroupSagas from './image-group';
import userSagas from './user';

const sagas = [
  ...genericSagas,
  ...classifierSagas,
  ...googleSearchSagas,
  ...uploadEventSagas,
  ...imageGroupSagas,
  ...userSagas,
];

export default function* root() {
  yield all(sagas.map(saga => fork(saga)));
}
