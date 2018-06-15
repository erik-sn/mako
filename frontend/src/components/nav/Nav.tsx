import * as React from 'react';
import { connect } from 'react-redux';
import * as debounce from 'debounce';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TrainIcon from '@material-ui/icons/FitnessCenter';
import ClassifyIcon from '@material-ui/icons/MyLocation';
import ClassifiersIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/MoreVert';
import ProfileIcon from '@material-ui/icons/Person';
import AboutIcon from '@material-ui/icons/HelpOutline';
import NotificationIcon from '@material-ui/icons/Notifications';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

import { clearAuthToken } from '@/actions/auth';
import { IStore } from '@/interfaces/redux';
import NavItem from '@/components/nav/NavItem';
import ImagesOptions from '@/components/nav/ImagesOption';
import User from '@/models/User';
import { Link } from 'react-router-dom';

interface IState {
  open: boolean;
  anchorEl: any;
}
interface IProps {
  classes: any;
  title: string;
  subtitle: string;
  user: User;
  clearAuthToken: () => void;
}

const drawerWidth = 240;
const styles = withStyles<any>((theme: any) => ({
  root: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  username: {
    margin: '0px 10px 0px 10px',
  },
  icon: {
    color: '#fff',
  },
  toolbar: theme.mixins.toolbar,
  navItem: {
    textDecoration: null,
  },
}));

export class Nav extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      open: true,
      anchorEl: null,
    };
  }

  private handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleClose = () => {
    this.setState({ anchorEl: null });
  };

  public componentDidMount() {
    this.checkWidth();
    window.addEventListener('resize', debounce(this.checkWidth, 300));
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.checkWidth);
  }

  private checkWidth = () => {
    const width = window.innerWidth;
    if (open && width < 600) {
      this.setState({ open: false });
    }
  };

  private handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.setState({ anchorEl: null }, () => {
      this.props.clearAuthToken();
    });
  };

  public render(): JSX.Element {
    const { anchorEl } = this.state;
    const { classes, title, user } = this.props;
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <List>
          <NavItem label="Dashboard" to="">
            <DashboardIcon />
          </NavItem>
          <NavItem label="Train" to="train">
            <TrainIcon />
          </NavItem>
          <NavItem label="Classify" to="classify">
            <ClassifyIcon />
          </NavItem>
          <NavItem label="Classifiers" to="classifiers">
            <ClassifiersIcon />
          </NavItem>
          <ImagesOptions />
          <NavItem label="About" to="about">
            <AboutIcon />
          </NavItem>
        </List>
      </Drawer>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  title: state.display.infoTitle,
  user: state.auth.user,
});

const ConnectedNav = connect<any, {}, {}>(mapStateToProps, { clearAuthToken })(Nav);
export default styles<any>(ConnectedNav);
