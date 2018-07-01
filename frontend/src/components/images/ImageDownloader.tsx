import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import Tooltip from '@material-ui/core/Tooltip';

import ImageContainer from '@/models/ImageContainer';

interface IProps { model: ImageContainer; }
interface IState { error: boolean; }

class ImageDownloader extends Component<IProps, IState> {
  public state = {
    error: false,
  };

  private handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.model.downloadImages();
  }

  public render(): JSX.Element {
    const { model } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <Tooltip id="tooltip-download" title="Error downloading images">
          <IconButton >
            <ErrorIcon />
          </IconButton>
        </Tooltip>
      )
    }
    return (
      <Tooltip id="tooltip-download" title={`Download ${model.imageCount} images`}>
        <IconButton
          onClick={this.handleDownload}
          aria-label="Download images"
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    )
  }
}

export default ImageDownloader;
