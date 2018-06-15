import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

interface IProps {
  children: JSX.Element;
  classes: any;
  label: string;
  to: string;
}

const styles = withStyles<any>(() => ({
  root: {
    textDecoration: 'none',
  },
}));

const NavItem = ({ children, classes, label, to }: IProps) => (
  <Link to={`/${to}`} className={classes.root}>
    <ListItem button>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText inset primary={label} />
    </ListItem>
  </Link>
);

export default styles<any>(NavItem);
