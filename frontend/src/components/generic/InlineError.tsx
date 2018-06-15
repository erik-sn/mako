import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = withStyles<any>(() => ({
  root: {
    color: 'red',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    fontStyle: 'italic',
    fontSize: '1rem',
    marginTop: '15px',
  },
}));

interface IProps {
  classes?: any;
  text: string;
  style?: any;
}

const InlineError = ({ classes, style, text }: IProps) => (
  <Typography className={classes.root} style={style}>
    {text}
  </Typography>
);

export default styles(InlineError);
