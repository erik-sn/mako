import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import DisplayIcon from '@material-ui/icons/FlipToFront';

import { IImage } from '../../models/GoogleSearch';
import Dialog from '../generic/Dialog';
import api from '../../utils/api';

const styles = withStyles<any>(() => ({
  panel: {
    listStyle: 'none',
    margin: '5px',
    width: '170px',
    height: '240px',
  },
  media: {
    height: 175,
    transition: 'opacity 0.25s ease-in-out',
  },
  img: {
    height: '100%',
  },
  imgDetail: {
    width: '100%',
  },
  excluded: {
    opacity: 0.3,
  },
}));

interface IProps {
  image: IImage;
  classes: any;
}

interface IState {
  image: IImage;
  showDialog: boolean;
  copyTooltip: boolean;
  copyError: boolean;
  toggleTooltip: boolean;
  toggleError: boolean;
}

import { STATIC } from '../../sagas/types';
import Tooltip from '@material-ui/core/Tooltip';
import { AxiosResponse } from 'axios';

class Panel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      image: props.image,
      showDialog: false,
      copyTooltip: false,
      copyError: false,
      toggleTooltip: false,
      toggleError: false,
    };
  }

  public shouldComponentUpdate(nextProps: IProps): boolean {
    return nextProps.image.sourceUrl !== this.props.image.sourceUrl;
  }

  private toggleDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ showDialog: !this.state.showDialog });
  };

  private closeDialog = () => {
    this.setState({ showDialog: false });
  };

  private copyToClipboard = () => {
    const { name } = this.props.image;
    const input = document.getElementById(name) as any;
    input.focus();
    input.select();

    try {
      document.execCommand('copy');
      this.setState({ copyTooltip: true });
    } catch (err) {
      this.setState({ copyError: true });
    }
  };

  private toggleImageActive = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const uuid = this.props.image.name.split('.')[0];
    api
      .toggleImageIncluded(uuid)
      .then((response: AxiosResponse) => {
        this.setState({
          image: response.data,
          copyTooltip: false,
          copyError: false,
          toggleTooltip: true,
          toggleError: false,
        });
      })
      .catch(() => {
        this.setState({
          copyTooltip: false,
          copyError: false,
          toggleTooltip: false,
          toggleError: true,
        });
      });
  };

  private handleTooltipClose = () => {
    this.setState({
      copyTooltip: false,
      copyError: false,
      toggleTooltip: false,
      toggleError: false,
    });
  };

  public render(): JSX.Element {
    const { classes } = this.props;
    const { showDialog, copyError, copyTooltip, toggleTooltip, toggleError, image } = this.state;
    return (
      <li className={classes.panel}>
        {showDialog && (
          <Dialog
            title=""
            content={
              <img className={classes.imgDetail} src={`${STATIC}/${image.name}`} alt={image.name} />
            }
            onClose={this.closeDialog}
            actions={[{ label: 'Close', func: this.toggleDialog }]}
          />
        )}
        <Card className={classes.card}>
          <CardMedia
            className={`${classes.media} ${!image.included ? classes.excluded : ''}`}
            image={`${STATIC}/${image.name}`}
            title={image.name}
          />
          <CardActions className={classes.actions} disableActionSpacing>
            <input
              id={image.name}
              value={image.sourceUrl}
              style={{ opacity: 0, height: '0px', padding: '0px', margin: '0px', width: '0px' }}
              readOnly
            />
            <Tooltip
              id={`${image.name}-tooltip-toggle`}
              title={toggleError ? 'Error toggling image status' : 'Changed image status'}
              onClose={this.handleTooltipClose}
              enterDelay={300}
              leaveDelay={300}
              open={toggleError || toggleTooltip}
              placement="bottom"
            >
              <IconButton aria-label="Image active" onClick={this.toggleImageActive}>
                {image.included ? <CheckIcon /> : <CancelIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip
              id={`${image.name}-tooltip-copy`}
              title={copyError ? 'Error copying image URL' : 'Copied image URL to clipboard'}
              onClose={this.handleTooltipClose}
              enterDelay={300}
              leaveDelay={300}
              open={copyError || copyTooltip}
              placement="bottom"
            >
              <IconButton aria-label="Share" onClick={this.copyToClipboard}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <IconButton aria-label="Show more" onClick={this.toggleDialog}>
              <DisplayIcon />
            </IconButton>
          </CardActions>
        </Card>
      </li>
    );
  }
}

export default styles<any>(Panel);
