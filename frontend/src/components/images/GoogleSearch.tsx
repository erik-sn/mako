import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import { resetLastCreatedId } from '@/actions/display';
import { resetWebsocketLog } from '@/actions/google';
import api from '@/utils/api';
import GoogleSearchForm from '@/components/forms/GoogleSearchForm';
import Loader from '@/components/generic/Loader';
import { IStore } from 'src/interfaces/redux';
import GSearch, { IGoogleSearch } from '@/models/GoogleSearch';
import GoogleSearchItem from './GoogleSearchItem';
import MergeSearchForm from '../forms/MergeSearchForm';

const styles = withStyles<any>(() => ({
  formContainer: {
    flexFlow: 'column nowrap',
  },
  mergeContainer: {
    flexFlow: 'column nowrap',
  },
  infoContainer: {
    marginTop: '25px',
  },
  infoText: {
    fontSize: '1rem',
  },
  searchList: {
    marginTop: '25px',
    display: 'flex',
    flexFlow: 'column nowrap',
    overflowX: 'hidden',
  },
}));

interface IProps {
  classes: any;
  loading: boolean;
  mergeLoading: boolean;
  mergeError: string;
  history: {
    push: (url: string) => void;
  };
  googleSearchId: number;
  websocketLog: string;
  resetLastCreatedId: () => void;
  resetWebsocketLog: () => void;
}

interface IState {
  loading: boolean;
  loadingGoogleSearches: boolean;
  getGoogleSearchError: any;
  googleSearches: GSearch[];
  activeGoogleSearch: number;
  searchesToMerge: GSearch[];
  deleteAfterMerge: boolean;
  mergeSuccess: boolean;
  startNewImageSearch: boolean;
}

class GoogleSearch extends Component<IProps, IState> {
  public state: IState = {
    loading: false,
    loadingGoogleSearches: true,
    getGoogleSearchError: undefined,
    googleSearches: undefined,
    activeGoogleSearch: undefined,
    searchesToMerge: [],
    deleteAfterMerge: true,
    mergeSuccess: false,
    startNewImageSearch: false,
  };

  public componentDidMount() {
    this.retrieveGoogleSearches();
  }

  private get totalImages() {
    return this.state.searchesToMerge.reduce((count, search) => {
      return count + search.imageCount;
    }, 0);
  }

  private get totalIncludedImages() {
    return this.state.searchesToMerge.reduce((count, search) => {
      return count + search.includedImageCount;
    }, 0);
  }

  public componentWillReceiveProps(nextProps: IProps): void {
    // we succesfully made a google search merge
    if (this.props.mergeLoading && !nextProps.mergeLoading && !nextProps.mergeError) {
      this.setState({ searchesToMerge: [], mergeSuccess: true }, () => {
        this.retrieveGoogleSearches();
      });
    }
  }

  public componentWillUnmount() {
    this.props.resetLastCreatedId();
    this.props.resetWebsocketLog();
  }

  private retrieveGoogleSearches = () => {
    this.setState({ loadingGoogleSearches: true });
    api
      .fetchGoogleSearches()
      .then(response => {
        this.setState({
          googleSearches: response.data.map((search: IGoogleSearch) => new GSearch(search)),
          loadingGoogleSearches: false,
          getGoogleSearchError: false,
          searchesToMerge: [],
        });
      })
      .catch(error => {
        console.error(error); // tslint:disable-line
        this.setState({ loadingGoogleSearches: false, getGoogleSearchError: error });
      });
  };

  private toggleLoading = (): void => {
    event.preventDefault();
    this.setState({ loading: !this.state.loading, startNewImageSearch: true });
  };

  private setActiveSearch = (id: number) => {
    if (this.state.activeGoogleSearch === id) {
      this.setState({ activeGoogleSearch: undefined });
    } else {
      this.setState({ activeGoogleSearch: id });
    }
  };

