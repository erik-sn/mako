import * as React from 'react';

interface IProps {
  label: string;
  value: string;
  name?: string;
  onChange: (e: React.FormEvent<any>) => void;
  ref?: any;
  style?: {};
  text?: boolean;
}

const Input = ({ label, value, onChange, name, ref, style, text }: IProps) => {
  const inputProps = { id: `${name}__${label}`, name, onChange, ref, value, style };
  return (
    <div className="input__container">
      <label htmlFor={`${name}__${label}`}>
        <h5>{label}:</h5>
        {text
          ? <textarea {...inputProps} />
          : <input {...inputProps} />
        }
      </label>
    </div>
  );
};

export default Input;
