import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ImageGroupsIcon from '@material-ui/icons/PhotoLibrary';
import AddPhotoIcon from '@material-ui/icons/AddAPhoto';
import SearchIcon from '@material-ui/icons/Search';

const styles = withStyles<any>((theme: any) => ({
  text: {
    fontSize: '0.8rem',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  link: {
    textDecoration: 'none',
  },
}));

interface IProps {
  classes: any;
}

interface IState {
  open: boolean;
}

class ImagesOptions extends Component<IProps, IState> {
  public state: IState = {
    open: true,
  };

  private handleClick = (): void => {
    this.setState({ open: !this.state.open });
  };

  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <ImageGroupsIcon />
          </ListItemIcon>
          <ListItemText inset primary="Images" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to="/images" className={classes.link}>
              <ListItem button className={classes.nested}>
                <ListItemText inset secondary="Image Groups" className={classes.text} />
              </ListItem>
            </Link>
            <Link to="/images/upload" className={classes.link}>
              <ListItem button className={classes.nested}>
                <ListItemText inset secondary="Upload Images" />
              </ListItem>
            </Link>
            <Link to="/images/google" className={classes.link}>
              <ListItem button className={classes.nested}>
                <ListItemText inset secondary="Google Images" />
              </ListItem>
            </Link>
          </List>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default styles<any>(ImagesOptions);
