import React, { Component } from 'react';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { IImage } from '@/models/GoogleSearch';
import Panel from './Panel';

const styles = withStyles<any>((theme: any) => ({
  button: {
    margin: theme.spacing.unit,
  },
  images: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
  },
  showMore: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface IProps {
  images: IImage[];
  classes: any;
}

interface IState {
  visibleImages: number;
}

class ImageList extends Component<IProps, IState> {
  public state: IState = {
    visibleImages: 29,
  };

  private showMoreImages = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ visibleImages: this.state.visibleImages + 10 });
  }

  public render(): JSX.Element {
    const { visibleImages } = this.state;
    const { classes, images } = this.props;
    const showMoreVisible = visibleImages < images.length;
    return (
      <ExpansionPanelDetails className={classes.images}>
        <div className={classes.images}>
          {images.slice(0, visibleImages).map(image => <Panel key={image.name} image={image} />)}
        </div>
        <div className={classes.showMore}>
          {showMoreVisible && (
            <Button color="primary" className={classes.button} onClick={this.showMoreImages} >
              Load More
            </Button>
          )}
        </div>
      </ExpansionPanelDetails>
    );
  }
}

export default styles<any>(ImageList);
