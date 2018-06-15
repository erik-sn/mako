import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { DateTime } from 'luxon';
import Overdrive from 'react-overdrive';
import { withStyles } from '@material-ui/core/styles';

import { REFRESH_TOKEN, REFRESH_TOKEN_EXPIRATION } from '../sagas/types';
import { classifierActions } from '../actions/models';
import {
  applicationError,
  checkApiStatus,
  initializeWebsocket,
  initializeAsyncWebsocket,
} from '../actions/display';
import Nav from './nav/Nav';
import Train from './train/Train';
import ModalDisplay from './ModalDisplay';
import ImageGroups from './images/ImageGroups';
import GoogleSearch from './images/GoogleSearch';
import GoogleSearchDetail from './images/GoogleSearchDetail';
import Upload from './images/Upload';
import { getAuthToken, refreshAuthToken, clearAuthToken } from '@/actions/auth';
import { IStore, IAction } from '@/interfaces/redux';
import api from '@/utils/api';
import Login from '../components/Login';
import User from '@/models/User';
import Profile from './profile/Profile';
import Loader from '@/components/generic/Loader';
import AppLoader from '@/components/AppLoader';
import AppBar from './nav/AppBar';
import UploadDetail from '@/components/images/UploadDetail';

const REFRESH_TOKEN_CHECK_INTERVAL = 1000 * 60 * 5; // 5 minutes
const styles = withStyles<any>(() => ({
  container: {
    display: 'flex',
    flexFlow: 'row nowrap',
    width: '100%',
  },
  body: {
    width: '100%',
    overflowX: 'hidden',
  },
  content: {
    height: 'calc(100vh - 125px)',
    width: 'calc(100% - 60px)',
    marginTop: '65px',
    padding: '30px 30px 30px 30px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
}));

interface IState {
  loading: boolean;
}

interface IProps {
  fetchClassifiers: () => void;
  applicationError: (errorStack: string, error: any) => void;
  initializeWebsocket: () => void;
  initializeAsyncWebsocket: () => void;
  checkApiStatus: () => void;
  webSocketConnection: Socket;
  asyncWebSocketConnection: Socket;
  getAuthToken: (username: string, password: string) => IAction<{}>;
  refreshAuthToken: (token: string) => IAction<string>;
  clearAuthToken: () => IAction<null>;
  location: any;
  user: User;
  loginLoader: boolean;
  classes: any;
}

export class Application extends React.Component<IProps, IState> {
  public state = {
    loading: false,
  };

  public componentDidMount(): void {
    // this.props.initializeWebsocket();
    this.props.initializeAsyncWebsocket();
    this.props.checkApiStatus();
    this.props.fetchClassifiers();
    this.refreshTokenFromLocalStorage();
    window.setInterval(this.checkAccessTimeout, REFRESH_TOKEN_CHECK_INTERVAL);
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const { loginLoader } = this.props;
    if (loginLoader && !nextProps.loginLoader) {
      this.setState({ loading: true }, () => {
        window.setTimeout(() => this.setState({ loading: false }), 1500);
      });
    }
    if (!nextProps.asyncWebSocketConnection) {
      window.setTimeout(() => this.props.initializeAsyncWebsocket(), 3000);
    }
  }

  public componentDidCatch(error: any, errorInfo: any) {
    const errorStack = errorInfo.componentStack;
    this.props.applicationError(errorStack, error);
  }

  private refreshTokenFromLocalStorage() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const refreshTokenExpiration = localStorage.getItem(REFRESH_TOKEN_EXPIRATION);
    const refreshExpiration = DateTime.fromISO(refreshTokenExpiration, { zone: 'utc' });
    if (!refreshExpiration || refreshExpiration.diffNow('minute').minutes < 15) {
      this.props.clearAuthToken();
    } else if (refreshToken) {
      this.props.refreshAuthToken(refreshToken);
    }
  }

  private checkAccessTimeout = () => {
    const { user } = this.props;
    if (user && user.tokenExpiresSoon()) {
      this.refreshTokenFromLocalStorage();
    }
  };

  private renderComponent = (Component: any) => (props: any) => (
    <Overdrive id="route__overdrive" duration={500}>
      <Component {...props} />
    </Overdrive>
  );

  public render() {
    const { loading } = this.state;
    const { user, loginLoader, classes } = this.props;
    if (!user || !user.accessToken) {
      return <Login />;
    }
    if (loading) {
      return (
        <Overdrive id="application__overdrive">
          <AppLoader />
        </Overdrive>
      );
    }
    return (
      <Overdrive id="application__overdrive" duration={750}>
        <div className={classes.container}>
          <ModalDisplay />
          <Nav />
          <div className={classes.body}>
            <AppBar />
            <div id="route__overdrive" className={classes.content}>
              <Switch>
                <Route path="/" exact component={Train} />
                <Route path="/profile" component={Profile} />
                <Route path="/train" exact component={Train} />
                <Route path="/images/upload/:id" component={UploadDetail} />
                <Route path="/images/upload" component={Upload} />
                <Route path="/images/google/:id/:redirect?" component={GoogleSearchDetail} />
                <Route path="/images/google" component={GoogleSearch} />
                <Route path="/images" component={ImageGroups} />
              </Switch>
            </div>
          </div>
        </div>
      </Overdrive>
    );
  }
}

const mapStateToProps = (store: IStore) => ({
  webSocketConnection: store.global.webSocketConnection,
  asyncWebSocketConnection: store.global.asyncWebSocketConnection,
  user: store.auth.user,
  loginLoader: store.loaders.login,
});

export default styles<any>(
  withRouter<any>(
    connect<{}, {}, {}>(mapStateToProps, {
      fetchClassifiers: classifierActions.fetch,
      applicationError,
      checkApiStatus,
      initializeWebsocket,
      initializeAsyncWebsocket,
      getAuthToken,
      refreshAuthToken,
      clearAuthToken,
    })(Application),
  ),
);
