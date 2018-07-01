import React, { Component } from 'react';
import axios from 'axios';
import Dropzone, { ImageFile } from 'react-dropzone';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import Attachment from '@material-ui/icons/Attachment';
import Snackbar from '@material-ui/core/Snackbar';

import Info from '@/components/generic/Info';
import { API } from '@/sagas/types';
import Loader from '@/components/generic/Loader';

const styles = withStyles<any>((theme: any) => ({
  root: {
    position: 'relative',
    width: '100%',
  },
  info: {
    position: 'absolute',
    right: '-15px',
    top: '-30px',
  },
  dropzone: {
    width: 'calc(100% - 75px)',
    height: '300px',
    border: '4px solid #999',
    borderStyle: 'dashed',
    borderRadius: '5px',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '25px',
    transition: 'border 0.35s ease-in-out, height 0.35s ease-in-out',
  },
  dropzoneActive: {
    border: '2px solid #999',
    borderRadius: '2px',
    height: '200px',
  },
  loader: {
    marginTop: '0px',
  },
  error: {
    borderColor: 'red',
    color: 'red',
  },
  prompt: {
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing.unit,
  },
  buttons: {
    transition: '0.35s ease-in-out',
  },
  buttonsActive: {
    opacity: 1,
    height: '60px',
  },
  buttonsHidden: {
    opacity: 0,
    height: '0px',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  attachmentIcon: {
    fontSize: '48px',
    marginRight: '15px',
  },
  infoCode: {
    padding: '25px 0px',
    textAlign: 'center',
  },
  success: {
    padding: '15px 0px',
    textAlign: 'center',
  },
}));

interface IProps {
  classes?: any;
  onSuccess: () => void;
}

interface IState {
  error: string;
  httpRequest: any;
  uploadedFile: any;
  uploading: boolean;
  success: boolean;
}

class ImageUploader extends Component<IProps, {}> {
  public state: IState = {
    error: '',
    httpRequest: undefined,
    uploadedFile: undefined,
    uploading: false,
    success: false,
  };

  private validContentType(fileType: string): boolean {
    switch (fileType) {
      case 'application/zip':
      case 'application/gzip':
        return true;
      default:
        return false;
    }
  }

  private validateFile(uploadedFile: ImageFile): void {
    const extension = uploadedFile.name.split('.').pop();
    if (this.validContentType(uploadedFile.type)) {
      this.setState({ uploadedFile, error: '', success: false });
    } else {
      this.setState({
        error: 'Invalid file - compressed file required',
        uploadedFile: undefined,
        success: false,
      });
    }
  }

  private handleClearFile = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ uploadedFile: undefined, error: '', success: false });
  };

  private handleDrop = (acceptedFiles: ImageFile[]) => {
    this.validateFile(acceptedFiles[0]);
  };

  private handleSubmit = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.state.uploadedFile);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const url = `${API}/upload_events/`;

    this.setState({ uploading: true, httpRequest: source });

    axios
      .post(url, data, { cancelToken: source.token })
      .then(() => {
        this.setState(
          {
            error: '',
            httpRequest: undefined,
            uploading: false,
            uploadedFile: undefined,
            success: true,
          },
          () => this.props.onSuccess(),
        );
      })
      .catch((err: any) => {
        if (axios.isCancel(err)) {
          return;
        }
        this.setState({
          error: 'Error uploading images',
          httpRequest: undefined,
          uploading: false,
        });
      });
  };

  private chooseMessage() {
    const { uploadedFile, error } = this.state;
    if (error) {
      return error;
    } else if (uploadedFile) {
      return uploadedFile.name;
    }
    return 'Click here or drop a tar.gz file containing your images here';
  }

  private closeSnackbar = () => {
    this.setState({ success: false });
  };

  public render(): JSX.Element {
    const { error, uploadedFile, uploading, success } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Info className={classes.info} title="Uploading Compressed Files">
          <div>
            This uploader is expecting a compressed directory (.zip, .tar.gz, .gz) of images - they can be of
            any standard image format. To compress a directory you can run the following command in
            a terminal:
            <div className={classes.infoCode}>tar -zcvf compressed.tar.gz **your directory**</div>
            <a
              href="https://www.cyberciti.biz/faq/how-do-i-compress-a-whole-linux-or-unix-directory/"
              target="_blank"
            >
              Further information about compressing files can be found here
            </a>
          </div>
        </Info>
        <Dropzone
          className={`${classes.dropzone} ${error ? classes.error : ''} ${
            uploadedFile ? classes.dropzoneActive : ''
          }`}
          onDrop={this.handleDrop}
        >
          {uploadedFile &&
            !uploading && <Attachment color="inherit" className={classes.attachmentIcon} />}
          {!uploading ? (
            <Typography
              variant="display1"
              className={classes.prompt}
              color={uploadedFile ? 'inherit' : 'default'}
            >
              {this.chooseMessage()}
            </Typography>
          ) : (
            <Loader size={75} marginTop="0px" />
          )}
        </Dropzone>
        <div
          className={`${classes.buttons} ${
            uploadedFile ? classes.buttonsActive : classes.buttonsHidden
          }`}
        >
          <Button
            className={classes.button}
            variant="raised"
            color="primary"
            onClick={this.handleSubmit}
          >
            <FileUploadIcon className={classes.leftIcon} />
            Upload
          </Button>
          <Button
            className={classes.button}
            variant="raised"
            color="default"
            onClick={this.handleClearFile}
          >
            <CancelIcon className={classes.leftIcon} />
            Cancel
          </Button>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={success}
          autoHideDuration={6000}
          onClose={this.closeSnackbar}
          message={<span id="merge-success">Successfully uploaded images</span>}
        />
      </div>
    );
  }
}

export default styles<any>(ImageUploader);
