import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import IconButton from '@material-ui/core/IconButton';

import GoogleSearch from '../../models/GoogleSearch';
import api from '@/utils/api';
import Tooltip from '@material-ui/core/Tooltip';
import ImageDownloader from './ImageDownloader';

const styles = (theme: any) => createStyles({
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
});

interface IProps {
  classes: any;
  googleSearch: GoogleSearch;
  active: boolean;
  isAdded: boolean;
  setActive: (id: number) => void;
  addSearchToMerge: (id: number) => void;
  refresh: () => void;
}

interface IState {
  deleteError: boolean;
  downloadError: boolean;
}

class GoogleSearchItem extends Component<IProps, IState> {
  public state: IState = {
    deleteError: false,
    downloadError: false,
  };

  private handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    api
      .deleteGoogleSearch(this.props.googleSearch.id)
      .then(() => {
        this.props.refresh();
      })
      .catch(() => {
        this.setState({ deleteError: true });
      });
  };

  private handleCheck = () => {
    this.props.addSearchToMerge(this.props.googleSearch.id);
  };

  public render(): JSX.Element {
    const { deleteError, downloadError } = this.state;
    const { isAdded, classes, googleSearch } = this.props;
    return (
      <ExpansionPanelDetails className={classes.details}>
        <div className={classes.left}>
          <Checkbox checked={isAdded} onChange={this.handleCheck} className={classes.checkbox} />
          <Link to={`/images/google/${googleSearch.id}/`} className={classes.name}>
            {googleSearch.name}
          </Link>
          <Typography variant="body1" className={classes.imageCount}>
            {googleSearch.imageCount} Images
          </Typography>
        </div>
        <div className={classes.right}>
          <Typography className={classes.created} variant="body1">
            {googleSearch.createdStr}
          </Typography>
          <ImageDownloader model={googleSearch} />
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

export default withStyles(styles)(GoogleSearchItem);
