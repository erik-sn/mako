export interface IImageGroup {
  id?: number;
  name: string;
  description: string;
  images: string[];
}

class ImageGroup {
  public id: number;
  public name: string;
  public description: string;
  public images: string[];

  constructor({ id, name, description, images }: IImageGroup) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
  }
}

export default ImageGroup;
