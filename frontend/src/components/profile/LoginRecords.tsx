import React, { Component } from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import LoginRecord from '@/models/LoginRecord';

const styles = () => createStyles({
  item: {
    margin: '5px 0px',
    padding: '5px 0px',
  },
});

interface IProps {
  classes: any;
  loginRecords: LoginRecord[];
}

class LoginRecords extends Component<IProps, {}> {
  public render(): JSX.Element {
    const { classes, loginRecords } = this.props;
    return (
      <List>
        {loginRecords.map((login, index) => (
          <ListItem className={classes.item} key={`${index}-${login.createdStr}`}>
            <ListItemText primary={login.createdStr} secondary={login.ipAddress} />
            <ListItemText secondary={login.userAgent} />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(LoginRecords);
