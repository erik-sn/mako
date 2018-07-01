import { DateTime } from 'luxon';

import api from '@/utils/api';
import { IImage } from '@/models/GoogleSearch';

export interface IUploadEvent {
  id: number;
  images: IImage[];
  imageCount: number;
  includedImageCount: number;
  created: string;
  lastUpdated: string;
}

class UploadEvent {
  public id: number;
  public name: string;
  public images: IImage[];
  public imageCount: number;
  public includedImageCount: number;
  public created: DateTime;
  public createdStr: string;
  public lastUpdated: DateTime;
  public lastUpdatedStr: string;

  constructor({ id, images, imageCount, includedImageCount, created, lastUpdated }: IUploadEvent) {
    this.id = id;
    this.images = images;
    this.imageCount = images ? images.length : imageCount;
    this.includedImageCount = includedImageCount;
    this.created = DateTime.fromISO(created);
    this.createdStr = this.created.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
    this.lastUpdated = DateTime.fromISO(lastUpdated);
    this.lastUpdatedStr = this.lastUpdated.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
  }

  public downloadImages(): void {
    return api.downloadImages('upload_events', this.id);
  }
}

export default UploadEvent;
