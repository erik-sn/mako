import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles } from '@material-ui/core/styles';

import api from '@/utils/api';
import ImageGroup from '@/models/ImageGroup';
import HeaderError from '@/components/generic/HeaderError';
import Loader from '@/components/generic/Loader';
import ImageGroupItem from './ImageGroupItem';

const styles = () => createStyles({
  groupList: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
});

interface IProps {
  classes: any;
}

interface IState {
  imageGroups: ImageGroup[];
  error: boolean;
  loading: boolean;
}

class ImageGroups extends Component<IProps, IState> {
  public state: IState = {
    imageGroups: undefined,
    error: false,
    loading: true,
  };

  public componentDidMount(): void {
    this.getImageGroups();
  }

  private getImageGroups = (): void => {
    api
      .fetchImageGroups()
      .then((response: any) => {
        this.setState({
          loading: false,
          imageGroups: response.data.map((imageGroup: any) => new ImageGroup(imageGroup)),
        });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    const { error, loading, imageGroups } = this.state;
    if (error) {
      return <HeaderError text="Error loading image groups" />;
    }
    return (
      <ExpansionPanel defaultExpanded={true} expanded={true}>
        <ExpansionPanelSummary>
          <Typography variant="headline">Create image group from google searches</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.groupList} >
          {loading ? (
            <Loader marginTop="0px" size={50} />
          ) : (
            imageGroups.map(g => <ImageGroupItem key={g.id} imageGroup={g} refresh={this.getImageGroups} />)
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      );
  }
}

export default withStyles(styles)(ImageGroups);
