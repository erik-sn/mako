import { DateTime } from 'luxon';

import api from '@/utils/api';
import ImageContainer from '@/models/ImageContainer';

export interface IImage {
  name: string;
  included: boolean;
  sourceUrl: string;
}

export interface IGoogleSearch {
  id: number;
  name: string;
  description: string;
  url: string;
  log: string;
  images: IImage[];
  imageCount: number;
  includedImageCount: number;
  created: string;
  lastUpdated: string;
}

class GoogleSearch extends ImageContainer {
  public id: number;
  public name: string;
  public description: string;
  public url: string;
  public log: string;
  public images: IImage[];
  public imageCount: number;
  public includedImageCount: number;
  public created: DateTime;
  public createdStr: string;
  public lastUpdated: DateTime;
  public lastUpdatedStr: string;

  constructor({
    id,
    name,
    description,
    url,
    log,
    images,
    imageCount,
    includedImageCount,
    created,
    lastUpdated,
  }: IGoogleSearch) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
    this.log = log;
    this.images = images;
    this.imageCount = images ? images.length : imageCount;
    this.includedImageCount = includedImageCount;
    this.created = DateTime.fromISO(created);
    this.createdStr = this.created.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
    this.lastUpdated = DateTime.fromISO(lastUpdated);
    this.lastUpdatedStr = this.lastUpdated.toLocal().toLocaleString(DateTime.DATETIME_SHORT);
  }

  public downloadImages(): void {
    return api.downloadImages('google_searches', this.id);
  }
}

export default GoogleSearch;
