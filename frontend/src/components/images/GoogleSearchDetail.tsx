import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DialogContentText from '@material-ui/core/DialogContentText';
import { AxiosResponse, AxiosError } from 'axios';

import api from '@/utils/api';
import GoogleSearch, { IImage } from '@/models/GoogleSearch';
import Loader from '@/components/generic/Loader';
import Dialog from '@/components/generic/Dialog';
import ImageList from './ImageList';
import ImageDownloader from './ImageDownloader';
import DownloadIcon from '@material-ui/icons/CloudDownload';

const styles = withStyles<any>((theme: any) => ({
  button: {
    margin: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
  },
  panel: {},
  heading: {
    fontSize: theme.typography.pxToRem(18),
  },
  details: {
    padding: '8px 24px',
    wordBreak: 'break-word',
  },
  images: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
  },
  downloadIcon: {
    position: 'absolute',
    top: '10px',
    left: '80px',
  },
}));

interface IProps {
  getDetail: (id: number) => void;
  match: {
    params: {
      redirect?: string;
      id: string;
    };
  };
  classes: any;
  websocketLog: string;
}

interface IState {
  search: GoogleSearch;
  error: AxiosError;
  height: number;
  imagesExpanded: boolean;
}

class GoogleSearchDetail extends Component<IProps, IState> {
  public state: IState = {
    search: undefined,
    error: undefined,
    height: undefined,
    imagesExpanded: true,
  };

  public componentDidMount(): void {
    const { id } = this.props.match.params;
    api
      .retrieveGoogleSearch(id)
      .then((response: AxiosResponse) => {
        this.setState({ search: new GoogleSearch(response.data) });
      })
      .catch((error: AxiosError) => {
        this.setState({ error });
      });
  }

  private toggleShowImagePanel = (e: React.ChangeEvent<{}>, expanded: boolean) => {
    e.preventDefault();
    this.setState({ imagesExpanded: expanded });
  }

  public render(): JSX.Element {
    const { classes, match } = this.props;
    const { search, error, imagesExpanded } = this.state;
    if (error) {
      return (
        <Dialog
          title="API Error"
          content={
            <DialogContentText id="alert-dialog-description">
              Could not load the image search detail - please contact the administrator or reload
              the page
            </DialogContentText>
          }
        />
      );
    }
    if (!search) {
      return (
        <React.Fragment>
          <Loader label="Loading google search results..." />
          <ul id="search_detail__image-list" />
        </React.Fragment>
      );
    }
    const { name, created, description, url, log, images } = search;
    const redirected = match.params.redirect !== undefined;
    return (
      <React.Fragment>
        <ExpansionPanel defaultExpanded={!redirected}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Details for {name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Typography variant="body1">
              <h5>Created:</h5> {created.toFormat('yyyy-mm-dd hh:mm')}
            </Typography>
          </ExpansionPanelDetails>
          {description && (
            <ExpansionPanelDetails className={classes.details}>
              <Typography variant="body1">
                <h5>Description:</h5> {description}
              </Typography>
            </ExpansionPanelDetails>
          )}
          <ExpansionPanelDetails className={`${classes.details} ${classes.panel}`}>
            <Typography variant="body1">
              <h5>URL:</h5>
              {url}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel className={classes.panel} defaultExpanded={redirected}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Log</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={`${classes.details} ${classes.panel}`}>
            <pre>{log}</pre>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel className={classes.panel} defaultExpanded={!redirected} onChange={this.toggleShowImagePanel} >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Images</Typography>
          </ExpansionPanelSummary>
          {imagesExpanded && (
            <div className={classes.downloadIcon}>
              <ImageDownloader model={search} />
            </div>
          )}
          <ImageList images={images} />
        </ExpansionPanel>
      </React.Fragment>
    );
  }
}

export default styles<any>(GoogleSearchDetail);
