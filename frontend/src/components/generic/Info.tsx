import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

interface IState {
  open: boolean;
}

interface IProps {
  className?: string;
  title: string;
  children?: string | JSX.Element;
}

class Info extends Component<IProps, IState> {
  public state: IState = {
    open: false,
  };

  private toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  };

  public render(): JSX.Element {
    const { open } = this.state;
    const { className } = this.props;
    return (
      <React.Fragment>
        <IconButton className={className} onClick={this.toggle}>
          <InfoIcon />
        </IconButton>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.toggle}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.props.children}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggle} color="primary">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default Info;
