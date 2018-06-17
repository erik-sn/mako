import React, { Component } from 'react';

import api from '@/utils/api';
import ImageGroup from '@/models/ImageGroup';
import HeaderError from '@/components/generic/HeaderError';

interface IState {
  imageGroups: ImageGroup[];
  error: boolean;
}

class ImageGroups extends Component<{}, IState> {
  public state: IState = {
    imageGroups: undefined,
    error: false,
  };

  public componentDidMount() {
    api
      .fetchImageGroups()
      .then((response: any) => {
        this.setState({
          imageGroups: response.data.map((imageGroup: any) => new ImageGroup(imageGroup)),
        });
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  public render(): JSX.Element {
    const { error, imageGroups } = this.state;
    if (error) {
      return <HeaderError text="Error loading image groups" />;
    }
    return <h1>Image Groups</h1>;
  }
}

export default ImageGroups;
