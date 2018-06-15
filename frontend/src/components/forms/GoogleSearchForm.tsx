import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import isUrl from 'is-url';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import DialogContentText from '@material-ui/core/DialogContentText';
import InfoIcon from '@material-ui/icons/InfoOutline';

import { IStore } from '@/interfaces/redux';
import types from '@/sagas/types';
import Dialog from '@/components/generic/Dialog';

const styles = withStyles<any>((theme: any) => ({
  form: {
    padding: '0px 0px 30px 0px',
    position: 'relative',
  },
  submit: {
    position: 'absolute',
    bottom: theme.spacing.unit * 1,
    right: theme.spacing.unit * 1,
  },
  newSearch: {
    position: 'relative',
  },
  info: {
    position: 'absolute',
    left: '100px',
    top: '-5px',
  },
}));

interface IAsyncErrors {
  name?: string[];
  url?: string[];
}

interface IProps {
  classes: any;
  asyncWebSocketConnection?: Socket;
  asyncErrors?: IAsyncErrors;
  onSubmit?: () => void;
}

interface IState {
  newSearchInfo?: boolean;
}

interface IForm {
  name?: string;
  description?: string;
  url?: string;
  newSearch?: boolean;
}

const infoMessage = `If checked the image parser will re-download the
google images from the URL provide. If unchecked it will first see if
there is a previously used image search with your specifications and use
that instead`;

class GoogleSearchForm extends Component<IProps, IState> {
  public state: IState = {
    newSearchInfo: false,
  };

  private initialValues = {
    name: '',
    description: '',
    url: '',
    newSearch: true,
  };

  private validate = (values: IForm) => {
    const { name, url } = values;
    const errors: IForm = {};
    if (!name) {
      errors.name = 'This field may not be blank.';
    }
    if (!url) {
      errors.url = 'This field may not be blank.';
    } else if (!isUrl(url)) {
      errors.url = 'Invalid URL';
    } else if (!url.startsWith('https://www.google.com/search')) {
      errors.url = 'URL must be a google image search';
    }
    return errors;
  };

  private submit = (values: IForm) => {
    const { name, description, url, newSearch } = values;
    this.props.onSubmit();
    this.props.asyncWebSocketConnection.post({
      type: types.googleSearch.create,
      payload: { name, url, description, usePickle: !newSearch },
    });
  };

  private toggleInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ newSearchInfo: !this.state.newSearchInfo });
  };

  public render(): JSX.Element {
    const { newSearchInfo } = this.state;
    const { classes, asyncErrors } = this.props;
    return (
      <Formik
        initialValues={this.initialValues}
        validate={this.validate}
        onSubmit={this.submit}
        // tslint:disable-next-line:jsx-no-lambda
        render={props => {
          const { values, errors, touched, handleChange, handleSubmit } = props;
          const formErrors = { ...errors, ...asyncErrors };
          return (
            <form onSubmit={handleSubmit} className={classes.form}>
              {newSearchInfo && (
                <Dialog
                  title="New Search"
                  content={
                    <DialogContentText id="alert-dialog-description">
                      {infoMessage}
                    </DialogContentText>
                  }
                  actions={[{ label: 'Ok', func: this.toggleInfo }]}
                />
              )}
              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                margin="normal"
                error={touched.name && formErrors.name}
                helperText={touched.name && formErrors.name}
              />
              <TextField
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                margin="normal"
                fullWidth
                error={touched.description && formErrors.description}
                helperText={touched.description && formErrors.description}
              />
              <TextField
                label="Url"
                name="url"
                value={values.url}
                onChange={handleChange}
                margin="normal"
                fullWidth
                error={touched.url && formErrors.url}
                helperText={touched.url && formErrors.url}
              />
              <div className={classes.newSearch}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.newSearch}
                      onChange={handleChange}
                      name="newSearch"
                      color="primary"
                    />
                  }
                  label="New search"
                />
                <IconButton className={classes.info} aria-label="Info" onClick={this.toggleInfo}>
                  <InfoIcon />
                </IconButton>
              </div>
              <Button
                variant="fab"
                color="primary"
                aria-label="add"
                className={classes.submit}
                type="submit"
              >
                <AddIcon />
              </Button>
            </form>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  asyncWebSocketConnection: state.global.asyncWebSocketConnection,
  asyncErrors: state.errors.googleSearchForm,
});

export default styles<any>(
  withRouter<any>(connect<{}, {}, {}>(mapStateToProps, {})(GoogleSearchForm)),
);
