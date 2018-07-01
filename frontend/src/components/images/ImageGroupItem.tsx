import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import IconButton from '@material-ui/core/IconButton';

import InlineError from '@/components/generic/InlineError';
import api from '@/utils/api';
import Tooltip from '@material-ui/core/Tooltip';
import ImageDownloader from './ImageDownloader';
import ImageGroup from '@/models/ImageGroup';

const styles = withStyles<any>((theme: any) => ({
  details: {
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
    padding: '8px 24px 10px 8px',
  },
  left: {
    flex: '1 1 auto',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
  },
  right: {
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  checkbox: {
    margin: '3px 15px 3px 3px',
    height: '20px',
    width: '20px',
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '15px',
  },
  imageCount: {
    marginTop: '2px',
  },
  created: {
    marginRight: '15px',
  },
  delete: {
    marginRight: theme.spacing.unit,
  },
}));

interface IProps {
  classes: any;
  imageGroup: ImageGroup;
  refresh: () => void;
}

interface IState {
  deleteError: boolean;
  downloadError: boolean;
}

class ImageGroupItem extends Component<IProps, IState> {
  public state: IState = {
    deleteError: false,
    downloadError: false,
  };

  private handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    api
      .deleteImageGroup(this.props.imageGroup.id)
      .then(() => {
        this.props.refresh();
      })
      .catch(() => {
        this.setState({ deleteError: true });
      });
  };

  public render(): JSX.Element {
    const { deleteError } = this.state;
    const { classes, imageGroup } = this.props;
    return (
      <ExpansionPanelDetails className={classes.details}>
        <div className={classes.left}>
          <Link to={`/images/groups/${imageGroup.id}/`} className={classes.name}>
            {imageGroup.name}
          </Link>
          <Typography variant="body1" className={classes.imageCount}>
            {imageGroup.imageCount} Images
          </Typography>
        </div>
        <div className={classes.right}>
          <Typography className={classes.created} variant="body1">
            {imageGroup.createdStr}
          </Typography>
          <ImageDownloader model={imageGroup} />
          {deleteError ? (
            <Tooltip id="tooltip-delete" title="Error deleting google search">
              <IconButton
                className={classes.delete}
              >
                <ErrorIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip id="tooltip-delete" title="Delete image group">
              <IconButton
                className={classes.delete}
                onClick={this.handleDelete}
                aria-label="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </ExpansionPanelDetails>
    );
  }
}

export default styles<any>(ImageGroupItem);
