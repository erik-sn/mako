import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = withStyles<any>(() => ({
  root: {
    textAlign: 'center',
  },
}));

interface IProps {
  text: string;
  classes: any;
}

const HeaderError = ({ text, classes }: IProps) => {
  return <h2 className={classes.root}>{text}</h2>;
};

export default styles<any>(HeaderError);
