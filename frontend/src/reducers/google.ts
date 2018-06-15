import { IAction, IGoogleReducer } from '../interfaces/redux';
import GoogleSearch, { IGoogleSearch } from '../models/GoogleSearch';
import types from '../sagas/types';

export const initialState: IGoogleReducer = {
  googleSearches: [],
  websocketLog: '',
  activeSearchId: undefined,
};

export default (state: IGoogleReducer = initialState, action: IAction<any>): IGoogleReducer => {
  switch (action.type) {
    case types.googleSearch.fetchSuccess: {
      return {
        ...state,
        googleSearches: action.payload.map((s: IGoogleSearch) => new GoogleSearch(s)),
      };
    }
    case types.TOGGLE_IMAGE_INCLUDED_SUCCESS: {
      const { data, searchId } = action.payload;
      const updatedSearch = state.googleSearches.find(search => search.id === searchId);
      updatedSearch.images = updatedSearch.images.map(
        image => (image.name === data.name ? data : image),
      );

      return {
        ...state,
        googleSearches: state.googleSearches.map(
          s => (s.id === updatedSearch.id ? updatedSearch : s),
        ),
      };
    }
    case types.googleSearch.createSuccess: {
      return {
        ...state,
        googleSearches: state.googleSearches.concat(new GoogleSearch(action.payload)),
      };
    }
    case types.UPDATE_GOOGLE_SEARCH_LOG: {
      const { id, log } = action.payload;
      return {
        ...state,
        websocketLog: log,
        activeSearchId: id,
      };
    }
    case types.CREATE_GOOGLE_SEARCH_COMPLETE: {
      const updatedSearch = new GoogleSearch(action.payload);
      return {
        ...state,
        googleSearches: state.googleSearches.map(
          s => (s.id === updatedSearch.id ? updatedSearch : s),
        ),
      };
    }
    case types.RESET_GOOGLE_SEARCH_WEBSOCKET_LOG: {
      return {
        ...state,
        websocketLog: '',
        activeSearchId: undefined,
      };
    }
    default:
      return state;
  }
};
