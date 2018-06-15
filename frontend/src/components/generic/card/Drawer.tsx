import React, { Component } from 'react';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

const styles = withStyles<any>((theme: any) => ({
  media: {
    height: 194,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

interface IProps {
  classes?: any;
  children: JSX.Element;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  toggle?: boolean;
}

interface IState {
  expanded: boolean;
}

class Drawer extends Component<IProps, IState> {
  public static defaultProps = {
    defaultOpen: true,
    toggle: true,
  };

  constructor(props: IProps) {
    super(props);
    this.state = { expanded: props.defaultOpen };
  }

  private handleExpandClick = (): void => {
    this.setState({ expanded: !this.state.expanded });
  };

  public render(): JSX.Element {
    const { classes, children, title, subtitle, toggle } = this.props;
    return (
      <Card>
        <CardHeader
          action={
            toggle ? (
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            ) : null
          }
          title={title}
          subheader={subtitle}
        />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>{children}</CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default styles<any>(Drawer);
