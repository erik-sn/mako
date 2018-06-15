import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Loader from '@/components/generic/Loader';

const styles = withStyles<any>(() => ({
  root: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    marginTop: '15vh',
  },
  text: {
    textAlign: 'center',
    marginTop: '25px',
  },
}));

interface IProps {
  classes: any;
}

class AppLoader extends Component<IProps, {}> {
  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Loader size={100} />
        <Typography variant="display1" className={classes.text}>
          Loading application...
        </Typography>
      </div>
    );
  }
}

export default styles<any>(AppLoader);
