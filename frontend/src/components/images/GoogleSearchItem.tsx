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
import InlineError from '@/components/generic/InlineError';
import api from '@/utils/api';

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
  delete: {
    marginRight: theme.spacing.unit,
  },
}));

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
}

class GoogleSearchItem extends Component<IProps, IState> {
  public state: IState = {
    deleteError: false,
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
    const { deleteError } = this.state;
    const { active, isAdded, classes, googleSearch } = this.props;
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
          {deleteError ? (
            <InlineError
              text="Error deleting google search"
              style={{ justifyContent: 'flex-end' }}
            />
          ) : (
            <React.Fragment>
              <Typography className={classes.created} variant="body1">
                {googleSearch.createdStr}
              </Typography>
              <IconButton
                className={classes.delete}
                onClick={this.handleDelete}
                aria-label="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </React.Fragment>
          )}
        </div>
      </ExpansionPanelDetails>
    );
  }
}

export default styles<any>(GoogleSearchItem);