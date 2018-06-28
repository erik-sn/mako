import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ErrorIcon from '@material-ui/icons/ErrorOutline';

import GoogleSearch from '@/models/GoogleSearch';
import UploadEvent from '@/models/UploadEvent';
import Tooltip from '@material-ui/core/Tooltip';
import Loader from '@/components/generic/Loader';

interface IProps { model: GoogleSearch | UploadEvent; }
interface IState { loading: boolean; error: boolean; }

class ImageDownloader extends Component<IProps, IState> {
  public state = {
    loading: false,
    error: false,
  };

  private handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.model.downloadImages();
  }

  public render(): JSX.Element {
    const { model } = this.props;
    const { loading, error } = this.state;
    if (error) {
      return (
        <Tooltip id="tooltip-download" title="Error downloading images">
          <IconButton >
            <ErrorIcon />
          </IconButton>
        </Tooltip>
      )
    }
    if (loading) {
      return (
        <Tooltip id="tooltip-download" title="Downloading images" >
          <IconButton>
            <Loader size={25} marginTop="0px" marginLeft="15px" />
          </IconButton>
        </Tooltip>
      );
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
