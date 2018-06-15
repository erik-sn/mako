import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LoginForm from '@/components/forms/LoginForm';

const styles = withStyles<any>(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  },
  paper: {
    padding: '40px 60px',
    width: '400px',
    maxWidth: '100%',
  },
}));

interface IProps {
  classes?: any;
}

class Login extends Component<IProps, {}> {
  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper elevation={4} className={classes.paper}>
          <LoginForm />
        </Paper>
      </div>
    );
  }
}

export default styles<any>(Login);
