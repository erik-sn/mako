interface IClassifier {
  id: number;
  name: string;
  description: string;
  imageGroups: any[];
}

class Classifier {
  public id: number;
  public name: string;
  public description: string;
  public imageGroups: any[];

  constructor({ id, name, description, imageGroups }: IClassifier) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageGroups = imageGroups;
  }
}

export default Classifier;
