import { IAction, IGlobalReducer } from '../interfaces/redux';
import types from '../sagas/types';

export const initialState: IGlobalReducer = {
  webSocketConnection: undefined,
  asyncWebSocketConnection: undefined,
};

export default (state: IGlobalReducer = initialState, action: IAction<any>): IGlobalReducer => {
  switch (action.type) {
    case types.WEBSOCKET_INITIALIZE_SUCCESS: {
      return { ...state, webSocketConnection: action.payload };
    }
    case types.WEBSOCKET_CLOSED: {
      return { ...state, webSocketConnection: undefined };
    }
    case types.WEBSOCKET_ASYNC_INITIALIZE_SUCCESS: {
      return { ...state, asyncWebSocketConnection: action.payload };
    }
    case types.WEBSOCKET_ASYNC_CLOSED: {
      return { ...state, asyncWebSocketConnection: undefined };
    }
    default:
      return state;
  }
};
