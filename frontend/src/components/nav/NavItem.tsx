import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { WithStyles, createStyles, withStyles } from '@material-ui/core';

const styles = createStyles({
  root: {
    textDecoration: 'none',
  },
});

interface IProps {
  children: JSX.Element;
  label: string;
  to: string;
  classes: {
    root: string;
  };
}

const NavItem = ({ children, classes, label, to }: IProps) => (
  <Link to={`/${to}`} className={classes.root}>
    <ListItem button>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText inset primary={label} />
    </ListItem>
  </Link>
);

export default withStyles(styles)(NavItem);
