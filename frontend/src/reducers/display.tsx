import * as React from 'react';
import { IAction, IDisplayReducer } from '../interfaces/redux';
import types from '../sagas/types';

export const initialState: IDisplayReducer = {
  modal: <div />,
  infoTitle: '',
  lastCreatedId: undefined,
};

export default (state: IDisplayReducer = initialState, action: IAction<any>): IDisplayReducer => {
  switch (action.type) {
    case types.SHOW_MODAL: {
      return {
        ...state,
        modal: action.payload,
      };
    }
    case types.HIDE_MODAL: {
      return { ...state, modal: initialState.modal };
    }
    case types.SET_HEADER_TEXT: {
      const { title } = action.payload;
      return { ...state, infoTitle: title };
    }
    case types.CLEAR_HEADER_TEXT: {
      return { ...state, infoTitle: '' };
    }
    case types.RESET_LAST_CREATED_ID: {
      return { ...state, lastCreatedId: null };
    }
    case types.googleSearch.createSuccess: {
      return { ...state, lastCreatedId: action.payload.id };
    }
    default:
      return state;
  }
};
