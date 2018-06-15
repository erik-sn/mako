import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import GoogleSearch from '../../models/GoogleSearch';
import google from '@/reducers/google';
import UploadEvent from '@/models/UploadEvent';
import api from '@/utils/api';
import InlineError from '@/components/generic/InlineError';
import Loader from '@/components/generic/Loader';

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
  link: {
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  imageCount: {
    marginRight: theme.spacing.unit,
    marginTop: '2px',
  },
  delete: {},
  createdDelete: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
}));

interface IProps {
  classes: any;
  upload: UploadEvent;
  isAdded: boolean;
  addUploadToMerge: (id: number) => void;
  refresh: () => void;
}

interface IState {
  deleteError: boolean;
  loading: boolean;
}

class UploadItem extends Component<IProps, {}> {
  public state: IState = {
    deleteError: false,
    loading: false,
  };

  private handleCheck = () => {
    this.props.addUploadToMerge(this.props.upload.id);
  };

  private handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ loading: true });
    api
      .deleteUploadEvent(this.props.upload.id)
      .then(() => {
        this.setState({ loading: false }, () => {
          this.props.refresh();
        });
      })
      .catch(() => {
        this.setState({ deleteError: true, loading: false });
      });
  };

  public render(): JSX.Element {
    const { deleteError, loading } = this.state;
    const { isAdded, classes, upload } = this.props;
    return (
      <ExpansionPanelDetails className={classes.details}>
        <div className={classes.left}>
          <Checkbox checked={isAdded} onChange={this.handleCheck} className={classes.checkbox} />
          <Typography variant="body1" className={classes.imageCount}>
            {upload.imageCount} Images
          </Typography>
          <Link to={`/images/upload/${upload.id}/`} className={classes.link}>
            View images
          </Link>
        </div>
        <div className={classes.right}>
          {deleteError ? (
            <InlineError
              text="Error deleting upload event"
              style={{ justifyContent: 'flex-end' }}
            />
          ) : (
            <div className={classes.createdDelete}>
              <Typography className={classes.created} variant="body1">
                {upload.createdStr}
              </Typography>
              {loading ? (
                <Loader size={25} marginTop="0px" marginLeft="15px" />
              ) : (
                <IconButton
                  className={classes.delete}
                  onClick={this.handleDelete}
                  aria-label="Delete"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          )}
        </div>
      </ExpansionPanelDetails>
    );
  }
}

export default styles<any>(UploadItem);
