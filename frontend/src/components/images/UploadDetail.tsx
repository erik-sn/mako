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
import Loader from '@/components/generic/Loader';
import Dialog from '@/components/generic/Dialog';
import { IStore } from '@/interfaces/redux';
import Grid from '@/components/generic/Grid';
import Panel from './Panel';
import UploadEvent from '@/models/UploadEvent';

const styles = withStyles<any>((theme: any) => ({
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
  grid: {
    width: '100%',
  },
}));

interface IProps {
  match: {
    params: {
      redirect?: string;
      id: string;
    };
  };
  classes: any;
}

interface IState {
  initialLoad: boolean;
  upload: UploadEvent;
  error: AxiosError;
  height: number;
}

class UploadDetail extends Component<IProps, IState> {
  public state: IState = {
    initialLoad: true,
    upload: undefined,
    error: undefined,
    height: undefined,
  };

  public componentDidMount(): void {
    // give the impression we are doing something difficult!
    window.setTimeout(() => {
      this.setState({ initialLoad: false });
    }, 1250);

    const { id } = this.props.match.params;
    api
      .retrieveUploadEvent(id)
      .then((response: AxiosResponse) => {
        this.setState({ upload: new UploadEvent(response.data) });
      })
      .catch((error: AxiosError) => {
        this.setState({ error });
      });
  }

  public render(): JSX.Element {
    const { classes, match } = this.props;
    const { upload, error, initialLoad } = this.state;
    if (error) {
      return (
        <Dialog
          title="API Error"
          content={
            <DialogContentText id="alert-dialog-description">
              Could not load the image upload detail - please contact the administrator or reload
              the page
            </DialogContentText>
          }
        />
      );
    }
    if (initialLoad || !upload) {
      return <Loader label="Loading upload event..." />;
    }
    const { name, created, images } = upload;
    const redirected = match.params.redirect !== undefined;
    return (
      <ExpansionPanel className={classes.panel} defaultExpanded={!redirected}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Images</Typography>
        </ExpansionPanelSummary>
        <Grid elementHeight={250} elementWidth={170} containerHeight={600} className={classes.grid}>
          {images.map(image => <Panel key={image.name} image={image} />)}
        </Grid>
      </ExpansionPanel>
    );
  }
}

export default styles<any>(UploadDetail);
