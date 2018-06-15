import * as React from 'react';

export interface IOption { value: any; label: string; }
interface IProps {
  className?: string;
  default?: string;
  onChange?: (value: any) => void;
  options: IOption[];
  value?: any;
}
interface IState { value: string; }

export class Select extends React.Component<IProps, IState> {
  private handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    this.props.onChange && this.props.onChange(value);
  }

  public render(): JSX.Element {
    const { className, options, value } = this.props;
    const containerClass = `select__container ${className}`;
    return (
      <div className={containerClass} >
        <select
          className="select__select"
          value={value}
          onChange={this.handleChange}
        >
          <option value="" />
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }
}

export default Select;
