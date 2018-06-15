import Classifier from '../models/Classifier';
import GoogleSearch from '../models/GoogleSearch';
import User from '@/models/User';

export interface IGlobalReducer {
  webSocketConnection: WebSocket;
  asyncWebSocketConnection: WebSocket;
}

export interface IAuthReducer {
  user: User;
}

export interface IDisplayReducer {
  modal: JSX.Element;
  infoTitle: string;
  lastCreatedId: number;
}

export interface IErrorReducer {
  error: string;
  loginForm: { name?: string };
  googleSearchForm: { name?: string; url?: string; newSearch?: boolean };
  imageGroupForm: { name?: string };
  mergeSearchForm: { name?: string };
  mergeUploadForm: { name?: string };
}

export interface ILoaderReducer {
  fetchGoogleSearch: boolean;
  createGoogleSearch: boolean;
  createImageGroup: boolean;
  mergeGoogleSearches: boolean;
  mergeUploadEvents: boolean;
  login: boolean;
}

export interface IGoogleReducer {
  googleSearches: GoogleSearch[];
  websocketLog: string;
  activeSearchId: number;
}

export interface IWebsocketReducer {
  googleSearch: WebSocket;
}

export interface IClassifierReducer {
  classifiers: Classifier[];
  activeClassifier: Classifier | undefined;
}

export interface IStore {
  classifiers: IClassifierReducer;
  google: IGoogleReducer;
  global: IGlobalReducer;
  display: IDisplayReducer;
  loaders: ILoaderReducer;
  errors: IErrorReducer;
  auth: IAuthReducer;
}

export interface IAction<P> {
  type: string;
  payload: P;
  meta?: any;
  error?: boolean;
}
