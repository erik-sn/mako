import { DateTime } from 'luxon';

import api from '@/utils/api';
import ImageContainer from '@/models/ImageContainer';
import { IImage } from '@/models/GoogleSearch';

export interface IImageGroup {
  id?: number;
  name: string;
  description: string;
  images: IImage[];
  imageCount?: number;
  includedImageCount: number;
  created: string;
  lastUpdated: string;
}

class ImageGroup extends ImageContainer {
  public id: number;
  public name: string;
  public description: string;
  public images: IImage[];
  public imageCount: number;
  public includedImageCount: number;
  public created: DateTime;
  public createdStr: string;
  public lastUpdated: DateTime;
  public lastUpdatedStr: string;

  constructor({ id, name, description, images, imageCount, includedImageCount, created, lastUpdated }: IImageGroup) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
    this.imageCount = imageCount;
    this.imageCount = images ? images.length : imageCount;
    this.includedImageCount = includedImageCount;
    this.created = DateTime.fromISO(created);
    this.createdStr = this.created.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
    this.lastUpdated = DateTime.fromISO(lastUpdated);
    this.lastUpdatedStr = this.lastUpdated.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
  }

  public downloadImages(): void {
    return api.downloadImages('image_groups', this.id);
  }
}

export default ImageGroup;
