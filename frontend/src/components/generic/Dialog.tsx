import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IDialogAction {
  label: string;
  func: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IDefaultProps {
  defaultOpen?: boolean;
  actions?: IDialogAction[];
}

interface IProps {
  defaultOpen?: boolean;
  title: string;
  content: JSX.Element;
  actions?: IDialogAction[];
  onClose?: () => void;
}

interface IState {
  open: boolean;
}

class AlertDialog extends Component<IProps, IState> {
  public static defaultProps: IDefaultProps = {
    defaultOpen: true,
    actions: [],
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      open: props.defaultOpen,
    };
  }

  private handleClose = (): void => {
    this.setState({ open: false }, () => this.props.onClose && this.props.onClose());
  };

  public render(): JSX.Element {
    const { title, content, actions } = this.props;
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          {actions.map(action => (
            <Button key={action.label} onClick={action.func} color="primary">
              {action.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    );
  }
}

export default AlertDialog;
