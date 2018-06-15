import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

import { imageGroupActions } from '@/actions/models';
import { IStore } from '@/interfaces/redux';
import { IImageGroup } from '@/models/ImageGroup';
import { IImage } from '@/models/GoogleSearch';

const styles = withStyles<any>((theme: any) => ({
  field: {
    width: 'calc(100% - 80px)',
  },
  form: {
    padding: '0px 0px 70px 0px',
    position: 'relative',
    marginRight: '45px',
  },
  submit: {
    position: 'absolute',
    bottom: theme.spacing.unit * 1,
    right: theme.spacing.unit * 1,
  },
}));

interface IAsyncErrors {
  name?: string;
  description?: string;
}
interface IProps {
  classes: any;
  asyncErrors?: IAsyncErrors;
  images: IImage[];
  createImageGroup: (imageGroup: IImageGroup) => void;
}
interface IForm {
  name?: string;
  description?: string;
}

class GoogleSearchForm extends Component<IProps, {}> {
  private initialValues: IForm = {
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
    const { name, description } = values;
    const { images } = this.props;
    this.props.createImageGroup({
      name,
      description,
      images: images.map(image => image.name),
    });
  };

  public render(): JSX.Element {
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
                className={classes.field}
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                margin="normal"
                fullWidth
                error={touched.description && formErrors.description}
                helperText={touched.description && formErrors.description}
              />
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
  asyncErrors: state.errors.imageGroupForm,
});

export default styles<any>(
  withRouter<any>(
    connect<{}, {}, {}>(mapStateToProps, {
      createImageGroup: imageGroupActions.create,
    })(GoogleSearchForm),
  ),
);
