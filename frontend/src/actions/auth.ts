import types from '../sagas/types';
import { IAction } from '../interfaces/redux';

export const getAuthToken = (username: string, password: string): IAction<{}> => {
  return { type: types.GET_AUTH_TOKEN, payload: { username, password } };
};

export const refreshAuthToken = (token: string): IAction<string> => {
  return { type: types.REFRESH_AUTH_TOKEN, payload: token };
};

export const clearAuthToken = (): IAction<null> => {
  return { type: types.CLEAR_AUTH_TOKEN, payload: null };
};
