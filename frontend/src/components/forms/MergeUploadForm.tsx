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
import Typography from '@material-ui/core/Typography';

import { IStore } from '../../interfaces/redux';
import types from '../../sagas/types';
import Dialog from '../../components/generic/Dialog';
import GoogleSearch from '../../models/GoogleSearch';
import InlineError from '../generic/InlineError';
import { mergeUploadEvents } from '../../actions/images';
import UploadEvent from '@/models/UploadEvent';

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
  mergeContainer: {
    flexFlow: 'column nowrap',
  },
  infoContainer: {
    marginTop: '25px',
  },
  infoText: {
    fontSize: '1rem',
  },
}));

export interface IAsyncErrors {
  name?: string[];
  generic?: string;
}

interface IProps {
  classes?: any;
  uploadEvents: UploadEvent[];
  asyncErrors?: IAsyncErrors;
  loading?: boolean;
  onSubmit?: () => void;
  mergeUploadEvents: (json: any) => void;
}

interface IForm {
  deleteAfterMerge?: boolean;
  name?: string;
  description?: string;
}

class MergeSearchForm extends Component<IProps, {}> {
  private initialValues = {
    deleteAfterMerge: true,
    name: '',
    description: '',
  };

  private validate = (values: IForm) => {
    const { name } = values;
    const errors: IForm = {};
    if (!name) {
      errors.name = 'This field may not be blank.';
    }
    return errors;
  };

  private submit = (values: IForm) => {
    const { onSubmit, uploadEvents } = this.props;
    const { deleteAfterMerge, name, description } = values;
    this.props.mergeUploadEvents({
      name,
      description,
      items: uploadEvents.map(upload => upload.id),
      deleteAfterMerge,
    });
    onSubmit && onSubmit();
  };

  public render(): JSX.Element {
    const { classes, asyncErrors, loading, uploadEvents } = this.props;
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
              <div className={classes.newSearch}>
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
                  error={touched.description && formErrors.description}
                  helperText={touched.description && formErrors.description}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.deleteAfterMerge}
                      onChange={handleChange}
                      name="deleteAfterMerge"
                      color="primary"
                    />
                  }
                  label="Delete upload events after successful merge"
                />
              </div>
              {formErrors.generic && <InlineError text={formErrors.generic} />}
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
  asyncErrors: state.errors.mergeUploadForm,
  loading: state.loaders.mergeUploadEvents,
});

export default styles<any>(
  withRouter<any>(connect<{}, {}, {}>(mapStateToProps, { mergeUploadEvents })(MergeSearchForm)),
);