  private addSearchToMerge = (id: number) => {
    const { googleSearches, searchesToMerge } = this.state;
    const exists = searchesToMerge.some(search => search.id === id);
    if (exists) {
      const filtered = searchesToMerge.filter(search => search.id !== id);
      this.setState({ searchesToMerge: filtered });
    } else {
      const matchingSearch = googleSearches.find(search => search.id === id);
      this.setState({
        searchesToMerge: searchesToMerge.concat([matchingSearch]),
      });
    }
  };

  private handleToggleDeleteAfterMerge = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ deleteAfterMerge: !this.state.deleteAfterMerge });
  };

  private closeSnackbar = () => {
    this.setState({ mergeSuccess: false });
  };

  private closeNewImageSearchSnackbar = () => {
    this.setState({ startNewImageSearch: false });
  };

  public render(): JSX.Element {
    const {
      googleSearches,
      searchesToMerge,
      loadingGoogleSearches,
    } = this.state;
    const { classes, websocketLog, googleSearchId } = this.props;
    const noExistingSearches = !loadingGoogleSearches && googleSearches.length === 0;
    return (
      <React.Fragment>
        <ExpansionPanel defaultExpanded={false}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Build new google search</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.formContainer}>
            <Typography>
              Visit{' '}
              <a href="https://images.google.com/" target="_blank">
                Google images
              </a>{' '}
              and use it to search for images that match your criteria. When you are done copy and
              paste the URL from the browser below. Then give it a name and description.
            </Typography>
            {loadingGoogleSearches ? (
              <Loader size={50} left />
            ) : (
              <GoogleSearchForm onSubmit={this.toggleLoading} />
            )}
            <pre>{websocketLog}</pre>
            <Typography>
              <Link to={`/images/google/${googleSearchId}/`}>View results of google image parse</Link>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded={true} expanded={true}>
          <ExpansionPanelSummary>
            <Typography variant="headline">Create image group from google searches</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.mergeContainer}>
            <Typography variant="subheading">
              Select the google searches below that you want to merge into an images group.
            </Typography>
            <Typography
              variant="display1"
              className={`${classes.infoText} ${classes.infoContainer}`}
            >
              Selected google searches: {searchesToMerge.length}
            </Typography>
            <Typography variant="display1" className={classes.infoText}>
              Total image count: {this.totalImages}
            </Typography>
            <Typography variant="display1" className={classes.infoText}>
              Total included image count: {this.totalIncludedImages}
            </Typography>
            {this.totalIncludedImages > 0 && <MergeSearchForm googleSearches={searchesToMerge} />}
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography variant="headline">
              {noExistingSearches ? 'No existing google searches' : 'Existing google searches:'}
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails className={classes.mergeContainer}>
            {loadingGoogleSearches ? (
              <Loader marginTop="0px" size={50} />
            ) : (
              googleSearches.map(g => (
                <GoogleSearchItem
                  key={g.id}
                  googleSearch={g}
                  active={g.id === this.state.activeGoogleSearch}
                  setActive={this.setActiveSearch}
                  addSearchToMerge={this.addSearchToMerge}
                  isAdded={searchesToMerge.some(search => search.id === g.id)}
                  refresh={this.retrieveGoogleSearches}
                />
              ))
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.mergeSuccess}
          autoHideDuration={6000}
          onClose={this.closeSnackbar}
          message={
            <span id="merge-success">Google searches successfully merged into an image group</span>
          }
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.startNewImageSearch}
          autoHideDuration={6000}
          onClose={this.closeNewImageSearchSnackbar}
          message={<span id="merge-success">Starting google image parser</span>}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  websocketLog: state.google.websocketLog,
  googleSearchId: state.display.lastCreatedId,
  loading: state.loaders.createGoogleSearch,
  mergeLoading: state.loaders.mergeGoogleSearches,
  mergeError: state.errors.mergeSearchForm,
});

export default styles<any>(withRouter<any>(connect<any>(mapStateToProps, {
  resetLastCreatedId,
  resetWebsocketLog,
})(GoogleSearch)));
