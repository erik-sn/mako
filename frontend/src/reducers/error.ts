/* tslint:disable no-duplicate-switch-case */
import { IAction, IErrorReducer } from '../interfaces/redux';
import types from '../sagas/types';
import errors from '../utils/errors';
import { IDjangoErrors, IMap } from '@/interfaces/general';

const GENERAL_ERROR_KEYS: string[] = ['nonFieldErrors'];

export const initialState: IErrorReducer = {
  error: '',
  loginForm: undefined,
  googleSearchForm: undefined,
  imageGroupForm: undefined,
  mergeSearchForm: undefined,
  mergeUploadForm: undefined,
};

function parseErrorKey(errorMessages: IDjangoErrors, key: string): string | string[] {
  try {
    return errorMessages[key][0];
  } catch (e) {
    return errorMessages[key];
  }
}

export const extractErrorMessages = (errorMessages: IDjangoErrors) => {
  const keys = Object.keys(errorMessages);
  return keys.reduce((flatErrors: IMap<string | string[]>, key): IMap<string | string[]> => {
    if (GENERAL_ERROR_KEYS.find(errorKey => errorKey === key)) {
      return { ...flatErrors, general: parseErrorKey(errorMessages, key) };
    }
    flatErrors[key] = parseErrorKey(errorMessages, key);
    return flatErrors;
  }, {});
};

export default (state: IErrorReducer = initialState, action: IAction<any>): IErrorReducer => {
  switch (action.type) {
    case types.APPLICATION_ERROR: {
      return { ...state, error: errors[types.APPLICATION_ERROR] };
    }
    case types.CHECK_STATUS_FAILURE: {
      return { ...state, error: errors[types.CHECK_STATUS_FAILURE] };
    }
    case types.GET_AUTH_TOKEN_FAILURE: {
      return { ...state, loginForm: extractErrorMessages(action.payload) };
    }
    case types.GET_AUTH_TOKEN_SUCCESS: {
      return { ...state, loginForm: undefined };
    }
    case types.REFRESH_AUTH_TOKEN_FAILURE: {
      return { ...state, error: errors[types.REFRESH_AUTH_TOKEN_FAILURE] };
    }
    case types.WEBSOCKET_INITIALIZE_FAILURE: {
      return { ...state, error: errors[types.WEBSOCKET_INITIALIZE_FAILURE] };
    }
    case types.FETCH_CLASSIFIERS_FAILURE: {
      return { ...state, error: errors[types.FETCH_CLASSIFIERS_FAILURE] };
    }
    case types.CREATE_CLASSIFIER_FAILURE: {
      return { ...state, error: errors[types.CREATE_CLASSIFIER_FAILURE] };
    }
    case types.UPDATE_CLASSIFIER_FAILURE: {
      return { ...state, error: errors[types.UPDATE_CLASSIFIER_FAILURE] };
    }
    case types.CLEAR_ERRORS: {
      return { ...state, error: '' };
    }

    // form errors
    // google search
    case types.CREATE_GOOGLE_SEARCH_FAILURE: {
      return { ...state, googleSearchForm: extractErrorMessages(action.payload) };
    }
    case types.CREATE_GOOGLE_SEARCH_COMPLETE:
    case types.UPDATE_GOOGLE_SEARCH_LOG: {
      return { ...state, googleSearchForm: undefined };
    }

    // merge google search
    case types.MERGE_GOOGLE_SEARCHES_FAILURE: {
      return { ...state, mergeSearchForm: extractErrorMessages(action.payload) };
    }
    case types.MERGE_GOOGLE_SEARCHES_SUCCESS:
    case types.MERGE_GOOGLE_SEARCHES:
    case types.UPDATE_GOOGLE_SEARCH_LOG: {
      return { ...state, mergeSearchForm: undefined };
    }

    // merge upload events
    case types.MERGE_UPLOAD_EVENTS_FAILURE: {
      return { ...state, mergeUploadForm: extractErrorMessages(action.payload) };
    }
    case types.MERGE_UPLOAD_EVENTS_SUCCESS:
    case types.MERGE_UPLOAD_EVENTS: {
      return { ...state, mergeSearchForm: undefined };
    }

    // image groups
    case types.imageGroups.createFailure: {
      return { ...state, imageGroupForm: extractErrorMessages(action.payload) };
    }
    case types.imageGroups.create:
    case types.imageGroups.createSuccess: {
      return { ...state, imageGroupForm: undefined };
    }

    default:
      return state;
  }
};
