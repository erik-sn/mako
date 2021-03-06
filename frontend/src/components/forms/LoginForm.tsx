import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import CancelIcon from '@material-ui/icons/Cancel';

import { IStore } from '../../interfaces/redux';
import InlineError from '../generic/InlineError';
import { getAuthToken } from '@/actions/auth';
import Loader from '@/components/generic/Loader';

const styles = (theme: any) => createStyles({
  textField: {
    width: '100%',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

interface IProps {
  classes?: any;
  loading?: boolean;
  onSubmit?: () => void;
  getAuthToken?: (username: string, password: string) => void;
  asyncErrors?: any;
}

interface IForm {
  username?: string;
  password?: string;
}

class LoginForm extends Component<IProps, {}> {
  private initialValues = {
    username: '',
    password: '',
  };

  private validate = (values: IForm) => {
    const { username, password } = values;
    const errors: IForm = {};
    if (!username) {
      errors.username = 'This field may not be blank.';
    }
    if (!password) {
      errors.password = 'This field may not be blank.';
    }
    return errors;
  };

  private submit = (values: IForm) => {
    const { username, password } = values;
    this.props.getAuthToken(username, password);
  };

  public render(): JSX.Element {
    const { classes, loading, asyncErrors } = this.props;
    return (
      <Formik
        initialValues={this.initialValues}
        validate={this.validate}
        onSubmit={this.submit}
        // tslint:disable-next-line:jsx-no-lambda
        render={props => {
          const { values, errors, touched, handleChange, handleReset, handleSubmit } = props;
          const formErrors = { ...errors, ...asyncErrors };
          return (
            <form className={classes.container} autoComplete="off" onSubmit={handleSubmit}>
              <Typography variant="headline" component="h3">
                Login
              </Typography>
              <Typography component="p">
                Please login to use this system. If you do not have a login please contact an
                administrator and ask them to create one for you.
              </Typography>
              <TextField
                id="username"
                label="Username"
                className={classes.textField}
                onChange={handleChange}
                margin="normal"
                value={values.username}
                error={touched.username && formErrors.username}
                helperText={touched.username && formErrors.username}
              />
              <TextField
                id="password"
                label="Password"
                className={classes.textField}
                onChange={handleChange}
                margin="normal"
                type="password"
                autoComplete="current-password"
                value={values.password}
                error={touched.password && formErrors.password}
                helperText={touched.password && formErrors.password}
              />
              {loading ? (
                <Loader size={35} left marginTop="20px" />
              ) : (
                <React.Fragment>
                  <Button className={classes.button} variant="raised" color="primary" type="submit">
                    <FingerprintIcon className={classes.leftIcon} />
                    Login
                  </Button>
                  <Button
                    className={classes.button}
                    variant="raised"
                    color="default"
                    onClick={handleReset}
                  >
                    <CancelIcon className={classes.leftIcon} />
                    Cancel
                  </Button>
                </React.Fragment>
              )}
              {formErrors.general && <InlineError text={formErrors.general} />}
            </form>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  asyncErrors: state.errors.loginForm,
  loading: state.loaders.login,
});

const Styled = withStyles(styles)(LoginForm);
export default connect<{}, {}, {}>(mapStateToProps, { getAuthToken })(Styled);
