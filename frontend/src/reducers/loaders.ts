import { IAction, ILoaderReducer } from '../interfaces/redux';
import types from '../sagas/types';

export const initialState: ILoaderReducer = {
  fetchGoogleSearch: false,
  createGoogleSearch: false,
  mergeGoogleSearches: false,
  mergeUploadEvents: false,
  createImageGroup: false,
  login: false,
};

export default (state: ILoaderReducer = initialState, action: IAction<any>): ILoaderReducer => {
  switch (action.type) {
    case types.googleSearch.fetch: {
      return { ...state, fetchGoogleSearch: true };
    }
    case types.googleSearch.fetchSuccess:
    case types.googleSearch.fetchFailure: {
      return { ...state, fetchGoogleSearch: false };
    }

    case types.imageGroups.create: {
      return { ...state, createImageGroup: true };
    }
    case types.imageGroups.createSuccess:
    case types.imageGroups.createFailure: {
      return { ...state, createImageGroup: false };
    }

    // google searches
    case types.MERGE_GOOGLE_SEARCHES: {
      return { ...state, mergeGoogleSearches: true };
    }
    case types.MERGE_GOOGLE_SEARCHES_SUCCESS:
    case types.MERGE_GOOGLE_SEARCHES_FAILURE: {
      return { ...state, mergeGoogleSearches: false };
    }

    // upload events
    case types.MERGE_UPLOAD_EVENTS: {
      return { ...state, mergeUploadEvents: true };
    }
    case types.MERGE_UPLOAD_EVENTS_SUCCESS:
    case types.MERGE_UPLOAD_EVENTS_FAILURE: {
      return { ...state, mergeUploadEvents: false };
    }

    case types.googleSearch.createSuccess: {
      return { ...state, createGoogleSearch: true };
    }
    case types.REFRESH_AUTH_TOKEN:
    case types.GET_AUTH_TOKEN:
      return { ...state, login: true };
    case types.REFRESH_AUTH_TOKEN_SUCCESS:
    case types.REFRESH_AUTH_TOKEN_FAILURE:
    case types.GET_AUTH_TOKEN_SUCCESS:
    case types.GET_AUTH_TOKEN_FAILURE:
      return { ...state, login: false };
    case types.WEBSOCKET_GENERIC_ERROR:
    case types.googleSearch.createFailure:
    case types.CREATE_GOOGLE_SEARCH_COMPLETE: {
      return { ...state, createGoogleSearch: false };
    }
    default:
      return state;
  }
};
