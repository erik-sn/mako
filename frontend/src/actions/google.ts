import types from '../sagas/types';
import { IAction } from '../interfaces/redux';
import GoogleSearch from '@/models/GoogleSearch';

export const resetWebsocketLog = (): IAction<null> => ({
  type: types.RESET_GOOGLE_SEARCH_WEBSOCKET_LOG,
  payload: null,
});

export const mergeGoogleSearches = (json: any): IAction<any> => {
  return {
    type: types.MERGE_GOOGLE_SEARCHES,
    payload: json,
  };
};
