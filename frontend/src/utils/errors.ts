import types from '../sagas/types';

const ERROR_MESSAGES = {
  [types.GET_AUTH_TOKEN_FAILURE]: `There was an error logging in, please try again,
  please try again or contact an administrator`,
  [types.REFRESH_AUTH_TOKEN_FAILURE]: `There was an error authenticating, please try again or contact an administrator`,
  [types.CHECK_STATUS_FAILURE]: `There was an error connecting to the API - please
  contact the administrator`,
  [types.WEBSOCKET_INITIALIZE_FAILURE]: `There was an error initiating a websocket
  connection - please contact the administrator`,
  [types.APPLICATION_ERROR]: `Something went wrong! Please refresh your browser
  and try again, or contact an administrator`,
  [types.FETCH_CLASSIFIERS_FAILURE]: 'There was an error retrieving classifiers',
  [types.CREATE_CLASSIFIER_FAILURE]: 'There was an error creating the classifier',
  [types.UPDATE_CLASSIFIER_FAILURE]: 'There was an error updating the classifier',
  [types.DELETE_CLASSIFIER_FAILURE]: 'There was an error deleting the classifier',
  [types.googleSearch.retrieveFailure]: 'There was an error retrieving the image search details',
  [types.MERGE_GOOGLE_SEARCHES_FAILURE]: 'There was an error merging the google image searches',
};

export default ERROR_MESSAGES;
