import { DateTime } from 'luxon';

export interface ILoginRecord {
  ipAddress: string;
  userAgent: string;
  created: string;
}

class LoginRecord {
  public created: DateTime;
  public createdStr: string;
  public userAgent: string;
  public ipAddress: string;

  constructor({ created, ipAddress, userAgent }: ILoginRecord) {
    this.created = DateTime.fromISO(created, { zone: 'utc' });
    this.createdStr = this.created.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
  }
}

export default LoginRecord;
