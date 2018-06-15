import * as React from 'react';

interface IProps { title: string; subtitle?: string; }

export const Header = ({ title, subtitle }: IProps) => (
  <div className="header__container">
    <h3>{title}</h3>
    {subtitle ? <p>{subtitle}</p> : null}
  </div>
);

export default Header;
