import * as React from 'react';
import { connect } from 'react-redux';

import { clearHeaderText, setHeaderText } from '../../actions/display';
import Classifiers from './Classifiers';

interface IProps {
  clearHeaderText: () => void;
  setHeaderText: (title: string) => void;
}

export class Train extends React.Component<IProps, {}> {
  public state = {
    value: '',
  };

  public componentDidMount() {
    this.props.setHeaderText('Train classifiers');
  }

  public componentWillUnmount() {
    this.props.clearHeaderText();
  }

  public render(): JSX.Element {
    return (
      <div className="train__container">
        <Classifiers />
      </div>
    );
  }
}

export default connect<IProps, {}, {}>(null, { clearHeaderText, setHeaderText })(Train);
