import * as React from 'react';

import Input from '../../components/generic/Input';

interface IState {
  [key: string]: string;
}

interface IProps {
  children?: JSX.Element | JSX.Element[];
  className?: string;
  defaultValues?: any;
  label: string;
  fields: string[];
  handleSubmit: (state: IState, clearForm?: () => void) => void;
}

export class Form extends React.Component<IProps, IState> {
  private defaultState: IState;

  constructor(props: IProps) {
    super(props);
    this.defaultState = props.fields.reduce((state, f) => {
      const updatedState: IState = { ...state };
      updatedState[f] = props.defaultValues ? props.defaultValues[f] : '';
      return updatedState;
    }, {});
    this.state = { ...this.defaultState };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.handleSubmit(this.state, this.clearForm);
  }

  private clearForm = () => {
    this.setState(this.defaultState);
  }

  public render(): JSX.Element {
    const { children, label, className, fields } = this.props;
    return (
      <form className={`form__container ${className}`} onSubmit={this.handleSubmit}>
        <h4>{label}</h4>
        {fields.map(f => (
          <Input
            key={f}
            label={f}
            name={f}
            onChange={this.handleChange}
            value={this.state[f]}
          />
        ))}
        {children}
      </form>
    );
  }
}

export default Form;
