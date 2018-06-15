import { DateTime } from 'luxon';

import LoginRecord, { ILoginRecord } from './LoginRecord';

export interface IUser {
  access: string;
  refresh: string;
  accessExpiration: string;
  refreshExpiration: string;
  username?: string;
  email?: string;
  isSuperuser?: boolean;
  lastLogin?: string;
  dateJoined?: string;
  loginRecords?: ILoginRecord[];
}

class User {
  public accessToken: string;
  public refreshToken: string;
  private accessExpirationStr: string;
  public accessExpiration: DateTime;
  private refreshExpirationStr: string;
  public refreshExpiration: DateTime;
  public username: string;
  public email: string;
  public isSuperuser: boolean;
  public lastLogin: DateTime;
  private lastLoginStr: string;
  public dateJoined: DateTime;
  public dateJoinedStr: string;
  public loginRecords: LoginRecord[];

  constructor({
    access,
    refresh,
    accessExpiration,
    refreshExpiration,
    username,
    email,
    isSuperuser,
    lastLogin,
    dateJoined,
    loginRecords,
  }: IUser) {
    this.accessToken = access;
    this.refreshToken = refresh;
    this.accessExpirationStr = accessExpiration;
    this.refreshExpirationStr = refreshExpiration;
    this.accessExpiration = DateTime.fromISO(accessExpiration, { zone: 'utc' });
    this.refreshExpiration = DateTime.fromISO(refreshExpiration, { zone: 'utc' });
    this.username = username;
    this.email = email;
    this.isSuperuser = isSuperuser;
    this.lastLogin = DateTime.fromISO(lastLogin, { zone: 'utc' });
    this.lastLoginStr = this.lastLogin.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
    this.dateJoined = DateTime.fromISO(dateJoined, { zone: 'utc' });
    this.dateJoinedStr = this.dateJoined.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
    this.loginRecords = loginRecords.map(login => new LoginRecord(login));
  }

  public tokenExpiresSoon(): boolean {
    return this.accessExpiration && this.accessExpiration.diffNow('minute').minutes < 15;
  }
}

export default User;
