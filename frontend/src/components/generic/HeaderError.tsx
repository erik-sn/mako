import React from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';

const styles = () => createStyles({
  root: {
    textAlign: 'center',
  },
});

interface IProps {
  text: string;
  classes: any;
}

const HeaderError = ({ text, classes }: IProps) => {
  return <h2 className={classes.root}>{text}</h2>;
};

export default withStyles(styles)(HeaderError);
