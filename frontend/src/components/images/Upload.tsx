import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

import api from '@/utils/api';
import UploadEvent, { IUploadEvent } from '@/models/UploadEvent';
import ImageUploader from './ImageUploader';
import MergeUploadForm from '@/components/forms/MergeUploadForm';
import { IStore } from '@/interfaces/redux';
import Loader from '@/components/generic/Loader';
import UploadItem from '@/components/images/UploadItem';
import InlineError from '@/components/generic/InlineError';

const styles = withStyles<any>(() => ({
  infoContainer: {
    marginTop: '15px',
  },
  infoText: {
    fontSize: '1rem',
  },
  mergeContainer: {
    flexFlow: 'column nowrap',
  },
}));

interface IProps {
  classes: any;
  mergeLoading: any;
  mergeError: any;
}

interface IState {
  mergeSuccess: boolean;
  uploads: UploadEvent[];
  uploadsToMerge: UploadEvent[];
  loadingUploadEvents: boolean;
  getUploadEventsError: any;
}

class Upload extends Component<IProps, IState> {
  public state: IState = {
    mergeSuccess: false,
    uploads: undefined,
    uploadsToMerge: [],
    loadingUploadEvents: true,
    getUploadEventsError: false,
  };

  private get totalImages() {
    return this.state.uploadsToMerge.reduce((count, upload) => {
      return count + upload.imageCount;
    }, 0);
  }

  public componentDidMount() {
    this.getUploadEvents();
  }

  public componentWillReceiveProps(nextProps: IProps): void {
    // we succesfully merged uploads into an image group
    if (this.props.mergeLoading && !nextProps.mergeLoading && !nextProps.mergeError) {
      this.setState({ mergeSuccess: true, uploadsToMerge: [] }, () => {
        this.getUploadEvents();
      });
    }
  }

  private getUploadEvents = () => {
    this.setState({ loadingUploadEvents: true });
    api
      .fetchUploadEvents()
      .then((response: any) => {
        this.setState({
          uploads: response.data.map((u: IUploadEvent) => new UploadEvent(u)),
          loadingUploadEvents: false,
          getUploadEventsError: false,
          uploadsToMerge: [],
        });
      })
      .catch((error: any) => {
        this.setState({ getUploadEventsError: error, loadingUploadEvents: false });
      });
  };

  private addUploadToMerge = (id: number) => {
    const { uploads, uploadsToMerge } = this.state;
    const exists = uploadsToMerge.some(upload => upload.id === id);
    if (exists) {
      const filtered = uploadsToMerge.filter(upload => upload.id !== id);
      this.setState({ uploadsToMerge: filtered });
    } else {
      const matchingUpload = uploads.find(upload => upload.id === id);
      this.setState({
        uploadsToMerge: uploadsToMerge.concat([matchingUpload]),
      });
    }
  };

  private closeSnackbar = () => {
    this.setState({ mergeSuccess: false });
  };

  public render(): JSX.Element {
    const { classes } = this.props;
    const { uploadsToMerge, loadingUploadEvents, uploads, getUploadEventsError } = this.state;
    return (
      <React.Fragment>
        <ExpansionPanel defaultExpanded={false}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Upload images</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Drag & drop zip or gzip directories of images from your file system here to upload,
              categorize and create image groups.
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <ImageUploader onSuccess={this.getUploadEvents} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Create image group from image uploads</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Select the upload events below that you want to merge into an image group.
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails className={classes.mergeContainer}>
            <Typography
              variant="display1"
              className={`${classes.infoText} ${classes.infoContainer}`}
            >
              Selected upload events: {uploadsToMerge.length}
            </Typography>
            <Typography
              variant="display1"
              className={`${classes.infoText} ${classes.infoContainer}`}
            >
              Total images: {this.totalImages}
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            {this.totalImages > 0 && <MergeUploadForm uploadEvents={uploadsToMerge} />}
          </ExpansionPanelDetails>
          <ExpansionPanelDetails className={classes.mergeContainer}>
            {loadingUploadEvents ? (
              <Loader marginTop="0px" size={50} />
            ) : (
              (uploads || []).map(upload => (
                <UploadItem
                  key={upload.id}
                  upload={upload}
                  addUploadToMerge={this.addUploadToMerge}
                  isAdded={uploadsToMerge.some(u => u.id === upload.id)}
                  refresh={this.getUploadEvents}
                />
              ))
            )}
            {getUploadEventsError && (
              <InlineError text="Could not retrieve upload events - contact an administrator" />
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.mergeSuccess}
          autoHideDuration={6000}
          onClose={this.closeSnackbar}
          message={<span id="merge-success">Uploads successfully merged into an image group</span>}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  mergeLoading: state.loaders.mergeUploadEvents,
  mergeError: state.errors.mergeUploadForm,
});

export default styles<any>(connect<any>(mapStateToProps)(Upload));
