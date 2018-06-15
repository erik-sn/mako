import * as React from 'react';

interface IProps { partial?: boolean; }

export const Divider = ({ partial }: IProps) => (
  <div className={`divider__container ${partial ? 'divider__partial' : ''}`}>
    <hr />
  </div>
);

export default Divider;
