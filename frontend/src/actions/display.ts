import { IAction } from '../interfaces/redux';
import types from '../sagas/types';

export const applicationError = (stack: string): IAction<string> => ({
  type: types.APPLICATION_ERROR,
  payload: stack,
});

export const clearErrors = (): IAction<null> => ({
  type: types.CLEAR_ERRORS,
  payload: null,
});

export const initializeWebsocket = (): IAction<null> => ({
  type: types.WEBSOCKET_INITIALIZE,
  payload: null,
});

export const initializeAsyncWebsocket = (): IAction<null> => ({
  type: types.WEBSOCKET_ASYNC_INITIALIZE,
  payload: null,
});

export const checkApiStatus = (): IAction<null> => ({
  type: types.CHECK_STATUS,
  payload: null,
});

export const showTransitionLoader = (): IAction<null> => ({
  type: types.SHOW_TRANSITION_LOADER,
  payload: null,
});

export const hideTransitionLoader = (): IAction<null> => ({
  type: types.HIDE_TRANSITION_LOADER,
  payload: null,
});

export const setHeaderText = (title: string): IAction<{}> => ({
  type: types.SET_HEADER_TEXT,
  payload: { title },
});

export const clearHeaderText = (): IAction<null> => ({
  type: types.CLEAR_HEADER_TEXT,
  payload: null,
});

export const showModal = (modal: JSX.Element): IAction<JSX.Element> => ({
  type: types.SHOW_MODAL,
  payload: modal,
});

export const hideModal = (): IAction<null> => ({
  type: types.HIDE_MODAL,
  payload: null,
});

export const resetLastCreatedId = (): IAction<null> => ({
  type: types.RESET_LAST_CREATED_ID,
  payload: null,
});
