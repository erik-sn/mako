import { IAction, IAuthReducer } from '../interfaces/redux';
import types from '../sagas/types';
import User from '@/models/User';

export const initialState: IAuthReducer = {
  user: undefined,
};

export default (state: IAuthReducer = initialState, action: IAction<any>): IAuthReducer => {
  switch (action.type) {
    case types.REFRESH_AUTH_TOKEN_SUCCESS:
    case types.GET_AUTH_TOKEN_SUCCESS: {
      return { ...state, user: new User(action.payload) };
    }
    case types.CLEAR_AUTH_TOKEN: {
      return { ...state, user: undefined };
    }
    default:
      return state;
  }
};
