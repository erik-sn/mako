import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { DateTime } from 'luxon';

import { DATE_FORMAT } from '../../sagas/types';
import { IStore } from '../../interfaces/redux';
import User from '../../models/User';
import LoginRecords from './LoginRecords';

const styles = withStyles<any>(() => ({
  root: {},
  paper: {},
  userAvatar: {
    marginRight: '15px',
  },
}));

interface IProps {
  classes?: any;
  user?: User;
}
class Profile extends Component<IProps, {}> {
  public render(): JSX.Element {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        <Card elevation={4} className={classes.paper}>
          <CardContent>
            <CardContent>
              <Typography variant="headline" component="h3">
                Profile
              </Typography>
              <Typography component="p">
                Here is your profile information. Edits to this page should be done in the
                administration page.
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="title">Username:</Typography>
              <Typography component="p">{user.username}</Typography>
            </CardContent>
            <CardContent>
              <Typography variant="title">Created:</Typography>
              <Typography component="p">{user.dateJoinedStr}</Typography>
            </CardContent>
            {user.email && (
              <CardContent>
                <Typography variant="title">Email:</Typography>
                <Typography component="p">{user.email}</Typography>
              </CardContent>
            )}
            <CardContent>
              <Typography variant="title">Previous logins:</Typography>
              <LoginRecords loginRecords={user.loginRecords} />
            </CardContent>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  user: state.auth.user,
});

const ConnectedProfile = connect<any, {}, {}>(mapStateToProps)(Profile);
export default styles<any>(ConnectedProfile);
