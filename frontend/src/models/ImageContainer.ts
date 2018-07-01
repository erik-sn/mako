import { IImage } from '@/models/GoogleSearch';

class ImageContainer {
  public id: number;
  public images: IImage[];
  public imageCount: number;

  public downloadImages(): void {}
}

export default ImageContainer;
