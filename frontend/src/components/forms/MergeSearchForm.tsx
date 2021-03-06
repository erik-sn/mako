import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { createStyles, withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { IStore } from '../../interfaces/redux';
import GoogleSearch from '../../models/GoogleSearch';
import InlineError from '../generic/InlineError';
import { mergeGoogleSearches } from '../../actions/google';

const styles = (theme: any) => createStyles({
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
});

export interface IAsyncErrors {
  name?: string[];
  generic?: string;
}

interface IProps {
  classes?: any;
  googleSearches: GoogleSearch[];
  asyncErrors?: IAsyncErrors;
  loading?: boolean;
  onSubmit?: () => void;
  mergeGoogleSearches: (json: any) => void;
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
    const { onSubmit, googleSearches } = this.props;
    const { deleteAfterMerge, name, description } = values;
    this.props.mergeGoogleSearches({
      name,
      description,
      items: googleSearches.map(search => search.id),
      deleteAfterMerge,
    });
    onSubmit && onSubmit();
  };

  public render(): JSX.Element {
    const { classes, asyncErrors, loading, googleSearches } = this.props;
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
                  label="Delete google searches after successful merge"
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
  asyncErrors: state.errors.mergeSearchForm,
  loading: state.loaders.mergeGoogleSearches,
});

const Styled = withStyles(styles)(MergeSearchForm);
export default withRouter<any>(connect<{}, {}, {}>(mapStateToProps, { mergeGoogleSearches })(Styled));
