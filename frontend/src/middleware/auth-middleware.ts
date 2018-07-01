import axios from 'axios';

import types, { ACCESS_TOKEN, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRATION } from '../sagas/types';

/**
 * store the user authentication token in the API
 * and set it as the default Authoriation header
 * in axios
 * @param {string} token
 */
export function setAuthorizationHeader(
  accessToken: string,
  refreshToken: string,
  refreshExpiration: string,
): void {
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
  localStorage.setItem(REFRESH_TOKEN_EXPIRATION, refreshExpiration);
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

/**
 * Remove the token from localStorage and the axios
 * default header
 */
export function clearAuthorizationHeader(): void {
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRATION);
  axios.defaults.headers.common = {};
}

/**
 * Middleware listening on any actions pertaining to authentication
 * or interaction with the API
 */
const AuthMiddleware = (): any => (next: any) => (action: any) => {
  // coming from the async action hitting the user endpoint
  if (
    action.type === types.GET_AUTH_TOKEN_SUCCESS ||
    action.type === types.REFRESH_AUTH_TOKEN_SUCCESS
  ) {
    const { access, refresh, refreshExpiration } = action.payload;
    setAuthorizationHeader(access, refresh, refreshExpiration);
  }
  // coming from localStorage
  // if (action.type === types.REHYDRATE_AUTH_TOKEN) {
  //   setAuthorizationHeader(action.payload);
  // }
  // if (action.type === ACTIONS.CLEAR_AUTH_TOKEN) {
  //   clearAuthorizationHeader();
  // }
  next(action);
};

export default AuthMiddleware;
