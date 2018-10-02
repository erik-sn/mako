import React, { Component } from 'react';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import Tooltip from '@material-ui/core/Tooltip';

import { IImage } from '@/models/GoogleSearch';
import Panel from './Panel';

const styles =(theme: any) => createStyles({
  button: {
    margin: theme.spacing.unit,
  },
  imageList: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  imageLabel: {
    marginBottom: '15px',
  },
  sliderContainer: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  images: {
    width: '95%',
    margin: '0px 30px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr));',
  },
  arrow: {
    marginBottom: '12px',
  },
});

interface IProps {
  images: IImage[];
  classes: any;
}

interface IState {
  imageInterval: number;
  visibleImages: number;
}

class ImageList extends Component<IProps, IState> {
  public state: IState = {
    visibleImages: 0,
    imageInterval: 15,
  };

  get topRange(): number {
    const { images } = this.props;
    const { visibleImages, imageInterval } = this.state;
    const calculatedTop = visibleImages + 1 + imageInterval;
    return calculatedTop > images.length ? images.length : calculatedTop;
  }

  private shiftImages = (count: number) => (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (this.state.visibleImages + count < 0) {
      this.setState({ visibleImages: this.props.images.length - this.state.imageInterval })
    } else if (this.state.visibleImages + count >= this.props.images.length) {
      this.setState({ visibleImages: 0 });
    } else {
      this.setState({ visibleImages: this.state.visibleImages + count });
    }
  }

  public render(): JSX.Element {
    const { visibleImages, imageInterval } = this.state;
    const { classes, images } = this.props;
    return (
      <ExpansionPanelDetails className={classes.imageList} >
        <div className={classes.sliderContainer}>
          <div className={classes.arrow}>
            <Tooltip id="tooltip-download" title="See previous images">
              <IconButton onClick={this.shiftImages(-1 * imageInterval)} >
                <LeftIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.imageLabel}>
            Visible Images: {visibleImages + 1} - {this.topRange}
          </div>
          <div className={classes.arrow} >
            <Tooltip id="tooltip-download" title="See next images">
              <IconButton onClick={this.shiftImages(imageInterval)} >
                <RightIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={classes.images}>
          {images.slice(visibleImages, visibleImages + imageInterval)
            .map(image => <Panel key={image.name} image={image} />)}
        </div>
      </ExpansionPanelDetails>
    );
  }
}

export default withStyles(styles)(ImageList);
